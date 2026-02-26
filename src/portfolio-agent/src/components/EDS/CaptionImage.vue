<script setup lang="ts">
const props = defineProps(['node']);
</script>

<template>
    <div class="block captionimage" v-html="props.node.innerHTML"></div>
</template>

<style lang="css">
.captionimage {
  /* layout */
  > div {
    display: flex;
    flex-direction: column;
    gap: var(--sp-1);
  }

  /* caption */
  > div > div:last-child {
    /* paragraph small */
    font-weight: 400;
    font-style: normal;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0;
    vertical-align: middle;
  }
}
</style>