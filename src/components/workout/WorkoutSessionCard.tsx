import { Copy, Trash2, ChevronRight } from 'lucide-react';
import type { WorkoutSession } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { daysAgo, isToday } from '../../utils/dateUtils';
import { sessionVolume } from '../../utils/volumeCalculators';

interface WorkoutSessionCardProps {
  session: WorkoutSession;
  onDuplicate: () => void;
  onDelete: () => void;
  onClick: () => void;
  isImperial: boolean;
}

export function WorkoutSessionCard({
  session,
  onDuplicate,
  onDelete,
  onClick,
  isImperial,
}: WorkoutSessionCardProps) {
  const vol = sessionVolume(session);
  const displayVol = isImperial
    ? `${Math.round(vol * 2.20462).toLocaleString()} lbs`
    : `${Math.round(vol).toLocaleString()} kg`;

  const totalSets = session.exercises.reduce(
    (sum, b) => sum + b.sets.filter((s) => !s.isWarmup).length,
    0,
  );
  const ago = daysAgo(session.date);

  return (
    <div className="group rounded-xl border border-border bg-bg-secondary/60 hover:border-border-hover transition-all duration-150 overflow-hidden">
      {/* Clickable body */}
      <button
        onClick={onClick}
        className="w-full text-left px-4 py-4 flex items-start gap-3"
        id={`session-${session.id}`}
        aria-label={`Open session ${session.name}`}
      >
        {/* Date indicator */}
        <div className="flex flex-col items-center gap-0.5 pt-0.5 shrink-0 w-10">
          <span className={`text-lg font-bold font-mono ${isToday(session.date) ? 'text-accent' : 'text-primary'}`}>
            {new Date(session.date + 'T00:00:00').getDate()}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-muted">
            {new Date(session.date + 'T00:00:00').toLocaleString('en-US', { month: 'short' })}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-primary truncate">{session.name}</span>
            {isToday(session.date) && <Badge variant="accent">Today</Badge>}
          </div>
          <p className="text-xs text-muted mt-0.5">
            {session.exercises.length} exercises · {totalSets} sets
            {vol > 0 && ` · ${displayVol} vol`}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {session.exercises.slice(0, 4).map((b) => (
              <Badge key={b.id} variant="muted">
                {b.exerciseName}
              </Badge>
            ))}
            {session.exercises.length > 4 && (
              <Badge variant="muted">+{session.exercises.length - 4} more</Badge>
            )}
          </div>
        </div>

        <ChevronRight size={16} className="text-muted shrink-0 mt-1 group-hover:text-primary transition-colors" />
      </button>

      {/* Actions */}
      <div className="flex items-center gap-2 px-4 py-2 border-t border-border bg-surface/30">
        <span className="text-xs text-muted flex-1">
          {ago === 0 ? 'Today' : ago === 1 ? 'Yesterday' : `${ago} days ago`}
          {session.durationMinutes && ` · ${session.durationMinutes}m`}
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
          leftIcon={<Copy size={13} />}
          id={`duplicate-session-${session.id}`}
        >
          Repeat
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          aria-label="Delete session"
        >
          <Trash2 size={13} />
        </Button>
      </div>
    </div>
  );
}
