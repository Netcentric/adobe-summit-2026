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
  circuit: raw.context?.promptParameters.circuitName,
  era: raw.context?.promptParameters.eraYears,
  played: null,
  count: 0,
});

// global refs as cache
// -- all drivers
const drivers = ref<Driver[]>([]);
// -- incoming updates
const driversIncoming = ref<Driver[]>([]);

export default function useDrivers() {
  const isLoading = ref(false);
  const statusMessage = ref('');

  //  data handling
  const driverUids = computed(() =>
    [...drivers.value, ...driversIncoming.value].map(({ session }) => session)
  );

  const loadDrivers = async () => {
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
      const update = data
        .filter(({ session }) => !driverUids.value.includes(session))
        .slice(0, 2) // TODO remove simulation
        .map((raw: DriverRaw) => createDriver(raw));

      driversIncoming.value = [...driversIncoming.value, ...update];

      console.log(data, driversIncoming.value, drivers.value);

      isLoading.value = false;
      // console.log('updateDrivers', drivers.value);
    } catch (error) {
      console.error('Error loading drivers', error);
      statusMessage.value = 'Error loading drivers';
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
    ...driversIncoming.value.sort((a, b) => (a.created > b.created ? 1 : -1)),
    // TODO revise if filtering is still necessary as incoming cache should cover this scenario
    ...drivers.value
      .filter(({ count }) => count === 0)
      .sort((a, b) => (a.created > b.created ? 1 : -1)),
    ...drivers.value
      .filter(({ count }) => count > 0)
      .sort((a, b) => ((a.played || 0) > (b.played || 0) ? 1 : -1)),
  ]);

  const driversCurrent = computed<Driver | null>(
    () => driversQueue.value[0] || null
  );

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

  return {
    drivers,
    driversIncoming,
    driversCurrent,
    driversQueue,
    driversNext,
    driversPrevious,
    loadDrivers,
    updateDrivers,
    isLoading,
  };
}
