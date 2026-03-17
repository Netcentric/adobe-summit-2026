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
                <p class="subtitle">Choose a location.</p>

                <!-- REGION FILTER -->
                <div class="filter-wrapper">
                    <div class="filter-pill" ref="dropdownRef">
                        <button
                            type="button"
                            class="filter-trigger"
                            @click="toggleDropdown"
                            :class="{ open: isDropdownOpen }"
                        >
                            <span>
                                {{ selectedRegion || "Filter by region" }}
                            </span>

                            <img src="/arrow-down.svg" alt="" class="filter-icon" />
                        </button>

                        <div v-if="isDropdownOpen" class="filter-menu">
                            <button
                                type="button"
                                class="filter-option"
                                @click="selectRegion('')"
                            >
                                Filter by region
                            </button>

                            <button
                                v-for="region in regions"
                                :key="region"
                                type="button"
                                class="filter-option"
                                :class="{ active: selectedRegion === region }"
                                @click="selectRegion(region)"
                            >
                                {{ region }}
                            </button>
                        </div>
                    </div>
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
                        <div
                            v-if="modelValue === circuit.id"
                            class="image-gradient"
                        ></div>
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

                <div v-if="filteredCircuits.length === 0" class="no-results">
                    No circuits found.
                </div>
            </div>

            <!-- ACTIONS -->
            <div class="actions">
                <Button variant="secondary" icon="left" @click="$emit('back')">
                    Back
                </Button>

                <Button
                    variant="primary"
                    icon="right"
                    :disabled="!modelValue"
                    @click="$emit('next')"
                >
                    Continue
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from "vue";
import Button from "@/components/Button.vue";

const props = defineProps({
    circuits: Array,
    modelValue: String
});

const emit = defineEmits(["update:modelValue", "back", "next"]);

const selectedRegion = ref("");
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);

const regions = computed(() => {
    const values = (props.circuits || [])
        .map((circuit) => {
            const country = circuit.country || "";
            return country.split(",")[0].trim();
        })
        .filter(Boolean);

    return [...new Set(values)];
});

const filteredCircuits = computed(() => {
    if (!selectedRegion.value) return props.circuits || [];

    return (props.circuits || []).filter((circuit) => {
        const region = (circuit.country || "").split(",")[0].trim();
        return region === selectedRegion.value;
    });
});

function selectCircuit(id) {
    emit("update:modelValue", id);
}

function toggleDropdown() {
    isDropdownOpen.value = !isDropdownOpen.value;
}

function selectRegion(region) {
    selectedRegion.value = region;
    isDropdownOpen.value = false;
}

function handleClickOutside(event) {
    if (!dropdownRef.value) return;

    if (!dropdownRef.value.contains(event.target)) {
        isDropdownOpen.value = false;
    }
}

window.addEventListener("click", handleClickOutside);

onBeforeUnmount(() => {
    window.removeEventListener("click", handleClickOutside);
});
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
    width: 100%;
    max-width: 1200px;
    text-align: center;
}

.title {
    font-size: 4.25rem;
    margin-bottom: 1.5rem;
}

.subtitle {
    font-size: 2.5rem;
}

/* FILTER Styling */
.filter-wrapper {
    margin-top: 1.5rem;
    width: 1200px;
}

.filter-pill {
    position: relative;
    width: 270px;
    max-width: 100%;
}

.filter-trigger {
    width: 100%;
    padding: 1rem 3.2rem 1rem 1.5rem;
    border: none;
    outline: none;
    font-size: 1rem;
    background: var(--brand-dark);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    border-radius: 14px;
    transition: box-shadow 0.2s ease, border-radius 0.2s ease;
}

.filter-trigger.open {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

.filter-trigger:focus,
.filter-trigger.open {
    box-shadow: 0 0 10px rgba(133, 160, 249, 0.35);
}

.filter-menu {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: white;
    border-radius: 0 0 14px 14px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.16);
    z-index: 20;
    display: flex;
    flex-direction: column;
    gap: 0;
    overflow: hidden;
    border-top: 1px solid rgba(0, 0, 72, 0.08);
}

.filter-option {
    width: 100%;
    border: none;
    background: white;
    color: var(--brand-dark);
    text-align: left;
    padding: 0.95rem 1.5rem;
    cursor: pointer;
    transition: background 0.18s ease, color 0.18s ease;
    font-size: 1rem;
    border-radius: 0;
}

.filter-option:hover {
    background: #3d54ce;
    color: white;
}

.filter-option.active {
    background: var(--brand-dark);
    color: white;
}

.filter-icon {
    position: absolute;
    right: 1.5rem;
    top: 50%;
    transform: translateY(-50%) rotate(0deg);
    width: 12px;
    height: 8px;
    pointer-events: none;
    object-fit: contain;
    transition: transform 0.2s ease;
}

.filter-trigger.open + .filter-icon,
.filter-pill:has(.filter-trigger.open) .filter-icon {
    transform: translateY(-50%) rotate(180deg);
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