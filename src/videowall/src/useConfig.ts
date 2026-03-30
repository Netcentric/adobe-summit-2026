import { ref } from 'vue';
import type { Config } from './types.ts';

const configDefault: Config = {
  startTime: Date.now() - 60 * 60 * 1000,
  debug: 0,
  pollInterval: 30000,
  slidePauseIn: 300,
  slidePauseOut: 120,
  slideTransition: 1400,
  advertCounter: '10,20,30,20',
  advertUsePreview: 0,
  advertPauseOut: 1200,
  apiKey: 'x1fG7UmmyT4qL1NePJy4C31awLTi64R83mu7J7pt',
  apiUrl: 'https://api.netcentric.biz/photobooth/latest',
};

const configDevelopment: Partial<Config> = {
  advertCounter: '1,2,3,4',
  advertUsePreview: 1,
  debug: 1,
};

const config = ref<Config>(configDefault);

export default function useConfig() {
  const updateConfig = (partial: Partial<Config>) => {
    config.value = {
      ...config.value,
      ...partial,
    };
  };

  const applyDevelopmentConfig = () => {
    updateConfig(configDevelopment);
  };

  const resetConfig = () => {
    config.value = {
      ...configDefault,
    };
  };

  return {
    updateConfig,
    resetConfig,
    applyDevelopmentConfig,
    config,
  };
}
