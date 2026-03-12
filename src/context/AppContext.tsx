import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { AppState, UserProfile, ResumeData, Skill, Project, Task, RoadmapPhase, Session, SessionAction } from '../types';
import { loadData, saveData, defaultState } from '../utils/storage';
import { logAction } from '../utils/logger';

interface AppContextType {
  state: AppState;
  currentSessionId: string | null;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  updateResumeData: (data: Partial<ResumeData>) => void;
  deleteResumeItem: (type: keyof ResumeData, id: string) => void;
  addSkill: (skill: Skill) => void;
  updateSkill: (skill: Skill) => void;
  deleteSkill: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  addRoadmapPhase: (phase: RoadmapPhase) => void;
  updateRoadmapPhase: (phase: RoadmapPhase) => void;
  deleteRoadmapPhase: (id: string) => void;
  toggleDarkMode: () => void;
  resetData: () => void;
  importState: (newState: AppState) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(loadData());
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setCurrentSessionId(newSessionId);
      
      const newSession: Session = {
        sessionId: newSessionId,
        startTime: new Date().toISOString(),
        endTime: null,
        actions: []
      };

      setState(prev => ({
        ...prev,
        sessions: [...prev.sessions, newSession]
      }));
      
      logAction('SESSION_STARTED', 'System', { sessionId: newSessionId }, null, null, state.userProfile.name);
      isInitialized.current = true;
    }

    const handleBeforeUnload = () => {
      if (currentSessionId) {
        setState(prev => ({
          ...prev,
          sessions: prev.sessions.map(s => 
            s.sessionId === currentSessionId ? { ...s, endTime: new Date().toISOString() } : s
          )
        }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    saveData(state);
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  const logToSession = (actionName: string, details: any) => {
    if (!currentSessionId) return;
    
    const action: SessionAction = {
      timestamp: new Date().toISOString(),
      action: actionName,
      details
    };

    setState(prev => ({
      ...prev,
      sessions: prev.sessions.map(s => 
        s.sessionId === currentSessionId ? { ...s, actions: [...s.actions, action] } : s
      )
    }));
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    logAction('UPDATE_PROFILE', 'Settings', { updatedFields: Object.keys(profile) }, state.userProfile, { ...state.userProfile, ...profile }, state.userProfile.name);
    logToSession('UPDATE_PROFILE', { updatedFields: Object.keys(profile) });
    setState((prev) => ({ ...prev, userProfile: { ...prev.userProfile, ...profile } }));
  };

  const updateResumeData = (data: Partial<ResumeData>) => {
    logAction('UPDATE_RESUME', 'Resume', { updatedFields: Object.keys(data) }, state.resumeData, { ...state.resumeData, ...data }, state.userProfile.name);
    logToSession('UPDATE_RESUME', { updatedFields: Object.keys(data) });
    setState((prev) => ({ ...prev, resumeData: { ...prev.resumeData, ...data } }));
  };

  const deleteResumeItem = (type: keyof ResumeData, id: string) => {
    const beforeState = state.resumeData[type].find((item: any) => item.id === id);
    logAction('DELETE_RESUME_ITEM', 'Resume', { type, itemId: id, title: beforeState?.title }, beforeState, null, state.userProfile.name);
    logToSession('DELETE_RESUME_ITEM', { type, itemId: id, title: beforeState?.title });
    setState((prev) => ({
      ...prev,
      resumeData: {
        ...prev.resumeData,
        [type]: prev.resumeData[type].filter((item: any) => item.id !== id)
      }
    }));
  };

  const addSkill = (skill: Skill) => {
    logAction('ADD_SKILL', 'Skills', { skillId: skill.id, name: skill.name }, null, skill, state.userProfile.name);
    logToSession('ADD_SKILL', { skillId: skill.id, name: skill.name });
    setState((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
  };

  const updateSkill = (skill: Skill) => {
    const beforeState = state.skills.find(s => s.id === skill.id);
    logAction('UPDATE_SKILL', 'Skills', { skillId: skill.id, name: skill.name }, beforeState, skill, state.userProfile.name);
    logToSession('UPDATE_SKILL', { skillId: skill.id, name: skill.name });
    setState((prev) => ({ ...prev, skills: prev.skills.map((s) => (s.id === skill.id ? skill : s)) }));
  };

  const deleteSkill = (id: string) => {
    const beforeState = state.skills.find(s => s.id === id);
    logAction('DELETE_SKILL', 'Skills', { skillId: id, name: beforeState?.name }, beforeState, null, state.userProfile.name);
    logToSession('DELETE_SKILL', { skillId: id, name: beforeState?.name });
    setState((prev) => ({ ...prev, skills: prev.skills.filter((s) => s.id !== id) }));
  };

  const addProject = (project: Project) => {
    logAction('ADD_PROJECT', 'Projects', { projectId: project.id, name: project.name }, null, project, state.userProfile.name);
    logToSession('ADD_PROJECT', { projectId: project.id, name: project.name });
    setState((prev) => ({ ...prev, projects: [...prev.projects, project] }));
  };

  const updateProject = (project: Project) => {
    const beforeState = state.projects.find(p => p.id === project.id);
    logAction('UPDATE_PROJECT', 'Projects', { projectId: project.id, name: project.name }, beforeState, project, state.userProfile.name);
    logToSession('UPDATE_PROJECT', { projectId: project.id, name: project.name });
    setState((prev) => ({ ...prev, projects: prev.projects.map((p) => (p.id === project.id ? project : p)) }));
  };

  const deleteProject = (id: string) => {
    const beforeState = state.projects.find(p => p.id === id);
    logAction('DELETE_PROJECT', 'Projects', { projectId: id, name: beforeState?.name }, beforeState, null, state.userProfile.name);
    logToSession('DELETE_PROJECT', { projectId: id, name: beforeState?.name });
    setState((prev) => ({ ...prev, projects: prev.projects.filter((p) => p.id !== id) }));
  };

  const addTask = (task: Task) => {
    logAction('ADD_TASK', 'Tasks', { taskId: task.id, title: task.title }, null, task, state.userProfile.name);
    logToSession('ADD_TASK', { taskId: task.id, title: task.title });
    setState((prev) => ({ ...prev, tasks: [...prev.tasks, task] }));
  };
  
  const updateTask = (task: Task) => {
    const beforeState = state.tasks.find(t => t.id === task.id);
    const action = beforeState?.completed !== task.completed ? (task.completed ? 'COMPLETE_TASK' : 'UNCOMPLETE_TASK') : 'UPDATE_TASK';
    logAction(action, 'Tasks', { taskId: task.id, title: task.title }, beforeState, task, state.userProfile.name);
    logToSession(action, { taskId: task.id, title: task.title });
    setState((prev) => ({ ...prev, tasks: prev.tasks.map((t) => (t.id === task.id ? task : t)) }));
  };
  
  const deleteTask = (id: string) => {
    const beforeState = state.tasks.find(t => t.id === id);
    logAction('DELETE_TASK', 'Tasks', { taskId: id, title: beforeState?.title }, beforeState, null, state.userProfile.name);
    logToSession('DELETE_TASK', { taskId: id, title: beforeState?.title });
    setState((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== id) }));
  };

  const addRoadmapPhase = (phase: RoadmapPhase) => {
    logAction('ADD_ROADMAP_PHASE', 'Roadmap', { phaseId: phase.id, title: phase.title }, null, phase, state.userProfile.name);
    logToSession('ADD_ROADMAP_PHASE', { phaseId: phase.id, title: phase.title });
    setState((prev) => ({ ...prev, roadmap: [...prev.roadmap, phase] }));
  };

  const updateRoadmapPhase = (phase: RoadmapPhase) => {
    const beforeState = state.roadmap.find(r => r.id === phase.id);
    logAction('UPDATE_ROADMAP', 'Roadmap', { phaseId: phase.id, title: phase.title }, beforeState, phase, state.userProfile.name);
    logToSession('UPDATE_ROADMAP', { phaseId: phase.id, title: phase.title });
    setState((prev) => ({ ...prev, roadmap: prev.roadmap.map((r) => (r.id === phase.id ? phase : r)) }));
  };

  const deleteRoadmapPhase = (id: string) => {
    const beforeState = state.roadmap.find(r => r.id === id);
    logAction('DELETE_ROADMAP_PHASE', 'Roadmap', { phaseId: id, title: beforeState?.title }, beforeState, null, state.userProfile.name);
    logToSession('DELETE_ROADMAP_PHASE', { phaseId: id, title: beforeState?.title });
    setState((prev) => ({ ...prev, roadmap: prev.roadmap.filter((r) => r.id !== id) }));
  };

  const toggleDarkMode = () => {
    logAction('TOGGLE_DARK_MODE', 'Settings', { isDarkMode: !state.isDarkMode }, { isDarkMode: state.isDarkMode }, { isDarkMode: !state.isDarkMode }, state.userProfile.name);
    logToSession('TOGGLE_DARK_MODE', { isDarkMode: !state.isDarkMode });
    setState((prev) => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  };
  
  const resetData = () => {
    logAction('RESET_DATA', 'Settings', {}, state, defaultState, state.userProfile.name);
    logToSession('RESET_DATA', {});
    setState(defaultState);
  };
  
  const importState = (newState: AppState) => {
    logAction('IMPORT_DATA', 'Settings', {}, state, newState, newState.userProfile.name);
    logToSession('IMPORT_DATA', {});
    setState(newState);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        currentSessionId,
        updateUserProfile,
        updateResumeData,
        deleteResumeItem,
        addSkill,
        updateSkill,
        deleteSkill,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        addRoadmapPhase,
        updateRoadmapPhase,
        deleteRoadmapPhase,
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
