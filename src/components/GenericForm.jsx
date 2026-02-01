import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, ExternalLink } from 'lucide-react';
import { getRecoveryAdvice } from '../config/activityConfig';

// Component for dynamic list builder
const DynamicListField = ({ field, value, onChange }) => {
  const [items, setItems] = useState(value || []);

  const addItem = () => {
    const newItem = {};
    field.itemSchema.forEach(schemaField => {
      newItem[schemaField.name] = '';
    });
    const newItems = [...items, newItem];
    setItems(newItems);
    onChange(newItems);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    onChange(newItems);
  };

  const updateItem = (index, fieldName, fieldValue) => {
    const newItems = [...items];
    newItems[index][fieldName] = fieldValue;
    setItems(newItems);
    onChange(newItems);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {field.label}
      </label>
      <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
        {items.map((item, index) => (
          <div key={index} className="border border-gray-300 rounded-lg p-3 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                {field.label === 'Movements' ? 'Movement' : 'Exercise'} #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {field.itemSchema.map((schemaField) => (
                <div key={schemaField.name}>
                  {schemaField.type === 'text-or-select' ? (
                    <>
                      <label className="block text-xs text-gray-600 mb-1">
                        {schemaField.label}
                      </label>
                      <input
                        type="text"
                        list={`presets-${index}`}
                        value={item[schemaField.name] || ''}
                        onChange={(e) => updateItem(index, schemaField.name, e.target.value)}
                        placeholder={schemaField.placeholder}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
                      />
                      {field.presets && (
                        <datalist id={`presets-${index}`}>
                          {field.presets.map((preset) => (
                            <option key={preset} value={preset} />
                          ))}
                        </datalist>
                      )}
                    </>
                  ) : (
                    <>
                      <label className="block text-xs text-gray-600 mb-1">
                        {schemaField.label}
                      </label>
                      <input
                        type={schemaField.type}
                        value={item[schemaField.name] || ''}
                        onChange={(e) => updateItem(index, schemaField.name, e.target.value)}
                        placeholder={schemaField.placeholder}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addItem}
        className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        <Plus size={16} />
        Add {field.label === 'Movements' ? 'Movement' : 'Exercise'}
      </button>
    </div>
  );
};

// Component for Recovery Advice display
const RecoveryAdvice = ({ workoutType, onClose }) => {
  const advice = getRecoveryAdvice(workoutType);

  if (!advice) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Recovery Protocol</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 leading-relaxed">{advice.text}</p>
        </div>
        {advice.link && (
          <a
            href={advice.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            <ExternalLink size={18} />
            Watch Guide: {advice.linkText}
          </a>
        )}
        <button
          onClick={onClose}
          className="mt-3 w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const FormField = ({ field, value, onChange, formData }) => {
  const [tags, setTags] = useState(value || []);
  const [inputValue, setInputValue] = useState('');

  const handleTagAdd = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTags = [...tags, inputValue.trim()];
      setTags(newTags);
      onChange(newTags);
      setInputValue('');
    }
  };

  const handleTagRemove = (indexToRemove) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    onChange(newTags);
  };

  // Helper function for historical run comparison
  const getRunComparison = () => {
    if (!formData.runDistance || !formData.runTimeMinutes) return '';
    
    try {
      const logs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
      const runLogs = logs.filter(log => 
        log.activityType === 'workout' && 
        log.cardioType === 'Run' &&
        log.runDistance && 
        log.runTimeMinutes
      );
      
      if (runLogs.length === 0) return 'First run logged!';
      
      // Calculate current pace
      const currentTotalMinutes = parseFloat(formData.runTimeMinutes) + (parseFloat(formData.runTimeSeconds || 0) / 60);
      const currentDistance = parseFloat(formData.runDistance);
      const currentUnit = formData.runDistanceUnit || 'Miles';
      
      // Convert all to miles for comparison
      const currentDistanceInMiles = currentUnit === 'Km' ? currentDistance * 0.621371 : currentDistance;
      const currentPacePerMile = currentTotalMinutes / currentDistanceInMiles;
      
      // Calculate average pace from historical runs
      let totalPaceSum = 0;
      let validRuns = 0;
      
      runLogs.forEach(log => {
        const logTotalMinutes = parseFloat(log.runTimeMinutes) + (parseFloat(log.runTimeSeconds || 0) / 60);
        const logDistance = parseFloat(log.runDistance);
        const logUnit = log.runDistanceUnit || 'Miles';
        const logDistanceInMiles = logUnit === 'Km' ? logDistance * 0.621371 : logDistance;
        const logPacePerMile = logTotalMinutes / logDistanceInMiles;
        
        if (logPacePerMile > 0 && logPacePerMile < 30) { // Sanity check
          totalPaceSum += logPacePerMile;
          validRuns++;
        }
      });
      
      if (validRuns === 0) return 'First run logged!';
      
      const avgPace = totalPaceSum / validRuns;
      const difference = avgPace - currentPacePerMile;
      const diffMinutes = Math.floor(Math.abs(difference));
      const diffSeconds = Math.round((Math.abs(difference) - diffMinutes) * 60);
      
      if (difference > 0.083) { // More than 5 seconds faster
        return `⚡ ${diffMinutes}:${diffSeconds.toString().padStart(2, '0')} faster than avg`;
      } else if (difference < -0.083) { // More than 5 seconds slower
        return `🐢 ${diffMinutes}:${diffSeconds.toString().padStart(2, '0')} slower than avg`;
      } else {
        return `📊 On pace with your average`;
      }
    } catch (error) {
      return '';
    }
  };

  switch (field.type) {
    case 'text':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
          />
        </div>
      );

    case 'number':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="number"
            step="any"
            min={field.min}
            max={field.max}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
          />
        </div>
      );

    case 'toggle':
      const currentValue = value || field.defaultValue || field.options[0];
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
          </label>
          <div className="flex gap-2">
            {field.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onChange(option)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentValue === option
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );

    case 'checkbox':
      return (
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value || field.defaultValue || false}
              onChange={(e) => onChange(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              {field.label}
            </span>
          </label>
        </div>
      );

    case 'calculated':
      const calculatedValue = field.calculate ? field.calculate(formData) : value;
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
          </label>
          <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 font-semibold">
            {calculatedValue || '—'}
          </div>
        </div>
      );

    case 'historical':
      const historicalValue = getRunComparison();
      if (!historicalValue) return null;
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
          </label>
          <div className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg bg-blue-50 text-blue-800 font-semibold">
            {historicalValue}
          </div>
        </div>
      );

    case 'link-button':
      return (
        <div className="mb-4">
          <a
            href={field.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            <ExternalLink size={18} />
            {field.buttonText}
          </a>
        </div>
      );

    case 'dynamic-list':
      return <DynamicListField field={field} value={value} onChange={onChange} />;

    case 'textarea':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-white text-gray-900"
          />
        </div>
      );

    case 'select':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <select
            key={`${field.name}-${value}`}
            value={value || ''}
            onChange={(e) => {
              onChange(e.target.value);
            }}
            required={field.required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900 appearance-none"
            style={{ 
              backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem"
            }}
          >
            <option value="" className="text-gray-500">Select {field.label}</option>
            {field.options.map((option) => (
              <option key={option} value={option} className="text-gray-900">
                {option}
              </option>
            ))}
          </select>
        </div>
      );

    case 'slider':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}: <span className="font-bold text-blue-600">{value || field.defaultValue}</span>
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="range"
            min={field.min}
            max={field.max}
            step={field.step}
            value={value || field.defaultValue}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{field.min}</span>
            <span>{field.max}</span>
          </div>
        </div>
      );

    case 'tags':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleTagRemove(index)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleTagAdd}
            placeholder={field.placeholder}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
          />
        </div>
      );

    default:
      return null;
  }
};

