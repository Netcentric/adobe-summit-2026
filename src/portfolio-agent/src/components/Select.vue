<script lang="ts" setup>
import VueSelect from 'vue-select';
import SelectChevron from './SelectChevron.vue';
const props = defineProps(['options']);
</script>

<template>
  <VueSelect
    multiple
    :options="props.options"
    :components="{ OpenIndicator: SelectChevron }"
  />
</template>

<style>
@import 'vue-select/dist/vue-select.css';

.v-select {
  --vs-border-radius: 25px;

  .vs__dropdown-toggle {
    min-height: 50px;
    height: 100%;
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
    color: var(--brand-primary);
    border-color: var(--brand-primary);
    padding: 4px 12px;
    border-radius: 2px;
    gap: 6px;

    button {
      color: inherit;
    }
    path {
      fill: currentColor;
    }
  }
}
</style>
