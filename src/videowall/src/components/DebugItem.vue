<script setup lang="ts">
import type { Driver } from '../types.ts';

defineProps<{ list: (Driver | null)[]; title?: string }>();
</script>

<template>
  <ul>
    <li>{{ title }} ({{ list.length }})</li>
    <template v-for="driver in list">
      <li>
        <span class="image"
          ><img
            :src="driver?.image"
            alt=""
        /></span>
        <span>
          <span>{{ driver?.session }}</span>
          <span>{{ driver?.count }}</span>
          <span>{{ driver?.created }}</span>
        </span>
      </li>
    </template>
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
