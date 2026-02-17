<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import type { CaseItem } from '../types.ts';
import Select from '../components/Select.vue';
import BackButton from '../components/BackButton.vue';
import { useRoute } from 'vue-router';
import usePortfolio from '../usePortfolio.ts';
import TagList from '../components/TagList.vue';

const route = useRoute();
const { cases } = usePortfolio();

const industryOptions = ref<string[]>([]);
const fieldOfInterestOptions = ref<string[]>([]);

const createOptions = (rawOptions: string[]): string[] =>
  Array.from(new Set(rawOptions)).sort();

watchEffect(() => {
  if (cases.value?.length && cases.value?.length > 0) {
    const { industries, fieldsOfInterest } = cases.value.reduce<
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

// TODO fix: setting initial filter values is broken when reloading the URL
const industriesFilter = ref<string[]>(
  industryOptions.value.filter((item) =>
    (route.params.filter as string)?.split(',').includes(item)
  ) || []
);
const fieldsOfInterestFilter = ref<string[]>(
  fieldOfInterestOptions.value.filter((item) =>
    (route.params.filter as string)?.split(',').includes(item)
  ) || []
);

const filteredCases = computed(() => {
  const filters = [...industriesFilter.value, ...fieldsOfInterestFilter.value];

  if (filters.length === 0) {
    return cases.value;
  }

  return cases.value?.reduce<CaseItem[]>((acc, item) => {
    return [...item.industries, ...item.fieldsOfInterest].some((filter) =>
      filters.includes(filter)
    )
      ? [...acc, item]
      : acc;
  }, []);
});
</script>

<template>
  <nav class="layout">
    <BackButton to="/" />
  </nav>
  <main class="layout">
    <h2>Here’s what you’re looking for …</h2>
    <div class="filter">
      <p class="filter__legend">Filter the displayed success stories by</p>
      <div class="filter__actions">
        <Select
          :options="industryOptions"
          id="industry"
          placeholder="Filter by industry"
          v-model="industriesFilter"
        />
        <Select
          :options="fieldOfInterestOptions"
          id="fieldOfInterest"
          placeholder="Filter by field of interest"
          v-model="fieldsOfInterestFilter"
        />
      </div>
    </div>
    <ul class="case-list">
      <li
        v-for="item in filteredCases"
        class="case-list__item"
        :style="{ backgroundImage: `url(${item.image})` }"
      >
        <RouterLink
          :to="`/detail${item.path}`"
          class="case-list__link"
        >
          <p class="h4">{{ item.title }}</p>
          <TagList
            :tags="[...item.industries, ...item.fieldsOfInterest]"
            variant="outline"
          />
        </RouterLink>
      </li>
    </ul>
  </main>
</template>

<style scoped>
nav {
  padding-block: var(--sp-2);
  display: flex;
  align-items: center;
}

.filter {
  width: 100%;
  display: flex;
  gap: var(--sp-1);
  flex-direction: column;

  .filter__actions {
    display: flex;
    gap: var(--sp-1);
    justify-content: stretch;
    flex-direction: column;

    @media screen and (min-width: 980px) {
      flex-direction: row;
    }

    & > * {
      @media screen and (min-width: 980px) {
        flex: 0 0 100%;
      }

      flex: 0 1 50%;
    }
  }
}

.case-list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
  list-style: none;
  padding: 0;
  flex-wrap: wrap;
  width: 100%;

  @media screen and (min-width: 980px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

.case-list__item {
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: start;
  position: relative;
  aspect-ratio: 4 / 3;
  background-size: cover;
  background-position: center center;
  color: var(--white-100);
  border: 1px solid;
  z-index: 20;
  border-image: linear-gradient(227.15deg, #ffffff 10.79%, #000134 90.41%) 1;

  &.case-list__item:after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 53, 0) 0%,
      rgba(0, 0, 53, 0.5) 54.81%
    );
  }
}

.case-list__link {
  position: absolute;
  inset: 0;
  z-index: 10;
  padding: 50px;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
}
</style>
