# Jump Rope Activity - User Flow Diagram

## Input Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Select Activity: "Workout"                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                 Select Workout Type: "Cardio"                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│               Select Cardio Type: "Jump Rope"                    │
│                                                                   │
│  ⚠️  Intensity Slider is HIDDEN for Jump Rope                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   ⚡ NEW: Tracking Mode Toggle                   │
│                                                                   │
│   [ Track by Time ]     [ Track by Skips ]                       │
│         (default)                                                 │
└─────────────────────────────────────────────────────────────────┘
           ↓                                    ↓
┌──────────────────────────┐      ┌────────────────────────────────┐
│   Track by Time Mode     │      │    Track by Skips Mode         │
├──────────────────────────┤      ├────────────────────────────────┤
│                          │      │                                │
│ Input: Time (minutes)    │      │ Input: Number of Skips         │
│   Example: 10            │      │   Example: 500                 │
│                          │      │                                │
│ Auto-calculates:         │      │ Auto-calculates:               │
│ • Calories from time     │      │ • Time (100 skips/min)         │
│                          │      │ • Calories from time           │
└──────────────────────────┘      └────────────────────────────────┘
           ↓                                    ↓
┌─────────────────────────────────────────────────────────────────┐
│                  [ ] Weighted Rope? (checkbox)                   │
└─────────────────────────────────────────────────────────────────┘
           ↓ (if checked)
┌─────────────────────────────────────────────────────────────────┐
│                    ⚡ NEW: Rope Weight Input                      │
│                                                                   │
│  Rope Weight: [ 2 ]  (min: 0, max: 20)                          │
│                                                                   │
│  Weight Unit:  [ lbs ]  [ kg ]   ← Toggle                        │
│                 (default)                                         │
│                                                                   │
│  ⚡ Calorie multiplier applies: 1 + (weight_lbs × 0.1)          │
│     Example: 2 lbs = 20% more calories                           │
│              5 lbs = 50% more calories                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│             Estimated Calories Burned: XXX cal                   │
│                    (auto-calculated)                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                        [ Save ] [ Cancel ]                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Feed Display (LogCard)

```
┌──────────────────────────────────────────────────────────────────┐
│  🌪️  Jump Rope                        Today, 2:45 PM  [Edit] [X] │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ⚡ Jump Rope Specific Details:                                   │
│                                                                    │
│  Tracked by Time:                                                 │
│    Time: 10 mins                                                  │
│                                                                    │
│  OR                                                                │
│                                                                    │
│  Tracked by Skips:                                                │
│    Skips: 500                                                     │
│                                                                    │
│  Weighted Rope: [2 lbs] ← CLICK TO TOGGLE                        │
│                  ^^^^^^                                            │
│              (Interactive - switches to kg)                       │
│                                                                    │
├──────────────────────────────────────────────────────────────────┤
│  Weight: [175 lbs] ← CLICK TO TOGGLE                             │
│  Calories: 150 cal                                                │
│                                                                    │
│  Notes: Great workout!                                            │
└──────────────────────────────────────────────────────────────────┘
```

---

## Data Structure (Saved Log Object)

### Example 1: Track by Time with Weighted Rope
```json
{
  "id": "abc123",
  "activityType": "workout",
  "workoutType": "Cardio",
  "cardioType": "Jump Rope",
  "jumpRopeTrackingMode": "Track by Time",
  "jumpRopeTimeMinutes": 10,
  "jumpRopeWeighted": true,
  "jumpRopeWeight": 2,
  "jumpRopeWeightUnit": "lbs",
  "bodyWeight": 175,
  "bodyWeightUnit": "lbs",
  "calories": "150 cal",
  "timestamp": "2026-02-01T14:45:00.000Z"
}
```

### Example 2: Track by Skips (Standard Rope)
```json
{
  "id": "xyz789",
  "activityType": "workout",
  "workoutType": "Cardio",
  "cardioType": "Jump Rope",
  "jumpRopeTrackingMode": "Track by Skips",
  "jumpRopeSkips": 500,
  "jumpRopeWeighted": false,
  "bodyWeight": 175,
  "bodyWeightUnit": "lbs",
  "calories": "125 cal",
  "timestamp": "2026-02-01T14:45:00.000Z"
}
```

