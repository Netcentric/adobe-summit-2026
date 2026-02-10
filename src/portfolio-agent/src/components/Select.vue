<script lang="ts" setup>
const props = defineProps(['options']);
</script>

<template>
  <select>
    <option
      v-for="option in props.options"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>

<style scoped></style>
