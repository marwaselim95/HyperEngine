import type { MacroProfile, ActivityLevel, UserProfile } from '../types';

const ACTIVITY_MULTS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

/** Mifflin-St Jeor BMR formula */
export function calculateBMR(profile: Pick<UserProfile, 'bodyweightKg' | 'heightCm' | 'age' | 'sex'>): number {
  const { bodyweightKg, heightCm, age, sex } = profile;
  const base = 10 * bodyweightKg + 6.25 * heightCm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

export function calculateTDEE(profile: UserProfile): number {
  return calculateBMR(profile) * ACTIVITY_MULTS[profile.activityLevel];
}

/** Derive recommended macro split from calorie target and goal */
export function deriveMacroProfile(
  calorieTarget: number,
  bodyweightKg: number,
  goal: UserProfile['goal'],
): MacroProfile {
  const proteinGrams = Math.round(bodyweightKg * 2.2); // 2.2g/kg for hypertrophy
  const proteinCals = proteinGrams * 4;

  let fatCals: number;
  let carbCals: number;

  switch (goal) {
    case 'cut':
      fatCals = calorieTarget * 0.25;
      carbCals = calorieTarget - proteinCals - fatCals;
      break;
    case 'hypertrophy':
    case 'strength':
      fatCals = calorieTarget * 0.28;
      carbCals = calorieTarget - proteinCals - fatCals;
      break;
    case 'maintenance':
    default:
      fatCals = calorieTarget * 0.3;
      carbCals = calorieTarget - proteinCals - fatCals;
  }

  return {
    proteinGrams,
    carbsGrams: Math.max(0, Math.round(carbCals / 4)),
    fatGrams: Math.round(fatCals / 9),
    dailyCalorieTarget: calorieTarget,
  };
}

export function macroCalories(macros: { proteinG: number; carbsG: number; fatG: number }): number {
  return macros.proteinG * 4 + macros.carbsG * 4 + macros.fatG * 9;
}

export function calcMacroPercent(consumed: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((consumed / target) * 100));
}
