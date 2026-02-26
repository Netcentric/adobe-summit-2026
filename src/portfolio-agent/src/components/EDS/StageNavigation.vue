<script setup lang="ts">
import { computed, inject } from 'vue';
import type { Ref } from 'vue';

const edsSectionNodes = inject('edsSectionNodes') as Ref<NodeListOf<Element>>;
const edsSectionsIntersecting = inject('edsSectionsIntersecting') as Ref<Map<number, boolean>>;

interface Section {
    headline: string;
    active: boolean;
}

const jumpLinks = computed<Array<Section>>(
    () => Array.from<Element>(edsSectionNodes.value)
        .map((sec, index) => ({
            headline: sec.querySelector('h2')?.innerText || '',
            active: edsSectionsIntersecting.value?.get(index) === true,
        }))
);

function scrollToSection(sectionIndex: number) {
    const target = document.querySelector(`#section-${sectionIndex}`);
    if (!target) {
        return;
    }
    target.scrollIntoView({
        behavior: 'smooth',
    })
}
</script>

<template>
    <div class="stageNavigation">
        <ul>
            <li :key="index" v-for="(section, index) in jumpLinks" :class="{active: section.active}">
                <a href="#" @click.prevent="scrollToSection(index)">{{ section.headline }}</a>
            </li>
        </ul>
        <div class="stageNavigation__activeIndicator"></div>
    </div>
</template>

<style lang="scss">
.stageNavigation {
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: #ffffff;

    > ul {
        padding: 0;
        list-style: none;
        align-items: center;
        justify-content: center;
        display: flex;
        height: 60px;

        > li.active {
            anchor-name: --stagenav-hover;
        }
        
        > li {
            border-bottom: 6px solid transparent;
            padding: var(--sp-1) 42px calc(var(--sp-1) - 6px) 42px;
            
            &:hover, &:focus, &:focus-within {
                anchor-name: --stagenav-hover;
            }
        }
    }

    &__activeIndicator {
        position: absolute;
        position-anchor: --stagenav-hover;
        left: calc(anchor(left) + 33px);
        right: calc(anchor(right) + 33px);
        top: calc(anchor(bottom) - 6px);
        height: 6px;
        background-color: var(--brand-primary);
        transition: all 0.25s ease-in-out;
    }

    &--fixed {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 60px;
    }
}
</style>