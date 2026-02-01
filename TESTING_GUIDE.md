# Workout Module - Testing & Validation Guide

## Pre-Testing Checklist

Before you start testing, make sure:
- [ ] You've saved all files
- [ ] Your development server is running (`npm start` or similar)
- [ ] You've cleared localStorage if you want a fresh start: `localStorage.clear()`
- [ ] Your browser console is open (F12) to catch any errors

---

## Test Suite 1: UI Bug Fixes

### Test 1.1: Scrolling in Lift Movements
**Steps:**
1. Click "I Just..." button
2. Select "Workout"
3. Select Type: "Lift"
4. Add 5+ movements using the "+ Add Movement" button
5. Scroll within the movements container

**Expected Result:**
- ✅ Container should have a max height
- ✅ Scrollbar should appear
- ✅ You can scroll to see earlier movements
- ✅ Scrolling is smooth and doesn't affect page scroll

**If Failed:**
- Check: `src/components/GenericForm.jsx` line 37
- Should contain: `max-h-64 overflow-y-auto pr-2`

---

### Test 1.2: Dropdown Rendering for Workout Type
**Steps:**
1. Click "I Just..." button
2. Select "Workout"
3. Open "Type" dropdown
4. Select "Cardio"
5. Verify "Cardio" appears in the dropdown box (not blank)
6. Change to "Lift"
7. Verify "Lift" appears in the dropdown box

**Expected Result:**
- ✅ Selected value always displays in the dropdown
- ✅ Dropdown never appears blank after selection
- ✅ Custom arrow icon appears on the right side

**If Failed:**
- Check: `src/components/GenericForm.jsx` line 385
- Should have: `key={`${field.name}-${value}`}`

---

## Test Suite 2: Global Body Weight Fields

### Test 2.1: Body Weight Input
**Steps:**
1. Open a new Workout form
2. Observe the "Body Weight" field at the top

**Expected Result:**
- ✅ Body Weight field appears first (before Type selection)
- ✅ Default value is 175
- ✅ Can type custom value

**Test Cases:**
```
Input: 150 → Should accept
Input: 200.5 → Should accept decimals
Input: -50 → Should accept (no validation yet)
Input: abc → Should NOT accept (number only)
```

---

### Test 2.2: Weight Unit Toggle
**Steps:**
1. Open a new Workout form
2. Observe "Weight Unit" toggle buttons
3. Click "kg"
4. Click "lbs"

**Expected Result:**
- ✅ Two buttons side-by-side: [lbs] [kg]
- ✅ Default is "lbs" (blue background)
- ✅ Clicking "kg" makes it blue, "lbs" becomes gray
- ✅ Clicking "lbs" toggles back

**Visual Check:**
- Active state: Blue background, white text
- Inactive state: Gray background, gray text

---

### Test 2.3: Post-Workout Checkbox
**Steps:**
1. Open a new Workout form
2. Find "Measured Post-Workout?" checkbox
3. Click to check it
4. Click to uncheck it

**Expected Result:**
- ✅ Checkbox appears below weight unit toggle
- ✅ Default is unchecked
- ✅ Clicking toggles the checkmark
- ✅ Has proper label text

---

## Test Suite 3: Cardio Type Selection

### Test 3.1: Cardio Sub-Type Dropdown Appears
**Steps:**
1. Open Workout form
2. Select Type: "Cardio"

**Expected Result:**
- ✅ "Cardio Type" dropdown appears immediately
- ✅ Dropdown has all 8 options:
  - Run
  - Jump Rope
  - Cycling
  - Swimming
  - HIIT
  - Rowing
  - Dancing
  - Other

---

### Test 3.2: Duration Field Hidden for Cardio
**Steps:**
1. Open Workout form
2. Observe form BEFORE selecting type (Duration should appear)
3. Select Type: "Lift" (Duration should remain)
4. Select Type: "Cardio" (Duration should disappear)
5. Select Type: "CrossFit" (Duration should appear again)

**Expected Result:**
- ✅ Duration field shows for: Lift, CrossFit, Bodyweight, Stretching
- ✅ Duration field HIDES for: Cardio
- ✅ No empty space left when hidden

---

## Test Suite 4: Run Type Testing

### Test 4.1: Run Fields Appear
**Steps:**
1. Select Type: "Cardio"
2. Select Cardio Type: "Run"

