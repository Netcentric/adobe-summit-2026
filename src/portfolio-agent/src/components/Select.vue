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
</style>
