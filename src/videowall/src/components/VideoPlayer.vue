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
    @play="() => emits('start')"
    @ended="() => emits('stop')"
    @error="() => emits('error')"
    :src="src"
  />
</template>
