# Workout Module - User Flow Guide

## New User Experience Flow

### Step 1: Initial Form (Always Visible)
```
┌─────────────────────────────────────────┐
│         I Just Workout                  │
├─────────────────────────────────────────┤
│                                         │
│ Body Weight        [175]                │
│ Weight Unit        [lbs] [kg]           │
│ ☐ Measured Post-Workout?                │
│                                         │
│ Type              [Select Type ▼]       │
│                                         │
└─────────────────────────────────────────┘
```

---

### Step 2a: User Selects "Cardio"
```
┌─────────────────────────────────────────┐
│         I Just Workout                  │
├─────────────────────────────────────────┤
│                                         │
│ Body Weight        [175]                │
│ Weight Unit        [lbs] [kg]           │
│ ☐ Measured Post-Workout?                │
│                                         │
│ Type              [Cardio ▼]            │
│                                         │
│ Cardio Type       [Select Type ▼]      │ ← NEW
│                                         │
│ Intensity         ●━━━━━━━━━━ 5/10      │
│                                         │
└─────────────────────────────────────────┘
```

**Note:** Duration field is HIDDEN for Cardio (each type has specific time tracking)

---

### Step 2b: User Selects "Lift" (Non-Cardio Example)
```
┌─────────────────────────────────────────┐
│         I Just Workout                  │
├─────────────────────────────────────────┤
│                                         │
│ Body Weight        [175]                │
│ Weight Unit        [lbs] [kg]           │
│ ☐ Measured Post-Workout?                │
│                                         │
│ Duration (minutes) [30]                 │ ← Shows for non-Cardio
│                                         │
│ Type              [Lift ▼]              │
│                                         │
│ Intensity         ●━━━━━━━━━━ 5/10      │
│                                         │
│ Movements                               │
│ ┌───────────────────────────────────┐   │
│ │ Movement #1              [trash] │   │
│ │ Exercise: Squat                  │   │
│ │ Sets: 3   Weight: 185   Reps: 8 │   │
│ └───────────────────────────────────┘   │
│ [+ Add Movement]                        │
│                                         │
└─────────────────────────────────────────┘
```

---

### Step 3: User Selects Cardio Type = "Run"
```
┌─────────────────────────────────────────┐
│         I Just Workout                  │
├─────────────────────────────────────────┤
│                                         │
│ Body Weight        [175]                │
│ Weight Unit        [lbs] [kg]           │
│ ☐ Measured Post-Workout?                │
│                                         │
│ Type              [Cardio ▼]            │
│ Cardio Type       [Run ▼]               │
│                                         │
│ Intensity         ●━━━━━━━●━━━ 7/10     │
│                                         │
│ Distance          [5.0]                 │ ← RUN SPECIFIC
│ Distance Unit     [Miles] [Km]          │ ← RUN SPECIFIC
│                                         │
│ Time (Minutes)    [40]                  │ ← RUN SPECIFIC
│ Time (Seconds)    [15]                  │ ← RUN SPECIFIC
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Pace                                │ │ ← CALCULATED
│ │ 8:03 min/mile | 5:00 min/km         │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ vs. Average                         │ │ ← HISTORICAL
│ │ ⚡ 0:15 faster than avg              │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Estimated Calories Burned           │ │ ← CALCULATED
│ │ 623 cal                             │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Notes             [Optional...]         │
│                                         │
│ [Save]  [Cancel]                        │
└─────────────────────────────────────────┘
```

---

### Step 4: User Selects Cardio Type = "Jump Rope"
```
┌─────────────────────────────────────────┐
│         I Just Workout                  │
├─────────────────────────────────────────┤
│                                         │
│ Body Weight        [175]                │
│ Weight Unit        [lbs] [kg]           │
│ ☐ Measured Post-Workout?                │
│                                         │
│ Type              [Cardio ▼]            │
│ Cardio Type       [Jump Rope ▼]        │
│                                         │
│ Intensity         ●━━━━━━━━●━━ 8/10     │
│                                         │
│ Number of Skips   [1000]                │ ← JUMP ROPE SPECIFIC
│ Time (Minutes)    [15]                  │ ← JUMP ROPE SPECIFIC
│                                         │
│ ☑ Weighted Rope?                        │ ← JUMP ROPE SPECIFIC
│                                         │
│ Rope Weight (lbs) [3]                   │ ← CONDITIONAL (only if checked)
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Estimated Calories Burned           │ │ ← CALCULATED
│ │ 220 cal                             │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Notes             [Optional...]         │
│                                         │
│ [Save]  [Cancel]                        │
└─────────────────────────────────────────┘
```

---

