import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type Dispatch,
} from 'react';
import {
  workoutReducer,
  initialWorkoutState,
  type WorkoutState,
  type WorkoutAction,
} from './workoutReducer';
import {
  nutritionReducer,
  initialNutritionState,
  type NutritionState,
  type NutritionAction,
} from './nutritionReducer';
import {
  userReducer,
  initialUserState,
  type UserState,
  type UserAction,
} from './userReducer';
import { storageService, STORAGE_KEYS } from '../services/localStorage.adapter';

interface AppContextValue {
  user: UserState;
  workout: WorkoutState;
  nutrition: NutritionState;
  dispatchUser: Dispatch<UserAction>;
  dispatchWorkout: Dispatch<WorkoutAction>;
  dispatchNutrition: Dispatch<NutritionAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, dispatchUser] = useReducer(
    userReducer,
    initialUserState,
    () => storageService.get<UserState>(STORAGE_KEYS.USER_PROFILE) ?? initialUserState,
  );
  const [workout, dispatchWorkout] = useReducer(
    workoutReducer,
    initialWorkoutState,
    (init) => {
      const persisted = storageService.get<WorkoutState>(STORAGE_KEYS.WORKOUT_SESSIONS);
      if (persisted) {
        return workoutReducer(init, { type: 'HYDRATE', state: persisted });
      }
      return init;
    },
  );
  const [nutrition, dispatchNutrition] = useReducer(
    nutritionReducer,
    initialNutritionState,
    () => storageService.get<NutritionState>(STORAGE_KEYS.NUTRITION_LOGS) ?? initialNutritionState,
  );

  // Persist on every state change
  useEffect(() => {
    storageService.set(STORAGE_KEYS.USER_PROFILE, user);
  }, [user]);

  useEffect(() => {
    storageService.set(STORAGE_KEYS.WORKOUT_SESSIONS, workout);
  }, [workout]);

  useEffect(() => {
    storageService.set(STORAGE_KEYS.NUTRITION_LOGS, nutrition);
  }, [nutrition]);

  return (
    <AppContext.Provider value={{ user, workout, nutrition, dispatchUser, dispatchWorkout, dispatchNutrition }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}
