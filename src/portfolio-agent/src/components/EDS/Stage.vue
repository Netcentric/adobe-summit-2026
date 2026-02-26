<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core';
import { onUnmounted, shallowRef, useTemplateRef } from 'vue';
import BackButton from '../BackButton.vue';
import TagList from '../TagList.vue';
import StageNavigation from './StageNavigation.vue';

const target = useTemplateRef('stage');
const stageIsIntersecting = shallowRef(false);

const { stop } = useIntersectionObserver(
  target,
  ([entry]) => {
    stageIsIntersecting.value = entry?.isIntersecting || false
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
})
</script>

<template>
    <section class="stage" ref="stage">
        <div v-if="pictureNode" class="stage__background" v-html="pictureNode.innerHTML"></div>
        <div class="stage__backButton">
            <BackButton to="/overview" variant="white" />
        </div>
        <div class="stage__content">
            <h1 v-if="headline">{{ headline }}</h1>
            <TagList class="stage__tagList" :tags="props.tags" variant="stage" />
        </div>
        <StageNavigation :class="{'stageNavigation--fixed': !stageIsIntersecting}"/>
    </section>
</template>

<style lang="scss">
.stage {
  width: 100%;
  max-width: unset;
  padding-bottom: 60px;
  margin-bottom: 40px;
  position: relative;
  box-shadow: 0px 4px 30px 0px rgba(0,0,0,0.07);

  &__background {
    max-height: 768px;
    overflow: hidden;
    justify-content: center;
  }

  &__content {
    position: absolute;
    top: 130px;
    bottom: 190px;
    left: 50%;
    width: 100%;
    max-width: 1100px;
    justify-content: end;
    align-content: end;
    transform: translateX(-50%);
  }

  &__backButton {
    position: absolute;
    left: 50%;
    top: 45px;
    width: 100%;
    max-width: 1100px;
    transform: translateX(-50%);
  }

  &__tagList {
    margin-top: 40px !important;
  }

  h1 {
    color: var(--white-100);
  }
}
</style>