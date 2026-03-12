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

export interface CareerProfile {
  name: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number; // 1-100
}

export interface Certification {
  id: string;
  name: string;
  provider: string;
  date: string;
  expiryDate?: string;
  credentialLink?: string;
  notes?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubLink?: string;
  completionDate: string;
  status: 'Planned' | 'In Progress' | 'Completed';
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  skillsGained: string[];
  description: string;
}

export interface RoadmapPhase {
  id: string;
  title: string;
  skills: string[];
  courses: string[];
  projects: string[];
  milestones: string[];
  status: 'Locked' | 'Active' | 'Completed';
}

export interface CareerRoadmap {
  id: string;
  title: string;
  category: string;
  phases: RoadmapPhase[];
}

export interface CareerTask {
  id: string;
  title: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  deadline: string;
  completed: boolean;
}

export interface CareerGoal {
  id: string;
  name: string;
  category: string;
  startDate: string;
  targetDate: string;
  progress: number;
  status: 'In Progress' | 'Completed' | 'On Hold';
  milestones: string[];
}

export interface LearningSession {
  id: string;
  title: string;
  topic: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  notes: string;
}

export interface NutritionData {
  rice_g: number;
  wheat_g: number;
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
}

export interface HealthMetrics {
  currentWeight: number;
  steps: number;
  waterIntake: number;
  sleepHours: number;
  exerciseDuration: number;
  exerciseType: 'Walking' | 'Running' | 'Cycling';
  // Calculated
  caloriesBurned: number;
  sleepScore: number;
  waterProgress: number;
  weightProgress: number;
  calorieBalance: number;
}

export interface CustomFormula {
  id: string;
  name: string;
  expression: string; // e.g., "weight * 1.6"
  description: string;
}

export interface FormulaConfig {
  customFormulas: CustomFormula[];
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
  // Career Module
  careerProfile: CareerProfile;
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
  experience: Experience[];
  careerRoadmaps: CareerRoadmap[];
  careerTasks: CareerTask[];
  careerGoals: CareerGoal[];
  learningSessions: LearningSession[];
  // Formula Engine Module
  nutritionData: NutritionData;
  healthMetrics: HealthMetrics;
  formulaConfig: FormulaConfig;
}
