# Developer Quick Reference: Smart Defaults & Jiu-Jitsu Refactor

## File Changes Overview

```
src/
├── config/
│   └── activityConfig.js          ✏️ MODIFIED - New Jiu-Jitsu schema
├── utils/
│   └── storage.js                 ✏️ MODIFIED - Added helpers
├── components/
│   ├── GenericForm.jsx            ✏️ MODIFIED - New field types, edit support
│   ├── LogCard.jsx                ✏️ MODIFIED - Edit button, weight toggle
│   └── App.jsx                    ✏️ MODIFIED - Edit state management
└── [documentation files]          ✨ NEW
```

---

## New Field Types

### 1. `creatable-select`
**Usage:** Dropdown with "add new" capability

```javascript
{
  name: 'instructor',
  label: 'Instructor',
  type: 'creatable-select',
  required: false,
  placeholder: 'Select or add instructor',
  storageKey: 'ijust_instructors'
}
```

**Component:** `CreatableSelectField` in `GenericForm.jsx`

---

### 2. `technique-list`
**Usage:** Dynamic list with metadata

```javascript
{
  name: 'techniques',
  label: 'Techniques',
  type: 'technique-list',
  required: false,
  placeholder: 'Add technique'
}
```

**Data Structure:**
```javascript
techniques: [
  { name: 'Triangle Choke', shownByInstructor: true, peer: '' },
  { name: 'Armbar', shownByInstructor: false, peer: 'John' }
]
```

**Component:** `TechniqueListField` in `GenericForm.jsx`

---

### 3. `tags` with `maxItems`
**Usage:** Tag input with limit

```javascript
{
  name: 'sparringRounds',
  label: 'Sparring Rounds',
  type: 'tags',
  maxItems: 15,
  placeholder: 'Enter name...'
}
```

**Behavior:** Input disables at limit, shows counter (X/15)

---

## Storage Functions

### Body Weight
```javascript
import { getLastBodyWeight } from './utils/storage';

const { weight, unit } = getLastBodyWeight();
// Returns: { weight: 175, unit: 'lbs' } or default { weight: 160, unit: 'lbs' }
```

### Instructors
```javascript
import { loadInstructors, saveInstructor } from './utils/storage';

// Load all
const instructors = loadInstructors();
// Returns: [{ name: 'Prof. Dave', beltRank: 'Black' }, ...]

// Save new
saveInstructor('Prof. Mike', 'Purple');
```

### Log Management
```javascript
import { updateLog, getLogById } from './utils/storage';

// Get specific log
const log = getLogById('1234567890');

// Update log
const updatedLogs = updateLog('1234567890', { ...newData });
```

---

## Component Props

### GenericForm
```javascript
<GenericForm
  activityConfig={config}      // Required: Activity configuration
  onSubmit={handleSubmit}      // Required: (data, isEdit) => void
  onCancel={handleCancel}      // Required: () => void
  editingLog={log}             // Optional: Log object for editing
/>
```

### LogCard
```javascript
<LogCard
  log={logData}                // Required: Log object
  onDelete={handleDelete}      // Required: (logId) => void
  onEdit={handleEdit}          // Required: (log) => void
/>
```

---

## App.jsx Handler Pattern

```javascript
const [editingLog, setEditingLog] = useState(null);

// Edit handler
const handleEditLog = (log) => {
  setEditingLog(log);
  setSelectedActivity(log.activityType);
};

// Submit handler
const handleFormSubmit = (formData, isEdit = false) => {
  if (isEdit) {
    const updatedLogs = updateLog(formData.id, formData);
    setLogs(updatedLogs);
    setEditingLog(null);
  } else {
    const newLog = addLog(formData);
    setLogs((prev) => [newLog, ...prev]);
  }
  setSelectedActivity(null);
};
```

---

## Conditional Rendering in Config

### Hide Social Context for Jiu-Jitsu

**In GenericForm.jsx:**
```javascript
{activityConfig.id !== 'jiujitsu' && (
  <SocialContextField ... />
)}
```

**In activityConfig.js:**
```javascript
// getDefaultSocialContext() already handles this
// Jiu-Jitsu returns { isSolo: false, participants: [] }
```

---

## Weight Conversion

**Formula:**
```javascript
// lbs to kg
const kg = lbs * 0.453592;

// kg to lbs
const lbs = kg / 0.453592;
```

**Implementation in LogCard:**
```javascript
const convertWeight = (weight, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return weight;
  if (toUnit === 'kg') {
    return (weight * 0.453592).toFixed(1);
  } else {
    return (weight / 0.453592).toFixed(1);
  }
};
```

---

## Belt Rank Icons

```javascript
const beltEmojis = {
  'Blue': '🔵',
  'Purple': '🟣',
  'Brown': '🟤',
  'Black': '⚫',
  'Coral': '🔴'
};
```

---

## Jiu-Jitsu Schema Structure

```javascript
jiujitsu: {
  id: 'jiujitsu',
  label: 'Jiu-Jitsu',
  icon: 'HandMetal',
  color: 'bg-purple-500',
  fields: [
    // Body Weight
    { name: 'bodyWeight', type: 'number', ... },
    { name: 'bodyWeightUnit', type: 'toggle', options: ['lbs', 'kg'] },
    
    // Instructor (Smart Dropdown)
    { name: 'instructor', type: 'creatable-select', storageKey: 'ijust_instructors' },
    
    // Drilling Partners
    { name: 'drillingPartners', type: 'tags' },
    
    // Techniques (Dynamic List)
    { name: 'techniques', type: 'technique-list' },
    
    // Sparring (Limited Tags)
    { name: 'sparringRounds', type: 'tags', maxItems: 15 },
    
    // Reflection
    { name: 'reflection', type: 'textarea' }
  ]
}
```

