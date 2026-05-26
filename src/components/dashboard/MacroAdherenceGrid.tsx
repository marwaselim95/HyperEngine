import type { DailyNutritionLog, MacroProfile } from '../../types';
import { last7Days } from '../../utils/dateUtils';
import { calcMacroPercent } from '../../utils/macroCalculators';


interface MacroAdherenceGridProps {
  logs: DailyNutritionLog[];
  targets: MacroProfile;
}

export function MacroAdherenceGrid({ logs, targets }: MacroAdherenceGridProps) {
  const days = last7Days();

  return (
    <div className="rounded-xl border border-border bg-bg-secondary/60 p-5">
      <h3 className="text-sm font-semibold text-primary mb-4">Macro Adherence · 7 Days</h3>

      <div className="flex flex-col gap-2">
        {/* Header row */}
        <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr] gap-2 px-1">
          {['', 'kcal', 'Protein', 'Carbs', 'Fats'].map((h) => (
            <span key={h} className="text-[10px] text-muted uppercase tracking-wider text-center">
              {h}
            </span>
          ))}
        </div>

        {days.map((date) => {
          const log = logs.find((l) => l.date === date);
          const totals = log?.totals ?? { proteinG: 0, carbsG: 0, fatG: 0, calories: 0 };
          const hasData = (log?.entries.length ?? 0) > 0;
          const calPct = calcMacroPercent(totals.calories, targets.dailyCalorieTarget);
          const pPct = calcMacroPercent(totals.proteinG, targets.proteinGrams);
          const cPct = calcMacroPercent(totals.carbsG, targets.carbsGrams);
          const fPct = calcMacroPercent(totals.fatG, targets.fatGrams);

          return (
            <div
              key={date}
              className="grid grid-cols-[80px_1fr_1fr_1fr_1fr] gap-2 items-center"
            >
              <span className="text-[11px] text-muted text-right pr-2">
                {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'numeric',
                  day: 'numeric',
                })}
              </span>
              {[
                { pct: calPct, color: 'bg-accent' },
                { pct: pPct, color: 'bg-accent' },
                { pct: cPct, color: 'bg-violet-500' },
                { pct: fPct, color: 'bg-emerald-500' },
              ].map((bar, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="flex-1 h-1.5 rounded-full bg-surface overflow-hidden">
                    {hasData && (
                      <div
                        className={`h-full rounded-full ${bar.pct > 100 ? 'bg-amber-400' : bar.color}`}
                        style={{ width: `${bar.pct}%`, transition: 'width 0.4s ease-out' }}
                      />
                    )}
                  </div>
                  {hasData && (
                    <span className="text-[10px] font-mono text-muted w-7 text-right shrink-0">
                      {bar.pct}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
