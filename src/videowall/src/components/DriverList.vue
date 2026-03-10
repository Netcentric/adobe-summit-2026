<script setup lang="ts">
import type { Driver } from '../App.vue';
import { computed, onMounted, onUnmounted, ref } from 'vue';
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

  status.value = 'idle';
};
const onSlideEnd = () => {
  console.log('carousel onSlideEnd');

  clearInterval(timer);

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

        timer = setTimeout(() => {
          emit('stop', props.current);
          updateSlides();
        }, 1000);
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

const carouselConfig: CarouselConfig = {
  enabled: true,
  height: '80vh',
  // i18n: undefined,
  ignoreAnimations: false,
  itemsToScroll: 1,
  preventExcessiveDragging: true,
  slideEffect: 'slide',
  autoplay: 0,
  transition: 800,

  itemsToShow: 4.25,
  gap: 50,
  wrapAround: false,
};

const previousIds = computed(() => props.previous.map(({ uid }) => uid));
</script>

<template>
  <Carousel
    ref="carousel"
    v-bind="carouselConfig"
    @init="onInit"
    @SlideEnd="onSlideEnd"
    @SlideStart="onSlideStart"
    @SlideRegistered="onSlideRegister"
    @SlideUnregistered="onSlideUnregister"
  >
    <!--    <Slide-->
    <!--      v-for="driver in previous"-->
    <!--      class="is-previous"-->
    <!--    >-->
    <!--      <Polaroid-->
    <!--        :caption="[driver.era, driver.circuit]"-->
    <!--        :image="driver.image"-->
    <!--        :alt="driver.uid"-->
    <!--      />-->
    <!--    </Slide>-->
    <Slide
      v-for="driver in slides"
      :key="driver.uid"
    >
      <Polaroid
        :class="[
          status,
          {
            'is-previous': previousIds.includes(driver.uid),
            'is-current': driver.uid === current?.uid,
          },
        ]"
        :caption="[driver.era, driver.circuit]"
        :image="driver.image"
        :alt="driver.uid"
      />
    </Slide>
    <!--    <Slide-->
    <!--      v-for="driver in next"-->
    <!--      :class="{-->
    <!--        'is-current': driver.uid === current?.uid,-->
    <!--      }"-->
    <!--    >-->
    <!--      <img-->
    <!--        :src="driver.image"-->
    <!--        :alt="driver.uid"-->
    <!--      />-->
    <!--      <div>-->
    <!--        <div>{{ driver.era }}</div>-->
    <!--        <div>{{ driver.circuit }}</div>-->
    <!--      </div>-->
    <!--    </Slide>-->
  </Carousel>

  <!--  <div class="driver-list">-->
  <!--    <ul class="driver-list__tray">-->
  <!--      <li-->
  <!--        v-for="driver in previous"-->
  <!--        class="is-previous"-->
  <!--      >-->
  <!--        <img-->
  <!--          :src="driver.image"-->
  <!--          :alt="driver.uid"-->
  <!--        />-->
  <!--        <div>-->
  <!--          {{ driver.name }}-->
  <!--        </div>-->
  <!--      </li>-->
  <!--      <li-->
  <!--        v-for="driver in next"-->
  <!--        :class="{-->
  <!--          'is-current': driver.uid === current?.uid,-->
  <!--        }"-->
  <!--      >-->
  <!--        <img-->
  <!--          :src="driver.image"-->
  <!--          :alt="driver.uid"-->
  <!--        />-->
  <!--        <div>-->
  <!--          {{ driver.name }}-->
  <!--        </div>-->
  <!--      </li>-->
  <!--    </ul>-->
  <!--  </div>-->
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
    border: solid 5px green;
  }

  &.is-previous {
    border: solid 5px orange;
  }
}

.driver-list__tray {
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 2rem;
  display: flex;

  li {
    border: solid 1px white;
    padding: 2rem;
    aspect-ratio: 1 / 1.4;
    width: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transform: scale(0.7);
    transition: transform 0.2s;

    &.is-current {
      background-color: #444;
      transform: scale(1);
    }

    &.is-previous {
      color: #444;
    }
  }
}
</style>
