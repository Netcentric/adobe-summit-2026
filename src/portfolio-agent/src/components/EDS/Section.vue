<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core';
import { onUnmounted, useTemplateRef, type Component, type DefineComponent } from 'vue';
import TextImage from './TextImage.vue';
import CaptionImage from './CaptionImage.vue';
import Cards from './Cards.vue';
const props = defineProps(['node', 'index']);

const blockTypes: Map<string, Component | DefineComponent> = new Map([
    ['textimage', TextImage],
    ['captionimage', CaptionImage],
    ['cards', Cards]
]);

const target = useTemplateRef('section');

const emit = defineEmits(['intersecting', 'notIntersecting']);

const { stop } = useIntersectionObserver(
  target,
  ([entry]) => {
    if (entry?.isIntersecting) {
        emit('intersecting');
    } else {
        emit('notIntersecting')
    }
  },
  {
    rootMargin: '-60px 0px 0px 0px',
  }
);

onUnmounted(() => {
    stop();
})
</script>

<template>
    <section class="section" :id="`section-${index}`" ref="section">
        <template v-for="(child, childIndex) in node.children" :key="childIndex">
            <Component
                v-if="child.tagName?.toLowerCase() === 'div' && child.className && blockTypes.has(child.className)"
                :is="blockTypes.get(child.className)"
                :node="child"
            />
            <Component
                v-else
                :is="child.tagName"
                v-html="child.innerHTML"
            />
        </template>
    </section>
</template>

<style lang="css">
.section {
    margin-inline: auto;
    padding-inline: var(--sp-1);

    @media screen and (min-width: 1200px) {
        max-width: 1100px;
        margin-inline: auto;
        padding-inline: unset;
    }
}

.section + .section,
.block + .block {
    margin-top: 100px;
}
</style>