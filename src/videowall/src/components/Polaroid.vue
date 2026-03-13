<script setup lang="ts">
import type { Driver } from '../types';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  driver: Driver | null;
  mode: 'image' | 'video';
}>();
const emits = defineEmits(['start', 'stop']);

const videoRef = ref<HTMLVideoElement | null>(null);
watch(props, async ({ mode }) => {
  if (mode === 'video') {
    await videoRef.value?.play();
  }
});

const caption = computed(() => [props.driver?.era, props.driver?.circuit]);
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
        >
          <source
            :src="driver.video"
            type="video/mp4"
          />
        </video>
        <img
          :src="driver.image"
          :alt="driver.uid"
        />
      </div>
      <div class="polaroid__caption">
        <div v-for="item in caption">{{ item }}</div>
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
  font-family: 'Permanent Marker', cursive;
  font-weight: 400;
  font-style: normal;
  font-size: 10px;
  display: flex;
  flex-direction: column;
  color: #222;
  line-height: 1;

  span {
    margin-top: -3px;
  }
}
</style>
