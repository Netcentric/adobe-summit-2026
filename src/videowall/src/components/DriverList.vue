<script setup lang="ts">
import type { Driver } from '../App.vue';
import { computed, ref } from 'vue';
import {
  Slide,
  Carousel,
  type CarouselConfig,
  type CarouselExposed,
} from 'vue3-carousel';
import 'vue3-carousel/carousel.css';
import Polaroid from './Polaroid.vue';

const props = defineProps<{
  queue: Driver[];
  next: Driver[];
  previous: Driver[];
  current: Driver | null;
}>();

const emit = defineEmits(['start', 'stop']);

const carousel = ref<CarouselExposed | null>(null);

console.log(props);

const status = ref<'idle' | 'slider' | 'transition' | 'video'>('idle');

let timer = 0;

const slides = ref<Driver[]>([]);
const updateSlides = () => {
  slides.value = [...props.previous, ...props.next];
  carousel.value?.restartCarousel();
  carousel.value?.slideTo(2);
};

const onInit = () => {
  console.log('carousel init');

  if (slides.value.length === 0) {
    updateSlides();
  }

  status.value = 'idle';
};
const onSlideEnd = () => {
  console.log('carousel onSlideEnd');

  clearInterval(timer);

  if (status.value !== 'idle') {
    emit('stop', props.current);
    updateSlides();
    return;
  }

  // wait, animate & start video playback
  timer = setTimeout(() => {
    // start animate
    status.value = 'transition';

    timer = setTimeout(() => {
      // animation end --> start video
      status.value = 'video';

      timer = setTimeout(() => {
        // video end --> transition
        status.value = 'transition';

        carousel.value?.next();
      }, 3000);
    }, 1000);
  }, 1000);
};
const onSlideStart = () => {
  console.log('carousel onSlideStart');
};
const onSlideRegister = () => {
  console.log('carousel onSlideRegister');
};
const onSlideUnregister = () => {
  console.log('carousel onSlideUnregister');
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

const previousIds = computed(() => props.previous.map(({ uid }) => uid));
const nextIds = computed(() => props.next.map(({ uid }) => uid));
</script>

<template>
  <div class="driver-list">
    <p>{{ slides.length }}</p>
    <Carousel
      ref="carousel"
      v-bind="carouselConfig"
      @init="onInit"
      @SlideEnd="onSlideEnd"
      @SlideStart="onSlideStart"
      @SlideRegistered="onSlideRegister"
      @SlideUnregistered="onSlideUnregister"
    >
      <Slide
        v-for="driver in slides"
        :key="driver.uid"
      >
        <Polaroid
          :class="[
            status,
            {
              'is-previous': previousIds.includes(driver.uid),
              'is-next': nextIds.includes(driver.uid),
              'is-current': driver.uid === current?.uid,
            },
          ]"
          :caption="[driver.era, driver.circuit]"
          :image="driver.image"
          :alt="driver.uid"
        />
      </Slide>
    </Carousel>
  </div>
</template>

<style scoped>
.carousel__slide--active:has(.polaroid) {
  z-index: 100;
}
.carousel__slide--active:has(.polaroid.video) {
  .polaroid {
    transform: scale(2);
    z-index: 100;
    position: relative;
    box-shadow: 0 0 50px rgba(0, 0, 0, 0.85);
  }
}
.polaroid {
  transition: transform 360ms ease-in-out;

  &:nth-child(5) {
    outline: solid 5px green;
  }

  &.is-previous {
    outline: solid 5px orange;
  }
}

.driver-list {
  height: 90vh;
  width: 100%;
  padding-top: 200px;
}
</style>
