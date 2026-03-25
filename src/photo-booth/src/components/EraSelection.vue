<template>
    <div class="era-screen">
        <!-- BACKGROUND VIDEO -->
        <video class="bg-video" autoplay muted loop playsinline>
            <source src="/agent-animation-bg.mp4" type="video/mp4" />
        </video>

        <div class="era-content">
            <!-- HEADER -->
            <div class="header">
                <h2 class="title">What era are we channeling?</h2>
                <p class="subtitle">Choose a decade.</p>
            </div>

            <!-- HERO IMAGE -->
            <div class="era-hero">
                <transition name="fade">
                    <img :key="activeEra.id" :src="activeEraImage" class="hero-image" alt="" />
                </transition>
            </div>

            <!-- SCROLLABLE TRACK -->
            <div class="era-scroll">
                <div class="era-track">
                    <!-- TIMELINE -->
                    <div class="timeline">
                        <div class="timeline-line"></div>
                        <div class="timeline-progress" :style="{ width: progressWidth }"></div>

                        <button
                            v-for="(era, index) in eras"
                            :key="era.id"
                            class="timeline-dot"
                            :class="{
                                active: modelValue === era.id,
                                passed: index < activeIndex
                            }"
                            type="button"
                            @click="selectEra(era.id)"
                        />
                    </div>

                    <!-- ERA CARDS -->
                    <div class="era-options">
                        <button
                            v-for="era in eras"
                            :key="era.id"
                            class="era-option"
                            :class="{ selected: modelValue === era.id }"
                            type="button"
                            @click="selectEra(era.id)"
                        >
                            <div class="era-title">{{ era.title }}</div>
                            <div class="era-years">({{ era.years }})</div>
                        </button>
                    </div>
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
import { computed, onMounted } from "vue";
import Button from "@/components/Button.vue";

const props = defineProps({
    eras: Array,
    modelValue: String
});

const emit = defineEmits(["update:modelValue", "back", "next"]);

function selectEra(id) {
    emit("update:modelValue", id);
}

onMounted(() => {
    if (!props.modelValue && props.eras?.length) {
        emit("update:modelValue", props.eras[0].id);
    }
});

/* active era */
const activeEra = computed(() =>
    props.eras.find(e => e.id === props.modelValue) || props.eras[0]
);

const activeEraImage = computed(() => activeEra.value?.image || "");

const activeIndex = computed(() =>
    props.eras.findIndex(e => e.id === props.modelValue)
);

/* pixel-based progress (card width + gap) */
const CARD_WIDTH = 200;
const GAP = 32;
const DOT = 16;

const progressWidth = computed(() => {
    const i = activeIndex.value;
    const n = props.eras.length;

    if (i < 0) return "0px";

    const step = CARD_WIDTH + GAP;

    // 1st dot is at start => center is DOT/2
    if (i === 0) return `${DOT / 2}px`;

    // last dot is at end of its column => center is (CARD_WIDTH - DOT/2) from column start
    if (i === n - 1) return `${i * step + (CARD_WIDTH - DOT / 2)}px`;

    // middle dots are centered in their column => center is CARD_WIDTH/2 from column start
    return `${i * step + CARD_WIDTH / 2}px`;
});
</script>

<style scoped>
/* CONSTANTS */
.era-screen {
    --era-card-width: 200px;
    --era-gap: 32px;

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
.era-content {
    position: relative;
    z-index: 2;
    height: 100vh;
    background: rgba(255, 255, 255, 0.7);
    padding: 2rem 1.5rem;
    padding-top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    justify-content: center;
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

/* HERO */
.era-hero {
    width: 100%;
    max-width: 1000px;
    max-height: 540px;
    overflow: hidden;
}

.hero-image {
    width: 100%;
    height: 100%;
    display: block;
}

/* FADE */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.35s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* SCROLL */
.era-scroll {
    width: 100%;
    max-width: 1000px;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    transform: translateY(-50px);
}

/* TRACK */
.era-track {
    width: max-content;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

/* TIMELINE */
.timeline {
    position: relative;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: var(--era-card-width);
    column-gap: var(--era-gap);
    height: 40px;
    align-items: center;
}

.timeline-line {
    position: absolute;
    top: 48%;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--brand-dark);
    transform: translateY(-50%);
}

.timeline-progress {
    position: absolute;
    top: 48%;
    left: 0;
    height: 2px;
    background: linear-gradient(
        90deg,
        rgba(53, 202, 207, 1),
        rgba(61, 84, 206, 1)
    );
    transform: translateY(-50%);
    transition: width 0.35s ease;
}

.timeline-dot {
    width: 16px;
    height: 16px;
    padding: 1px;
    border-radius: 50%;
    justify-self: center;
    background: var(--brand-dark);
    border: 2px solid white;
    cursor: pointer;
    z-index: 2;
    transition: all 0.25s ease;
}

/* FIRST dot aligns left */
.timeline-dot:first-of-type {
    justify-self: start;
}

/* LAST dot aligns right */
.timeline-dot:last-of-type {
    justify-self: end;
}

.timeline-dot.active {
    border-color: rgba(53, 202, 207, 1);
    border-width: 10px;
    padding: 6px;
}

.timeline-dot.passed {
    background: rgba(61, 84, 206, 1);
    border-color: rgba(61, 84, 206, 1);
}

/* ERA CARDS */
.era-options {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: var(--era-card-width);
    column-gap: var(--era-gap);
    width: max-content;
}

.era-option {
    position: relative;
    overflow: hidden;
    width: var(--era-card-width);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 1rem;
    background: none;
    cursor: pointer;
    text-align: center;
    border-radius: 4px;
    transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.era-option.selected {
    background: #EBF1FF;
    border-radius: 4px;
}

.era-option.selected::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 4px;
    padding: 1px;
    background: linear-gradient(
        90deg,
        rgba(61, 84, 206, 1),
        rgba(53, 202, 207, 1)
    );

    -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;

    pointer-events: none;
}

.era-years {
    font-weight: 400;
    font-size: 1rem;
}

/* ACTIONS */
.actions {
    display: flex;
    gap: 1rem;
    margin-top: -40px;
}
</style>
