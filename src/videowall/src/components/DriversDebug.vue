<script setup lang="ts">
import useDrivers from '../useDrivers.ts';
import { ref } from 'vue';

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

    <ul v-if="debug === '1'">
      <li>current</li>
      <template v-for="driver in [driversCurrent]">
        <li>
          <span class="image"
            ><img
              :src="driver?.image"
              alt=""
          /></span>
          <span>
            <span>{{ driver?.session }}</span>
            <span>{{ driver?.created }}</span>
          </span>
        </li>
      </template>
    </ul>

    <ul v-if="debug === '1'">
      <li>slides // {{ slides?.length }}</li>
      <template v-for="driver in slides">
        <li>
          <span class="image"
            ><img
              :src="driver?.image"
              alt=""
          /></span>
          <span>
            <span>{{ driver?.session }}</span>
            <span>{{ driver?.created }}</span>
          </span>
        </li>
      </template>
    </ul>

    <ul>
      <li>queue // {{ driversQueue.length }}</li>
      <template v-for="driver in driversQueue">
        <li>
          <span class="image"
            ><img
              :src="driver.image"
              alt=""
          /></span>
          <span>
            <span>{{ driver?.session }}</span>
            <span>{{ driver?.created }}</span>
          </span>
        </li>
      </template>
    </ul>

    <ul>
      <li>incoming // {{ driversIncoming.length }}</li>
      <template v-for="driver in driversIncoming">
        <li>
          <span class="image"
            ><img
              :src="driver.image"
              alt=""
          /></span>
          <span>
            <span>{{ driver?.session }}</span>
            <span>{{ driver?.created }}</span>
          </span>
        </li>
      </template>
    </ul>

    <ul>
      <li>drivers // {{ drivers.length }}</li>
      <template v-for="driver in drivers">
        <li>
          <span class="image"
            ><img
              :src="driver.image"
              alt=""
          /></span>
          <span>
            <span>{{ driver?.session }}</span>
            <span>{{ driver?.created }}</span>
          </span>
        </li>
      </template>
    </ul>
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
ul,
.controls {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-basis: 10%;
}

li {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  font-size: 14px;

  > span {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;

    > span:last-child {
      font-size: 0.8em;
    }
  }
}

.image {
  aspect-ratio: 1/1;
  width: 60px;
  overflow: hidden;

  img {
    max-width: 100%;
    object-fit: cover;
    aspect-ratio: 1/1;
  }
}
</style>
