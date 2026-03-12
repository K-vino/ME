import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/UI';
import { CheckCircle2, Circle, Plus, Trash2, Calendar } from 'lucide-react';
import { Task } from '../types';

export const Tasks: React.FC = () => {
  const { state, addTask, updateTask, deleteTask } = useAppContext();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Learning');
  const [newTaskPriority, setNewTaskPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [newTaskDeadline, setNewTaskDeadline] = useState(new Date().toISOString().split('T')[0]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      category: newTaskCategory,
      priority: newTaskPriority,
      deadline: newTaskDeadline,
    };

    addTask(newTask);
    setNewTaskTitle('');
  };

  const toggleTask = (task: Task) => {
    updateTask({ ...task, completed: !task.completed });
  };

  const completedTasks = state.tasks.filter(t => t.completed);
  const pendingTasks = state.tasks.filter(t => !t.completed).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Tasks</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your career and learning to-dos.</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          />
          <input
            type="date"
            value={newTaskDeadline}
            onChange={(e) => setNewTaskDeadline(e.target.value)}
            className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          />
          <select
            value={newTaskCategory}
            onChange={(e) => setNewTaskCategory(e.target.value)}
            className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          >
            <option value="Learning">Learning</option>
            <option value="Project">Project</option>
            <option value="Career">Career</option>
            <option value="Practice">Practice</option>
            <option value="Portfolio">Portfolio</option>
          </select>
          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value as any)}
            className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button
            type="submit"
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-1" /> Add
          </button>
        </form>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3 flex items-center">
              Pending ({pendingTasks.length})
            </h3>
            {pendingTasks.length === 0 ? (
              <p className="text-zinc-500 dark:text-zinc-400 text-sm italic">No pending tasks.</p>
            ) : (
              <ul className="space-y-2">
                {pendingTasks.map(task => (
                  <li key={task.id} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-800 group">
                    <div className="flex items-center gap-3">
                      <button onClick={() => toggleTask(task)} className="text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        <Circle className="w-6 h-6" />
                      </button>
                      <div>
                        <p className="text-zinc-900 dark:text-white font-medium">{task.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-full">{task.category}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            task.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                            task.priority === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                            'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                          }`}>{task.priority}</span>
                          <span className="text-xs text-zinc-500 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" /> {task.deadline}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => deleteTask(task.id)} className="text-zinc-400 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {completedTasks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3 flex items-center">
                Completed ({completedTasks.length})
              </h3>
              <ul className="space-y-2 opacity-60">
                {completedTasks.map(task => (
                  <li key={task.id} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-800 group">
                    <div className="flex items-center gap-3">
                      <button onClick={() => toggleTask(task)} className="text-emerald-600 dark:text-emerald-500 transition-colors">
                        <CheckCircle2 className="w-6 h-6" />
                      </button>
                      <div>
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium line-through">{task.title}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 rounded-full">{task.category}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => deleteTask(task.id)} className="text-zinc-400 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
