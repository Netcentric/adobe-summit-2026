<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Driver } from '../App.vue';

const props = defineProps<{ driver: Driver | null }>();

const emits = defineEmits(['start', 'stop']);

const currentDriver = ref<Driver | null>(null);

watch(props, (curr) => {
  // emits('stop', currentDriver);
  currentDriver.value = curr.driver || null;

  if (currentDriver.value) {
    emits('start');

    // simulate playtime
    setTimeout(() => {
      emits('stop', currentDriver.value);
    }, 6000);
  }
});
</script>

<template>
  <video
    class="videoplayer__video"
    v-if="currentDriver"
  >
    <source
      :src="currentDriver.video"
      type="video/mp4"
    />
  </video>
  <p v-else>no driver</p>
</template>

<style scoped></style>
