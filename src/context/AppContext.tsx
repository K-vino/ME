import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, UserProfile, DailyData, Task, Habit, Education, Goal } from '../types';
import { loadData, saveData, defaultState } from '../utils/storage';

interface AppContextType {
  state: AppState;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  updateDailyData: (date: string, data: Partial<DailyData>) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  addHabit: (habit: Habit) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  addEducation: (education: Education) => void;
  updateEducation: (education: Education) => void;
  deleteEducation: (id: string) => void;
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

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setState((prev) => ({ ...prev, userProfile: { ...prev.userProfile, ...profile } }));
  };

  const updateDailyData = (date: string, data: Partial<DailyData>) => {
    setState((prev) => ({
      ...prev,
      dailyData: {
        ...prev.dailyData,
        [date]: { ...prev.dailyData[date], ...data },
      },
    }));
  };

  const addTask = (task: Task) => setState((prev) => ({ ...prev, tasks: [...prev.tasks, task] }));
  const updateTask = (task: Task) => setState((prev) => ({ ...prev, tasks: prev.tasks.map((t) => (t.id === task.id ? task : t)) }));
  const deleteTask = (id: string) => setState((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== id) }));

  const addHabit = (habit: Habit) => setState((prev) => ({ ...prev, habits: [...prev.habits, habit] }));
  const updateHabit = (habit: Habit) => setState((prev) => ({ ...prev, habits: prev.habits.map((h) => (h.id === habit.id ? habit : h)) }));
  const deleteHabit = (id: string) => setState((prev) => ({ ...prev, habits: prev.habits.filter((h) => h.id !== id) }));

  const addEducation = (education: Education) => setState((prev) => ({ ...prev, education: [...prev.education, education] }));
  const updateEducation = (education: Education) => setState((prev) => ({ ...prev, education: prev.education.map((e) => (e.id === education.id ? education : e)) }));
  const deleteEducation = (id: string) => setState((prev) => ({ ...prev, education: prev.education.filter((e) => e.id !== id) }));

  const addGoal = (goal: Goal) => setState((prev) => ({ ...prev, goals: [...prev.goals, goal] }));
  const updateGoal = (goal: Goal) => setState((prev) => ({ ...prev, goals: prev.goals.map((g) => (g.id === goal.id ? goal : g)) }));
  const deleteGoal = (id: string) => setState((prev) => ({ ...prev, goals: prev.goals.filter((g) => g.id !== id) }));

  const toggleDarkMode = () => setState((prev) => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  const resetData = () => setState(defaultState);
  const importState = (newState: AppState) => setState(newState);

  return (
    <AppContext.Provider
      value={{
        state,
        updateUserProfile,
        updateDailyData,
        addTask,
        updateTask,
        deleteTask,
        addHabit,
        updateHabit,
        deleteHabit,
        addEducation,
        updateEducation,
        deleteEducation,
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
