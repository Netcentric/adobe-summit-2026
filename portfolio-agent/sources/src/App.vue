<script setup lang="ts">
import { ref, onMounted, provide } from 'vue';
import type { CaseItem } from './types.ts';

const portfolioData = ref<any[] | null>(null);

onMounted(async () => {
  try {
    const response = await fetch('/portfolio-agent/query-index.json');
    if (response.ok) {
      const result = await response.json();
      portfolioData.value = result.data.map(
        ({ industries, image, ...item }: CaseItem) => ({
          ...item,
          image: 'https://main--adobe-summit-2026--netcentric.aem.live' + image,
          industries: (industries as unknown as string).split(','),
        })
      );
    }
  } catch (error) {
    console.error('Failed to fetch portfolio data:', error);
  }
});

provide('portfolioData', portfolioData);
</script>

<template>
  <RouterView />
</template>
