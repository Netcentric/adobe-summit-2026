<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true,
  }
})

</script>

<template>
  <video class="videoplayer__video">
    <source :src="props.src" type="video/mp4">
  </video>
</template>

<style scoped>
</style>
