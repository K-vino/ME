import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  AppState, 
  UserProfile, 
  DailyEntry, 
  Task, 
  Habit, 
  Course, 
  Goal,
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
  FormulaConfig,
  CustomFormula
} from '../types';
import { loadData, saveData, defaultState } from '../utils/storage';
import { logAction } from '../utils/logger';
import * as FormulaEngine from '../utils/formulaEngine';

interface AppContextType {
  state: AppState;
  updateProfile: (profile: UserProfile) => void;
  addDailyEntry: (entry: DailyEntry) => void;
  updateDailyEntry: (entry: DailyEntry) => void;
  deleteDailyEntry: (id: string) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleHabit: (habitId: string, date: string) => void;
  addHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  addCourse: (course: Course) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  toggleDarkMode: () => void;
  resetData: () => void;
  importState: (newState: AppState) => void;
  // Career Methods
  updateCareerProfile: (profile: CareerProfile) => void;
  addSkill: (skill: Skill) => void;
  updateSkill: (skill: Skill) => void;
  deleteSkill: (id: string) => void;
  addCertification: (cert: Certification) => void;
  updateCertification: (cert: Certification) => void;
  deleteCertification: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  addExperience: (exp: Experience) => void;
  updateExperience: (exp: Experience) => void;
  deleteExperience: (id: string) => void;
  addCareerRoadmap: (roadmap: CareerRoadmap) => void;
  updateCareerRoadmap: (roadmap: CareerRoadmap) => void;
  deleteCareerRoadmap: (id: string) => void;
  addCareerTask: (task: CareerTask) => void;
  updateCareerTask: (task: CareerTask) => void;
  deleteCareerTask: (id: string) => void;
  addCareerGoal: (goal: CareerGoal) => void;
  updateCareerGoal: (goal: CareerGoal) => void;
  deleteCareerGoal: (id: string) => void;
  addLearningSession: (session: LearningSession) => void;
  deleteLearningSession: (id: string) => void;
  // Formula Engine Methods
  updateNutrition: (data: Partial<NutritionData>) => void;
  updateHealthMetrics: (metrics: Partial<HealthMetrics>) => void;
  addCustomFormula: (formula: CustomFormula) => void;
  deleteCustomFormula: (id: string) => void;
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

  const updateProfile = (profile: UserProfile) => {
    setState((prev) => ({ ...prev, userProfile: profile }));
  };

  const addDailyEntry = (entry: DailyEntry) => {
    setState((prev) => ({ ...prev, dailyData: [...prev.dailyData, entry] }));
  };

  const updateDailyEntry = (entry: DailyEntry) => {
    setState((prev) => ({
      ...prev,
      dailyData: prev.dailyData.map((e) => (e.id === entry.id ? entry : e))
    }));
  };

  const deleteDailyEntry = (id: string) => {
    setState((prev) => ({
      ...prev,
      dailyData: prev.dailyData.filter((e) => e.id !== id)
    }));
  };

  const addTask = (task: Task) => {
    setState((prev) => ({ ...prev, tasks: [...prev.tasks, task] }));
  };

