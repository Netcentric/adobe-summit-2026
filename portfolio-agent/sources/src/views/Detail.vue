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
      console.log(html.value);
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
    <div class="buttongroup">
      <button class="button button--outline">Send to my email</button>
      <button class="button">Explore similar cases</button>
    </div>
  </footer>
</template>

<style>
.detail-content {
  max-width: 100%;
  padding: 0 1rem;
}

.detail-content img {
  max-width: 100%;
  display: block;
  height: auto;
}
</style>
