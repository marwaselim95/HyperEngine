import type { WorkoutSession, PersonalRecord, ExerciseDefinition } from '../types';
import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';

export interface WorkoutState {
  sessions: WorkoutSession[];
  personalRecords: Record<string, PersonalRecord>;
  exerciseDefinitions: ExerciseDefinition[];
}

export type WorkoutAction =
  | { type: 'ADD_SESSION'; session: WorkoutSession }
  | { type: 'UPDATE_SESSION'; session: WorkoutSession }
  | { type: 'DELETE_SESSION'; id: string }
  | { type: 'SET_PR'; record: PersonalRecord }
  | { type: 'ADD_EXERCISE_DEFINITION'; definition: ExerciseDefinition }
  | { type: 'HYDRATE'; state: WorkoutState };

export const initialWorkoutState: WorkoutState = {
  sessions: [],
  personalRecords: {},
  exerciseDefinitions: [...EXERCISE_LIBRARY],
};

export function workoutReducer(state: WorkoutState, action: WorkoutAction): WorkoutState {
  switch (action.type) {
    case 'HYDRATE':
      return {
        ...action.state,
        exerciseDefinitions: [
          ...EXERCISE_LIBRARY,
          ...(action.state.exerciseDefinitions?.filter((d) => d.isCustom) ?? []),
        ],
      };

    case 'ADD_SESSION':
      return { ...state, sessions: [action.session, ...state.sessions] };

    case 'UPDATE_SESSION':
      return {
        ...state,
        sessions: state.sessions.map((s) => (s.id === action.session.id ? action.session : s)),
      };

    case 'DELETE_SESSION':
      return { ...state, sessions: state.sessions.filter((s) => s.id !== action.id) };

    case 'SET_PR':
      return {
        ...state,
        personalRecords: {
          ...state.personalRecords,
          [action.record.exerciseName]: action.record,
        },
      };

    case 'ADD_EXERCISE_DEFINITION':
      return {
        ...state,
        exerciseDefinitions: [...state.exerciseDefinitions, action.definition],
      };

    default:
      return state;
  }
}
