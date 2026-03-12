import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, ProgressBar } from '../components/UI';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import { Education } from '../types';

export const Learning: React.FC = () => {
  const { state, addEducation, deleteEducation, updateEducation } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Education>>({
    courseName: '',
    topic: '',
    studyHours: 0,
    completionPercentage: 0,
    notes: ''
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.courseName) return;

    addEducation({
      id: Date.now().toString(),
      courseName: formData.courseName,
      topic: formData.topic || '',
      studyHours: formData.studyHours || 0,
      completionPercentage: formData.completionPercentage || 0,
      notes: formData.notes || ''
    });
    
    setFormData({ courseName: '', topic: '', studyHours: 0, completionPercentage: 0, notes: '' });
    setIsAdding(false);
  };

  const totalStudyHours = state.education.reduce((acc, curr) => acc + curr.studyHours, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Learning</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Track your courses and study hours.</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-1" /> Add Course
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 bg-indigo-600 dark:bg-indigo-500 text-white border-none">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-indigo-100">Total Study Hours</h3>
            <div className="p-2 bg-white/20 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-4xl font-bold">{totalStudyHours}</span>
            <span className="text-indigo-100 ml-2">hrs</span>
          </div>
        </Card>

        <div className="md:col-span-2 space-y-6">
          {isAdding && (
            <Card>
              <h3 className="text-lg font-semibold mb-4">Add New Course</h3>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Course Name</label>
                    <input type="text" required value={formData.courseName} onChange={e => setFormData({...formData, courseName: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Topic</label>
                    <input type="text" value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Study Hours</label>
                    <input type="number" value={formData.studyHours} onChange={e => setFormData({...formData, studyHours: Number(e.target.value)})} className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Completion %</label>
                    <input type="number" min="0" max="100" value={formData.completionPercentage} onChange={e => setFormData({...formData, completionPercentage: Number(e.target.value)})} className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Notes</label>
                    <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" rows={2}></textarea>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Save Course</button>
                </div>
              </form>
            </Card>
          )}

          <div className="space-y-4">
            {state.education.map(course => (
              <Card key={course.id} className="group relative">
                <button onClick={() => deleteEducation(course.id)} className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{course.courseName}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{course.topic}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Study Hours</p>
                    <p className="font-semibold text-zinc-900 dark:text-white">{course.studyHours} hrs</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Completion</p>
                    <p className="font-semibold text-zinc-900 dark:text-white">{course.completionPercentage}%</p>
                  </div>
                </div>
                <ProgressBar progress={course.completionPercentage} colorClass="bg-blue-500" />
                {course.notes && (
                  <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg">
                    {course.notes}
                  </p>
                )}
              </Card>
            ))}
            {state.education.length === 0 && !isAdding && (
              <div className="text-center py-12 text-zinc-500 dark:text-zinc-400 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                No courses tracked yet. Add one to get started!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
