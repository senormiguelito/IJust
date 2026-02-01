# Visual Design Guide - I Just

## Color Palette

### Activity Colors

```
💚 Workout (Green)
   Primary:    #22c55e (bg-green-500)
   Light:      #dcfce7 (bg-green-100)
   Text:       #16a34a (text-green-600)

💜 Jiu-Jitsu (Purple)
   Primary:    #a855f7 (bg-purple-500)
   Light:      #f3e8ff (bg-purple-100)
   Text:       #9333ea (text-purple-600)

💙 Music (Indigo)
   Primary:    #6366f1 (bg-indigo-500)
   Light:      #e0e7ff (bg-indigo-100)
   Text:       #4f46e5 (text-indigo-600)

💗 Social (Pink)
   Primary:    #ec4899 (bg-pink-500)
   Light:      #fce7f3 (bg-pink-100)
   Text:       #db2777 (text-pink-600)

🧡 Creative (Orange)
   Primary:    #f97316 (bg-orange-500)
   Light:      #ffedd5 (bg-orange-100)
   Text:       #ea580c (text-orange-600)
```

## Component Layouts

### 1. Empty State
```
┌──────────────────────────────────────────────────┐
│  I Just                                          │
│  Track your lifestyle, one activity at a time    │
├──────────────────────────────────────────────────┤
│                                                  │
│              ⚡ No logs yet                      │
│                                                  │
│      Start tracking your activities!             │
│                                                  │
│          ┌──────────────┐                        │
│          │  + I Just... │                        │
│          └──────────────┘                        │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 2. Log Feed (with activities)
```
┌──────────────────────────────────────────────────┐
│  I Just                                          │
│  Track your lifestyle, one activity at a time    │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ [💚] Workout                        [🗑️] │ │
│  │ 2 hours ago                                │ │
│  │                                            │ │
│  │ DURATION (MINUTES)                         │ │
│  │ 45                                         │ │
│  │                                            │ │
│  │ TYPE                                       │ │
│  │ Run                                        │ │
│  │                                            │ │
│  │ INTENSITY                                  │ │
│  │ 7                                          │ │
│  │                                            │ │
│  │ NOTES                                      │ │
│  │ Great morning run! Felt strong.            │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ [💜] Jiu-Jitsu                      [🗑️] │ │
│  │ Yesterday at 7:30 PM                       │ │
│  │                                            │ │
│  │ TECHNIQUES                                 │ │
│  │ [Armbar] [Triangle] [Sweep]                │ │
│  │                                            │ │
│  │ PARTNERS                                   │ │
│  │ [John] [Sarah]                             │ │
│  │                                            │ │
│  │ INSTRUCTOR                                 │ │
│  │ Professor Mike                             │ │
│  │                                            │ │
│  │ REFLECTION                                 │ │
│  │ Worked on escapes from side control...     │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ [💙] Music                          [🗑️] │ │
│  │ Friday at 3:15 PM                          │ │
│  │                                            │ │
│  │ INSTRUMENT                                 │ │
│  │ Drums                                      │ │
│  │                                            │ │
│  │ TYPE                                       │ │
│  │ Practice                                   │ │
│  │                                            │ │
│  │ DURATION (MINUTES)                         │ │
│  │ 90                                         │ │
│  │                                            │ │
│  │ NOTES                                      │ │
│  │ Practiced double bass patterns             │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│                                          ┌────┐ │
│                                          │ +  │ │ FAB
│                                          └────┘ │
└──────────────────────────────────────────────────┘
```

### 3. Activity Selector Modal
```
         ┌────────────────────────────────┐
         │  I Just...                [×] │
         ├────────────────────────────────┤
         │                                │
         │  ┌───────────┐  ┌───────────┐ │
         │  │    💪     │  │    🤼     │ │
         │  │           │  │           │ │
         │  │  Workout  │  │ Jiu-Jitsu │ │
         │  │           │  │           │ │
         │  └───────────┘  └───────────┘ │
         │                                │
         │  ┌───────────┐  ┌───────────┐ │
         │  │    🎵     │  │    👥     │ │
         │  │           │  │           │ │
         │  │   Music   │  │  Social   │ │
         │  │           │  │           │ │
         │  └───────────┘  └───────────┘ │
         │                                │
         │  ┌───────────┐                 │
         │  │    🎨     │                 │
         │  │           │                 │
         │  │ Creative  │                 │
         │  │           │                 │
         │  └───────────┘                 │
         │                                │
         └────────────────────────────────┘
