import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { WorkoutSession } from '../../types';
import { sessionVolume } from '../../utils/volumeCalculators';
import { last7Days, isToday } from '../../utils/dateUtils';

interface WeeklyVolumeChartProps {
  sessions: WorkoutSession[];
  isImperial: boolean;
}

interface DayData {
  day: string;
  volume: number;
  isToday: boolean;
}

export function WeeklyVolumeChart({ sessions, isImperial }: WeeklyVolumeChartProps) {
  const days = last7Days();

  const data: DayData[] = days.map((date) => {
    const daySessions = sessions.filter((s) => s.date === date);
    const vol = daySessions.reduce((sum, s) => sum + sessionVolume(s), 0);
    const displayVol = isImperial ? vol * 2.20462 : vol;
    return {
      day: new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
      volume: Math.round(displayVol),
      isToday: isToday(date),
    };
  });

  const unit = isImperial ? 'lbs' : 'kg';
  const maxVol = Math.max(...data.map((d) => d.volume), 1);

  return (
    <div className="rounded-xl border border-border bg-bg-secondary/60 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-primary">Weekly Volume</h3>
        <span className="text-xs text-muted">{unit} lifted · last 7 days</span>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} barCategoryGap="30%">
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
          />
          <YAxis hide domain={[0, maxVol * 1.15]} />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            contentStyle={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'var(--color-primary)',
            }}
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            formatter={(v: any) => {
              const num = typeof v === 'number' ? v : Number(v ?? 0);
              return [`${num.toLocaleString()} ${unit}`, 'Volume'];
            }}
          />
          <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.isToday ? '#00D4FF' : entry.volume > 0 ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.06)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
