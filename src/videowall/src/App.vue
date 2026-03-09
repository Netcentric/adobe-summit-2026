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
  fetched: number;
  played: number[];
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
  played: [],
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

// drivers not played
const driversQueue = computed(() => [
  ...drivers.value
    .filter(({ played }) => played.length === 0)
    .sort((a, b) => (a.fetched > b.fetched ? 1 : -1)),
  ...drivers.value
    .filter(({ played }) => played.length > 0)
    .sort((a, b) => ((a.played[0] || 0) > (b.played[0] || 0) ? 1 : -1)),
]);

// next drivers
const driversNext = computed<Driver[]>(() => driversQueue.value.slice(0, 3));

// next drivers
const driversPrevious = ref<Driver[]>([]);

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
    played: [Date.now(), ...driver.played],
  };

  // register previous (TODO consider computed based played time sorting
  driversPrevious.value = [
    ...driversPrevious.value.slice(1, driversPrevious.value.length - 1),
    updateDriver,
  ];
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
  <pre style="white-space: pre">{{
    JSON.stringify(
      driversNext.map(({ uid, name, fetched, played }) => ({
        uid,
        name,
        fetched,
        played,
      })),
      null,
      4
    )
  }}</pre>

  previous drivers
  <pre style="white-space: pre">{{
    JSON.stringify(
      driversPrevious.map(({ uid, name, fetched }) => ({ uid, name, fetched })),
      null,
      4
    )
  }}</pre>

  drivers queue
  <pre style="white-space: pre">{{
    JSON.stringify(
      drivers.map(({ uid, name, fetched, played }) => ({
        uid,
        name,
        fetched,
        played,
      })),
      null,
      4
    )
  }}</pre>
  all
  <pre style="white-space: pre">{{ JSON.stringify(drivers, null, 4) }}</pre>
</template>

<style scoped></style>
