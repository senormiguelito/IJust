# Technical Architecture Documentation

## Overview
This document explains the technical implementation of the peer synchronization system and form enhancements in the I Just app.

---

## 1. Peer State Management Architecture

### 1.1 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      GenericForm (Parent)                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ State: localPeers = []                                 │ │
│  │ Function: refreshLocalPeers()                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
│                            │ Props passed down               │
│                            ▼                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              FormField (Router)                       │  │
│  │  Distributes localPeers & onPeerAdded to children    │  │
│  └──────────────────────────────────────────────────────┘  │
│         │                 │                  │               │
│         ▼                 ▼                  ▼               │
│  ┌───────────┐   ┌──────────────┐   ┌──────────────┐      │
│  │Techniques │   │Drilling      │   │Sparring      │      │
│  │ListField  │   │PartnersField │   │RoundsField   │      │
│  └───────────┘   └──────────────┘   └──────────────┘      │
│         │                 │                  │               │
│         │                 │                  │               │
│         └─────────────────┼──────────────────┘               │
│                           │                                  │
│                           │ Calls onPeerAdded()              │
│                           ▼                                  │
│              refreshLocalPeers() → Updates localPeers        │
│                           │                                  │
│                           ▼                                  │
│              All components re-render with new data          │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 State Lifecycle

1. **Initialization** (GenericForm mounts):
   ```javascript
   useEffect(() => {
     if (activityConfig.id === 'jiujitsu') {
       refreshLocalPeers();
     }
   }, [activityConfig.id]);
   ```

2. **Refresh Function**:
   ```javascript
   const refreshLocalPeers = () => {
     const peers = loadJiuJitsuPeers();
     setLocalPeers(peers || []);
   };
   ```

3. **Add New Peer** (from any child component):
   ```javascript
   const handlePartnerDataSubmit = (beltRank, weightClass) => {
     // 1. Save to localStorage
     saveJiuJitsuPeer(pendingPartner, beltRank, weightClass);
     
     // 2. Trigger parent refresh
     onPeerAdded?.();
     
     // 3. Update local component state
     // ... (component-specific logic)
   };
   ```

4. **Props Distribution**:
   ```javascript
   <FormField
     localPeers={localPeers}           // Current peer list
     onPeerAdded={refreshLocalPeers}   // Callback to refresh
     // ... other props
   />
   ```

### 1.3 Why This Approach?

**Alternative 1: Global State (Redux/Context)**
- ❌ Overkill for single-form scope
- ❌ Adds complexity and boilerplate
- ❌ Harder to maintain

**Alternative 2: Prop Drilling (Without Callbacks)**
- ❌ Each child has isolated state
- ❌ No synchronization between fields
- ❌ Requires full form re-render on every change

**Our Approach: Parent State + Callback Pattern** ✅
- ✅ Simple and maintainable
- ✅ Scoped to form component
- ✅ Immediate synchronization
- ✅ Minimal re-renders (only when peer added)
- ✅ Works with React 18+ patterns

---

## 2. Form Key Handler System

### 2.1 Event Delegation Pattern

```javascript
// Parent form handles ALL keydown events
<form onKeyDown={handleFormKeyDown}>

const handleFormKeyDown = (e) => {
  if (e.key === 'Enter') {
    const target = e.target;
    
    // Allow normal behavior for certain elements
    if (target.tagName === 'TEXTAREA' || target.type === 'submit') {
      return; // Let default behavior happen
    }
    
    // Prevent form submission
    e.preventDefault();
    
    // Find context and trigger appropriate action
    const parentDiv = target.closest('[data-list-type]');
    if (parentDiv) {
      const addButton = parentDiv.querySelector('button[type="button"]');
      if (addButton?.textContent.includes('Add')) {
        addButton.click();
      }
    }
  }
};
```

### 2.2 Context Detection

Each list component has a `data-list-type` attribute:

```javascript
// TechniqueListField
<div className="mb-4" data-list-type="technique">
  <input type="text" value={inputValue} onChange={...} />
  <button type="button" onClick={handleAddTechnique}>Add</button>
</div>
```

This allows the parent handler to:
1. Detect which list context the input belongs to
2. Find the appropriate "Add" button
3. Trigger the correct add action

### 2.3 Event Flow

```
User presses Enter in Technique input
          ↓
Form's onKeyDown handler fires
          ↓
Check: Is target a textarea? No
Check: Is target a submit button? No
          ↓
Prevent default form submission
          ↓
Find closest element with [data-list-type]
          ↓
Found: <div data-list-type="technique">
          ↓
Find button with "Add" text inside that div
          ↓
Programmatically click the button
          ↓
Technique is added to list
```

---

## 3. Gender-Based Weight Class System

### 3.1 Data Structure

