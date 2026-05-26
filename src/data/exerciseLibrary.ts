import type { ExerciseDefinition } from '../types';

export const EXERCISE_LIBRARY: ExerciseDefinition[] = [
  // Chest
  { name: 'Barbell Bench Press', muscleGroup: 'chest', equipment: 'barbell', isCustom: false },
  { name: 'Incline Barbell Press', muscleGroup: 'chest', equipment: 'barbell', isCustom: false },
  { name: 'Decline Barbell Press', muscleGroup: 'chest', equipment: 'barbell', isCustom: false },
  { name: 'Dumbbell Bench Press', muscleGroup: 'chest', equipment: 'dumbbell', isCustom: false },
  { name: 'Incline Dumbbell Press', muscleGroup: 'chest', equipment: 'dumbbell', isCustom: false },
  { name: 'Dumbbell Fly', muscleGroup: 'chest', equipment: 'dumbbell', isCustom: false },
  { name: 'Cable Fly', muscleGroup: 'chest', equipment: 'cable', isCustom: false },
  { name: 'Chest Press Machine', muscleGroup: 'chest', equipment: 'machine', isCustom: false },
  { name: 'Push-Up', muscleGroup: 'chest', equipment: 'bodyweight', isCustom: false },

  // Back
  { name: 'Barbell Deadlift', muscleGroup: 'back', equipment: 'barbell', isCustom: false },
  { name: 'Barbell Row', muscleGroup: 'back', equipment: 'barbell', isCustom: false },
  { name: 'T-Bar Row', muscleGroup: 'back', equipment: 'barbell', isCustom: false },
  { name: 'Pull-Up', muscleGroup: 'back', equipment: 'bodyweight', isCustom: false },
  { name: 'Lat Pulldown', muscleGroup: 'back', equipment: 'cable', isCustom: false },
  { name: 'Seated Cable Row', muscleGroup: 'back', equipment: 'cable', isCustom: false },
  { name: 'Dumbbell Row', muscleGroup: 'back', equipment: 'dumbbell', isCustom: false },
  { name: 'Chest-Supported Row', muscleGroup: 'back', equipment: 'dumbbell', isCustom: false },

  // Shoulders
  { name: 'Barbell Overhead Press', muscleGroup: 'shoulders', equipment: 'barbell', isCustom: false },
  { name: 'Dumbbell Overhead Press', muscleGroup: 'shoulders', equipment: 'dumbbell', isCustom: false },
  { name: 'Lateral Raise', muscleGroup: 'shoulders', equipment: 'dumbbell', isCustom: false },
  { name: 'Cable Lateral Raise', muscleGroup: 'shoulders', equipment: 'cable', isCustom: false },
  { name: 'Rear Delt Fly', muscleGroup: 'shoulders', equipment: 'dumbbell', isCustom: false },
  { name: 'Face Pull', muscleGroup: 'shoulders', equipment: 'cable', isCustom: false },

  // Biceps
  { name: 'Barbell Curl', muscleGroup: 'biceps', equipment: 'barbell', isCustom: false },
  { name: 'EZ-Bar Curl', muscleGroup: 'biceps', equipment: 'ez_bar', isCustom: false },
  { name: 'Dumbbell Curl', muscleGroup: 'biceps', equipment: 'dumbbell', isCustom: false },
  { name: 'Hammer Curl', muscleGroup: 'biceps', equipment: 'dumbbell', isCustom: false },
  { name: 'Cable Curl', muscleGroup: 'biceps', equipment: 'cable', isCustom: false },
  { name: 'Preacher Curl', muscleGroup: 'biceps', equipment: 'machine', isCustom: false },

  // Triceps
  { name: 'Close-Grip Bench Press', muscleGroup: 'triceps', equipment: 'barbell', isCustom: false },
  { name: 'Skull Crusher', muscleGroup: 'triceps', equipment: 'ez_bar', isCustom: false },
  { name: 'Tricep Pushdown', muscleGroup: 'triceps', equipment: 'cable', isCustom: false },
  { name: 'Overhead Tricep Extension', muscleGroup: 'triceps', equipment: 'cable', isCustom: false },
  { name: 'Dips', muscleGroup: 'triceps', equipment: 'bodyweight', isCustom: false },

  // Quads
  { name: 'Barbell Squat', muscleGroup: 'quads', equipment: 'barbell', isCustom: false },
  { name: 'Front Squat', muscleGroup: 'quads', equipment: 'barbell', isCustom: false },
  { name: 'Leg Press', muscleGroup: 'quads', equipment: 'machine', isCustom: false },
  { name: 'Hack Squat', muscleGroup: 'quads', equipment: 'machine', isCustom: false },
  { name: 'Leg Extension', muscleGroup: 'quads', equipment: 'machine', isCustom: false },
  { name: 'Bulgarian Split Squat', muscleGroup: 'quads', equipment: 'dumbbell', isCustom: false },

  // Hamstrings
  { name: 'Romanian Deadlift', muscleGroup: 'hamstrings', equipment: 'barbell', isCustom: false },
  { name: 'Lying Leg Curl', muscleGroup: 'hamstrings', equipment: 'machine', isCustom: false },
  { name: 'Seated Leg Curl', muscleGroup: 'hamstrings', equipment: 'machine', isCustom: false },
  { name: 'Good Morning', muscleGroup: 'hamstrings', equipment: 'barbell', isCustom: false },

  // Glutes
  { name: 'Hip Thrust', muscleGroup: 'glutes', equipment: 'barbell', isCustom: false },
  { name: 'Cable Kickback', muscleGroup: 'glutes', equipment: 'cable', isCustom: false },

  // Calves
  { name: 'Standing Calf Raise', muscleGroup: 'calves', equipment: 'machine', isCustom: false },
  { name: 'Seated Calf Raise', muscleGroup: 'calves', equipment: 'machine', isCustom: false },

  // Core
  { name: 'Plank', muscleGroup: 'core', equipment: 'bodyweight', isCustom: false },
  { name: 'Cable Crunch', muscleGroup: 'core', equipment: 'cable', isCustom: false },
  { name: 'Hanging Leg Raise', muscleGroup: 'core', equipment: 'bodyweight', isCustom: false },
];
