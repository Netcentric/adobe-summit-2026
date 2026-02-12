<template>
  <div class="video-result-screen">
    <h1 class="title">Driver Introduction Ready</h1>

    <!-- VIDEO -->
    <div class="video-wrapper" v-if="demo.videoStatus === 'ready'">
      <video
        ref="videoEl"
        :src="demo.videoUrl"
        autoplay
        loop
        muted
        playsinline
        class="video"
      ></video>
    </div>

    <!-- FAILED STATE -->
    <div v-else-if="demo.videoStatus === 'failed'" class="error">
      <p>Video generation failed.</p>
      <p>Please proceed with the photo result.</p>
    </div>

    <!-- ACTIONS -->
    <div class="actions">
        <Button variant="secondary" icon="left" @click="restart">New Driver</Button>
        <Button variant="primary" icon="right" @click="finish">Finish</Button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDemoStore } from "../stores/demoStore";
import Button from "@/components/Button.vue";

const router = useRouter();
const demo = useDemoStore();
const videoEl = ref(null);

onMounted(() => {
  // Extra safety for kiosk autoplay
  if (videoEl.value) {
    videoEl.value.muted = true;
    videoEl.value.play().catch(() => {
      console.warn("Autoplay blocked — kiosk mode should allow it.");
    });
  }
});

// --------------------
// ACTIONS
// --------------------
function restart() {
  demo.resetAll();
  router.push("/");
}

function finish() {
  /**
   * Booth flow decision:
   * - Either go back to welcome
   * - Or auto-restart after timeout
   */
  demo.resetAll();
  router.push("/");
}
</script>

<style scoped>
.video-result-screen {
  height: 100vh;
  background: radial-gradient(circle at top, #111, #000);
  color: white;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.title {
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.video-wrapper {
  width: 100%;
  max-width: 720px;
  border-radius: 16px;
  overflow: hidden;
  background: black;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.6);
}

.video {
  width: 100%;
  height: auto;
  display: block;
}

.error {
  opacity: 0.7;
  text-align: center;
  margin-bottom: 2rem;
}

.actions {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  width: 100%;
  max-width: 520px;
}

.btn {
  flex: 1;
  padding: 0.85rem;
  border-radius: 999px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
}

.btn.primary {
  background: linear-gradient(90deg, #ff0033, #ff6600);
  color: white;
}
</style>