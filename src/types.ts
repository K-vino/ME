export interface UserProfile {
  name: string;
  height: number;
  startingWeight: number;
  targetWeight: number;
  goalDurationDays: number;
  startDate: string;
}

export interface DailyData {
  date: string;
  dayNumber: number;
  targetWeight: number;
  actualWeight: number | null;
  weightDifference: number | null;
  steps: number;
  caloriesConsumed: number;
  caloriesBurned: number;
  waterIntake: number;
  sleepHours: number;
  exerciseType: string;
  exerciseDuration: number;
  studyHours: number;
  mood: string;
  notes: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  date: string;
}

export interface Habit {
  id: string;
  name: string;
  category: string;
  streak: number;
  completedDates: string[];
}

export interface Education {
  id: string;
  courseName: string;
  topic: string;
  studyHours: number;
  completionPercentage: number;
  notes: string;
}

export interface Goal {
  id: string;
  name: string;
  category: string;
  startDate: string;
  targetDate: string;
  progressPercentage: number;
}

export interface AppState {
  userProfile: UserProfile;
  dailyData: Record<string, DailyData>;
  tasks: Task[];
  habits: Habit[];
  education: Education[];
  goals: Goal[];
  isDarkMode: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  date: string;
  action: string;
  module: string;
  details: any;
  beforeState: any;
  afterState: any;
  user: string;
  appVersion: string;
}

export interface ActivityLog {
  version: number;
  createdAt: string;
  entries: LogEntry[];
}