---

## Log Data Structure (Jiu-Jitsu)

```javascript
{
  id: '1234567890',
  timestamp: '2026-02-01T12:00:00.000Z',
  activityType: 'jiujitsu',
  bodyWeight: 175,
  bodyWeightUnit: 'lbs',
  instructor: 'Prof. Dave',
  drillingPartners: ['John', 'Mike'],
  techniques: [
    { name: 'Triangle Choke', shownByInstructor: true, peer: '' },
    { name: 'Armbar', shownByInstructor: false, peer: 'Sarah' }
  ],
  sparringRounds: ['Tom', 'Alex', 'Chris'],
  reflection: 'Great session today...'
}
```

---

## Common Pitfalls

### ❌ Don't Do This:
```javascript
// Modifying log data directly
log.bodyWeight = newWeight;

// Using wrong prop name
<GenericForm editing={log} /> // Wrong!

// Forgetting isEdit flag
onSubmit(formData); // Missing second parameter
```

### ✅ Do This:
```javascript
// Use updateLog helper
updateLog(log.id, { bodyWeight: newWeight });

// Correct prop name
<GenericForm editingLog={log} />

// Include isEdit flag
onSubmit(formData, isEdit);
```

---

## LocalStorage Keys

```javascript
const STORAGE_KEYS = {
  logs: 'ijust_logs',              // All activity logs
  instructors: 'ijust_instructors' // Jiu-Jitsu instructors
};
```

---

## Debugging Tips

### Check if smart defaults are loading:
```javascript
// In GenericForm.jsx useEffect
console.log('Last weight:', getLastBodyWeight());
console.log('Initial form data:', initialData);
```

### Check instructor storage:
```javascript
// In browser console
localStorage.getItem('ijust_instructors')
```

### Check log structure:
```javascript
// In browser console
JSON.parse(localStorage.getItem('ijust_logs'))
```

### Verify edit mode:
```javascript
// In GenericForm.jsx
console.log('Editing log:', editingLog);
console.log('Form data:', formData);
```

---

## Performance Considerations

### Smart Body Weight
- Scans logs in reverse chronological order
- Stops at first match (O(n) worst case, but typically O(1))
- Runs once per form load

### Instructor Dropdown
- Loaded from localStorage (synchronous)
- Filtered on each keystroke (O(n) where n = instructor count)
- Typically < 20 instructors, so negligible

### Technique List
- No hard limit, but UX suffers after ~20 techniques
- Consider adding scroll if needed

---

## Adding New Activity Types

To add body weight to another activity:

1. **Update config:**
```javascript
myActivity: {
  fields: [
    {
      name: 'bodyWeight',
      type: 'number',
      placeholder: '175',
      defaultValue: 175
    },
    {
      name: 'bodyWeightUnit',
      type: 'toggle',
      options: ['lbs', 'kg'],
      defaultValue: 'lbs'
    },
    // ... other fields
  ]
}
```

2. **Add smart default in GenericForm.jsx:**
```javascript
// Already handled! getLastBodyWeight() is universal
```

3. **Update LogCard display:**
```javascript
// Weight display is already universal in renderMetadata()
```

---

## CSS Classes Reference

### Jiu-Jitsu Specific:
- Drilling Partners: `bg-purple-500/20 text-purple-300`
- Sparring Rounds: `bg-red-500/20 text-red-300`
- Technique Cards: `bg-purple-500/10 border border-purple-500/20`

### Edit Button:
- Default: `text-gray-500`
- Hover: `hover:text-blue-400`

### Weight Toggle:
- Style: `underline decoration-dotted`
- Hover: `hover:bg-gray-700`

---

## Testing Shortcuts

### Quick test flow:
```bash
# Terminal 1: Dev server
npm run dev

# Terminal 2: Watch for errors
npm run build

# Browser console
localStorage.clear() // Reset data
location.reload()    // Hard refresh
```

### Populate test data:
```javascript
// Browser console
localStorage.setItem('ijust_instructors', JSON.stringify([
  { name: 'Prof. Dave', beltRank: 'Black' },
  { name: 'Coach Mike', beltRank: 'Purple' },
  { name: 'Instructor Sarah', beltRank: 'Brown' }
]));
```

---

## Deployment Checklist

- [ ] No console errors
- [ ] All field types render correctly
- [ ] Edit functionality works
- [ ] Smart defaults apply
- [ ] Weight toggle functions
- [ ] Instructor dropdown populated
- [ ] Sparring limit enforced
- [ ] Old logs display correctly
- [ ] localStorage persists across refresh
- [ ] Mobile responsive

---

## Version History

**v1.0.0** (Feb 1, 2026)
- Initial implementation of smart defaults
- Jiu-Jitsu schema refactor
- Edit functionality
- Weight unit toggle

---

## Support & Questions

For issues or questions about this implementation, refer to:
- `IMPLEMENTATION_SUMMARY.md` - Detailed overview
- `JIUJITSU_USER_GUIDE.md` - User-facing documentation
- `TESTING_CHECKLIST.md` - Comprehensive test scenarios

---

**Last Updated:** February 1, 2026
**Maintained By:** Development Team
