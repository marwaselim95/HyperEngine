import { Link } from 'react-router-dom';
import { Dumbbell, Utensils, TrendingUp, Zap } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { MacroDashboard } from '../components/nutrition/MacroDashboard';
import { WeeklyVolumeChart } from '../components/dashboard/WeeklyVolumeChart';
import { MacroAdherenceGrid } from '../components/dashboard/MacroAdherenceGrid';
import { ConsistencyHeatmap } from '../components/dashboard/ConsistencyHeatmap';
import { Button } from '../components/ui/Button';
import { useUser } from '../hooks/useUser';
import { useWorkout } from '../hooks/useWorkout';
import { useNutrition } from '../hooks/useNutrition';

export function Dashboard() {
  const { profile, isImperial, tdee } = useUser();
  const { sessions } = useWorkout();
  const { getTodayLog, logs } = useNutrition();
  const todayLog = getTodayLog();

  return (
    <PageWrapper>
      {/* Welcome banner */}
      <div className="rounded-xl border border-accent/20 bg-gradient-to-r from-accent/10 to-transparent p-5 mb-6 flex items-center gap-4">
        <span className="w-10 h-10 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0">
          <Zap size={20} className="text-accent" />
        </span>
        <div>
          <p className="text-base font-semibold text-primary">
            Welcome back, {profile.name} 👊
          </p>
          <p className="text-sm text-muted">
            TDEE: <span className="text-primary font-mono">{Math.round(tdee).toLocaleString()} kcal</span>
            {' '}· Goal: <span className="text-primary capitalize">{profile.goal.replace('_', ' ')}</span>
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <Link to="/workout">
            <Button variant="primary" size="sm" leftIcon={<Dumbbell size={14} />} id="dashboard-log-workout">
              Log Workout
            </Button>
          </Link>
        </div>
      </div>

      {/* Today's macros */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-primary">Today's Nutrition</h2>
          <Link to="/nutrition" className="text-xs text-accent hover:underline">View all →</Link>
        </div>
        <MacroDashboard totals={todayLog.totals} targets={profile.macroProfile} />
      </div>

      {/* Weekly volume */}
      <div className="mb-4">
        <WeeklyVolumeChart sessions={sessions} isImperial={isImperial} />
      </div>

      {/* Adherence + Heatmap grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <MacroAdherenceGrid logs={logs} targets={profile.macroProfile} />
        <ConsistencyHeatmap sessions={sessions} logs={logs} />
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Sessions', value: sessions.length, icon: Dumbbell, color: 'text-accent' },
          {
            label: 'This Week',
            value: sessions.filter((s) => {
              const d = new Date(s.date);
              const now = new Date();
              const weekStart = new Date(now);
              weekStart.setDate(now.getDate() - now.getDay());
              return d >= weekStart;
            }).length,
            icon: TrendingUp,
            color: 'text-violet-400',
          },
          {
            label: 'Foods Logged',
            value: logs.reduce((s, l) => s + l.entries.length, 0),
            icon: Utensils,
            color: 'text-emerald-400',
          },
          {
            label: 'Logging Days',
            value: logs.filter((l) => l.entries.length > 0).length,
            icon: Zap,
            color: 'text-amber-400',
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-xl border border-border bg-bg-secondary/60 px-4 py-4 flex flex-col gap-1"
          >
            <Icon size={16} className={color} />
            <p className="text-2xl font-bold font-mono text-primary">{value}</p>
            <p className="text-xs text-muted">{label}</p>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
