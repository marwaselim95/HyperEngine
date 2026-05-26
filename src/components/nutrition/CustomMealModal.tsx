import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { FoodItem, CustomFormulaIngredient, MacroNutrients } from '../../types';
import { macroCalories } from '../../utils/macroCalculators';
import { generateId } from '../../utils/formatters';

interface CustomMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<FoodItem, 'id' | 'createdAt'>) => void;
  editItem?: FoodItem;
}

interface IngredientDraft {
  id: string;
  name: string;
  amountG: string;
  proteinG: string;
  carbsG: string;
  fatG: string;
}

function emptyIngredient(): IngredientDraft {
  return { id: generateId(), name: '', amountG: '', proteinG: '', carbsG: '', fatG: '' };
}

function sumIngredients(ingredients: IngredientDraft[]): MacroNutrients {
  return ingredients.reduce(
    (acc, ing) => ({
      proteinG: acc.proteinG + (parseFloat(ing.proteinG) || 0),
      carbsG: acc.carbsG + (parseFloat(ing.carbsG) || 0),
      fatG: acc.fatG + (parseFloat(ing.fatG) || 0),
      calories:
        acc.calories +
        macroCalories({
          proteinG: parseFloat(ing.proteinG) || 0,
          carbsG: parseFloat(ing.carbsG) || 0,
          fatG: parseFloat(ing.fatG) || 0,
        }),
    }),
    { proteinG: 0, carbsG: 0, fatG: 0, calories: 0 },
  );
}

export function CustomMealModal({ isOpen, onClose, onSave, editItem }: CustomMealModalProps) {
  const [name, setName] = useState(editItem?.name ?? '');
  const [notes, setNotes] = useState(editItem?.formulaNotes ?? '');
  const [ingredients, setIngredients] = useState<IngredientDraft[]>([emptyIngredient()]);

  const totals = sumIngredients(ingredients);
  const totalGrams = ingredients.reduce((s, i) => s + (parseFloat(i.amountG) || 0), 0);

  function updateIngredient(id: string, partial: Partial<IngredientDraft>) {
    setIngredients((prev) => prev.map((ing) => (ing.id === id ? { ...ing, ...partial } : ing)));
  }

  function handleSave() {
    if (!name.trim()) return;

    const builtIngredients: CustomFormulaIngredient[] = ingredients.map((ing) => ({
      name: ing.name,
      amountG: parseFloat(ing.amountG) || 0,
      macros: {
        proteinG: parseFloat(ing.proteinG) || 0,
        carbsG: parseFloat(ing.carbsG) || 0,
        fatG: parseFloat(ing.fatG) || 0,
        calories: macroCalories({
          proteinG: parseFloat(ing.proteinG) || 0,
          carbsG: parseFloat(ing.carbsG) || 0,
          fatG: parseFloat(ing.fatG) || 0,
        }),
      },
    }));

    onSave({
      name: name.trim(),
      servingSizeG: totalGrams,
      macrosPerServing: totals,
      isCustomFormula: true,
      formulaNotes: notes,
      ingredients: builtIngredients,
    });
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Custom Formula Builder"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!name.trim()}
            id="save-custom-formula"
          >
            Save Formula
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Formula Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Morning Powder Mix"
            id="formula-name"
          />
          <Input
            label="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. 2 scoops whey + 50g oats"
            id="formula-notes"
          />
        </div>

        {/* Live totals preview */}
        <div className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 flex items-center gap-4 flex-wrap">
          <span className="text-xs text-muted uppercase tracking-wider mr-auto">Formula totals (1 serving)</span>
          <span className="text-sm font-mono text-accent">{Math.round(totals.proteinG)}g P</span>
          <span className="text-sm font-mono text-violet-400">{Math.round(totals.carbsG)}g C</span>
          <span className="text-sm font-mono text-emerald-400">{Math.round(totals.fatG)}g F</span>
          <span className="text-sm font-mono text-muted">{Math.round(totals.calories)} kcal</span>
          <span className="text-sm font-mono text-muted">{Math.round(totalGrams)}g total</span>
        </div>

        {/* Ingredients */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted uppercase tracking-widest">Ingredients</p>

          {/* Column headers */}
          <div className="grid grid-cols-[1fr_60px_52px_52px_52px_32px] gap-2 px-1">
            {['Ingredient', 'Amount', 'P(g)', 'C(g)', 'F(g)', ''].map((h) => (
              <span key={h} className="text-[10px] text-muted uppercase tracking-wider text-center">{h}</span>
            ))}
          </div>

          {ingredients.map((ing) => (
            <div
              key={ing.id}
              className="grid grid-cols-[1fr_60px_52px_52px_52px_32px] gap-2 items-center"
            >
              <input
                value={ing.name}
                onChange={(e) => updateIngredient(ing.id, { name: e.target.value })}
                placeholder="e.g. Whey Protein"
                className="bg-surface border border-border rounded px-2 py-1.5 text-sm text-primary placeholder-muted outline-none focus:border-accent transition-colors"
                aria-label="Ingredient name"
              />
              {(['amountG', 'proteinG', 'carbsG', 'fatG'] as const).map((field) => (
                <input
                  key={field}
                  type="number"
                  value={ing[field]}
                  onChange={(e) => updateIngredient(ing.id, { [field]: e.target.value })}
                  min={0}
                  step={0.1}
                  placeholder="0"
                  className="bg-surface border border-border rounded px-2 py-1.5 text-sm text-center text-primary placeholder-muted outline-none focus:border-accent transition-colors w-full"
                  aria-label={`${field} for ${ing.name || 'ingredient'}`}
                />
              ))}
              <button
                onClick={() => setIngredients((prev) => prev.filter((i) => i.id !== ing.id))}
                className="text-muted hover:text-red-400 transition-colors flex items-center justify-center"
                aria-label="Remove ingredient"
                disabled={ingredients.length === 1}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Plus size={13} />}
            onClick={() => setIngredients((p) => [...p, emptyIngredient()])}
            className="self-start mt-1"
            id="add-ingredient"
          >
            Add Ingredient
          </Button>
        </div>
      </div>
    </Modal>
  );
}
