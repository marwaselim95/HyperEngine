export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extra_active';

export type TrainingGoal = 'hypertrophy' | 'strength' | 'maintenance' | 'cut';

export type UnitSystem = 'metric' | 'imperial';

export interface MacroProfile {
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  dailyCalorieTarget: number;
}

export interface UserProfile {
  id: string;
  name: string;
  bodyweightKg: number;
  heightCm: number;
  age: number;
  sex: 'male' | 'female';
  activityLevel: ActivityLevel;
  goal: TrainingGoal;
  macroProfile: MacroProfile;
  unitSystem: UnitSystem;
  createdAt: string;
  updatedAt: string;
}

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};