**Expected Result:**
- ✅ "Distance" field appears
- ✅ "Distance Unit" toggle appears (Miles/Km)
- ✅ "Time (Minutes)" field appears
- ✅ "Time (Seconds)" field appears
- ✅ "Pace" calculated field appears
- ✅ "vs. Average" historical field appears
- ✅ "Estimated Calories Burned" appears

---

### Test 4.2: Pace Calculation (Miles)
**Steps:**
1. Select Cardio Type: "Run"
2. Distance Unit: "Miles"
3. Enter Distance: 5
4. Enter Time (Minutes): 40
5. Enter Time (Seconds): 0

**Expected Result:**
- ✅ Pace shows: "8:00 min/mile | 4:58 min/km"
- ✅ Format is mm:ss (not decimals like 8.5)
- ✅ Updates in real-time as you type

**Test More Values:**
```
Distance: 3.1 miles, Time: 25:00
Expected Pace: ~8:04 min/mile | ~5:00 min/km

Distance: 10 miles, Time: 80:30
Expected Pace: 8:03 min/mile | 5:00 min/km
```

---

### Test 4.3: Pace Calculation (Kilometers)
**Steps:**
1. Select Cardio Type: "Run"
2. Distance Unit: "Km"
3. Enter Distance: 5
4. Enter Time (Minutes): 25
5. Enter Time (Seconds): 0

**Expected Result:**
- ✅ Pace shows: "8:02 min/mile | 5:00 min/km"
- ✅ Conversion is accurate
- ✅ Both units display regardless of input unit

---

### Test 4.4: Historical Comparison (First Run)
**Steps:**
1. Clear localStorage: `localStorage.clear()`
2. Enter a run (any distance/time)
3. Observe "vs. Average" field

**Expected Result:**
- ✅ Shows: "First run logged!"
- ✅ No emoji or comparison

---

### Test 4.5: Historical Comparison (Faster Run)
**Steps:**
1. Log a run: 5 miles in 45:00 (9:00 pace)
2. Save it
3. Start NEW workout form
4. Enter run: 5 miles in 40:00 (8:00 pace)
5. Observe "vs. Average" field

**Expected Result:**
- ✅ Shows: "⚡ 1:00 faster than avg" (or similar)
- ✅ Lightning bolt emoji appears
- ✅ Time difference is accurate

---

### Test 4.6: Historical Comparison (Slower Run)
**Steps:**
1. Log a fast run: 5 miles in 35:00 (7:00 pace)
2. Save it
3. Start NEW workout form
4. Enter run: 5 miles in 50:00 (10:00 pace)
5. Observe "vs. Average" field

**Expected Result:**
- ✅ Shows: "🐢 3:00 slower than avg" (or similar)
- ✅ Turtle emoji appears
- ✅ Time difference is accurate

---

## Test Suite 5: Other Cardio Types

### Test 5.1: Jump Rope
**Steps:**
1. Select Cardio Type: "Jump Rope"

**Expected Result:**
- ✅ "Number of Skips" field appears
- ✅ "Time (Minutes)" field appears
- ✅ "Weighted Rope?" checkbox appears
- ✅ "Rope Weight" field HIDDEN by default

**Then:**
1. Check "Weighted Rope?"

**Expected Result:**
- ✅ "Rope Weight (lbs)" field appears
- ✅ Can enter numeric value

---

### Test 5.2: Cycling
**Steps:**
1. Select Cardio Type: "Cycling"

**Expected Result:**
- ✅ "Distance (miles)" field appears
- ✅ "Time (Minutes)" field appears
- ✅ "Fan Bike (Assault Bike)?" checkbox appears

---

### Test 5.3: Swimming
**Steps:**
1. Select Cardio Type: "Swimming"

**Expected Result:**
- ✅ "Distance (meters)" field appears
- ✅ "Time (Minutes)" field appears

---

### Test 5.4: HIIT
**Steps:**
1. Select Cardio Type: "HIIT"

**Expected Result:**
- ✅ "Time (Minutes)" field appears
- ✅ "Number of Rounds" field appears (optional)

---

### Test 5.5: Rowing
**Steps:**
1. Select Cardio Type: "Rowing"

**Expected Result:**
- ✅ "Distance (meters)" field appears
- ✅ "Time (Minutes)" field appears

---

### Test 5.6: Dancing
**Steps:**
1. Select Cardio Type: "Dancing"

**Expected Result:**
- ✅ "Time (Minutes)" field appears
- ✅ "Dance Style" field appears (optional text input)

