<script setup lang="ts">
import type { Driver } from '../App.vue';

const props = defineProps<{
  next: Driver[];
  previous: Driver[];
  current: Driver | null;
}>();

console.log(props);
</script>

<template>
  <div class="driver-list">
    <ul class="driver-list__tray">
      <li
        v-for="driver in previous"
        class="is-previous"
      >
        <img
          :src="driver.image"
          :alt="driver.uid"
        />
        <div>
          {{ driver.name }}
        </div>
      </li>
      <li
        v-for="driver in next"
        :class="{
          'is-current': driver.uid === current?.uid,
        }"
      >
        <img
          :src="driver.image"
          :alt="driver.uid"
        />
        <div>
          {{ driver.name }}
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.driver-list__tray {
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 2rem;
  display: flex;

  li {
    border: solid 1px white;
    padding: 2rem;
    aspect-ratio: 1 / 1.4;
    width: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transform: scale(0.7);
    transition: transform 0.2s;

    &.is-current {
      background-color: #444;
      transform: scale(1);
    }

    &.is-previous {
      color: #444;
    }
  }
}
</style>
