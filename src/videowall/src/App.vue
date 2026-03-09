<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import config from './config.ts';
import { faker } from '@faker-js/faker';

interface DriverRaw {
  image: string;
  video: string;
  uid: string;
  name: string;
  course: string;
  year: number;
}

interface Driver {
  image: string;
  video: string;
  uid: string;
  name: string;
  course: string;
  year: number;
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

    console.log('updateDrivers', drivers.value);
  } catch {
    console.error('Drivers not found');
  }
};

// polling interval
let interval: undefined | number;
onMounted(() => {
  interval = setInterval(() => updateDrivers(), config.POLL_INTERVAL_MS);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <pre style="white-space: pre">{{ JSON.stringify(drivers, null, 4) }}</pre>
</template>

<style scoped></style>
