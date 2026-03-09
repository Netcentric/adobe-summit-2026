<template>
    <div class="circuit-screen">
        <!-- BACKGROUND VIDEO -->
        <video
            class="bg-video"
            autoplay
            muted
            loop
            playsinline
        >
            <source src="/agent-animation-bg.mp4" type="video/mp4" />
        </video>

        <!-- FOREGROUND CONTENT -->
        <div class="circuit-content">
            <!-- HEADER -->
            <div class="header">
                <h2 class="title">Where are we racing today?</h2>
                <p class="subtitle">Tell me a location.</p>

                <!-- 🔍 SEARCH BAR -->
                <div class="search-wrapper">
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Enter any location here …"
                        class="search-input"
                    />
                </div>
            </div>

            <!-- HORIZONTAL SCROLL -->
            <div class="circuit-scroll">
                <button
                    v-for="circuit in filteredCircuits"
                    :key="circuit.id"
                    class="circuit-card"
                    :class="{ selected: modelValue === circuit.id }"
                    @click="selectCircuit(circuit.id)"
                >
                    <!-- IMAGE -->
                    <div class="card-image">
                        <img :src="circuit.image" alt="" />
                        <div v-if="modelValue === circuit.id" class="image-gradient"></div>
                    </div>

                    <!-- TEXT -->
                    <div class="card-content">
                        <div class="card-country">
                            {{ circuit.flag }} {{ circuit.country }}
                        </div>
                        <div class="card-name">
                            {{ circuit.name }}
                        </div>
                    </div>
                </button>

                <!-- No results -->
                <div v-if="filteredCircuits.length === 0" class="no-results">
                    No circuits found.
                </div>
            </div>

            <!-- ACTIONS -->
            <div class="actions">
                <Button variant="secondary" icon="left" @click="$emit('back')">
                    Back
                </Button>

                <Button variant="primary" icon="right" :disabled="!modelValue" @click="$emit('next')">
                    Continue
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Button from "@/components/Button.vue";

const props = defineProps({
    circuits: Array,
    modelValue: String
});

const emit = defineEmits(["update:modelValue", "back", "next"]);

const searchQuery = ref("");

const filteredCircuits = computed(() => {
    if (!searchQuery.value) return props.circuits;

    const q = searchQuery.value.toLowerCase();

    return props.circuits.filter((circuit) => {
        return (
            circuit.name.toLowerCase().includes(q) ||
            circuit.country.toLowerCase().includes(q) ||
            (circuit.location && circuit.location.toLowerCase().includes(q))
        );
    });
});

function selectCircuit(id) {
    emit("update:modelValue", id);
}
</script>

<style scoped>
.circuit-screen {
    position: relative;
    height: 100vh;
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

/* FOREGROUND */
.circuit-content {
    position: relative;
    z-index: 2;
    height: 100%;
    padding: 2rem 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
}

/* HEADER */
.header {
    text-align: center;
}

.title {
    font-size: 4.25rem;
    margin-bottom: 1.5rem;
}

.subtitle {
    font-size: 2.5rem;
}

/* 🔍 SEARCH */
.search-wrapper {
    margin-top: 3.5rem;
}

.search-input {
    width: 500px;
    padding: 1rem 1.2rem;
    border-radius: 40px;
    border: 1px solid #85A0F9;
    font-size: 1rem;
    outline: none;
    transition: 0.25s ease;
    background: rgba(255, 255, 255, 0.92);
    color: var(--brand-dark);
}

.search-input:focus {
    border-color: rgba(53, 202, 207, 1);
    box-shadow: 0 0 10px rgba(133, 160, 249, 0.5);
}

.search-input::placeholder {
    color: var(--brand-dark);
    opacity: 1;
}

/* SCROLL AREA */
.circuit-scroll {
    width: 100%;
    max-width: 1200px;
    display: flex;
    gap: 1.5rem;
    overflow-x: auto;
    padding: 0.5rem 0 1rem;
    scroll-snap-type: x mandatory;
}

/* CARD */
.circuit-card {
    flex-shrink: 0;
    padding: 0;
    width: 240px;
    border-radius: 5px;
    border: 1px solid #3d54ce;
    background: white;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transition: all 0.25s ease;
    scroll-snap-align: center;
}

/* IMAGE */
.card-image {
    position: relative;
    height: 200px;
    overflow: hidden;
}

.card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* TEXT */
.card-content {
    padding: 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.card-country {
    font-size: 0.9rem;
    font-weight: 500;
}

.card-name {
    font-size: 1.1rem;
    font-weight: 600;
}

/* SELECTED */
.circuit-card.selected {
    background: #000048;
    border-color: rgba(53, 202, 207, 1);
    box-shadow: 0 0 10px 6px rgba(133, 160, 249, 0.8);
    border-width: 3px;
}

.circuit-card.selected .card-country,
.circuit-card.selected .card-name {
    color: white;
}

.no-results {
    font-size: 1.2rem;
    opacity: 0.75;
    padding: 2rem;
}

/* ACTIONS */
.actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}
</style>