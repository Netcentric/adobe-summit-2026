<script setup lang="ts">
import type { Driver } from '../types.ts';
import { computed, ref } from 'vue';
import {
  Carousel,
  type CarouselConfig,
  type CarouselExposed,
  Slide,
} from 'vue3-carousel';
import 'vue3-carousel/carousel.css';
import Polaroid from './Polaroid.vue';
import config from '../config.ts';

const props = defineProps<{
  next: (Driver | null)[];
  previous: (Driver | null)[];
  current: Driver | null;
}>();

const emit = defineEmits(['start', 'stop']);

const carousel = ref<CarouselExposed | null>(null);

const status = ref<'idle' | 'video-in' | 'video' | 'video-out' | 'end'>('idle');

let timer = 0;

const slides = ref<(Driver | null)[]>([]);
const updateSlides = () => {
  slides.value = [...props.previous, ...props.next];
  carousel.value?.restartCarousel();
  carousel.value?.slideTo(2);
};

const onSliderInit = () => {
  if (slides.value.length === 0) {
    updateSlides();
  }
  status.value = 'idle';
  clearInterval(timer);
};

const onSlideSliderEnd = () => {
  if (status.value === 'idle') {
    // wait and start transition video in
    timer = setTimeout(() => {
      status.value = 'video-in';
    }, config.SLIDE_PAUSE);
  } else {
    emit('stop', props.current);
    updateSlides();
  }
};

const onSlideTransitionEnd = () => {
  if (status.value === 'video-in') {
    status.value = 'video';
  } else if (status.value === 'video-out') {
    status.value = 'end';
    // carousel.value?.next();
    // wait and move slide
    // timer = setTimeout(() => {
    //   status.value = 'end';
    //   carousel.value?.next();
    // }, config.SLIDE_PAUSE / 4);
  }
};

const onVideoEnded = () => {
  timer = setTimeout(() => {
    status.value = 'video-out';
    carousel.value?.next();
  }, config.SLIDE_PAUSE / 2);
};

const carouselConfig = computed<Partial<CarouselConfig>>(() => ({
  enabled: true,
  height: '100vh',
  ignoreAnimations: false,
  itemsToScroll: 1,
  preventExcessiveDragging: true,
  slideEffect: 'slide',
  autoplay: 0,
  transition: status.value !== 'idle' ? config.SLIDE_TRANSITION : 0,
  transitionEasing: 'ease',
  itemsToShow: 4.25,
  gap: 50,
  wrapAround: false,
}));
</script>

<template>
  <div class="driver-list">
    <Carousel
      ref="carousel"
      v-bind="carouselConfig"
      @init="onSliderInit"
      @SlideEnd="onSlideSliderEnd"
    >
      <Slide
        v-for="driver in slides"
        :key="driver?.uid"
      >
        <Polaroid
          :driver
          :class="[
            status,
            {
              'is-current': driver?.uid === current?.uid,
              'is-large': status === 'video' || status === 'video-in',
            },
          ]"
          :mode="
            driver?.uid === current?.uid && status === 'video'
              ? 'video'
              : 'image'
          "
          @transitionend="onSlideTransitionEnd"
          @stop="onVideoEnded"
        />
      </Slide>
    </Carousel>
  </div>
</template>

<style>
.carousel__slide--active {
  z-index: 100;

  .polaroid {
    box-shadow: 0 0 38px rgba(0, 0, 0, 0.35);
  }
}

.carousel__slide--active:has(.polaroid.is-large) {
  .polaroid {
    transform: scale(2.1) rotate(0);
    position: relative;
  }
}
.polaroid {
  transition: transform 260ms ease-in-out;
  transition-property: transform, filter, box-shadow;

  &.is-previous {
    outline: solid 5px orange;
  }
}

.carousel__slide {
  &:nth-child(3) > .polaroid,
  &:nth-child(4) > .polaroid.end {
    transform: rotate(0) scale(1.4);
    filter: blur(0);
  }

  &:nth-child(5) > .polaroid.end,
  &:nth-child(4) > .polaroid,
  &:nth-child(1) > .polaroid,
  &:nth-child(2) > .polaroid.end {
    //outline: solid 1px green;
    transform: rotate(-12deg) scale(0.8);
    filter: blur(1px);
  }
  &:nth-child(6) > .polaroid,
  &:nth-child(5) > .polaroid,
  &:nth-child(2) > .polaroid,
  &:nth-child(3) > .polaroid.end {
    //outline: solid 1px blue;
    transform: rotate(8deg) scale(0.9);
    filter: blur(1px);
  }
}

.driver-list {
  height: 100vh;
  width: 100%;
  z-index: 10;
}
</style>
