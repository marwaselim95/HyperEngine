import { Trophy } from 'lucide-react';

interface PRBadgeProps {
  e1RM: number;
  isImperial: boolean;
}

export function PRBadge({ e1RM, isImperial }: PRBadgeProps) {
  const display = isImperial
    ? `${Math.round(e1RM * 2.20462)} lbs`
    : `${e1RM} kg`;

  return (
    <span
      title={`Personal Record — Est. 1RM: ${display}`}
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold
        bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pr-pop"
    >
      <Trophy size={10} />
      PR · {display}
    </span>
  );
}
