import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/UI';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { DailyEntry } from '../types';
import { calculateTargetWeight, getDayNumber } from '../utils/weightEngine';

export const Tracker: React.FC = () => {
  const { state, addDailyEntry, updateDailyEntry, deleteDailyEntry } = useAppContext();
  const { dailyData, userProfile } = state;

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<DailyEntry>>({
    date: new Date().toISOString().split('T')[0],
    actualWeight: 0,
    steps: 0,
    caloriesConsumed: 0,
    caloriesBurned: 0,
    waterIntake: 0,
    sleepHours: 0,
    exerciseType: '',
    exerciseDuration: 0,
    studyHours: 0,
    mood: 'Neutral',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'date' || name === 'exerciseType' || name === 'mood' || name === 'notes' ? value : Number(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dayNumber = getDayNumber(userProfile.startDate, formData.date!);
    const targetWeight = calculateTargetWeight(userProfile.startingWeight, userProfile.targetWeight, userProfile.goalDuration, dayNumber);

    if (editingId) {
      updateDailyEntry({ ...formData, id: editingId, dayNumber, targetWeight } as DailyEntry);
      setEditingId(null);
    } else {
      addDailyEntry({ ...formData, id: Date.now().toString(), dayNumber, targetWeight } as DailyEntry);
      setIsAdding(false);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      actualWeight: 0,
      steps: 0,
      caloriesConsumed: 0,
      caloriesBurned: 0,
      waterIntake: 0,
      sleepHours: 0,
      exerciseType: '',
      exerciseDuration: 0,
      studyHours: 0,
      mood: 'Neutral',
      notes: ''
    });
  };

  const handleEdit = (entry: DailyEntry) => {
    setFormData(entry);
    setEditingId(entry.id);
    setIsAdding(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Daily Tracker</h1>
        <button
          onClick={() => { setIsAdding(true); setEditingId(null); resetForm(); }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          Add Entry
        </button>
      </div>

      {isAdding && (
        <Card title={editingId ? "Edit Entry" : "New Daily Entry"}>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Actual Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                name="actualWeight"
                value={formData.actualWeight}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Steps</label>
              <input
                type="number"
                name="steps"
                value={formData.steps}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Calories Consumed</label>
              <input
                type="number"
                name="caloriesConsumed"
                value={formData.caloriesConsumed}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Calories Burned</label>
              <input
                type="number"
                name="caloriesBurned"
                value={formData.caloriesBurned}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Water Intake (L)</label>
              <input
                type="number"
                step="0.1"
                name="waterIntake"
                value={formData.waterIntake}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Sleep Hours</label>
              <input
                type="number"
                step="0.5"
                name="sleepHours"
                value={formData.sleepHours}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Exercise Type</label>
              <input
                type="text"
                name="exerciseType"
                value={formData.exerciseType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Exercise Duration (min)</label>
              <input
                type="number"
                name="exerciseDuration"
                value={formData.exerciseDuration}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Study Hours</label>
              <input
                type="number"
                step="0.5"
                name="studyHours"
                value={formData.studyHours}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Mood</label>
              <select
                name="mood"
                value={formData.mood}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
              >
                <option>Great</option>
                <option>Good</option>
                <option>Neutral</option>
                <option>Bad</option>
                <option>Terrible</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white h-24"
              />
            </div>
            <div className="md:col-span-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setIsAdding(false); setEditingId(null); }}
                className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                {editingId ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </Card>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="py-3 px-4 text-sm font-semibold text-zinc-600 dark:text-zinc-400">Day</th>
              <th className="py-3 px-4 text-sm font-semibold text-zinc-600 dark:text-zinc-400">Date</th>
              <th className="py-3 px-4 text-sm font-semibold text-zinc-600 dark:text-zinc-400">Target</th>
              <th className="py-3 px-4 text-sm font-semibold text-zinc-600 dark:text-zinc-400">Actual</th>
              <th className="py-3 px-4 text-sm font-semibold text-zinc-600 dark:text-zinc-400">Diff</th>
              <th className="py-3 px-4 text-sm font-semibold text-zinc-600 dark:text-zinc-400">Steps</th>
              <th className="py-3 px-4 text-sm font-semibold text-zinc-600 dark:text-zinc-400">Study</th>
              <th className="py-3 px-4 text-sm font-semibold text-zinc-600 dark:text-zinc-400">Mood</th>
              <th className="py-3 px-4 text-sm font-semibold text-zinc-600 dark:text-zinc-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...dailyData].sort((a, b) => b.dayNumber - a.dayNumber).map((entry) => (
              <tr key={entry.id} className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="py-3 px-4 text-sm font-medium text-zinc-900 dark:text-white">{entry.dayNumber}</td>
                <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">{entry.date}</td>
                <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">{entry.targetWeight}kg</td>
                <td className="py-3 px-4 text-sm font-semibold text-zinc-900 dark:text-white">{entry.actualWeight}kg</td>
                <td className={`py-3 px-4 text-sm font-medium ${(entry.actualWeight - entry.targetWeight) > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {(entry.actualWeight - entry.targetWeight).toFixed(2)}kg
                </td>
                <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">{entry.steps.toLocaleString()}</td>
                <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">{entry.studyHours}h</td>
                <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">{entry.mood}</td>
                <td className="py-3 px-4 text-sm">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(entry)} className="p-1 text-zinc-400 hover:text-indigo-600 transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => deleteDailyEntry(entry.id)} className="p-1 text-zinc-400 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
