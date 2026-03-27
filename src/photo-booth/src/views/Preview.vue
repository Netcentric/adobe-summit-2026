<template>
    <div class="preview-screen">
        <!-- BACKGROUND VIDEO -->
        <video class="bg-video" autoplay muted loop playsinline>
            <source src="/agent-animation-bg.mp4" type="video/mp4" />
        </video>

        <!-- FOREGROUND CONTENT -->
        <div class="preview-content">
            <h2 class="title">Suit alignment looks sharp.</h2>

            <div class="photo-wrapper" v-if="demo.photoPreview">
                <img :src="demo.photoPreview" class="photo" alt="Your photo" />

                <!-- Overlay Frame -->
                <div class="frame-overlay">
                    <div class="frame-inner">
                        <span class="corner top-left"></span>
                        <span class="corner top-right"></span>
                        <span class="corner bottom-left"></span>
                        <span class="corner bottom-right"></span>
                    </div>
                </div>
            </div>

            <section class="section">
                <div class="message">
                    Shall we proceed to the wind tunnel, <br />
                    or recalibrate the shot?
                </div>
            </section>

            <div class="actions">
                <Button variant="secondary" icon="left" @click="goBack">Retry</Button>
                <Button variant="primary" icon="right" @click="goNext">Continue</Button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useDemoStore } from "../stores/demoStore";
import Button from "@/components/Button.vue";

const router = useRouter();
const demo = useDemoStore();

function goBack() {
    router.push("/camera");
}

function goNext() {
    router.push("/select-circuit");
}
</script>

<style scoped>
.preview-screen {
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
.preview-content {
    position: relative;
    z-index: 2;
    height: 100%;
    padding: 2rem 1.5rem;
    display: flex;
    gap: 20px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.title {
    margin-bottom: 3rem;
    font-size: 3.75rem;
}

.photo {
    width: 100%;
    display: block;
}

.message {
    font-size: 2rem;
}

.photo-wrapper {
    position: relative;
    width: 90%;
    max-width: 420px;
    margin-bottom: 1.5rem;
}

.frame-overlay {
    position: absolute;
    inset: -16px;
    pointer-events: none;
    z-index: 2;
}

.frame-inner {
    position: relative;
    width: 100%;
    height: 100%;
    border: 1px dashed rgba(0, 0, 0, 0.4);
}

.corner {
    position: absolute;
    width: 28px;
    height: 28px;
    border-color: #26EFE9;
    border-style: solid;
    border-width: 0;
}

/* Top Left */
.top-left {
    top: -2px;
    left: -2px;
    border-top-width: 4px;
    border-left-width: 4px;
}

/* Top Right */
.top-right {
    top: -2px;
    right: -2px;
    border-top-width: 4px;
    border-right-width: 4px;
}

/* Bottom Left */
.bottom-left {
    bottom: -2px;
    left: -2px;
    border-bottom-width: 4px;
    border-left-width: 4px;
}

/* Bottom Right */
.bottom-right {
    bottom: -2px;
    right: -2px;
    border-bottom-width: 4px;
    border-right-width: 4px;
}

.section {
    width: 100%;
    margin-bottom: 1.25rem;
    text-align: center;
}

.actions {
    display: flex;
    gap: 1rem;
    width: 100%;
    max-width: 520px;
    justify-content: center;
}

.btn {
    flex: 1;
    padding: 0.85rem;
    border-radius: 999px;
    border: none;
    font-size: 1rem;
    cursor: pointer;
}
</style>