<template>
    <div class="final-screen">
        <h1>License granted!</h1>

        <div class="image-wrapper">
            <img :src="demo.selectedPhoto" />
        </div>

        <div class="actions">
            <Button variant="secondary" @click="sendEmail">
                Send to Email
            </Button>

            <Button variant="primary" @click="printPhoto">
                Print
            </Button>
        </div>
    </div>
</template>

<script setup>
import { useDemoStore } from "../stores/demoStore";
import Button from "@/components/Button.vue";

const demo = useDemoStore();

function printPhoto() {
    console.log("🖨 Print logic here");
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
    gap: 2rem;
    flex-direction: column;
    align-items: center;
}

.image-wrapper {
    max-width: 500px;
    margin-bottom: 2rem;
}

.image-wrapper img {
    width: 100%;
    border-radius: 16px;
}

.actions {
    display: flex;
    gap: 1rem;
}
</style>