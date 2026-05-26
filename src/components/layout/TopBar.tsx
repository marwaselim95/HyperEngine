import { useLocation } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import { formatDateDisplay, todayISO } from '../../utils/dateUtils';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, Utensils, Settings } from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/workout': 'Workout Logger',
  '/nutrition': 'Meal Builder',
  '/settings': 'Settings',
};

const MOBILE_NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/workout', icon: Dumbbell, label: 'Workout' },
  { to: '/nutrition', icon: Utensils, label: 'Nutrition' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function TopBar() {
  const { pathname } = useLocation();
  const { profile } = useUser();
  const title = PAGE_TITLES[pathname] ?? 'HyperEngine';

  return (
    <>
      {/* Desktop top bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-bg-secondary/80 backdrop-blur-sm shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-primary">{title}</h1>
          <p className="text-xs text-muted">{formatDateDisplay(todayISO())}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-primary">{profile.name}</p>
            <p className="text-xs text-muted capitalize">{profile.goal.replace('_', ' ')}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-bold text-sm">
            {profile.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-bg-secondary border-t border-border z-40 flex">
        {MOBILE_NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            id={`mobile-nav-${label.toLowerCase()}`}
            className={({ isActive }) =>
              [
                'flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] transition-colors',
                isActive ? 'text-accent' : 'text-muted',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} className={isActive ? 'text-accent' : 'text-muted'} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
