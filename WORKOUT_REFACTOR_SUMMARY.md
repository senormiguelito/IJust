# Workout Module Refactor Summary

## Overview
This document summarizes the major refactor of the 'Workout' module in the 'I Just' app, including bug fixes, new features, and expanded functionality.

---

## Part 1: Critical UI Bug Fixes ✅

### 1.1 Scrolling Issue (FIXED)
**Problem:** The movement list in the 'Lift' section was not scrollable when it grew long.

**Solution:** Added `max-height: 16rem` (256px) and `overflow-y-auto` to the dynamic list container.

**Location:** `src/components/GenericForm.jsx` - Line 37
```jsx
<div className="space-y-3 max-h-64 overflow-y-auto pr-2">
```

### 1.2 Dropdown Rendering Glitch (FIXED)
**Problem:** When selecting a Workout Type, the text often didn't appear in the dropdown even though state updated.

**Solution:** 
- Added a dynamic `key` prop to force re-render: `key={`${field.name}-${value}`}`
- Added custom dropdown arrow styling with better visual feedback
- Improved onChange handler

**Location:** `src/components/GenericForm.jsx` - Line 259

---

## Part 2: Global Workout Data (NEW) ✅

### 2.1 Body Weight Input
**Feature:** Users can now enter their body weight at the top of any workout form.

**Fields:**
- `bodyWeight` - Number input (default: 175)
- `bodyWeightUnit` - Toggle between 'lbs' and 'kg' (default: 'lbs')

**Location:** `src/config/activityConfig.js` - Lines 13-25

**Usage:** This value is used for METs calorie calculations and future tracking.

### 2.2 Weigh-In Timing
**Feature:** Checkbox to indicate if weight was measured post-workout.

**Field:** `postWorkout` - Boolean (default: false/unchecked = pre-workout)

**Location:** `src/config/activityConfig.js` - Lines 26-31

---

## Part 3: The 'Cardio' Refactor (SCHEMA CHANGE) ✅

### 3.1 Run → Cardio Transformation
**Change:** The 'Run' workout type has been replaced with a broader 'Cardio' type.

**New Selection Flow:**
1. User selects 'Cardio' from Workout Type dropdown
2. A second dropdown appears: 'Cardio Type'
3. Options: Run, Jump Rope, Cycling, Swimming, HIIT, Rowing, Dancing, Other

**Location:** `src/config/activityConfig.js` - Lines 46-57

### 3.2 Duration Field Removal for Cardio
**Change:** The generic 'Duration' field no longer appears when 'Cardio' is selected.

**Reason:** Each cardio type has specific time tracking (more granular).

**Implementation:** Added conditional with `negate: true` flag.

**Location:** `src/config/activityConfig.js` - Lines 32-44

---

## Part 4: Specific Logic per Cardio Type ✅

### 4.1 Run (Enhanced)
**Fields:**
- `runDistance` - Number input
- `runDistanceUnit` - Toggle: 'Miles' or 'Km' (default: Miles)
- `runTimeMinutes` - Number input
- `runTimeSeconds` - Number input (0-59)
- `pace` - Auto-calculated field (READ-ONLY)
- `runComparison` - Historical comparison badge (READ-ONLY)

**Pace Calculation:**
- Displays BOTH min/mile AND min/km regardless of unit selected
- Format: "8:30 min/mile | 5:17 min/km"
- Properly formatted as mm:ss (not decimals)

**Historical Comparison:**
- Checks localStorage for previous runs
- Calculates average pace across all logged runs
- Displays comparison badge:
  - ⚡ "X:XX faster than avg" (if >5 seconds faster)
  - 🐢 "X:XX slower than avg" (if >5 seconds slower)
  - 📊 "On pace with your average" (if within 5 seconds)
  - "First run logged!" (if no history)

**Location:** 
- Config: `src/config/activityConfig.js` - Lines 59-127
- Logic: `src/components/GenericForm.jsx` - Lines 171-235

