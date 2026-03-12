import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/UI';
import { Plus, Trash2, CheckCircle2, Circle, Flame } from 'lucide-react';
import { Habit } from '../types';

export const Habits: React.FC = () => {
  const { state, toggleHabit, addHabit, deleteHabit } = useAppContext();
  const { habits } = state;

  const [isAdding, setIsAdding] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    frequency: 'Daily' as const,
    category: 'Health'
  });

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.name,
      frequency: newHabit.frequency,
      completedDates: [],
      streak: 0,
      category: newHabit.category
    };
    addHabit(habit);
    setNewHabit({ name: '', frequency: 'Daily', category: 'Health' });
    setIsAdding(false);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Habit Tracker</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          New Habit
        </button>
      </div>

      {isAdding && (
        <Card title="Create New Habit">
          <form onSubmit={handleAddHabit} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Habit Name</label>
              <input
                type="text"
                value={newHabit.name}
                onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                placeholder="e.g., Read for 30 mins"
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Category</label>
              <select
                value={newHabit.category}
                onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
              >
                <option>Health</option>
                <option>Learning</option>
                <option>Productivity</option>
                <option>Personal</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Add
              </button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habits.map((habit) => {
          const isCompletedToday = habit.completedDates.includes(today);
          return (
            <Card key={habit.id}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{habit.name}</h3>
                  <span className="text-xs font-medium px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full uppercase tracking-wider">
                    {habit.category}
                  </span>
                </div>
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-2 text-orange-500 font-bold">
                  <Flame size={20} fill="currentColor" />
                  <span>{habit.streak} Day Streak</span>
                </div>
                <button
                  onClick={() => toggleHabit(habit.id, today)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    isCompletedToday
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                      : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {isCompletedToday ? (
                    <>
                      <CheckCircle2 size={20} />
                      Done
                    </>
                  ) : (
                    <>
                      <Circle size={20} />
                      Mark Done
                    </>
                  )}
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
