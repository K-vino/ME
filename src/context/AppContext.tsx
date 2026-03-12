import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, UserProfile, DailyData, Task, Habit, Education, Goal } from '../types';
import { loadData, saveData, defaultState } from '../utils/storage';
import { logAction } from '../utils/logger';

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
    logAction('UPDATE_PROFILE', 'Settings', { updatedFields: Object.keys(profile) }, state.userProfile, { ...state.userProfile, ...profile }, state.userProfile.name);
    setState((prev) => ({ ...prev, userProfile: { ...prev.userProfile, ...profile } }));
  };

  const updateDailyData = (date: string, data: Partial<DailyData>) => {
    const beforeState = state.dailyData[date];
    const afterState = { ...beforeState, ...data };
    logAction('UPDATE_DAILY_DATA', 'Tracker', { date, updatedFields: Object.keys(data) }, beforeState, afterState, state.userProfile.name);
    setState((prev) => ({
      ...prev,
      dailyData: {
        ...prev.dailyData,
        [date]: { ...prev.dailyData[date], ...data },
      },
    }));
  };

  const addTask = (task: Task) => {
    logAction('ADD_TASK', 'Tasks', { taskId: task.id, title: task.title }, null, task, state.userProfile.name);
    setState((prev) => ({ ...prev, tasks: [...prev.tasks, task] }));
  };
  
  const updateTask = (task: Task) => {
    const beforeState = state.tasks.find(t => t.id === task.id);
    const action = beforeState?.completed !== task.completed ? (task.completed ? 'COMPLETE_TASK' : 'UNCOMPLETE_TASK') : 'UPDATE_TASK';
    logAction(action, 'Tasks', { taskId: task.id, title: task.title }, beforeState, task, state.userProfile.name);
    setState((prev) => ({ ...prev, tasks: prev.tasks.map((t) => (t.id === task.id ? task : t)) }));
  };
  
  const deleteTask = (id: string) => {
    const beforeState = state.tasks.find(t => t.id === id);
    logAction('DELETE_TASK', 'Tasks', { taskId: id, title: beforeState?.title }, beforeState, null, state.userProfile.name);
    setState((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== id) }));
  };

  const addHabit = (habit: Habit) => {
    logAction('ADD_HABIT', 'Habits', { habitId: habit.id, name: habit.name }, null, habit, state.userProfile.name);
    setState((prev) => ({ ...prev, habits: [...prev.habits, habit] }));
  };
  
  const updateHabit = (habit: Habit) => {
    const beforeState = state.habits.find(h => h.id === habit.id);
    const action = beforeState?.completedDates.length !== habit.completedDates.length ? 'COMPLETE_HABIT' : 'UPDATE_HABIT';
    logAction(action, 'Habits', { habitId: habit.id, name: habit.name }, beforeState, habit, state.userProfile.name);
    setState((prev) => ({ ...prev, habits: prev.habits.map((h) => (h.id === habit.id ? habit : h)) }));
  };
  
  const deleteHabit = (id: string) => {
    const beforeState = state.habits.find(h => h.id === id);
    logAction('DELETE_HABIT', 'Habits', { habitId: id, name: beforeState?.name }, beforeState, null, state.userProfile.name);
    setState((prev) => ({ ...prev, habits: prev.habits.filter((h) => h.id !== id) }));
  };

  const addEducation = (education: Education) => {
    logAction('ADD_EDUCATION', 'Learning', { educationId: education.id, courseName: education.courseName }, null, education, state.userProfile.name);
    setState((prev) => ({ ...prev, education: [...prev.education, education] }));
  };
  
  const updateEducation = (education: Education) => {
    const beforeState = state.education.find(e => e.id === education.id);
    logAction('UPDATE_EDUCATION', 'Learning', { educationId: education.id, courseName: education.courseName }, beforeState, education, state.userProfile.name);
    setState((prev) => ({ ...prev, education: prev.education.map((e) => (e.id === education.id ? education : e)) }));
  };
  
  const deleteEducation = (id: string) => {
    const beforeState = state.education.find(e => e.id === id);
    logAction('DELETE_EDUCATION', 'Learning', { educationId: id, courseName: beforeState?.courseName }, beforeState, null, state.userProfile.name);
    setState((prev) => ({ ...prev, education: prev.education.filter((e) => e.id !== id) }));
  };

  const addGoal = (goal: Goal) => {
    logAction('ADD_GOAL', 'Goals', { goalId: goal.id, name: goal.name }, null, goal, state.userProfile.name);
    setState((prev) => ({ ...prev, goals: [...prev.goals, goal] }));
  };
  
  const updateGoal = (goal: Goal) => {
    const beforeState = state.goals.find(g => g.id === goal.id);
    const action = goal.progressPercentage === 100 && beforeState?.progressPercentage !== 100 ? 'COMPLETE_GOAL' : 'UPDATE_GOAL';
    logAction(action, 'Goals', { goalId: goal.id, name: goal.name }, beforeState, goal, state.userProfile.name);
    setState((prev) => ({ ...prev, goals: prev.goals.map((g) => (g.id === goal.id ? goal : g)) }));
  };
  
  const deleteGoal = (id: string) => {
    const beforeState = state.goals.find(g => g.id === id);
    logAction('DELETE_GOAL', 'Goals', { goalId: id, name: beforeState?.name }, beforeState, null, state.userProfile.name);
    setState((prev) => ({ ...prev, goals: prev.goals.filter((g) => g.id !== id) }));
  };

  const toggleDarkMode = () => {
    logAction('TOGGLE_DARK_MODE', 'Settings', { isDarkMode: !state.isDarkMode }, { isDarkMode: state.isDarkMode }, { isDarkMode: !state.isDarkMode }, state.userProfile.name);
    setState((prev) => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  };
  
  const resetData = () => {
    logAction('RESET_DATA', 'Settings', {}, state, defaultState, state.userProfile.name);
    setState(defaultState);
  };
  
  const importState = (newState: AppState) => {
    logAction('IMPORT_DATA', 'Settings', {}, state, newState, newState.userProfile.name);
    setState(newState);
  };

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
