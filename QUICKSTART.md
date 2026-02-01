# 🚀 Quick Start Guide

## Prerequisites Check

First, verify Node.js is installed:

```bash
node --version
npm --version
```

If not installed:
- **macOS**: `brew install node` (if you have Homebrew)
- **Or download from**: https://nodejs.org/

## Installation & Running

### Option 1: Using the setup script
```bash
cd /Users/macbookpro/CursorProjects/IJust
./setup.sh
```

### Option 2: Manual installation
```bash
cd /Users/macbookpro/CursorProjects/IJust
npm install
npm run dev
```

Then open **http://localhost:5173** in your browser!

## What You Get

✅ **Complete React App** with:
- 5 pre-configured activity types
- Config-driven architecture
- Generic form component
- LocalStorage persistence
- Beautiful Tailwind UI
- Lucide React icons

✅ **Ready to Customize**:
- Add new activities in `src/config/activityConfig.js`
- Modify colors and icons
- Add new field types
- Extend functionality

## Project Files Created

```
IJust/
├── 📄 package.json              # Dependencies
├── 📄 vite.config.js            # Vite config
├── 📄 tailwind.config.js        # Tailwind config
├── 📄 postcss.config.js         # PostCSS config
├── 📄 index.html                # HTML entry
├── 📄 README.md                 # Documentation
├── 📄 ARCHITECTURE.md           # Architecture guide
├── 📄 setup.sh                  # Setup script
├── 📄 .gitignore                # Git ignore rules
└── src/
    ├── 📄 main.jsx              # App entry point
    ├── 📄 App.jsx               # Main component
    ├── 📄 index.css             # Global styles
    ├── config/
    │   └── 📄 activityConfig.js # Activity definitions
    ├── components/
    │   ├── 📄 ActivitySelector.jsx
    │   ├── 📄 GenericForm.jsx
    │   └── 📄 LogCard.jsx
    └── utils/
        ├── 📄 storage.js        # LocalStorage utils
        └── 📄 dateUtils.js      # Date formatting
```

## Testing the App

1. **Start the app**: `npm run dev`
2. **Click "I Just..."** button
3. **Select an activity** (e.g., Workout)
4. **Fill in the form**:
   - Duration: 45
   - Type: Run
   - Intensity: 7
   - Notes: "Great run!"
5. **Click Save**
6. **See your log** appear in the feed!

## Key Features to Try

### 1. Different Activity Types
- 💚 **Workout**: Track exercise with intensity slider
- 💜 **Jiu-Jitsu**: Add techniques and partners as tags
- 💙 **Music**: Log practice sessions
- 💗 **Social**: Record social activities
- 🧡 **Creative**: Document creative work

### 2. Tag Fields (Jiu-Jitsu)
- Type a technique name
- Press **Enter** to add it
- Click **X** to remove tags

### 3. Persistence
- Refresh the page
- Your logs are still there!
- All stored in browser LocalStorage

### 4. Delete Logs
- Click the trash icon
- Confirm deletion

## Customization Examples

### Change Colors
Edit `src/config/activityConfig.js`:
```javascript
workout: {
  // ...
  color: 'bg-blue-500',        // Change to blue
  colorLight: 'bg-blue-100',
  colorText: 'text-blue-600',
}
```

### Add a New Field
```javascript
fields: [
  // ... existing fields
  {
    name: 'location',
    label: 'Location',
    type: 'text',
    required: false,
    placeholder: 'Where?'
  }
]
```

### Add a New Activity
See `ARCHITECTURE.md` for a complete example!

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder, ready to deploy to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

## Troubleshooting

### Port 5173 already in use?
```bash
# Kill the process on that port
lsof -ti:5173 | xargs kill -9

# Or just use a different port
npm run dev -- --port 3000
```

### Dependencies not installing?
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Module not found errors?
Make sure all dependencies installed correctly:
```bash
npm install react react-dom lucide-react
```

## Next Steps

1. ✅ Install and run the app
2. ✅ Try logging different activities
3. ✅ Explore the code structure
4. ✅ Customize colors and activities
5. ✅ Add your own activity types!

## Support

- Check `README.md` for detailed docs
- Read `ARCHITECTURE.md` to understand the design
- Review `src/config/activityConfig.js` for examples

---

**Built with ❤️ using React, Vite, and Tailwind CSS**

Enjoy tracking your lifestyle! 🎉
