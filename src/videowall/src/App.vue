<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import config from './config.ts';
import DriverList from './components/DriverList.vue';
import type { Driver, DriverRaw } from './types.ts';
import LoadingIndicator from './components/LoadingIndicator.vue';
import CognizantLogo from '../../common/CognizantLogo.vue';

const drivers = ref<Driver[]>([]);
// proxy for simulating mapping driver
const createDriver = (raw: DriverRaw): Driver => ({
  ...raw,
  // TODO revisit -- created should be part of the original data,
  //  compensating for DEV purpose here
  created: raw.created || Date.now(),
  circuit: raw.context?.promptParameters.circuitName,
  era: raw.context?.promptParameters.eraYears,
  played: null,
  count: 0,
});

// drivers queue
const driversQueue = computed(() => [
  ...drivers.value
    .filter(({ count }) => count === 0)
    .sort((a, b) => (a.created > b.created ? 1 : -1)),
  ...drivers.value
    .filter(({ count }) => count > 0)
    .sort((a, b) => ((a.played || 0) > (b.played || 0) ? 1 : -1)),
]);

// next drivers
const driversNext = computed<Driver[]>(() => driversQueue.value.slice(0, 4));

// previous drivers
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

// player driver
const driversCurrent = computed<Driver | null>(
  () => (drivers.value.length > 3 && driversQueue.value[0]) || null
);

// start / stop
const onStart = () => {
  console.log('start');
};
const onStop = () => {
  const updateDriver = {
    ...(driversCurrent.value as Driver),
    played: Date.now(),
    count: (driversCurrent.value?.count || 0) + 1,
  };

  // update data
  drivers.value = [
    ...drivers.value.filter(({ session }) => session !== updateDriver.session),
    updateDriver,
  ];
};

// data loading
const isLoading = ref(true);
const statusMessage = ref('Loading');
const loadDrivers = async () => {
  try {
    isLoading.value = true;
    // await fetch drivers
    // TODO
    const token = localStorage.getItem('token');
    const apiKey = config.API_KEY;
    const url = config.API_URL;

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

    const data = await res.json();
    drivers.value = data.map((raw: DriverRaw) => createDriver(raw));

    isLoading.value = false;
    // console.log('updateDrivers', drivers.value);
  } catch (error) {
    console.error('Error loading drivers', error);
    statusMessage.value = 'Error loading drivers';
  }
};

// data polling
let timeout: undefined | number;
onMounted(async () => {
  await loadDrivers();

  timeout = setTimeout(() => loadDrivers(), config.POLL_INTERVAL);
});
onUnmounted(() => {
  clearTimeout(timeout);
});

// TODO remove polling limit
watch(drivers, (curr) => {
  console.log('drivers changed');
  if (curr.length > 7) {
    clearTimeout(timeout);
  }
});
</script>

<template>
  <CognizantLogo class="logo" />
  <video
    class="bg-video"
    autoplay
    muted
    loop
    playsinline
  >
    <source
      src="https://main--adobe-summit-2026--netcentric.aem.live/photo-booth/agent-animation-bg.mp4"
      type="video/mp4"
    />
  </video>
  <LoadingIndicator
    v-if="isLoading"
    :message="statusMessage"
  />
  <DriverList
    v-else
    :key="driversCurrent?.session"
    :next="driversNext"
    :previous="driversPrevious"
    :current="driversCurrent"
    @start="onStart"
    @stop="onStop"
  />

  <pre style="white-space: pre">{{
    JSON.stringify(driversCurrent, null, 4)
  }}</pre>
  next drivers
  <pre style="white-space: pre">{{ JSON.stringify(driversNext, null, 4) }}</pre>

  previous drivers
  <pre style="white-space: pre">{{
    JSON.stringify(driversPrevious, null, 4)
  }}</pre>

  drivers queue
  <pre style="white-space: pre">{{ JSON.stringify(drivers, null, 4) }}</pre>
  all
  <pre style="white-space: pre">{{ JSON.stringify(drivers, null, 4) }}</pre>
</template>
