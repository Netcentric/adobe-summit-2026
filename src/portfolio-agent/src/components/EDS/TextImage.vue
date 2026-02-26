<script setup lang="ts">
const props = defineProps(['node']);
</script>

<template>
    <div class="block textimage" v-html="props.node.innerHTML"></div>
</template>

<style lang="css">
.textimage {
  /* row */
  > div {
    display: flex;
    flex-direction: row;
    gap: var(--sp-1);
  }

  /* column */
  > div > div {
    flex: 0 1 48%;
  }
}
</style>