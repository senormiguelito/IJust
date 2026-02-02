# Testing Checklist for I Just App Refactor

## 🧪 Test Environment
- Dev server running at: `http://localhost:5173/`
- Test on: Chrome/Firefox/Safari
- Check: Browser console for errors

---

## Priority 1: Error Boundary Tests

### Test 1.1: Error Boundary Displays
**Goal:** Verify error boundary catches errors and displays user-friendly message

**Steps:**
1. Open the app
2. Verify app loads normally
3. ✅ **Success Criteria:** No white screen, app loads correctly

### Test 1.2: Defensive Coding (No Crashes)
**Goal:** Ensure app doesn't crash when peer data is missing or malformed

**Steps:**
1. Open DevTools Console
2. Clear localStorage: `localStorage.clear()`
3. Reload app
4. Click "I Just..." → Select "Jiu-Jitsu"
5. Try to add a drilling partner (should show "No partners found")
6. Try to add a sparring partner
7. Add a technique, uncheck "Shown by Instructor"
8. ✅ **Success Criteria:** No crashes, no errors in console, empty dropdowns work correctly

---

## Priority 2: Immediate Peer Synchronization Tests

### Test 2.1: Drilling → Sparring Sync
**Goal:** Adding a drilling partner makes them immediately available for sparring

**Steps:**
1. Open "I Just..." → "Jiu-Jitsu"
2. Click "Drilling Partner(s)" input
3. Type a new name (e.g., "John Doe")
4. Click "Add 'John Doe'"
5. In the modal:
   - Select Gender: Male
   - Select Belt: Blue
   - Select Weight Class: Middle (168-181.5 lbs)
   - Click "Add Partner"
6. Verify John Doe appears in drilling partners list
7. **WITHOUT SAVING THE FORM**, scroll to "Sparring Rounds"
8. Click the sparring partner input
9. ✅ **Success Criteria:** "John Doe" appears in the dropdown with blue belt emoji 🔵

### Test 2.2: Sparring → Drilling Sync
**Goal:** Reverse test - adding sparring partner makes them available for drilling

**Steps:**
1. Continue from previous test OR start fresh
2. In "Sparring Rounds", type a new name (e.g., "Jane Smith")
3. Click "Add 'Jane Smith'"
4. In the modal:
   - Select Gender: Female
   - Select Belt: Purple
   - Select Weight Class: Light (129-141.5 lbs)
   - Click "Add Partner"
5. Verify Jane Smith appears in sparring rounds
6. **WITHOUT SAVING THE FORM**, scroll to "Drilling Partner(s)"
7. Click the drilling partner input
8. ✅ **Success Criteria:** "Jane Smith" appears in dropdown with purple belt emoji 🟣

### Test 2.3: Peer Persists After Form Cancel
**Goal:** New peers are saved even if form is cancelled

**Steps:**
1. Continue from previous test
2. Click "Cancel" to close the form
3. Reopen "I Just..." → "Jiu-Jitsu"
4. Click "Drilling Partner(s)" input
5. ✅ **Success Criteria:** Both "John Doe" and "Jane Smith" are in the dropdown

---

## Priority 3: "Shown By" Logic Tests

### Test 3.1: Technique Default State
**Goal:** New techniques default to "Shown by Instructor" = checked

**Steps:**
1. Open "I Just..." → "Jiu-Jitsu"
2. In "Techniques" section, type "Triangle Choke"
3. Press Enter or click "Add"
4. ✅ **Success Criteria:** 
   - Technique appears in list
   - "Shown by Instructor?" checkbox is CHECKED
   - No peer input field visible

### Test 3.2: Uncheck Shows Creatable Select
**Goal:** Unchecking "Shown by Instructor" reveals peer dropdown

**Steps:**
1. Continue from Test 3.1
2. Click the "Shown by Instructor?" checkbox to UNCHECK it
3. ✅ **Success Criteria:** 
   - A dropdown input appears below the checkbox
   - Placeholder: "Who showed this technique?"
   - Has a dropdown chevron icon

### Test 3.3: Peer Dropdown Shows Existing Peers
**Goal:** Dropdown pulls from the same jiuJitsuPeers pool

**Steps:**
1. Continue from Test 3.2
2. Click the peer dropdown input
3. ✅ **Success Criteria:**
   - Dropdown opens
   - Shows "John Doe" and "Jane Smith" from previous tests
   - Shows belt emoji and weight class
   - Example: "🔵 John Doe  Middle"

