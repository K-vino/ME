import { AppState, UserProfile, ResumeData, Skill, Project, Task, RoadmapPhase, Session } from '../types';

const STORAGE_KEY = 'vino-career-os-data';

const defaultUserProfile: UserProfile = {
  name: 'Vino K',
  location: 'Salem, Tamil Nadu, India',
  education: 'B.Tech Information Technology (2022–2026)',
  cgpa: 7.5,
  careerFocus: [
    'Oracle Fusion HCM',
    'Oracle Integration Cloud (OIC)',
    'Data Science',
    'AI / Machine Learning',
    'Cloud Computing (AWS)'
  ]
};

const defaultResumeData: ResumeData = {
  education: [
    { id: '1', title: 'B.Tech Information Technology', subtitle: 'College Name', date: '2022 - 2026', description: 'CGPA: 7.5' }
  ],
  certifications: [],
  internships: [],
  achievements: [],
  contactLinks: [
    { platform: 'LinkedIn', url: '#' },
    { platform: 'GitHub', url: '#' }
  ]
};

const defaultSkills: Skill[] = [
  { id: 's1', name: 'Oracle HCM', progress: 40, learningHours: 20, weeklyImprovement: 5 },
  { id: 's2', name: 'Oracle Integration Cloud', progress: 30, learningHours: 15, weeklyImprovement: 2 },
  { id: 's3', name: 'Python', progress: 60, learningHours: 50, weeklyImprovement: 10 },
  { id: 's4', name: 'Machine Learning', progress: 20, learningHours: 10, weeklyImprovement: 1 },
  { id: 's5', name: 'Deep Learning', progress: 10, learningHours: 5, weeklyImprovement: 0 },
  { id: 's6', name: 'AWS', progress: 25, learningHours: 12, weeklyImprovement: 3 },
  { id: 's7', name: 'SQL', progress: 70, learningHours: 60, weeklyImprovement: 5 },
  { id: 's8', name: 'REST APIs', progress: 50, learningHours: 30, weeklyImprovement: 8 },
  { id: 's9', name: 'SOAP APIs', progress: 30, learningHours: 15, weeklyImprovement: 2 }
];

const defaultProjects: Project[] = [
  { id: 'p1', name: 'NEXORA AI', description: 'AI platform', techStack: ['Python', 'Machine Learning'], status: 'In Progress', completionPercentage: 40 },
  { id: 'p2', name: 'Oracle HCM Integration Automation', description: 'Automating HCM processes', techStack: ['Oracle HCM', 'OIC', 'REST APIs'], status: 'Planning', completionPercentage: 10 },
  { id: 'p3', name: 'Oracle Fusion HCM Implementation', description: 'Implementation project', techStack: ['Oracle Fusion HCM', 'HCM Data Loader'], status: 'Planning', completionPercentage: 0 }
];

const defaultTasks: Task[] = [
  { id: 't1', title: 'Learn advanced Oracle OIC', completed: false, priority: 'High', deadline: '2026-04-01', category: 'Learning' },
  { id: 't2', title: 'Practice REST API integrations', completed: false, priority: 'Medium', deadline: '2026-03-20', category: 'Practice' },
  { id: 't3', title: 'Build HCM automation project', completed: false, priority: 'High', deadline: '2026-05-01', category: 'Project' },
  { id: 't4', title: 'Study machine learning algorithms', completed: false, priority: 'Medium', deadline: '2026-04-15', category: 'Learning' },
  { id: 't5', title: 'Contribute to GitHub', completed: false, priority: 'Low', deadline: '2026-03-30', category: 'Portfolio' },
  { id: 't6', title: 'Apply for internships', completed: false, priority: 'High', deadline: '2026-03-25', category: 'Career' },
  { id: 't7', title: 'Prepare for certifications', completed: false, priority: 'Medium', deadline: '2026-06-01', category: 'Learning' }
];

const defaultRoadmap: RoadmapPhase[] = [
  {
    id: 'r1',
    title: 'Phase 1',
    timeline: '2026',
    goal: 'Entry-level Oracle HCM / OIC Consultant or Data Science role',
    tasks: [
      { id: 'rt1', title: 'Improve OIC integrations', completed: false },
      { id: 'rt2', title: 'Build 3 enterprise projects', completed: false },
      { id: 'rt3', title: 'Master HCM modules', completed: false },
      { id: 'rt4', title: 'Practice SQL and APIs', completed: false },
      { id: 'rt5', title: 'Build portfolio', completed: false }
    ]
  },
  {
    id: 'r2',
    title: 'Phase 2',
    timeline: '2027–2028',
    goal: 'Senior Integration Developer / AI Engineer',
    tasks: [
      { id: 'rt6', title: 'Learn microservices', completed: false },
      { id: 'rt7', title: 'Master cloud architecture', completed: false },
      { id: 'rt8', title: 'Advanced ML projects', completed: false },
      { id: 'rt9', title: 'Build SaaS products', completed: false },
      { id: 'rt10', title: 'Publish tech blogs', completed: false }
    ]
  },
  {
    id: 'r3',
    title: 'Phase 3',
    timeline: '2029–2030',
    goal: 'Enterprise Architect / AI Platform Engineer',
    tasks: [
      { id: 'rt11', title: 'Design large enterprise systems', completed: false },
      { id: 'rt12', title: 'Build AI automation platforms', completed: false },
      { id: 'rt13', title: 'Start consulting services', completed: false },
      { id: 'rt14', title: 'Create technical courses', completed: false }
    ]
  }
];

export const defaultState: AppState = {
  userProfile: defaultUserProfile,
  resumeData: defaultResumeData,
  skills: defaultSkills,
  projects: defaultProjects,
  tasks: defaultTasks,
  roadmap: defaultRoadmap,
  sessions: [],
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
  downloadAnchorNode.setAttribute("download", "vino-career-os-backup.json");
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
