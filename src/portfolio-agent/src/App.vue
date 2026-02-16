<script setup lang="ts">
import { ref, onMounted, provide, computed } from 'vue';
import type {
  CaseItem,
  CaseItemBase,
  Portfolio,
  QuickAnswer,
  QuickAnswerBase,
} from './types.ts';
import CognizantLogo from '../../common/CognizantLogo.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const cases = ref<CaseItem[] | null>(null);
const quickAnswers = ref<QuickAnswer[] | null>(null);

onMounted(async () => {
  // porfolio data
  try {
    const response = await fetch('/portfolio-agent/query-index.json');

    if (response.ok) {
      const result = await response.json();
      cases.value = result.data
        .filter((item: CaseItem) => !item.path.includes('case-template'))
        .map(
          ({
            industries,
            fieldsOfInterest,
            image,
            path,
            ...item
          }: CaseItemBase) => ({
            ...item,
            path: path.replace('/portfolio-agent', ''),
            image:
              'https://main--adobe-summit-2026--netcentric.aem.live' + image,
            industries: industries.split(',').map((string) => string.trim()),
            fieldsOfInterest: fieldsOfInterest
              .split(',')
              .map((string) => string.trim()),
          })
        );
    }
  } catch (error) {
    console.error('Failed to fetch portfolio data:', error);
  }
  // quick answer questions
  try {
    const response = await fetch(
      '/portfolio-agent/assets/quick-answer-options.json'
    );

    if (response.ok) {
      const result = await response.json();
      quickAnswers.value = result.data.map(
        ({ filter, ...item }: QuickAnswerBase) => ({
          ...item,
          filter: filter.split(',').map((string) => string.trim()),
        })
      );
    }
  } catch (error) {
    console.error('Failed to fetch portfolio data:', error);
  }
});

provide<Portfolio>('portfolio', { cases, quickAnswers });

// header actions
const showHomeLink = computed(() => route.path.startsWith('/detail'));
</script>

<template>
  <header class="app-header">
    <div class="app-header__logo"><CognizantLogo /></div>
    <div
      class="app-header__actions"
      v-if="showHomeLink"
    >
      <RouterLink
        to="/"
        class="link bold"
        title="Home"
        ><span>⌂︎</span>&nbsp;Home
      </RouterLink>
    </div>
  </header>
  <RouterView />
</template>

<style scoped>
.app-header {
  height: 60px;
  z-index: 10;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: start;
  padding-inline: var(--sp-1);

  @media screen and (min-width: 1340px) {
    padding-inline: 120px;
  }

  .app-header__logo {
    width: 136px;
    height: auto;

    svg {
      width: 100%;
      display: block;
    }
  }

  .app-header__actions {
    margin-left: auto;
    line-height: 1;

    > .link {
      display: block;
      line-height: 1;
      margin-top: -8px;

      span {
        font-size: 24px; /* align with cognizant lettering in logo */
      }
    }
  }
}
</style>
