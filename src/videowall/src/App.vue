<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import config from './config.ts';
import DriverList from './components/DriverList.vue';
import DriversDebug from './components/DriversDebug.vue';
import type { Driver, DriverRaw } from './types.ts';
import LoadingIndicator from './components/LoadingIndicator.vue';
import CognizantLogo from '../../common/CognizantLogo.vue';
import useDrivers from './useDrivers.ts';

const debug = computed(() => location.search.includes('debug'));

const { isLoading, loadDrivers, statusMessage, hasData, driversCurrent } =
  useDrivers();

// data polling
let timeout: undefined | number;
onMounted(async () => {
  await loadDrivers();
});
timeout = setInterval(async () => {
  console.log('polling');
  await loadDrivers();
}, config.POLL_INTERVAL);

onUnmounted(() => {
  console.log('unmounted');
  clearInterval(timeout);
});

// // TODO remove polling limit
// watch(drivers, (curr) => {
//   console.log('drivers changed');
//   if (curr.length > 7) {
//     clearTimeout(timeout);
//   }
// });
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
    v-if="isLoading && !hasData"
    :message="statusMessage"
  />
  <DriverList v-else />
  <pre>{{ driversCurrent }}</pre>
  <DriversDebug v-if="debug" />
</template>
