<script setup lang="ts"></script>

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
  <main>
    <h2>Start</h2>
    <hr />
    <Button />
    <RouterLink to="/overview">Browse all cases</RouterLink>
  </main>
</template>

<style scoped>
.background {
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
}
.background__video {
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translate(-50%, -50%);
  object-fit: cover;
  object-position: center;
  pointer-events: none;
  z-index: 0;
}
main {
  z-index: 10;
  position: relative;
}
</style>
