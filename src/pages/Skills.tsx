import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Code2, TrendingUp, Clock, Plus, X, Trash2 } from 'lucide-react';
import { Skill } from '../types';

export const Skills: React.FC = () => {
  const { state, addSkill, deleteSkill } = useAppContext();
  const { skills } = state;
  const [isAdding, setIsAdding] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProgress, setNewSkillProgress] = useState(0);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newSkill: Skill = {
      id: Date.now().toString(),
      name: newSkillName,
      progress: newSkillProgress,
      learningHours: 0,
      weeklyImprovement: 0,
    };

    addSkill(newSkill);
    setNewSkillName('');
    setNewSkillProgress(0);
    setIsAdding(false);
  };

  const handleDeleteSkill = (id: string) => {
    deleteSkill(id);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Skills Tracker</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Monitor your technical proficiency and learning progress.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm flex items-center"
        >
          <Code2 className="w-4 h-4 mr-2" />
          Add Skill
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Add New Skill</h3>
            <button onClick={() => setIsAdding(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleAddSkill} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Skill Name</label>
              <input 
                type="text" 
                value={newSkillName} 
                onChange={e => setNewSkillName(e.target.value)} 
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" 
                placeholder="e.g., React, Python, AWS"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Initial Proficiency (%)</label>
              <input 
                type="number" 
                min="0" 
                max="100" 
                value={newSkillProgress} 
                onChange={e => setNewSkillProgress(Number(e.target.value))} 
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" 
                required
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                <Plus className="w-4 h-4 mr-1" /> Save Skill
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map(skill => (
          <div key={skill.id} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm group relative">
            <button 
              onClick={() => handleDeleteSkill(skill.id)}
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="flex justify-between items-center mb-4 pr-8">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{skill.name}</h3>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{skill.progress}%</div>
            </div>
            
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 mb-6">
              <div className="bg-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${skill.progress}%` }}></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3 border border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center text-zinc-500 dark:text-zinc-400 text-xs font-medium mb-1">
                  <Clock className="w-3.5 h-3.5 mr-1" /> Learning Hours
                </div>
                <div className="text-lg font-bold text-zinc-900 dark:text-white">{skill.learningHours}h</div>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3 border border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center text-zinc-500 dark:text-zinc-400 text-xs font-medium mb-1">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" /> Weekly Imp.
                </div>
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">+{skill.weeklyImprovement}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
