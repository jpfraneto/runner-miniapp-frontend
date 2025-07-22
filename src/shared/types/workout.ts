export interface Workout {
  fid: number;
  distanceMeters: string;
  duration: number;
  castHash: string;
  createdAt: string;
  user: {
    fid: number;
    username: string;
    pfpUrl: string;
  };
}
