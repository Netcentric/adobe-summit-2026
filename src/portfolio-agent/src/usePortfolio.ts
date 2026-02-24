import { inject, ref, watchEffect } from 'vue';
import type { CaseItem, Portfolio } from './types.ts';

const createOptions = (rawOptions: string[]): string[] =>
  Array.from(new Set(rawOptions))
    .filter((item) => !!item)
    .sort();

export default function usePortfolio() {
  const portfolio = inject<Portfolio>('portfolio', {
    cases: ref([]),
    quickAnswers: ref([]),
    searchSuggestions: ref([]),
  });

  const industryOptions = ref<string[]>([]);
  const fieldOfInterestOptions = ref<string[]>([]);

  watchEffect(() => {
    if (portfolio.cases.value?.length && portfolio.cases.value?.length > 0) {
      const { industries, fieldsOfInterest } = portfolio.cases.value.reduce<
        Pick<CaseItem, 'industries' | 'fieldsOfInterest'>
      >(
        (acc, item) => ({
          industries: [...acc.industries, ...item.industries],
          fieldsOfInterest: [...acc.fieldsOfInterest, ...item.fieldsOfInterest],
        }),
        { industries: [], fieldsOfInterest: [] }
      );

      industryOptions.value = createOptions(industries);
      fieldOfInterestOptions.value = createOptions(fieldsOfInterest);
    }
  });

  console.log(industryOptions.value);

  return {
    ...portfolio,
    industryOptions,
    fieldOfInterestOptions,
  };
}
