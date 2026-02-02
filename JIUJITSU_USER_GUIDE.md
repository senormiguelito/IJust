# Jiu-Jitsu Activity - User Guide

## New Form Layout

When you click "I Just..." → "Jiu-Jitsu", you'll see this new form structure:

### 1. Body Weight Section
```
┌─────────────────────────────────────┐
│ Body Weight                         │
│ ┌─────────────────────────────────┐ │
│ │ 175                             │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Weight Unit                         │
│ ┌──────────┬──────────┐            │
│ │   lbs    │    kg    │            │
│ └──────────┴──────────┘            │
└─────────────────────────────────────┘
```
- Auto-fills with your last recorded weight
- Toggle between lbs and kg

---

### 2. Instructor (Smart Dropdown)
```
┌─────────────────────────────────────┐
│ Instructor                          │
│ ┌─────────────────────────────────┐ │
│ │ Select or add instructor      ▼ │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Dropdown shows:                     │
│ ┌─────────────────────────────────┐ │
│ │ 🔵 Prof. Mike                   │ │
│ │ 🟣 Coach Sarah                  │ │
│ │ ⚫ Master Carlos                │ │
│ │ ─────────────────────────────── │ │
│ │ + Add "New Name"                │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```
**Usage:**
1. Start typing a name
2. If the instructor exists, select from dropdown
3. If new, click "+ Add" → Belt Rank modal appears
4. Select belt rank (Blue/Purple/Brown/Black/Coral)

**Belt Icons:**
- 🔵 Blue Belt
- 🟣 Purple Belt
- 🟤 Brown Belt
- ⚫ Black Belt
- 🔴 Coral Belt

---

### 3. Drilling Partner(s)
```
┌─────────────────────────────────────┐
│ Drilling Partner(s)                 │
│ Press Enter to add partner          │
│                                     │
│ ┌───────┐ ┌───────┐ ┌───────┐      │
│ │ John × │ │ Mike × │ │ Sarah × │   │
│ └───────┘ └───────┘ └───────┘      │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Enter name...                   │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```
- Add multiple drilling partners
- Press Enter after each name
- Click × to remove

---

### 4. Techniques (New!)
```
┌─────────────────────────────────────┐
│ Techniques                          │
│ ┌─────────────────────┬──────┐     │
│ │ Add technique       │ Add  │     │
│ └─────────────────────┴──────┘     │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Triangle Choke            [×]   │ │
│ │ ☑ Shown by Instructor?          │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Armbar from Guard         [×]   │ │
│ │ ☐ Shown by Instructor?          │ │
│ │ ┌──────────────────────────────┐│ │
│ │ │ Who showed this? John       ││ │
│ │ └──────────────────────────────┘│ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```
**For each technique:**
1. Type name and press Enter (or click Add)
2. Check "Shown by Instructor?" if applicable
3. If unchecked, enter who showed you (peer name)

---

### 5. Sparring Rounds (Max 15)
```
┌─────────────────────────────────────┐
│ Sparring Rounds            (3/15)   │
│ Press Enter to add sparring partner │
│                                     │
│ ┌───────┐ ┌───────┐ ┌───────┐      │
│ │ Tom  × │ │ Alex × │ │ Chris × │   │
│ └───────┘ └───────┘ └───────┘      │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Enter name...                   │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```
**Key Features:**
- Counter shows (current/15)
- Input disables when you reach 15 partners
- Different from drilling partners (these are sparring-specific)

---

### 6. Reflection
```
┌─────────────────────────────────────┐
│ Reflection                          │
│ ┌─────────────────────────────────┐ │
│ │ What did you learn today?       │ │
│ │                                 │ │
│ │                                 │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```
- Free-form notes
- What you learned, how you felt, etc.

---

## Feed View (After Logging)

### Log Card Display

```
┌────────────────────────────────────────────────┐
│ 🤘 Jiu-Jitsu              Today, 2:30 PM  ✏️ 🗑 │
├────────────────────────────────────────────────┤
│                                                │
│ Instructor: ⚫ Prof. Dave                      │
│                                                │
│ Drilling Partners                              │
│ ┌────────┐ ┌────────┐                         │
│ │  John  │ │  Mike  │                         │
│ └────────┘ └────────┘                         │
│                                                │
│ Techniques                                     │
│ ┌──────────────────────────────────────────┐  │
│ │ Triangle Choke       👨‍🏫 Instructor      │  │
│ └──────────────────────────────────────────┘  │
│ ┌──────────────────────────────────────────┐  │
│ │ Armbar from Guard    👥 John              │  │
│ └──────────────────────────────────────────┘  │
│                                                │
│ Sparring Rounds                                │
│ ┌─────┐ ┌──────┐ ┌───────┐                   │
│ │ Tom │ │ Alex │ │ Chris │                   │
│ └─────┘ └──────┘ └───────┘                   │
│                                                │
│ ⚖️ Weight: 175 lbs (click to toggle)          │
│                                                │
│ Reflection                                     │
│ Great session! Finally got the triangle...    │
│                                                │
└────────────────────────────────────────────────┘
```

