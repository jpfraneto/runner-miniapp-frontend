// Week resets every Friday at 3pm Chile time (UTC-3)
// Week counter starts from 1 (first week with data)

// Reference date for the end of week 0 - this is when the first leaderboard ended
// All calculations are based on this absolute timestamp
export const WEEK_ZERO_END_DATE = new Date("2023-12-22T18:00:00.000Z");
const WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export function getNextResetTime(): Date {
  const now = Date.now();
  
  // How many milliseconds have passed since week 0 ended?
  const msSinceWeekZeroEnd = now - WEEK_ZERO_END_DATE.getTime();
  
  // How many complete weeks have passed since then?
  const weeksPassed = Math.floor(msSinceWeekZeroEnd / WEEK_MS);
  
  // Next reset is at the end of the current week
  const nextResetMs = WEEK_ZERO_END_DATE.getTime() + (weeksPassed + 1) * WEEK_MS;
  
  return new Date(nextResetMs);
}

export function getCurrentWeekNumber(): number {
  const now = Date.now();
  
  // How many milliseconds have passed since week 0 ended?
  const msSinceWeekZeroEnd = now - WEEK_ZERO_END_DATE.getTime();
  
  // If we're before the reference date, we're still in week 0
  if (msSinceWeekZeroEnd < 0) {
    return 0;
  }
  
  // How many complete weeks have passed since week 0 ended?
  const weeksPassed = Math.floor(msSinceWeekZeroEnd / WEEK_MS);
  
  // Week 0 ended at WEEK_ZERO_END_DATE, so current week is weeksPassed + 1
  return weeksPassed + 1;
}

export function getTimeUntilReset(): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const now = Date.now();
  const nextReset = getNextResetTime();
  const timeDiff = nextReset.getTime() - now;

  const days = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
  const hours = Math.floor(
    (timeDiff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
  );
  const minutes = Math.floor((timeDiff % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((timeDiff % (60 * 1000)) / 1000);

  return { days, hours, minutes, seconds };
}

export function formatWeekDisplay(weekNumber: number): string {
  return `Week ${weekNumber}`;
}

export function formatCountdown(
  timeUntil: ReturnType<typeof getTimeUntilReset>
): string {
  const { days, hours, minutes, seconds } = timeUntil;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

export function getWeekDateRange(weekNumber: number): {
  start: Date;
  end: Date;
} {
  // Week 0 ended at WEEK_ZERO_END_DATE, so week 1 starts right after that
  // Week N starts at: WEEK_ZERO_END_DATE + (N-1) * WEEK_MS
  const weekStartMs = WEEK_ZERO_END_DATE.getTime() + (weekNumber - 1) * WEEK_MS;
  const weekEndMs = weekStartMs + WEEK_MS - 1; // -1ms so it ends just before the next week starts
  
  return { 
    start: new Date(weekStartMs), 
    end: new Date(weekEndMs) 
  };
}

export function formatWeekDateRange(weekNumber: number): string {
  const { start, end } = getWeekDateRange(weekNumber);

  // Format dates in Spanish locale with abbreviated month names
  const startDay = start.getDate();
  const startMonth = start
    .toLocaleDateString("es-ES", { month: "short" })
    .toLowerCase();
  const endDay = end.getDate();
  const endMonth = end
    .toLocaleDateString("es-ES", { month: "short" })
    .toLowerCase();

  return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
}
