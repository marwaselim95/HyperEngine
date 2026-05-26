import { last30Days, formatDateDisplay } from '../../utils/dateUtils';
import type { WorkoutSession, DailyNutritionLog } from '../../types';

interface ConsistencyHeatmapProps {
  sessions: WorkoutSession[];
  logs: DailyNutritionLog[];
}

function getColor(hasWorkout: boolean, hasNutrition: boolean): string {
  if (hasWorkout && hasNutrition) return 'bg-accent opacity-90';
  if (hasWorkout) return 'bg-accent opacity-50';
  if (hasNutrition) return 'bg-violet-500 opacity-50';
  return 'bg-surface';
}

export function ConsistencyHeatmap({ sessions, logs }: ConsistencyHeatmapProps) {
  const days = last30Days();
  const sessionDates = new Set(sessions.map((s) => s.date));
  const logDates = new Set(logs.filter((l) => l.entries.length > 0).map((l) => l.date));

  const streak = (() => {
    let count = 0;
    const sorted = [...days].reverse();
    for (const d of sorted) {
      if (sessionDates.has(d) || logDates.has(d)) count++;
      else break;
    }
    return count;
  })();

  return (
    <div className="rounded-xl border border-border bg-bg-secondary/60 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-primary">30-Day Consistency</h3>
        <span className="text-xs font-mono text-accent">{streak} day streak 🔥</span>
      </div>

      {/* Grid */}
      <div className="flex flex-wrap gap-1.5">
        {days.map((date) => {
          const hw = sessionDates.has(date);
          const hn = logDates.has(date);
          const dayNum = new Date(date + 'T00:00:00').getDate();
          return (
            <div
              key={date}
              title={`${formatDateDisplay(date)}${hw ? ' · Trained' : ''}${hn ? ' · Nutrition logged' : ''}`}
              className={[
                'w-7 h-7 rounded-md flex items-center justify-center text-[9px] font-mono',
                'border border-border/50 transition-all duration-150 cursor-default',
                getColor(hw, hn),
                hw || hn ? 'text-white border-transparent' : 'text-muted',
              ].join(' ')}
            >
              {dayNum}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3">
        {[
          { color: 'bg-accent opacity-90', label: 'Both' },
          { color: 'bg-accent opacity-50', label: 'Workout' },
          { color: 'bg-violet-500 opacity-50', label: 'Nutrition' },
          { color: 'bg-surface border border-border', label: 'Rest' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${color}`} />
            <span className="text-[10px] text-muted">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
