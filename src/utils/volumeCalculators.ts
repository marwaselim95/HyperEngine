import type { WorkoutSession } from '../types';

/** Epley formula: e1RM = weight × (1 + reps/30) */
export function calculateE1RM(weightKg: number, reps: number): number {
  if (reps === 1) return weightKg;
  return Math.round(weightKg * (1 + reps / 30) * 10) / 10;
}

/** Total volume for a single session (sum of weight × reps for all working sets) */
export function sessionVolume(session: WorkoutSession): number {
  return session.exercises.reduce((total, block) => {
    const blockVolume = block.sets
      .filter((s) => !s.isWarmup)
      .reduce((sum, s) => sum + s.weightKg * s.reps, 0);
    return total + blockVolume;
  }, 0);
}

/** Weekly volume aggregated from an array of sessions */
export function weeklyVolume(sessions: WorkoutSession[]): number {
  return sessions.reduce((sum, s) => sum + sessionVolume(s), 0);
}

/** Group sessions by ISO week string (YYYY-Www) */
export function groupSessionsByWeek(
  sessions: WorkoutSession[],
): Record<string, WorkoutSession[]> {
  return sessions.reduce<Record<string, WorkoutSession[]>>((acc, session) => {
    const week = getISOWeek(session.date);
    if (!acc[week]) acc[week] = [];
    acc[week].push(session);
    return acc;
  }, {});
}

function getISOWeek(dateStr: string): string {
  const d = new Date(dateStr);
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462 * 10) / 10;
}

export function lbsToKg(lbs: number): number {
  return Math.round((lbs / 2.20462) * 10) / 10;
}
