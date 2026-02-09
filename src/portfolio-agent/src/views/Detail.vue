<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const html = ref<null | string>(null);

onMounted(async () => {
  try {
    const response = await fetch(
      `/portfolio-agent/${route.params.id}.plain.html`
    );
    if (response.ok) {
      html.value = await response.text();
    }
  } catch (error) {
    console.error('Failed to fetch portfolio detail:', error);
  }
});
</script>

<template>
  <nav>
    <ul>
      <li>
        <RouterLink to="/overview">Overview</RouterLink>
      </li>
      <li>
        <RouterLink to="/">Home</RouterLink>
      </li>
    </ul>
  </nav>
  <main>
    <div
      class="detail-content"
      v-html="html"
    />
  </main>
  <footer>
    <button class="button button--outline">Send to my email</button>
    <button class="button">Explore similar cases</button>
  </footer>
</template>

<style>
.detail-content {
  max-width: 100%;
}

.detail-content img {
  max-width: 100%;
  display: block;
  height: auto;
}

/* section */
.detail-content > div {
  content: 'section';
  max-width: 800px;
  margin-inline: auto;
}
.detail-content > div + div {
  margin-top: var(--sp-4);
}

/* typography */
.detail-content h1 {
  font-size: 70px;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;
}

.detail-content h2 {
  font-size: 37.34px;
  line-height: 44.8px;
  letter-spacing: 0;
  margin-bottom: var(--sp-2);
}

/* DA blocks */
/*
 TODO consider creating the markup for the stage
  via javascript
 */
.detail-content > div:first-child {
  width: 100%;
  max-width: unset;
  position: relative;
}

.detail-content > div:first-child > h1 {
  position: absolute;
  top: 55%;
  left: var(--sp-2);
  z-index: 10;
  color: var(--white-100);
}

.textimage > div {
  display: flex;
  flex-direction: row;
  gap: var(--sp-1);
}

.textimage > div > div {
  flex: 0 1 48%;
}

.captionimage > div {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
}

.captionimage > div > div:last-child {
  /* paragraph small */
  font-weight: 400;
  font-style: normal;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: 0;
  vertical-align: middle;
}

.textimage + .captionimage {
  margin-top: var(--sp-2);
}

.cards {
  display: grid;
  gap: var(--sp-1);
  grid-template-columns: 1fr 1fr;
}

.cards > div {
  border-left: 3px solid var(--brand-primary);
  padding: var(--sp-1) var(--sp-2);
  background-color: var(--grey-15);
}

footer {
  display: flex;
  gap: var(--sp-1);
  align-items: center;
  justify-content: center;
  padding-block: var(--sp-2);
}
</style>
