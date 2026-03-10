<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import config from './config.ts';
import { faker } from '@faker-js/faker';
import VideoPlayer from './components/VideoPlayer.vue';
import DriverList from './components/DriverList.vue';

interface DriverRaw {
  image: string;
  video: string;
  statusUrl: string;
  context: {
    promptParameters: {
      eraTitle: string;
      eraYears: string;
      eraDetail: string;
      circuitName: string;
      circuitLocation: string;
    };
  };
}

export interface Driver extends DriverRaw {
  uid: string;
  era: string;
  circuit: string;
  fetched: number; // timestamp
  played: number | null; // timestamp
  count: number;
}

const drivers = ref<Driver[]>([]);
// proxy for simulating mapping driver
const createDriver = (raw: DriverRaw): Driver => ({
  ...raw,
  uid: raw.statusUrl.split('/').slice(-1)[0] || 'noop',
  circuit: raw.context?.promptParameters.circuitName,
  era: raw.context?.promptParameters.eraYears,
  fetched: Date.now(),
  played: null,
  count: 0,
});

// drivers queue
const driversQueue = computed(() => [
  ...drivers.value
    .filter(({ count }) => count === 0)
    .sort((a, b) => (a.fetched > b.fetched ? 1 : -1)),
  ...drivers.value
    .filter(({ count }) => count > 0)
    .sort((a, b) => ((a.played || 0) > (b.played || 0) ? 1 : -1)),
]);

// next drivers
const driversNext = computed<Driver[]>(() => driversQueue.value.slice(0, 4));

// previous drivers
const driversPrevious = computed<Driver[]>(() =>
  drivers.value
    .filter(({ count }) => count > 0)
    .sort((a, b) => ((a.played || 0) > (b.played || 0) ? 1 : -1))
    .slice(-2)
);

// player driver
const driversCurrent = computed<Driver | null>(
  () => (drivers.value.length > 3 && driversQueue.value[0]) || null
);

// start / stop
const onStart = () => {
  // console.log('start');
};
const onStop = () => {
  console.log('stop');
  const updateDriver = {
    ...(driversCurrent.value as Driver),
    played: Date.now(),
    count: (driversCurrent.value?.count || 0) + 1,
  };

  // update data
  drivers.value = [
    ...drivers.value.filter(({ uid }) => uid !== updateDriver.uid),
    updateDriver,
  ];
};

// data polling
let timeout: undefined | number;
const updateDrivers = async () => {
  try {
    // await fetch drivers
    // TODO
    const token = localStorage.getItem('token');
    const apiKey = 'x1fG7UmmyT4qL1NePJy4C31awLTi64R83mu7J7pt';
    const url = 'https://api.netcentric.biz/photobooth/latest';

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

    // console.log('updateDrivers', drivers.value);
  } catch (error) {
    console.error('Drivers not found', error);
  }
};

onMounted(async () => {
  await updateDrivers();

  timeout = setTimeout(() => updateDrivers(), config.POLL_INTERVAL_MS);
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
  <DriverList
    :key="driversCurrent?.uid"
    :queue="driversQueue"
    :next="driversNext"
    :previous="driversPrevious"
    :current="driversCurrent"
    @start="onStart"
    @stop="onStop"
  />
  <!--  <VideoPlayer-->
  <!--    :driver="driversCurrent"-->
  <!--    @start="onStart"-->
  <!--    @stop="onStop"-->
  <!--  />-->
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

<style scoped></style>
