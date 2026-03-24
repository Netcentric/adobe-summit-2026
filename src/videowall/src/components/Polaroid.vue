<script setup lang="ts">
import type { Driver } from '../types';
import { computed, onBeforeUnmount, onUnmounted, ref, watch } from 'vue';

const props = defineProps<{
  driver: Driver | null;
  mode: 'image' | 'video';
}>();
const emits = defineEmits(['start', 'stop', 'error']);

const videoRef = ref<HTMLVideoElement | null>(null);
watch(props, ({ mode }) => {
  if (mode === 'video') {
    videoRef.value?.play()?.catch(() => {
      emits('stop');
    });
  }
});

const caption = computed(() => [props.driver?.era, props.driver?.circuit]);

onBeforeUnmount(() => {
  videoRef.value?.setAttribute('src', '');
  videoRef.value?.load();
});
onUnmounted(() => {
  videoRef.value?.remove();
  videoRef.value = null;
});
</script>

<template>
  <div
    class="polaroid"
    :class="[
      mode,
      {
        placeholder: !driver,
      },
    ]"
  >
    <template v-if="driver">
      <div class="polaroid__image">
        <video
          ref="videoRef"
          class="videoplayer__video"
          muted
          v-if="driver"
          @play="() => emits('start')"
          @ended="
            () => {
              emits('stop');
            }
          "
          :src="driver.video"
        />
        <img
          :src="driver.image"
          :alt="driver.session"
        />
      </div>
      <div class="polaroid__caption">
        <p v-for="item in caption">{{ item }}</p>
        <span>{{ driver.tCreated.toString() }} / {{ driver.count }}</span>
      </div>
    </template>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');

.polaroid {
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 6%;
  aspect-ratio: 3.5 / 4.35;
  background-color: white;
  justify-content: space-between;
  border-radius: 1px;
  box-shadow:
    1px 1px 3px 1px rgba(113, 96, 72, 0.03) inset,
    -1px -1px 2px rgba(113, 96, 72, 0.03) inset;

  &.placeholder {
    visibility: hidden;
  }

  &.image {
    img {
      opacity: 1;
    }
    video {
      opacity: 0;
    }
  }

  &.video {
    img {
      opacity: 0;
    }
    video {
      opacity: 1;
    }
  }
}

.polaroid__image {
  aspect-ratio: 1 / 1;
  width: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 1px;
  box-shadow:
    -1px -1px 3px 1px rgba(113, 96, 72, 0.03),
    1px 1px 2px rgba(113, 96, 72, 0.03);

  &:after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 100;
    border-radius: 1px;

    box-shadow:
      1px 1px 1px rgba(113, 96, 72, 0.05) inset,
      -1px -1px 2px rgba(46, 43, 41, 0.05) inset;
  }

  img,
  video {
    //transition: opacity 0.18s linear;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  video {
    position: absolute;
  }
}

.polaroid__caption {
  font-family: 'Gellix', sans-serif;
  font-size: 11px;
  display: flex;
  flex-direction: column;
  color: #000048;
  line-height: 1;
  user-select: none;

  p {
    margin: 0;

    & + p {
      margin-top: 0.15rem;
    }
  }
  p:nth-child(1) {
    font-size: 1.1em;
  }
  p:nth-child(2) {
    font-size: 1em;
  }

  span {
    display: none;
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 6px !important;
    font-weight: 400;
    padding: 2px;
    color: white;
    background-color: black;
  }

  &:hover {
    span {
      display: block;
    }
  }
}
</style>
