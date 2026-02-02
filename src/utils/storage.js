// LocalStorage utility functions for managing activity logs

const STORAGE_KEY = 'ijust_logs';
const INSTRUCTORS_KEY = 'ijust_instructors';
const JIUJITSU_PEERS_KEY = 'ijust_jiujitsu_peers';

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
    log.id === logId ? { ...log, ...updatedData, timestamp: log.timestamp } : log
  );
  saveLogs(updatedLogs);
  return updatedLogs;
};

export const getLogById = (logId) => {
  const logs = loadLogs();
  return logs.find(log => log.id === logId);
};

// Get the most recent body weight from any log
export const getLastBodyWeight = () => {
  const logs = loadLogs();
  for (let log of logs) {
    if (log.bodyWeight) {
      return {
        weight: log.bodyWeight,
        unit: log.bodyWeightUnit || 'lbs'
      };
    }
  }
  return { weight: 160, unit: 'lbs' }; // Default
};

// Instructor management
export const loadInstructors = () => {
  try {
    const instructors = localStorage.getItem(INSTRUCTORS_KEY);
    return instructors ? JSON.parse(instructors) : [];
  } catch (error) {
    console.error('Error loading instructors:', error);
    return [];
  }
};

export const saveInstructor = (name, beltRank) => {
  const instructors = loadInstructors();
  const existing = instructors.find(i => i.name.toLowerCase() === name.toLowerCase());
  
  if (!existing) {
    instructors.push({ name, beltRank });
    try {
      localStorage.setItem(INSTRUCTORS_KEY, JSON.stringify(instructors));
      return true;
    } catch (error) {
      console.error('Error saving instructor:', error);
      return false;
    }
  }
  return false; // Already exists
};

// Jiu-Jitsu Peers management (unified partner database)
export const loadJiuJitsuPeers = () => {
  try {
    const peers = localStorage.getItem(JIUJITSU_PEERS_KEY);
    return peers ? JSON.parse(peers) : [];
  } catch (error) {
    console.error('Error loading jiu-jitsu peers:', error);
    return [];
  }
};

export const saveJiuJitsuPeer = (name, beltRank, weightClass) => {
  const peers = loadJiuJitsuPeers();
  const existing = peers.find(p => p.name.toLowerCase() === name.toLowerCase());
  
  if (!existing) {
    peers.push({ name, beltRank, weightClass });
    try {
      localStorage.setItem(JIUJITSU_PEERS_KEY, JSON.stringify(peers));
      return true;
    } catch (error) {
      console.error('Error saving jiu-jitsu peer:', error);
      return false;
    }
  }
  return false; // Already exists
};

export const updateJiuJitsuPeer = (name, beltRank, weightClass) => {
  const peers = loadJiuJitsuPeers();
  const existingIndex = peers.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
  
  if (existingIndex >= 0) {
    peers[existingIndex] = { name, beltRank, weightClass };
    try {
      localStorage.setItem(JIUJITSU_PEERS_KEY, JSON.stringify(peers));
      return true;
    } catch (error) {
      console.error('Error updating jiu-jitsu peer:', error);
      return false;
    }
  }
  return false;
};

export const getJiuJitsuPeerByName = (name) => {
  const peers = loadJiuJitsuPeers();
  return peers.find(p => p.name.toLowerCase() === name.toLowerCase());
};

// Calculate average rating for a specific drilling partner (Legacy - for backward compatibility)
export const getPartnerAverageRating = (partnerName) => {
  const logs = loadLogs();
  const jiujitsuLogs = logs.filter(log => 
    log.activityType === 'jiujitsu' && 
    log.drillingPartners && 
    Array.isArray(log.drillingPartners)
  );
  
  let totalRating = 0;
  let count = 0;
  
  jiujitsuLogs.forEach(log => {
    log.drillingPartners.forEach(partner => {
      if (partner.name && partner.name.toLowerCase() === partnerName.toLowerCase() && partner.rating) {
        totalRating += parseFloat(partner.rating);
        count++;
      }
    });
  });
  
  return count > 0 ? (totalRating / count).toFixed(1) : null;
};

// Calculate average effectiveness for a drilling partner
export const getDrillingPartnerAverageEffectiveness = (partnerName) => {
  const logs = loadLogs();
  const jiujitsuLogs = logs.filter(log => 
    log.activityType === 'jiujitsu' && 
    log.drillingPartners && 
    Array.isArray(log.drillingPartners)
  );
  
  let totalEffectiveness = 0;
  let count = 0;
  
  jiujitsuLogs.forEach(log => {
    log.drillingPartners.forEach(partner => {
      const name = partner.name && partner.name.toLowerCase();
      // Support both new 'effectiveness' and legacy 'rating' fields
      const effectiveness = partner.effectiveness || partner.rating;
      if (name === partnerName.toLowerCase() && effectiveness) {
        totalEffectiveness += parseFloat(effectiveness);
        count++;
      }
    });
  });
  
  return count > 0 ? (totalEffectiveness / count).toFixed(1) : null;
};

// Calculate average stats for a sparring partner
export const getSparringPartnerAverageStats = (partnerName) => {
  const logs = loadLogs();
  const jiujitsuLogs = logs.filter(log => 
    log.activityType === 'jiujitsu' && 
    log.sparringRounds && 
    Array.isArray(log.sparringRounds)
  );
  
  let totalEffectiveness = 0;
  let totalAggressiveness = 0;
  let effectivenessCount = 0;
  let aggressivenessCount = 0;
  
  jiujitsuLogs.forEach(log => {
    log.sparringRounds.forEach(round => {
      const name = round.name && round.name.toLowerCase();
      if (name === partnerName.toLowerCase()) {
        // Support new 'effectiveness' field and legacy 'rating' field
        const effectiveness = round.effectiveness || round.rating;
        if (effectiveness) {
          totalEffectiveness += parseFloat(effectiveness);
          effectivenessCount++;
        }
        if (round.aggressiveness) {
          totalAggressiveness += parseFloat(round.aggressiveness);
          aggressivenessCount++;
        }
      }
    });
  });
  
  return {
    effectiveness: effectivenessCount > 0 ? (totalEffectiveness / effectivenessCount).toFixed(1) : null,
    aggressiveness: aggressivenessCount > 0 ? (totalAggressiveness / aggressivenessCount).toFixed(1) : null
  };
};

// Calculate average class quality for an instructor
export const getInstructorAverageQuality = (instructorName) => {
  const logs = loadLogs();
  const jiujitsuLogs = logs.filter(log => 
    log.activityType === 'jiujitsu' && 
    log.instructor && 
    log.instructor.toLowerCase() === instructorName.toLowerCase() &&
    log.classQuality
  );
  
  if (jiujitsuLogs.length === 0) return null;
  
  const totalQuality = jiujitsuLogs.reduce((sum, log) => sum + parseFloat(log.classQuality), 0);
  return (totalQuality / jiujitsuLogs.length).toFixed(1);
};
