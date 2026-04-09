export interface DriverRaw {
  image: string;
  video: string;
  session: string;
  created: number;
  context: {
    promptParameters: {
      eraTitle: string;
      eraYears: string;
      eraDetail: string;
      circuitName: string;
      circuitLocation: string;
    };
  };
}

export interface Driver extends DriverRaw {
  era: string;
  circuit: string;
  played: number; // timestamp
  count: number;
  tCreated: Temporal.PlainDateTime;
  tPlayed: null | Temporal.PlainDateTime;
}

export interface Config {
  startTime: number;
  debug: number;
  pollInterval: number;
  slidePauseIn: number;
  slidePauseOut: number;
  slideTransition: number;
  advertConfig: string[];
  advertPauseOut: number;
  advertUsePreview: 0 | 1;
  apiKey: string;
  apiUrl: string;
}
export type ConfigKey = keyof Config;

export interface AdvertConfig {
  advertCounter: number;
  slideCounter: number;
  advertUrl: string;
}
