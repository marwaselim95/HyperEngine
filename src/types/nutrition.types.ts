export type MealType =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'snack'
  | 'pre_workout'
  | 'post_workout';

export interface MacroNutrients {
  proteinG: number;
  carbsG: number;
  fatG: number;
  calories: number;
}

export interface CustomFormulaIngredient {
  name: string;
  amountG: number;
  macros: MacroNutrients;
}

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  servingSizeG: number;
  macrosPerServing: MacroNutrients;
  isCustomFormula: boolean;
  formulaNotes?: string;
  ingredients?: CustomFormulaIngredient[];
  createdAt: string;
}

export interface FoodEntry {
  id: string;
  foodItemId: string;
  foodItemName: string;
  servingsConsumed: number;
  macros: MacroNutrients;
  loggedAt: string;
  mealType: MealType;
}

export interface DailyNutritionLog {
  date: string;
  entries: FoodEntry[];
  totals: MacroNutrients;
}
