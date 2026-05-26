import { Trash2 } from 'lucide-react';
import type { FoodEntry } from '../../types';
import { Button } from '../ui/Button';
import { formatTime } from '../../utils/dateUtils';

interface FoodEntryRowProps {
  entry: FoodEntry;
  onDelete: () => void;
}

export function FoodEntryRow({ entry, onDelete }: FoodEntryRowProps) {
  return (
    <div className="group flex items-center gap-3 py-2.5 px-3 rounded-lg border border-transparent hover:border-border hover:bg-surface/40 transition-all duration-150">
      {/* Name & brand */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-primary font-medium truncate">{entry.foodItemName}</p>
        <p className="text-xs text-muted">
          {entry.servingsConsumed} serving{entry.servingsConsumed !== 1 ? 's' : ''} ·{' '}
          {formatTime(entry.loggedAt)}
        </p>
      </div>

      {/* Macros */}
      <div className="hidden sm:flex items-center gap-3 text-xs font-mono">
        <span className="text-accent">{Math.round(entry.macros.proteinG)}P</span>
        <span className="text-violet-400">{Math.round(entry.macros.carbsG)}C</span>
        <span className="text-emerald-400">{Math.round(entry.macros.fatG)}F</span>
        <span className="text-muted">{Math.round(entry.macros.calories)} kcal</span>
      </div>

      {/* Delete */}
      <Button
        variant="danger"
        size="sm"
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        aria-label={`Remove ${entry.foodItemName}`}
      >
        <Trash2 size={13} />
      </Button>
    </div>
  );
}
