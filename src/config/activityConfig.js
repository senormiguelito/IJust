// Activity configuration schema
// This file defines all activities and their form fields

export const activityConfig = {
  workout: {
    id: 'workout',
    label: 'Workout',
    icon: 'Dumbbell',
    color: 'bg-green-500',
    colorLight: 'bg-green-100',
    colorText: 'text-green-600',
    fields: [
      // Global Body Weight Section
      {
        name: 'bodyWeight',
        label: 'Body Weight',
        type: 'number',
        required: false,
        placeholder: '175',
        defaultValue: 175
      },
      {
        name: 'bodyWeightUnit',
        label: 'Weight Unit',
        type: 'toggle',
        required: false,
        options: ['lbs', 'kg'],
        defaultValue: 'lbs'
      },
      {
        name: 'postWorkout',
        label: 'Measured Post-Workout?',
        type: 'checkbox',
        required: false,
        defaultValue: false
      },
      // Duration field (conditional - not shown for Cardio)
      {
        name: 'duration',
        label: 'Duration (minutes)',
        type: 'number',
        required: true,
        placeholder: '30',
        conditional: {
          field: 'workoutType',
          value: 'Cardio',
          negate: true // Show when workoutType is NOT Cardio
        }
      },
      {
        name: 'workoutType',
        label: 'Type',
        type: 'select',
        required: true,
        options: ['Cardio', 'Lift', 'CrossFit', 'Bodyweight', 'Stretching']
      },
      // Cardio Sub-Type Selection
      {
        name: 'cardioType',
        label: 'Cardio Type',
        type: 'select',
        required: true,
        options: ['Run', 'Jump Rope', 'Cycling', 'Swimming', 'HIIT', 'Rowing', 'Dancing', 'Other'],
        conditional: {
          field: 'workoutType',
          value: 'Cardio'
        }
      },
      {
        name: 'intensity',
        label: 'Intensity',
        type: 'slider',
        required: true,
        min: 1,
        max: 10,
        step: 1,
        defaultValue: 5,
        conditional: {
          field: 'cardioType',
          value: 'Jump Rope',
          negate: true // Show when cardioType is NOT Jump Rope
        }
      },
      // Conditional fields for Run (inside Cardio)
      {
        name: 'runDistance',
        label: 'Distance',
        type: 'number',
        required: true,
        placeholder: '3.1',
        conditional: {
          field: 'cardioType',
          value: 'Run'
        }
      },
      {
        name: 'runDistanceUnit',
        label: 'Distance Unit',
        type: 'toggle',
        required: false,
        options: ['Miles', 'Km'],
        defaultValue: 'Miles',
        conditional: {
          field: 'cardioType',
          value: 'Run'
        }
      },
      {
        name: 'runTimeMinutes',
        label: 'Time (Minutes)',
        type: 'number',
        required: true,
        placeholder: '25',
        conditional: {
          field: 'cardioType',
          value: 'Run'
        }
      },
      {
        name: 'runTimeSeconds',
        label: 'Time (Seconds)',
        type: 'number',
        required: false,
        placeholder: '30',
        min: 0,
        max: 59,
        conditional: {
          field: 'cardioType',
          value: 'Run'
        }
      },
      {
        name: 'pace',
        label: 'Pace',
        type: 'calculated',
        readOnly: true,
        conditional: {
          field: 'cardioType',
          value: 'Run'
        },
        calculate: (formData) => {
          if (formData.runDistance && formData.runTimeMinutes) {
            const totalMinutes = parseFloat(formData.runTimeMinutes) + (parseFloat(formData.runTimeSeconds || 0) / 60);
            const distance = parseFloat(formData.runDistance);
            
            // Calculate pace in both units
            const paceInCurrentUnit = totalMinutes / distance;
            const paceMinutes = Math.floor(paceInCurrentUnit);
            const paceSeconds = Math.round((paceInCurrentUnit - paceMinutes) * 60);
            
            // Convert to other unit
            const distanceInMiles = formData.runDistanceUnit === 'Km' ? distance * 0.621371 : distance;
            const distanceInKm = formData.runDistanceUnit === 'Miles' ? distance * 1.60934 : distance;
            
            const pacePerMile = totalMinutes / distanceInMiles;
            const pacePerKm = totalMinutes / distanceInKm;
            
            const mileMin = Math.floor(pacePerMile);
            const mileSec = Math.round((pacePerMile - mileMin) * 60);
            const kmMin = Math.floor(pacePerKm);
            const kmSec = Math.round((pacePerKm - kmMin) * 60);
            
            return `${mileMin}:${mileSec.toString().padStart(2, '0')} min/mile | ${kmMin}:${kmSec.toString().padStart(2, '0')} min/km`;
          }
          return '';
        }
      },
      {
        name: 'runComparison',
        label: 'vs. Average',
        type: 'historical',
        readOnly: true,
        conditional: {
          field: 'cardioType',
          value: 'Run'
        }
      },
      // Conditional fields for Jump Rope
      {
        name: 'jumpRopeTrackingMode',
        label: 'Tracking Mode',
        type: 'toggle',
        required: false,
        options: ['Track by Time', 'Track by Skips'],
        defaultValue: 'Track by Time',
        conditional: {
          field: 'cardioType',
          value: 'Jump Rope'
        }
      },
      {
        name: 'jumpRopeTimeMinutes',
        label: 'Time (minutes)',
        type: 'number',
        required: true,
        placeholder: '10',
        conditional: {
          field: 'jumpRopeTrackingMode',
          value: 'Track by Time'
        }
      },
      {
        name: 'jumpRopeSkips',
        label: 'Number of Skips',
        type: 'number',
        required: true,
        placeholder: '500',
        conditional: {
          field: 'jumpRopeTrackingMode',
          value: 'Track by Skips'
        }
      },
      {
        name: 'jumpRopeWeighted',
        label: 'Weighted Rope?',
        type: 'checkbox',
        required: false,
        defaultValue: false,
        conditional: {
          field: 'cardioType',
          value: 'Jump Rope'
        }
      },
      {
        name: 'jumpRopeWeight',
        label: 'Rope Weight',
        type: 'number',
        required: true,
        placeholder: '2',
        min: 0,
        max: 20,
        defaultValue: 2,
        conditional: {
          field: 'jumpRopeWeighted',
          value: true
        }
      },
      {
        name: 'jumpRopeWeightUnit',
        label: 'Weight Unit',
        type: 'toggle',
        required: false,
        options: ['lbs', 'kg'],
        defaultValue: 'lbs',
        conditional: {
          field: 'jumpRopeWeighted',
          value: true
        }
      },
      // Conditional fields for Cycling
      {
        name: 'cyclingDistance',
        label: 'Distance (miles)',
        type: 'number',
        required: true,
        placeholder: '10',
        conditional: {
          field: 'cardioType',
          value: 'Cycling'
        }
      },
      {
        name: 'cyclingTimeMinutes',
        label: 'Time (Minutes)',
        type: 'number',
        required: true,
        placeholder: '30',
        conditional: {
          field: 'cardioType',
          value: 'Cycling'
        }
      },
      {
        name: 'cyclingFanBike',
        label: 'Fan Bike (Assault Bike)?',
        type: 'checkbox',
        required: false,
        defaultValue: false,
        conditional: {
          field: 'cardioType',
          value: 'Cycling'
        }
      },
      // Conditional fields for Swimming
      {
        name: 'swimmingDistance',
        label: 'Distance (meters)',
        type: 'number',
        required: true,
        placeholder: '1000',
        conditional: {
          field: 'cardioType',
          value: 'Swimming'
        }
      },
      {
        name: 'swimmingTimeMinutes',
        label: 'Time (Minutes)',
        type: 'number',
        required: true,
        placeholder: '20',
        conditional: {
          field: 'cardioType',
          value: 'Swimming'
        }
      },
      // Conditional fields for HIIT
      {
        name: 'hiitTimeMinutes',
        label: 'Time (Minutes)',
        type: 'number',
        required: true,
        placeholder: '20',
        conditional: {
          field: 'cardioType',
          value: 'HIIT'
        }
      },
      {
        name: 'hiitRounds',
        label: 'Number of Rounds',
        type: 'number',
        required: false,
        placeholder: '8',
        conditional: {
          field: 'cardioType',
          value: 'HIIT'
        }
      },
      // Conditional fields for Rowing
      {
        name: 'rowingDistance',
        label: 'Distance (meters)',
        type: 'number',
        required: true,
        placeholder: '5000',
        conditional: {
          field: 'cardioType',
          value: 'Rowing'
        }
      },
      {
        name: 'rowingTimeMinutes',
        label: 'Time (Minutes)',
        type: 'number',
        required: true,
        placeholder: '20',
        conditional: {
          field: 'cardioType',
          value: 'Rowing'
        }
      },
      // Conditional fields for Dancing
      {
        name: 'dancingTimeMinutes',
        label: 'Time (Minutes)',
        type: 'number',
        required: true,
        placeholder: '30',
        conditional: {
          field: 'cardioType',
          value: 'Dancing'
        }
      },
      {
        name: 'dancingStyle',
        label: 'Dance Style',
        type: 'text',
        required: false,
        placeholder: 'e.g., Salsa, Hip-Hop',
        conditional: {
          field: 'cardioType',
          value: 'Dancing'
        }
      },
      // Conditional fields for Other
      {
        name: 'cardioOtherName',
        label: 'Activity Name',
        type: 'text',
        required: true,
        placeholder: 'Enter activity name',
        conditional: {
          field: 'cardioType',
          value: 'Other'
        }
      },
      {
        name: 'cardioOtherTimeMinutes',
        label: 'Time (Minutes)',
        type: 'number',
        required: true,
        placeholder: '30',
        conditional: {
          field: 'cardioType',
          value: 'Other'
        }
      },
      // Calorie estimation for all Cardio types
      {
        name: 'calories',
        label: 'Estimated Calories Burned',
        type: 'calculated',
        readOnly: true,
        conditional: {
          field: 'workoutType',
          value: 'Cardio'
        },
        calculate: (formData) => {
          // MET values for different activities
          const metValues = {
            'Run': 9.8,
            'Jump Rope': 11.0,
            'Cycling': 8.0,
            'Swimming': 8.0,
            'HIIT': 12.0,
            'Rowing': 8.5,
            'Dancing': 7.0,
            'Other': 6.0
          };
          
          const cardioType = formData.cardioType;
          if (!cardioType) return '';
          
          const met = metValues[cardioType] || 6.0;
          
          // Get time in minutes based on cardio type
          let timeInMinutes = 0;
          if (cardioType === 'Run') {
            timeInMinutes = parseFloat(formData.runTimeMinutes || 0);
          } else if (cardioType === 'Jump Rope') {
            // Mode-based calculation
            const trackingMode = formData.jumpRopeTrackingMode || 'Track by Time';
            
            if (trackingMode === 'Track by Time') {
              timeInMinutes = parseFloat(formData.jumpRopeTimeMinutes || 0);
            } else {
              // Track by Skips: Auto-calculate time (assume 100 skips/min)
              const skips = parseFloat(formData.jumpRopeSkips || 0);
              timeInMinutes = skips / 100;
            }
          } else if (cardioType === 'Cycling') {
            timeInMinutes = parseFloat(formData.cyclingTimeMinutes || 0);
          } else if (cardioType === 'Swimming') {
            timeInMinutes = parseFloat(formData.swimmingTimeMinutes || 0);
          } else if (cardioType === 'HIIT') {
            timeInMinutes = parseFloat(formData.hiitTimeMinutes || 0);
          } else if (cardioType === 'Rowing') {
            timeInMinutes = parseFloat(formData.rowingTimeMinutes || 0);
          } else if (cardioType === 'Dancing') {
            timeInMinutes = parseFloat(formData.dancingTimeMinutes || 0);
          } else if (cardioType === 'Other') {
            timeInMinutes = parseFloat(formData.cardioOtherTimeMinutes || 0);
          }
          
          // Get body weight in kg
          let bodyWeightKg = 79.4; // Default 175 lbs in kg
          if (formData.bodyWeight) {
            const weight = parseFloat(formData.bodyWeight);
            bodyWeightKg = formData.bodyWeightUnit === 'kg' ? weight : weight * 0.453592;
          }
          
          // Calculate base calories: MET * weight(kg) * time(hours)
          const timeInHours = timeInMinutes / 60;
          let calories = met * bodyWeightKg * timeInHours;
          
          // Jump Rope: Apply weighted rope multiplier
          if (cardioType === 'Jump Rope' && formData.jumpRopeWeighted) {
            const ropeWeight = parseFloat(formData.jumpRopeWeight || 2);
            const ropeWeightUnit = formData.jumpRopeWeightUnit || 'lbs';
            const ropeWeightInLbs = ropeWeightUnit === 'kg' ? ropeWeight * 2.20462 : ropeWeight;
            
            // Multiply by (1 + ropeWeightInLbs * 0.1)
            calories = calories * (1 + (ropeWeightInLbs * 0.1));
          }
          
          return Math.round(calories) + ' cal';
        }
      },
      // Conditional fields for Lift
      {
        name: 'movements',
        label: 'Movements',
        type: 'dynamic-list',
        required: false,
        conditional: {
          field: 'workoutType',
          value: 'Lift'
        },
        itemSchema: [
          {
            name: 'exerciseName',
            label: 'Exercise Name',
            type: 'text',
            placeholder: 'e.g., Squat'
          },
          {
            name: 'sets',
            label: 'Number of Sets',
            type: 'number',
            placeholder: '3'
          },
          {
            name: 'maxWeight',
            label: 'Max Weight (lbs)',
            type: 'number',
            placeholder: '185'
          },
          {
            name: 'reps',
            label: 'Reps',
            type: 'number',
            placeholder: '8'
          }
        ]
      },
      // Conditional fields for CrossFit
      {
        name: 'sugarwod',
        label: 'SugarWOD',
        type: 'link-button',
        buttonText: 'Launch SugarWOD',
        url: 'https://www.sugarwod.com',
        conditional: {
          field: 'workoutType',
          value: 'CrossFit'
        }
      },
      {
        name: 'wodDescription',
        label: 'WOD Description',
        type: 'textarea',
        required: false,
        placeholder: 'Describe the WOD...',
        conditional: {
          field: 'workoutType',
          value: 'CrossFit'
        }
      },
      {
        name: 'scoreTime',
        label: 'Score/Time',
        type: 'text',
        required: false,
        placeholder: 'e.g., 12:34 or 150 reps',
        conditional: {
          field: 'workoutType',
          value: 'CrossFit'
        }
      },
      // Conditional fields for Bodyweight
      {
        name: 'bodyweightExercises',
        label: 'Exercises',
        type: 'dynamic-list',
        required: false,
        conditional: {
          field: 'workoutType',
          value: 'Bodyweight'
        },
        presets: ['Pull-ups', 'Push-ups', 'Dips', 'Handstand Holds', 'L-Sits'],
        itemSchema: [
          {
            name: 'exerciseName',
            label: 'Exercise Name',
            type: 'text-or-select',
            placeholder: 'Select or type custom'
          },
          {
            name: 'time',
            label: 'Time (seconds)',
            type: 'number',
            placeholder: '60',
            required: false
          },
          {
            name: 'sets',
            label: 'Sets',
            type: 'number',
            placeholder: '3',
            required: false
          },
          {
            name: 'reps',
            label: 'Reps',
            type: 'number',
            placeholder: '10',
            required: false
          }
        ]
      },
      {
        name: 'notes',
        label: 'Notes',
        type: 'textarea',
        required: false,
        placeholder: 'How did it feel?'
      }
    ]
  },
  
  jiujitsu: {
    id: 'jiujitsu',
    label: 'Jiu-Jitsu',
    icon: 'HandMetal',
    color: 'bg-purple-500',
    colorLight: 'bg-purple-100',
    colorText: 'text-purple-600',
    fields: [
      // Global Body Weight Section
      {
        name: 'bodyWeight',
        label: 'Body Weight',
        type: 'number',
        required: false,
        placeholder: '160',
        defaultValue: 160
      },
      {
        name: 'bodyWeightUnit',
        label: 'Weight Unit',
        type: 'toggle',
        required: false,
        options: ['lbs', 'kg'],
        defaultValue: 'lbs'
      },
      {
        name: 'duration',
        label: 'Duration (minutes)',
        type: 'number',
        required: true,
        placeholder: '90'
      },
      {
        name: 'instructor',
        label: 'Instructor',
        type: 'creatable-select',
        required: false,
        placeholder: 'Select or add instructor',
        storageKey: 'ijust_instructors' // For LocalStorage
      },
      {
        name: 'classQuality',
        label: 'Class Quality',
        type: 'slider',
        required: false,
        min: 1,
        max: 10,
        step: 1,
        defaultValue: 7
      },
      {
        name: 'drillingPartners',
        label: 'Drilling Partner(s)',
        type: 'drilling-partners',
        required: false,
        placeholder: 'Add drilling partner'
      },
      {
        name: 'techniques',
        label: 'Techniques',
        type: 'technique-list',
        required: false,
        placeholder: 'Add technique'
      },
      {
        name: 'sparringRounds',
        label: 'Sparring Rounds',
        type: 'sparring-rounds',
        required: false,
        placeholder: 'Add sparring partner',
        maxItems: 15
      },
      {
        name: 'reflection',
        label: 'Reflection',
        type: 'textarea',
        required: false,
        placeholder: 'What did you learn today?'
      }
    ]
  },
  
  music: {
    id: 'music',
    label: 'Music',
    icon: 'Music',
    color: 'bg-indigo-500',
    colorLight: 'bg-indigo-100',
    colorText: 'text-indigo-600',
    fields: [
      {
        name: 'instrument',
        label: 'Instrument',
        type: 'select',
        required: true,
        options: ['Drums', 'Guitar', 'Synth']
      },
      {
        name: 'sessionType',
        label: 'Type',
        type: 'select',
        required: true,
        options: ['Practice', 'Jam', 'Record']
      },
      {
        name: 'duration',
        label: 'Duration (minutes)',
        type: 'number',
        required: true,
        placeholder: '60'
      },
      {
        name: 'notes',
        label: 'Notes',
        type: 'textarea',
        required: false,
        placeholder: 'What did you work on?'
      }
    ]
  },
  
  social: {
    id: 'social',
    label: 'Social',
    icon: 'Users',
    color: 'bg-pink-500',
    colorLight: 'bg-pink-100',
    colorText: 'text-pink-600',
    fields: [
      {
        name: 'who',
        label: 'Who',
        type: 'text',
        required: true,
        placeholder: 'Who did you hang out with?'
      },
      {
        name: 'activity',
        label: 'Activity',
        type: 'text',
        required: true,
        placeholder: 'What did you do?'
      },
      {
        name: 'location',
        label: 'Location',
        type: 'text',
        required: false,
        placeholder: 'Where?'
      }
    ]
  },
  
  creative: {
    id: 'creative',
    label: 'Creative',
    icon: 'Palette',
    color: 'bg-orange-500',
    colorLight: 'bg-orange-100',
    colorText: 'text-orange-600',
    fields: [
      {
        name: 'creativeType',
        label: 'Type',
        type: 'select',
        required: true,
        options: ['Write', 'Draw', 'Cook']
      },
      {
        name: 'output',
        label: 'Output Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe what you created...'
      }
    ]
  }
};

