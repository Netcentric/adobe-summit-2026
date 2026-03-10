<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import config from './config.ts';
import { faker } from '@faker-js/faker';
import VideoPlayer from './components/VideoPlayer.vue';
import DriverList from './components/DriverList.vue';

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

const updateDrivers = async () => {
  try {
    // await fetch drivers
    // TODO
    // const token = localStorage.getItem('token');
    // const apiKey = localStorage.getItem('api-key');
    // // const url = 'https://api.netcentric.biz/photobooth/latest';
    // const url =
    //   'https://qhyzf3q049.execute-api.eu-central-1.amazonaws.com/dev/photobooth/latest';

    // if (!token || !apiKey) {
    //   throw new Error('Missing credentials: token and api-key required');
    // }
    //
    // const res = await fetch(url, {
    //   method: 'GET',
    //   headers: {
    //     Authorization: token,
    //     'x-api-key': apiKey,
    //   },
    // });
    // console.log(await res.json());

    drivers.value = [...drivers.value, createDriver()];

    // console.log('updateDrivers', drivers.value);
  } catch (error) {
    console.error('Drivers not found', error);
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
  if (curr.length > 7) {
    clearInterval(interval);
  }
});
</script>

<template>
  <DriverList
    :next="driversNext"
    :previous="driversPrevious"
    :current="driversCurrent"
  />
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
