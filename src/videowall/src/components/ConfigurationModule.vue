<script setup lang="ts">
import { ref } from 'vue';
import useConfig from '../useConfig.ts';
import type { ConfigKey } from '../types.ts';

const { config, updateConfig, resetConfig, applyDevelopmentConfig } =
  useConfig();

const showModal = ref(false);

let timer = 0;
const handleToggleHover = (cancel: boolean = false) => {
  if (cancel) {
    clearTimeout(timer);
    return;
  }
  timer = setTimeout(() => {
    showModal.value = true;
  }, 2000);
};

const getInputPops = (control: ConfigKey) => {
  const value = config.value[control];
  return {
    key: control,
    type: Number.isInteger(value) ? 'number' : 'string',
    step: (
      ['debug', 'advertCounter', 'advertUsePreview'] as ConfigKey[]
    ).includes(control)
      ? 1
      : 10,
    min: 0,
  };
};

const handleInputChange = (control: ConfigKey, value: string) => {
  console.log({ control, value });
  const originalType = Number.isInteger(config.value[control])
    ? 'number'
    : 'string';

  updateConfig({
    [control]:
      originalType === 'number' ? Number.parseInt(value as string, 10) : value,
  });
};
</script>

<template>
  <div
    class="toggle"
    @mouseover="() => handleToggleHover()"
    @mouseout="() => handleToggleHover(true)"
  />
  <div
    class="modal"
    v-if="showModal"
  >
    <div class="button-group">
      <button @click="() => (showModal = false)">close</button>
      <button
        @click="resetConfig"
        class="secondary"
      >
        reset
      </button>
      <!--      <button-->
      <!--        @click="applyDevelopmentConfig"-->
      <!--        class="secondary"-->
      <!--      >-->
      <!--        dev config-->
      <!--      </button>-->
    </div>

    <div class="controls">
      <div
        class="control"
        v-for="control in Object.keys(config) as ConfigKey[]"
      >
        <label for="control">{{ control }}</label>
        <input
          v-bind="getInputPops(control)"
          :value="config[control]"
          @change="
            (event) =>
              handleInputChange(
                control,
                (event.target as HTMLInputElement)?.value
              )
          "
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.toggle {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  width: 50px;
  aspect-ratio: 1;

  &:hover {
    background-image: linear-gradient(
      to bottom right,
      rgba(0, 0, 0, 0) 60%,
      rgba(0, 0, 0, 0.2)
    );
  }
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  padding: 1.5rem;
  background-color: #d3cfcf;
  min-width: 300px;
  box-shadow: -5px -5px 5px rgba(0, 0, 0, 0.1) inset;
}
.controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.control {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  label {
    font-size: 12px;
  }
}
button,
input {
  background-color: #edebea;
  border-radius: 2px;
  font-size: 14px;
  border: 1px solid gray;
  padding: 0.25rem 0.5rem;

  &.secondary {
    border: none;
  }
}

.button-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
