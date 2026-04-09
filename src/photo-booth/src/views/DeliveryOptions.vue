<template>
    <div class="final-screen">
        <!-- BACKGROUND VIDEO -->
        <video class="bg-video" autoplay muted loop playsinline>
            <source src="/agent-animation-bg.mp4" type="video/mp4" />
        </video>

        <div class="final-content">
            <!-- <div class="back-button">
                <Button variant="secondary" icon="left" @click="goBack" :disabled="processing">
                    Back
                </Button>
            </div> -->

            <h1 class="title">License granted!</h1>

            <div class="image-wrapper">
                <img :src="demo.selectedPhoto" alt="Selected photo" />

                <div class="frame-overlay">
                    <div class="frame-inner">
                        <span class="corner top-left"></span>
                        <span class="corner top-right"></span>
                        <span class="corner bottom-left"></span>
                        <span class="corner bottom-right"></span>
                    </div>
                </div>
            </div>

            <div class="actions">
                <Button variant="secondary" icon="left" @click="goBack" :disabled="processing">
                    Back
                </Button>
                <Button variant="primary" @click="printPhoto" :disabled="processing">
                    Print image
                </Button>
            </div>

            <div class="start-over">
                <a href="/camera" class="start-over-link" @click.prevent="startOver">
                    Start over with another photo
                </a>
            </div>
            <div class="disclaimer-bar">
                <strong>Asset Management (DAM):</strong> Your content is tagged, stored, and made accessible – just like in a digital asset management system for easy retrieval and tracking.
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useDemoStore } from "../stores/demoStore";
import Button from "@/components/Button.vue";
import { useRouter } from "vue-router";
import { approvePhotoboothImage, normalizeStatus } from "../lib/photoboothApi";

const router = useRouter();
const demo = useDemoStore();

const processing = ref(false);
const approvedOnce = ref(false);

onMounted(() => {
    if (!demo.selectedPhoto) {
        router.push("/result");
    }
});

async function approveSelectionIfNeeded() {
    if (approvedOnce.value) return;
    if (!demo.sessionId || !demo.selectedPhotoFilename) return;

    const approveData = await approvePhotoboothImage(demo.sessionId, demo.selectedPhotoFilename);
    const normalized = normalizeStatus(approveData);

    console.log("[PhotoBooth Debug] approveSelectionIfNeeded approveData", approveData);
    console.log("[PhotoBooth Debug] approveSelectionIfNeeded normalized", normalized);

    if (normalized.personName) {
        demo.detectedName = normalized.personName;
    }

    if (normalized.company) {
        demo.detectedCompany = normalized.company;
    }

    if (normalized.email) {
        demo.detectedEmail = normalized.email;
    }

    if (normalized.landingPage) {
        demo.setLandingPage(normalized.landingPage);
    }

    demo.setStopGenerationPolling(true);
    approvedOnce.value = true;
}

async function printPhoto() {
    try {
        processing.value = true;
        await approveSelectionIfNeeded();
        router.push("/print-setup");
    } catch (err) {
        console.error("Approve failed before print:", err);
    } finally {
        processing.value = false;
    }
}

function goBack() {
    router.push("/result");
}

function startOver() {
    demo.resetPhoto();
    router.push("/camera");
}
</script>

<style scoped lang="scss">
.final-screen {
    position: relative;
    min-height: 100vh;
    width: 100%;
    overflow: hidden;
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

.final-content {
    position: relative;
    z-index: 2;
    min-height: 100vh;
    padding: 2rem;
    display: flex;
    gap: 2rem;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.title {
    font-size: 4.5rem;
    margin-top: -40px;
    line-height: 1.1em;

    @include big-screen {
        margin-bottom: 10px;
    }
}

.image-wrapper {
    position: relative;
    max-width: 550px;
    margin-block: 2rem;
}

.image-wrapper img {
    width: 100%;
    display: block;
}

@media screen and (max-width: 1280px) {
    .image-wrapper img {
        max-height: 500px;
    }    
}

.actions {
    display: flex;
    gap: 1rem;
}

.back-button {
    align-self: flex-start;
}

.frame-overlay {
    position: absolute;
    inset: -16px;
    pointer-events: none;
    z-index: 2;
}

.frame-inner {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 16px;
}

.corner {
    position: absolute;
    width: 50px;
    height: 50px;
    border-color: #26EFE9;
    border-style: solid;
    border-width: 0;
}

.top-left {
    top: -2px;
    left: -2px;
    border-top-width: 4px;
    border-left-width: 4px;
}

.top-right {
    top: -2px;
    right: -2px;
    border-top-width: 4px;
    border-right-width: 4px;
}

.bottom-left {
    bottom: -2px;
    left: -2px;
    border-bottom-width: 4px;
    border-left-width: 4px;
}

.bottom-right {
    bottom: -2px;
    right: -2px;
    border-bottom-width: 4px;
    border-right-width: 4px;
}

.start-over {
    color: var(--action-link-color);
}
</style>
