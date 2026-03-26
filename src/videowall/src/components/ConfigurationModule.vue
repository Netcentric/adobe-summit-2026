<script setup lang="ts">
import { ref } from 'vue';
import useConfig from '../useConfig.ts';
import type { ConfigKey } from '../types.ts';

const { config, updateConfig } = useConfig();

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
    step: control === 'debug' ? 1 : 10,
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
    <button @click="() => (showModal = false)">close</button>

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
  right: 0;
  z-index: 10000;
  padding: 1rem;
  background-color: floralwhite;
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
    font-size: 10px;
  }
}
</style>
