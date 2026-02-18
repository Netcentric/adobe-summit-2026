<script setup lang="ts">
const props = defineProps(['tags', 'variant']);
</script>

<template>
  <ul
    class="tag-list"
    ref="taglist"
    :class="{
      'tag-list--outline': props.variant === 'outline',
    }"
  >
    <li
      class="tag-list__item"
      v-for="item in tags"
    >
      {{ item }}
    </li>
  </ul>
</template>

<style>
/* provisional tag-list */
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: start;
  align-items: center;
  margin-top: var(--sp-1);
  padding: 0;

  &.tag-list--outline {
    .tag-list__item {
      border: 1px solid var(--brand-dark);
    }
  }

  .tag-list__item {
    background-color: var(--white-100);
    /*border: 1px solid var(--brand-dark);*/
    color: var(--brand-dark);
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    /*font-family: Inter; TODO re-asses, clarify or implement*/
    font-weight: 400;
    font-size: 12px;
    line-height: 1;
    letter-spacing: 0;
    padding: 6px 9px;
    opacity: 0.75;
  }
}
</style>
