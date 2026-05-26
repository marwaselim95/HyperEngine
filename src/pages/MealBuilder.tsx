import { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { MacroDashboard } from '../components/nutrition/MacroDashboard';
import { MealSection } from '../components/nutrition/MealSection';
import { CustomMealModal } from '../components/nutrition/CustomMealModal';
import { useNutrition } from '../hooks/useNutrition';
import { useUser } from '../hooks/useUser';
import type { MealType, FoodItem } from '../types';
import { formatDateDisplay, todayISO } from '../utils/dateUtils';

const MEAL_ORDER: MealType[] = [
  'breakfast',
  'lunch',
  'dinner',
  'pre_workout',
  'post_workout',
  'snack',
];

export function MealBuilder() {
  const { profile } = useUser();
  const { getTodayLog, foodDatabase, addFoodEntry, removeFoodEntry, addFoodItem } = useNutrition();
  const [showCustomModal, setShowCustomModal] = useState(false);
  const todayLog = getTodayLog();

  function handleAddEntry(mealType: MealType) {
    return (item: FoodItem, servings: number) => addFoodEntry(item, servings, mealType);
  }

  function handleSaveCustom(item: Omit<FoodItem, 'id' | 'createdAt'>) {
    addFoodItem(item);
  }

  return (
    <PageWrapper>
      {/* Date header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-primary">
            {formatDateDisplay(todayISO())}
          </h2>
          <p className="text-xs text-muted">
            {todayLog.entries.length} food entries logged
          </p>
        </div>
      </div>

      {/* Macro dashboard */}
      <div className="mb-5">
        <MacroDashboard totals={todayLog.totals} targets={profile.macroProfile} />
      </div>

      {/* Custom formulas banner */}
      {foodDatabase.filter((f) => f.isCustomFormula).length === 0 && (
        <button
          onClick={() => setShowCustomModal(true)}
          className="w-full mb-4 rounded-xl border border-dashed border-accent/30 bg-accent/5 px-4 py-4 text-left hover:border-accent/60 transition-colors"
          id="create-first-formula"
        >
          <p className="text-sm font-semibold text-accent">★ Create your first Custom Formula</p>
          <p className="text-xs text-muted mt-0.5">
            Save a precise powder mix, meal prep, or supplement stack as a reusable formula.
          </p>
        </button>
      )}

      {/* Meal sections */}
      <div className="flex flex-col gap-3">
        {MEAL_ORDER.map((mealType) => (
          <MealSection
            key={mealType}
            mealType={mealType}
            entries={todayLog.entries.filter((e) => e.mealType === mealType)}
            foodDatabase={foodDatabase}
            onAddEntry={handleAddEntry(mealType)}
            onDeleteEntry={removeFoodEntry}
            onOpenCustomModal={() => setShowCustomModal(true)}
          />
        ))}
      </div>

      {/* Custom meal modal */}
      <CustomMealModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onSave={handleSaveCustom}
      />
    </PageWrapper>
  );
}