  const updateTask = (task: Task) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === task.id ? task : t))
    }));
  };

  const deleteTask = (id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id)
    }));
  };

  const toggleHabit = (habitId: string, date: string) => {
    setState((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => {
        if (h.id === habitId) {
          const isCompleted = h.completedDates.includes(date);
          const newCompletedDates = isCompleted
            ? h.completedDates.filter((d) => d !== date)
            : [...h.completedDates, date];
          
          // Simple streak calculation (consecutive days including today)
          let streak = 0;
          const sortedDates = [...newCompletedDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
          if (sortedDates.length > 0) {
            const today = new Date().toISOString().split('T')[0];
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            
            if (sortedDates[0] === today || sortedDates[0] === yesterday) {
              streak = 1;
              for (let i = 0; i < sortedDates.length - 1; i++) {
                const current = new Date(sortedDates[i]);
                const next = new Date(sortedDates[i+1]);
                const diff = (current.getTime() - next.getTime()) / 86400000;
                if (diff === 1) {
                  streak++;
                } else {
                  break;
                }
              }
            }
          }

          return {
            ...h,
            completedDates: newCompletedDates,
            streak
          };
        }
        return h;
      })
    }));
  };

  const addHabit = (habit: Habit) => {
    setState((prev) => ({ ...prev, habits: [...prev.habits, habit] }));
  };

  const deleteHabit = (id: string) => {
    setState((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== id)
    }));
  };

  const addCourse = (course: Course) => {
    setState((prev) => ({ ...prev, education: [...prev.education, course] }));
  };

  const updateCourse = (course: Course) => {
    setState((prev) => ({
      ...prev,
      education: prev.education.map((c) => (c.id === course.id ? course : c))
    }));
  };

  const deleteCourse = (id: string) => {
    setState((prev) => ({
      ...prev,
      education: prev.education.filter((c) => c.id !== id)
    }));
  };

  const addGoal = (goal: Goal) => {
    setState((prev) => ({ ...prev, goals: [...prev.goals, goal] }));
  };

  const updateGoal = (goal: Goal) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === goal.id ? goal : g))
    }));
  };

  const deleteGoal = (id: string) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== id)
    }));
  };

  const toggleDarkMode = () => {
    setState((prev) => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  };

  const resetData = () => {
    setState(defaultState);
  };

  const importState = (newState: AppState) => {
    // Ensure the imported state is valid and has all required arrays
    const validatedState: AppState = {
      ...defaultState,
      ...newState,
      userProfile: { ...defaultState.userProfile, ...(newState.userProfile || {}) },
      dailyData: Array.isArray(newState.dailyData) ? newState.dailyData : defaultState.dailyData,
      tasks: Array.isArray(newState.tasks) ? newState.tasks : defaultState.tasks,
      habits: Array.isArray(newState.habits) ? newState.habits : defaultState.habits,
      education: Array.isArray(newState.education) ? newState.education : defaultState.education,
      goals: Array.isArray(newState.goals) ? newState.goals : defaultState.goals,
      activityLog: newState.activityLog || defaultState.activityLog,
      // Career Module
      careerProfile: { ...defaultState.careerProfile, ...(newState.careerProfile || {}) },
      skills: Array.isArray(newState.skills) ? newState.skills : defaultState.skills,
      certifications: Array.isArray(newState.certifications) ? newState.certifications : defaultState.certifications,
      projects: Array.isArray(newState.projects) ? newState.projects : defaultState.projects,
      experience: Array.isArray(newState.experience) ? newState.experience : defaultState.experience,
      careerRoadmaps: Array.isArray(newState.careerRoadmaps) ? newState.careerRoadmaps : defaultState.careerRoadmaps,
      careerTasks: Array.isArray(newState.careerTasks) ? newState.careerTasks : defaultState.careerTasks,
      careerGoals: Array.isArray(newState.careerGoals) ? newState.careerGoals : defaultState.careerGoals,
      learningSessions: Array.isArray(newState.learningSessions) ? newState.learningSessions : defaultState.learningSessions,
    };
    setState(validatedState);
  };

  // Career Methods Implementation
  const updateCareerProfile = (profile: CareerProfile) => {
    setState(prev => {
      logAction('UPDATE_CAREER_PROFILE', 'Career', { profile }, prev.careerProfile, profile);
      return { ...prev, careerProfile: profile };
    });
  };

  const addSkill = (skill: Skill) => {
    setState(prev => {
      logAction('ADD_SKILL', 'Career', { skill });
      return { ...prev, skills: [...prev.skills, skill] };
    });
  };

  const updateSkill = (skill: Skill) => {
    setState(prev => {
      const oldSkill = prev.skills.find(s => s.id === skill.id);
      logAction('UPDATE_SKILL', 'Career', { skill }, oldSkill, skill);
      return { ...prev, skills: prev.skills.map(s => s.id === skill.id ? skill : s) };
    });
  };

  const deleteSkill = (id: string) => {
    setState(prev => {
      logAction('DELETE_SKILL', 'Career', { id });
      return { ...prev, skills: prev.skills.filter(s => s.id !== id) };
    });
  };

  const addCertification = (cert: Certification) => {
    setState(prev => {
      logAction('ADD_CERTIFICATION', 'Career', { cert });
      return { ...prev, certifications: [...prev.certifications, cert] };
    });
  };

  const updateCertification = (cert: Certification) => {
    setState(prev => {
      const oldCert = prev.certifications.find(c => c.id === cert.id);
      logAction('UPDATE_CERTIFICATION', 'Career', { cert }, oldCert, cert);
      return { ...prev, certifications: prev.certifications.map(c => c.id === cert.id ? cert : c) };
    });
  };

  const deleteCertification = (id: string) => {
    setState(prev => {
      logAction('DELETE_CERTIFICATION', 'Career', { id });
      return { ...prev, certifications: prev.certifications.filter(c => c.id !== id) };
    });
  };

  const addProject = (project: Project) => {
    setState(prev => {
      logAction('ADD_PROJECT', 'Career', { project });
      return { ...prev, projects: [...prev.projects, project] };
    });
  };

  const updateProject = (project: Project) => {
    setState(prev => {
      const oldProject = prev.projects.find(p => p.id === project.id);
      logAction('UPDATE_PROJECT', 'Career', { project }, oldProject, project);
      return { ...prev, projects: prev.projects.map(p => p.id === project.id ? project : p) };
    });
  };

  const deleteProject = (id: string) => {
    setState(prev => {
      logAction('DELETE_PROJECT', 'Career', { id });
      return { ...prev, projects: prev.projects.filter(p => p.id !== id) };
    });
  };

  const addExperience = (exp: Experience) => {
    setState(prev => {
      logAction('ADD_EXPERIENCE', 'Career', { exp });
      return { ...prev, experience: [...prev.experience, exp] };
    });
  };

  const updateExperience = (exp: Experience) => {
    setState(prev => {
      const oldExp = prev.experience.find(e => e.id === exp.id);
      logAction('UPDATE_EXPERIENCE', 'Career', { exp }, oldExp, exp);
      return { ...prev, experience: prev.experience.map(e => e.id === exp.id ? exp : e) };
    });
  };

  const deleteExperience = (id: string) => {
    setState(prev => {
      logAction('DELETE_EXPERIENCE', 'Career', { id });
      return { ...prev, experience: prev.experience.filter(e => e.id !== id) };
    });
  };

  const addCareerRoadmap = (roadmap: CareerRoadmap) => {
    setState(prev => {
      logAction('ADD_ROADMAP', 'Career', { roadmap });
      return { ...prev, careerRoadmaps: [...prev.careerRoadmaps, roadmap] };
    });
  };

  const updateCareerRoadmap = (roadmap: CareerRoadmap) => {
    setState(prev => {
      const oldRoadmap = prev.careerRoadmaps.find(r => r.id === roadmap.id);
      logAction('UPDATE_ROADMAP', 'Career', { roadmap }, oldRoadmap, roadmap);
      return { ...prev, careerRoadmaps: prev.careerRoadmaps.map(r => r.id === roadmap.id ? roadmap : r) };
    });
  };

  const deleteCareerRoadmap = (id: string) => {
    setState(prev => {
      logAction('DELETE_ROADMAP', 'Career', { id });
      return { ...prev, careerRoadmaps: prev.careerRoadmaps.filter(r => r.id !== id) };
    });
  };

  const addCareerTask = (task: CareerTask) => {
    setState(prev => {
      logAction('ADD_CAREER_TASK', 'Career', { task });
      return { ...prev, careerTasks: [...prev.careerTasks, task] };
    });
  };

  const updateCareerTask = (task: CareerTask) => {
    setState(prev => {
      const oldTask = prev.careerTasks.find(t => t.id === task.id);
      logAction('UPDATE_CAREER_TASK', 'Career', { task }, oldTask, task);
      return { ...prev, careerTasks: prev.careerTasks.map(t => t.id === task.id ? task : t) };
    });
  };

  const deleteCareerTask = (id: string) => {
    setState(prev => {
      logAction('DELETE_CAREER_TASK', 'Career', { id });
      return { ...prev, careerTasks: prev.careerTasks.filter(t => t.id !== id) };
    });
  };

  const addCareerGoal = (goal: CareerGoal) => {
    setState(prev => {
      logAction('ADD_CAREER_GOAL', 'Career', { goal });
      return { ...prev, careerGoals: [...prev.careerGoals, goal] };
    });
  };

  const updateCareerGoal = (goal: CareerGoal) => {
    setState(prev => {
      const oldGoal = prev.careerGoals.find(g => g.id === goal.id);
      logAction('UPDATE_CAREER_GOAL', 'Career', { goal }, oldGoal, goal);
      return { ...prev, careerGoals: prev.careerGoals.map(g => g.id === goal.id ? goal : g) };
    });
  };

  const deleteCareerGoal = (id: string) => {
    setState(prev => {
      logAction('DELETE_CAREER_GOAL', 'Career', { id });
      return { ...prev, careerGoals: prev.careerGoals.filter(g => g.id !== id) };
    });
  };

  const addLearningSession = (session: LearningSession) => {
    setState(prev => {
      logAction('START_SESSION', 'Career', { session });
      return { ...prev, learningSessions: [...prev.learningSessions, session] };
    });
  };

  const deleteLearningSession = (id: string) => {
    setState(prev => {
      logAction('DELETE_SESSION', 'Career', { id });
      return { ...prev, learningSessions: prev.learningSessions.filter(s => s.id !== id) };
    });
  };

  // Formula Engine Implementation
  const updateNutrition = (data: Partial<NutritionData>) => {
    setState(prev => {
      const newNutrition = { ...prev.nutritionData, ...data };
      // Auto-calculate dependent values
      const calculated = FormulaEngine.calculateNutrition(newNutrition.rice_g, newNutrition.wheat_g);
      const finalNutrition = { ...newNutrition, ...calculated };
      
      logAction('UPDATE_NUTRITION', 'Health', { data: finalNutrition });
      return { ...prev, nutritionData: finalNutrition };
    });
  };

  const updateHealthMetrics = (metrics: Partial<HealthMetrics>) => {
    setState(prev => {
      const newMetrics = { ...prev.healthMetrics, ...metrics };
      
      // Auto-calculate all dependent metrics
      const caloriesBurnedFromExercise = FormulaEngine.calculateExerciseBurn(
        newMetrics.exerciseType, 
        newMetrics.currentWeight, 
        newMetrics.exerciseDuration
      );
      const caloriesBurnedFromSteps = FormulaEngine.calculateStepBurn(newMetrics.steps);
      const totalBurned = caloriesBurnedFromExercise + caloriesBurnedFromSteps;
      
      const sleepScore = FormulaEngine.calculateSleepScore(newMetrics.sleepHours);
      const waterProgress = FormulaEngine.calculateWaterProgress(newMetrics.waterIntake, newMetrics.currentWeight);
      const weightProgress = FormulaEngine.calculateWeightProgress(
        prev.userProfile.startingWeight, 
        newMetrics.currentWeight, 
        prev.userProfile.targetWeight
      );
      const calorieBalance = prev.nutritionData.totalCalories - totalBurned;

      const finalMetrics: HealthMetrics = {
        ...newMetrics,
        caloriesBurned: totalBurned,
        sleepScore,
        waterProgress,
        weightProgress,
        calorieBalance
      };

      logAction('UPDATE_HEALTH_METRICS', 'Health', { metrics: finalMetrics });
      return { ...prev, healthMetrics: finalMetrics };
    });
  };

  const addCustomFormula = (formula: CustomFormula) => {
    setState(prev => ({
      ...prev,
      formulaConfig: {
        ...prev.formulaConfig,
        customFormulas: [...prev.formulaConfig.customFormulas, formula]
      }
    }));
  };

  const deleteCustomFormula = (id: string) => {
    setState(prev => ({
      ...prev,
      formulaConfig: {
        ...prev.formulaConfig,
        customFormulas: prev.formulaConfig.customFormulas.filter(f => f.id !== id)
      }
    }));
  };

  return (
    <AppContext.Provider
      value={{
        state,
        updateProfile,
        addDailyEntry,
        updateDailyEntry,
        deleteDailyEntry,
        addTask,
        updateTask,
        deleteTask,
        toggleHabit,
        addHabit,
        deleteHabit,
        addCourse,
        updateCourse,
        deleteCourse,
        addGoal,
        updateGoal,
        deleteGoal,
        toggleDarkMode,
        resetData,
        importState,
        // Career
        updateCareerProfile,
        addSkill,
        updateSkill,
        deleteSkill,
        addCertification,
        updateCertification,
        deleteCertification,
        addProject,
        updateProject,
        deleteProject,
        addExperience,
        updateExperience,
        deleteExperience,
        addCareerRoadmap,
        updateCareerRoadmap,
        deleteCareerRoadmap,
        addCareerTask,
        updateCareerTask,
        deleteCareerTask,
        addCareerGoal,
        updateCareerGoal,
        deleteCareerGoal,
        addLearningSession,
        deleteLearningSession,
        // Formula Engine
        updateNutrition,
        updateHealthMetrics,
        addCustomFormula,
        deleteCustomFormula,
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
