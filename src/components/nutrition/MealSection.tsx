import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import type { FoodEntry, FoodItem, MealType } from '../../types';
import { FoodEntryRow } from './FoodEntryRow';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { capitalize } from '../../utils/formatters';

interface MealSectionProps {
  mealType: MealType;
  entries: FoodEntry[];
  foodDatabase: FoodItem[];
  onAddEntry: (item: FoodItem, servings: number) => void;
  onDeleteEntry: (id: string) => void;
  onOpenCustomModal: () => void;
}

export function MealSection({
  mealType,
  entries,
  foodDatabase,
  onAddEntry,
  onDeleteEntry,
  onOpenCustomModal,
}: MealSectionProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [servings, setServings] = useState<Record<string, number>>({});

  const mealCalories = entries.reduce((s, e) => s + e.macros.calories, 0);
  const mealProtein = entries.reduce((s, e) => s + e.macros.proteinG, 0);

  const filtered = foodDatabase.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );
  const customs = filtered.filter((f) => f.isCustomFormula);
  const regulars = filtered.filter((f) => !f.isCustomFormula);

  function handleAdd(item: FoodItem) {
    const qty = servings[item.id] ?? 1;
    onAddEntry(item, qty);
    setSearch('');
    setShowSearch(false);
    setServings({});
  }

  return (
    <div className="rounded-xl border border-border bg-bg-secondary/40 overflow-hidden">
      {/* Header */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3 bg-surface/30 hover:bg-surface/50 transition-colors"
        onClick={() => setCollapsed((c) => !c)}
        aria-expanded={!collapsed}
        id={`meal-section-${mealType}`}
      >
        <span className="text-sm font-semibold text-primary capitalize flex-1 text-left">
          {capitalize(mealType)}
        </span>
        {entries.length > 0 && (
          <span className="text-xs font-mono text-muted">
            {Math.round(mealProtein)}P · {Math.round(mealCalories)} kcal
          </span>
        )}
        {collapsed ? <ChevronDown size={15} className="text-muted" /> : <ChevronUp size={15} className="text-muted" />}
      </button>

      {!collapsed && (
        <div className="px-4 py-3 flex flex-col gap-2">
          {entries.length === 0 && (
            <p className="text-xs text-muted py-1">No entries yet.</p>
          )}
          {entries.map((entry) => (
            <FoodEntryRow
              key={entry.id}
              entry={entry}
              onDelete={() => onDeleteEntry(entry.id)}
            />
          ))}

          {/* Add food */}
          {showSearch ? (
            <div className="flex flex-col gap-2 pt-1 border-t border-border mt-1">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search foods..."
                autoFocus
                id={`search-food-${mealType}`}
              />

              {/* Results */}
              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                {/* Pinned customs */}
                {customs.length > 0 && (
                  <>
                    <p className="text-[10px] uppercase tracking-wider text-muted px-1 pt-1">
                      Custom Formulas
                    </p>
                    {customs.map((item) => (
                      <FoodSearchResult
                        key={item.id}
                        item={item}
                        servings={servings[item.id] ?? 1}
                        onServingsChange={(v) => setServings((s) => ({ ...s, [item.id]: v }))}
                        onAdd={() => handleAdd(item)}
                      />
                    ))}
                  </>
                )}

                {/* Regular foods */}
                {regulars.map((item) => (
                  <FoodSearchResult
                    key={item.id}
                    item={item}
                    servings={servings[item.id] ?? 1}
                    onServingsChange={(v) => setServings((s) => ({ ...s, [item.id]: v }))}
                    onAdd={() => handleAdd(item)}
                  />
                ))}

                {filtered.length === 0 && (
                  <p className="text-xs text-muted px-2 py-2">No foods found.</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowSearch(false)}>
                  Cancel
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onOpenCustomModal}
                  id={`create-custom-formula-${mealType}`}
                >
                  + New Custom Formula
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Plus size={13} />}
              onClick={() => setShowSearch(true)}
              className="self-start mt-1"
              id={`add-food-${mealType}`}
            >
              Add Food
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

interface FoodSearchResultProps {
  item: FoodItem;
  servings: number;
  onServingsChange: (v: number) => void;
  onAdd: () => void;
}

function FoodSearchResult({ item, servings, onServingsChange, onAdd }: FoodSearchResultProps) {
  const macros = item.macrosPerServing;
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-primary truncate">
          {item.isCustomFormula && <span className="text-accent mr-1">★</span>}
          {item.name}
        </p>
        <p className="text-[10px] text-muted font-mono">
          {Math.round(macros.proteinG * servings)}P ·{' '}
          {Math.round(macros.carbsG * servings)}C ·{' '}
          {Math.round(macros.fatG * servings)}F ·{' '}
          {Math.round(macros.calories * servings)} kcal
        </p>
      </div>
      <input
        type="number"
        value={servings}
        onChange={(e) => onServingsChange(parseFloat(e.target.value) || 1)}
        min={0.25}
        step={0.25}
        className="w-14 text-xs bg-surface border border-border rounded px-2 py-1 text-center text-primary outline-none focus:border-accent"
        aria-label={`Servings of ${item.name}`}
      />
      <Button size="sm" variant="secondary" onClick={onAdd} id={`add-${item.id}`}>
        Add
      </Button>
    </div>
  );
}
