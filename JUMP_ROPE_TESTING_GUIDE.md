# Jump Rope Refactor - Testing Guide

## Quick Test Checklist

### Test 1: Basic Time-Based Tracking ✓
1. Open the app
2. Click "I Just Workout"
3. Select Workout Type: **Cardio**
4. Select Cardio Type: **Jump Rope**
5. ✅ Verify: Intensity slider is HIDDEN
6. ✅ Verify: "Tracking Mode" toggle appears with two options
7. ✅ Verify: "Track by Time" is selected by default
8. Enter Time: **10** minutes
9. ✅ Verify: Calorie estimate appears (should be ~150 cal for 175 lb person)
10. Click **Save**
11. ✅ Verify: Log appears in feed showing "Time: 10 mins"

### Test 2: Skip-Based Tracking ✓
1. Click "I Just Workout"
2. Select: Workout → Cardio → Jump Rope
3. Toggle Tracking Mode to: **Track by Skips**
4. ✅ Verify: Time input disappears, Skips input appears
5. Enter Skips: **500**
6. ✅ Verify: Calorie estimate appears (based on 5 mins = 500/100)
7. Click **Save**
8. ✅ Verify: Log shows "Skips: 500" (NOT time)

### Test 3: Weighted Rope (lbs) ✓
1. Create new Jump Rope workout (Track by Time, 10 mins)
2. Check: **Weighted Rope?**
3. ✅ Verify: "Rope Weight" input appears
4. ✅ Verify: Weight unit toggle appears with "lbs" selected
5. ✅ Verify: Default value is 2
6. Enter Rope Weight: **2** lbs
7. ✅ Verify: Calorie estimate increases by ~20%
8. Click **Save**
9. ✅ Verify: Log shows "Weighted Rope: 2 lbs"
10. ✅ Verify: Click the "2 lbs" text to toggle to kg
11. ✅ Verify: Shows "0.9 kg" (correct conversion)
12. Click again
13. ✅ Verify: Toggles back to "2 lbs"

### Test 4: Weighted Rope (kg) ✓
1. Create new Jump Rope workout
2. Check: Weighted Rope
3. Toggle Weight Unit to: **kg**
4. Enter Rope Weight: **5** kg
5. ✅ Verify: Calorie estimate increases significantly
6. Click **Save**
7. ✅ Verify: Log shows "Weighted Rope: 5 kg"
8. ✅ Verify: Unit toggle works (click to see ~11 lbs)

### Test 5: Mode Switching (Data Cleanup) ✓
1. Create new Jump Rope workout
2. Select: **Track by Time**
3. Enter Time: **15** mins
4. Switch to: **Track by Skips**
5. ✅ Verify: Time input disappears and value is cleared
6. Enter Skips: **1000**
7. Switch back to: **Track by Time**
8. ✅ Verify: Skips input disappears and value is cleared
9. ✅ Verify: Previous time value (15) is gone (fresh input)

### Test 6: Cardio Type Switching (Complete Reset) ✓
1. Create new workout: Cardio → Jump Rope
2. Set tracking mode to Skip, enter 500 skips
3. Check Weighted Rope, enter 3 lbs
4. Change Cardio Type to: **Run**
5. ✅ Verify: All Jump Rope fields disappear
6. ✅ Verify: Intensity slider reappears
7. Change back to: **Jump Rope**
8. ✅ Verify: Tracking mode resets to "Track by Time" (default)
9. ✅ Verify: All previous Jump Rope values are cleared

### Test 7: Edit Existing Log ✓
1. Create and save a Jump Rope workout
2. Click the **Edit** button on the log
3. ✅ Verify: Form opens with all saved values populated
4. ✅ Verify: Tracking mode is correctly restored
5. ✅ Verify: Weighted rope settings are restored
6. Modify: Change time from 10 to 15 mins
7. Click **Save**
8. ✅ Verify: Log updates with new values
9. ✅ Verify: Original timestamp is preserved

### Test 8: Calorie Calculation Accuracy ✓

**Setup**: 175 lb user (default)

**Test A: Standard Rope, 10 minutes**
- Expected: ~145 cal
- Formula: 11.0 MET × 79.4 kg × (10/60) hours = 145.6

**Test B: 2 lb Weighted Rope, 10 minutes**
- Expected: ~175 cal
- Formula: 145.6 × (1 + 0.2) = 174.7

**Test C: 5 lb Weighted Rope, 10 minutes**
- Expected: ~218 cal
- Formula: 145.6 × (1 + 0.5) = 218.4

**Test D: Skip-based, 1000 skips**
- Time: 1000/100 = 10 minutes
- Expected: ~145 cal (same as Test A)

### Test 9: Backward Compatibility ✓
If you have old Jump Rope logs (pre-refactor):
1. ✅ Verify: Old logs display without errors
2. ✅ Verify: Both skips AND time show (if both were saved)
3. ✅ Verify: Weighted rope shows as "Yes" if checkbox was checked
4. ✅ Verify: Can edit old logs without data loss

### Test 10: Validation & Edge Cases ✓

**Min/Max Validation:**
1. Try to enter Rope Weight: **-1**
   - ✅ Should enforce min: 0
2. Try to enter Rope Weight: **25**
   - ✅ Should enforce max: 20

