import { 
  AppState, 
  UserProfile, 
  DailyEntry, 
  Task, 
  Habit, 
  Course, 
  Goal, 
  ActivityLog,
  CareerProfile,
  Skill,
  Certification,
  Project,
  Experience,
  CareerRoadmap,
  CareerTask,
  CareerGoal,
  LearningSession,
  NutritionData,
  HealthMetrics,
  FormulaConfig
} from '../types';

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

const defaultCareerProfile: CareerProfile = {
  name: 'Vino K',
  location: 'Salem, Tamil Nadu, India',
  email: 'infotechvmd@gmail.com',
  phone: '+91 9876543210',
  linkedin: 'linkedin.com/in/vinok',
  github: 'github.com/vinok',
  portfolio: 'vinok.dev',
  summary: 'Data Science and AI Engineer with experience in Machine Learning, Deep Learning, Python, SQL, and cloud platforms including AWS and Oracle Cloud. Experienced with Oracle Fusion HCM integrations using Oracle Integration Cloud, REST/SOAP APIs, and HCM Data Loader.'
};

const defaultSkills: Skill[] = [
  { id: 's1', name: 'Python', category: 'Programming', proficiency: 90 },
  { id: 's2', name: 'SQL', category: 'Programming', proficiency: 85 },
  { id: 's3', name: 'Machine Learning', category: 'AI / Data Science', proficiency: 80 },
  { id: 's4', name: 'Deep Learning', category: 'AI / Data Science', proficiency: 75 },
  { id: 's5', name: 'Oracle Fusion HCM', category: 'Oracle Technologies', proficiency: 75 },
  { id: 's6', name: 'Oracle Integration Cloud', category: 'Oracle Technologies', proficiency: 70 },
  { id: 's7', name: 'AWS', category: 'Cloud Platforms', proficiency: 65 },
  { id: 's8', name: 'Git', category: 'Tools', proficiency: 85 }
];

const defaultCertifications: Certification[] = [
  { id: 'c1', name: 'Oracle Fusion Cloud Applications HCM Process Essentials', provider: 'Oracle', date: '2025-01-15' },
  { id: 'c2', name: 'Oracle Cloud Infrastructure Data Science Professional', provider: 'Oracle', date: '2025-02-10' },
  { id: 'c3', name: 'AWS Certified Cloud Practitioner', provider: 'AWS', date: '2024-11-20' },
  { id: 'c4', name: 'NPTEL Joy of Computing using Python', provider: 'NPTEL', date: '2023-10-05' }
];

const defaultProjects: Project[] = [
  { id: 'p1', name: 'NEXORA AI', description: 'AI Decision Support Platform', technologies: ['Python', 'TensorFlow', 'Streamlit'], githubLink: 'github.com/vinok/nexora', completionDate: '2025-12-01', status: 'Completed' },
  { id: 'p2', name: 'Oracle HCM Integration Automation', description: 'OIC based automation for HCM', technologies: ['OIC', 'SOAP', 'REST'], completionDate: '2026-01-15', status: 'Completed' }
];

const defaultExperience: Experience[] = [
  { id: 'e1', company: 'NoviTech R&D', role: 'AI/ML Intern', startDate: '2025-06-01', endDate: '2025-08-31', skillsGained: ['Python', 'Machine Learning'], description: 'Worked on ML models and predictive analytics.' },
  { id: 'e2', company: 'YBI Foundation', role: 'Data Science Intern', startDate: '2024-12-01', endDate: '2025-02-28', skillsGained: ['Pandas', 'Scikit-learn'], description: 'Data analysis and visualization.' }
];

