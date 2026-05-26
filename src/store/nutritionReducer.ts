import type { DailyNutritionLog, FoodItem, MacroNutrients } from '../types';

export interface NutritionState {
  logs: DailyNutritionLog[];
  foodDatabase: FoodItem[];
}

export type NutritionAction =
  | { type: 'UPSERT_LOG'; log: DailyNutritionLog }
  | { type: 'ADD_FOOD_ITEM'; item: FoodItem }
  | { type: 'UPDATE_FOOD_ITEM'; item: FoodItem }
  | { type: 'DELETE_FOOD_ITEM'; id: string }
  | { type: 'HYDRATE'; state: NutritionState };

export const ZERO_MACROS: MacroNutrients = { proteinG: 0, carbsG: 0, fatG: 0, calories: 0 };

export const initialNutritionState: NutritionState = {
  logs: [],
  foodDatabase: [],
};

export function nutritionReducer(state: NutritionState, action: NutritionAction): NutritionState {
  switch (action.type) {
    case 'HYDRATE':
      return action.state;

    case 'UPSERT_LOG': {
      const exists = state.logs.some((l) => l.date === action.log.date);
      return {
        ...state,
        logs: exists
          ? state.logs.map((l) => (l.date === action.log.date ? action.log : l))
          : [action.log, ...state.logs],
      };
    }

    case 'ADD_FOOD_ITEM':
      return { ...state, foodDatabase: [...state.foodDatabase, action.item] };

    case 'UPDATE_FOOD_ITEM':
      return {
        ...state,
        foodDatabase: state.foodDatabase.map((f) => (f.id === action.item.id ? action.item : f)),
      };

    case 'DELETE_FOOD_ITEM':
      return {
        ...state,
        foodDatabase: state.foodDatabase.filter((f) => f.id !== action.id),
      };

    default:
      return state;
  }
}
