import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { ExerciseBlock, ExerciseSet } from '../../types';
import { WorkoutRow } from './WorkoutRow';
import { PRBadge } from './PRBadge';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { generateId } from '../../utils/formatters';
import { capitalize } from '../../utils/formatters';

interface ExerciseBlockProps {
  block: ExerciseBlock;
  personalRecord?: number;
  onChange: (updated: ExerciseBlock) => void;
  onDelete: () => void;
  isImperial: boolean;
}

function newSet(setNumber: number): ExerciseSet {
  return {
    id: generateId(),
    setNumber,
    weightKg: 0,
    reps: 0,
    isDropSet: false,
    isWarmup: false,
    completedAt: new Date().toISOString(),
  };
}

export function ExerciseBlock({
  block,
  personalRecord,
  onChange,
  onDelete,
  isImperial,
}: ExerciseBlockProps) {
  const [collapsed, setCollapsed] = useState(false);

  function addSet(isWarmup = false) {
    const workingSets = block.sets.filter((s) => !s.isWarmup);
    const warmupSets = block.sets.filter((s) => s.isWarmup);
    const nextNum = isWarmup ? warmupSets.length + 1 : workingSets.length + 1;
    const s = { ...newSet(nextNum), isWarmup };
    onChange({ ...block, sets: [...block.sets, s] });
  }

  function updateSet(index: number, updated: ExerciseSet) {
    const sets = block.sets.map((s, i) => (i === index ? updated : s));
    onChange({ ...block, sets });
  }

  function deleteSet(index: number) {
    const sets = block.sets.filter((_, i) => i !== index).map((s, i) => ({
      ...s,
      setNumber: s.isWarmup ? i + 1 : i + 1,
    }));
    onChange({ ...block, sets });
  }

  const workingSets = block.sets.filter((s) => !s.isWarmup);
  const totalVolume = workingSets.reduce((sum, s) => sum + s.weightKg * s.reps, 0);

  return (
    <div className="rounded-xl border border-border bg-bg-secondary/60 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-surface/40 border-b border-border">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-primary">{block.exerciseName}</span>
            {personalRecord && <PRBadge e1RM={personalRecord} isImperial={isImperial} />}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant="muted">{capitalize(block.muscleGroup)}</Badge>
            <Badge variant="muted">{capitalize(block.equipment)}</Badge>
            {totalVolume > 0 && (
              <span className="text-xs text-muted">
                {isImperial
                  ? `${Math.round(totalVolume * 2.20462).toLocaleString()} lbs vol`
                  : `${Math.round(totalVolume).toLocaleString()} kg vol`}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => setCollapsed((c) => !c)}
          className="text-muted hover:text-primary transition-colors"
          aria-label={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>

        <Button variant="danger" size="sm" onClick={onDelete} aria-label="Delete exercise">
          <Trash2 size={14} />
        </Button>
      </div>

      {/* Sets */}
      {!collapsed && (
        <div className="px-4 py-3 flex flex-col gap-2">
          {/* Column headers */}
          <div className="flex gap-2 px-3">
            <span className="w-7 text-[10px] text-muted uppercase tracking-wider text-center">#</span>
            <span className="w-20 text-[10px] text-muted uppercase tracking-wider text-center">Weight</span>
            <span className="w-20 text-[10px] text-muted uppercase tracking-wider text-center">Reps</span>
            <span className="w-14 text-[10px] text-muted uppercase tracking-wider text-center">RPE</span>
          </div>

          {block.sets.map((set, i) => (
            <WorkoutRow
              key={set.id}
              set={set}
              onChange={(updated) => updateSet(i, updated)}
              onDelete={() => deleteSet(i)}
              isImperial={isImperial}
            />
          ))}

          <div className="flex gap-2 pt-1">
            <Button variant="ghost" size="sm" onClick={() => addSet(false)} leftIcon={<Plus size={13} />}>
              Add Set
            </Button>
            <Button variant="ghost" size="sm" onClick={() => addSet(true)} leftIcon={<Plus size={13} />}>
              + Warmup
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
