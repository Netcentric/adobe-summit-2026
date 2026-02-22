<template>
    <div class="result-screen">
        <h1>Select one option.</h1>

        <!-- IMAGE GRID -->
        <div class="grid">
            <div
                v-for="(img, index) in demo.generatedPhotos"
                :key="index"
                class="image-card"
                :class="{ selected: selectedIndex === index }"
                @click="selectImage(index)"
            >
                <img :src="img" alt="Generated option" />
            </div>
        </div>

        <!-- ACTIONS -->
        <div class="actions">
            <Button
                variant="secondary"
                icon="left"
                @click="reset"
            >
                Generate further options
            </Button>

            <Button
                variant="primary"
                icon="right"
                :disabled="selectedIndex === null"
                @click="confirmSelection"
            >
                Continue with Selection
            </Button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDemoStore } from "../stores/demoStore";
import Button from "@/components/Button.vue";

const router = useRouter();
const demo = useDemoStore();

const selectedIndex = ref(null);

onMounted(() => {
    // Safety: if no images → go back
    if (!demo.generatedPhotos || demo.generatedPhotos.length === 0) {
        router.push("/camera");
    }
});

function selectImage(index) {
    selectedIndex.value = index;
}

function confirmSelection() {
    demo.selectedPhoto = demo.generatedPhotos[selectedIndex.value];
    router.push("/delivery-options");
}

function reset() {
    demo.resetAll();
    router.push("/");
}
</script>

<style scoped>
.result-screen {
    min-height: 100vh;
    padding: 2rem 1.5rem;
    display: flex;
    gap: 2rem;
    flex-direction: column;
    align-items: center;
}

.grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    width: 100%;
    max-width: 600px;
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
</style>