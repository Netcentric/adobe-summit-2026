<script setup lang="ts">
const props = defineProps(['node']);
</script>

<template>
    <div class="block cards" v-html="props.node.innerHTML"></div>
</template>

<style lang="scss">
.cards {
  display: flex;
  flex-direction: column;
  gap: 16px;

  @include bp-min ($bp-tablet) {
    display: grid;
    gap: 25px 22px;
    grid-template-columns: 1fr 1fr;

  }

  /* card item */
  > div {
    border-left: 5px solid var(--brand-primary);
    padding: 20px 20px 20px 15px;
    background-color: var(--grey-15);

    @include bp-min($bp-tablet) {
      padding: 40px 40px 40px 35px;
    }
  }

  /* card title */
  > div > div:first-child {
    font-weight: 600;
    font-size: 16px;
    line-height: 120%;
    letter-spacing: 0;
    margin-bottom: 8px;

    @include bp-min($bp-tablet) {
      font-size: 20px;
      margin-bottom: var(--sp-1);
    }
  }
}
</style>