<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Input',
});
</script>

<template>
  <input
    class="paragraph"
    type="text"
    placeholder="Show AI in marketing"
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