### Test 3.4: Add New Peer Through Techniques
**Goal:** Can add new peer directly from techniques field

**Steps:**
1. Continue from Test 3.3
2. Type "Mike Johnson" in the peer input
3. Click "Add 'Mike Johnson'" in dropdown
4. In the modal:
   - Select Gender: Male
   - Select Belt: Brown
   - Select Weight Class: Heavy (195-208 lbs)
   - Click "Add Partner"
5. Verify "Mike Johnson" now appears as the technique's peer
6. **WITHOUT SAVING**, scroll to "Drilling Partner(s)"
7. Click drilling partner input
8. ✅ **Success Criteria:** "Mike Johnson" appears in the drilling partner dropdown with brown belt 🟤

### Test 3.5: Recheck Hides Peer Input
**Goal:** Re-checking "Shown by Instructor" hides the peer dropdown

**Steps:**
1. Go back to the technique with "Mike Johnson"
2. Check the "Shown by Instructor?" checkbox
3. ✅ **Success Criteria:**
   - Peer dropdown disappears
   - Peer value is cleared (or preserved but hidden)

---

## Priority 4: Enter Key Trap Tests

### Test 4.1: Enter in Technique Input
**Goal:** Pressing Enter in technique input adds technique (doesn't submit form)

**Steps:**
1. Open "I Just..." → "Jiu-Jitsu"
2. Type "Armbar" in the Techniques input
3. Press Enter
4. ✅ **Success Criteria:**
   - Technique "Armbar" is added to the list
   - Form is still open (NOT submitted)
   - Input is cleared

### Test 4.2: Enter in Drilling Partner Input
**Goal:** Enter doesn't crash or submit form

**Steps:**
1. Click in "Drilling Partner(s)" input
2. Type an existing partner name (e.g., "John")
3. Press Enter
4. ✅ **Success Criteria:**
   - Dropdown may close or partner may be selected
   - Form is NOT submitted
   - No errors

### Test 4.3: Enter in Reflection Textarea
**Goal:** Enter in textarea inserts newline (normal behavior)

**Steps:**
1. Scroll to "Reflection" textarea
2. Type "First line"
3. Press Enter
4. Type "Second line"
5. ✅ **Success Criteria:**
   - Two lines of text visible in textarea
   - Form is NOT submitted

### Test 4.4: Enter on Save Button
**Goal:** Enter on Save button DOES submit form (normal behavior)

**Steps:**
1. Fill out minimal required fields
2. Tab to "Save" button (or click it to focus)
3. Press Enter
4. ✅ **Success Criteria:**
   - Form is submitted
   - Modal closes
   - New log appears in feed

### Test 4.5: Enter in Regular Text Input
**Goal:** Enter in non-list text inputs doesn't submit form

**Steps:**
1. Open "I Just..." → "Workout"
2. In "Duration" input, type "30"
3. Press Enter
4. ✅ **Success Criteria:**
   - Form is NOT submitted
   - Focus may move to next field or stay
   - No errors

---

## Priority 5: Weight Class Logic Tests

### Test 5.1: Male Weight Classes Display
**Goal:** Male gender shows correct IBJJF weight ranges

**Steps:**
1. Open "I Just..." → "Jiu-Jitsu"
2. Click "Drilling Partner(s)" → Type new name → Click "Add"
3. Verify "Gender" toggle defaults to "Male" (or select Male)
4. Click "Weight Class" dropdown
5. ✅ **Success Criteria:** Dropdown shows:
   - Rooster (<127 lbs)
   - Light Feather (127-141.5 lbs)
   - Feather (141.5-154.5 lbs)
   - Light (154.5-168 lbs)
   - Middle (168-181.5 lbs)
   - Medium Heavy (181.5-195 lbs)
   - Heavy (195-208 lbs)
   - Super Heavy (208-222 lbs)
   - Ultra Heavy (>222 lbs)
   - Unknown

### Test 5.2: Female Weight Classes Display
**Goal:** Female gender shows different weight ranges

**Steps:**
1. Continue from Test 5.1
2. Click "Female" button in gender toggle
3. ✅ **Success Criteria:** Weight Class dropdown updates to show:
   - Rooster (<107 lbs)
   - Light Feather (107-118 lbs)
   - Feather (118-129 lbs)
   - Light (129-141.5 lbs)
   - Middle (141.5-152.5 lbs)
   - Medium Heavy (152.5-163.5 lbs)
   - Heavy (163.5-175 lbs)
   - Super Heavy (>175 lbs)
   - Unknown

### Test 5.3: Weight Class Resets on Gender Change
**Goal:** Switching gender clears selected weight class

**Steps:**
1. Continue from Test 5.2 (Female selected)
2. Select "Middle (141.5-152.5 lbs)"
3. Switch to "Male"
4. ✅ **Success Criteria:**
   - Weight class dropdown resets to "Select weight class"
   - No weight class pre-selected

### Test 5.4: Gender Toggle Visual States
**Goal:** Gender toggle shows active state correctly

**Steps:**
1. Click "Male" button
2. ✅ **Success Criteria:** Male button is blue/highlighted, Female is gray
3. Click "Female" button
4. ✅ **Success Criteria:** Female button is pink/highlighted, Male is gray

### Test 5.5: Complete Partner with Gender/Weight
**Goal:** Full flow of adding partner with new system

**Steps:**
1. Open "I Just..." → "Jiu-Jitsu"
2. Add new drilling partner "Sarah Williams"
3. In modal:
   - Select Gender: Female
   - Select Belt: Black
   - Select Weight Class: Heavy (163.5-175 lbs)
   - Click "Add Partner"
4. Add Sarah to the drilling partners list
5. Save the form
6. Verify log appears in feed
7. Edit the log
8. Check drilling partners
9. ✅ **Success Criteria:** Sarah Williams shows in list with correct belt/weight

---

## Regression Tests

### Test R.1: Non-Jiu-Jitsu Activities Still Work
**Goal:** Ensure other activities weren't broken

**Steps:**
1. Click "I Just..." → "Workout"
2. Select Type: "Cardio"
3. Select Cardio Type: "Run"
4. Fill in distance, time
5. Save form
6. ✅ **Success Criteria:** Log created successfully

### Test R.2: Edit Existing Log
**Goal:** Editing old logs still works

**Steps:**
1. Click "Edit" on any existing log
2. Change a field value
3. Save
4. ✅ **Success Criteria:** Changes persist

### Test R.3: Delete Log
**Goal:** Delete functionality still works

**Steps:**
1. Click trash icon on a log
2. Confirm deletion
3. ✅ **Success Criteria:** Log removed from feed

---

## Browser Compatibility Tests

### Test B.1: Chrome
- Run all Priority tests in Chrome
- ✅ Check console for errors

### Test B.2: Firefox  
- Run Priority 2 & 4 tests in Firefox
- ✅ Check console for errors

### Test B.3: Safari
- Run Priority 2 & 4 tests in Safari
- ✅ Check console for errors

---

## Performance Tests

### Test P.1: Large Peer List
**Goal:** Ensure dropdowns perform well with many peers

**Steps:**
1. Manually add 20+ peers (or use console to bulk add)
2. Open drilling partner dropdown
3. Type to search/filter
4. ✅ **Success Criteria:** Dropdown remains responsive, no lag

### Test P.2: Form with Many Techniques
**Goal:** Form doesn't slow down with many items

**Steps:**
1. Add 15 techniques
2. Toggle several "Shown by Instructor" checkboxes
3. Scroll through form
4. ✅ **Success Criteria:** No noticeable lag

---

## Edge Cases

### Test E.1: Empty State
**Goal:** App handles no data gracefully

**Steps:**
1. Clear localStorage
2. Reload app
3. Try to create Jiu-Jitsu log
4. ✅ **Success Criteria:** No crashes, helpful "No peers found" messages

### Test E.2: Duplicate Peer Names
**Goal:** Can't add duplicate peers

**Steps:**
1. Add peer "John Doe"
2. Try to add another "John Doe"
3. ✅ **Success Criteria:** Either prevented or handled gracefully

### Test E.3: Very Long Names
**Goal:** UI handles long peer names

**Steps:**
1. Add peer with very long name (50+ characters)
2. ✅ **Success Criteria:** Name doesn't break layout, truncated if needed

---

## Final Checklist Summary

- [ ] All Priority 1 tests passed
- [ ] All Priority 2 tests passed
- [ ] All Priority 3 tests passed
- [ ] All Priority 4 tests passed
- [ ] All Priority 5 tests passed
- [ ] All Regression tests passed
- [ ] All Browser tests passed
- [ ] No console errors
- [ ] No white screen crashes

---

## 🐛 Known Issues / Notes
(Add any issues discovered during testing here)

---

## ✅ Sign-Off
- **Tested By:** _________________
- **Date:** _________________
- **Status:** ☐ Approved  ☐ Issues Found (see above)
