<script setup lang="ts">
import { useIntersectionObserver, useResizeObserver } from '@vueuse/core';
import { onUnmounted, ref, useTemplateRef, type Component, type DefineComponent } from 'vue';
import TextImage from './TextImage.vue';
import CaptionImage from './CaptionImage.vue';
import Cards from './Cards.vue';
import IntroSlide from './IntroSlide.vue';
const props = defineProps(['node', 'index']);

const blockTypes: Map<string, Component | DefineComponent> = new Map([
    ['textimage', TextImage],
    ['captionimage', CaptionImage],
    ['cards', Cards],
    ['introslide', IntroSlide],
]);

const sectionRef = useTemplateRef('section');
const isIntersecting = ref(false);

const emit = defineEmits(['intersecting', 'notIntersecting']);

const { stop } = useIntersectionObserver(
  sectionRef,
  ([entry]) => {
    if (entry?.isIntersecting) {
        emit('intersecting');
        isIntersecting.value = true;
    } else {
        emit('notIntersecting')
        isIntersecting.value = false;
    }
  },
  {
    rootMargin: '-100px 0px -10px 0px',
  }
);


useResizeObserver(sectionRef, (entries) => {
    const entry = entries[0]
    const target = entry?.target as HTMLElement;
    const padding = Math.max(
        (document.body.clientWidth - 1100) / 2,
        24
    );
    target?.style?.setProperty("--section-padding-inline", `${padding}px`);
});


onUnmounted(() => {
    stop();
})
</script>

<template>
    <section class="section" :class="{'section--intersecting': isIntersecting}" :id="`section-${index}`" ref="section">
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

<style lang="scss">
.section {
    min-height: var(--section-height);
    padding: 24px;
    // scroll-snap-align: start;

    @include bp-min($bp-tablet) {
        padding-inline: var(--section-padding-inline);
        padding-block: var(--section-padding-block);
    }
}

.block + .block {
    margin-top: 100px;
}
</style>