<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core';
import { onUnmounted, shallowRef, useTemplateRef } from 'vue';
import BackButton from '../BackButton.vue';
import TagList from '../TagList.vue';
import StageNavigation from './StageNavigation.vue';
import AppHeader from '../AppHeader.vue';

const target = useTemplateRef('stage');
const stageIsIntersecting = shallowRef(false);

const { stop } = useIntersectionObserver(
  target,
  ([entry]) => {
    stageIsIntersecting.value = entry?.isIntersecting || false;
  },
  {
    rootMargin: '-60px 0px 0px 0px',
  }
);

const props = defineProps(['node', 'tags']);
const headline = props.node.querySelector('h1')?.innerText;
const pictureNode = props.node.querySelector('picture');

onUnmounted(() => {
  stop();
});
</script>

<template>
  <section
    class="stage"
    ref="stage"
  >
    <picture
      v-if="pictureNode"
      class="stage__background"
      v-html="pictureNode.innerHTML"
    ></picture>
    <div class="stage__backButton">
      <BackButton
        to="/overview"
        variant="white"
      />
    </div>
    <div class="stage__content">
      <h1 v-if="headline">{{ headline }}</h1>
      <TagList
        class="stage__tagList"
        :tags="props.tags"
        variant="stage"
      />
    </div>
    <StageNavigation
      :class="{ 'stageNavigation--fixed': !stageIsIntersecting }"
    />
  </section>
</template>

<style lang="scss">
.stage {
  width: 100%;
  max-width: unset;
  padding-bottom: 60px;
  position: relative;
  scroll-snap-align: start;
  min-height: 100vh;
  margin-bottom: 40px;
  box-shadow: 0px 4px 30px 0px rgba(0, 0, 0, 0.07);

  &__background {
    position: absolute;
    inset: 0;
    overflow: hidden;
    justify-content: center;

    img {
      min-width: 100%;
      min-height: 100%;
      object-fit: cover;
    }
  }

  &__content {
    position: absolute;
    top: 84px;
    bottom: 84px;
    left: 50%;
    width: calc(100% - 48px);
    max-width: min(1100px, calc(100% - 48px));
    justify-content: end;
    align-content: end;
    transform: translateX(-50%);
    z-index: 3;

    @include bp-min($bp-tablet) {
      top: 130px;
      bottom: 190px;
      width: 100%;
    }
  }

  &__backButton {
    position: absolute;
    left: 50%;
    top: var(--sp-2);
    width: calc(100% - 48px);
    max-width: 1100px;
    transform: translateX(-50%);
    z-index: 5;
  }

  &__tagList {
    margin-top: 40px !important;
  }

  h1 {
    color: var(--white-100);
  }
}
</style>
