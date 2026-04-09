import { ref } from 'vue';
import type { Config, ConfigKey } from './types.ts';

export const configLabelMap: Partial<Record<ConfigKey, string>> = {
  advertConfig: 'advertConfig (playCount : slidesCount : url)',
};

const advertConfig = [
  '2:5:summit-2026_short-1.mp4',
  '1:10:summit-2026_short-2.mp4',
  '1:20:https://adobe-summit-2026.innovationlab.cx/static/CognizantMoment_Teaser_260224_FINAL1.mp4',
];

const configDefault: Config = {
  startTime: Date.now() - 60 * 60 * 1000,
  debug: 0,
  pollInterval: 30000,
  slidePauseIn: 300,
  slidePauseOut: 120,
  slideTransition: 1400,
  advertConfig,
  advertUsePreview: 0,
  advertPauseOut: 800,
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