**Interactive Elements:**
- ✏️ (Edit) - Click to edit this log
- 🗑 (Delete) - Click to delete this log
- Weight value - Click to toggle lbs ↔ kg

---

## Weight Toggle Feature

Click any weight value in the feed to toggle units:

**Before Click:**
```
⚖️ Weight: 175 lbs
        --------
        (underlined, clickable)
```

**After Click:**
```
⚖️ Weight: 79.4 kg
        -------
        (underlined, clickable)
```

**Key Points:**
- Original data is never changed
- Only the display toggles
- Works for all activities with body weight
- Each log card has independent toggle state

---

## Edit Feature

### How to Edit a Log:

1. **Click the Edit button (✏️)** on any log card

2. **Form opens pre-filled** with existing data:
```
┌─────────────────────────────────────┐
│ Edit Jiu-Jitsu               [×]    │
├─────────────────────────────────────┤
│                                     │
│ (All fields populated with          │
│  existing values)                   │
│                                     │
│ ┌──────────┬──────────┐            │
│ │   Save   │  Cancel  │            │
│ └──────────┴──────────┘            │
└─────────────────────────────────────┘
```

3. **Make changes** to any field

4. **Click Save** - Log updates in place (maintains timestamp and position)

**What Gets Preserved:**
- Original timestamp (not updated)
- Log ID (same entry)
- Position in feed

---

## Smart Defaults Explained

### First Time User:
- Body Weight defaults to **160 lbs**
- No instructors in dropdown (add your first one)

### Returning User:
- Body Weight auto-fills from your **last logged weight**
- Instructors dropdown shows all previously added instructors
- Each subsequent log remembers your last weight

**Example:**
```
Session 1: Log 175 lbs
Session 2: Form auto-fills 175 lbs
Session 3: Change to 173 lbs, save
Session 4: Form auto-fills 173 lbs
...and so on
```

---

## Color Coding in Feed

### Jiu-Jitsu Badges:
- **Purple badges** = Drilling Partners
- **Red badges** = Sparring Rounds
- **Purple cards with border** = Techniques
- **Gray text with icons** = Instructor indicators
  - 👨‍🏫 = Shown by Instructor
  - 👥 = Shown by Peer

---

## Tips & Best Practices

### Instructors:
- Add each instructor once (with belt rank)
- They'll appear in dropdown for future sessions
- Use format: "Prof. [Name]" or "Coach [Name]" for clarity

### Techniques:
- Be specific: "Triangle Choke from Guard" vs. "Triangle"
- Check "Shown by Instructor" for class curriculum
- Use peer names for after-class training

### Drilling vs. Sparring:
- **Drilling Partners**: People you drilled with during technique practice
- **Sparring Rounds**: People you rolled/sparred with

### Body Weight:
- Log consistently (morning, before training, after, etc.)
- Toggle units in feed for international comparison
- Track trends over time

---

## Keyboard Shortcuts

- **Enter** - Add tag/partner (in tag fields)
- **Escape** - Close modal/dropdown
- **Tab** - Navigate between fields

---

## Troubleshooting

### "I can't add more than 15 sparring partners"
This is intentional. The limit prevents data overload. If you sparred with more than 15 people, consider just adding the most significant rounds.

### "My old logs look different"
Old logs without the new fields will display gracefully. They won't show sections for fields that don't exist. Your data is safe.

### "I want to change an instructor's belt rank"
Currently not supported. As a workaround, you can manually edit localStorage or use a new name variation.

### "Weight isn't auto-filling"
Check if you have any previous logs with body weight. First-time users will see 160 lbs as the default.

---

## Data Storage

All data is stored locally in your browser using localStorage:
- **Logs**: `ijust_logs`
- **Instructors**: `ijust_instructors`

**Note:** Clearing browser data will erase your logs. Consider periodic exports (feature not yet implemented).

---

**Last Updated: February 1, 2026**
