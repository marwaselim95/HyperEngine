import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { Dashboard } from './pages/Dashboard';
import { WorkoutLogger } from './pages/WorkoutLogger';
import { MealBuilder } from './pages/MealBuilder';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex h-screen bg-bg-primary overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 min-w-0">
            <TopBar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/workout" element={<WorkoutLogger />} />
              <Route path="/nutrition" element={<MealBuilder />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
