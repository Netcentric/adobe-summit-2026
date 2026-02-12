<template>
    <div class="generating-screen">
        <h1 class="title">AI Systems Active</h1>

        <!-- TELEMETRY -->
        <div class="telemetry">
            <div v-for="(item, index) in telemetry" :key="index" class="telemetry-line"
                :class="{ active: index <= currentStep }">
                <span class="dot"></span>
                {{ item }}
            </div>
        </div>

        <!-- PROGRESS BAR -->
        <div class="progress">
            <div class="bar" :style="{ width: progress + '%' }"></div>
        </div>

        <p class="hint">{{ hint }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useDemoStore } from "../stores/demoStore";

// --------------------------------------------------
const router = useRouter();
const demo = useDemoStore();

// --------------------------------------------------
const telemetry = [
    "Initializing AI agents",
    "Analyzing facial structure",
    "Applying era-specific styling",
    "Rendering race portrait",
    "Final quality checks"
];

const currentStep = ref(0);
const progress = ref(0);
const hint = ref("Optimizing race profile…");

let stepTimer = null;

// --------------------------------------------------
// MAIN FLOW — IMAGE ONLY
// --------------------------------------------------
onMounted(async () => {
    try {
        // ----------------------------------------------
        // UI progress simulation
        // ----------------------------------------------
        stepTimer = setInterval(() => {
            if (currentStep.value < telemetry.length - 1) {
                currentStep.value++;
                progress.value = Math.min(
                    90,
                    Math.round(((currentStep.value + 1) / telemetry.length) * 90)
                );
            }
        }, 600);

        // ----------------------------------------------
        // IMAGE GENERATION
        // ----------------------------------------------
        const formData = new FormData();
        formData.append("image", demo.photoBlob);
        formData.append("era", demo.era);
        formData.append("region", demo.region);

        const res = await fetch("/api/generate-image", {
            method: "POST",
            body: formData
        });

        let data;
        try {
            data = await res.json();
        } catch {
            throw new Error("Invalid server response");
        }

        if (!res.ok || !data?.image) {
            throw new Error("Image generation failed");
        }

        // ----------------------------------------------
        // UPLOAD IMAGE TO VERCEL BLOB
        // ----------------------------------------------
        const uploadRes = await fetch("/api/upload-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                imageBase64: data.image
            })
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok || !uploadData?.url) {
            throw new Error("Image upload failed");
        }

        // ----------------------------------------------
        // SAVE RESULTS IN STORE (CORRECTLY)
        // ----------------------------------------------
        demo.generatedImage = data.image;          // base64 → UI
        demo.generatedImageUrl = uploadData.url;  // public URL → video
        demo.generated = true;

        // ----------------------------------------------
        // FINISH
        // ----------------------------------------------
        clearInterval(stepTimer);
        progress.value = 100;
        hint.value = "Driver profile ready";

        setTimeout(() => {
            router.push("/result");
        }, 600);

    } catch (err) {
        console.error("❌ Image generation error:", err);
        clearInterval(stepTimer);
        alert("Generation failed. Please try again.");
        router.push("/preview");
    }
});

onBeforeUnmount(() => {
    clearInterval(stepTimer);
});
</script>

<style scoped>
.generating-screen {
    height: 100vh;
    background: radial-gradient(circle at top, #1a1a1a, #000);
    color: white;
    padding: 2rem 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.title {
    margin-bottom: 2rem;
    font-size: 1.4rem;
    letter-spacing: 0.04em;
}

.telemetry {
    width: 100%;
    max-width: 480px;
    margin-bottom: 2rem;
}

.telemetry-line {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    opacity: 0.35;
    margin-bottom: 0.5rem;
}

.telemetry-line.active {
    opacity: 1;
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #444;
}

.telemetry-line.active .dot {
    background: #ff0033;
    box-shadow: 0 0 8px #ff0033;
}

.progress {
    width: 100%;
    max-width: 480px;
    height: 6px;
    background: #222;
    border-radius: 999px;
    overflow: hidden;
    margin-bottom: 1rem;
}

.bar {
    height: 100%;
    background: linear-gradient(90deg, #ff0033, #ff6600);
}

.hint {
    opacity: 0.6;
    font-size: 0.85rem;
}
</style>