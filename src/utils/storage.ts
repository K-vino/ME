import { AppState, UserProfile, DailyEntry, Task, Habit, Course, Goal, ActivityLog } from '../types';

const STORAGE_KEY = 'personal-life-os-data';

const defaultUserProfile: UserProfile = {
  name: 'Vino K',
  height: 150,
  startingWeight: 85,
  targetWeight: 60,
  goalDuration: 365,
  startDate: '2026-03-13'
};

const defaultTasks: Task[] = [
  { id: 't1', title: 'Morning workout', completed: false, priority: 'High', deadline: '2026-03-13', category: 'Health' },
  { id: 't2', title: 'Drink water', completed: false, priority: 'Medium', deadline: '2026-03-13', category: 'Health' },
  { id: 't3', title: 'Study topic', completed: false, priority: 'High', deadline: '2026-03-13', category: 'Learning' },
  { id: 't4', title: 'Practice skill', completed: false, priority: 'Medium', deadline: '2026-03-13', category: 'Learning' },
  { id: 't5', title: 'Reading', completed: false, priority: 'Low', deadline: '2026-03-13', category: 'Learning' },
  { id: 't6', title: 'Reflection', completed: false, priority: 'Low', deadline: '2026-03-13', category: 'Productivity' }
];

const defaultHabits: Habit[] = [
  { id: 'h1', name: 'Workout', frequency: 'Daily', completedDates: [], streak: 0, category: 'Health' },
  { id: 'h2', name: 'Study', frequency: 'Daily', completedDates: [], streak: 0, category: 'Learning' },
  { id: 'h3', name: 'Reading', frequency: 'Daily', completedDates: [], streak: 0, category: 'Learning' },
  { id: 'h4', name: 'Healthy eating', frequency: 'Daily', completedDates: [], streak: 0, category: 'Health' },
  { id: 'h5', name: 'Sleep', frequency: 'Daily', completedDates: [], streak: 0, category: 'Health' }
];

const defaultActivityLog: ActivityLog = {
  version: 1,
  createdAt: new Date().toISOString(),
  entries: []
};

export const defaultState: AppState = {
  userProfile: defaultUserProfile,
  dailyData: [],
  tasks: defaultTasks,
  habits: defaultHabits,
  education: [],
  goals: [],
  isDarkMode: false,
  activityLog: defaultActivityLog
};

export const loadData = (): AppState => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Ensure all required fields are present and are arrays where expected
      return {
        ...defaultState,
        ...parsed,
        userProfile: { ...defaultState.userProfile, ...(parsed.userProfile || {}) },
        dailyData: Array.isArray(parsed.dailyData) ? parsed.dailyData : defaultState.dailyData,
        tasks: Array.isArray(parsed.tasks) ? parsed.tasks : defaultState.tasks,
        habits: Array.isArray(parsed.habits) ? parsed.habits : defaultState.habits,
        education: Array.isArray(parsed.education) ? parsed.education : defaultState.education,
        goals: Array.isArray(parsed.goals) ? parsed.goals : defaultState.goals,
        activityLog: parsed.activityLog || defaultState.activityLog,
      };
    }
  } catch (error) {
    console.error('Failed to load data from LocalStorage', error);
  }
  return defaultState;
};

export const saveData = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save data to LocalStorage', error);
  }
};

export const clearData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear data from LocalStorage', error);
  }
};

export const exportData = (state: AppState): void => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "personal-life-os-backup.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

export const importData = (file: File, callback: (state: AppState) => void): void => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      if (e.target?.result) {
        const state = JSON.parse(e.target.result as string);
        callback(state);
      }
    } catch (error) {
      console.error('Failed to parse imported data', error);
      alert('Invalid backup file format.');
    }
  };
  reader.readAsText(file);
};
