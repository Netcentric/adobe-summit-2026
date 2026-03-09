<template>
    <div class="welcome-screen">
        <!-- BACKGROUND VIDEO -->
        <video class="bg-video" autoplay muted loop playsinline>
            <source src="/agent-animation-bg.mp4" type="video/mp4" />
        </video>

        <div v-if="attract" class="attract" @click="enterIntro">
            <div class="telemetry">
                <div class="line">AI AGENTS: ONLINE</div>
                <div class="line">RACE MODE: ON</div>
                <div class="line subtle">TOUCH TO BEGIN..</div>
            </div>
        </div>

        <div v-else class="intro">
            <div class="intro-content">
                <h1>We’ve got a Grand <br> Prix seat open.</h1>
                <h2>Ready to suit up?</h2>
                <Button variant="primary" icon="right" @click.stop="openConsent">
                    Start your Racing Moment
                </Button>
            </div>

            <div class="photo-stage">
                <div class="photo-stack">
                    <div v-for="(image, index) in rotatingImages" :key="`${image}-${index}`" class="photo-card"
                        :class="positionClasses[index]">
                        <img :src="image" alt="" />
                    </div>
                </div>
            </div>
        </div>

        <ConsentModal v-model="showConsent" @confirm="onConsentConfirmed" />
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useDemoStore } from "../stores/demoStore";
import { enableFullscreenOnce } from "../kiosk/fullscreen";
import ConsentModal from "../components/ConsentModal.vue";
import Button from "@/components/Button.vue";

const router = useRouter();
const demo = useDemoStore();

const attract = ref(false);
const showConsent = ref(false);

const rotatingImages = ref([
    "./driver1.png",
    "./driver2.png",
    "./driver3.jpg",
    "./driver4.png",
    "./driver5.png",
]);

const positionClasses = [
    "photo-card--left-far",
    "photo-card--left-near",
    "photo-card--center",
    "photo-card--right-near",
    "photo-card--right-far",
];

let carouselTimer = null;

function rotateImages() {
    const first = rotatingImages.value.shift();
    rotatingImages.value.push(first);
}

function openConsent() {
    showConsent.value = true;
}

function onConsentConfirmed() {
    enableFullscreenOnce();
    demo.acceptConsent();
    router.push("/camera");
}

function enterIntro() {
    attract.value = false;
}

onMounted(() => {
    carouselTimer = setInterval(() => {
        rotateImages();
    }, 3200);
});

onBeforeUnmount(() => {
    clearInterval(carouselTimer);
});
</script>

<style scoped>
.welcome-screen {
    height: 100vh;
    width: 100vw;
}

/* BACKGROUND VIDEO */
.bg-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
}

/* ATTRACT MODE */
.attract {
    cursor: pointer;
    animation: pulse 2.5s infinite;
}

.attract,
.intro {
    position: relative;
    z-index: 2;
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
    margin-top: 3.2rem;
    font-size: xx-large;
}

/* INTRO */
.intro {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.intro-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    margin-top: 20px;
    margin-left: 80px;
}

/* SUBTLE MOTION */
@keyframes pulse {
    0% {
        opacity: 0.55;
    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0.55;
    }
}

/* PHOTO STAGE */
.photo-stage {
    position: relative;
    width: 100%;
    height: 480px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.photo-stage::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(circle at center,
            rgba(255, 255, 255, 0) 45%,
            rgba(255, 255, 255, 0.35) 100%);
    z-index: 1;
}

.photo-stack {
    position: relative;
    width: 100%;
    height: 100%;
}

/* Base card */
.photo-card {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300px;
    background: white;
    padding: 12px 12px 40px 12px;
    box-shadow: 0 28px 50px rgba(0, 0, 0, 0.18);
    transform-origin: center center;
    transition:
        transform 0.95s cubic-bezier(0.22, 1, 0.36, 1),
        filter 0.95s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.95s cubic-bezier(0.22, 1, 0.36, 1),
        box-shadow 0.95s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: transform, opacity, filter;
    z-index: 2;
}

.photo-card img {
    width: 100%;
    height: 280px;
    object-fit: cover;
    display: block;
}

/* Center */
.photo-card--center {
    transform: translate(-50%, -50%) scale(1.18) rotate(0deg);
    filter: blur(0);
    opacity: 1;
    z-index: 5;
    box-shadow: 0 34px 64px rgba(0, 0, 0, 0.22);
}

/* Left Near */
.photo-card--left-near {
    transform: translate(calc(-50% - 24vw), calc(-50% + 10px)) scale(0.96) rotate(-12deg);
    filter: blur(1.5px);
    opacity: 0.9;
    z-index: 4;
}

/* Left Far */
.photo-card--left-far {
    transform: translate(calc(-50% - 42vw), calc(-50% + 22px)) scale(0.82) rotate(18deg);
    filter: blur(3px);
    opacity: 0.55;
    z-index: 3;
}

/* Right Near */
.photo-card--right-near {
    transform: translate(calc(-50% + 24vw), calc(-50% + 10px)) scale(0.96) rotate(12deg);
    filter: blur(1.5px);
    opacity: 0.9;
    z-index: 4;
}

/* Right Far */
.photo-card--right-far {
    transform: translate(calc(-50% + 42vw), calc(-50% + 22px)) scale(0.82) rotate(-18deg);
    filter: blur(3px);
    opacity: 0.55;
    z-index: 3;
}
</style>