<script lang="ts" setup>
import { computed, onUnmounted, ref, watch, watchEffect } from 'vue';

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
  height: 48px;
  display: block;
  padding-block: 26px;
  padding-inline: 35px;
  border-radius: 40px;
  box-shadow: 10px 15px 20px 0 rgba(0, 0, 72, 0.1);
  border: 3px solid transparent;
  background:
    linear-gradient(rgba(255, 255, 255, 1)) padding-box,
    linear-gradient(87.9deg, #aea8c7 20.15%, rgba(255, 255, 255, 0.9) 55.33%)
      border-box;

  @media screen and (min-width: 1200px) {
    height: 80px;
  }
}
input::placeholder,
.placeholder {
  font-style: italic;
  color: rgba(0, 0, 0, 0.75);
}
input:focus {
  outline: none;
  background:
    linear-gradient(rgba(255, 255, 255, 1)) padding-box,
    linear-gradient(87.9deg, #06c7cc 20.15%, rgba(165, 241, 252, 0.9) 55.33%)
      border-box;
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
