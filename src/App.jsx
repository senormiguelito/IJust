import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ActivitySelector from './components/ActivitySelector';
import GenericForm from './components/GenericForm';
import LogCard from './components/LogCard';
import { getActivityConfig } from './config/activityConfig';
import { loadLogs, addLog, deleteLog } from './utils/storage';

function App() {
  const [logs, setLogs] = useState([]);
  const [showActivitySelector, setShowActivitySelector] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Load logs from localStorage on mount
  useEffect(() => {
    const savedLogs = loadLogs();
    setLogs(savedLogs);
  }, []);

  const handleActivitySelect = (activityId) => {
    setSelectedActivity(activityId);
    setShowActivitySelector(false);
  };

  const handleFormSubmit = (formData) => {
    const newLog = addLog(formData);
    setLogs((prev) => [newLog, ...prev]);
    setSelectedActivity(null);
  };

  const handleFormCancel = () => {
    setSelectedActivity(null);
    setShowActivitySelector(false);
  };

  const handleDeleteLog = (logId) => {
    if (window.confirm('Are you sure you want to delete this log?')) {
      const updatedLogs = deleteLog(logId);
      setLogs(updatedLogs);
    }
  };

  const handleNewLog = () => {
    setShowActivitySelector(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">I Just</h1>
          <p className="text-gray-600 mt-1">Track your lifestyle, one activity at a time</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Feed */}
        {logs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">No logs yet. Start tracking your activities!</p>
            <button
              onClick={handleNewLog}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus size={20} />
              I Just...
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <LogCard key={log.id} log={log} onDelete={handleDeleteLog} />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      {logs.length > 0 && (
        <button
          onClick={handleNewLog}
          className="fixed bottom-8 right-8 bg-blue-600 text-white w-16 h-16 rounded-full shadow-lg hover:bg-blue-700 hover:scale-110 transition-all flex items-center justify-center"
          aria-label="Add new log"
        >
          <Plus size={28} />
        </button>
      )}

      {/* Modal Overlay */}
      {(showActivitySelector || selectedActivity) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          {showActivitySelector && (
            <ActivitySelector
              onSelect={handleActivitySelect}
              onCancel={handleFormCancel}
            />
          )}
          {selectedActivity && (
            <GenericForm
              activityConfig={getActivityConfig(selectedActivity)}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
