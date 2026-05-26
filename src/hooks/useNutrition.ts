import { useAppContext } from '../store/AppContext';
import type { FoodEntry, FoodItem, DailyNutritionLog, MacroNutrients, MealType } from '../types';
import { generateId } from '../utils/formatters';
import { todayISO } from '../utils/dateUtils';
import { ZERO_MACROS } from '../store/nutritionReducer';

export function useNutrition() {
  const { nutrition, dispatchNutrition } = useAppContext();

  function getTodayLog(): DailyNutritionLog {
    return (
      nutrition.logs.find((l) => l.date === todayISO()) ?? {
        date: todayISO(),
        entries: [],
        totals: { ...ZERO_MACROS },
      }
    );
  }

  function getLogForDate(date: string): DailyNutritionLog | undefined {
    return nutrition.logs.find((l) => l.date === date);
  }

  function addFoodEntry(foodItem: FoodItem, servings: number, mealType: MealType): void {
    const log = getTodayLog();
    const macros: MacroNutrients = {
      proteinG: foodItem.macrosPerServing.proteinG * servings,
      carbsG: foodItem.macrosPerServing.carbsG * servings,
      fatG: foodItem.macrosPerServing.fatG * servings,
      calories: foodItem.macrosPerServing.calories * servings,
    };

    const entry: FoodEntry = {
      id: generateId(),
      foodItemId: foodItem.id,
      foodItemName: foodItem.name,
      servingsConsumed: servings,
      macros,
      loggedAt: new Date().toISOString(),
      mealType,
    };

    const updatedEntries = [...log.entries, entry];
    const updatedLog: DailyNutritionLog = {
      ...log,
      entries: updatedEntries,
      totals: sumMacros(updatedEntries),
    };
    dispatchNutrition({ type: 'UPSERT_LOG', log: updatedLog });
  }

  function removeFoodEntry(entryId: string): void {
    const log = getTodayLog();
    const updatedEntries = log.entries.filter((e) => e.id !== entryId);
    dispatchNutrition({
      type: 'UPSERT_LOG',
      log: { ...log, entries: updatedEntries, totals: sumMacros(updatedEntries) },
    });
  }

  function addFoodItem(item: Omit<FoodItem, 'id' | 'createdAt'>): FoodItem {
    const newItem: FoodItem = {
      ...item,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    dispatchNutrition({ type: 'ADD_FOOD_ITEM', item: newItem });
    return newItem;
  }

  function deleteFoodItem(id: string): void {
    dispatchNutrition({ type: 'DELETE_FOOD_ITEM', id });
  }

  return {
    logs: nutrition.logs,
    foodDatabase: nutrition.foodDatabase,
    customFormulas: nutrition.foodDatabase.filter((f) => f.isCustomFormula),
    getTodayLog,
    getLogForDate,
    addFoodEntry,
    removeFoodEntry,
    addFoodItem,
    deleteFoodItem,
  };
}

function sumMacros(entries: FoodEntry[]): MacroNutrients {
  return entries.reduce(
    (acc, e) => ({
      proteinG: acc.proteinG + e.macros.proteinG,
      carbsG: acc.carbsG + e.macros.carbsG,
      fatG: acc.fatG + e.macros.fatG,
      calories: acc.calories + e.macros.calories,
    }),
    { ...ZERO_MACROS },
  );
}
