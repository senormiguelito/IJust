// Utility functions for date and time formatting

export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now - date;
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  // Today
  if (diffInHours < 24 && date.getDate() === now.getDate()) {
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return diffInMinutes === 0 ? 'Just now' : `${diffInMinutes}m ago`;
    }
    return `${Math.floor(diffInHours)}h ago`;
  }

  // Yesterday
  if (diffInDays < 2 && date.getDate() === now.getDate() - 1) {
    return 'Yesterday';
  }

  // This week
  if (diffInDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }

  // Older
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

export const formatDateTime = (timestamp) => {
  return `${formatDate(timestamp)} at ${formatTime(timestamp)}`;
};