### Step 5: User Selects Cardio Type = "Cycling"
```
┌─────────────────────────────────────────┐
│         I Just Workout                  │
├─────────────────────────────────────────┤
│                                         │
│ Body Weight        [175]                │
│ Weight Unit        [lbs] [kg]           │
│ ☐ Measured Post-Workout?                │
│                                         │
│ Type              [Cardio ▼]            │
│ Cardio Type       [Cycling ▼]          │
│                                         │
│ Intensity         ●━━━━━━━━━● 9/10      │
│                                         │
│ Distance (miles)  [10]                  │ ← CYCLING SPECIFIC
│ Time (Minutes)    [30]                  │ ← CYCLING SPECIFIC
│                                         │
│ ☑ Fan Bike (Assault Bike)?              │ ← CYCLING SPECIFIC
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Estimated Calories Burned           │ │ ← CALCULATED
│ │ 380 cal                             │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Notes             [Optional...]         │
│                                         │
│ [Save]  [Cancel]                        │
└─────────────────────────────────────────┘
```

---

### Step 6: User Selects Cardio Type = "Other"
```
┌─────────────────────────────────────────┐
│         I Just Workout                  │
├─────────────────────────────────────────┤
│                                         │
│ Body Weight        [175]                │
│ Weight Unit        [lbs] [kg]           │
│ ☐ Measured Post-Workout?                │
│                                         │
│ Type              [Cardio ▼]            │
│ Cardio Type       [Other ▼]            │
│                                         │
│ Intensity         ●━━━━━━━━━━ 5/10      │
│                                         │
│ Activity Name     [Kickboxing]          │ ← OTHER SPECIFIC (custom)
│ Time (Minutes)    [45]                  │ ← OTHER SPECIFIC
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Estimated Calories Burned           │ │ ← CALCULATED
│ │ 340 cal                             │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Notes             [Optional...]         │
│                                         │
│ [Save]  [Cancel]                        │
└─────────────────────────────────────────┘
```

---

## Field Type Legend

### Standard Input
```
Label               [value]
```

### Toggle Button
```
Label               [Option A] [Option B]
                     ^ACTIVE^   ^INACTIVE^
```

### Checkbox
```
☐ Unchecked Label
☑ Checked Label
```

### Slider
```
Label               ●━━━━━━━━━━ 5/10
                    ^THUMB^
```

### Calculated/Display Field (Read-Only)
```
┌─────────────────────────────────────┐
│ Label                               │
│ Calculated Value                    │
└─────────────────────────────────────┘
```

### Historical Field (Read-Only with Badge)
```
┌─────────────────────────────────────┐
│ Label                               │
│ ⚡ Badge with emoji indicator        │
└─────────────────────────────────────┘
```

---

## Quick Reference: All Cardio Types

| Cardio Type | Specific Fields | Special Features |
|-------------|----------------|------------------|
| **Run** | Distance, Time (Min/Sec), Unit Toggle | Pace calc (both units), Historical comparison |
| **Jump Rope** | Skips, Time, Weighted?, Weight | Conditional rope weight field |
| **Cycling** | Distance, Time, Fan Bike? | Checkbox for assault bike |
| **Swimming** | Distance (meters), Time | Standard distance/time |
| **HIIT** | Time, Rounds | Optional rounds tracking |
| **Rowing** | Distance (meters), Time | Standard distance/time |
| **Dancing** | Time, Style | Optional style text field |
| **Other** | Custom Name, Time | Fully customizable |

**All types include:**
- Body Weight tracking
- Post-workout checkbox
- Intensity slider
- METs-based calorie estimation
- Recovery advice modal

---

## Key UI/UX Improvements

### ✅ Bug Fixes
1. **Scrollable Lists**: Dynamic lists (Movements, Exercises) now scroll after 4 items
2. **Dropdown Rendering**: Select dropdowns now reliably show selected values

### ✅ Better Data Entry
1. **Time Entry**: Separate minutes/seconds fields for precision
2. **Unit Toggles**: Visual button toggles instead of dropdowns
3. **Smart Defaults**: Body weight defaults to 175 lbs
4. **Conditional Fields**: Only relevant fields show based on selections

### ✅ Real-Time Feedback
1. **Pace Calculation**: Updates as you type distance/time
2. **Calorie Estimation**: Live calculation based on all inputs
3. **Historical Badges**: Instant comparison with previous runs
4. **Recovery Modal**: Context-specific recovery advice after logging

---

## Color Coding (Visual Reference)

- **Blue**: Interactive elements (buttons, selected state)
- **Gray**: Inactive/unselected state
- **Green**: Submit/Save actions
- **Red**: Delete/Remove actions
- **Light Gray**: Read-only calculated fields
- **Light Blue**: Historical/badge fields

---

## Tips for Using the New System

1. **Enter Body Weight First**: This ensures accurate calorie calculations
2. **Use Historical Badge**: Compare your run pace to see improvement
3. **Try Different Cardio Types**: Each has unique tracking features
4. **Post-Workout Checkbox**: Track when you weigh yourself for pattern analysis
5. **Notes Field**: Great for tracking how you felt or conditions (weather, energy, etc.)
