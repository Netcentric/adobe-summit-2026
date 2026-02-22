<template>
    <div class="generating-screen">

        <!-- VIDEO BACKGROUND -->
        <video
            class="bg-video"
            autoplay
            muted
            loop
            playsinline
        >
            <source src="./photo-booth/adobe-background.mp4" type="video/mp4" />
        </video>

        <!-- CONTENT -->
        <div class="content">
            <!-- SINGLE MESSAGE -->
            <div class="telemetry-single">
                <transition name="fade" mode="out-in">
                    <p :key="currentStep" class="telemetry-text">
                        {{ telemetry[currentStep] }}
                    </p>
                </transition>
            </div>
            <p class="hint">{{ hint }}</p>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useDemoStore } from "../stores/demoStore";

const router = useRouter();
const demo = useDemoStore();

/* -----------------------------------------
   🔥 TOGGLE HERE
----------------------------------------- */
const MOCK_MODE = true;

/* -----------------------------------------
   UI STATE
----------------------------------------- */
const telemetry = [
    "Initializing AI rendering pipeline…",
    "Uploading driver image to cloud…",
    "Generating race profile visuals…",
    "Finalizing cinematic output…",
];

const currentStep = ref(0);
const progress = ref(0);
const hint = ref("Optimizing race profile…");

let stepTimer = null;

/* -----------------------------------------
   🧪 MOCK FLOW (FRONTEND ONLY)
----------------------------------------- */
async function runMockFlow() {
    console.log("🧪 Running MOCK generation");

    // Simulate progress timing
    await new Promise(resolve => setTimeout(resolve, 6000));

    // Fake session
    demo.uuid = "mock-uuid-123";

    // These must match what result.vue expects
    demo.generatedPhotos = [
        "/mocks/generated-driver-1.jpg",
        "/mocks/generated-driver-2.jpg",
        "/mocks/generated-driver-3.jpg",
        "/mocks/generated-driver-4.jpg",
    ];

    demo.generatedVideo = "/mock/video.mp4";

    // IMPORTANT: mark as generated
    demo.generated = true;

    progress.value = 100;
    hint.value = "Driver profile ready";

    clearInterval(stepTimer);

    setTimeout(() => {
        router.push("/result");
    }, 600);
}

/* -----------------------------------------
   🚀 AWS FLOW (PRODUCTION)
----------------------------------------- */
async function runAwsFlow() {
    try {
        const generateRes = await fetch(
            "https://your-api-id.execute-api.eu-central-1.amazonaws.com/prod/generate",
            {
                method: "POST",
                headers: {
                    "x-api-key": "YOUR_API_KEY",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    metadata: {
                        kiosk: "k1",
                        event: "adobe-summit"
                    }
                })
            }
        );

        const { uuid } = await generateRes.json();
        demo.uuid = uuid;

        const uploadUrlRes = await fetch(
            "https://your-api-id.execute-api.eu-central-1.amazonaws.com/prod/upload-url",
            {
                method: "POST",
                headers: {
                    "x-api-key": "YOUR_API_KEY",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uuid,
                    filename: "input.jpg",
                    contentType: "image/jpg"
                })
            }
        );

        const uploadData = await uploadUrlRes.json();

        await fetch(uploadData.uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": "image/jpg" },
            body: demo.photoBlob
        });

        await fetch(
            "https://your-api-id.execute-api.eu-central-1.amazonaws.com/prod/start-photos",
            {
                method: "POST",
                headers: {
                    "x-api-key": "YOUR_API_KEY",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ uuid })
            }
        );

        await pollStatus(uuid);

        router.push("/result");

    } catch (err) {
        console.error("AWS generation failed:", err);
        router.push("/preview");
    }
}

/* -----------------------------------------
   STATUS POLLING
----------------------------------------- */
async function pollStatus(uuid) {
    return new Promise((resolve) => {
        const interval = setInterval(async () => {
            const res = await fetch(
                `https://your-api-id.execute-api.eu-central-1.amazonaws.com/prod/status/${uuid}`,
                {
                    headers: {
                        "x-api-key": "YOUR_API_KEY"
                    }
                }
            );

            const data = await res.json();

            if (data.status === "PHOTO_DONE" || data.status === "VIDEO_DONE") {
                clearInterval(interval);
                resolve();
            }
        }, 2000);
    });
}

/* -----------------------------------------
   UI SIMULATION TIMER
----------------------------------------- */
onMounted(() => {
    stepTimer = setInterval(() => {
        if (currentStep.value < telemetry.length - 1) {
            currentStep.value++;
            progress.value = Math.min(
                90,
                Math.round(((currentStep.value + 1) / telemetry.length) * 90)
            );
        }
    }, 2000);

    if (MOCK_MODE) {
        runMockFlow();
    } else {
        runAwsFlow();
    }
});

onBeforeUnmount(() => {
    clearInterval(stepTimer);
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

/* VIDEO */
.bg-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
}

/* CONTENT */
.content {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 600px;
    padding: 2rem;
    text-align: center;
}

.title {
    margin-bottom: 2rem;
    color: white;
}

.telemetry-single {
    min-height: 60px;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.telemetry-text {
    font-size: 2.5rem;
    color: white;
}

/* Fade animation */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Progress */
.progress {
    height: 6px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 999px;
    overflow: hidden;
    margin-bottom: 1rem;
}

.bar {
    height: 100%;
    background: linear-gradient(
        90deg,
        rgba(38, 239, 233, 1),
        rgba(53, 202, 207, 1)
    );
    transition: width 0.4s ease;
}

.hint {
    opacity: 0.7;
    font-size: 0.9rem;
}
</style>