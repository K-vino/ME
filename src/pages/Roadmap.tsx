import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Map as MapIcon, Target, CheckCircle2, Circle, Plus, X, Trash2 } from 'lucide-react';
import { RoadmapPhase, RoadmapTask } from '../types';

export const Roadmap: React.FC = () => {
  const { state, updateRoadmapPhase, addRoadmapPhase, deleteRoadmapPhase } = useAppContext();
  const { roadmap } = state;

  const [isAddingPhase, setIsAddingPhase] = useState(false);
  const [newPhaseTitle, setNewPhaseTitle] = useState('');
  const [newPhaseTimeline, setNewPhaseTimeline] = useState('');
  const [newPhaseGoal, setNewPhaseGoal] = useState('');

  const [addingTaskToPhase, setAddingTaskToPhase] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const toggleTask = (phaseId: string, taskId: string) => {
    const phase = roadmap.find(r => r.id === phaseId);
    if (phase) {
      const updatedPhase = {
        ...phase,
        tasks: phase.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
      };
      updateRoadmapPhase(updatedPhase);
    }
  };

  const handleDeletePhase = (phaseId: string) => {
    deleteRoadmapPhase(phaseId);
  };

  const handleDeleteTask = (e: React.MouseEvent, phaseId: string, taskId: string) => {
    e.stopPropagation();
    const phase = roadmap.find(r => r.id === phaseId);
    if (phase) {
      const updatedPhase = {
        ...phase,
        tasks: phase.tasks.filter(t => t.id !== taskId)
      };
      updateRoadmapPhase(updatedPhase);
    }
  };

  const handleAddPhase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhaseTitle.trim()) return;

    const newPhase: RoadmapPhase = {
      id: Date.now().toString(),
      title: newPhaseTitle,
      timeline: newPhaseTimeline,
      goal: newPhaseGoal,
      tasks: [],
    };

    addRoadmapPhase(newPhase);
    setNewPhaseTitle('');
    setNewPhaseTimeline('');
    setNewPhaseGoal('');
    setIsAddingPhase(false);
  };

  const handleAddTask = (e: React.FormEvent, phaseId: string) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const phase = roadmap.find(r => r.id === phaseId);
    if (phase) {
      const newTask: RoadmapTask = {
        id: Date.now().toString(),
        title: newTaskTitle,
        completed: false,
      };
      
      const updatedPhase = {
        ...phase,
        tasks: [...phase.tasks, newTask]
      };
      updateRoadmapPhase(updatedPhase);
      setNewTaskTitle('');
      setAddingTaskToPhase(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Career Roadmap</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Your long-term career progression plan.</p>
        </div>
        <button 
          onClick={() => setIsAddingPhase(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Phase
        </button>
      </div>

      {isAddingPhase && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Add New Phase</h3>
            <button onClick={() => setIsAddingPhase(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleAddPhase} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Phase Title</label>
                <input 
                  type="text" 
                  value={newPhaseTitle} 
                  onChange={e => setNewPhaseTitle(e.target.value)} 
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" 
                  placeholder="e.g., Foundation"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Timeline</label>
                <input 
                  type="text" 
                  value={newPhaseTimeline} 
                  onChange={e => setNewPhaseTimeline(e.target.value)} 
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" 
                  placeholder="e.g., Months 1-3"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Goal</label>
                <input 
                  type="text" 
                  value={newPhaseGoal} 
                  onChange={e => setNewPhaseGoal(e.target.value)} 
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" 
                  placeholder="e.g., Master core technologies"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                <Plus className="w-4 h-4 mr-1" /> Save Phase
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-8 mt-8">
        {roadmap.map((phase, index) => {
          const completedTasks = phase.tasks.filter(t => t.completed).length;
          const totalTasks = phase.tasks.length;
          const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
          
          return (
            <div key={phase.id} className="relative">
              {/* Connecting line */}
              {index !== roadmap.length - 1 && (
                <div className="absolute left-8 top-16 bottom-[-32px] w-0.5 bg-zinc-200 dark:bg-zinc-800"></div>
              )}
              
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm relative z-10 group/phase">
                <button 
                  onClick={() => handleDeletePhase(phase.id)}
                  className="absolute top-4 right-4 opacity-0 group-hover/phase:opacity-100 p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all z-20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pr-8">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center flex-shrink-0 border border-indigo-100 dark:border-indigo-500/20">
                      <MapIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{phase.title}</h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium">
                          {phase.timeline}
                        </span>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400 mt-1 flex items-center text-sm">
                        <Target className="w-4 h-4 mr-1.5 text-indigo-500" /> {phase.goal}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-zinc-900 dark:text-white">{progress}%</div>
                    <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Completed</div>
                  </div>
                </div>

                <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 mb-6">
                  <div className="bg-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="space-y-3">
                  {phase.tasks.map(task => (
                    <div 
                      key={task.id} 
                      className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer group/task ${
                        task.completed 
                          ? 'bg-zinc-50 dark:bg-zinc-800/30 border-zinc-200 dark:border-zinc-800' 
                          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                      }`}
                      onClick={() => toggleTask(phase.id, task.id)}
                    >
                      <div className="flex items-center">
                        <button className="flex-shrink-0 mr-3 focus:outline-none">
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-zinc-300 dark:text-zinc-600" />
                          )}
                        </button>
                        <span className={`text-sm font-medium ${task.completed ? 'text-zinc-500 dark:text-zinc-500 line-through' : 'text-zinc-700 dark:text-zinc-300'}`}>
                          {task.title}
                        </span>
                      </div>
                      <button 
                        onClick={(e) => handleDeleteTask(e, phase.id, task.id)}
                        className="opacity-0 group-hover/task:opacity-100 p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {addingTaskToPhase === phase.id ? (
                    <form onSubmit={(e) => handleAddTask(e, phase.id)} className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="New task title..."
                        className="flex-1 px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm"
                        autoFocus
                      />
                      <button type="submit" className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => setAddingTaskToPhase(null)} className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                        <X className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <button 
                      onClick={() => setAddingTaskToPhase(phase.id)}
                      className="flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mt-2"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Task
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
