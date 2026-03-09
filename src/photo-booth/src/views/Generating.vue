<template>
    <div class="generating-screen">
        <video class="bg-video" autoplay muted loop playsinline>
            <source src="/adobe-background.mp4" type="video/mp4" />
        </video>

        <div class="content">
            <div class="telemetry-single">
                <h1 class="telemetry-text">
                    I’m creating your <br /> personal racing moment …
                </h1>
            </div>

            <transition name="fade" mode="out-in">
                <p :key="currentHintIndex" class="hint">
                    {{ hint }}
                </p>
            </transition>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useDemoStore } from "../stores/demoStore";
import { raceConfig } from "../config/raceConfig";
import {
    startPhotobooth,
    uploadOriginalPhoto,
    getPhotoboothStatus,
    normalizeStatus,
} from "../lib/photoboothApi";

const router = useRouter();
const demo = useDemoStore();

const hintMessages = [
    "This takes about 10–15 seconds.",
    "Strapping you into the cockpit … mirrors adjusted.",
    "Helmet on – biometric scan complete.",
    "Calibrating aerodynamics to your profile.",
];

const currentHintIndex = ref(0);
const hint = ref(hintMessages[0]);

let stepTimer = null;
let pollTimer = null;

function getEraConfig() {
    return raceConfig.eras.find((item) => item.id === demo.era);
}

function getCircuitConfig() {
    return raceConfig.circuits.find((item) => item.id === demo.region);
}

async function runGenerationFlow() {
    try {
        const era = getEraConfig();
        const circuit = getCircuitConfig();

        if (!demo.photoBlob || !era || !circuit) {
            throw new Error("Missing photo, era, or circuit");
        }

        const startData = await startPhotobooth({
            eraTitle: era.title,
            eraYears: era.years,
            eraDetail: era.promptStyle || era.title,
            circuitName: circuit.name,
            circuitLocation: circuit.country,
        });

        demo.sessionId = startData.session;

        await uploadOriginalPhoto(startData.uploadUrl, demo.photoBlob);

        await waitForPhotos(startData.session);

        clearInterval(stepTimer);
        clearInterval(pollTimer);

        router.push("/result");
    } catch (err) {
        console.error("Generation failed:", err);
        clearInterval(stepTimer);
        clearInterval(pollTimer);
        router.push("/preview");
    }
}

async function waitForPhotos(sessionId) {
    return new Promise((resolve, reject) => {
        pollTimer = setInterval(async () => {
            try {
                const statusData = await getPhotoboothStatus(sessionId);
                const normalized = normalizeStatus(statusData);

                if (normalized.personName) {
                    demo.detectedName = normalized.personName;
                }

                if (normalized.videoUrl) {
                    demo.setGeneratedVideo(normalized.videoUrl);
                }

                if (normalized.photoUrls.length > 0) {
                    demo.setImageSelection(normalized.imageSelection);
                    demo.setGeneratedPhotos(normalized.photoUrls);
                    console.log("photo count:", normalized.photoUrls.length, normalized.photoUrls);
                }

                // temporary: wait until at least 3 images
                if (normalized.photoUrls.length >= 3) {
                    clearInterval(pollTimer);
                    resolve();
                }
            } catch (err) {
                clearInterval(pollTimer);
                reject(err);
            }
        }, 4000);
    });
}

onMounted(() => {
    stepTimer = setInterval(() => {
        if (currentHintIndex.value < hintMessages.length - 1) {
            currentHintIndex.value++;
            hint.value = hintMessages[currentHintIndex.value];
        }
    }, 3000);

    runGenerationFlow();
});

onBeforeUnmount(() => {
    clearInterval(stepTimer);
    clearInterval(pollTimer);
});
</script>

<style scoped>
.generating-screen {
    position: relative;
    height: 100vh;
    width: 100%;
    overflow: hidden;
    color: rgba(38, 239, 233, 1);
    display: flex;
    align-items: center;
    justify-content: center;
}

.bg-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
}

.content {
    position: relative;
    z-index: 2;
    width: 100%;
    padding: 2rem;
    text-align: center;
}

.telemetry-single {
    margin-bottom: 2rem;
}

.telemetry-text {
    color: white;
}

.hint {
    font-size: 2.5rem;
    opacity: 0.8;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>