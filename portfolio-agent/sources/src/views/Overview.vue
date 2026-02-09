<script setup lang="ts">
import { inject } from 'vue';
import type { CaseItem } from '../types.ts';

const data = inject<CaseItem[]>('portfolioData');
console.log(data);
</script>

<template>
  <nav>
    <ul>
      <li>
        <RouterLink to="/">Home</RouterLink>
      </li>
    </ul>
  </nav>
  <main class="layout">
    <h2>Overview</h2>
    <ul class="caseList">
      <li
        v-for="item in data"
        class="caseList__item"
      >
        <RouterLink
          :to="`detail${item.path}`"
          class="caseList__item"
        >
          <pre>{{ item.title }}</pre>
          <img
            :src="item.image"
            :alt="item.title"
          />
          <p>{{ item.title }}</p>
          <span class="tags"
            ><span
              class="tags__item"
              v-for="tag in item.industries"
              >{{ tag }}</span
            ></span
          >
        </RouterLink>
      </li>
      <li><RouterLink to="/detail/1">case list item 1</RouterLink></li>
      <li><RouterLink to="/detail/2">case list item 2</RouterLink></li>
      <li>...</li>
    </ul>
  </main>
</template>

<style scoped>
.caseList {
  display: flex;
  gap: 2rem;
  max-width: 918px;
  list-style: none;
  padding: 0;
  flex-wrap: wrap;
  width: 100%;
}

.caseList__item {
  flex: 1 0 47%;
  border: solid 2px var(--brand-border-primary);
  position: relative;
  padding: 1.5rem;
}

img {
  display: block;
  width: 100%;
}

.tags {
  display: flex;
  gap: 1rem;
}
.tags__item {
  height: 1.5rem;
  font-size: 0.8rem;
  border-radius: 0.75rem;
  border: solid 1px var(--brand-border-grey);
  padding: 0 0.5rem;
  display: flex;
  align-items: center;
}
</style>