const GenericForm = ({ activityConfig, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({});
  const [showRecovery, setShowRecovery] = useState(false);
  const [submittedWorkoutType, setSubmittedWorkoutType] = useState(null);

  // Initialize default values
  useEffect(() => {
    const initialData = {};
    activityConfig.fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        initialData[field.name] = field.defaultValue;
      }
    });
    setFormData(initialData);
  }, [activityConfig]);

  // Bug 3 Fix: Clean slate sub-fields when parent category changes
  useEffect(() => {
    if (formData.workoutType) {
      // When workout type changes away from Cardio, reset cardio-specific fields
      if (formData.workoutType !== 'Cardio') {
        setFormData((prev) => {
          const newData = { ...prev };
          // Reset cardioType and all cardio-specific sub-fields
          delete newData.cardioType;
          delete newData.runDistance;
          delete newData.runDistanceUnit;
          delete newData.runTimeMinutes;
          delete newData.runTimeSeconds;
          delete newData.pace;
          delete newData.runComparison;
          delete newData.jumpRopeSkips;
          delete newData.jumpRopeTimeMinutes;
          delete newData.jumpRopeWeighted;
          delete newData.jumpRopeWeight;
          delete newData.cyclingDistance;
          delete newData.cyclingTimeMinutes;
          delete newData.cyclingFanBike;
          delete newData.swimmingDistance;
          delete newData.swimmingTimeMinutes;
          delete newData.hiitTimeMinutes;
          delete newData.hiitRounds;
          delete newData.rowingDistance;
          delete newData.rowingTimeMinutes;
          delete newData.dancingTimeMinutes;
          delete newData.dancingStyle;
          delete newData.cardioOtherName;
          delete newData.cardioOtherTimeMinutes;
          delete newData.calories;
          return newData;
        });
      }
    }
  }, [formData.workoutType]);

  // Bug 3 Fix: Reset cardio sub-type fields when cardioType changes
  useEffect(() => {
    if (formData.cardioType) {
      setFormData((prev) => {
        const newData = { ...prev };
        // Keep workoutType, cardioType, but reset all other cardio sub-fields
        delete newData.runDistance;
        delete newData.runDistanceUnit;
        delete newData.runTimeMinutes;
        delete newData.runTimeSeconds;
        delete newData.pace;
        delete newData.runComparison;
        delete newData.jumpRopeSkips;
        delete newData.jumpRopeTimeMinutes;
        delete newData.jumpRopeWeighted;
        delete newData.jumpRopeWeight;
        delete newData.cyclingDistance;
        delete newData.cyclingTimeMinutes;
        delete newData.cyclingFanBike;
        delete newData.swimmingDistance;
        delete newData.swimmingTimeMinutes;
        delete newData.hiitTimeMinutes;
        delete newData.hiitRounds;
        delete newData.rowingDistance;
        delete newData.rowingTimeMinutes;
        delete newData.dancingTimeMinutes;
        delete newData.dancingStyle;
        delete newData.cardioOtherName;
        delete newData.cardioOtherTimeMinutes;
        delete newData.calories;
        return newData;
      });
    }
  }, [formData.cardioType]);

  const handleFieldChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      activityType: activityConfig.id,
      ...formData
    });

    // Show recovery advice if this is a workout
    if (activityConfig.id === 'workout') {
      // For Cardio workouts, show recovery for the specific cardio type
      const recoveryType = formData.workoutType === 'Cardio' ? formData.cardioType : formData.workoutType;
      if (recoveryType) {
        setSubmittedWorkoutType(recoveryType);
        setShowRecovery(true);
      }
    }
  };

  const handleRecoveryClose = () => {
    setShowRecovery(false);
    onCancel(); // Close the form after recovery advice
  };

  // Helper function to check if a field should be displayed
  const shouldDisplayField = (field) => {
    if (!field.conditional) return true;
    const conditionMet = formData[field.conditional.field] === field.conditional.value;
    return field.conditional.negate ? !conditionMet : conditionMet;
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-6 pb-4 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-800">
            I Just {activityConfig.label}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 flex-1">
          {activityConfig.fields.map((field) => 
            shouldDisplayField(field) && (
              <FormField
                key={field.name}
                field={field}
                value={formData[field.name]}
                onChange={(value) => handleFieldChange(field.name, value)}
                formData={formData}
              />
            )
          )}
        </div>

        <div className="flex gap-3 p-6 pt-4 flex-shrink-0 border-t border-gray-200 bg-white">
          <button
            type="submit"
            className={`flex-1 ${activityConfig.color} text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity`}
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>

      {showRecovery && (
        <RecoveryAdvice 
          workoutType={submittedWorkoutType} 
          onClose={handleRecoveryClose}
        />
      )}
    </>
  );
};

export default GenericForm;
