<script setup>
import { computed } from "vue";
import ButtonIcon from '@/assets/button-icon.svg'

const props = defineProps({
    variant: {
        type: String,
        default: "primary" // primary | secondary
    },
    icon: {
        type: String,
        default: null // left | right | null
    },
    disabled: {
        type: Boolean,
        default: false
    },
    fullWidth: {
        type: Boolean,
        default: false
    }
});

const classes = computed(() => [
    "base-button",
    `base-button--${props.variant}`,
    { "base-button--full": props.fullWidth }
]);
</script>

<template>
    <button :class="classes" :disabled="disabled">
        <!-- LEFT ICON -->
        <ButtonIcon v-if="icon === 'left'" class="btn-icon btn-icon--left" />

        <span class="btn-label">
            <slot />
        </span>

        <!-- RIGHT ICON -->
        <ButtonIcon v-if="icon === 'right'" class="btn-icon btn-icon--right" />
    </button>
</template>

<style scoped>
.base-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;

    border-radius: 999px;
    padding: 0.9rem 2rem;

    cursor: pointer;
    transition: background 0.2s ease, transform 0.1s ease;
}

.btn-label {
    display: inline-block;
}

/* FULL WIDTH OPTION */
.base-button--full {
    width: 100%;
}

/* PRIMARY */
.base-button--primary {
    background: var(--brand-primary);
    color: var(--brand-dark);
    border: none;
}

.base-button--primary:hover {
    background-color: #0EADB1;
}

/* SECONDARY */
.base-button--secondary {
    background: transparent;
    border: 2px solid var(--brand-border);
    color: var(--brand-border);
}

/* DISABLED */
.base-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

/* ICON */
.btn-icon {
    width: 20px;
    height: 20px;
    transform: translateY(2px);
    display: block;
    fill: currentColor;
}

.btn-icon--left {
    transform: rotate(180deg);
    /* for back arrow */
}
</style>