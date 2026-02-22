<template>
    <div class="print-screen">
        <h1 class="title">Take your racing moment <br> with you as a print.</h1>

        <div class="stage">
            <!-- POLAROID -->
            <div class="polaroid">
                <img :src="demo.selectedPhoto" class="photo" />
            </div>

            <!-- FLOATING FORM -->
            <div class="form-card">
                <input
                    v-model="name"
                    type="text"
                    placeholder="Your Name"
                />

                <input
                    v-model="company"
                    type="text"
                    placeholder="Company"
                />

                <Button
                    variant="primary"
                    :disabled="!name || !company"
                    @click="printImage"
                >
                    Print Image
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDemoStore } from "../stores/demoStore";
import Button from "@/components/Button.vue";

const router = useRouter();
const demo = useDemoStore();

const name = ref("");
const company = ref("");

onMounted(() => {
    if (!demo.selectedPhoto) {
        router.push("/result");
    }
});

function printImage() {
    demo.printName = name.value;
    demo.printCompany = company.value;

    router.push("/printing");
}
</script>

<style scoped>
.print-screen {
    min-height: 100vh;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
}

.title {
    font-size: 4rem;
}

/* Stage wrapper */
.stage {
    position: relative;
    width: 520px;
    display: flex;
    justify-content: center;
}

/* Polaroid */
.polaroid {
    background: white;
    padding: 1rem;
    padding-bottom: 3rem;
    width: 320px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    transform: rotate(5deg);
    position: relative;
    z-index: 1;
}

.photo {
    width: 100%;
    display: block;
}

/* Floating Form Card */
.form-card {
    position: absolute;
    right: -120px;
    top: 60px;
    width: 260px;

    display: flex;
    flex-direction: column;
    gap: 1rem;
    z-index: 2;
}

.form-card input {
    padding: 0.8rem;
    border-radius: 8px;
    border: none;
    font-size: 1rem;
}

/* Optional nice focus style */
.form-card input:focus {
    outline: 2px solid rgba(38, 239, 233, 1);
}
</style>