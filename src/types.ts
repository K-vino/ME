export interface UserProfile {
  name: string;
  location: string;
  education: string;
  cgpa: number;
  careerFocus: string[];
}

export interface ResumeItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
}

export interface ResumeData {
  education: ResumeItem[];
  certifications: ResumeItem[];
  internships: ResumeItem[];
  achievements: ResumeItem[];
  contactLinks: { platform: string; url: string }[];
}

export interface Skill {
  id: string;
  name: string;
  progress: number;
  learningHours: number;
  weeklyImprovement: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  status: 'Planning' | 'In Progress' | 'Completed';
  completionPercentage: number;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High';
  deadline: string;
  category: string;
}

export interface RoadmapTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface RoadmapPhase {
  id: string;
  title: string;
  timeline: string;
  goal: string;
  tasks: RoadmapTask[];
}

export interface SessionAction {
  timestamp: string;
  action: string;
  details: any;
}

export interface Session {
  sessionId: string;
  startTime: string;
  endTime: string | null;
  actions: SessionAction[];
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
  resumeData: ResumeData;
  skills: Skill[];
  projects: Project[];
  tasks: Task[];
  roadmap: RoadmapPhase[];
  sessions: Session[];
  isDarkMode: boolean;
}
