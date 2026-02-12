<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useDemoStore } from "../stores/demoStore";
import { enableFullscreenOnce } from "../kiosk/fullscreen";
import ConsentModal from "../components/ConsentModal.vue";
import Button from "@/components/Button.vue";

const router = useRouter();
const demo = useDemoStore();

// --------------------
// ATTRACT / INTRO STATE
// --------------------
// attract = true  → attract loop (idle)
// attract = false → intro CTA
const attract = ref(false);
const showConsent = ref(false);

// let idleTimer = null;
// const ATTRACT_DELAY = 90_000; // 90s idle to enter attract mode

// function resetIdle() {
//   clearTimeout(idleTimer);

//   // Any interaction exits attract mode
//   attract.value = false;

//   idleTimer = setTimeout(() => {
//     attract.value = true;
//   }, ATTRACT_DELAY);
// }

// --------------------
// USER ACTIONS
// --------------------
// function enterIntro() {
//   // First intentional interaction
//   resetIdle();
// }

// --------------------
// USER CONSENT
// --------------------
function openConsent() {
  showConsent.value = true;
}

function onConsentConfirmed() {
  enableFullscreenOnce();
  demo.approved = true;
  demo.goTo("camera");
  router.push("/camera");
}

// --------------------
// LIFECYCLE
// --------------------
// onMounted(() => {
//   // Start in attract mode
//   idleTimer = setTimeout(() => {
//     attract.value = true;
//   }, ATTRACT_DELAY);

//   window.addEventListener("click", resetIdle);
//   window.addEventListener("touchstart", resetIdle);
// });

// onBeforeUnmount(() => {
//   clearTimeout(idleTimer);
//   window.removeEventListener("click", resetIdle);
//   window.removeEventListener("touchstart", resetIdle);
// });
</script>

<template>
  <div class="welcome-screen">
    <!-- ATTRACT LOOP (IDLE) -->
    <div
      v-if="attract"
      class="attract"
      @click="enterIntro"
    >
      <!-- OPTION A: looping video -->
      <!--
      <video
        autoplay
        muted
        loop
        playsinline
        class="attract-video"
        src="/attract-loop.mp4"
      />
      -->

      <!-- OPTION B: animated telemetry -->
      <div class="telemetry">
        <div class="line">AI AGENTS: ONLINE</div>
        <div class="line">RACE MODE: ON</div>
        <div class="line subtle">TOUCH TO BEGIN..</div>
      </div>
    </div>

    <!-- INTRO / CTA -->
    <div v-else class="intro">
        <div class="intro-content">
            <h1>We’ve got a Grand <br> Prix seat open.</h1>
            <h2>Ready to suit up?</h2>
            <!-- <button class="start-btn" @click.stop="openConsent">
                Start your Racing Moment
            </button> -->
            <Button variant="primary" icon="right"
                @click.stop="openConsent"
            >Start your Racing Moment</Button>
        </div>

        <!-- POLAROID PREVIEW -->
        <div class="photo-stage">
            <div class="photo-stack">
                <div class="photo-card photo-card--left-far">
                <img src="/driver1.png" />
                </div>

                <div class="photo-card photo-card--left-near">
                <img src="/driver2.png" />
                </div>

                <div class="photo-card photo-card--center">
                <img src="/driver3.jpg" />
                </div>

                <div class="photo-card photo-card--right-near">
                <img src="/driver4.png" />
                </div>

                <div class="photo-card photo-card--right-far">
                <img src="/driver5.png" />
                </div>
            </div>
        </div>
    </div>

    <!-- CONSENT MODAL -->
    <ConsentModal
        v-model="showConsent"
        @confirm="onConsentConfirmed"
    />
  </div>
</template>

<style scoped>
.welcome-screen {
  height: 100vh;
  width: 100vw;
}

/* ATTRACT MODE */
.attract {
  cursor: pointer;
  animation: pulse 2.5s infinite;
}

.telemetry {
  font-family: monospace;
  letter-spacing: 0.18em;
  font-size: 0.95rem;
}

.telemetry .line {
  margin: 0.7rem 0;
  opacity: 0.85;
}

.telemetry .subtle {
  opacity: 0.5;
  margin-top: 4rem;
  margin-top: 3.2rem;
  font-size: xx-large;
}

/* INTRO */
.intro {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.intro-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    margin-top: 20px;
    margin-left: 80px;
}

.start-btn {
  padding: 0.9rem 2.2rem;
  border-radius: 999px;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.2s ease;
}

.start-btn:hover {
  transform: scale(1.03);
}

.modal {
  background: white;
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: var(--brand-dark);
  width: 613px;
  border-radius: 16px;
  padding: 1.6rem;
  text-align: left;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal h2 {
  margin-bottom: 0.75rem;
}

.modal-text {
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.checkbox {
  display: flex;
  gap: 0.6rem;
  font-size: 0.9rem;
  margin-bottom: 1.4rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

button.secondary {
  background: transparent;
  color: var(--brand-dark);
}

/* VIDEO (if used) */
.attract-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* SUBTLE MOTION */
@keyframes pulse {
  0% { opacity: 0.55; }
  50% { opacity: 1; }
  100% { opacity: 0.55; }
}

/* -------------------- */
/* POLAROID STAGE */
/* -------------------- */

/* -------------------- */
/* PHOTO STAGE */
/* -------------------- */

.photo-stage {
  position: relative;
  width: 100%;
  height: 440px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.photo-stack {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Base card */
.photo-card {
  position: absolute;
  width: 300px;
  background: white;
  padding: 12px 12px 40px 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  transition: transform 0.5s ease;
}

.photo-card img {
  width: 100%;
  height: 280px;
  object-fit: cover;
  display: block;
}

/* Center (main focus) */
.photo-card--center {
  transform: rotate(0deg) scale(1.2);
  z-index: 5;
}

/* Left Near */
.photo-card--left-near {
  transform: translateX(-25vw) rotate(-12deg);
  filter: blur(2px);
  z-index: 3;
}

/* Left Far */
.photo-card--left-far {
  transform: translateX(-45vw) rotate(20deg);
  filter: blur(2px);
  opacity: 0.7;
  z-index: 2;
}

/* Right Near */
.photo-card--right-near {
  transform: translateX(25vw) rotate(12deg);
  filter: blur(2px);
  z-index: 3;
}

/* Right Far */
.photo-card--right-far {
  transform: translateX(45vw) rotate(-20deg);
  filter: blur(2px);
  opacity: 0.7;
  z-index: 2;
}
</style>