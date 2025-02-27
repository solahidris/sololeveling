import { WorkoutLog } from "@/context/PlayerContext";

export const calculateDayStreak = (logs: WorkoutLog[]) => {
  const sortedLogs = logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let streak = 0;
  let currentStreak = 0;
  let lastDate: Date | null = null;

  sortedLogs.forEach(log => {
    const logDate = new Date(log.date);
    if (lastDate) {
      const isConsecutiveDay =
        logDate.getDate() === lastDate.getDate() + 1 &&
        logDate.getMonth() === lastDate.getMonth() &&
        logDate.getFullYear() === lastDate.getFullYear();

      if (isConsecutiveDay) {
        currentStreak++;
      } else if (logDate > lastDate) {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }
    lastDate = logDate;
    streak = Math.max(streak, currentStreak);
  });

  return streak;
};