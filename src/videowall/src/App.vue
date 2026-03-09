<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import config from './config.ts';

interface Driver {
  name: string;
  url: string;
  uid: string;
}

const drivers = ref<Driver[]>([]);

const updateDrivers = () => {
  try {
    // await fetch drivers
    // ....

    drivers.value = [
      {
        name: 'nonalia',
        url: 'https://video.com',
        uid: '1',
      },
    ];
    console.log('updateDrivers', drivers.value);
  } catch {
    console.error('Drivers not found');
  }
};

let interval: undefined | number;

onMounted(() => {
  interval = setInterval(() => updateDrivers(), config.POLL_INTERVAL_MS);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <pre>{{ JSON.stringify(drivers) }}</pre>
</template>

<style scoped></style>
