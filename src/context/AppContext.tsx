import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, UserProfile, DailyEntry, Task, Habit, Course, Goal } from '../types';
import { loadData, saveData, defaultState } from '../utils/storage';

interface AppContextType {
  state: AppState;
  updateProfile: (profile: UserProfile) => void;
  addDailyEntry: (entry: DailyEntry) => void;
  updateDailyEntry: (entry: DailyEntry) => void;
  deleteDailyEntry: (id: string) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleHabit: (habitId: string, date: string) => void;
  addHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  addCourse: (course: Course) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  toggleDarkMode: () => void;
  resetData: () => void;
  importState: (newState: AppState) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(loadData());

  useEffect(() => {
    saveData(state);
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  const updateProfile = (profile: UserProfile) => {
    setState((prev) => ({ ...prev, userProfile: profile }));
  };

  const addDailyEntry = (entry: DailyEntry) => {
    setState((prev) => ({ ...prev, dailyData: [...prev.dailyData, entry] }));
  };

  const updateDailyEntry = (entry: DailyEntry) => {
    setState((prev) => ({
      ...prev,
      dailyData: prev.dailyData.map((e) => (e.id === entry.id ? entry : e))
    }));
  };

  const deleteDailyEntry = (id: string) => {
    setState((prev) => ({
      ...prev,
      dailyData: prev.dailyData.filter((e) => e.id !== id)
    }));
  };

  const addTask = (task: Task) => {
    setState((prev) => ({ ...prev, tasks: [...prev.tasks, task] }));
  };

  const updateTask = (task: Task) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === task.id ? task : t))
    }));
  };

  const deleteTask = (id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id)
    }));
  };

  const toggleHabit = (habitId: string, date: string) => {
    setState((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => {
        if (h.id === habitId) {
          const isCompleted = h.completedDates.includes(date);
          const newCompletedDates = isCompleted
            ? h.completedDates.filter((d) => d !== date)
            : [...h.completedDates, date];
          
          // Simple streak calculation (consecutive days including today)
          let streak = 0;
          const sortedDates = [...newCompletedDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
          if (sortedDates.length > 0) {
            const today = new Date().toISOString().split('T')[0];
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            
            if (sortedDates[0] === today || sortedDates[0] === yesterday) {
              streak = 1;
              for (let i = 0; i < sortedDates.length - 1; i++) {
                const current = new Date(sortedDates[i]);
                const next = new Date(sortedDates[i+1]);
                const diff = (current.getTime() - next.getTime()) / 86400000;
                if (diff === 1) {
                  streak++;
                } else {
                  break;
                }
              }
            }
          }

          return {
            ...h,
            completedDates: newCompletedDates,
            streak
          };
        }
        return h;
      })
    }));
  };

  const addHabit = (habit: Habit) => {
    setState((prev) => ({ ...prev, habits: [...prev.habits, habit] }));
  };

  const deleteHabit = (id: string) => {
    setState((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== id)
    }));
  };

  const addCourse = (course: Course) => {
    setState((prev) => ({ ...prev, education: [...prev.education, course] }));
  };

  const updateCourse = (course: Course) => {
    setState((prev) => ({
      ...prev,
      education: prev.education.map((c) => (c.id === course.id ? course : c))
    }));
  };

  const deleteCourse = (id: string) => {
    setState((prev) => ({
      ...prev,
      education: prev.education.filter((c) => c.id !== id)
    }));
  };

  const addGoal = (goal: Goal) => {
    setState((prev) => ({ ...prev, goals: [...prev.goals, goal] }));
  };

  const updateGoal = (goal: Goal) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === goal.id ? goal : g))
    }));
  };

  const deleteGoal = (id: string) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== id)
    }));
  };

  const toggleDarkMode = () => {
    setState((prev) => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  };

  const resetData = () => {
    setState(defaultState);
  };

  const importState = (newState: AppState) => {
    setState(newState);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        updateProfile,
        addDailyEntry,
        updateDailyEntry,
        deleteDailyEntry,
        addTask,
        updateTask,
        deleteTask,
        toggleHabit,
        addHabit,
        deleteHabit,
        addCourse,
        updateCourse,
        deleteCourse,
        addGoal,
        updateGoal,
        deleteGoal,
        toggleDarkMode,
        resetData,
        importState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
