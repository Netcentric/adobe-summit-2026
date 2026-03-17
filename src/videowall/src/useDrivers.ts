import { computed, ref } from 'vue';
import type { Driver, DriverRaw } from './types.ts';
import config from './config.ts';

// constant values
const token = localStorage.getItem('token');
const apiKey = config.API_KEY;
const url = config.API_URL;

// utility
const createDriver = (raw: DriverRaw): Driver => ({
  ...raw,
  created: raw.created || Date.now(),
  circuit: raw.context?.promptParameters.circuitName,
  era: raw.context?.promptParameters.eraYears,
  played: raw.created < 1773744859156 ? Date.now() : null,
  count: raw.created < 1773744859156 ? 1 : 0,
});

// global refs as cache
// -- all drivers
const drivers = ref<Driver[]>([]);
// -- incoming updates
const driversIncoming = ref<Driver[]>([]);
// -- status
const isLoading = ref(false);
const statusMessage = ref('');

export default function useDrivers() {
  //  data handling
  // const driverUids = computed(() =>
  //   [...drivers.value, ...driversIncoming.value].map(({ session }) => session)
  // );

  // watch(driverUids, (curr) => {
  //   console.log(curr);
  // });

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
        // .slice(0, 10) // TODO remove simulation
        .map((raw: DriverRaw) => createDriver(raw));
      driversIncoming.value = [
        ...driversIncoming.value,
        ...update.filter(({ count }) => count === 0),
      ];
      drivers.value = [
        ...drivers.value,
        ...update.filter(({ count }) => count > 0),
      ];

      // updateSlides();

      // console.log('updateDrivers', drivers.value);
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
  const driversQueue = computed(() => [
    // @ts-ignore -- as is widely available
    ...driversIncoming.value.toSorted((a, b) =>
      a.created > b.created ? 1 : -1
    ),
    // TODO revise if filtering is still necessary as incoming cache should cover this scenario
    ...drivers.value
      .filter(({ count }) => count === 0)
      .sort((a, b) => (a.created > b.created ? 1 : -1)),
    ...drivers.value
      .filter(({ count }) => count > 0)
      .sort((a, b) => ((a.played || 0) > (b.played || 0) ? 1 : -1)),
  ]);

  // const driversCurrent = computed<Driver | null>(() => slides.value[2] || null);

  const driversNext = computed<Driver[]>(() => driversQueue.value.slice(0, 4));

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
    console.log(currentSlideUids, currentSlideUid);

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
    console.log(nextSlides);

    return nextSlides;
  };

  return {
    drivers,
    driversIncoming,
    driversCurrent,
    driversQueue,
    driversNext,
    driversPrevious,
    loadDrivers,
    updateDrivers,
    getSlides,
    isLoading,
    hasData,
  };
}
