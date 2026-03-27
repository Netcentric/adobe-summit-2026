<script setup lang="ts">
import { onBeforeUnmount, onUnmounted, ref, watch } from 'vue';

const props = defineProps<{
  src: string;
  shouldPlay: boolean;
}>();

const emits = defineEmits(['start', 'stop', 'error']);

const videoRef = ref<HTMLVideoElement | null>(null);

watch(
  () => props.shouldPlay,
  (shouldPlay) => {
    if (shouldPlay) {
      videoRef.value?.play()?.catch(() => {
        emits('stop');
      });
    }
  }
);

const resetVideo = () => {
  (videoRef.value as HTMLVideoElement).currentTime = 0;
  videoRef.value?.pause();
};

const handleVideoEnded = () => {
  resetVideo();
  emits('stop');
};

onBeforeUnmount(() => {
  if (videoRef.value) {
    videoRef.value.setAttribute('src', '');
    videoRef.value.load();
  }
});

onUnmounted(() => {
  if (videoRef.value) {
    videoRef.value.remove();
    videoRef.value = null;
  }
});
</script>

<template>
  <video
    ref="videoRef"
    muted
    @load="resetVideo"
    @play="() => emits('start')"
    @ended="handleVideoEnded"
    @error="() => emits('error')"
    :src="src"
  />
</template>