---

### Test 5.7: Other
**Steps:**
1. Select Cardio Type: "Other"

**Expected Result:**
- ✅ "Activity Name" field appears (required)
- ✅ "Time (Minutes)" field appears

**Test Validation:**
1. Try to submit without entering Activity Name
2. Should show validation error

---

## Test Suite 6: Calorie Calculation

### Test 6.1: Run Calories (Pounds)
**Steps:**
1. Body Weight: 175 lbs
2. Weight Unit: lbs
3. Cardio Type: Run
4. Time: 30 minutes

**Expected Result:**
- ✅ Shows "Estimated Calories Burned"
- ✅ Value is approximately: 390 cal
- ✅ Formula: 9.8 MET × 79.4 kg × 0.5 hours ≈ 390

---

### Test 6.2: Run Calories (Kilograms)
**Steps:**
1. Body Weight: 80 kg
2. Weight Unit: kg
3. Cardio Type: Run
4. Time: 30 minutes

**Expected Result:**
- ✅ Shows approximately: 392 cal
- ✅ Formula uses kg directly (no conversion)

---

### Test 6.3: Different Cardio Types Have Different METs
**Test Configuration:**
- Body Weight: 175 lbs
- Time: 30 minutes

**Expected Calorie Ranges:**
```
Run (MET 9.8):        ~390 cal
Jump Rope (MET 11.0): ~438 cal
Cycling (MET 8.0):    ~318 cal
Swimming (MET 8.0):   ~318 cal
HIIT (MET 12.0):      ~477 cal
Rowing (MET 8.5):     ~338 cal
Dancing (MET 7.0):    ~278 cal
Other (MET 6.0):      ~238 cal
```

**Note:** Values will vary slightly due to rounding and conversion factors.

---

### Test 6.4: Calories Update in Real-Time
**Steps:**
1. Select any Cardio Type
2. Enter time value
3. Observe calories field
4. Change time value
5. Observe calories field updates

**Expected Result:**
- ✅ Calories recalculate immediately on any input change
- ✅ No need to click anything to trigger calculation

---

## Test Suite 7: Recovery Advice Modal

### Test 7.1: Cardio Recovery Modal
**Steps:**
1. Complete a Run workout
2. Click "Save"

**Expected Result:**
- ✅ Recovery modal appears
- ✅ Title: "Recovery Protocol"
- ✅ Shows advice for "Run":
  - Text: "Hydrate with electrolytes. Focus stretch: Soleus & Hip Flexors."
  - Link: "10 Min Mobility for Runners"
- ✅ Can click link (opens YouTube)
- ✅ Can close modal

---

### Test 7.2: Different Cardio Types Show Different Advice
**Test Each:**
- Run → Runner-specific advice
- Jump Rope → Calf/ankle advice
- Cycling → Cyclist stretching
- Swimming → Shoulder mobility
- HIIT → Box breathing
- Rowing → Back/hamstring stretches
- Dancing → Dynamic cool-down
- Other → General advice

**Expected Result:**
- ✅ Each type shows unique advice
- ✅ Appropriate YouTube links (except Other)

---

### Test 7.3: Non-Cardio Types Still Show Advice
**Steps:**
1. Complete a "Lift" workout
2. Click "Save"

**Expected Result:**
- ✅ Shows Lift-specific recovery advice
- ✅ Link to "Post-Lift Mobility Routine"

---

## Test Suite 8: Data Persistence

### Test 8.1: Workout Saves to LocalStorage
**Steps:**
1. Open browser console
2. Run: `localStorage.getItem('activityLogs')`
3. Complete a workout
4. Run: `localStorage.getItem('activityLogs')` again

**Expected Result:**
- ✅ Before: null or old data
- ✅ After: JSON array with new workout
- ✅ All fields are saved correctly

---

### Test 8.2: Verify Saved Data Structure (Run Example)
**Steps:**
1. Complete a Run workout with:
   - Body Weight: 175 lbs
   - Run: 5 miles in 40:15
2. Check localStorage

**Expected JSON:**
```json
{
  "activityType": "workout",
  "bodyWeight": "175",
  "bodyWeightUnit": "lbs",
  "postWorkout": false,
  "workoutType": "Cardio",
  "cardioType": "Run",
  "runDistance": "5",
  "runDistanceUnit": "Miles",
  "runTimeMinutes": "40",
  "runTimeSeconds": "15",
  "intensity": 5,
  "notes": "...",
  "id": "...",
  "timestamp": "..."
}
```

