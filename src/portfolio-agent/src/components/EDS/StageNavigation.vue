<script setup lang="ts">
import { inject } from 'vue';
import type { Ref } from 'vue';
import type { JumpLink } from '../../views/Detail.vue';

const edsNavigationJumpLinks = inject('edsNavigationJumpLinks') as Ref<JumpLink[]>;
const edsActiveNavigationJumpLinkIndex = inject('edsActiveNavigationJumpLinkIndex') as Ref<number>;

const activeBreakpoint = inject<string>('activeBreakpoint');

function scrollToSection(sectionIndex: number) {
    const target = document.querySelector(`#section-${sectionIndex}`);
    if (!target) {
        return;
    }
    target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
    })
}
</script>

<template>
    <div class="stageNavigation">
        <ul>
            <li 
                v-for="(section, index) in edsNavigationJumpLinks"
                :key="index"
                :class="{active: index === edsActiveNavigationJumpLinkIndex}"
            >
                <a href="#" @click.prevent="scrollToSection(section.startSectionIndex)">{{ activeBreakpoint !== 'tablet' ? section.headlineMobile : section.headline }}</a>
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
            padding: var(--sp-1) 15px calc(var(--sp-1) - 6px) 15px;

            @include bp-min($bp-tablet) {
                padding: var(--sp-1) 42px calc(var(--sp-1) - 6px) 42px;
            }
            
            a {
                font-size: 16px;
                color: #53565A;
                font-weight: 600;
            }

            &:hover, &:focus, &:focus-within {
                anchor-name: --stagenav-hover;
                a {
                    color: #000048
                }
            }
        }
    }

    &__activeIndicator {
        position: absolute;
        position-anchor: --stagenav-hover;
        left: calc(anchor(left) + 15px);
        right: calc(anchor(right) + 15px);
        top: calc(anchor(bottom) - 6px);
        height: 6px;
        background-color: var(--brand-primary);
        transition: all 0.25s ease-in-out;

        @include bp-min($bp-tablet) {
            left: calc(anchor(left) + 33px);
            right: calc(anchor(right) + 33px);
        }

    }

    &--fixed {
        position: fixed;
        top: 0;
        left: 0;
        right: calc(100vh - 100%);
        height: 60px;
        z-index: 10;
    }
}
</style>