<script lang="ts" setup>
import {
  computed,
  defineModel,
  defineProps,
  onUnmounted,
  ref,
  watch,
  watchEffect,
} from 'vue';

const props = defineProps(['placeholder']);
const placeholderInternal = ref('');
watchEffect(() => {
  if (!placeholderInternal.value) {
    placeholderInternal.value = Array.isArray(props.placeholder)
      ? props.placeholder[0]
      : props.placeholder || '';
  }
});

const model = defineModel<string>();
const hasValue = computed(() => !!model.value);

let timer = 0;

watch(props, () => {
  if (props.placeholder && props.placeholder.length > 0) {
    let counter = 0;

    timer = setInterval(
      () => {
        if (counter < props.placeholder.length - 1) {
          counter++;
        } else {
          counter = 0;
        }

        placeholderInternal.value = props.placeholder[counter];
      },
      4600,
      { immediate: true }
    );
  } else {
  }
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<template>
  <div>
    <input
      class="paragraph"
      type="text"
      ref="inputRef"
      v-model="model"
    />
    <span
      class="placeholder paragraph"
      :key="placeholderInternal"
      v-if="!hasValue"
      >{{ placeholderInternal }}</span
    >
  </div>
</template>

<style scoped>
div {
  position: relative;
  width: 100%;
}
input {
  width: 100%;
  height: 80px;
  display: block;
  padding-block: 26px;
  padding-inline: 35px;
  border-radius: 40px;
  border: 3px solid var(--brand-border-grey);
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 10px 15px 20px 0 rgba(0, 0, 72, 0.1);
}
input::placeholder,
.placeholder {
  font-style: italic;
  color: rgba(0, 0, 0, 0.75);
}
input:focus {
  border-color: var(--brand-border-primary);
  outline: none;
}

.placeholder {
  position: absolute;
  top: 50%;
  left: 35px;
  transform: translateY(-50%);
  pointer-events: none;
  animation-name: appear;
  animation-fill-mode: forwards;
  animation-duration: 1800ms;
  animation-iteration-count: 1;
  animation-play-state: running;
}

input:focus + .placeholder {
  display: none;
}

@keyframes appear {
  from {
    opacity: 0;
  }
  to {
    opacity: 100;
  }
}
</style>
