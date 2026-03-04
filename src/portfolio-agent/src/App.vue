<script setup lang="ts">
import { ref, onMounted, provide } from 'vue';
import type {
  CaseItem,
  CaseItemBase,
  Portfolio,
  QuickAnswer,
  QuickAnswerBase,
  SearchSuggestions,
} from './types.ts';
import { useRouter } from 'vue-router';

const router = useRouter();

const cases = ref<CaseItem[] | null>(null);
const quickAnswers = ref<QuickAnswer[] | null>(null);
const searchSuggestions = ref<SearchSuggestions | null>(null);

const humanPresent = ref(true);
provide('humanPresent', humanPresent);
provide('showNextCase', onNoInteraction);

let presenceTimeout: number | undefined;
const presenceTimeoutMs = import.meta.env.VITE_DEMO_MODE_START_TIMEOUT;

function onInteraction() {
  humanPresent.value = true;
  if (presenceTimeout) {
    clearTimeout(presenceTimeout);
  }
  presenceTimeout = setTimeout(onNoInteraction, presenceTimeoutMs);
}

function onNoInteraction() {
  if (cases.value) {
    const randomIndex = Math.floor(Math.random() * cases.value?.length);
    const randomCase = cases.value[randomIndex];
    if (randomCase) {
      router.push({
        name: 'detail',
        params: {
          id: randomCase.path,
        },
        query: {
          autoScroll: 1,
        }
      });
    }
  }

  if (presenceTimeout) {
    clearTimeout(presenceTimeout);
  }
  humanPresent.value = false;
}

onMounted(async () => {
  window.addEventListener('mousedown', onInteraction);
  window.addEventListener('touchstart', onInteraction);
  onInteraction();

  // porfolio data
  try {
    const response = await fetch('/portfolio-agent/query-index.json');

    if (response.ok) {
      const result = await response.json();
      cases.value = result.data
        // TODO this filter is provisional as dummy cases should not show as they are already deleted
        .filter((item: CaseItem) => !item.path.includes('dummy'))
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
            path: path.replace('/portfolio-agent/', ''),
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
  // quick answer options
  try {
    const response = await fetch(
      '/portfolio-agent/config/quick-answer-options.json'
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
    console.error('Failed to fetch quick answer options:', error);
  }
  // search suggestions
  try {
    const response = await fetch(
      '/portfolio-agent/config/search-suggestions.json'
    );

    if (response.ok) {
      const result = await response.json();
      searchSuggestions.value = result.data;
    }
  } catch (error) {
    console.error('Failed to fetch search suggestions:', error);
  }
});

provide<Portfolio>('portfolio', { cases, quickAnswers, searchSuggestions });
</script>

<template>
  <RouterView />
  <div class="noHumanPresent" v-if="!humanPresent">
    Demo mode...
  </div>
</template>

<style lang="scss">
.noHumanPresent {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100px;
  background: black;
  color: white;
  padding: 10px;
}
</style>
