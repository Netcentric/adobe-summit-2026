<script setup lang="ts">
const props = defineProps(['node']);
</script>

<template>
    <div class="block cards" v-html="props.node.innerHTML"></div>
</template>

<style lang="css">
.cards {
  display: grid;
  gap: 25px 22px;
  grid-template-columns: 1fr 1fr;

  /* card item */
  > div {
    border-left: 5px solid var(--brand-primary);
    padding: 40px 40px 40px 35px;
    background-color: var(--grey-15);
  }

  /* card title */
  > div > div:first-child {
    font-weight: 600;
    font-size: 20px;
    line-height: 120%;
    letter-spacing: 0;
    margin-bottom: var(--sp-1);
  }
}
</style>