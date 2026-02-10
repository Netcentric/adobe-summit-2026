<script setup lang="ts">
import { inject } from 'vue';
import type { CaseItem } from '../types.ts';

const data = inject<CaseItem[]>('portfolioData');
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
    <h2>Overview (change)</h2>
    <ul class="case-list">
      <li
        v-for="item in data"
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
              v-for="tag in item.industries"
              >{{ tag }}</span
            ></span
          >
        </RouterLink>
      </li>
    </ul>
  </main>
</template>

<style scoped>
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
  padding: 50px;
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
  position: relative;
  z-index: 10;
}
</style>
