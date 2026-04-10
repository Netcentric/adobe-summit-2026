import { computed, ref } from 'vue';
import type { Driver, DriverRaw } from './types.ts';
import useConfig from './useConfig.ts';

const { config } = useConfig();

const timezone = 'UTC';

type Filter = [Temporal.TimeUnit, number];

const filterSetup: Record<'created' | 'played', Filter>[] = [
  { created: ['hour', 1], played: ['minute', 5] },
  { created: ['hour', 4], played: ['minute', 10] },
  { created: ['hour', 24], played: ['minute', 30] },
];

const getNextSlides = (drivers: Driver[]): [Driver[], Driver[]] => {
  // @ts-ignore
  const sorted: Driver[] = drivers.toSorted((a, b) => {
    if (a.created !== b.created) {
      return a.created + b.created;
    }

    return a.count - b.count;
  });

  const now = Temporal.Now.plainDateTimeISO(timezone);

  let next: Driver[] = [];
  let filterIndex = 0;

  while (next.length === 0 && filterIndex < filterSetup.length) {
    const { created, played } = filterSetup[filterIndex] as Record<
      'created' | 'played',
      Filter
    >;

    next = sorted
      .filter(({ tCreated }) => {
        // find by x hours old
        const [totalOf, value] = created;
        return now.since(tCreated).total(totalOf) <= value;
      })
      .filter(({ tPlayed }) => {
        // last played larger than x minutes
        if (!tPlayed) {
          return true;
        }
        const [totalOf, value] = played;
        return now.since(tPlayed).total(totalOf) > value;
      });

    filterIndex++;
  }

  console.log(filterIndex, next);
  return [next, sorted];
};

// constant values
const token = localStorage.getItem('token');
const apiKey = config.value.apiKey;
const url = config.value.apiUrl;

// utility
const toPlainDateTime = (timestamp: number) =>
  Temporal.Instant.fromEpochMilliseconds(timestamp)
    .toZonedDateTimeISO(timezone)
    .toPlainDateTime();

const createDriver = (raw: DriverRaw, timeIn: number): Driver => {
  return {
    ...raw,
    circuit: raw.context?.promptParameters.circuitName,
    era: raw.context?.promptParameters.eraYears,
    played: timeIn || Date.now(),
    tPlayed: null,
    count: 0,
    tCreated: toPlainDateTime(raw.created),
  };
};

const notIn = (group: Driver[]) => (driver: Driver) =>
  !group.map(({ session }) => session).includes(driver.session);

// global refs as cache
// -- all drivers
const drivers = ref<Driver[]>([]);
// -- incoming updates
const driversIncoming = ref<Driver[]>([]);
// -- status
const isLoading = ref(false);
const statusMessage = ref('');

export default function useDrivers() {
  const searchParams = new URLSearchParams(location.search);
  const startTime = searchParams.get('starttime')
    ? Number.parseInt(searchParams.get('starttime') || '', 10)
    : Date.now();

  console.log(startTime);
  // data & cache
  const loadDrivers = async () => {
    if (isLoading.value === true) {
      return;
    }

    isLoading.value = true;

    // await fetch drivers
    try {
      if (!token) {
        throw new Error('Missing credentials: authorization token required');
      }

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: token,
          'x-api-key': apiKey,
        },
      });

      const data: DriverRaw[] = await res.json();

      // -- update caches
      const driverUids = [...drivers.value, ...driversIncoming.value].map(
        ({ session }) => session
      );

      const update = data
        .filter(({ session }) => !driverUids.includes(session))
        .map((raw: DriverRaw) => createDriver(raw, startTime))
        .filter(({ created }) =>
          Number.isNaN(startTime) ? true : created > startTime
        );

      driversIncoming.value = [...driversIncoming.value, ...update];
      drivers.value = drivers.value.length
        ? [...drivers.value, ...update]
        : [...data.map((raw: DriverRaw) => createDriver(raw, startTime))];
    } catch (error) {
      console.error('Error loading drivers', error);
      statusMessage.value = 'Error loading drivers';
    } finally {
      isLoading.value = false;
    }
  };

  const updateDrivers = (driver: Driver) => {
    const updateDriver = {
      ...(driver as Driver),
      played: Date.now(),
      tPlayed: Temporal.Now.plainDateTimeISO(timezone),
      count: (driver.count || 0) + 1,
    };

    // remove from incoming (TODO revise for possible race condition
    driversIncoming.value = [
      ...driversIncoming.value.filter(
        ({ session }) => session !== updateDriver.session
      ),
    ];

    // update data
    drivers.value = [
      ...drivers.value.filter(
        ({ session }) => session !== updateDriver.session
      ),
      updateDriver,
    ];
  };

  // drivers queue
  const driversQueue = computed(() => {
    // @ts-ignore -- as toSorted is widely available
    const incoming = driversIncoming.value.toSorted((a, b) =>
      a.created > b.created ? -1 : 1
    );

    const [next, sorted] = getNextSlides(drivers.value.filter(notIn(incoming)));

    return [...incoming, ...next, ...sorted.filter(notIn(next))];
  });

  const driversPrevious = computed<(Driver | null)[]>(() => {
    const prev = drivers.value
      .filter(({ count }) => count > 0)
      .sort((a, b) => ((a.played || 0) > (b.played || 0) ? 1 : -1))
      .slice(-2);

    if (prev.length === 0) {
      return [null, null];
    }
    if (prev.length === 1) {
      return [null, ...prev];
    }
    return prev;
  });

  const hasData = computed(() => driversQueue.value.length > 0);

  const driversCurrent = ref<Driver | null>(null);

  const getSlides = (slides: (Driver | null)[]) => {
    const currentSlideUids = slides.map((item) => item?.session || null);
    const currentSlideUid = currentSlideUids[2];

    const nextSlidesCache = slides
      .slice(2)
      .filter((item) => !!item)
      .filter((item) => item?.session !== currentSlideUid);

    const nextSlidesUpdate =
      slides.length === 0
        ? driversQueue.value.slice(0, 4)
        : driversQueue.value
            .filter(({ session }) => !currentSlideUids.includes(session))
            .slice(0, 1);

    const nextSlides = [
      ...(driversPrevious.value || []),
      ...nextSlidesCache,
      ...nextSlidesUpdate,
    ];

    driversCurrent.value = nextSlides[2];

    return nextSlides;
  };

  return {
    drivers,
    driversIncoming,
    driversCurrent,
    driversQueue,
    driversPrevious,
    loadDrivers,
    updateDrivers,
    getSlides,
    isLoading,
    hasData,
    statusMessage,
  };
}
