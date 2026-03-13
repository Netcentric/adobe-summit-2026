<template>
    <div class="result-screen">
        <!-- BACKGROUND VIDEO -->
        <video class="bg-video" autoplay muted loop playsinline>
            <source src="/agent-animation-bg.mp4" type="video/mp4" />
        </video>

        <div class="result-content">
            <div class="back-button">
                <Button variant="secondary" icon="left" @click="goBack">
                    Back
                </Button>
            </div>

            <h1 class="title">Select one option.</h1>

            <div class="grid">
                <div v-for="(img, index) in demo.generatedPhotos" :key="index" class="image-card"
                    :class="{ selected: selectedIndex === index }" @click="selectImage(index)">
                    <img :src="img" alt="Generated option" />
                </div>
            </div>

            <div class="actions">
                <Button variant="secondary" @click="reset">
                    Generate further options
                </Button>

                <Button variant="primary" icon="right" :disabled="selectedIndex === null" @click="confirmSelection">
                    Continue with Selection
                </Button>
            </div>

            <div class="start-over">
                <a href="/camera" class="start-over-link" @click.prevent="startOver">
                    Start over with another photo
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDemoStore } from "../stores/demoStore";
import Button from "@/components/Button.vue";
import { getFilenameFromUrl } from "../lib/photoboothApi";

const router = useRouter();
const demo = useDemoStore();

const selectedIndex = ref(null);

onMounted(() => {
    if (!demo.generatedPhotos || demo.generatedPhotos.length === 0) {
        router.push("/camera");
    }
});

function selectImage(index) {
    selectedIndex.value = index;
}

function confirmSelection() {
    if (selectedIndex.value === null) return;

    const selectedItem = demo.imageSelection[selectedIndex.value];
    const selectedUrl = selectedItem?.url || demo.generatedPhotos[selectedIndex.value];
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
    gap: 1rem;
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

.image-card.selected {
    border-color: rgba(38, 239, 233, 1);
    box-shadow: 0 0 15px rgba(38, 239, 233, 0.6);
}

.actions {
    display: flex;
    gap: 1rem;
    width: 100%;
    max-width: 600px;
}

.start-over {
    color: var(--action-link-color);
}
</style>