```javascript
const weightClasses = {
  Male: [
    { name: 'Rooster', range: '<127 lbs' },
    { name: 'Middle', range: '168-181.5 lbs' },
    // ... more classes
  ],
  Female: [
    { name: 'Rooster', range: '<107 lbs' },
    { name: 'Middle', range: '141.5-152.5 lbs' },
    // ... more classes
  ]
};
```

### 3.2 Reactive Selection System

```javascript
const [gender, setGender] = useState('Male');
const [weightClass, setWeightClass] = useState('');

// Reset weight class when gender changes
useEffect(() => {
  setWeightClass('');
}, [gender]);

// Render dynamic options
<select value={weightClass} onChange={...}>
  {weightClasses[gender].map((wc) => (
    <option key={wc.name} value={wc.name}>
      {wc.name}{wc.range ? ` (${wc.range})` : ''}
    </option>
  ))}
</select>
```

### 3.3 UI State Management

```
Initial State: gender='Male', weightClass=''
       ↓
User selects "Middle (168-181.5 lbs)"
       ↓
State: gender='Male', weightClass='Middle'
       ↓
User clicks "Female" button
       ↓
useEffect triggers → setWeightClass('')
       ↓
State: gender='Female', weightClass=''
       ↓
Dropdown re-renders with female weight classes
```

---

## 4. Error Boundary Implementation

### 4.1 React Error Boundary Pattern

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorUI error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### 4.2 Error Catching Hierarchy

```
main.jsx
  └─ <ErrorBoundary>          ← Catches ALL errors
       └─ <App>
            └─ <GenericForm>
                 └─ <FormField>
                      └─ <DrillingPartnersField>
                           └─ [Error thrown here]
                                    │
                                    ▼
                      Bubbles up to ErrorBoundary
                                    │
                                    ▼
                      Error UI displayed (no white screen)
```

---

## 5. Defensive Coding Patterns

### 5.1 Optional Chaining

```javascript
// Before (crashes if peer is undefined)
const filteredPeers = jiujitsuPeers.filter(peer =>
  peer.name.toLowerCase().includes(searchTerm)
);

// After (safe)
const filteredPeers = (localPeers || []).filter(peer =>
  peer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
);
```

### 5.2 Null Coalescing for Arrays

```javascript
// Ensures we always have an array to work with
const peers = loadJiuJitsuPeers() || [];
```

### 5.3 Safe Array Access

```javascript
// Check array exists before finding
const existingPeer = (localPeers || []).find(p => 
  p?.name?.toLowerCase() === searchTerm?.toLowerCase()
);
```

---

## 6. Component Communication Patterns

### 6.1 Prop Drilling

```
GenericForm
  │
  ├─ localPeers (state)
  ├─ refreshLocalPeers (function)
  │
  └─▶ FormField (receives as props)
        │
        └─▶ TechniqueListField (receives as props)
              │
              └─ Uses localPeers for dropdown
              └─ Calls onPeerAdded when adding new peer
```

### 6.2 Callback Pattern

```javascript
// Parent defines callback
const handlePeerAdded = () => {
  refreshLocalPeers();
};

// Child receives callback
<ChildComponent onPeerAdded={handlePeerAdded} />

// Child invokes callback
const addNewPeer = () => {
  saveJiuJitsuPeer(...);
  onPeerAdded?.(); // Safely call if exists
};
```

---

## 7. Performance Considerations

### 7.1 Minimal Re-renders

- `localPeers` state only updates when a peer is added (not on every keystroke)
- Other form fields don't re-render when peer list updates
- Dropdown filtering happens locally (no state updates)

### 7.2 Event Delegation

- Single keydown handler on form (not one per input)
- Reduces event listener overhead
- Easier to maintain and debug

### 7.3 Lazy Loading

- Peers only loaded for Jiu-Jitsu forms
- Other activity types don't incur overhead

```javascript
useEffect(() => {
  if (activityConfig.id === 'jiujitsu') {
    refreshLocalPeers();
  }
}, [activityConfig.id]);
```

---

## 8. Data Persistence

### 8.1 localStorage Structure

```javascript
// Key: 'ijust_jiujitsu_peers'
// Value: JSON array
[
  {
    "name": "John Doe",
    "beltRank": "Blue",
    "weightClass": "Middle"
  },
  {
    "name": "Jane Smith",
    "beltRank": "Purple",
    "weightClass": "Light"
  }
]
```

### 8.2 Read/Write Pattern

```javascript
// Write (in storage.js)
export const saveJiuJitsuPeer = (name, beltRank, weightClass) => {
  const peers = loadJiuJitsuPeers();
  const existing = peers.find(p => 
    p.name.toLowerCase() === name.toLowerCase()
  );
  
  if (!existing) {
    peers.push({ name, beltRank, weightClass });
    localStorage.setItem(JIUJITSU_PEERS_KEY, JSON.stringify(peers));
    return true;
  }
  return false; // Already exists
};

// Read
export const loadJiuJitsuPeers = () => {
  try {
    const peers = localStorage.getItem(JIUJITSU_PEERS_KEY);
    return peers ? JSON.parse(peers) : [];
  } catch (error) {
    console.error('Error loading peers:', error);
    return [];
  }
};
```

