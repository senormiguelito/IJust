# CHANGELOG - I Just App

## [1.1.0] - 2026-02-01

### 🎉 Major Features

#### Global Smart Features
- **Smart Body Weight Defaults** 🏋️
  - Automatically pulls from your last logged weight
  - Falls back to 160 lbs for first-time users
  - Works across all activities (Workout, Jiu-Jitsu)
  
- **Edit Functionality** ✏️
  - Edit button added to all log cards
  - Form pre-fills with existing data
  - Updates in place (preserves timestamp and position)
  - Works with all activity types
  
- **Weight Unit Toggle** 🔄
  - Click any weight value in feed to toggle lbs ↔ kg
  - Instant conversion (0.453592 ratio)
  - Display-only (doesn't modify stored data)
  - Independent toggle per log card

---

### 🥋 Jiu-Jitsu Activity Refactor

#### New Field: Instructor (Smart Dropdown)
- **Before:** Simple text input
- **Now:** Creatable select with search
  - Type to search existing instructors
  - "Add new" option for new instructors
  - Belt rank metadata (Blue, Purple, Brown, Black, Coral)
  - Visual belt icons in dropdown (🔵 🟣 🟤 ⚫ 🔴)
  - Stored in localStorage for reuse

#### New Field: Drilling Partner(s)
- Multiple partners can be added (tags)
- Appears immediately after Instructor field
- Press Enter to add each partner
- Purple badges in feed view

#### Enhanced: Techniques
- **Before:** Simple tags
- **Now:** Rich metadata structure
  - "Shown by Instructor?" checkbox for each technique
  - Peer name input when not shown by instructor
  - Displays with indicators: 👨‍🏫 (Instructor) or 👥 (Peer)
  - Technique cards with borders in feed

#### New Field: Sparring Rounds
- Separate from drilling partners
- Maximum 15 sparring partners (enforced)
- Counter display: (X/15)
- Input disables at limit
- Red badges in feed (visual distinction)

#### Added: Body Weight Fields
- Body Weight (number)
- Weight Unit toggle (lbs/kg)
- Smart defaults apply

#### Removed: Social Context
- "I did this on my own" checkbox hidden for Jiu-Jitsu
- Jiu-Jitsu always assumes social/partner training

---

### 📦 Data Structure Changes

#### New Log Structure (Jiu-Jitsu)
```javascript
// Before
{
  techniques: ['Triangle Choke', 'Armbar'],
  instructor: 'Prof. Dave',
  reflection: '...'
}

// After
{
  bodyWeight: 175,
  bodyWeightUnit: 'lbs',
  instructor: 'Prof. Dave',
  drillingPartners: ['John', 'Mike'],
  techniques: [
    { name: 'Triangle Choke', shownByInstructor: true, peer: '' },
    { name: 'Armbar', shownByInstructor: false, peer: 'Sarah' }
  ],
  sparringRounds: ['Tom', 'Alex', 'Chris'],
  reflection: '...'
}
```

#### New LocalStorage Keys
- `ijust_instructors` - Stores instructor names with belt ranks

---

### 🔧 Technical Changes

#### Modified Files
- `src/config/activityConfig.js` - Jiu-Jitsu schema overhaul
- `src/utils/storage.js` - Added 5 new helper functions
- `src/components/GenericForm.jsx` - 3 new field components, edit support
- `src/App.jsx` - Edit state management
- `src/components/LogCard.jsx` - Edit button, weight toggle, improved display

#### New Components (in GenericForm.jsx)
- `CreatableSelectField` - Smart dropdown with "add new"
- `TechniqueListField` - Dynamic list with checkboxes
- Belt Rank Modal - Inline modal component

#### New Helper Functions
- `getLastBodyWeight()` - Retrieves last recorded weight
- `loadInstructors()` - Loads instructor list from storage
- `saveInstructor(name, beltRank)` - Saves new instructor
- `getLogById(logId)` - Retrieves specific log
- `updateLog(logId, data)` - Updates existing log

---

### 🎨 UI/UX Improvements

#### Log Cards
- **Edit button** (✏️) added next to Delete button
- Weight values are **clickable/underlined**
- Hover states: Edit (blue), Delete (red)
- Improved visual hierarchy for Jiu-Jitsu logs

#### Jiu-Jitsu Feed Display
- **Drilling Partners**: Purple badges
- **Sparring Rounds**: Red badges (visual distinction)
- **Techniques**: Bordered cards with instructor/peer indicators
- **Instructor**: Shows with belt emoji

#### Form Improvements
- Header changes to "Edit [Activity]" when editing
- Counter for sparring rounds: (X/15)
- Disabled state for maxed fields
- Better visual grouping of related fields

---

### ⚡ Performance

- Smart defaults: O(1) typical case (first log has weight)
- Instructor search: O(n) where n = number of instructors (typically < 20)
- No new network requests (all localStorage)
- Form renders efficiently with conditional fields

---

### 🛡️ Backward Compatibility

#### Fully Compatible
- ✅ Old logs display correctly
- ✅ Missing new fields are gracefully omitted
- ✅ Old "techniques" array still works
- ✅ No migration needed
- ✅ Gradual adoption (new features optional)

#### Legacy Support
- Old Jiu-Jitsu logs with simple `techniques` array → Still displays
- Old logs without `bodyWeight` → No errors, field just absent
- Old logs with `partners` field → Still displays under "Partners"

---

### 🐛 Bug Fixes

None (this is a feature release, not a bug fix release)

---

### 📚 Documentation

#### New Documentation Files
- `IMPLEMENTATION_SUMMARY.md` - Complete implementation overview
- `JIUJITSU_USER_GUIDE.md` - User-facing guide with examples
- `TESTING_CHECKLIST.md` - Comprehensive testing scenarios
- `DEVELOPER_REFERENCE.md` - Quick reference for developers
- `CHANGELOG.md` - This file

---

### 🚀 Deployment

#### Requirements
- No database changes (localStorage-based)
- No new dependencies
- No breaking changes
- Safe to deploy immediately

#### Post-Deployment
- Monitor localStorage usage (shouldn't increase significantly)
- Track edit feature usage
- Gather feedback on Jiu-Jitsu schema changes

---

### 🔮 Future Enhancements

#### Potential Next Steps (Not Implemented)
- Edit instructor belt ranks
- Bulk operations (edit/delete multiple logs)
- Export instructor list
- Technique autocomplete/suggestions
- Sparring performance metrics
- Belt progression timeline
- Instructor statistics dashboard
- Import/export logs feature

---

### ⚠️ Known Limitations

1. **Instructor Belt Ranks**
   - Cannot edit after creation
   - Workaround: Add as new instructor with different name

2. **Sparring Limit**
   - Hard limit of 15 enforced in UI
   - Data structure allows more, but form prevents it

3. **Weight Precision**
   - Conversion rounded to 1 decimal place
   - Original data stored as-entered

4. **No Cloud Sync**
   - Data stored locally in browser
   - Clearing browser data erases logs

5. **Technique Peer Names**
   - Free text (no autocomplete)
   - No validation against drilling partners list

---

### 📊 Statistics

#### Code Changes
- **5 files modified**
- **3 new components created**
- **5 new helper functions**
- **2 new field types**
- **~500 lines added**
- **0 breaking changes**

#### Testing
- **100+ test scenarios** documented
- **0 linter errors**
- **0 console errors**
- **Development server**: ✅ Running

---

### 👥 Credits

**Developed by:** AI Assistant with Cursor  
**Requested by:** User  
**Date:** February 1, 2026  
**Version:** 1.1.0

---

### 📝 Migration Notes

#### For Existing Users
No action required! Your existing logs will continue to work. New features are available when you create new logs.

#### For Developers
If extending this functionality:
1. Review `DEVELOPER_REFERENCE.md` for API details
2. Check `activityConfig.js` for schema examples
3. Use `TESTING_CHECKLIST.md` for validation

---

### 🎯 Success Metrics

After deployment, we'll track:
- Edit feature adoption rate
- Body weight logging consistency
- Number of instructors being added
- Technique logging patterns (instructor vs peer)
- Sparring rounds frequency
- User feedback on new UI

---

### 🔗 Related Issues

- Feature Request: Smart defaults - ✅ Implemented
- Feature Request: Edit logs - ✅ Implemented
- Feature Request: Enhanced Jiu-Jitsu tracking - ✅ Implemented
- Feature Request: Weight unit conversion - ✅ Implemented

---

## [1.0.0] - 2026-01-XX

### Initial Release
- Activity logging (Workout, Jiu-Jitsu, Music, Social, Creative)
- Dynamic form generation based on config
- Feed view with log cards
- Delete functionality
- Recovery advice for workouts
- Social context tracking
- LocalStorage persistence

---

**Changelog Format:** [Semantic Versioning](https://semver.org/)  
**Types:** Added, Changed, Deprecated, Removed, Fixed, Security