---

## Calorie Calculation Formula

### Base Calculation (MET Method)
```
baseCalories = MET × bodyWeight(kg) × time(hours)
```

Where:
- MET for Jump Rope = 11.0
- bodyWeight is converted to kg if needed
- time is in hours

### Mode-Based Time Calculation

**Track by Time Mode:**
```javascript
time(minutes) = formData.jumpRopeTimeMinutes
```

**Track by Skips Mode:**
```javascript
time(minutes) = formData.jumpRopeSkips / 100
// Assumes 100 skips per minute
```

### Weighted Rope Multiplier
```
finalCalories = baseCalories × (1 + (ropeWeight_lbs × 0.1))
```

**Examples:**
- 2 lb rope: `calories × (1 + 0.2) = calories × 1.2` = +20%
- 5 lb rope: `calories × (1 + 0.5) = calories × 1.5` = +50%
- 10 lb rope: `calories × (1 + 1.0) = calories × 2.0` = +100%

### Complete Example
```
User: 175 lbs, 10 minutes, 2 lb weighted rope

1. Convert weight: 175 lbs = 79.4 kg
2. Base calories: 11.0 × 79.4 × (10/60) = 145.6 cal
3. Weighted multiplier: 145.6 × (1 + 0.2) = 174.7 cal
4. Final: 175 cal (rounded)
```

---

## Conditional Field Display Logic

### Intensity Slider
```javascript
Show: workoutType === 'Cardio' && cardioType !== 'Jump Rope'
Hide: cardioType === 'Jump Rope'
```

### Tracking Mode Toggle
```javascript
Show: cardioType === 'Jump Rope'
```

### Time Input
```javascript
Show: cardioType === 'Jump Rope' && jumpRopeTrackingMode === 'Track by Time'
```

### Skips Input
```javascript
Show: cardioType === 'Jump Rope' && jumpRopeTrackingMode === 'Track by Skips'
```

### Rope Weight Input
```javascript
Show: cardioType === 'Jump Rope' && jumpRopeWeighted === true
```

### Rope Weight Unit Toggle
```javascript
Show: cardioType === 'Jump Rope' && jumpRopeWeighted === true
```

---

## Edge Cases & Backward Compatibility

### Old Logs (Pre-Refactor)
```json
{
  "cardioType": "Jump Rope",
  "jumpRopeSkips": 500,
  "jumpRopeTimeMinutes": 5,
  "jumpRopeWeighted": true
  // Missing: jumpRopeTrackingMode, jumpRopeWeight, jumpRopeWeightUnit
}
```

**Display Logic:**
- Shows both skips and time (no tracking mode specified)
- Weighted rope shows as "Yes" without weight details
- Calorie calculation uses legacy logic

### Default Values
- `jumpRopeTrackingMode`: "Track by Time"
- `jumpRopeWeight`: 2
- `jumpRopeWeightUnit`: "lbs"
- `bodyWeight`: 175
- `bodyWeightUnit`: "lbs"

---

## Field State Management

### When Cardio Type Changes
```javascript
// Clear all cardio-specific fields
delete jumpRopeSkips
delete jumpRopeTimeMinutes
delete jumpRopeWeighted
delete jumpRopeWeight
delete jumpRopeWeightUnit
delete jumpRopeTrackingMode

// If switching TO Jump Rope
if (cardioType === 'Jump Rope') {
  jumpRopeTrackingMode = 'Track by Time' // Set default
}
```

### When Tracking Mode Changes
```javascript
// Clear mode-specific fields
if (switchingFrom === 'Track by Time') {
  delete jumpRopeSkips
} else {
  delete jumpRopeTimeMinutes
}
```

### When Weighted Checkbox Unchecked
```javascript
// Retain values in case user re-checks
// No deletion, just hide fields
```

---

This visual guide provides a complete reference for understanding the Jump Rope refactor implementation!
