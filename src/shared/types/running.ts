// Legacy interface for backward compatibility
export interface RunningSession {
  id?: string | number;
  fid: number;
  distance: number; // in kilometers
  duration: number; // in minutes
  castHash: string;
  completedDate?: string;
  user: {
    fid: number;
    username: string;
    pfpUrl: string;
  };
}
