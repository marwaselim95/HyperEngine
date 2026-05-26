import type { IStorageService } from './storage.service';

class LocalStorageAdapter implements IStorageService {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('[LocalStorageAdapter] Failed to persist:', key, e);
    }
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}

export const storageService: IStorageService = new LocalStorageAdapter();

export const STORAGE_KEYS = {
  USER_PROFILE: 'hm_user_profile',
  WORKOUT_SESSIONS: 'hm_workout_sessions',
  PERSONAL_RECORDS: 'hm_personal_records',
  EXERCISE_DEFINITIONS: 'hm_exercise_definitions',
  NUTRITION_LOGS: 'hm_nutrition_logs',
  FOOD_DATABASE: 'hm_food_database',
} as const;