---

## Test Suite 9: Edge Cases & Error Handling

### Test 9.1: Empty Values
**Steps:**
1. Enter distance but no time
2. Check pace field

**Expected Result:**
- ✅ Pace shows "—" (em dash)
- ✅ No JavaScript errors in console

---

### Test 9.2: Zero Values
**Steps:**
1. Enter distance: 0
2. Enter time: 10

**Expected Result:**
- ✅ Pace shows "—" or handles gracefully
- ✅ No division by zero error

---

### Test 9.3: Very Large Numbers
**Steps:**
1. Body Weight: 9999
2. Time: 999

**Expected Result:**
- ✅ Calories calculate (very high number)
- ✅ No crashes or UI breaks

---

### Test 9.4: Switching Between Types
**Steps:**
1. Select Cardio > Run
2. Fill in all Run fields
3. Change Cardio Type to "Jump Rope"
4. Change back to "Run"

**Expected Result:**
- ✅ Fields clear when switching away
- ✅ No leftover data from previous selection
- ✅ Form resets to empty state for new type

---

## Test Suite 10: Visual/Styling Tests

### Test 10.1: Toggle Buttons
**Expected Visual:**
- Active: Solid blue background (#3B82F6), white text
- Inactive: Light gray background (#E5E7EB), dark text
- Hover: Slightly darker gray on inactive
- Clean spacing between buttons

---

### Test 10.2: Calculated Fields
**Expected Visual:**
- Light gray background (#F3F4F6)
- Gray border
- Gray text (not too light to read)
- Bold font weight
- Proper padding

---

### Test 10.3: Historical Badge
**Expected Visual:**
- Light blue background (#EFF6FF)
- Blue border (thicker - 2px)
- Blue text (#1E40AF)
- Bold font weight
- Emoji renders correctly

---

### Test 10.4: Scrollable List
**Expected Visual:**
- Max height visible
- Scrollbar appears on right
- Padding on right prevents scrollbar overlap
- Items inside have proper spacing

---

## Test Suite 11: Responsive/Mobile Testing

### Test 11.1: Mobile View (if applicable)
**Steps:**
1. Open DevTools
2. Toggle device toolbar (mobile view)
3. Test iPhone 12 size (390x844)

**Expected Result:**
- ✅ Form fits within screen width
- ✅ Toggle buttons stack or wrap properly
- ✅ Input fields are touch-friendly (min 44px height)
- ✅ Modal doesn't overflow screen

---

## Common Issues & Fixes

### Issue: "Dropdown shows blank"
**Fix:** Check that `key` prop is added to select element

### Issue: "Pace shows decimal instead of mm:ss"
**Fix:** Check pace calculation function uses `Math.floor` and `padStart`

### Issue: "Calories show NaN"
**Fix:** Check that all values are parsed with `parseFloat()`

### Issue: "Historical comparison doesn't work"
**Fix:** Check localStorage has existing run data

### Issue: "Default values don't appear"
**Fix:** Check useEffect in GenericForm runs on mount

### Issue: "Conditional fields don't hide"
**Fix:** Check `shouldDisplayField` function handles negate logic

---

## Browser Compatibility Testing

Test in:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## Performance Testing

### Test 11.1: Real-time Calculations
**Steps:**
1. Type rapidly in distance/time fields
2. Observe pace updates

**Expected Result:**
- ✅ No lag or delay
- ✅ Smooth updates
- ✅ No performance warnings in console

---

## Final Validation

Once all tests pass:
- [ ] All TODOs completed
- [ ] No linter errors
- [ ] No console errors
- [ ] All calculations accurate
- [ ] All UI elements render correctly
- [ ] Data saves properly
- [ ] Historical comparison works
- [ ] Recovery modal shows appropriate advice

---

## Quick Smoke Test (5 minutes)

1. ✅ Open app
2. ✅ Create Workout
3. ✅ Select Cardio > Run
4. ✅ Enter: 175 lbs, 5 miles, 40:00
5. ✅ Verify pace shows ~8:00 min/mile
6. ✅ Verify calories show ~620 cal
7. ✅ Save workout
8. ✅ Recovery modal appears
9. ✅ Close modal
10. ✅ Verify workout appears in feed

If all ✅ → System working! 🎉
