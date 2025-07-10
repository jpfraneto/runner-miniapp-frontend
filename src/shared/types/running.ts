export interface RunningInterval {
  number: number;
  type: "work" | "rest"; // assuming there might be rest intervals too
  distance: number;
  duration: string; // format: "mm:ss"
  pace: string; // format: "mm:ss/km" or "mm:ss/mi"
}

export interface RunningSession {
  fid: number; // user identifier
  comment: string;
  isWorkoutImage: boolean;
  distance: number | string;
  duration: number; // in minutes
  units: "km" | "mi";
  pace: string; // format: "mm:ss/km" or "mm:ss/mi"
  intervals: RunningInterval[];
  confidence: number | string; // 0-1 range
  extractedText: string[];
  // Additional fields for display and tracking
  id?: string | number;
  completedDate?: string;
  calories?: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  isPersonalBest?: boolean;
  personalBestType?: string;
  screenshotUrls?: string[];
  rawText?: string;
  // User and cast information
  userName?: string;
  userPhotoUrl?: string;
  castHash?: string;
  user: {
    fid: number;
    username: string;
    pfpUrl: string;
  };
}
