import { useRef, useState, useCallback } from 'react';
import { clamp } from '../../utils/formatters';

interface MacroSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  color: string;       // accent color class for the fill
  onChange: (value: number) => void;
  id: string;
}

export function MacroSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = 'g',
  color,
  onChange,
  id,
}: MacroSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const pct = ((value - min) / (max - min)) * 100;

  const getValueFromEvent = useCallback(
    (clientX: number): number => {
      if (!trackRef.current) return value;
      const rect = trackRef.current.getBoundingClientRect();
      const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
      const raw = min + ratio * (max - min);
      return Math.round(raw / step) * step;
    },
    [min, max, step, value],
  );

  function onMouseDown(e: React.MouseEvent) {
    setDragging(true);
    onChange(getValueFromEvent(e.clientX));

    const onMove = (ev: MouseEvent) => onChange(getValueFromEvent(ev.clientX));
    const onUp = () => {
      setDragging(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  function onTouchStart(e: React.TouchEvent) {
    setDragging(true);
    onChange(getValueFromEvent(e.touches[0].clientX));

    const onMove = (ev: TouchEvent) => onChange(getValueFromEvent(ev.touches[0].clientX));
    const onEnd = () => {
      setDragging(false);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-medium text-muted uppercase tracking-widest">
          {label}
        </label>
        <span className="text-sm font-mono font-semibold text-primary">
          {value}
          <span className="text-muted text-xs ml-0.5">{unit}</span>
        </span>
      </div>

      {/* Custom track */}
      <div
        ref={trackRef}
        id={id}
        className="relative h-3 rounded-full bg-surface border border-border cursor-pointer select-none"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        role="slider"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') onChange(clamp(value + step, min, max));
          if (e.key === 'ArrowLeft') onChange(clamp(value - step, min, max));
        }}
      >
        {/* Fill */}
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-none ${color}`}
          style={{ width: `${pct}%` }}
        />
        {/* Thumb */}
        <div
          className={[
            'absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white/80 bg-white shadow-md',
            'transition-transform duration-75',
            dragging ? 'scale-125' : 'scale-100 hover:scale-110',
          ].join(' ')}
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-muted">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}