**Required Fields:**
1. Don't enter Time (Track by Time mode)
   - ✅ Should show validation error on save
2. Don't enter Skips (Track by Skips mode)
   - ✅ Should show validation error on save
3. Check Weighted Rope but leave weight empty
   - ✅ Should show validation error on save

**Zero Values:**
1. Enter Time: **0**
   - ✅ Calories should be 0 cal
2. Enter Skips: **0**
   - ✅ Calories should be 0 cal

---

## Regression Testing

Ensure other cardio types still work correctly:

### Run ✓
1. Create: Workout → Cardio → Run
2. ✅ Verify: Intensity slider appears
3. ✅ Verify: Distance, Time, Pace fields work
4. ✅ Verify: Calorie calculation works

### Cycling ✓
1. Create: Workout → Cardio → Cycling
2. ✅ Verify: Intensity slider appears
3. ✅ Verify: Distance, Time fields work
4. ✅ Verify: Fan Bike checkbox works

### Swimming, HIIT, Rowing, Dancing ✓
1. Test each cardio type
2. ✅ Verify: Intensity slider appears for each
3. ✅ Verify: Type-specific fields work
4. ✅ Verify: Calorie calculation works

---

## Browser/Device Testing

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Android Firefox

### Responsive Design
1. Test at various screen widths:
   - [ ] Desktop (1920px)
   - [ ] Laptop (1366px)
   - [ ] Tablet (768px)
   - [ ] Mobile (375px)
2. ✅ Verify: Toggle buttons remain readable and clickable
3. ✅ Verify: Form doesn't overflow viewport
4. ✅ Verify: Feed cards display correctly

---

## Performance Testing

### Form Responsiveness
1. Switch between tracking modes rapidly
2. ✅ Verify: No lag or glitches
3. ✅ Verify: Fields appear/disappear smoothly

### Calorie Calculation
1. Enter values and change tracking mode
2. ✅ Verify: Calorie estimate updates instantly
3. ✅ Verify: No flickering or delay

### Feed Rendering
1. Create 10+ Jump Rope logs
2. ✅ Verify: Feed loads quickly
3. ✅ Verify: Unit toggles respond instantly
4. ✅ Verify: No memory leaks

---

## User Experience Testing

### First-Time User
1. Can a new user understand the tracking modes?
2. Are default values sensible?
3. Is the weighted rope option discoverable?
4. Are the unit toggles intuitive?

### Power User
1. Can logs be created quickly?
2. Does the mode-based tracking save time?
3. Are the calorie estimates accurate enough?
4. Can past logs be easily reviewed and edited?

---

## Known Limitations & Future Enhancements

### Current Limitations
1. **Skip rate assumption**: Fixed at 100 skips/min
   - Future: Allow user to customize skip rate
2. **Weighted rope physics**: Linear multiplier
   - Future: More sophisticated biomechanics model
3. **No interval tracking**: Single continuous session only
   - Future: Support HIIT-style jump rope intervals

### Suggested Enhancements
1. **Auto-detect mode**: Based on entered field
2. **Historical averages**: Show user's typical skip rate
3. **Comparison badges**: vs. personal best
4. **Rope type presets**: Speed rope, weighted, beaded, etc.
5. **Workout templates**: Save favorite configurations

---

## Bug Reporting Template

If you find a bug, please report using this format:

```
**Bug Title**: [Short description]

**Environment**:
- Browser: [Chrome 120 / Safari 17 / etc.]
- Device: [Desktop / iPhone 15 / etc.]
- OS: [macOS 14 / Windows 11 / iOS 17 / etc.]

**Steps to Reproduce**:
1. [First step]
2. [Second step]
3. [...]

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happens]

**Screenshots/Video**:
[If applicable]

**Additional Context**:
[Any other relevant information]
```

---

## Sign-Off Checklist

Before marking this refactor as "complete", verify:

- [ ] All 10 test scenarios pass
- [ ] No linter errors
- [ ] No console errors
- [ ] Backward compatibility confirmed
- [ ] Responsive design verified
- [ ] Documentation is complete
- [ ] Code is well-commented
- [ ] Performance is acceptable

---

## Testing Results Template

```
Tester: [Your Name]
Date: [Date]
Environment: [Browser + Device]

Test 1: Basic Time-Based Tracking    [ PASS / FAIL ]
Test 2: Skip-Based Tracking           [ PASS / FAIL ]
Test 3: Weighted Rope (lbs)           [ PASS / FAIL ]
Test 4: Weighted Rope (kg)            [ PASS / FAIL ]
Test 5: Mode Switching                [ PASS / FAIL ]
Test 6: Cardio Type Switching         [ PASS / FAIL ]
Test 7: Edit Existing Log             [ PASS / FAIL ]
Test 8: Calorie Calculation           [ PASS / FAIL ]
Test 9: Backward Compatibility        [ PASS / FAIL ]
Test 10: Validation & Edge Cases      [ PASS / FAIL ]

Regression Tests: Run                 [ PASS / FAIL ]
Regression Tests: Other Cardio        [ PASS / FAIL ]

Issues Found:
1. [Description]
2. [Description]

Overall: [ APPROVED / NEEDS FIXES ]

Notes:
[Additional comments]
```

---

**Happy Testing!** 🎉
