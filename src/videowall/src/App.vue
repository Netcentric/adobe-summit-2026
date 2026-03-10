<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import config from './config.ts';
import { faker } from '@faker-js/faker';
import VideoPlayer from './components/VideoPlayer.vue';

interface DriverRaw {
  image: string;
  video: string;
  uid: string;
  name: string;
  course: string;
  year: number;
}

export interface Driver extends DriverRaw {
  fetched: number; // timestamp
  played: number | null; // timestamp
  count: number;
}

const drivers = ref<Driver[]>([]);
// proxy for simulating mapping driver
const createDriver = (): Driver => ({
  uid: faker.string.uuid(),
  image: 'string',
  video: 'string',
  name: faker.person.fullName(),
  course: faker.location.city(),
  year: faker.number.int({ min: 1910, max: 2060 }),
  fetched: Date.now(),
  played: null,
  count: 0,
});

const updateDrivers = () => {
  try {
    // await fetch drivers
    // ....

    drivers.value = [...drivers.value, createDriver()];

    // console.log('updateDrivers', drivers.value);
  } catch {
    console.error('Drivers not found');
  }
};

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
const driversNext = computed<Driver[]>(() => driversQueue.value.slice(0, 3));

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
  console.log('start');
};
const onStop = (driver: Driver) => {
  console.log('stop', driver);

  const updateDriver = {
    ...driver,
    played: Date.now(),
    count: driver.count + 1,
  };

  // update data
  drivers.value = [
    ...drivers.value.filter(({ uid }) => uid !== updateDriver.uid),
    updateDriver,
  ];
};

// polling interval
let interval: undefined | number;
onMounted(() => {
  interval = setInterval(() => updateDrivers(), config.POLL_INTERVAL_MS);
});

onUnmounted(() => {
  clearInterval(interval);
});

// TODO remove polling limit
watch(drivers, (curr) => {
  if (curr.length > 5) {
    clearInterval(interval);
  }
});
</script>

<template>
  <VideoPlayer
    :driver="driversCurrent"
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

<style scoped></style>
