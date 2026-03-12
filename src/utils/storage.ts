import { AppState, UserProfile, DailyData, Task, Habit, Education, Goal } from '../types';
import { calculateTargetWeight } from './weightEngine';

const STORAGE_KEY = 'personal-life-os-data';

const defaultUserProfile: UserProfile = {
  name: 'Vino K',
  height: 150,
  startingWeight: 85,
  targetWeight: 60,
  goalDurationDays: 365,
  startDate: '2026-03-13',
};

const defaultTasks: Task[] = [
  { id: '1', title: 'Morning workout', completed: false, category: 'Health', priority: 'High', date: '2026-03-13' },
  { id: '2', title: 'Drink water', completed: false, category: 'Health', priority: 'High', date: '2026-03-13' },
  { id: '3', title: 'Study topic', completed: false, category: 'Learning', priority: 'Medium', date: '2026-03-13' },
  { id: '4', title: 'Practice skill', completed: false, category: 'Learning', priority: 'Medium', date: '2026-03-13' },
  { id: '5', title: 'Reading', completed: false, category: 'Learning', priority: 'Low', date: '2026-03-13' },
  { id: '6', title: 'Reflection', completed: false, category: 'Productivity', priority: 'Low', date: '2026-03-13' },
];

const defaultHabits: Habit[] = [
  { id: 'h1', name: 'Workout', category: 'Health', streak: 0, completedDates: [] },
  { id: 'h2', name: 'Study', category: 'Learning', streak: 0, completedDates: [] },
  { id: 'h3', name: 'Reading', category: 'Learning', streak: 0, completedDates: [] },
  { id: 'h4', name: 'Healthy eating', category: 'Health', streak: 0, completedDates: [] },
  { id: 'h5', name: 'Sleep 8 hours', category: 'Health', streak: 0, completedDates: [] },
];

const generateInitialDailyData = (): Record<string, DailyData> => {
  const dailyData: Record<string, DailyData> = {};
  const startDate = new Date('2026-03-13');

  for (let i = 0; i < 365; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateString = currentDate.toISOString().split('T')[0];
    const dayNumber = i + 1;

    dailyData[dateString] = {
      date: dateString,
      dayNumber,
      targetWeight: calculateTargetWeight(85, 60, 365, dayNumber),
      actualWeight: i === 0 ? 85 : null,
      weightDifference: i === 0 ? 0 : null,
      steps: 0,
      caloriesConsumed: 0,
      caloriesBurned: 0,
      waterIntake: 0,
      sleepHours: 0,
      exerciseType: '',
      exerciseDuration: 0,
      studyHours: 0,
      mood: '',
      notes: '',
    };
  }
  return dailyData;
};

export const defaultState: AppState = {
  userProfile: defaultUserProfile,
  dailyData: generateInitialDailyData(),
  tasks: defaultTasks,
  habits: defaultHabits,
  education: [],
  goals: [],
  isDarkMode: false,
};

export const loadData = (): AppState => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
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
