import { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { MacroSlider } from '../components/nutrition/MacroSlider';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useUser } from '../hooks/useUser';
import type { MacroProfile, ActivityLevel, TrainingGoal } from '../types';
import { macroCalories } from '../utils/macroCalculators';
import { capitalize } from '../utils/formatters';

const ACTIVITY_LEVELS: { value: ActivityLevel; label: string }[] = [
  { value: 'sedentary', label: 'Sedentary (desk job, no exercise)' },
  { value: 'lightly_active', label: 'Lightly Active (1–3 days/week)' },
  { value: 'moderately_active', label: 'Moderate (3–5 days/week)' },
  { value: 'very_active', label: 'Very Active (6–7 days/week)' },
  { value: 'extra_active', label: 'Extra Active (2x/day, physical job)' },
];

const GOALS: { value: TrainingGoal; label: string }[][] = [
  [
    { value: 'hypertrophy', label: 'Hypertrophy' },
    { value: 'strength', label: 'Strength' },
  ],
  [
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'cut', label: 'Cut' },
  ],
];

export function Settings() {
  const { profile, updateProfile, updateMacroProfile, recalculateMacros, isImperial } = useUser();
  const [macros, setMacros] = useState<MacroProfile>({ ...profile.macroProfile });
  const [saved, setSaved] = useState(false);

  const derivedCals = macroCalories({
    proteinG: macros.proteinGrams,
    carbsG: macros.carbsGrams,
    fatG: macros.fatGrams,
  });

  function handleSaveMacros() {
    updateMacroProfile({ ...macros, dailyCalorieTarget: Math.round(derivedCals) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <PageWrapper>
      {/* Profile */}
      <section className="rounded-xl border border-border bg-bg-secondary/60 p-5 mb-5">
        <h2 className="text-sm font-semibold text-primary mb-4">Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Name"
            value={profile.name}
            onChange={(e) => updateProfile({ name: e.target.value })}
            id="settings-name"
          />
          <Input
            label={isImperial ? 'Bodyweight (lbs)' : 'Bodyweight (kg)'}
            type="number"
            value={isImperial ? Math.round(profile.bodyweightKg * 2.20462) : profile.bodyweightKg}
            onChange={(e) => {
              const v = parseFloat(e.target.value) || 0;
              updateProfile({ bodyweightKg: isImperial ? v / 2.20462 : v });
            }}
            id="settings-bodyweight"
          />
          <Input
            label="Height (cm)"
            type="number"
            value={profile.heightCm}
            onChange={(e) => updateProfile({ heightCm: parseFloat(e.target.value) || 0 })}
            id="settings-height"
          />
          <Input
            label="Age"
            type="number"
            value={profile.age}
            onChange={(e) => updateProfile({ age: parseInt(e.target.value) || 0 })}
            id="settings-age"
          />

          {/* Sex */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted uppercase tracking-widest">Sex</label>
            <div className="flex gap-2">
              {(['male', 'female'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => updateProfile({ sex: s })}
                  className={[
                    'flex-1 py-2 rounded-lg border text-sm font-medium transition-all',
                    profile.sex === s
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border bg-surface text-muted hover:border-border-hover hover:text-primary',
                  ].join(' ')}
                  id={`settings-sex-${s}`}
                >
                  {capitalize(s)}
                </button>
              ))}
            </div>
          </div>

          {/* Unit system */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted uppercase tracking-widest">Unit System</label>
            <div className="flex gap-2">
              {(['metric', 'imperial'] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => updateProfile({ unitSystem: u })}
                  className={[
                    'flex-1 py-2 rounded-lg border text-sm font-medium transition-all',
                    profile.unitSystem === u
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border bg-surface text-muted hover:border-border-hover hover:text-primary',
                  ].join(' ')}
                  id={`settings-unit-${u}`}
                >
                  {capitalize(u)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Activity level */}
        <div className="mt-4">
          <label className="text-xs font-medium text-muted uppercase tracking-widest">Activity Level</label>
          <div className="flex flex-col gap-2 mt-2">
            {ACTIVITY_LEVELS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => updateProfile({ activityLevel: value })}
                className={[
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm text-left transition-all',
                  profile.activityLevel === value
                    ? 'border-accent bg-accent/10 text-primary'
                    : 'border-border bg-surface text-muted hover:border-border-hover hover:text-primary',
                ].join(' ')}
                id={`settings-activity-${value}`}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${profile.activityLevel === value ? 'bg-accent' : 'bg-border'}`}
                />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Training goal */}
        <div className="mt-4">
          <label className="text-xs font-medium text-muted uppercase tracking-widest">Training Goal</label>
          <div className="flex flex-col gap-2 mt-2">
            {GOALS.map((row, ri) => (
              <div key={ri} className="flex gap-2">
                {row.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => updateProfile({ goal: value })}
                    className={[
                      'flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all',
                      profile.goal === value
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border bg-surface text-muted hover:border-border-hover hover:text-primary',
                    ].join(' ')}
                    id={`settings-goal-${value}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Macro targets */}
      <section className="rounded-xl border border-border bg-bg-secondary/60 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-primary">Macro Targets</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={recalculateMacros}
            id="settings-recalculate-macros"
          >
            Auto-Calculate from TDEE
          </Button>
        </div>

        {/* Live calorie preview */}
        <div className="rounded-lg bg-surface border border-border px-4 py-3 mb-5 flex items-center justify-between">
          <span className="text-xs text-muted">Derived daily calories</span>
          <span className="text-lg font-bold font-mono text-primary">
            {Math.round(derivedCals).toLocaleString()}
            <span className="text-xs text-muted ml-1 font-normal">kcal</span>
          </span>
        </div>

        <div className="flex flex-col gap-6">
          <MacroSlider
            id="settings-protein-slider"
            label="Protein"
            value={macros.proteinGrams}
            min={50}
            max={400}
            step={5}
            color="bg-accent"
            onChange={(v) => setMacros((m) => ({ ...m, proteinGrams: v }))}
          />
          <MacroSlider
            id="settings-carbs-slider"
            label="Carbohydrates"
            value={macros.carbsGrams}
            min={50}
            max={700}
            step={5}
            color="bg-violet-500"
            onChange={(v) => setMacros((m) => ({ ...m, carbsGrams: v }))}
          />
          <MacroSlider
            id="settings-fats-slider"
            label="Fats"
            value={macros.fatGrams}
            min={20}
            max={200}
            step={5}
            color="bg-emerald-500"
            onChange={(v) => setMacros((m) => ({ ...m, fatGrams: v }))}
          />
        </div>

        <div className="flex justify-end mt-5">
          <Button
            variant="primary"
            onClick={handleSaveMacros}
            id="settings-save-macros"
          >
            {saved ? '✓ Saved' : 'Save Macro Targets'}
          </Button>
        </div>
      </section>
    </PageWrapper>
  );
}
