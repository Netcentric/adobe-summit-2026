<template>
    <div class="approval-screen">
        <h1 class="title">Final approval</h1>

        <!-- IMAGE PREVIEW -->
        <img v-if="demo.photoPreview" :src="demo.photoPreview" class="photo" alt="Your photo" />

        <!-- ERA / REGION SUMMARY -->
        <div class="summary">
            <span>{{ demo.era }}</span>
            <span>·</span>
            <span>{{ demo.region }}</span>
        </div>

        <!-- TERMS -->
        <div class="terms">
            <label class="checkbox">
                <input type="checkbox" v-model="accepted" />
                <span>
                    I agree that my image may be processed to generate demo content for
                    Adobe Summit 2026 and displayed temporarily at the booth. Content will
                    be deleted after the event.
                </span>
            </label>
        </div>

        <!-- ACTIONS -->
        <div class="actions">
            <Button variant="secondary" icon="left" @click="goBack">Back</Button>
            <Button variant="primary" :disabled="!accepted" @click="approve">Approve & Generate</Button>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useDemoStore } from "../stores/demoStore";
import Button from "@/components/Button.vue";

// --------------------
// SETUP
// --------------------
const router = useRouter();
const demo = useDemoStore();

const accepted = ref(false);

// --------------------
// ACTIONS
// --------------------
function goBack() {
    router.push("/preview");
}

function approve() {
    demo.approve();
    router.push("/generating");
}
</script>

<style scoped>
.approval-screen {
    min-height: 100vh;
    padding: 2rem 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.title {
    margin-bottom: 1rem;
}

.photo {
    width: 90%;
    max-width: 360px;
    border-radius: 16px;
    margin-bottom: 1rem;
}

.summary {
    font-size: 0.95rem;
    opacity: 0.85;
    margin-bottom: 1.5rem;
}

.terms {
    max-width: 520px;
    margin-bottom: 2rem;
}

.checkbox {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
    font-size: 0.9rem;
    line-height: 1.4;
}

.checkbox input {
    margin-top: 0.25rem;
}

.actions {
    display: flex;
    gap: 1rem;
    width: 100%;
    max-width: 520px;
}

.btn {
    flex: 1;
    padding: 0.85rem;
    border-radius: 999px;
    border: none;
    font-size: 1rem;
    cursor: pointer;
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>