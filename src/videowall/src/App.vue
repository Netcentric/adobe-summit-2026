<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import config from './config.ts';
import DriverList from './components/DriverList.vue';
import DriversDebug from './components/DriversDebug.vue';
import LoadingIndicator from './components/LoadingIndicator.vue';
import useDrivers from './useDrivers.ts';
import Background from './components/Background.vue';

const searchParams = new URLSearchParams(location.search);

const debug = computed(() => searchParams.get('debug'));

const { isLoading, loadDrivers, statusMessage, hasData } = useDrivers();

// data polling
let timeout: undefined | number;
onMounted(async () => {
  await loadDrivers();

  timeout = setInterval(async () => {
    await loadDrivers();
  }, config.POLL_INTERVAL);
});

onUnmounted(() => {
  clearInterval(timeout);
});
</script>

<template>
  <Background />
  <LoadingIndicator
    v-if="isLoading && !hasData"
    :message="statusMessage"
  />
  <DriverList v-else-if="!debug || debug !== '1'" />
  <DriversDebug
    :debug="debug"
    v-if="debug"
  />
</template>
