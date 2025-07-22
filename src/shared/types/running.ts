// Legacy interface for backward compatibility
export interface RunningSession {
  id?: string;
  fid: number;
  distanceMeters: number;
  distance?: number;
  duration: number;
  castHash: string;
  createdAt?: string;
  completedDate?: string;
  units?: "km" | "mi";
  pace?: number;
  calories?: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  confidence?: number;
  isPersonalBest?: boolean;
  personalBestType?: string;
  screenshotUrls?: string[];
  intervals?: any[];
  rawText?: string;
  user: {
    fid: number;
    username: string;
    pfpUrl: string;
  };
  isWorkoutImage?: boolean;
}
