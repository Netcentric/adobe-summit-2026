<template>
    <EraSelection :eras="raceConfig.eras" v-model="demo.era" @next="goNext" @back="goBack" />
</template>

<script setup>
import { useRouter } from "vue-router";
import { useDemoStore } from "../stores/demoStore";
import EraSelection from "@/components/EraSelection.vue";
import { raceConfig } from "@/config/raceConfig";

const router = useRouter();
const demo = useDemoStore();

function goNext() {
    router.push("/approval");
}

function goBack() {
    router.push("/select-circuit");
}
</script>
