<template>
  <div class="printing-screen">
    <h1 class="title">
      Your racing moment is being printed …
    </h1>

    <div class="stage">
      <!-- POLAROID -->
      <div class="polaroid">
        <img :src="demo.selectedPhoto" class="photo" />

        <!-- BOTTOM OVERLAY -->
        <div class="bottom-overlay">
          <!-- EMAIL CONFIRM -->
          <Button
            v-if="demo.printEmail"
            variant="primary"
            icon="right"
            @click="handleEmail"
            class="email-btn"
          >
            Sent to Email
          </Button>

          <!-- QR CODE -->
          <img :src="qrCodeUrl" class="qr-code" />
        </div>
      </div>
    </div>

    <!-- START OVER -->
    <div class="start-over">
      <a
        href="/camera"
        class="start-over-link"
        @click.prevent="startOver"
      >
        Start over with another photo
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDemoStore } from "../stores/demoStore";
import Button from "@/components/Button.vue";

const router = useRouter();
const demo = useDemoStore();

/* -----------------------------------------
   GUARD
----------------------------------------- */
onMounted(() => {
  if (!demo.selectedPhoto) {
    router.push("/result");
  }
});

/* -----------------------------------------
   RANDOM QR GENERATOR
----------------------------------------- */

// Using public QR generator API
const qrCodeUrl = computed(() => {
  const randomValue = Math.random().toString(36).substring(2);
  const data = `https://adobe-summit-demo.com/${randomValue}`;

  return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(data)}`;
});

/* -----------------------------------------
   EMAIL HANDLER
----------------------------------------- */

function handleEmail() {
  // Later: call backend email endpoint
  console.log("Sending to:", demo.printEmail);
}

/* -----------------------------------------
   START OVER
----------------------------------------- */

function startOver() {
  demo.resetAll();
  router.push("/");
}
</script>

<style scoped>
.printing-screen {
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.title {
  font-size: 2.8rem;
  text-align: center;
}

/* Stage */
.stage {
  position: relative;
  width: 520px;
  display: flex;
  justify-content: center;
}

/* Polaroid */
.polaroid {
  background: white;
  padding: 1rem;
  padding-bottom: 3rem;
  width: 320px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  transform: rotate(-3deg);
  position: relative;
}

.photo {
  width: 100%;
  display: block;
}

/* Bottom floating overlay */
.bottom-overlay {
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
}

/* QR */
.qr-code {
  width: 90px;
  height: 90px;
  background: white;
  padding: 6px;
  border-radius: 8px;
}

/* Email button */
.email-btn {
  font-size: 0.85rem;
}

/* Start over */
.start-over {
  margin-top: 6rem;
}

.start-over-link {
  cursor: pointer;
}

.start-over-link:hover {
  opacity: 0.7;
}
</style>