// Recovery resources for workout types
export const recoveryResources = {
  // Cardio types
  Run: {
    text: 'Hydrate with electrolytes. Focus stretch: Soleus & Hip Flexors.',
    link: 'https://www.youtube.com/watch?v=eLMuz5a5mb0',
    linkText: '10 Min Mobility for Runners'
  },
  'Jump Rope': {
    text: 'Hydrate well. Focus on calf and ankle mobility. Ice if needed.',
    link: 'https://www.youtube.com/watch?v=wQXKdHaihZ0',
    linkText: 'Calf & Ankle Recovery'
  },
  Cycling: {
    text: 'Hydrate with electrolytes. Stretch quads, hip flexors, and glutes.',
    link: 'https://www.youtube.com/watch?v=7JZQKvw7etI',
    linkText: 'Cyclist Stretching Routine'
  },
  Swimming: {
    text: 'Protein within 30 minutes. Focus on shoulder mobility and back stretches.',
    link: 'https://www.youtube.com/watch?v=1VYlOKUdylM',
    linkText: 'Swimmer Recovery Routine'
  },
  HIIT: {
    text: '3 mins of box breathing to lower cortisol. Active recovery walk recommended.',
    link: 'https://www.youtube.com/watch?v=lVagJpXOOc4',
    linkText: 'Box Breathing Guide'
  },
  Rowing: {
    text: 'Hydrate with electrolytes. Stretch back, hamstrings, and shoulders.',
    link: 'https://www.youtube.com/watch?v=UBdGGBBpCpg',
    linkText: 'Rowing Recovery Stretches'
  },
  Dancing: {
    text: 'Hydrate well. Dynamic cool-down with light movement recommended.',
    link: 'https://www.youtube.com/watch?v=g_tea8ZNk5A',
    linkText: 'Dance Cool Down Routine'
  },
  Other: {
    text: 'Hydrate well and listen to your body. Stretch the primary muscle groups used.',
    link: null,
    linkText: null
  },
  // Other workout types
  Lift: {
    text: 'Consume 20-30g Protein + Carbs within 45 mins. Static stretching to down-regulate.',
    link: 'https://www.youtube.com/watch?v=0glTOgP0OOo',
    linkText: 'Post-Lift Mobility Routine'
  },
  CrossFit: {
    text: '3 mins of box breathing to lower cortisol. Active recovery walk recommended.',
    link: 'https://www.youtube.com/watch?v=lVagJpXOOc4',
    linkText: 'Box Breathing Guide'
  },
  Bodyweight: {
    text: 'Focus on wrist and shoulder mobility work.',
    link: 'https://www.youtube.com/watch?v=pWNv6oE-5RI',
    linkText: 'Wrist & Shoulder Mobility'
  },
  Stretching: {
    text: 'Great work! Maintain consistency for flexibility gains.',
    link: null,
    linkText: null
  }
};

export const getActivityConfig = (activityId) => {
  return activityConfig[activityId];
};

export const getAllActivities = () => {
  return Object.values(activityConfig);
};

export const getRecoveryAdvice = (workoutType) => {
  return recoveryResources[workoutType] || null;
};

// Get default social context settings based on activity type
export const getDefaultSocialContext = (activityId) => {
  // Jiu-Jitsu defaults to social (isSolo = false)
  if (activityId === 'jiujitsu') {
    return { isSolo: false, participants: [] };
  }
  // All other activities default to solo (isSolo = true)
  return { isSolo: true, participants: [] };
};