### 4.2 Jump Rope
**Fields:**
- `jumpRopeSkips` - Number of skips
- `jumpRopeTimeMinutes` - Duration in minutes
- `jumpRopeWeighted` - Checkbox for weighted rope
- `jumpRopeWeight` - Rope weight in lbs (conditional on weighted checkbox)

**Location:** `src/config/activityConfig.js` - Lines 128-163

### 4.3 Cycling
**Fields:**
- `cyclingDistance` - Distance in miles
- `cyclingTimeMinutes` - Duration in minutes
- `cyclingFanBike` - Checkbox for Fan/Assault Bike

**Location:** `src/config/activityConfig.js` - Lines 164-191

### 4.4 Swimming
**Fields:**
- `swimmingDistance` - Distance in meters
- `swimmingTimeMinutes` - Duration in minutes

**Location:** `src/config/activityConfig.js` - Lines 192-211

### 4.5 HIIT
**Fields:**
- `hiitTimeMinutes` - Duration in minutes
- `hiitRounds` - Number of rounds (optional)

**Location:** `src/config/activityConfig.js` - Lines 212-232

### 4.6 Rowing
**Fields:**
- `rowingDistance` - Distance in meters
- `rowingTimeMinutes` - Duration in minutes

**Location:** `src/config/activityConfig.js` - Lines 233-252

### 4.7 Dancing
**Fields:**
- `dancingTimeMinutes` - Duration in minutes
- `dancingStyle` - Text input for dance style (optional)

**Location:** `src/config/activityConfig.js` - Lines 253-273

### 4.8 Other (Custom Cardio)
**Fields:**
- `cardioOtherName` - Custom activity name (required)
- `cardioOtherTimeMinutes` - Duration in minutes

**Location:** `src/config/activityConfig.js` - Lines 274-293

---

## Part 5: Calorie Estimation (METs Formula) ✅

### 5.1 Implementation
**Formula:** `Calories = MET × Body Weight (kg) × Time (hours)`

**MET Values:**
- Run: 9.8
- Jump Rope: 11.0
- Cycling: 8.0
- Swimming: 8.0
- HIIT: 12.0
- Rowing: 8.5
- Dancing: 7.0
- Other: 6.0

**Features:**
- Automatically calculates based on activity type
- Uses global Body Weight from Part 2
- Converts lbs to kg if needed (1 lb = 0.453592 kg)
- Displays result in calories (e.g., "450 cal")
- Updates in real-time as user enters data

**Location:** `src/config/activityConfig.js` - Lines 294-353

### 5.2 Weight Conversion Logic
```javascript
let bodyWeightKg = 79.4; // Default 175 lbs in kg
if (formData.bodyWeight) {
  const weight = parseFloat(formData.bodyWeight);
  bodyWeightKg = formData.bodyWeightUnit === 'kg' ? weight : weight * 0.453592;
}
```

---

## Part 6: Recovery Resources Update ✅

### 6.1 New Recovery Protocols
Added recovery advice for all new cardio types:

- **Jump Rope:** Calf and ankle mobility focus
- **Cycling:** Quads, hip flexors, glutes stretching
- **Swimming:** Shoulder mobility and back stretches
- **HIIT:** Box breathing (same as CrossFit)
- **Rowing:** Back, hamstrings, shoulders stretching
- **Dancing:** Dynamic cool-down
- **Other:** General hydration and stretching

**Location:** `src/config/activityConfig.js` - Lines 356-406

### 6.2 Recovery Modal Logic Update
The form now shows recovery advice based on:
- **Cardio workouts:** Shows advice for the specific `cardioType`
- **Other workouts:** Shows advice for the `workoutType`

**Location:** `src/components/GenericForm.jsx` - Lines 366-373

---

## New Field Types Implemented

### Toggle Field
**Purpose:** Two-option button selector (e.g., lbs/kg, Miles/Km)

**Visual:** Two buttons side-by-side, active state highlighted in blue

**Location:** `src/components/GenericForm.jsx` - Lines 238-259

### Checkbox Field
**Purpose:** Boolean yes/no options

**Visual:** Standard checkbox with label

