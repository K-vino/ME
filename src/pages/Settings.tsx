import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/UI';
import { exportData, importData } from '../utils/storage';
import { logAction } from '../utils/logger';
import { Download, Upload, Trash2, Moon, Sun, Save } from 'lucide-react';

export const Settings: React.FC = () => {
  const { state, updateUserProfile, toggleDarkMode, resetData, importState } = useAppContext();
  const [profileForm, setProfileForm] = useState(state.userProfile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(profileForm);
    alert('Profile updated successfully!');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importData(file, (newState) => {
        importState(newState);
        alert('Data imported successfully!');
      });
    }
  };

  const handleExport = () => {
    logAction('EXPORT_DATA', 'Settings', {}, state, state, state.userProfile.name);
    exportData(state);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      resetData();
      alert('Data reset successfully.');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Settings</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your profile and application data.</p>
      </div>

      <Card title="User Profile">
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Name</label>
              <input type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Height (cm)</label>
              <input type="number" value={profileForm.height} onChange={e => setProfileForm({...profileForm, height: Number(e.target.value)})} className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Starting Weight (kg)</label>
              <input type="number" value={profileForm.startingWeight} onChange={e => setProfileForm({...profileForm, startingWeight: Number(e.target.value)})} className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Target Weight (kg)</label>
              <input type="number" value={profileForm.targetWeight} onChange={e => setProfileForm({...profileForm, targetWeight: Number(e.target.value)})} className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Goal Duration (Days)</label>
              <input type="number" value={profileForm.goalDurationDays} onChange={e => setProfileForm({...profileForm, goalDurationDays: Number(e.target.value)})} className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Start Date</label>
              <input type="date" value={profileForm.startDate} onChange={e => setProfileForm({...profileForm, startDate: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <Save className="w-4 h-4 mr-2" /> Save Profile
            </button>
          </div>
        </form>
      </Card>

      <Card title="Preferences">
        <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div>
            <h4 className="font-medium text-zinc-900 dark:text-white">Dark Mode</h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Toggle dark mode appearance.</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${state.isDarkMode ? 'bg-indigo-600 text-white' : 'bg-zinc-200 text-zinc-700'}`}
          >
            {state.isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>
      </Card>

      <Card title="Data Management">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleExport}
              className="flex-1 flex items-center justify-center px-4 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-700"
            >
              <Download className="w-5 h-5 mr-2" /> Export Backup
            </button>
            
            <input
              type="file"
              accept=".json"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImport}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center px-4 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-700"
            >
              <Upload className="w-5 h-5 mr-2" /> Import Backup
            </button>
          </div>

          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center px-4 py-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors border border-red-200 dark:border-red-500/20"
            >
              <Trash2 className="w-5 h-5 mr-2" /> Reset All Data
            </button>
            <p className="text-xs text-center text-zinc-500 dark:text-zinc-400 mt-2">
              Warning: This will permanently delete all your data and restore defaults.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
