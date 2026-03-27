<template>
    <div class="camera-screen">
        <!-- BACKGROUND VIDEO -->
        <video class="bg-video" autoplay muted loop playsinline>
            <source src="/adobe-background.mp4" type="video/mp4" />
        </video>

        <!-- FOREGROUND CONTENT -->
        <div class="camera-content">
            <div class="title-wrapper">
                <h1 class="title">Scanning features...</h1>
                <div class="subtitle">Look straight to the camera!</div>
            </div>

            <div class="camera-wrapper">
                <!-- LIVE CAMERA -->
                <video ref="videoEl" autoplay playsinline class="camera-video"></video>

                <div v-if="isCountingDown" class="countdown-overlay">
                    <div class="countdown-badge">
                        {{ countdown }}
                    </div>
                </div>
            </div>

            <!-- CONTROLS -->
            <div class="controls">
                <Button variant="primary" @click="startCountdown" :disabled="!cameraReady || isCapturing || isCountingDown">
                    {{ isCountingDown || isCapturing ? "Get ready..." : "Take photo" }}
                </Button>
            </div>
        </div>

        <!-- HIDDEN CANVAS -->
        <canvas ref="canvasEl" class="hidden"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useDemoStore } from "../stores/demoStore";
import Button from "@/components/Button.vue";

const router = useRouter();
const demo = useDemoStore();

const videoEl = ref(null);
const canvasEl = ref(null);
const stream = ref(null);
const cameraReady = ref(false);
const countdown = ref(5);
const countdownProgress = ref(1);
const isCapturing = ref(false);
const isCountingDown = ref(false);

let countdownInterval = null;

// --------------------
// CAMERA INIT
// --------------------
onMounted(async () => {
    try {
        stream.value = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: false,
        });

        videoEl.value.srcObject = stream.value;

        videoEl.value.onloadedmetadata = () => {
            cameraReady.value = true;
            videoEl.value.play();
        };
    } catch (err) {
        alert("Camera access denied");
        console.error(err);
    }
});

// --------------------
// CLEANUP
// --------------------
onBeforeUnmount(() => {
    clearCountdown();
    stopCamera();
});

function stopCamera() {
    if (stream.value) {
        stream.value.getTracks().forEach(track => track.stop());
        stream.value = null;
    }
}

function clearCountdown() {
    if (countdownInterval) {
        window.clearInterval(countdownInterval);
        countdownInterval = null;
    }

    isCountingDown.value = false;
}

function startCountdown() {
    if (!cameraReady.value || isCapturing.value || isCountingDown.value) return;

    clearCountdown();

    isCountingDown.value = true;
    countdown.value = 5;
    countdownProgress.value = 1;

    countdownInterval = window.setInterval(() => {
        if (countdown.value <= 1) {
            clearCountdown();
            capturePhoto();
            return;
        }

        countdown.value -= 1;
        countdownProgress.value = countdown.value / 5;
    }, 1000);
}

// --------------------
// CAPTURE PHOTO
// --------------------
function capturePhoto() {
    if (isCapturing.value) return;

    const video = videoEl.value;
    const canvas = canvasEl.value;

    if (!video.videoWidth) return;

    isCapturing.value = true;
    clearCountdown();

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    // Mirror selfie
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    const preview = canvas.toDataURL("image/jpeg", 0.95);

    canvas.toBlob(
        blob => {
            demo.setPhoto({ blob, preview });

            stopCamera();
            router.push("/preview");
        },
        "image/jpeg",
        0.95
    );
}
</script>

<style scoped>
.camera-screen {
    position: relative;
    height: 100vh;
    width: 100%;
    overflow: hidden;
}

.camera-screen::after {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--brand-dark);
    opacity: 0.5;
    pointer-events: none;
    z-index: 1;
}

.title-wrapper {
    position: relative;
    justify-items: center;
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

/* FOREGROUND */
.camera-content {
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    gap: 60px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.title {
    margin-bottom: 1rem;
    color: white;
}

.subtitle {
    font-size: 2.5rem;
    color: white;
}

.camera-wrapper {
    position: relative;
    max-width: 520px;
    max-height: 600px;
}

.camera-video {
    width: 100%;
    border-radius: 16px;
    background: black;
    transform: scaleX(-1);
}

.hidden {
    display: none;
}

.countdown-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 2;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    padding: 1rem;
}

.countdown-badge {
    min-width: 72px;
    height: 72px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: var(--brand-dark);
    border: 3px solid var(--brand-primary);
    color: white;
    font-size: 2rem;
    line-height: 1;
    font-weight: 700;
    box-shadow:
        0 10px 24px rgba(0, 0, 72, 0.28),
        0 0 18px rgba(17, 199, 204, 0.35);
}
</style>
