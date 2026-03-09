<template>
    <div class="camera-screen">
        <h2 class="title">Scanning features...</h2>
        <div>Look straight to the camera!</div>

        <div class="camera-wrapper">
            <!-- LIVE CAMERA -->
            <video ref="videoEl" autoplay playsinline class="camera-video"></video>

            <!-- FACE ALIGNMENT OVERLAY -->
            <div class="face-overlay">
                <div class="scan-rect">
                    <span class="corner top-left"></span>
                    <span class="corner top-right"></span>
                    <span class="corner bottom-left"></span>
                    <span class="corner bottom-right"></span>
                </div>
            </div>
        </div>

        <!-- CONTROLS -->
        <div class="controls">
            <Button variant="primary" @click="capturePhoto" :disabled="!cameraReady">
                Take Photo
            </Button>
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
    stopCamera();
});

function stopCamera() {
    if (stream.value) {
        stream.value.getTracks().forEach(track => track.stop());
        stream.value = null;
    }
}

// --------------------
// CAPTURE PHOTO
// --------------------
function capturePhoto() {
    const video = videoEl.value;
    const canvas = canvasEl.value;

    if (!video.videoWidth) return;

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

            // Stop camera before navigating
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
    height: 100vh;
    display: flex;
    gap: 30px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.title {
    margin-bottom: 1rem;
}

.camera-wrapper {
    position: relative;
    width: 90%;
    max-width: 520px;
    overflow: hidden;
}

.camera-video {
    width: 100%;
    border-radius: 16px;
    background: black;
    transform: scaleX(-1);
}

.controls {
    margin-top: 1.5rem;
    display: flex;
    gap: 1rem;
}

.hidden {
    display: none;
}

/* FACE OVERLAY */
.face-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 2;
}

.scan-rect {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40%;
    height: 70%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.65);
}

/* CORNERS */
.corner {
    position: absolute;
    width: 40px;
    height: 40px;
    border-color: #26EFE9;
    border-style: solid;
    border-width: 0;
    animation: pulseCorner 2s infinite ease-in-out;
}

.top-left {
    top: 0;
    left: 0;
    border-top-width: 4px;
    border-left-width: 4px;
}

.top-right {
    top: 0;
    right: 0;
    border-top-width: 4px;
    border-right-width: 4px;
}

.bottom-left {
    bottom: 0;
    left: 0;
    border-bottom-width: 4px;
    border-left-width: 4px;
}

.bottom-right {
    bottom: 0;
    right: 0;
    border-bottom-width: 4px;
    border-right-width: 4px;
}

@keyframes pulseCorner {
    0% {
        opacity: 0.6;
    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0.6;
    }
}
</style>