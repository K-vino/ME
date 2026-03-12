import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, ProgressBar } from '../components/UI';
import { Plus, Target, Trash2 } from 'lucide-react';
import { Goal } from '../types';
import { format } from 'date-fns';

export const Goals: React.FC = () => {
  const { state, addGoal, deleteGoal, updateGoal } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Goal>>({
    name: '',
    category: 'Personal',
    startDate: new Date().toISOString().split('T')[0],
    targetDate: '',
    progressPercentage: 0
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.targetDate) return;

    addGoal({
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category || 'Personal',
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      targetDate: formData.targetDate,
      progressPercentage: formData.progressPercentage || 0
    });
    
    setFormData({
      name: '',
      category: 'Personal',
      startDate: new Date().toISOString().split('T')[0],
      targetDate: '',
      progressPercentage: 0
    });
    setIsAdding(false);
  };

  const updateProgress = (id: string, newProgress: number) => {
    const goal = state.goals.find(g => g.id === id);
    if (goal) {
      updateGoal({ ...goal, progressPercentage: newProgress });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Goals</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Track your long-term objectives.</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-1" /> Add Goal
          </button>
        )}
      </div>

      {isAdding && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Add New Goal</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Goal Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                  <option value="Health">Health</option>
                  <option value="Career">Career</option>
                  <option value="Financial">Financial</option>
                  <option value="Personal">Personal</option>
                  <option value="Learning">Learning</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Target Date</label>
                <input type="date" required value={formData.targetDate} onChange={e => setFormData({...formData, targetDate: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Save Goal</button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {state.goals.map(goal => (
          <Card key={goal.id} className="group relative flex flex-col">
            <button onClick={() => deleteGoal(goal.id)} className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{goal.name}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{goal.category}</p>
              </div>
            </div>
            
            <div className="flex justify-between text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              <span>Start: {format(new Date(goal.startDate), 'MMM d, yyyy')}</span>
              <span>Target: {format(new Date(goal.targetDate), 'MMM d, yyyy')}</span>
            </div>

            <div className="mt-auto">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Progress</span>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{goal.progressPercentage}%</span>
              </div>
              <ProgressBar progress={goal.progressPercentage} />
              <div className="mt-4 flex items-center gap-2">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={goal.progressPercentage} 
                  onChange={(e) => updateProgress(goal.id, Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          </Card>
        ))}
        {state.goals.length === 0 && !isAdding && (
          <div className="col-span-full text-center py-12 text-zinc-500 dark:text-zinc-400 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
            No goals set yet. Aim high and add one!
          </div>
        )}
      </div>
    </div>
  );
};
