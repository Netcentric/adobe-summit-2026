<template>
    <div class="final-screen">
        <h1>License granted!</h1>

        <div class="image-wrapper">
            <img :src="demo.selectedPhoto" />

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

        <div class="actions">
            <Button variant="secondary" @click="sendEmail">
                Send to Email
            </Button>

            <Button variant="primary" @click="printPhoto">
                Print Image
            </Button>
        </div>
    </div>
</template>

<script setup>
import { useDemoStore } from "../stores/demoStore";
import Button from "@/components/Button.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const demo = useDemoStore();

function printPhoto() {
    router.push("/print-setup");
}

function sendEmail() {
    console.log("📧 Email logic here");
}
</script>

<style scoped>
.final-screen {
    min-height: 100vh;
    padding: 2rem;
    display: flex;
    gap: 3rem;
    flex-direction: column;
    align-items: center;
}

.image-wrapper {
    position: relative;
    max-width: 500px;
    margin-bottom: 2rem;
}

.image-wrapper img {
    width: 100%;
}

.actions {
    display: flex;
    gap: 1rem;
}

/* frame sits OUTSIDE the photo a bit */
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
    border-radius: 16px;
}

.corner {
    position: absolute;
    width: 50px;
    height: 50px;
    border-color: #26EFE9;
    border-style: solid;
    border-width: 0;
}

/* corners */
.top-left {
    top: -2px;
    left: -2px;
    border-top-width: 4px;
    border-left-width: 4px;
}

.top-right {
    top: -2px;
    right: -2px;
    border-top-width: 4px;
    border-right-width: 4px;
}

.bottom-left {
    bottom: -2px;
    left: -2px;
    border-bottom-width: 4px;
    border-left-width: 4px;
}

.bottom-right {
    bottom: -2px;
    right: -2px;
    border-bottom-width: 4px;
    border-right-width: 4px;
}
</style>