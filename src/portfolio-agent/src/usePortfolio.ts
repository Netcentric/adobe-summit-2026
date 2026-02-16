import { inject, ref } from 'vue';
import type { Portfolio } from './types.ts';

export default function usePortfolio() {
  const portfolio = inject<Portfolio>('portfolio', {
    cases: ref([]),
    quickAnswers: ref([]),
    searchSuggestions: ref([]),
  });

  return {
    ...portfolio,
  };
}
