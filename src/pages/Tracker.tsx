import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/UI';
import { format } from 'date-fns';

export const Tracker: React.FC = () => {
  const { state, updateDailyData } = useAppContext();
  const { dailyData, userProfile } = state;
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState(dailyData[selectedDate] || dailyData[Object.keys(dailyData)[0]]);

  useEffect(() => {
    if (dailyData[selectedDate]) {
      setFormData(dailyData[selectedDate]);
    }
  }, [selectedDate, dailyData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: any = value;
    
    if (type === 'number') {
      parsedValue = value === '' ? null : Number(value);
    }

    const newData = { ...formData, [name]: parsedValue };
    
    // Calculate weight difference if actual weight changes
    if (name === 'actualWeight' && parsedValue !== null) {
      newData.weightDifference = Number((parsedValue - formData.targetWeight).toFixed(2));
    }

    setFormData(newData);
    updateDailyData(selectedDate, newData); // Auto-save
  };

  if (!formData) return <div>Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Daily Tracker</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Track your daily metrics and progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="date-select" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Select Date:</label>
          <input
            id="date-select"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={userProfile.startDate}
            className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          />
        </div>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Day {formData.dayNumber}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{format(new Date(selectedDate), 'EEEE, MMMM do, yyyy')}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Target Weight</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{formData.targetWeight} kg</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Weight Section */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Actual Weight (kg)</label>
              <input
                type="number"
                name="actualWeight"
                step="0.1"
                value={formData.actualWeight || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                placeholder="e.g. 84.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Weight Difference</label>
              <div className={`w-full px-3 py-2 rounded-lg border ${
                (formData.weightDifference || 0) <= 0 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' 
                  : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400'
              }`}>
                {formData.weightDifference !== null ? (formData.weightDifference > 0 ? '+' : '') + formData.weightDifference + ' kg' : '-'}
              </div>
            </div>
          </div>

          <div className="col-span-full border-t border-zinc-200 dark:border-zinc-800 my-2"></div>

          {/* Health & Fitness */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Steps</label>
            <input type="number" name="steps" value={formData.steps || ''} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Calories Consumed</label>
            <input type="number" name="caloriesConsumed" value={formData.caloriesConsumed || ''} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Calories Burned</label>
            <input type="number" name="caloriesBurned" value={formData.caloriesBurned || ''} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Water Intake (Liters)</label>
            <input type="number" step="0.1" name="waterIntake" value={formData.waterIntake || ''} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Sleep Hours</label>
            <input type="number" step="0.5" name="sleepHours" value={formData.sleepHours || ''} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
          </div>
          
          <div className="col-span-full border-t border-zinc-200 dark:border-zinc-800 my-2"></div>

          {/* Activity */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Exercise Type</label>
            <input type="text" name="exerciseType" value={formData.exerciseType || ''} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="e.g. Running, Gym" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Exercise Duration (mins)</label>
            <input type="number" name="exerciseDuration" value={formData.exerciseDuration || ''} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Study Hours</label>
            <input type="number" step="0.5" name="studyHours" value={formData.studyHours || ''} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
          </div>

          <div className="col-span-full border-t border-zinc-200 dark:border-zinc-800 my-2"></div>

          {/* Other */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Mood</label>
            <select name="mood" value={formData.mood || ''} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
              <option value="">Select mood...</option>
              <option value="Great">Great</option>
              <option value="Good">Good</option>
              <option value="Neutral">Neutral</option>
              <option value="Bad">Bad</option>
              <option value="Terrible">Terrible</option>
            </select>
          </div>
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Notes</label>
            <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows={2} className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="Any thoughts for today?" />
          </div>
        </div>
      </Card>
    </div>
  );
};

