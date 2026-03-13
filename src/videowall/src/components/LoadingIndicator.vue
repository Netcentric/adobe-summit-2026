<script setup lang="ts"></script>

<template>
  <div class="loading-spinner">
    <div class="loading-spinner__content">Loading</div>
  </div>
</template>

<style scoped>
.loading-spinner {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  pointer-events: none;
  user-select: none;
  position: relative;
  font-size: 3rem;
  opacity: 0.6;
  animation-duration: 2s, 1.8s;
  animation-iteration-count: 1, infinite;
  animation-play-state: running;
  animation-name: appear, idle;
  animation-direction: normal, alternate;
}

@keyframes appear {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
@keyframes idle {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(0.93);
  }
}
</style>
