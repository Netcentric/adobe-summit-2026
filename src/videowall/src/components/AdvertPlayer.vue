<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ play: boolean }>();
const emits = defineEmits(['stop']);

const status = ref<
  'idle' | 'fade-in' | 'video-in' | 'video' | 'video-out' | 'fade-out'
>('idle');

watch(props, ({ play }) => {
  if (play) {
    status.value = 'fade-in';
  }
});

const handleContainerTransition = () => {
  if (status.value === 'fade-in') {
    status.value = 'video-in';
  }
  if (status.value === 'fade-out') {
    emits('stop');
    status.value = 'idle';
  }
};

const handleVideoTransition = () => {
  if (status.value === 'video-in') {
    status.value = 'video';
    // simulate video
    setTimeout(() => {
      status.value = 'video-out';
    }, 5000);
  }
  if (status.value === 'video-out') {
    status.value = 'fade-out';
  }
};
</script>

<template>
  <div
    :class="[
      'advert',
      {
        'is-active': !['idle', 'fade-out'].includes(status),
      },
    ]"
    @transitionend="handleContainerTransition"
  >
    <div
      :class="[
        'advert__content',
        {
          'is-active': ['video-in', 'video'].includes(status),
        },
      ]"
      @transitionend="handleVideoTransition"
    >
      ADVERT VIDEO {{ play }} // {{ status }}
    </div>
  </div>
</template>

<style scoped>
.advert {
  pointer-events: none;
  position: absolute;
  inset: 0;
  padding: 2rem;
  z-index: 5000;
  background-color: rgba(255, 255, 255, 0.9);
  opacity: 0;
  transition: opacity var(--transition-duration-advert-container) ease-in-out;

  &.is-active {
    opacity: 1;
  }

  .advert__content {
    width: 100%;
    height: 100%;
    background: #aea8c7;
    transform: scale(1) translateY(120vh);
    transition: transform var(--transition-duration-advert-video) ease-in-out;

    &.is-active {
      transform: scale(1) translateY(0);
    }
  }
}
</style>
