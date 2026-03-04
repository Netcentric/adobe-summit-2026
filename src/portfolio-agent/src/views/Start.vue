<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue';
import QuickAnswerList from '../components/QuickAnswerList.vue';
import usePortfolio from '../usePortfolio.ts';

const { industryOptions } = usePortfolio();

// const placeholder = computed(() =>
//   searchSuggestions.value?.map((item) => item.suggestion)
// );
</script>

<template>
  <AppHeader/>
  <div class="start__background">
    <!-- <video
      class="background__video"
      autoplay
      muted
      playsinline
      loop
      preload="auto"
    >
      <source
        src="https://main--adobe-summit-2026--netcentric.aem.live/portfolio-agent/config/media_1ec4c66304eb839b9d26d17b0c8906496a9bfeeb2.mp4"
        type="video/mp4"
      />
    </video> -->
  </div>
  <main class="start__layout">
    <h1 class="h-jumbo">Discover our customer success stories</h1>
    <h2 class="h1">What are you interested in?</h2>

    <div class="actions">
      <!--      <Input :placeholder="placeholder" />-->
      <QuickAnswerList
        :tags="
          industryOptions.map((item: string) => ({
            label: item,
            filter: item,
          }))
        "
      />
    </div>

    <RouterLink
      class="link"
      to="/overview"
      >Browse all cases</RouterLink
    >
  </main>
</template>

<style lang="scss">
@property --background-rotation {
  syntax: '<angle>';
  initial-value: 120deg;
  inherits: false;
}
@keyframes startBackgroundRotation {
  0% {
    --background-rotation: 120deg;
  }

  50% {
    --background-rotation: 240deg;
  }

  100% {
    --background-rotation: 120deg;
  }
}

.start__background {
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  transform: translate(-50%, -50%);
  z-index: 0;
  background: linear-gradient(var(--background-rotation, 225deg), #35CACF 0.54%, #3D54CE 35.45%, #000 100%), #000048;
  animation: startBackgroundRotation 12s linear infinite;
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
