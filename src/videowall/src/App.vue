<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import DriverList from './components/DriverList.vue';
import DriversDebug from './components/DriversDebug.vue';
import LoadingIndicator from './components/LoadingIndicator.vue';
import useDrivers from './useDrivers.ts';
import Background from './components/Background.vue';
import ConfigurationModule from './components/ConfigurationModule.vue';
import useConfig from './useConfig.ts';

const { isLoading, loadDrivers, statusMessage, hasData } = useDrivers();
const { config } = useConfig();

// data polling
let interval: undefined | number;
onMounted(async () => {
  await loadDrivers();

  // interval = setInterval(async () => {
  //   await loadDrivers();
  // }, config.value.pollInterval);
});

watch(
  config,
  (current, previous) => {
    console.log({ current, previous });

    if (current.pollInterval !== previous?.pollInterval) {
      clearInterval(interval);

      interval = setInterval(async () => {
        await loadDrivers();
      }, config.value.pollInterval);
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <ConfigurationModule />
  <Background />
  <LoadingIndicator
    v-if="isLoading && !hasData"
    :message="statusMessage"
  />
  <DriverList v-else-if="!config.debug || config.debug !== 2" />
  <DriversDebug
    :debug="config.debug"
    v-if="config.debug"
  />
</template>
