import type { UserProfile } from '../types';
import { generateId } from '../utils/formatters';
import { todayISO } from '../utils/dateUtils';

export interface UserState {
  profile: UserProfile | null;
  isOnboarded: boolean;
}

export type UserAction =
  | { type: 'SET_PROFILE'; profile: UserProfile }
  | { type: 'UPDATE_PROFILE'; partial: Partial<UserProfile> }
  | { type: 'HYDRATE'; state: UserState };

export const initialUserState: UserState = {
  profile: null,
  isOnboarded: false,
};

export const DEFAULT_PROFILE: UserProfile = {
  id: generateId(),
  name: 'Athlete',
  bodyweightKg: 80,
  heightCm: 178,
  age: 25,
  sex: 'male',
  activityLevel: 'moderately_active',
  goal: 'hypertrophy',
  unitSystem: 'metric',
  macroProfile: {
    proteinGrams: 176,
    carbsGrams: 350,
    fatGrams: 70,
    dailyCalorieTarget: 2700,
  },
  createdAt: todayISO(),
  updatedAt: todayISO(),
};

export function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'HYDRATE':
      return action.state;

    case 'SET_PROFILE':
      return { profile: action.profile, isOnboarded: true };

    case 'UPDATE_PROFILE':
      if (!state.profile) return state;
      return {
        ...state,
        profile: { ...state.profile, ...action.partial, updatedAt: todayISO() },
      };

    default:
      return state;
  }
}
