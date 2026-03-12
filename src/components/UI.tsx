import React from 'react';
import { cn } from './Sidebar';

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className, title }) => {
  return (
    <div className={cn("bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6", className)}>
      {title && <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">{title}</h3>}
      {children}
    </div>
  );
};

export const ProgressBar: React.FC<{ progress: number; className?: string; colorClass?: string }> = ({ progress, className, colorClass = "bg-indigo-600 dark:bg-indigo-500" }) => {
  return (
    <div className={cn("w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2.5", className)}>
      <div className={cn("h-2.5 rounded-full transition-all duration-500", colorClass)} style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}></div>
    </div>
  );
};
