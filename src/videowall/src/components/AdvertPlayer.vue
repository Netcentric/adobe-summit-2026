<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue';
import VideoPlayer from './VideoPlayer.vue';
import useConfig from '../useConfig.ts';

const props = defineProps<{ src?: string | null }>();
const emits = defineEmits(['stop', 'start']);

const { config } = useConfig();
const mode = ref<
  'idle' | 'fade-in' | 'video-in' | 'video' | 'video-out' | 'fade-out'
>('idle');

const currentVideoUrl = ref<string | null>(null);

let timeout = 0;

watch(props, ({ src }) => {
  if (src) {
    currentVideoUrl.value =
      src.includes('CognizantMoment_Teaser') && !!config.value.advertUsePreview
        ? './CognizantMoment_Teaser_PREVIEW.mp4'
        : src;
    mode.value = 'fade-in';
    emits('start');
  }
});

const handleContainerTransition = () => {
  if (mode.value === 'fade-in') {
    mode.value = 'video-in';
  }
  if (mode.value === 'fade-out') {
    mode.value = 'idle';

    timeout = setTimeout(() => {
      // continue tween
      emits('stop');
    }, config.value.advertPauseOut);
  }
};

const handleVideoTransition = () => {
  if (mode.value === 'video-in') {
    mode.value = 'video';
  }
  if (mode.value === 'video-out') {
    mode.value = 'fade-out';
  }
};

const handleVideoEnd = () => {
  mode.value = 'video-out';
};

onUnmounted(() => {
  clearTimeout(timeout);
});

watch(
  () => config.value.advertUsePreview,
  () => {
    clearTimeout(timeout);
    mode.value = 'fade-in';
  }
);
</script>

<template>
  <div
    :class="[
      'advert',
      {
        'is-active': !['idle', 'fade-out'].includes(mode),
      },
    ]"
    @transitionend="handleContainerTransition"
  >
    <div
      :class="[
        'advert__content',
        {
          'is-active': ['video-in', 'video'].includes(mode),
        },
      ]"
      @transitionend="handleVideoTransition"
    >
      <VideoPlayer
        :src="currentVideoUrl"
        :should-play="mode === 'video'"
        @stop="handleVideoEnd"
        poster="./pixel.jpg"
      />
    </div>
  </div>
</template>

<style scoped>
.advert {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 5000;
  background-color: rgba(255, 255, 255, 0.9);
  opacity: 0;
  transition: opacity var(--transition-duration-advert-container) ease-in-out;
  overflow: hidden;

  &.is-active {
    opacity: 1;
  }

  .advert__content {
    width: 100%;
    height: 100%;
    transform: scale(1) translateY(100vh);
    transition: transform var(--transition-duration-advert-video) ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;

    &.is-active {
      transform: scale(1) translateY(0);
    }

    > video {
      width: 100%;
      height: fit-content;
    }
  }
}
</style>
