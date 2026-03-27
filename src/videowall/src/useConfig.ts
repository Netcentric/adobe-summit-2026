import { ref } from 'vue';
import type { Config } from './types.ts';

const configDefault: Config = {
  startTime: Date.now() - 60 * 60 * 1000,
  debug: 0,
  pollInterval: 30000,
  slidePauseIn: 300,
  slidePauseOut: 120,
  advertPauseOut: 1200,
  slideTransition: 1400,
  advertCounter: 10,
  advertUsePreview: 1,
  apiKey: 'x1fG7UmmyT4qL1NePJy4C31awLTi64R83mu7J7pt',
  apiUrl: 'https://api.netcentric.biz/photobooth/latest',
};

const config = ref<Config>(configDefault);

export default function useConfig() {
  const updateConfig = (partial: Partial<Config>) => {
    config.value = {
      ...config.value,
      ...partial,
    };
  };

  const resetConfig = () => {
    config.value = {
      ...configDefault,
    };
  };

  return {
    updateConfig,
    resetConfig,
    config,
  };
}
