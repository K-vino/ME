import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  CheckSquare, 
  RotateCcw, 
  GraduationCap, 
  Target, 
  BarChart3, 
  Bot, 
  Settings,
  Calculator,
  Briefcase,
  History
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAppContext } from '../context/AppContext';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Daily Tracker', path: '/tracker', icon: ClipboardList },
  { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'Habits', path: '/habits', icon: RotateCcw },
  { name: 'Learning', path: '/learning', icon: GraduationCap },
  { name: 'Goals', path: '/goals', icon: Target },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'AI Coach', path: '/ai', icon: Bot },
  { name: 'Smart Tracker', path: '/smart-tracker', icon: Calculator },
  { name: 'Career Center', path: '/career', icon: Briefcase },
  { name: 'Activity Log', path: '/activity', icon: History },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { state } = useAppContext();
  const { userProfile } = state;

  const initials = userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

  return (
    <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 h-screen flex flex-col sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Life<span className="text-indigo-600 dark:text-indigo-400">OS</span>
        </h1>
      </div>
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-white'
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold">
            {initials}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{userProfile.name}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500">{userProfile.startingWeight}kg → {userProfile.targetWeight}kg</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
