import { Trash2 } from 'lucide-react';
import type { ExerciseSet } from '../../types';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface WorkoutRowProps {
  set: ExerciseSet;
  onChange: (updated: ExerciseSet) => void;
  onDelete: () => void;
  isImperial: boolean;
}

export function WorkoutRow({ set, onChange, onDelete, isImperial }: WorkoutRowProps) {
  const weightLabel = isImperial ? 'lbs' : 'kg';
  const displayWeight = isImperial
    ? Math.round(set.weightKg * 2.20462 * 10) / 10
    : set.weightKg;

  function handleWeightChange(raw: string) {
    const num = parseFloat(raw) || 0;
    onChange({ ...set, weightKg: isImperial ? Math.round((num / 2.20462) * 10) / 10 : num });
  }

  return (
    <div
      className={[
        'group flex items-center gap-2 py-2 px-3 rounded-lg border transition-all duration-150',
        set.isWarmup
          ? 'border-border/50 bg-surface/30 opacity-70'
          : 'border-border bg-surface/60 hover:border-border-hover',
      ].join(' ')}
    >
      {/* Set number */}
      <span className="w-7 text-center text-xs font-mono text-muted shrink-0">
        {set.isWarmup ? 'W' : set.setNumber}
      </span>

      {/* Weight */}
      <Input
        type="number"
        value={displayWeight || ''}
        onChange={(e) => handleWeightChange(e.target.value)}
        suffix={weightLabel}
        className="w-20 text-center"
        min={0}
        step={isImperial ? 2.5 : 1.25}
        placeholder="0"
        aria-label={`Set ${set.setNumber} weight`}
      />

      {/* Reps */}
      <Input
        type="number"
        value={set.reps || ''}
        onChange={(e) => onChange({ ...set, reps: parseInt(e.target.value) || 0 })}
        suffix="reps"
        className="w-20 text-center"
        min={0}
        step={1}
        placeholder="0"
        aria-label={`Set ${set.setNumber} reps`}
      />

      {/* RPE */}
      <Input
        type="number"
        value={set.rpe ?? ''}
        onChange={(e) => onChange({ ...set, rpe: parseFloat(e.target.value) || undefined })}
        prefix="@"
        className="w-14 text-center"
        min={5}
        max={10}
        step={0.5}
        placeholder="RPE"
        aria-label={`Set ${set.setNumber} RPE`}
      />

      {/* Flags */}
      <div className="flex gap-1 ml-auto">
        {set.isDropSet && <Badge variant="warning">DS</Badge>}
        {set.isWarmup && <Badge variant="muted">W</Badge>}
      </div>

      {/* Delete (visible on hover) */}
      <Button
        variant="danger"
        size="sm"
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        aria-label="Delete set"
      >
        <Trash2 size={13} />
      </Button>
    </div>
  );
}
