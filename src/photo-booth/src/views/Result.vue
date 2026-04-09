<template>
    <div class="result-screen">
        <!-- BACKGROUND VIDEO -->
        <video class="bg-video" autoplay muted loop playsinline>
            <source src="/agent-animation-bg.mp4" type="video/mp4" />
        </video>

        <div class="result-content">
            <!-- <div class="back-button">
                <Button variant="secondary" icon="left" @click="goBack">
                    Back
                </Button>
            </div> -->

            <h1 class="title">Select one option.</h1>

            <div class="grid">
                <div
                    v-for="(tile, index) in displayTiles"
                    :key="`${tile.type}-${tile.url || index}`"
                    class="image-card"
                    :class="{
                        selected: selectedIndex === index,
                        'image-card--loading': tile.type === 'loading',
                        'image-card--error': tile.type === 'error',
                        'image-card--disabled': tile.type !== 'image'
                    }"
                    @click="selectImage(index)"
                >
                    <img
                        v-if="tile.type === 'image'"
                        :src="tile.url"
                        alt="Generated option"
                    />

                    <div v-else class="image-placeholder">
                        <div v-if="tile.type === 'loading'" class="image-placeholder__shimmer"></div>
                        <div v-if="tile.type === 'error'" class="image-failed">
                            <div class="image-failed__icon" aria-hidden="true">
                                <span class="image-failed__spark image-failed__spark--left"></span>
                                <span class="image-failed__spark image-failed__spark--right"></span>
                            </div>
                            <div class="image-failed__title">Generation failed</div>
                            <div class="image-failed__message">
                                This variation did not render correctly.
                            </div>
                        </div>
                        <div v-else class="image-placeholder__label">
                            Generating…
                        </div>
                    </div>
                </div>
            </div>

            <div class="actions">
                <Button variant="secondary" icon="left" @click="goBack">
                    Back
                </Button>

                <Button variant="primary" icon="right" :disabled="selectedIndex === null" @click="confirmSelection">
                    Continue with selection
                </Button>
            </div>

            <div class="start-over">
                <a href="/camera" class="start-over-link" @click.prevent="startOver">
                    Start over with another photo
                </a>
            </div>
            <div class="disclaimer-bar">
                <strong>Review, Approval & Compliance:</strong> You act as the final decision-maker, ensuring the content meets brand and quality standards before it goes live.
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDemoStore } from "../stores/demoStore";
import Button from "@/components/Button.vue";
import { getFilenameFromUrl } from "../lib/photoboothApi";

const router = useRouter();
const demo = useDemoStore();

const selectedIndex = ref(null);

const displayTiles = computed(() => {
    const slots = Array.isArray(demo.imageSelection) ? demo.imageSelection : [];

    if (slots.length >= 4) {
        return slots.slice(0, 4);
    }

    const fallbackImages = (demo.generatedPhotos || []).map((url, index) => ({
        type: url ? "image" : "loading",
        slotIndex: index,
        url: url || null,
        approvalUrl: null,
    }));

    while (fallbackImages.length < 4) {
        fallbackImages.push({
            type: "loading",
            slotIndex: fallbackImages.length,
            url: null,
            approvalUrl: null,
        });
    }

    return fallbackImages;
});

onMounted(() => {
    const hasImages = displayTiles.value.some((tile) => tile.type === "image");

    if (!hasImages) {
        router.push("/camera");
    }
});

function selectImage(index) {
    if (displayTiles.value[index]?.type !== "image") return;
    selectedIndex.value = index;
}

function confirmSelection() {
    if (selectedIndex.value === null) return;
    const selectedItem = displayTiles.value[selectedIndex.value];
    if (!selectedItem || selectedItem.type !== "image" || !selectedItem.url) return;

    const selectedUrl = selectedItem.url;
    const filename = getFilenameFromUrl(selectedUrl);

    demo.setSelectedPhoto({
        url: selectedUrl,
        filename,
    });

    router.push("/delivery-options");
}

function reset() {
    demo.resetAll();
    router.push("/");
}

function goBack() {
    router.push("/select-era");
}

function startOver() {
    demo.resetPhoto();
    router.push("/camera");
}
</script>

<style scoped>
.result-screen {
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

.result-content {
    position: relative;
    z-index: 2;
    min-height: 100vh;
    padding: 2rem 1.5rem;
    display: flex;
    gap: 2rem;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    width: 100%;
    max-width: 600px;
}

.title {
    font-size: 4.5rem;
    margin-top: -40px;
}

.back-button {
    align-self: flex-start;
}

.image-card {
    overflow: hidden;
    cursor: pointer;
    border: 3px solid transparent;
    transition: all 0.25s ease;
}

.image-card img {
    width: 100%;
    display: block;
}

.image-card--disabled {
    cursor: default;
}

.image-placeholder {
    position: relative;
    width: 100%;
    min-height: 286px;
    background: rgba(255, 255, 255, 0.18);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.image-card--error .image-placeholder {
    background:
        radial-gradient(circle at top, rgba(17, 199, 204, 0.2), transparent 42%),
        linear-gradient(180deg, rgba(7, 18, 90, 0.96) 0%, rgba(0, 0, 72, 0.94) 100%);
    border: 1px solid rgba(38, 239, 233, 0.35);
}

.image-placeholder__shimmer {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.06) 0%,
        rgba(255, 255, 255, 0.24) 50%,
        rgba(255, 255, 255, 0.06) 100%
    );
    transform: translateX(-100%);
    animation: resultShimmer 1.4s infinite;
}

.image-placeholder__label {
    position: relative;
    z-index: 1;
    font-size: 1rem;
    color: white;
    opacity: 0.9;
    letter-spacing: 0.04em;
}

.image-failed {
    position: relative;
    z-index: 1;
    width: 100%;
    padding: 1.75rem 1.25rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 0.9rem;
    color: white;
}

.image-failed__icon {
    width: 72px;
    height: 72px;
    border-radius: 22px;
    position: relative;
    display: grid;
    place-items: center;
    background: rgba(17, 199, 204, 0.14);
    border: 2px solid rgba(38, 239, 233, 0.55);
    box-shadow:
        0 10px 24px rgba(0, 0, 0, 0.18),
        inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.image-failed__icon::before {
    content: "";
    width: 30px;
    height: 30px;
    border-radius: 10px;
    border: 3px solid rgba(38, 239, 233, 0.9);
    transform: rotate(45deg);
}

.image-failed__icon::after {
    content: "!";
    position: absolute;
    font-size: 1.5rem;
    font-weight: 700;
    color: rgba(38, 239, 233, 1);
}

.image-failed__spark {
    position: absolute;
    width: 14px;
    height: 2px;
    border-radius: 999px;
    background: rgba(38, 239, 233, 0.85);
    top: 18px;
}

.image-failed__spark--left {
    left: 10px;
    transform: rotate(-35deg);
}

.image-failed__spark--right {
    right: 10px;
    transform: rotate(35deg);
}

.image-failed__title {
    font-size: 1.2rem;
    font-weight: 700;
    letter-spacing: 0.02em;
}

.image-failed__message {
    max-width: 200px;
    font-size: 0.9rem;
    line-height: 1.35;
    color: rgba(255, 255, 255, 0.78);
}

.image-card.selected {
    border-color: rgba(38, 239, 233, 1);
    box-shadow: 0 0 15px rgba(38, 239, 233, 0.6);
}

.actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    width: 100%;
    max-width: 600px;
}

.start-over {
    color: var(--action-link-color);
    margin-top: 12px;
}

@keyframes resultShimmer {
    100% {
        transform: translateX(100%);
    }
}
</style>
