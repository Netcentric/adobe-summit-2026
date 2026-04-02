<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  tags: {
    required: false,
    type: Array<string>,
  },
  variant: {
    required: false,
    default: 'outline',
  }
});

const classes = computed(() => ({
  [`tagList--variant-${props.variant}`]: !!props.variant,
}));

const shownTags = computed(() => {
  return props.tags?.map(t => t.trim()).filter(t => t.length > 0).sort() || [];
})

</script>

<template>
  <ul
    class="tagList"
    :class="classes"
  >
    <li
      class="tagList__item"
      v-for="(item, index) in shownTags"
      :key="index"
    >
      {{ item }}
    </li>
  </ul>
</template>

<style lang="scss">
/* provisional tag-list */
.tagList {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: start;
  align-items: center;
  margin-top: var(--sp-1);
  padding: 0;

  &__item {
    background-color: var(--white-100-o85);
    color: var(--brand-dark);
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    /*font-family: Inter; TODO re-asses, clarify or implement*/
    font-weight: 400;
    font-size: 12px !important;
    line-height: 1 !important;
    letter-spacing: 0;
    padding: 6px 9px;
  }

  &--variant-outline &__item {
    border: 1px solid #06C7CC;
  }
}
</style>