const defaultRoadmaps: CareerRoadmap[] = [
  {
    id: 'r1',
    title: 'Oracle Cloud Consultant Path',
    category: 'Oracle Cloud',
    phases: [
      { id: 'rp1', title: 'Phase 1: Master Oracle Fusion HCM', skills: ['HCM Core', 'Security'], courses: ['HCM Essentials'], projects: ['HCM Setup'], milestones: ['Certification'], status: 'Active' },
      { id: 'rp2', title: 'Phase 2: Learn OIC integrations', skills: ['OIC', 'REST/SOAP'], courses: ['OIC Training'], projects: ['Integration Project'], milestones: ['OIC Cert'], status: 'Locked' }
    ]
  },
  {
    id: 'r2',
    title: 'AI / Data Scientist Path',
    category: 'AI',
    phases: [
      { id: 'rp3', title: 'Phase 1: Python & Math', skills: ['Python', 'Statistics'], courses: ['Python for DS'], projects: ['EDA Project'], milestones: ['NPTEL Cert'], status: 'Completed' }
    ]
  }
];

const defaultCareerGoals: CareerGoal[] = [
  { id: 'cg1', name: 'Become Oracle Cloud Consultant', category: 'Career', startDate: '2026-01-01', targetDate: '2027-01-01', progress: 40, status: 'In Progress', milestones: ['Get OIC Cert', 'Finish 2 Projects'] },
  { id: 'cg2', name: 'Master Machine Learning', category: 'Learning', startDate: '2025-01-01', targetDate: '2026-06-01', progress: 75, status: 'In Progress', milestones: ['Complete DL Course'] }
];

const defaultNutritionData: NutritionData = {
  rice_g: 0,
  wheat_g: 0,
  totalCalories: 0,
  totalCarbs: 0,
  totalProtein: 0,
  totalFat: 0
};

const defaultHealthMetrics: HealthMetrics = {
  currentWeight: 85,
  steps: 0,
  waterIntake: 0,
  sleepHours: 0,
  exerciseDuration: 0,
  exerciseType: 'Walking',
  caloriesBurned: 0,
  sleepScore: 0,
  waterProgress: 0,
  weightProgress: 0,
  calorieBalance: 0
};

const defaultFormulaConfig: FormulaConfig = {
  customFormulas: [
    { id: 'f1', name: 'Protein Goal', expression: 'weight * 1.6', description: 'Recommended daily protein in grams' }
  ]
};

export const defaultState: AppState = {
  userProfile: defaultUserProfile,
  dailyData: [],
  tasks: defaultTasks,
  habits: defaultHabits,
  education: [],
  goals: [],
  isDarkMode: false,
  activityLog: defaultActivityLog,
  careerProfile: defaultCareerProfile,
  skills: defaultSkills,
  certifications: defaultCertifications,
  projects: defaultProjects,
  experience: defaultExperience,
  careerRoadmaps: defaultRoadmaps,
  careerTasks: [],
  careerGoals: defaultCareerGoals,
  learningSessions: [],
  nutritionData: defaultNutritionData,
  healthMetrics: defaultHealthMetrics,
  formulaConfig: defaultFormulaConfig
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
        // Career Module
        careerProfile: { ...defaultState.careerProfile, ...(parsed.careerProfile || {}) },
        skills: Array.isArray(parsed.skills) ? parsed.skills : defaultState.skills,
        certifications: Array.isArray(parsed.certifications) ? parsed.certifications : defaultState.certifications,
        projects: Array.isArray(parsed.projects) ? parsed.projects : defaultState.projects,
        experience: Array.isArray(parsed.experience) ? parsed.experience : defaultState.experience,
        careerRoadmaps: Array.isArray(parsed.careerRoadmaps) ? parsed.careerRoadmaps : defaultState.careerRoadmaps,
        careerTasks: Array.isArray(parsed.careerTasks) ? parsed.careerTasks : defaultState.careerTasks,
        careerGoals: Array.isArray(parsed.careerGoals) ? parsed.careerGoals : defaultState.careerGoals,
        learningSessions: Array.isArray(parsed.learningSessions) ? parsed.learningSessions : defaultState.learningSessions,
        // Formula Engine Module
        nutritionData: parsed.nutritionData || defaultState.nutritionData,
        healthMetrics: parsed.healthMetrics || defaultState.healthMetrics,
        formulaConfig: parsed.formulaConfig || defaultState.formulaConfig,
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
