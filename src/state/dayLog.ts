import type { DayLog, GrubClubState } from './types';

export function getDayLog(state: GrubClubState, dateStr: string, today: string): DayLog | null {
  if (dateStr === today) {
    return {
      foodCounts: state.todayFoodCounts,
      goalIds: state.todayGoals,
      points: state.todayPoints,
    };
  }
  return state.dayLogs[dateStr] ?? null;
}

export function hasAnyLog(log: DayLog | null): boolean {
  if (!log) return false;
  return Object.values(log.foodCounts).some((c) => c > 0) || log.goalIds.length > 0 || log.points > 0;
}
