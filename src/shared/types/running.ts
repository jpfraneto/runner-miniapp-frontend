// Legacy interface for backward compatibility
export interface RunningSession {
  id?: string;
  fid: number;
  distanceMeters: number;
  duration: number;
  castHash: string;
  createdAt?: string;
  completedDate?: string;
  user: {
    fid: number;
    username: string;
    pfpUrl: string;
  };
  isWorkoutImage?: boolean;
  // Additional properties for workout analysis
  isPersonalBest?: boolean;
  distance?: number;
  units?: string;
  pace?: string;
  calories?: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  screenshotUrls?: string[];
  confidence?: number;
  rawText?: string;
  intervals?: any[];
}
