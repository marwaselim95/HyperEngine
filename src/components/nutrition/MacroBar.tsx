import { calcMacroPercent } from '../../utils/macroCalculators';

interface MacroBarProps {
  label: string;
  consumed: number;
  target: number;
  unit?: string;
  color: string;
  glowColor?: string;
}

export function MacroBar({ label, consumed, target, unit = 'g', color }: MacroBarProps) {
  const pct = calcMacroPercent(consumed, target);
  const isOver = consumed > target;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted uppercase tracking-widest">{label}</span>
        <span className="text-xs font-mono">
          <span className={isOver ? 'text-amber-400' : 'text-primary'}>
            {Math.round(consumed)}{unit}
          </span>
          <span className="text-muted"> / {Math.round(target)}{unit}</span>
        </span>
      </div>

      {/* Track */}
      <div className="h-1.5 rounded-full bg-surface overflow-hidden">
        <div
          className={[
            'h-full rounded-full transition-all duration-500 ease-out',
            isOver ? 'bg-amber-400' : color,
          ].join(' ')}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={consumed}
          aria-valuemin={0}
          aria-valuemax={target}
          aria-label={`${label} progress`}
        />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-[10px] text-muted">{pct}%</span>
        {isOver && (
          <span className="text-[10px] text-amber-400">
            +{Math.round(consumed - target)}{unit} over
          </span>
        )}
        {!isOver && target - consumed > 0 && (
          <span className="text-[10px] text-muted">
            {Math.round(target - consumed)}{unit} left
          </span>
        )}
      </div>
    </div>
  );
}
