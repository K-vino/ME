import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/UI';
import { Check, Flame, Plus, Trash2, X } from 'lucide-react';
import { Habit } from '../types';
import { format, subDays } from 'date-fns';

export const Habits: React.FC = () => {
  const { state, addHabit, updateHabit, deleteHabit } = useAppContext();
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('Health');
  const [isAdding, setIsAdding] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(today), 6 - i);
    return format(d, 'yyyy-MM-dd');
  });

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName,
      category: newHabitCategory,
      streak: 0,
      completedDates: [],
    };

    addHabit(newHabit);
    setNewHabitName('');
    setIsAdding(false);
  };

  const toggleHabitDate = (habit: Habit, date: string) => {
    const isCompleted = habit.completedDates.includes(date);
    let newCompletedDates = [...habit.completedDates];
    
    if (isCompleted) {
      newCompletedDates = newCompletedDates.filter(d => d !== date);
    } else {
      newCompletedDates.push(date);
    }

    // Calculate streak (simple version: consecutive days from today backwards)
    let currentStreak = 0;
    let checkDate = new Date(today);
    while (true) {
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      if (newCompletedDates.includes(dateStr)) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }

    updateHabit({ ...habit, completedDates: newCompletedDates, streak: currentStreak });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Habits</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Build consistency and track your streaks.</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-1" /> New Habit
          </button>
        )}
      </div>

      {isAdding && (
        <Card className="bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-800">
          <form onSubmit={handleAddHabit} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="Habit name (e.g., Read 10 pages)"
              className="flex-1 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              autoFocus
            />
            <select
              value={newHabitCategory}
              onChange={(e) => setNewHabitCategory(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            >
              <option value="Health">Health</option>
              <option value="Learning">Learning</option>
              <option value="Productivity">Productivity</option>
              <option value="Mindfulness">Mindfulness</option>
            </select>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      <Card className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-12 gap-4 mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            <div className="col-span-3">Habit</div>
            <div className="col-span-1 text-center">Streak</div>
            {last7Days.map(date => (
              <div key={date} className="col-span-1 text-center flex flex-col">
                <span>{format(new Date(date), 'EEE')}</span>
                <span className="text-xs">{format(new Date(date), 'd')}</span>
              </div>
            ))}
            <div className="col-span-1 text-center"></div>
          </div>

          <div className="space-y-4">
            {state.habits.map(habit => (
              <div key={habit.id} className="grid grid-cols-12 gap-4 items-center group">
                <div className="col-span-3">
                  <p className="font-medium text-zinc-900 dark:text-white truncate">{habit.name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{habit.category}</p>
                </div>
                <div className="col-span-1 flex items-center justify-center gap-1">
                  <Flame className={`w-4 h-4 ${habit.streak > 0 ? 'text-orange-500' : 'text-zinc-300 dark:text-zinc-700'}`} />
                  <span className={`font-bold ${habit.streak > 0 ? 'text-orange-500' : 'text-zinc-400'}`}>{habit.streak}</span>
                </div>
                {last7Days.map(date => {
                  const isCompleted = habit.completedDates.includes(date);
                  return (
                    <div key={date} className="col-span-1 flex justify-center">
                      <button
                        onClick={() => toggleHabitDate(habit, date)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                          isCompleted 
                            ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30' 
                            : 'bg-zinc-100 dark:bg-zinc-800 text-transparent hover:bg-zinc-200 dark:hover:bg-zinc-700'
                        }`}
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })}
                <div className="col-span-1 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => deleteHabit(habit.id)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {state.habits.length === 0 && (
              <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
                No habits added yet. Start building good habits today!
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
