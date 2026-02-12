<template>
  <div class="app-shell">
    <AppHeader />
    <router-view />
  </div>
</template>

<style scoped>
  .app-shell {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>

<script setup>
// import { onMounted } from "vue";
import { useRouter } from "vue-router";
// import { useKiosk } from "./kiosk/useKiosk";
import AppHeader from "./components/AppHeader.vue";

const router = useRouter();
// const kiosk = useKiosk(router);

// onMounted(() => {
//   kiosk.startListening();
// });
</script>