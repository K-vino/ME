import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FolderGit2, Play, CheckCircle2, Clock, Plus, X, Trash2 } from 'lucide-react';
import { Project } from '../types';

export const Projects: React.FC = () => {
  const { state, updateProject, deleteProject } = useAppContext();
  const { projects } = state;
  const [isAdding, setIsAdding] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectTech, setNewProjectTech] = useState('');
  const [newProjectStatus, setNewProjectStatus] = useState<'Planning' | 'In Progress' | 'Completed'>('Planning');
  const [newProjectProgress, setNewProjectProgress] = useState(0);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName,
      description: newProjectDesc,
      techStack: newProjectTech.split(',').map(s => s.trim()).filter(s => s),
      status: newProjectStatus,
      completionPercentage: newProjectProgress,
    };

    updateProject(newProject);
    setNewProjectName('');
    setNewProjectDesc('');
    setNewProjectTech('');
    setNewProjectStatus('Planning');
    setNewProjectProgress(0);
    setIsAdding(false);
  };

  const handleDeleteProject = (id: string) => {
    deleteProject(id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
      case 'In Progress': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20';
      case 'Planning': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
      default: return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 className="w-4 h-4 mr-1.5" />;
      case 'In Progress': return <Play className="w-4 h-4 mr-1.5" />;
      case 'Planning': return <Clock className="w-4 h-4 mr-1.5" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Projects</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Track your career projects and portfolio.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm flex items-center"
        >
          <FolderGit2 className="w-4 h-4 mr-2" />
          Add Project
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Add New Project</h3>
            <button onClick={() => setIsAdding(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleAddProject} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Project Name</label>
                <input 
                  type="text" 
                  value={newProjectName} 
                  onChange={e => setNewProjectName(e.target.value)} 
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Status</label>
                <select 
                  value={newProjectStatus} 
                  onChange={e => setNewProjectStatus(e.target.value as any)} 
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
                <textarea 
                  value={newProjectDesc} 
                  onChange={e => setNewProjectDesc(e.target.value)} 
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" 
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Tech Stack (comma separated)</label>
                <input 
                  type="text" 
                  value={newProjectTech} 
                  onChange={e => setNewProjectTech(e.target.value)} 
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" 
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Completion Percentage (%)</label>
                <input 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={newProjectProgress} 
                  onChange={e => setNewProjectProgress(Number(e.target.value))} 
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" 
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                <Plus className="w-4 h-4 mr-1" /> Save Project
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col h-full group relative">
            <button 
              onClick={() => handleDeleteProject(project.id)}
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all z-10"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="flex justify-between items-start mb-4 pr-8">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center ${getStatusColor(project.status)}`}>
                {getStatusIcon(project.status)}
                {project.status}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{project.name}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 flex-1">{project.description}</p>
            
            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-zinc-600 dark:text-zinc-400">Progress</span>
                  <span className="text-zinc-900 dark:text-white">{project.completionPercentage}%</span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5">
                  <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${project.completionPercentage}%` }}></div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                {project.techStack.map((tech, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs rounded-md font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