```

### 4. Form Modal - Workout Example
```
         ┌────────────────────────────────┐
         │  I Just Workout           [×] │
         ├────────────────────────────────┤
         │                                │
         │  Duration (minutes) *          │
         │  ┌──────────────────────────┐ │
         │  │ 45                       │ │
         │  └──────────────────────────┘ │
         │                                │
         │  Type *                        │
         │  ┌──────────────────────────┐ │
         │  │ Run                    ▼ │ │
         │  └──────────────────────────┘ │
         │                                │
         │  Intensity: 7                  │
         │  ●━━━━━━━●━━━                 │
         │  1                10           │
         │                                │
         │  Notes                         │
         │  ┌──────────────────────────┐ │
         │  │ Great morning run!       │ │
         │  │ Felt strong.             │ │
         │  │                          │ │
         │  └──────────────────────────┘ │
         │                                │
         │  ┌────────┐  ┌────────┐       │
         │  │  Save  │  │ Cancel │       │
         │  └────────┘  └────────┘       │
         │                                │
         └────────────────────────────────┘
```

### 5. Form Modal - Jiu-Jitsu Example (with Tags)
```
         ┌────────────────────────────────┐
         │  I Just Jiu-Jitsu         [×] │
         ├────────────────────────────────┤
         │                                │
         │  Techniques                    │
         │  [Armbar ×] [Triangle ×]       │
         │  [Sweep ×]                     │
         │  ┌──────────────────────────┐ │
         │  │ Enter technique...       │ │
         │  └──────────────────────────┘ │
         │  (Press Enter to add)          │
         │                                │
         │  Partners                      │
         │  [John ×] [Sarah ×]            │
         │  ┌──────────────────────────┐ │
         │  │ Enter partner...         │ │
         │  └──────────────────────────┘ │
         │                                │
         │  Instructor                    │
         │  ┌──────────────────────────┐ │
         │  │ Professor Mike           │ │
         │  └──────────────────────────┘ │
         │                                │
         │  Reflection                    │
         │  ┌──────────────────────────┐ │
         │  │ Worked on escapes from   │ │
         │  │ side control today...    │ │
         │  │                          │ │
         │  └──────────────────────────┘ │
         │                                │
         │  ┌────────┐  ┌────────┐       │
         │  │  Save  │  │ Cancel │       │
         │  └────────┘  └────────┘       │
         │                                │
         └────────────────────────────────┘
```

## UI/UX Features

### Interactions

1. **Hover Effects**
   - Activity selector tiles scale on hover
   - Delete buttons change color on hover
   - Form buttons have opacity/color changes

2. **Transitions**
   - Smooth scale transforms (200ms)
   - Opacity changes on buttons
   - Modal fade-in with backdrop

3. **Responsive Design**
   - Mobile-first approach
   - Stacks properly on small screens
   - Touch-friendly tap targets

### Accessibility

- Required fields marked with asterisk
- Proper label associations
- Keyboard navigation support
- Semantic HTML structure
- Contrast-compliant colors

### User Feedback

- Empty state guidance
- Confirmation dialog on delete
- Visual feedback on form submission
- Clear field validation (required)
- Placeholder text guidance

## Typography

```
Headings:
- H1 (App Title): 3xl, bold
- H2 (Modal Title): 2xl, bold
- H3 (Activity Label): base, bold

Body:
- Log Content: base, normal
- Field Labels: sm, medium, uppercase
- Timestamps: sm, normal
- Placeholders: base, normal, gray-400

Font Family: 
Inter, system-ui, Avenir, Helvetica, Arial, sans-serif
```

## Spacing System

```
Padding:
- Modal: p-6 (1.5rem)
- Cards: p-4 (1rem)
- Inputs: px-4 py-2
- Buttons: px-6 py-3

Margins:
- Between cards: space-y-4
- Between fields: mb-4
- Section gaps: gap-3, gap-4

Border Radius:
- Cards: rounded-lg (0.5rem)
- Inputs: rounded-lg
- Buttons: rounded-lg
- Tags: rounded-full
- FAB: rounded-full
```

## Iconography

Using **Lucide React** icons:

- Plus: Add new log
- X: Close modals, remove tags
- Trash2: Delete logs
- Dumbbell: Workout activity
- HandMetal: Jiu-Jitsu activity
- Music: Music activity
- Users: Social activity
- Palette: Creative activity

## Mobile Responsive Breakpoints

```css
/* Mobile First Design */
Base: 320px+ (full width)
Cards: max-w-4xl, centered
Modals: max-w-md, centered
Grid: 2 columns on mobile for activity selector

/* Tablet+ (not explicitly defined, scales naturally) */
Maintains same layout with better spacing
```

---

This design system ensures a **consistent, beautiful, and intuitive** user experience! 🎨
