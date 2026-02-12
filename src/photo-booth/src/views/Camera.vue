<template>
  <div class="camera-screen">
    <h2 class="title">Scanning features... </h2>
    <div>Look straight to the camera!</div>

    <div v-show="!hasPhoto" class="camera-wrapper">
        <!-- LIVE CAMERA -->
        <video
            v-show="!hasPhoto"
            ref="videoEl"
            autoplay
            playsinline
            class="camera-video"
        ></video>

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

    <!-- CAPTURED IMAGE -->
    <img
      v-show="hasPhoto"
      :src="photoPreview"
      class="camera-preview"
      alt="Captured photo"
    />

    <!-- CONTROLS -->
    <div class="controls">
        <Button v-if="!hasPhoto"
            variant="primary"
            icon="right"
            @click="capturePhoto"
            :disabled="!cameraReady"
            >Take Photo</Button>
      
        <Button v-if="hasPhoto"
                variant="secondary"
                icon="left"
                @click="retakePhoto"
                >Retake</Button>

        <Button v-if="hasPhoto"
                    variant="primary"
                    icon="right"
                    @click="goNext"
                    >Continue</Button>
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

// --------------------
// SETUP
// --------------------
const router = useRouter();
const demo = useDemoStore();

const videoEl = ref(null);
const canvasEl = ref(null);

const stream = ref(null);
const cameraReady = ref(false);

const hasPhoto = ref(false);
const photoPreview = ref(null);

// --------------------
// CAMERA INIT
// --------------------
onMounted(async () => {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false
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
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop());
  }
});

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

  // Mirror image (selfie)
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0);

  // Preview
  photoPreview.value = canvas.toDataURL("image/jpeg", 0.95);

  // Blob for upload
  canvas.toBlob(blob => {
    demo.setPhoto({blob, preview: photoPreview.value});
    hasPhoto.value = true;
  }, "image/jpeg", 0.95);
}

// --------------------
// RETAKE
// --------------------
function retakePhoto() {
  demo.resetPhoto();
  hasPhoto.value = false;
  photoPreview.value = null;
}

// --------------------
// NEXT STEP
// --------------------
function goNext() {
  console.log("photoBlob in store:", demo.photoBlob);
  router.push("/preview");
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

.camera-video,
.camera-preview {
  width: 90%;
  max-width: 520px;
  border-radius: 16px;
  background: black;
}

.controls {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.25rem;
  border-radius: 999px;
  font-size: 1rem;
  cursor: pointer;
  border: none;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hidden {
  display: none;
}

.camera-video {
  transform: scaleX(-1);
}

/* FACE OVERLAY */
.camera-wrapper {
  position: relative;
  width: 90%;
  max-width: 520px;
  overflow: hidden;
}

/* VIDEO */
.camera-video {
  width: 100%;
  border-radius: 16px;
  background: black;
  transform: scaleX(-1);
}

/* OVERLAY */
.face-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
}

/* Transparent scan area with dark outside */
.scan-rect {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40%;
  height: 70%;
  transform: translate(-50%, -50%);

  /* THIS CREATES THE DARK OUTSIDE */
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
}

/* Top Left */
.top-left {
  top: 0;
  left: 0;
  border-top-width: 4px;
  border-left-width: 4px;
}

/* Top Right */
.top-right {
  top: 0;
  right: 0;
  border-top-width: 4px;
  border-right-width: 4px;
}

/* Bottom Left */
.bottom-left {
  bottom: 0;
  left: 0;
  border-bottom-width: 4px;
  border-left-width: 4px;
}

/* Bottom Right */
.bottom-right {
  bottom: 0;
  right: 0;
  border-bottom-width: 4px;
  border-right-width: 4px;
}

.corner {
  animation: pulseCorner 2s infinite ease-in-out;
}

@keyframes pulseCorner {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
</style>