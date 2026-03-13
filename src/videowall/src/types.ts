export interface DriverRaw {
  image: string;
  video: string;
  statusUrl: string;
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
  uid: string;
  era: string;
  circuit: string;
  played: number | null; // timestamp
  count: number;
}
