import { LogEntry, ActivityLog } from '../types';

const LOG_STORAGE_KEY = 'lifeOS_activity_log';
const APP_VERSION = '1.0';

export const getActivityLog = (): ActivityLog => {
  try {
    const data = localStorage.getItem(LOG_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load activity log', error);
  }
  return {
    version: 1,
    createdAt: new Date().toISOString().split('T')[0],
    entries: [],
  };
};

const saveActivityLog = (log: ActivityLog) => {
  try {
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(log));
  } catch (error) {
    console.error('Failed to save activity log', error);
  }
};

export const createLogEntry = (
  action: string,
  module: string,
  details: any,
  beforeState: any,
  afterState: any,
  user: string = 'Vino K'
): LogEntry => {
  const now = new Date();
  return {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: now.toISOString(),
    date: now.toISOString().split('T')[0],
    action,
    module,
    details,
    beforeState,
    afterState,
    user,
    appVersion: APP_VERSION,
  };
};

export const logAction = (
  action: string,
  module: string,
  details: any,
  beforeState: any = null,
  afterState: any = null,
  user: string = 'Vino K'
) => {
  const log = getActivityLog();
  const entry = createLogEntry(action, module, details, beforeState, afterState, user);
  
  // Append only
  log.entries.push(entry);
  saveActivityLog(log);
};

export const exportLog = () => {
  const log = getActivityLog();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(log, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "activity_log_backup.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

export const searchLog = (query: string): LogEntry[] => {
  const log = getActivityLog();
  if (!query) return log.entries;
  const lowerQuery = query.toLowerCase();
  return log.entries.filter(entry => 
    entry.action.toLowerCase().includes(lowerQuery) ||
    entry.module.toLowerCase().includes(lowerQuery) ||
    JSON.stringify(entry.details).toLowerCase().includes(lowerQuery)
  );
};

export const filterLogByModule = (module: string): LogEntry[] => {
  const log = getActivityLog();
  if (!module) return log.entries;
  return log.entries.filter(entry => entry.module === module);
};

export const filterLogByDate = (date: string): LogEntry[] => {
  const log = getActivityLog();
  if (!date) return log.entries;
  return log.entries.filter(entry => entry.date === date);
};
