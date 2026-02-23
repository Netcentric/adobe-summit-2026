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
            <source src="/adobe-background.mp4" type="video/mp4" />
        </video>

        <!-- CONTENT -->
        <div class="content">

            <!-- FIXED MAIN MESSAGE -->
            <div class="telemetry-single">
                <h1 class="telemetry-text">
                    I’m creating your personal racing moment …
                </h1>
            </div>

            <!-- ROTATING HINT -->
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

const router = useRouter();
const demo = useDemoStore();

/* -----------------------------------------
   🔥 TOGGLE HERE
----------------------------------------- */
const MOCK_MODE = true;

/* -----------------------------------------
   UI STATE
----------------------------------------- */

const hintMessages = [
    "This takes about 10–15 seconds.",
    "Strapping you into the cockpit … mirrors adjusted.",
    "Helmet on – biometric scan complete.",
    "Calibrating aerodynamics to your profile.",
];

const currentHintIndex = ref(0);
const hint = ref(hintMessages[0]);

let stepTimer = null;

/* -----------------------------------------
   🧪 MOCK FLOW (FRONTEND ONLY)
----------------------------------------- */
async function runMockFlow() {
    console.log("🧪 Running MOCK generation");

    await new Promise(resolve => setTimeout(resolve, 10000));

    demo.uuid = "mock-uuid-123";

    demo.generatedPhotos = [
        "photo-booth/mocks/generated-driver-1.jpg",
        "photo-booth/mocks/generated-driver-2.jpg",
        "photo-booth/mocks/generated-driver-3.jpg",
        "photo-booth/mocks/generated-driver-4.jpg",
    ];

    demo.generatedVideo = "/mock/video.mp4";

    demo.generated = true;

    clearInterval(stepTimer);

    setTimeout(() => {
        router.push("/result");
    }, 500);
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
   HINT ROTATION TIMER
----------------------------------------- */
onMounted(() => {
    stepTimer = setInterval(() => {
        if (currentHintIndex.value < hintMessages.length - 1) {
            currentHintIndex.value++;
            hint.value = hintMessages[currentHintIndex.value];
        }
    }, 3000);

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
    max-width: 800px;
    padding: 2rem;
    text-align: center;
}

/* MAIN MESSAGE */
.telemetry-single {
    margin-bottom: 2rem;
}

.telemetry-text {
    color: white;
}

/* HINT */
.hint {
    font-size: 2.5rem;
    opacity: 0.8;
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
</style>