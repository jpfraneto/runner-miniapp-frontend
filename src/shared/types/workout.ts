export interface Workout {
  id: number;
  fid: number;
  username: string;
  pfpUrl: string;
  meters: number;
  minutes: number;
  kilometers: string;
  pace: string;
  castHash: string;
  comment?: string;
  createdAt: string;
}