**Location:** `src/components/GenericForm.jsx` - Lines 261-274

### Historical Field
**Purpose:** Display comparison with historical data

**Visual:** Blue-bordered box with emoji indicators

**Location:** `src/components/GenericForm.jsx` - Lines 276-291

---

## Conditional Logic Enhancement

### Negate Support
Added support for inverted conditional logic:

```javascript
conditional: {
  field: 'workoutType',
  value: 'Cardio',
  negate: true // Show when workoutType is NOT Cardio
}
```

**Location:** `src/components/GenericForm.jsx` - Lines 379-383

---

## Files Modified

1. **src/config/activityConfig.js**
   - Complete refactor of workout fields
   - Added 8 new cardio types
   - Implemented METs calculation
   - Updated recovery resources

2. **src/components/GenericForm.jsx**
   - Fixed scrolling bug in dynamic lists
   - Fixed dropdown rendering glitch
   - Added 3 new field types (toggle, checkbox, historical)
   - Enhanced conditional logic with negate support
   - Improved recovery modal logic
   - Added default value initialization

---

## Testing Checklist

### UI Bug Fixes
- [ ] Lift movements list scrolls when >4 items added
- [ ] Workout Type dropdown displays selected value correctly

### Global Fields
- [ ] Body Weight defaults to 175
- [ ] Weight unit toggle works (lbs/kg)
- [ ] Post-workout checkbox saves correctly

### Cardio Types
- [ ] Run: Distance, time, pace calculation works in both units
- [ ] Run: Historical comparison displays correctly
- [ ] Jump Rope: Weighted rope conditional appears
- [ ] Cycling: Fan bike checkbox works
- [ ] Swimming: Fields appear correctly
- [ ] HIIT: Rounds field optional
- [ ] Rowing: Fields appear correctly
- [ ] Dancing: Style field optional
- [ ] Other: Custom name required

### Calculations
- [ ] Run pace shows in mm:ss format for both units
- [ ] Calories calculate correctly for each cardio type
- [ ] Calories use correct body weight (lbs→kg conversion)

### Recovery
- [ ] Recovery modal shows correct advice for each cardio type
- [ ] Recovery links open correctly

---

## Known Limitations & Future Enhancements

### Current Limitations
1. Historical comparison only works for runs (not other cardio types yet)
2. Body weight is per-workout, not tracked over time
3. No way to edit workout after logging

### Potential Enhancements
1. Add historical tracking for all cardio types
2. Add body weight trend chart
3. Add PR (Personal Record) badges
4. Export workout data to CSV
5. Add workout calendar view
6. Add goal setting and tracking

---

## Data Structure Examples

### Run Workout Log
```json
{
  "activityType": "workout",
  "bodyWeight": 175,
  "bodyWeightUnit": "lbs",
  "postWorkout": false,
  "workoutType": "Cardio",
  "cardioType": "Run",
  "runDistance": 5,
  "runDistanceUnit": "Miles",
  "runTimeMinutes": 40,
  "runTimeSeconds": 15,
  "intensity": 7,
  "calories": "623 cal",
  "notes": "Great morning run!"
}
```

### Jump Rope Workout Log
```json
{
  "activityType": "workout",
  "bodyWeight": 80,
  "bodyWeightUnit": "kg",
  "postWorkout": false,
  "workoutType": "Cardio",
  "cardioType": "Jump Rope",
  "jumpRopeSkips": 1000,
  "jumpRopeTimeMinutes": 15,
  "jumpRopeWeighted": true,
  "jumpRopeWeight": 3,
  "intensity": 8,
  "calories": "220 cal",
  "notes": "Intense session!"
}
```

---

## Conclusion

This refactor successfully:
✅ Fixed critical UI bugs
✅ Added global body weight tracking
✅ Transformed Run into comprehensive Cardio module
✅ Implemented 8 different cardio activity types
✅ Added METs-based calorie estimation
✅ Enhanced historical tracking with run comparisons
✅ Updated recovery resources

The Workout module is now significantly more powerful and user-friendly!
