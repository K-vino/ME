import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/UI';
import { Save, Download, Upload, Trash2, User } from 'lucide-react';
import { exportData, importData } from '../utils/storage';

export const Settings: React.FC = () => {
  const { state, updateProfile, importState } = useAppContext();
  const { userProfile } = state;

  const [formData, setFormData] = useState(userProfile);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'name' || name === 'startDate' ? value : Number(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSaveStatus('Settings saved successfully!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleExport = () => {
    exportData(state);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importData(file, (newState) => {
        importState(newState);
        setSaveStatus('Data imported successfully!');
        setTimeout(() => window.location.reload(), 1000);
      });
    }
  };

  const clearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Settings</h1>

      <Card title="User Profile">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Starting Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                name="startingWeight"
                value={formData.startingWeight}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Target Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                name="targetWeight"
                value={formData.targetWeight}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Goal Duration (Days)</label>
              <input
                type="number"
                name="goalDuration"
                value={formData.goalDuration}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            {saveStatus && <p className="text-emerald-500 text-sm font-medium">{saveStatus}</p>}
            <button
              type="submit"
              className="ml-auto flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </form>
      </Card>

      <Card title="Data Management">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={handleExport}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Download size={20} />
              <div className="text-left">
                <p className="font-bold">Export Data</p>
                <p className="text-xs opacity-70">Download your data as JSON</p>
              </div>
            </button>

            <label className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer">
              <Upload size={20} />
              <div className="text-left">
                <p className="font-bold">Import Data</p>
                <p className="text-xs opacity-70">Restore from a backup file</p>
              </div>
              <input type="file" className="hidden" accept=".json" onChange={handleImport} />
            </label>
          </div>

          <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={clearData}
              className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium transition-colors"
            >
              <Trash2 size={18} />
              Clear All Data
            </button>
            <p className="text-xs text-zinc-500 mt-2">
              Warning: This will permanently delete all your tracked data, habits, and settings.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
