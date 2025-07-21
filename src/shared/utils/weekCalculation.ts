// Week resets every Friday at 3pm Chile time (UTC-3)
// Week counter starts from 0 (first week with data)

export const CHILE_TIMEZONE_OFFSET = -3; // UTC-3
export const WEEK_RESET_DAY = 5; // Friday (0 = Sunday, 1 = Monday, ..., 5 = Friday)
export const WEEK_RESET_HOUR = 15; // 3 PM

// Reference date for week 0 - you should set this to the first Friday 3pm when the system started
export const WEEK_ZERO_DATE = new Date('2024-07-19T18:00:00.000Z'); // Example: July 19, 2024 3pm Chile time (UTC)

export function getChileTime(): Date {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const chileTime = new Date(utc + (CHILE_TIMEZONE_OFFSET * 3600000));
  return chileTime;
}

export function getNextResetTime(): Date {
  const now = getChileTime();
  const nextReset = new Date(now);
  
  // Calculate days until next Friday
  const daysUntilFriday = (WEEK_RESET_DAY - now.getDay() + 7) % 7;
  
  // If it's Friday but before 3pm, reset is today
  if (now.getDay() === WEEK_RESET_DAY && now.getHours() < WEEK_RESET_HOUR) {
    nextReset.setHours(WEEK_RESET_HOUR, 0, 0, 0);
  } else {
    // Otherwise, next Friday at 3pm
    nextReset.setDate(now.getDate() + (daysUntilFriday === 0 ? 7 : daysUntilFriday));
    nextReset.setHours(WEEK_RESET_HOUR, 0, 0, 0);
  }
  
  return nextReset;
}

export function getCurrentWeekNumber(): number {
  const now = getChileTime();
  const weekZero = new Date(WEEK_ZERO_DATE);
  
  // Calculate the current week start (last Friday 3pm)
  let currentWeekStart = new Date(now);
  const daysSinceFriday = (now.getDay() - WEEK_RESET_DAY + 7) % 7;
  
  if (now.getDay() === WEEK_RESET_DAY && now.getHours() >= WEEK_RESET_HOUR) {
    // It's Friday after 3pm, so we're in the new week
    currentWeekStart.setHours(WEEK_RESET_HOUR, 0, 0, 0);
  } else {
    // Go back to the last Friday 3pm
    currentWeekStart.setDate(now.getDate() - daysSinceFriday);
    currentWeekStart.setHours(WEEK_RESET_HOUR, 0, 0, 0);
  }
  
  // Calculate weeks since week zero
  const timeDiff = currentWeekStart.getTime() - weekZero.getTime();
  const weeksDiff = Math.floor(timeDiff / (7 * 24 * 60 * 60 * 1000));
  
  return Math.max(0, weeksDiff);
}

export function getTimeUntilReset(): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const now = getChileTime();
  const nextReset = getNextResetTime();
  const timeDiff = nextReset.getTime() - now.getTime();
  
  const days = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((timeDiff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((timeDiff % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((timeDiff % (60 * 1000)) / 1000);
  
  return { days, hours, minutes, seconds };
}

export function formatWeekDisplay(weekNumber: number): string {
  return `Week ${weekNumber}`;
}

export function formatCountdown(timeUntil: ReturnType<typeof getTimeUntilReset>): string {
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