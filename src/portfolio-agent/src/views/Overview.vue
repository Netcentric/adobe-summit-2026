<script setup lang="ts">
import { computed, inject, ref, type Ref, watchEffect } from 'vue';
import type { CaseItem } from '../types.ts';
import Select from '../components/Select.vue';
import BackButton from '../components/BackButton.vue';

const data = inject<Ref<CaseItem[]>>('portfolioData', ref([]));

const industryOptions = ref<string[]>([]);
const fieldOfInterestOptions = ref<string[]>([]);

const createOptions = (rawOptions: string[]): string[] =>
  Array.from(new Set(rawOptions)).sort();

watchEffect(() => {
  if (data.value?.length > 0) {
    const { industries, fieldsOfInterest } = data.value.reduce<
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

const industriesFilter = ref<any[]>([]);
const fieldsOfInterestFilter = ref<any[]>([]);

const filteredCases = computed(() => {
  const filters = [...industriesFilter.value, ...fieldsOfInterestFilter.value];

  if (filters.length === 0) {
    return data.value;
  }

  return data.value.reduce<CaseItem[]>((acc, item) => {
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
          :to="`detail${item.path}`"
          class="case-list__link"
        >
          <p class="h4">{{ item.title }}</p>
          <span class="taglist"
            ><span
              class="taglist__item"
              v-for="tag in [...item.industries, ...item.fieldsOfInterest]"
              >{{ tag }}</span
            ></span
          >
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

    & > * {
      flex: 0 1 50%;
    }
  }
}

.case-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  list-style: none;
  padding: 0;
  flex-wrap: wrap;
  width: 100%;
}

.case-list__item {
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
  border-image-source: linear-gradient(
    227.15deg,
    #ffffff 10.79%,
    #000134 90.41%
  );

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
