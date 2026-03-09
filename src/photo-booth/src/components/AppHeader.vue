<template>
    <header class="app-header">
        <div class="left">
            <img src="/logo.svg" alt="Logo" class="logo" />
            <span class="title">Race:me</span>
        </div>

        <button v-if="route.name !== 'welcome'" class="right" type="button" @click="goHome">
            ⌂︎ Home
        </button>
    </header>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { useDemoStore } from "../stores/demoStore";

const route = useRoute();
const router = useRouter();
const demo = useDemoStore();

function goHome() {
    demo.resetAll();
    router.push("/");
}
</script>

<style scoped>
.app-header {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1.5rem;
    border-bottom: 1px solid var(--brand-border);
    background: white;
    z-index: 1;
}

.left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.logo {
    height: 32px;
    border-right: 1px solid #000048;
    padding-right: 12px;
}

.title {
    font-weight: 600;
    font-size: 1.1rem;
    color: var(--brand-dark);
}

.right {
    font-size: 20px;
    margin-right: 20px;
    background: none;
    border: none;
    color: var(--brand-dark);
    cursor: pointer;
    padding: 0;
}
</style>