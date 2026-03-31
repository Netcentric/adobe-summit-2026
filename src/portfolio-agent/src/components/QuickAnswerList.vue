<script setup lang="ts">
import { computed } from 'vue';

interface Tag {
  label: string;
  filter: string[];
}

const props = defineProps({
  tags: {
    type: Array<Tag>,
  }
});

const sortedTags = computed(() => {
  return props.tags?.sort((a, b) => {
    if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;
  })
})
</script>

<template>
  <ul class="quickAnswers">
    <li
      v-for="tag in sortedTags"
      class="quickAnswers__item label"
    >
      <RouterLink :to="{name: 'overview', query: {filter: tag.filter}}"> {{ tag.label }}</RouterLink>
    </li>
  </ul>
</template>

<style lang="scss">
.quickAnswers {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
  align-content: flex-start;
  gap: 15px;
  flex-wrap: wrap;
  padding: 0;

  @include bp-min($bp-tablet) {
    gap: 18px;
  }

  &__item {
    display: flex;
    height: 42px;
    padding-inline: 20px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 40px;
    border: 2px solid var(--black, #000);
    background: rgba(255, 255, 255, 0.8);
    font-feature-settings: 'ss01' on;

    @include bp-min($bp-tablet) {
      height: 50px;
      padding-inline: 30px;
    }

  }

}
</style>
