<template>
  <div class="result-screen">
    <h1 class="title">🏁 Your Race Card</h1>

    <!-- GENERATED IMAGE -->
    <div class="image-wrapper">
      <img
        v-if="demo.generatedImage"
        :src="demo.generatedImage"
        class="result-image"
        alt="Generated race portrait"
      />
    </div>

    <!-- META INFO -->
    <div class="meta">
      <span>{{ demo.era }}</span>
      <span>·</span>
      <span>{{ demo.region }}</span>
    </div>

    <!-- BADGE CARD PREVIEW -->
    <div class="badge">
      <div class="badge-image">
        <img
          :src="demo.generatedImage"
          alt="Badge preview"
        />
      </div>

      <div class="badge-info">
        <h2>FORMULA 1 · RACE CARD</h2>
        <p>{{ demo.era }} · {{ demo.region }}</p>

        <!-- QR PLACEHOLDER -->
        <div class="qr-placeholder">
            <span>QR</span>
        </div>
      </div>
    </div>

    <!-- ACTIONS -->
    <div class="actions">
        <Button variant="secondary" icon="left" @click="reset">Start Over</Button>
        <Button variant="primary" icon="right" @click="goToVideo">Generate Driver Video</Button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useDemoStore } from "../stores/demoStore";
import Button from "@/components/Button.vue";

// --------------------
const router = useRouter();
const demo = useDemoStore();

// --------------------
function reset() {
  demo.resetAll();
  router.push("/");
}

function goToVideo() {
  // 🔒 Reset video state so we start clean
  demo.resetVideo();

  // Explicit user intent → start video flow
  router.push("/video-generating");
}
</script>

<style scoped>
.result-screen {
  min-height: 100vh;
  background: #0b0b0b;
  color: white;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  margin-bottom: 1rem;
}

.image-wrapper {
  width: 100%;
  max-width: 420px;
  margin-bottom: 1rem;
}

.result-image {
  width: 100%;
  border-radius: 16px;
}

.meta {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 2rem;
}

.badge {
  width: 100%;
  max-width: 400px;
  background: linear-gradient(135deg, #111, #1a1a1a);
  border-radius: 16px;
  display: flex;
  overflow: hidden;
  margin-bottom: 1rem;
}

.badge-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badge-info {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.badge-info h2 {
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  line-height: 30px;
}

.badge-info p {
  font-size: 0.85rem;
  opacity: 0.85;
  margin: 0;
}

.qr-placeholder {
  width: 90px;
  height: 90px;
  border: 2px dashed #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  opacity: 0.6;
  align-self: center;
  margin-top: 12px;
}

.actions {
  display: flex;
  width: 100%;
  max-width: 420px;
  gap: 12px;
}

.btn {
  width: 100%;
  padding: 0.85rem;
  border-radius: 999px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
}
</style>