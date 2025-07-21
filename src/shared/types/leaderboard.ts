export interface LeaderboardEntry {
  position: number;
  fid: number;
  username: string;
  totalKilometers: number;
  totalRuns: number;
}

export type Leaderboard = LeaderboardEntry[];