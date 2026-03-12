import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/UI';
import { Plus, Trash2, Edit2, BookOpen, Clock, CheckCircle } from 'lucide-react';
import { Course } from '../types';

export const Learning: React.FC = () => {
  const { state, addCourse, updateCourse, deleteCourse } = useAppContext();
  const { education } = state;

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Course>>({
    name: '',
    platform: '',
    status: 'In Progress',
    progress: 0,
    totalHours: 0,
    completedHours: 0,
    startDate: new Date().toISOString().split('T')[0],
    certificateUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateCourse({ ...formData, id: editingId } as Course);
      setEditingId(null);
    } else {
      addCourse({ ...formData, id: Date.now().toString() } as Course);
      setIsAdding(false);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      platform: '',
      status: 'In Progress',
      progress: 0,
      totalHours: 0,
      completedHours: 0,
      startDate: new Date().toISOString().split('T')[0],
      certificateUrl: ''
    });
  };

  const handleEdit = (course: Course) => {
    setFormData(course);
    setEditingId(course.id);
    setIsAdding(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Learning Tracker</h1>
        <button
          onClick={() => { setIsAdding(true); setEditingId(null); resetForm(); }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          Add Course
        </button>
      </div>

      {isAdding && (
        <Card title={editingId ? "Edit Course" : "New Course"}>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Course Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Platform</label>
              <input
                type="text"
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
              >
                <option>In Progress</option>
                <option>Completed</option>
                <option>Planned</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Progress (%)</label>
              <input
                type="number"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Total Hours</label>
              <input
                type="number"
                value={formData.totalHours}
                onChange={(e) => setFormData({ ...formData, totalHours: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Completed Hours</label>
              <input
                type="number"
                value={formData.completedHours}
                onChange={(e) => setFormData({ ...formData, completedHours: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setIsAdding(false); setEditingId(null); }}
                className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
              >
                {editingId ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {education.map((course) => (
          <Card key={course.id}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{course.name}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{course.platform}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(course)} className="p-1 text-zinc-400 hover:text-indigo-600 transition-colors">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => deleteCourse(course.id)} className="p-1 text-zinc-400 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">Progress</span>
                <span className="font-bold text-zinc-900 dark:text-white">{course.progress}%</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${course.progress}%` }}
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
                    <Clock size={16} />
                    <span>{course.completedHours} / {course.totalHours}h</span>
                  </div>
                  {course.status === 'Completed' && (
                    <div className="flex items-center gap-1 text-sm text-emerald-500 font-medium">
                      <CheckCircle size={16} />
                      <span>Completed</span>
                    </div>
                  )}
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg uppercase tracking-wider ${
                  course.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                  course.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                  'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                }`}>
                  {course.status}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
