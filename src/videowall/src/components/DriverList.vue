<script setup lang="ts">
import type { AdvertConfig, Driver } from '../types.ts';
import { computed, ref, watch } from 'vue';
import {
  Carousel,
  type CarouselConfig,
  type CarouselExposed,
  Slide,
} from 'vue3-carousel';
import 'vue3-carousel/carousel.css';
import Polaroid from './Polaroid.vue';
import useDrivers from '../useDrivers.ts';
import useConfig from '../useConfig.ts';
import AdvertPlayer from './AdvertPlayer.vue';

const { updateDrivers, getSlides } = useDrivers();
const { config } = useConfig();

const advertCounterIterator = computed(() => {
  const counters = config.value.advertConfig.map((item) => {
    const [advertCounter = 'noop', slideCounter = 'noop', advertUrl = 'noop'] =
      item.split(/(?<=\d):/);

    return {
      advertCounter: Number.parseInt(advertCounter, 10),
      slideCounter: Number.parseInt(slideCounter, 10),
      advertUrl,
    };
  });

  return (function* () {
    let itemCounter = 1;
    let index = 0;

    while (true) {
      yield counters[index];

      if ((counters[index]?.advertCounter || 0) > itemCounter) {
        itemCounter++;
      } else {
        itemCounter = 1;
        index = (index + 1) % counters.length;
      }
    }
  })();
});

const carousel = ref<CarouselExposed | null>(null);
const slides = ref<(Driver | null)[]>([]);
const status = ref<'idle' | 'video-in' | 'video' | 'video-out' | 'end'>('idle');
const slideCounter = ref(0);
const advertisement = ref<AdvertConfig | null>(
  advertCounterIterator.value.next().value || null
);
const advertPlayerSrc = ref<string | null>(null);

let timeout = 0;

const current = computed(() => slides.value[2] || null);

const handleNextSlide = () => {
  if (slideCounter.value >= (advertisement.value?.slideCounter || 1)) {
    advertPlayerSrc.value = advertisement.value?.advertUrl || null;
  } else {
    slides.value = getSlides(slides.value);
    slideCounter.value += 1;
    status.value = 'idle';
  }
};

const handleStopAdvert = () => {
  // reset counter and src
  advertPlayerSrc.value = null;
  slideCounter.value = 0;
  // get next advertisement config
  advertisement.value = advertCounterIterator.value.next().value || null;

  // continue tween
  timeout = setTimeout(() => {
    handleNextSlide();
  }, config.value.advertPauseOut);
};

// carousel initialized via key change on slides changes using "current"
const onSliderInit = () => {
  if (slides.value.length === 0) {
    handleNextSlide();
  }
  carousel.value?.restartCarousel();
  carousel.value?.slideTo(2);
  status.value = 'idle';
  clearInterval(timeout);
};

const onSlideSliderEnd = () => {
  if (status.value === 'idle') {
    // after "init" or manual "idle"
    // wait and start transition video in
    timeout = setTimeout(() => {
      status.value = 'video-in';
    }, config.value.slidePauseIn as number);
  } else if (status.value === 'end') {
    // after active slide was slid out and "tween" is ended
    updateDrivers(current.value as Driver);
    handleNextSlide();
  }
};

const onSlideTransitionEnd = () => {
  if (status.value === 'video-in') {
    status.value = 'video';
  } else if (status.value === 'video-out') {
    status.value = 'end';
  }
};

const onVideoEnded = () => {
  timeout = setTimeout(() => {
    status.value = 'video-out';
    carousel.value?.next();
  }, config.value.slidePauseOut as number);
};

const carouselConfig = computed<Partial<CarouselConfig>>(() => ({
  enabled: true,
  height: '100vh',
  ignoreAnimations: false,
  itemsToScroll: 1,
  preventExcessiveDragging: true,
  slideEffect: 'slide',
  autoplay: 0,
  transition:
    status.value === 'idle' ? 0 : (config.value.slideTransition as number),
  transitionEasing: 'ease',
  itemsToShow: 4.25,
  gap: 50,
  wrapAround: false,
}));
</script>

<template>
  <div class="driver-list">
    <div
      class="debug"
      v-if="config.debug"
    >
      <pre>{{ { slideCounter, nextAdvertSrc: advertisement?.advertUrl } }}</pre>
    </div>
    <Carousel
      ref="carousel"
      v-bind="carouselConfig"
      @init="onSliderInit"
      @SlideEnd="onSlideSliderEnd"
      :key="current?.session || 'start'"
    >
      <Slide
        v-for="(driver, index) in slides"
        :key="driver?.session + '#' + index"
      >
        <Polaroid
          :driver
          :class="[
            status,
            {
              'is-current': driver?.session === current?.session,
              'is-large': status === 'video' || status === 'video-in',
            },
          ]"
          :mode="
            driver?.session === current?.session && status === 'video'
              ? 'video'
              : 'image'
          "
          @transitionend="onSlideTransitionEnd"
          @stop="onVideoEnded"
        />
      </Slide>
    </Carousel>
    <AdvertPlayer
      :src="advertPlayerSrc"
      @stop="handleStopAdvert"
    />
  </div>
</template>

<style>
.carousel__slide--active {
  z-index: 100;

  .polaroid {
    box-shadow:
      0 0 38px rgba(0, 0, 0, 0.25),
      3px 3px 2px rgba(0, 0, 0, 0.08);
  }
}

.carousel__slide--active:has(.polaroid.is-large) {
  .polaroid {
    transform: scale(var(--slide-maximum-scale)) rotate(0);
    position: relative;
  }
}
.polaroid {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);

  transition-property: transform, filter;
  transition-duration: var(--transition-duration-video-in);
  transition-timing-function: var(--transition-timing-video-in);

  &.video-in {
    transition-duration: var(--transition-duration-video-in);
    transition-timing-function: var(--transition-timing-video-in);
  }
  &.video-out {
    transition-duration: var(--transition-duration-video-out);
    transition-timing-function: var(--transition-timing-video-out);
  }
}

.carousel__slide {
  &:nth-child(1) > .polaroid,
  &:nth-child(2) > .polaroid.end {
    transform: rotate(-12deg) scale(0.8) translateX(8%);
    filter: blur(2px);
  }
  &:nth-child(2) > .polaroid,
  &:nth-child(3) > .polaroid.end {
    transform: rotate(8deg) scale(1);
    filter: blur(1px);
  }

  &:nth-child(3) > .polaroid,
  &:nth-child(4) > .polaroid.end {
    transform: rotate(0) scale(1.4);
    filter: blur(0);
  }

  &:nth-child(5) > .polaroid.end,
  &:nth-child(4) > .polaroid {
    transform: rotate(-8deg) scale(1);
    filter: blur(1px);
  }
  &:nth-child(6) > .polaroid,
  &:nth-child(5) > .polaroid {
    transform: rotate(12deg) scale(0.8) translateX(-8%);
    filter: blur(2px);
  }
}

.driver-list {
  height: 100vh;
  width: 100%;
  z-index: 1000;
  position: relative;
}

.debug {
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
