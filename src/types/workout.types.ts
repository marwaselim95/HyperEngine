export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'core'
  | 'full_body';

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'resistance_band'
  | 'kettlebell'
  | 'ez_bar'
  | 'smith_machine';

export interface ExerciseSet {
  id: string;
  setNumber: number;
  weightKg: number;
  reps: number;
  rpe?: number;
  isDropSet: boolean;
  isWarmup: boolean;
  completedAt: string;
}

export interface ExerciseBlock {
  id: string;
  exerciseName: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
  sets: ExerciseSet[];
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  date: string;
  name: string;
  exercises: ExerciseBlock[];
  durationMinutes?: number;
  bodyweightKg?: number;
  notes?: string;
  templateId?: string;
}

export interface PersonalRecord {
  exerciseName: string;
  weightKg: number;
  reps: number;
  e1RM: number;
  achievedAt: string;
}

export interface ExerciseDefinition {
  name: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
  isCustom: boolean;
}
