<script setup>
import { ref, watch } from "vue";
import Button from "@/components/Button.vue";

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    }
});

const emit = defineEmits(["update:modelValue", "confirm"]);

const checked = ref(false);

watch(
    () => props.modelValue,
    (val) => {
        if (val) checked.value = false;
    }
);

function close() {
    emit("update:modelValue", false);
}

function confirm() {
    emit("confirm");
    emit("update:modelValue", false);
}
</script>

<template>
    <div v-if="modelValue" class="modal-backdrop">
        <div class="modal">
            <div class="btn-close">
                <button class="close-btn" aria-label="Close" @click="close">
                    X
                </button>
            </div>

            <div class="modal-content">
                <div class="title">Ready for the camera?</div>

                <label class="checkbox">
                    <input type="checkbox" v-model="checked" />
                    I consent to the use of photo recordings.
                </label>
            </div>

            <div class="modal-actions">
                <Button variant="primary" icon="right" :disabled="!checked" @click="confirm">Take a photo of me</Button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.title {
    font-size: 40px;
    text-align: left;
}

.modal {
    position: relative;
    background: white;
    display: flex;
    flex-direction: column;
    gap: 20px;
    color: var(--brand-dark);
    width: 613px;
    padding: 1.6rem;
}

.modal-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.modal-text {
    font-size: 0.9rem;
    margin: 1rem 0;
}

.checkbox {
    display: flex;
    gap: 0.6rem;
    font-size: 0.9rem;
    margin-bottom: 1.4rem;
}

.modal-actions {
    text-align: left;
}

button.secondary {
    background: transparent;
    color: var(--brand-dark);
}

.close-btn {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    background: transparent;
    border: none;
    font-size: 1.8rem;
    line-height: 1;
    cursor: pointer;
    color: #666;
}
</style>