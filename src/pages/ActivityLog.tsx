import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/UI';
import { 
  History, 
  Search, 
  Filter, 
  Calendar, 
  Tag, 
  User as UserIcon, 
  ArrowRight,
  Download,
  Trash2,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LogEntry } from '../types';
import { exportLog } from '../utils/logger';

export const ActivityLog: React.FC = () => {
  const { state } = useAppContext();
  const { activityLog } = state;
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModule, setFilterModule] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const modules = ['All', ...Array.from(new Set(activityLog.entries.map(e => e.module)))];

  const filteredEntries = activityLog.entries
    .filter(entry => {
      const matchesSearch = entry.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           entry.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           JSON.stringify(entry.details).toLowerCase().includes(searchQuery.toLowerCase());
      const matchesModule = filterModule === 'All' || entry.module === filterModule;
      return matchesSearch && matchesModule;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Activity Log</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">A permanent record of all actions in your Life OS.</p>
        </div>
        <button 
          onClick={exportLog}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-800"
        >
          <Download size={18} /> Export JSON
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
          <input 
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {modules.map(mod => (
            <button
              key={mod}
              onClick={() => setFilterModule(mod)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterModule === mod 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              {mod}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <div key={entry.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden transition-all hover:shadow-md">
              <div 
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${
                    entry.module === 'Career' ? 'bg-indigo-50 text-indigo-600' :
                    entry.module === 'Health' ? 'bg-emerald-50 text-emerald-600' :
                    'bg-zinc-50 text-zinc-600'
                  }`}>
                    <History size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white">{entry.action}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                        <Tag size={10} /> {entry.module}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                        <Calendar size={10} /> {new Date(entry.timestamp).toLocaleString()}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                        <UserIcon size={10} /> {entry.user}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Version</p>
                    <p className="text-xs text-zinc-500">{entry.appVersion}</p>
                  </div>
                  {expandedId === entry.id ? <ChevronDown size={20} className="text-zinc-400" /> : <ChevronRight size={20} className="text-zinc-400" />}
                </div>
              </div>

              <AnimatePresence>
                {expandedId === entry.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 p-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h5 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Details</h5>
                        <pre className="text-xs bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-x-auto text-zinc-600 dark:text-zinc-400">
                          {JSON.stringify(entry.details, null, 2)}
                        </pre>
                      </div>
                      {(entry.beforeState || entry.afterState) && (
                        <div>
                          <h5 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">State Change</h5>
                          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                            <span>Before</span>
                            <ArrowRight size={12} />
                            <span>After</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <pre className="text-[10px] bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-x-auto">
                              {JSON.stringify(entry.beforeState, null, 2)}
                            </pre>
                            <pre className="text-[10px] bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-x-auto">
                              {JSON.stringify(entry.afterState, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
            <History size={48} className="mx-auto text-zinc-200 mb-4" />
            <p className="text-zinc-500">No activity logs found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
