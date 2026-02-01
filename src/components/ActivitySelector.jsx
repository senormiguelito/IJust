import React from 'react';
import { X, Dumbbell, HandMetal, Music, Users, Palette } from 'lucide-react';
import { getAllActivities } from '../config/activityConfig';

// Icon mapping
const iconMap = {
  Dumbbell,
  HandMetal,
  Music,
  Users,
  Palette
};

const ActivitySelector = ({ onSelect, onCancel }) => {
  const activities = getAllActivities();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">I Just...</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {activities.map((activity) => {
          const IconComponent = iconMap[activity.icon];
          return (
            <button
              key={activity.id}
              onClick={() => onSelect(activity.id)}
              className={`${activity.colorLight} ${activity.colorText} p-6 rounded-lg hover:scale-105 transition-transform duration-200 flex flex-col items-center gap-3`}
            >
              {IconComponent && <IconComponent size={32} />}
              <span className="font-semibold">{activity.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ActivitySelector;
