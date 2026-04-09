<script setup lang="ts">
import type { Driver } from '../types.ts';

defineProps<{ list: (Driver | null)[]; title?: string }>();
</script>

<template>
  <ul>
    <li>{{ title }} ({{ list.length }})</li>
    <li
      v-for="(driver, index) in list"
      :key="`driver-${driver?.session}-${index}`"
    >
      <span class="image"
        ><img
          :src="driver?.image"
          alt=""
      /></span>
      <span class="index">{{ index }}</span>
      <span>
        <!--        <pre>{{ driver }}</pre>-->
        <span>{{ driver?.session }}</span>
        <span>{{ driver?.count }} / {{ driver?.played }}</span>
        <span>{{ driver?.created }}</span>
      </span>
    </li>
  </ul>
</template>

<style scoped>
ul {
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
  position: relative;

  span.index {
    position: absolute;
    top: 0;
    left: 0;
    background-color: black;
    color: white;
    font-size: 6px;
    padding: 2px;
  }

  > span {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    font-size: 0.8em;
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
