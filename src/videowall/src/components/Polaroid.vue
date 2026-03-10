<script setup lang="ts">
defineProps<{
  caption: string[];
  image: string;
  alt: string;
}>();
</script>

<template>
  <div class="polaroid">
    <div class="polaroid__image">
      <img
        :src="image"
        :alt="alt || 'image'"
      />
    </div>
    <div class="polaroid__caption">
      <div v-for="item in caption">{{ item }}</div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');

.polaroid {
  min-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  aspect-ratio: 3.5 / 4.35;
  background-color: white;
  justify-content: space-between;
}

.polaroid__image {
  aspect-ratio: 1 / 1;
  width: 100%;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.polaroid__caption {
  font-family: 'Permanent Marker', cursive;
  font-weight: 400;
  font-style: normal;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  color: #222;
}
</style>