---

## 9. Type Safety Considerations

### 9.1 Prop Types (Recommended Addition)

```javascript
// Could add PropTypes for better type checking
import PropTypes from 'prop-types';

TechniqueListField.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  localPeers: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    beltRank: PropTypes.string,
    weightClass: PropTypes.string
  })),
  onPeerAdded: PropTypes.func
};
```

### 9.2 TypeScript Migration Path

If converting to TypeScript in the future:

```typescript
interface JiuJitsuPeer {
  name: string;
  beltRank: 'White' | 'Blue' | 'Purple' | 'Brown' | 'Black' | 'Coral/Red';
  weightClass: string;
}

interface TechniqueListFieldProps {
  field: FormField;
  value?: Technique[];
  onChange: (value: Technique[]) => void;
  localPeers?: JiuJitsuPeer[];
  onPeerAdded?: () => void;
}
```

---

## 10. Testing Strategy

### 10.1 Unit Tests (Recommended)

```javascript
// Example test for refreshLocalPeers
describe('GenericForm', () => {
  it('should refresh peers when peer is added', () => {
    const { result } = renderHook(() => {
      const [localPeers, setLocalPeers] = useState([]);
      const refreshLocalPeers = () => {
        const peers = loadJiuJitsuPeers();
        setLocalPeers(peers || []);
      };
      return { localPeers, refreshLocalPeers };
    });
    
    // Add peer to localStorage
    saveJiuJitsuPeer('Test', 'Blue', 'Middle');
    
    // Refresh
    act(() => {
      result.current.refreshLocalPeers();
    });
    
    // Verify
    expect(result.current.localPeers).toContainEqual({
      name: 'Test',
      beltRank: 'Blue',
      weightClass: 'Middle'
    });
  });
});
```

### 10.2 Integration Tests

- Test peer synchronization across multiple fields
- Test Enter key behavior in different contexts
- Test error boundary catching errors

### 10.3 E2E Tests (Cypress/Playwright)

```javascript
// Example Cypress test
it('should sync peers between drilling and sparring', () => {
  cy.visit('/');
  cy.contains('I Just...').click();
  cy.contains('Jiu-Jitsu').click();
  
  // Add drilling partner
  cy.get('[data-testid="drilling-partner-input"]').type('John Doe');
  cy.contains('Add "John Doe"').click();
  cy.contains('Blue').click();
  cy.contains('Middle').click();
  cy.contains('Add Partner').click();
  
  // Check sparring dropdown
  cy.get('[data-testid="sparring-partner-input"]').click();
  cy.contains('John Doe').should('be.visible');
});
```

---

## 11. Future Enhancements

### 11.1 Potential Improvements

1. **Debounced Search**:
   ```javascript
   const debouncedSearch = useDebounce(searchTerm, 300);
   ```

2. **Virtual Scrolling** (for large peer lists):
   ```javascript
   import { FixedSizeList } from 'react-window';
   ```

3. **Peer Editing**:
   - Allow updating belt rank/weight class for existing peers
   - Cascade updates to all logs using that peer

4. **Peer Analytics**:
   - Track which peers are used most
   - Show "recently added" badge
   - Suggest peers based on usage patterns

5. **Export/Import Peers**:
   - Export peer list as JSON
   - Import from file or another device

---

## 12. Troubleshooting Guide

### Issue: Peers not syncing

**Diagnosis:**
```javascript
console.log('Local Peers:', localPeers);
console.log('localStorage:', localStorage.getItem('ijust_jiujitsu_peers'));
```

**Solution:**
- Check if `onPeerAdded` prop is passed correctly
- Verify `refreshLocalPeers()` is called after save
- Check browser console for errors

### Issue: Enter key still submits form

**Diagnosis:**
- Check if `onKeyDown={handleFormKeyDown}` is on `<form>` element
- Verify `e.preventDefault()` is being called

**Solution:**
- Ensure form has `ref={formRef}`
- Check console for event handler logs

### Issue: Weight class not updating

**Diagnosis:**
```javascript
console.log('Gender:', gender);
console.log('Weight Class:', weightClass);
```

**Solution:**
- Verify `useEffect` is resetting weight class
- Check if dropdown is using correct `weightClasses[gender]`

---

## Conclusion

This architecture provides:
- ✅ **Immediate synchronization** between related fields
- ✅ **Robust error handling** with Error Boundary
- ✅ **Intelligent form behavior** with Enter key handling
- ✅ **Gender-aware weight classes** for accurate data
- ✅ **Defensive coding** to prevent crashes
- ✅ **Clean component architecture** with clear data flow
- ✅ **Performance optimization** with minimal re-renders
- ✅ **Maintainability** through well-organized code

All changes are backward compatible and don't break existing functionality.
