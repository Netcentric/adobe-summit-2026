<script setup lang="ts">
const tags = [
  'Improve efficiency',
  'Scale operations',
  'Improve customer experience',
  'Sales enablement',
  'E-commerce',
  'Marketing & growth',
];
</script>

<template>
  <ul class="tag-list">
    <li
      v-for="tag in tags"
      class="tag-list__item label"
    >
      {{ tag }}
    </li>
  </ul>
</template>

<style scoped>
.tag-list {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
  align-content: flex-start;
  gap: 18px;
  flex-wrap: wrap;
}

.tag-list__item {
  display: flex;
  height: 50px;
  padding-inline: 30px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 40px;
  border: 2px solid var(--black, #000);
  background: rgba(255, 255, 255, 0.8);
  font-feature-settings: 'ss01' on;
}
</style>
