export interface UserProfile {
  name: string;
  height: number;
  startingWeight: number;
  targetWeight: number;
  goalDuration: number;
  startDate: string;
}

export interface DailyEntry {
  id: string;
  date: string;
  dayNumber: number;
  targetWeight: number;
  actualWeight: number;
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
  priority: 'Low' | 'Medium' | 'High';
  deadline: string;
  category: string;
}

export interface Habit {
  id: string;
  name: string;
  frequency: 'Daily' | 'Weekly';
  completedDates: string[];
  streak: number;
  category: string;
}

export interface Course {
  id: string;
  name: string;
  platform: string;
  status: 'In Progress' | 'Completed' | 'Planned';
  progress: number;
  totalHours: number;
  completedHours: number;
  startDate: string;
  certificateUrl?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  category: 'Health' | 'Career' | 'Financial' | 'Personal' | 'Learning';
  status: 'In Progress' | 'Completed' | 'On Hold';
  progress: number;
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

export interface AppState {
  userProfile: UserProfile;
  dailyData: DailyEntry[];
  tasks: Task[];
  habits: Habit[];
  education: Course[];
  goals: Goal[];
  isDarkMode: boolean;
  activityLog: ActivityLog;
}
