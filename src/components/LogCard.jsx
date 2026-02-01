import React from 'react';
import { 
  Trash2, 
  Dumbbell, 
  HandMetal, 
  Music, 
  Users, 
  Palette,
  Footprints,
  Bike,
  Waves,
  Zap,
  Activity,
  Wind,
  Scale,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { getActivityConfig } from '../config/activityConfig';
import { formatDate, formatTime } from '../utils/dateUtils';

// Icon mapping
const iconMap = {
  Dumbbell,
  HandMetal,
  Music,
  Users,
  Palette,
  Footprints,
  Bike,
  Waves,
  Zap,
  Activity,
  Wind
};

// Helper to get specific cardio icon
const getCardioIcon = (cardioType) => {
  const cardioIcons = {
    'Run': Footprints,
    'Cycling': Bike,
    'Swimming': Waves,
    'HIIT': Zap,
    'Rowing': Activity,
    'Jump Rope': Wind,
    'Dancing': Music,
  };
  return cardioIcons[cardioType] || Activity;
};

const LogCard = ({ log, onDelete }) => {
  const config = getActivityConfig(log.activityType);
  
  if (!config) return null;

  // Determine the activity name and icon
  let activityName = config.label;
  let IconComponent = iconMap[config.icon];
  
  // For workouts, use the specific type as the activity name
  if (log.activityType === 'workout') {
    if (log.workoutType === 'Cardio' && log.cardioType) {
      activityName = log.cardioType;
      IconComponent = getCardioIcon(log.cardioType);
    } else if (log.workoutType) {
      activityName = log.workoutType;
    }
  }

  // Check if this is a cardio activity
  const isCardio = log.workoutType === 'Cardio';
  const cardioType = log.cardioType;

  // Format time display
  const getTimeDisplay = () => {
    const now = new Date();
    const logDate = new Date(log.timestamp);
    const diffInHours = (now - logDate) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `Today, ${formatTime(log.timestamp)}`;
    } else if (diffInHours < 48) {
      return `Yesterday, ${formatTime(log.timestamp)}`;
    } else {
      return `${formatDate(log.timestamp)}, ${formatTime(log.timestamp)}`;
    }
  };

  // Render cardio hero stats
  const renderCardioHero = () => {
    if (!isCardio) return null;

    let distance = null;
    let distanceUnit = '';
    let timeMinutes = 0;
    let timeSeconds = 0;

    // Extract distance and time based on cardio type
    if (cardioType === 'Run') {
      distance = log.runDistance;
      distanceUnit = log.runDistanceUnit || 'Miles';
      timeMinutes = log.runTimeMinutes || 0;
      timeSeconds = log.runTimeSeconds || 0;
    } else if (cardioType === 'Cycling') {
      distance = log.cyclingDistance;
      distanceUnit = 'miles';
      timeMinutes = log.cyclingTimeMinutes || 0;
    } else if (cardioType === 'Swimming') {
      distance = log.swimmingDistance;
      distanceUnit = 'm';
      timeMinutes = log.swimmingTimeMinutes || 0;
    } else if (cardioType === 'Rowing') {
      distance = log.rowingDistance;
      distanceUnit = 'm';
      timeMinutes = log.rowingTimeMinutes || 0;
    }

    if (!distance) return null;

    // Format time string
    const totalSeconds = (timeMinutes * 60) + (timeSeconds || 0);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const timeString = secs > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${mins}:00`;

    return (
      <div className="mb-4">
        <div className="flex items-center gap-3 text-2xl font-bold text-white">
          <span>{distance} {distanceUnit}</span>
          <span className="text-gray-400">•</span>
          <span>{timeString}</span>
        </div>
        {log.pace && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-gray-400">Pace: {log.pace}</span>
            {log.runComparison && renderComparisonBadge(log.runComparison)}
          </div>
        )}
      </div>
    );
  };

  // Render comparison badge
  const renderComparisonBadge = (comparison) => {
    if (!comparison || comparison === 'N/A') return null;

    const isFaster = comparison.includes('faster');
    const bgColor = isFaster ? 'bg-green-500/20' : 'bg-red-500/20';
    const textColor = isFaster ? 'text-green-400' : 'text-red-400';
    const Icon = isFaster ? TrendingDown : TrendingUp;

    return (
      <span className={`${bgColor} ${textColor} px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
        <Icon size={12} />
        {comparison}
      </span>
    );
  };

  // Render workout exercises
  const renderExercises = () => {
    if (isCardio) return null;

    // Handle Lift movements
    if (log.movements && Array.isArray(log.movements) && log.movements.length > 0) {
      return (
        <div className="mb-4 space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Exercises</p>
          {log.movements.map((movement, idx) => (
            <div key={idx} className="text-sm text-gray-300">
              <span className="font-medium">{movement.exerciseName}:</span>{' '}
              {movement.maxWeight && `${movement.maxWeight}lbs`}
              {movement.sets && ` × ${movement.sets} sets`}
              {movement.reps && ` × ${movement.reps} reps`}
            </div>
          ))}
        </div>
      );
    }

    // Handle Bodyweight exercises
    if (log.bodyweightExercises && Array.isArray(log.bodyweightExercises) && log.bodyweightExercises.length > 0) {
      return (
        <div className="mb-4 space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Exercises</p>
          {log.bodyweightExercises.map((exercise, idx) => (
            <div key={idx} className="text-sm text-gray-300">
              <span className="font-medium">{exercise.exerciseName}:</span>{' '}
              {exercise.time && `${exercise.time}s`}
              {exercise.sets && ` × ${exercise.sets} sets`}
              {exercise.reps && ` × ${exercise.reps} reps`}
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  // Render metadata section
  const renderMetadata = () => {
    return (
      <div className="space-y-2 border-t border-gray-700 pt-3">
        {/* Body Weight */}
        {log.bodyWeight && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Scale size={14} className="text-gray-500" />
            <span>Weight: {log.bodyWeight} {log.bodyWeightUnit || 'lbs'}</span>
            {log.postWorkout && (
              <span className="bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                ⚖️ Post-Workout
              </span>
            )}
          </div>
        )}

        {/* Duration (for non-cardio workouts) */}
        {!isCardio && log.duration && (
          <div className="text-sm text-gray-300">
            Duration: {log.duration} minutes
          </div>
        )}

        {/* Intensity */}
        {log.intensity && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Intensity:</span>
            <div className="flex gap-1">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-6 rounded ${
                    i < log.intensity ? 'bg-blue-500' : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-300">{log.intensity}/10</span>
          </div>
        )}

        {/* Calories */}
        {log.calories && (
          <div className="text-sm text-gray-300">
            Calories: {log.calories}
          </div>
        )}

        {/* CrossFit specific */}
        {log.wodDescription && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">WOD</p>
            <p className="text-sm text-gray-300 whitespace-pre-wrap">{log.wodDescription}</p>
          </div>
        )}
        {log.scoreTime && (
          <div className="text-sm text-gray-300">
            Score: {log.scoreTime}
          </div>
        )}

        {/* Notes */}
        {log.notes && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Notes</p>
            <p className="text-sm text-gray-300 whitespace-pre-wrap">{log.notes}</p>
          </div>
        )}
      </div>
    );
  };

  // Render non-workout activities
  const renderOtherActivity = () => {
    if (log.activityType === 'workout') return null;

    return (
      <div className="space-y-3">
        {/* Jiu-Jitsu */}
        {log.techniques && Array.isArray(log.techniques) && log.techniques.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Techniques</p>
            <div className="flex flex-wrap gap-1">
              {log.techniques.map((tech, idx) => (
                <span
                  key={idx}
                  className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
        {log.partners && Array.isArray(log.partners) && log.partners.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Partners</p>
            <div className="flex flex-wrap gap-1">
              {log.partners.map((partner, idx) => (
                <span
                  key={idx}
                  className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs font-medium"
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>
        )}
        {log.instructor && (
          <div className="text-sm text-gray-300">
            <span className="text-gray-400">Instructor:</span> {log.instructor}
          </div>
        )}
        {log.reflection && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Reflection</p>
            <p className="text-sm text-gray-300 whitespace-pre-wrap">{log.reflection}</p>
          </div>
        )}

        {/* Music */}
        {log.instrument && (
          <div className="text-sm text-gray-300">
            <span className="text-gray-400">Instrument:</span> {log.instrument}
          </div>
        )}
        {log.sessionType && (
          <div className="text-sm text-gray-300">
            <span className="text-gray-400">Type:</span> {log.sessionType}
          </div>
        )}
        {log.duration && log.activityType !== 'workout' && (
          <div className="text-sm text-gray-300">
            <span className="text-gray-400">Duration:</span> {log.duration} minutes
          </div>
        )}

        {/* Social */}
        {log.who && (
          <div className="text-sm text-gray-300">
            <span className="text-gray-400">Who:</span> {log.who}
          </div>
        )}
        {log.activity && (
          <div className="text-sm text-gray-300">
            <span className="text-gray-400">Activity:</span> {log.activity}
          </div>
        )}
        {log.location && (
          <div className="text-sm text-gray-300">
            <span className="text-gray-400">Location:</span> {log.location}
          </div>
        )}

        {/* Creative */}
        {log.creativeType && (
          <div className="text-sm text-gray-300">
            <span className="text-gray-400">Type:</span> {log.creativeType}
          </div>
        )}
        {log.output && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Output</p>
            <p className="text-sm text-gray-300 whitespace-pre-wrap">{log.output}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow border border-gray-700">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`${config.color} p-2 rounded-lg text-white`}>
            {IconComponent && <IconComponent size={20} />}
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{activityName}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-400">
            {getTimeDisplay()}
          </p>
          <button
            onClick={() => onDelete(log.id)}
            className="text-gray-500 hover:text-red-400 transition-colors ml-2"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Body - Smart Conditional Content */}
      <div className="space-y-3">
        {/* Cardio Hero Stats */}
        {renderCardioHero()}

        {/* Workout Exercises */}
        {renderExercises()}

        {/* Other Activities */}
        {renderOtherActivity()}

        {/* Metadata */}
        {renderMetadata()}
      </div>
    </div>
  );
};

export default LogCard;
