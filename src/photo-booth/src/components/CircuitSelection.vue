<template>
    <div class="circuit-screen">

        <!-- HEADER -->
        <div class="header">
            <h2 class="title">Where are we racing today?</h2>
            <p class="subtitle">Select a circuit.</p>
        </div>

        <!-- HORIZONTAL SCROLL -->
        <div class="circuit-scroll">
            <button v-for="circuit in circuits" :key="circuit.id" class="circuit-card"
                :class="{ selected: modelValue === circuit.id }" @click="selectCircuit(circuit.id)">

                <!-- IMAGE -->
                <div class="card-image">
                    <img :src="base + circuit.image" alt="" />

                    <!-- Selected gradient overlay -->
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
</template>

<script setup>
import Button from "@/components/Button.vue";

defineProps({
    circuits: Array,
    modelValue: String
});

const emit = defineEmits(["update:modelValue", "back", "next"]);
const base = import.meta.env.BASE_URL;s

function selectCircuit(id) {
    emit("update:modelValue", id);
}
</script>

<style scoped>
.circuit-screen {
    min-height: 100vh;
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
    font-size: 2.4rem;
    margin-bottom: 0.5rem;
}

.subtitle {
    font-size: 1.3rem;
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
    -webkit-overflow-scrolling: touch;
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

/* GRADIENT OVERLAY */
.image-gradient {
    position: absolute;
    inset: 0;
    opacity: 0.65;
}

/* TEXT CONTENT */
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
    /* rgba(0,0,72,1) */
    border-color: rgba(53, 202, 207, 1);
    box-shadow: 0 0 10px 6px rgba(133, 160, 249, 0.8);
    border-width: 3px;
}

.circuit-card.selected .card-country,
.circuit-card.selected .card-name {
    color: white;
}

/* ACTIONS */
.actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}
</style>