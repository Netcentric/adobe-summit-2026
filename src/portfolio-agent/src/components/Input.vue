<script lang="ts" setup>
import { defineProps, onUnmounted, ref, watch } from 'vue';

const props = defineProps(['placeholder']);
const placeholder = ref('');

let timer = 0;

watch(props, () => {
  placeholder.value = Array.isArray(props.placeholder)
    ? props.placeholder[0]
    : props.placeholder || '';

  if (props.placeholder && props.placeholder.length > 0) {
    let counter = 0;

    timer = setInterval(
      () => {
        if (counter < props.placeholder.length - 1) {
          counter++;
        } else {
          counter = 0;
        }

        placeholder.value = props.placeholder[counter];
      },
      3600,
      { immediate: true }
    );
  } else {
  }
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<template>
  <input
    class="paragraph"
    type="text"
    :placeholder="placeholder"
  />
</template>

<style scoped>
input {
  width: 100%;
  height: 80px;
  display: block;
  padding-block: 26px;
  padding-inline: 35px;
  border-radius: 40px;
  border: 3px solid var(--brand-border-grey);
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 10px 15px 20px 0 rgba(0, 0, 72, 0.1);
}
input::placeholder {
  font-style: italic;
  color: rgba(0, 0, 0, 0.75);
}
input:focus {
  border-color: var(--brand-border-primary);
  outline: none;
}
</style>
