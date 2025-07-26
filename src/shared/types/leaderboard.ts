export interface LeaderboardEntry {
  position: number;
  pfpUrl: string;
  fid: number;
  username: string;
  totalKilometers: number;
  totalRuns: number;
  totalDuration?: number; // Total duration in minutes
}

export type Leaderboard = LeaderboardEntry[];
