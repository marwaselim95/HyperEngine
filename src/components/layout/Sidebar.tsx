import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Dumbbell,
  Utensils,
  Settings,
  Zap,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/workout', icon: Dumbbell, label: 'Workout' },
  { to: '/nutrition', icon: Utensils, label: 'Nutrition' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-[72px] xl:w-56 h-full bg-bg-secondary border-r border-border shrink-0 py-6 transition-all duration-300">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 mb-8">
        <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent/15 border border-accent/30 shrink-0">
          <Zap size={18} className="text-accent" />
        </span>
        <span className="hidden xl:block text-sm font-bold text-primary tracking-wide whitespace-nowrap">
          HyperEngine
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-2">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            id={`nav-${label.toLowerCase()}`}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group',
                isActive
                  ? 'bg-accent/10 text-accent border border-accent/20'
                  : 'text-muted hover:text-primary hover:bg-surface border border-transparent',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-accent' : 'text-muted group-hover:text-primary'} />
                <span className="hidden xl:block text-sm font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom hint */}
      <div className="hidden xl:flex flex-col gap-1 px-4 mt-4">
        <p className="text-[10px] text-muted/50 uppercase tracking-widest">v1.0.0</p>
      </div>
    </aside>
  );
}
