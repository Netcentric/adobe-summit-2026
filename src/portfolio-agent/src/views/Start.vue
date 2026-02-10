<script setup lang="ts">
import Input from '../components/Input.vue';
import TagList from '../components/TagList.vue';
</script>

<template>
  <div class="background">
    <video
      class="background__video"
      autoplay
      muted
      playsinline
      loop
      preload="auto"
    >
      <source
        src="https://main--adobe-summit-2026--netcentric.aem.live/portfolio-agent/media_1ec4c66304eb839b9d26d17b0c8906496a9bfeeb2.mp4"
        type="video/mp4"
      />
    </video>
  </div>
  <main class="layout">
    <h1 class="h-jumbo">Discover our customer success stories</h1>
    <h2 class="h1">What are you interested in?</h2>

    <div class="actions">
      <Input />
      <TagList />
    </div>

    <RouterLink
      class="link"
      to="/overview"
      >Browse all cases</RouterLink
    >
  </main>
</template>

<style scoped>
.background {
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  transform: translate(-50%, -50%);
  z-index: 0;
}
.background__video {
  position: absolute;
  inset: 0;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  object-fit: cover;
  object-position: center;
  pointer-events: none;
}
main {
  z-index: 10;
  position: relative;
}

.actions {
  width: 100%;
  max-width: 918px;
  display: flex;
  flex-direction: column;
  gap: 84px;
}
</style>
