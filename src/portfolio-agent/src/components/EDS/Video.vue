<script setup lang="ts">
const props = defineProps(['node']);

const posterSrc = props.node?.querySelector(':scope > div > div > picture > img')?.getAttribute('src');
const videoSrc = props.node?.querySelector(':scope > div > div > a')?.getAttribute('href');
</script>

<template>
  <div class="block video">
    <video class="video__player" :poster="posterSrc" controls>
      <source :src="videoSrc" type="video/mp4">
    </video>
  </div>
</template>

<style lang="scss">
.video {
  &__player {
    width: 100%;
    height: auto;
  }
}
</style>