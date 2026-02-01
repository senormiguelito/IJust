# I Just - App Preview & Architecture

## Visual Overview

### Home Screen (Empty State)
```
┌─────────────────────────────────────────┐
│ I Just                                  │
│ Track your lifestyle, one activity...  │
├─────────────────────────────────────────┤
│                                         │
│           [Empty State]                 │
│   "No logs yet. Start tracking..."      │
│                                         │
│      [+ I Just... Button]               │
│                                         │
└─────────────────────────────────────────┘
```

### Home Screen (With Logs)
```
┌─────────────────────────────────────────┐
│ I Just                                  │
│ Track your lifestyle, one activity...  │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ 💚 Workout        [🗑️]              │ │
│ │ 2 hours ago                         │ │
│ │ Duration: 45 minutes                │ │
│ │ Type: Run                           │ │
│ │ Intensity: 7                        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 💜 Jiu-Jitsu      [🗑️]              │ │
│ │ Yesterday at 7:30 PM                │ │
│ │ Techniques: [Armbar] [Triangle]     │ │
│ │ Partners: [John] [Sarah]            │ │
│ └─────────────────────────────────────┘ │
│                                         │
│                      [+ FAB]            │
└─────────────────────────────────────────┘
```

### Activity Selector Modal
```
┌─────────────────────────────────────────┐
│ I Just...                          [×]  │
├─────────────────────────────────────────┤
│  ┌───────────┐  ┌───────────┐          │
│  │    💪     │  │    🤼     │          │
│  │  Workout  │  │ Jiu-Jitsu │          │
│  └───────────┘  └───────────┘          │
│                                         │
│  ┌───────────┐  ┌───────────┐          │
│  │    🎵     │  │    👥     │          │
│  │   Music   │  │  Social   │          │
│  └───────────┘  └───────────┘          │
│                                         │
│  ┌───────────┐                          │
│  │    🎨     │                          │
│  │ Creative  │                          │
│  └───────────┘                          │
└─────────────────────────────────────────┘
```

### Form Modal (Dynamic Example: Workout)
```
┌─────────────────────────────────────────┐
│ I Just Workout                     [×]  │
├─────────────────────────────────────────┤
│ Duration (minutes) *                    │
│ [________________]                      │
│                                         │
│ Type *                                  │
│ [Select Type    ▼]                      │
│                                         │
│ Intensity: 7                            │
│ ●━━━━━━●━━━━━                          │
│ 1              10                       │
│                                         │
│ Notes                                   │
│ [____________________]                  │
│ [____________________]                  │
│                                         │
│ [   Save   ]  [ Cancel ]                │
└─────────────────────────────────────────┘
```

## Architecture Overview

### Config-Driven Design

The entire app is driven by a single configuration file:

**`src/config/activityConfig.js`**
- Defines all activity types
- Specifies form fields for each activity
- Controls colors and icons
- Easy to extend with new activities

### Component Hierarchy

```
App.jsx
├── ActivitySelector.jsx
├── GenericForm.jsx
│   └── FormField (internal)
│       ├── Text Input
│       ├── Number Input
│       ├── Textarea
│       ├── Select Dropdown
│       ├── Slider
│       └── Tags Input
└── LogCard.jsx
```

### Data Flow

```
1. User clicks "I Just..."
   ↓
2. ActivitySelector shows all activities from config
   ↓
3. User selects activity (e.g., "Workout")
   ↓
4. GenericForm reads workout config
   ↓
5. GenericForm dynamically generates form fields
   ↓
6. User fills form and submits
   ↓
7. Data saved to LocalStorage
   ↓
8. LogCard renders the new log
```

### Key Features

**1. Generic Form Component**
- Reads activity config
- Dynamically generates inputs
- Supports 6 field types:
  - text
  - number
  - textarea
  - select (dropdown)
  - slider (1-10 range)
  - tags (multi-value with Enter key)

**2. LocalStorage Persistence**
- All logs saved automatically
- Data persists between sessions
- No backend required

**3. Color-Coded Activities**
- Each activity has unique colors
- Consistent visual identity
- Easy to scan at a glance

**4. Responsive & Modern UI**
- Tailwind CSS for styling
- Lucide React for icons
- Mobile-friendly design
- Smooth transitions

## Adding a New Activity

To add "Reading" as a new activity:

```javascript
// In src/config/activityConfig.js
reading: {
  id: 'reading',
  label: 'Reading',
  icon: 'BookOpen', // Lucide icon name
  color: 'bg-teal-500',
  colorLight: 'bg-teal-100',
  colorText: 'text-teal-600',
  fields: [
    {
      name: 'bookTitle',
      label: 'Book Title',
      type: 'text',
      required: true,
      placeholder: 'What are you reading?'
    },
    {
      name: 'pagesRead',
      label: 'Pages Read',
      type: 'number',
      required: true,
      placeholder: '50'
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
      required: false,
      placeholder: 'Key takeaways...'
    }
  ]
}
```

That's it! The form will automatically generate, and logs will work.

## Technology Choices

| Technology | Purpose | Why? |
|-----------|---------|------|
| React | UI Framework | Component-based, fast, popular |
| Vite | Build Tool | Lightning-fast dev server |
| Tailwind CSS | Styling | Utility-first, no CSS files needed |
| Lucide React | Icons | Beautiful, consistent icons |
| LocalStorage | Data | Simple, no backend needed |

## File Sizes (Approximate)

- `activityConfig.js`: ~150 lines
- `GenericForm.jsx`: ~200 lines
- `ActivitySelector.jsx`: ~50 lines
- `LogCard.jsx`: ~100 lines
- `App.jsx`: ~100 lines
- Total custom code: ~600 lines

Clean, maintainable, and extensible! 🚀
