<script setup lang="ts">
import useDrivers from '../useDrivers.ts';
import { ref } from 'vue';
import DebugItem from './DebugItem.vue';

const {
  loadDrivers,
  updateDrivers,
  isLoading,
  driversCurrent,
  driversIncoming,
  driversQueue,
  drivers,
  getSlides,
} = useDrivers();

const slides = ref<any[]>([]);
const handleGetSlides = () => {
  slides.value = getSlides(slides.value);
  // updateSlides();
};

defineProps<{ debug: string }>();
</script>

<template>
  <div class="debug">
    <p>{{ debug }}</p>
    <div
      class="controls"
      v-if="debug === '1'"
    >
      <button
        @click="loadDrivers"
        :disabled="isLoading"
      >
        load drivers
      </button>
      <button
        @click="() => updateDrivers(slides[2])"
        :disabled="!driversCurrent"
      >
        update drivers
      </button>
      <button @click="handleGetSlides">get slides</button>
    </div>

    <DebugItem
      v-if="debug === '1'"
      title="current"
      :list="[driversCurrent]"
    />
    <DebugItem
      v-if="debug === '1'"
      title="slides"
      :list="slides"
    />
    <DebugItem
      title="queue"
      :list="driversQueue"
    />
    <DebugItem
      title="incoming"
      :list="driversIncoming"
    />
    <DebugItem
      title="drivers"
      :list="drivers"
    />
  </div>
</template>

<style scoped>
.debug {
  position: relative;
  background-color: white;
  padding: 1rem;
  width: 100%;
  z-index: 1000;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}
.controls {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-basis: 10%;
}
</style>
