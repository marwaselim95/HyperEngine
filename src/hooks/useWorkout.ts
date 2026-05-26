import { useAppContext } from '../store/AppContext';
import type { WorkoutSession, PersonalRecord, ExerciseDefinition } from '../types';
import { generateId } from '../utils/formatters';
import { calculateE1RM } from '../utils/volumeCalculators';
import { todayISO } from '../utils/dateUtils';

export function useWorkout() {
  const { workout, dispatchWorkout } = useAppContext();

  function addSession(partial: Omit<WorkoutSession, 'id'>): WorkoutSession {
    const session: WorkoutSession = { ...partial, id: generateId() };
    dispatchWorkout({ type: 'ADD_SESSION', session });
    checkForPRs(session);
    return session;
  }

  function updateSession(session: WorkoutSession): void {
    dispatchWorkout({ type: 'UPDATE_SESSION', session });
    checkForPRs(session);
  }

  function deleteSession(id: string): void {
    dispatchWorkout({ type: 'DELETE_SESSION', id });
  }

  function duplicateSession(source: WorkoutSession): WorkoutSession {
    const duplicate: WorkoutSession = {
      ...source,
      id: generateId(),
      date: todayISO(),
      templateId: source.id,
      exercises: source.exercises.map((block) => ({
        ...block,
        id: generateId(),
        sets: block.sets.map((s) => ({
          ...s,
          id: generateId(),
          completedAt: new Date().toISOString(),
        })),
      })),
    };
    dispatchWorkout({ type: 'ADD_SESSION', session: duplicate });
    checkForPRs(duplicate);
    return duplicate;
  }

  function addExerciseDefinition(def: Omit<ExerciseDefinition, 'isCustom'>): void {
    dispatchWorkout({
      type: 'ADD_EXERCISE_DEFINITION',
      definition: { ...def, isCustom: true },
    });
  }

  function checkForPRs(session: WorkoutSession): void {
    session.exercises.forEach((block) => {
      block.sets
        .filter((s) => !s.isWarmup && s.reps > 0 && s.weightKg > 0)
        .forEach((s) => {
          const newE1RM = calculateE1RM(s.weightKg, s.reps);
          const existing = workout.personalRecords[block.exerciseName];
          if (!existing || newE1RM > existing.e1RM) {
            const record: PersonalRecord = {
              exerciseName: block.exerciseName,
              weightKg: s.weightKg,
              reps: s.reps,
              e1RM: newE1RM,
              achievedAt: s.completedAt,
            };
            dispatchWorkout({ type: 'SET_PR', record });
          }
        });
    });
  }

  return {
    sessions: workout.sessions,
    personalRecords: workout.personalRecords,
    exerciseDefinitions: workout.exerciseDefinitions,
    addSession,
    updateSession,
    deleteSession,
    duplicateSession,
    addExerciseDefinition,
  };
}
