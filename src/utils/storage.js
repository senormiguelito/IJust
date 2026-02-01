// LocalStorage utility functions for managing activity logs

const STORAGE_KEY = 'ijust_logs';

export const saveLogs = (logs) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    return true;
  } catch (error) {
    console.error('Error saving logs:', error);
    return false;
  }
};

export const loadLogs = () => {
  try {
    const logs = localStorage.getItem(STORAGE_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error('Error loading logs:', error);
    return [];
  }
};

export const addLog = (log) => {
  const logs = loadLogs();
  const newLog = {
    ...log,
    id: Date.now().toString(),
    timestamp: new Date().toISOString()
  };
  logs.unshift(newLog); // Add to beginning for reverse chronological order
  saveLogs(logs);
  return newLog;
};

export const deleteLog = (logId) => {
  const logs = loadLogs();
  const filteredLogs = logs.filter(log => log.id !== logId);
  saveLogs(filteredLogs);
  return filteredLogs;
};

export const updateLog = (logId, updatedData) => {
  const logs = loadLogs();
  const updatedLogs = logs.map(log => 
    log.id === logId ? { ...log, ...updatedData } : log
  );
  saveLogs(updatedLogs);
  return updatedLogs;
};
