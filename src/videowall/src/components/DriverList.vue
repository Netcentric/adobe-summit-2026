<script setup lang="ts">
import type { Driver } from '../App.vue';
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
  queue: Driver[];
  next: (Driver | null)[];
  previous: (Driver | null)[];
  current: Driver | null;
}>();

const emit = defineEmits(['start', 'stop']);

const carousel = ref<CarouselExposed | null>(null);

const status = ref<'idle' | 'video-in' | 'video' | 'video-out'>('idle');

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
  // clearInterval(timer);

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
    // wait and move slide
    timer = setTimeout(() => {
      carousel.value?.next();
    }, config.SLIDE_PAUSE / 4);
  }
};

const onVideoEnded = () => {
  status.value = 'video-out';
};

const carouselConfig = computed<Partial<CarouselConfig>>(() => ({
  enabled: true,
  height: '80vh',
  ignoreAnimations: false,
  itemsToScroll: 1,
  preventExcessiveDragging: true,
  slideEffect: 'slide',
  autoplay: 0,
  transition: status.value !== 'idle' ? 800 : 0,
  itemsToShow: 4.25,
  gap: 50,
  wrapAround: false,
}));

const previousIds = computed(() =>
  props.previous?.map((driver) => driver?.uid)
);
const nextIds = computed(() => props.next?.map((driver) => driver?.uid));
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
            // status,
            {
              // 'is-previous': previousIds?.includes(driver?.uid || ''),
              // 'is-next': nextIds?.includes(driver?.uid),
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
  <p>{{ slides.length }} // {{ status }}</p>
</template>

<style>
.carousel__slide--active {
  outline: 5px white solid;
  outline-offset: 12px;
  z-index: 100;
}

.carousel__slide--active:has(.polaroid.is-large) {
  .polaroid {
    transform: scale(2);
    position: relative;
    box-shadow: 0 0 50px rgba(0, 0, 0, 0.85);
  }
}
.polaroid {
  transition: transform 360ms ease-in-out;

  &.is-previous {
    outline: solid 5px orange;
  }
}

.carousel__slide {
  &:nth-child(1) {
    outline: solid 1px green;
  }
  &:nth-child(2) {
    outline: solid 1px blue;
  }
}

.driver-list {
  height: 90vh;
  width: 100%;
}
</style>
