<script lang="ts" setup>
import VueSelect from 'vue-select';
const props = defineProps(['options']);
</script>

<template>
  <VueSelect
    multiple
    :options="props.options"
  />
</template>

<style>
@import 'vue-select/dist/vue-select.css';

.v-select {
  --vs-border-radius: 25px;

  .vs__dropdown-toggle {
    min-height: 50px;
    align-items: center;
    background-color: var(--brand-dark);
    color: var(--white-100);
    padding-inline: 12px;
  }

  .vs__actions path {
    fill: var(--brand-primary);
  }

  .vs__selected {
    background-color: var(--brand-dark);
    color: var(--white-100);
    border-color: var(--white-100);
    padding: 4px 12px;
    border-radius: 2px;
    gap: 6px;

    path {
      fill: var(--white-100);
    }
  }
}
</style>
