import { MacroBar } from './MacroBar';
import type { MacroNutrients, MacroProfile } from '../../types';

interface MacroDashboardProps {
  totals: MacroNutrients;
  targets: MacroProfile;
}

export function MacroDashboard({ totals, targets }: MacroDashboardProps) {
  const calPct = Math.min(
    100,
    Math.round((totals.calories / targets.dailyCalorieTarget) * 100),
  );

  return (
    <div className="rounded-xl border border-border bg-bg-secondary/60 p-5 flex flex-col gap-5">
      {/* Calorie ring summary */}
      <div className="flex items-center gap-5">
        {/* SVG ring */}
        <div className="relative shrink-0 w-20 h-20">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="15.9155" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15.9155"
              fill="none"
              stroke={totals.calories > targets.dailyCalorieTarget ? '#f59e0b' : '#00D4FF'}
              strokeWidth="3"
              strokeDasharray={`${calPct} ${100 - calPct}`}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold font-mono text-primary leading-none">{calPct}%</span>
            <span className="text-[9px] text-muted uppercase tracking-wider">kcal</span>
          </div>
        </div>

        {/* Calorie numbers */}
        <div>
          <p className="text-2xl font-bold font-mono text-primary">
            {Math.round(totals.calories).toLocaleString()}
          </p>
          <p className="text-xs text-muted">
            of {targets.dailyCalorieTarget.toLocaleString()} kcal target
          </p>
          <p className="text-xs text-muted mt-1">
            {targets.dailyCalorieTarget - Math.round(totals.calories) > 0
              ? `${(targets.dailyCalorieTarget - Math.round(totals.calories)).toLocaleString()} kcal remaining`
              : `${(Math.round(totals.calories) - targets.dailyCalorieTarget).toLocaleString()} kcal over`}
          </p>
        </div>
      </div>

      {/* Macro bars */}
      <div className="flex flex-col gap-4">
        <MacroBar
          label="Protein"
          consumed={totals.proteinG}
          target={targets.proteinGrams}
          color="bg-accent"
          glowColor="shadow-accent"
        />
        <MacroBar
          label="Carbs"
          consumed={totals.carbsG}
          target={targets.carbsGrams}
          color="bg-violet-500"
          glowColor="shadow-violet"
        />
        <MacroBar
          label="Fats"
          consumed={totals.fatG}
          target={targets.fatGrams}
          color="bg-emerald-500"
          glowColor="shadow-emerald"
        />
      </div>
    </div>
  );
}
