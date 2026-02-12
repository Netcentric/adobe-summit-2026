<script setup>
import { useRouter } from "vue-router";
import { useDemoStore } from "../stores/demoStore";
import { raceConfig } from "@/config/raceConfig";
import CircuitSelection from "@/components/CircuitSelection.vue";

const router = useRouter();
const demo = useDemoStore();

function goNext() {
    router.push("/select-era");
}

function goBack() {
    router.push("/preview");
}
</script>

<template>
    <CircuitSelection :circuits="raceConfig.circuits" v-model="demo.region" @next="goNext" @back="goBack" />
</template>