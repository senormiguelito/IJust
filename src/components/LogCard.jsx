import React, { useState } from 'react';
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
  TrendingUp,
  Edit2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { getActivityConfig } from '../config/activityConfig';
import { formatDate, formatTime } from '../utils/dateUtils';
import { getInstructorAverageQuality, getDrillingPartnerAverageEffectiveness, getSparringPartnerAverageStats } from '../utils/storage';

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

const LogCard = ({ log, onDelete, onEdit }) => {
  const config = getActivityConfig(log.activityType);
  const [displayWeightUnit, setDisplayWeightUnit] = useState(log.bodyWeightUnit || 'lbs');
  const [displayRopeWeightUnit, setDisplayRopeWeightUnit] = useState(log.jumpRopeWeightUnit || 'lbs');
  const [expandedTechniques, setExpandedTechniques] = useState({});
  const [hoveredPartner, setHoveredPartner] = useState(null);
  
  if (!config) return null;

  // Helper to format 24-hour time to 12-hour AM/PM format
  const formatTimeDisplay = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Convert weight between units
  const convertWeight = (weight, fromUnit, toUnit) => {
    if (fromUnit === toUnit) return weight;
    if (toUnit === 'kg') {
      return (weight * 0.453592).toFixed(1);
    } else {
      return (weight / 0.453592).toFixed(1);
    }
  };

  const getDisplayWeight = () => {
    if (!log.bodyWeight) return null;
    const originalUnit = log.bodyWeightUnit || 'lbs';
    const weight = parseFloat(log.bodyWeight);
    return convertWeight(weight, originalUnit, displayWeightUnit);
  };

  const toggleWeightUnit = () => {
    setDisplayWeightUnit(prev => prev === 'lbs' ? 'kg' : 'lbs');
  };

  const toggleRopeWeightUnit = () => {
    setDisplayRopeWeightUnit(prev => prev === 'lbs' ? 'kg' : 'lbs');
  };

  const convertRopeWeight = (weight, fromUnit, toUnit) => {
    if (fromUnit === toUnit) return weight;
    if (toUnit === 'kg') {
      return (weight * 0.453592).toFixed(1);
    } else {
      return (weight / 0.453592).toFixed(1);
    }
  };

  const getDisplayRopeWeight = () => {
    if (!log.jumpRopeWeight) return null;
    const originalUnit = log.jumpRopeWeightUnit || 'lbs';
    const weight = parseFloat(log.jumpRopeWeight);
    return convertRopeWeight(weight, originalUnit, displayRopeWeightUnit);
  };

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
        {/* Jump Rope Specific Details */}
        {cardioType === 'Jump Rope' && (
          <div className="space-y-2 mb-3">
            {/* Display Skips OR Time based on tracking mode */}
            {log.jumpRopeTrackingMode === 'Track by Skips' && log.jumpRopeSkips && (
              <div className="text-sm text-gray-300">
                <span className="text-gray-400">Skips:</span> {log.jumpRopeSkips}
              </div>
            )}
            {log.jumpRopeTrackingMode === 'Track by Time' && log.jumpRopeTimeMinutes && (
              <div className="text-sm text-gray-300">
                <span className="text-gray-400">Time:</span> {log.jumpRopeTimeMinutes} mins
              </div>
            )}
            {/* Legacy support: Show both if tracking mode not set */}
            {!log.jumpRopeTrackingMode && (
              <>
                {log.jumpRopeSkips && (
                  <div className="text-sm text-gray-300">
                    <span className="text-gray-400">Skips:</span> {log.jumpRopeSkips}
                  </div>
                )}
                {log.jumpRopeTimeMinutes && (
                  <div className="text-sm text-gray-300">
                    <span className="text-gray-400">Time:</span> {log.jumpRopeTimeMinutes} mins
                  </div>
                )}
              </>
            )}
            {/* Weighted Rope Details */}
            {log.jumpRopeWeighted && log.jumpRopeWeight && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-gray-400">Weighted Rope:</span>
                <button
                  onClick={toggleRopeWeightUnit}
                  className="hover:bg-gray-700 px-2 py-0.5 rounded transition-colors underline decoration-dotted"
                >
                  {getDisplayRopeWeight()} {displayRopeWeightUnit}
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Social Context - Universal participants display */}
        {log.participants && Array.isArray(log.participants) && log.participants.length > 0 && (
          <div className="flex items-start gap-2 text-sm text-gray-300">
            <Users size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-gray-400">With:</span>{' '}
              <span>{log.participants.join(', ')}</span>
            </div>
          </div>
        )}
        
        {/* Body Weight */}
        {log.bodyWeight && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Scale size={14} className="text-gray-500" />
            <span>Weight: </span>
            <button
              onClick={toggleWeightUnit}
              className="hover:bg-gray-700 px-2 py-0.5 rounded transition-colors underline decoration-dotted"
            >
              {getDisplayWeight()} {displayWeightUnit}
            </button>
            {log.postWorkout && (
              <span className="bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                ⚖️ Post-Workout
              </span>
            )}
          </div>
        )}

        {/* Duration */}
        {log.duration && (
          <div className="text-sm text-gray-300">
            Duration: {log.duration} mins
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
        {log.instructor && (
          <div className="text-sm text-gray-300">
            <span className="text-gray-400">Instructor:</span> {log.instructor}
            {getInstructorAverageQuality(log.instructor) && (
              <span className="ml-2 px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full font-semibold">
                Avg: {getInstructorAverageQuality(log.instructor)}/10
              </span>
            )}
          </div>
        )}
        {log.classQuality && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Class Quality:</span>
            <div className="flex gap-1">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-6 rounded ${
                    i < log.classQuality ? 'bg-purple-500' : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-300">{log.classQuality}/10</span>
          </div>
        )}
        {log.drillingPartners && Array.isArray(log.drillingPartners) && log.drillingPartners.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Drilling Partners</p>
            <div className="flex flex-wrap gap-2">
              {log.drillingPartners.map((partner, idx) => {
                // Handle both object and string formats
                const partnerName = typeof partner === 'string' ? partner : partner?.name || 'Unknown';
                // Support both new 'effectiveness' and legacy 'rating' fields
                const effectiveness = typeof partner === 'object' ? (partner?.effectiveness || partner?.rating) : null;
                const avgEffectiveness = getDrillingPartnerAverageEffectiveness(partnerName);
                
                return (
                  <div key={idx} className="relative inline-block">
                    <span
                      className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                      onMouseEnter={() => setHoveredPartner(`drilling-${idx}`)}
                      onMouseLeave={() => setHoveredPartner(null)}
                    >
                      {partnerName}
                      {avgEffectiveness && (
                        <span className="text-[10px] text-purple-400">
                          🧠 {avgEffectiveness}
                        </span>
                      )}
                    </span>
                    {/* Tooltip */}
                    {hoveredPartner === `drilling-${idx}` && effectiveness && (
                      <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap border border-gray-700">
                        <div className="font-semibold mb-1">This Session:</div>
                        <div>Effectiveness: {effectiveness}/10</div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                          <div className="border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {log.techniques && Array.isArray(log.techniques) && log.techniques.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Techniques</p>
            <div className="space-y-2">
              {log.techniques.map((tech, idx) => {
                // Handle both object and string formats
                const techName = typeof tech === 'string' ? tech : tech?.name || 'Unknown Technique';
                const showSource = typeof tech === 'object' && tech !== null;
                const sourceName = showSource 
                  ? (tech.shownByInstructor 
                      ? '👨‍🏫 Instructor' 
                      : (typeof tech.peer === 'string' ? `👥 ${tech.peer}` : '👥 Peer'))
                  : null;
                const techDetails = typeof tech === 'object' ? tech?.details : null;
                const isExpanded = expandedTechniques[idx];
                const hasDetails = techDetails && techDetails.trim();
                
                return (
                  <div key={idx} className="bg-purple-500/10 border border-purple-500/20 rounded-lg overflow-hidden">
                    <div 
                      className={`p-2 ${hasDetails || sourceName ? 'cursor-pointer hover:bg-purple-500/20 transition-colors' : ''}`}
                      onClick={() => {
                        if (hasDetails || sourceName) {
                          setExpandedTechniques(prev => ({ ...prev, [idx]: !prev[idx] }));
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-purple-300 font-medium">
                            {techName}
                          </span>
                          {(hasDetails || sourceName) && (
                            <span className="text-gray-500">
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Expanded Details */}
                    {isExpanded && (hasDetails || sourceName) && (
                      <div className="px-2 pb-2 space-y-2 border-t border-purple-500/20">
                        {sourceName && (
                          <div className="text-xs text-gray-400 mt-2">
                            <span className="font-semibold">Shown by:</span> {sourceName}
                          </div>
                        )}
                        {hasDetails && (
                          <div className="text-xs text-gray-300 bg-purple-500/5 rounded p-2">
                            <span className="font-semibold text-purple-400">Key Details:</span>
                            <p className="mt-1 whitespace-pre-wrap">{techDetails}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {log.sparringRounds && Array.isArray(log.sparringRounds) && log.sparringRounds.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Sparring Rounds</p>
            <div className="flex flex-wrap gap-2">
              {log.sparringRounds.map((round, idx) => {
                // Handle both object and string formats
                const roundName = typeof round === 'string' ? round : round?.name || 'Unknown';
                // Support both new 'effectiveness' and legacy 'rating' fields
                const effectiveness = typeof round === 'object' ? (round?.effectiveness || round?.rating) : null;
                const aggressiveness = typeof round === 'object' ? round?.aggressiveness : null;
                const avgStats = getSparringPartnerAverageStats(roundName);
                
                // Get techniques used (handle both array and string for backward compatibility)
                const techniquesTheyUsed = typeof round === 'object' ? round?.techniquesTheyUsed : null;
                const techniquesIUsed = typeof round === 'object' ? round?.techniquesIUsed : null;
                
                const theirTechniqueArray = Array.isArray(techniquesTheyUsed) 
                  ? techniquesTheyUsed 
                  : (typeof techniquesTheyUsed === 'string' && techniquesTheyUsed.trim() 
                      ? techniquesTheyUsed.split(',').map(t => t.trim()).filter(t => t)
                      : []);
                
                const myTechniqueArray = Array.isArray(techniquesIUsed) 
                  ? techniquesIUsed 
                  : [];
                
                const hasTechniques = myTechniqueArray.length > 0 || theirTechniqueArray.length > 0;
                
                return (
                  <div key={idx} className="relative inline-block">
                    <span
                      className="bg-red-500/20 text-red-300 px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                      onMouseEnter={() => setHoveredPartner(`sparring-${idx}`)}
                      onMouseLeave={() => setHoveredPartner(null)}
                    >
                      {roundName}
                      {(avgStats.effectiveness || avgStats.aggressiveness) && (
                        <span className="flex items-center gap-1 text-[10px]">
                          {avgStats.aggressiveness && (
                            <span className="text-red-400">🔥 {avgStats.aggressiveness}</span>
                          )}
                          {avgStats.effectiveness && (
                            <span className="text-blue-400">🧠 {avgStats.effectiveness}</span>
                          )}
                        </span>
                      )}
                    </span>
                    {/* Tooltip */}
                    {hoveredPartner === `sparring-${idx}` && (effectiveness || aggressiveness || hasTechniques) && (
                      <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg border border-gray-700 min-w-[180px]">
                        <div className="font-semibold mb-1">This Session:</div>
                        {effectiveness && <div>Effectiveness: {effectiveness}/10</div>}
                        {aggressiveness && <div>Aggressiveness: {aggressiveness}/10</div>}
                        {hasTechniques && (
                          <div className="mt-2 pt-2 border-t border-gray-700 space-y-2">
                            {myTechniqueArray.length > 0 && (
                              <div>
                                <div className="font-semibold mb-1 text-green-400">My Offense:</div>
                                <div className="flex flex-wrap gap-1">
                                  {myTechniqueArray.map((tech, techIdx) => (
                                    <span 
                                      key={techIdx}
                                      className="inline-block px-1.5 py-0.5 bg-green-500/20 text-green-300 rounded text-[10px]"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {theirTechniqueArray.length > 0 && (
                              <div>
                                <div className="font-semibold mb-1 text-red-400">Their Offense:</div>
                                <div className="flex flex-wrap gap-1">
                                  {theirTechniqueArray.map((tech, techIdx) => (
                                    <span 
                                      key={techIdx}
                                      className="inline-block px-1.5 py-0.5 bg-red-500/20 text-red-300 rounded text-[10px]"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                          <div className="border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* Legacy partners field support - keeping for backward compatibility with old logs */}
        {log.partners && Array.isArray(log.partners) && log.partners.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Partners</p>
            <div className="flex flex-wrap gap-1">
              {log.partners.map((partner, idx) => {
                // Handle both object and string formats
                const partnerName = typeof partner === 'string' ? partner : partner?.name || 'Unknown';
                const partnerRating = typeof partner === 'object' && partner?.rating ? partner.rating : null;
                
                return (
                  <span
                    key={idx}
                    className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                  >
                    {partnerName}
                    {partnerRating && (
                      <span className="bg-purple-600/40 px-1.5 py-0.5 rounded text-[10px]">
                        {partnerRating}
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
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
            <span className="text-gray-400">Duration:</span> {log.duration} mins
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
            onClick={() => onEdit(log)}
            className="text-gray-500 hover:text-blue-400 transition-colors"
            title="Edit log"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(log.id)}
            className="text-gray-500 hover:text-red-400 transition-colors"
            title="Delete log"
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
