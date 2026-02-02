# Migration Guide

## Overview
This guide explains how to update from the old version to the new refactored version of the I Just app.

---

## Breaking Changes

**Good News: None!** 🎉

This refactor is **100% backward compatible** with existing data. All your logs, instructors, and partners will continue to work exactly as before.

---

## What Changed?

### User-Facing Changes

1. **Error Messages Instead of Blank Screen**
   - If an error occurs, you'll now see a helpful error message with options to reload
   - Previously, the app would just show a blank white screen

2. **Immediate Peer Availability**
   - Adding a partner in one field makes them instantly available in other fields
   - Previously, you had to reload the page to see new partners in other dropdowns

3. **Technique "Shown By" Field**
   - When unchecking "Shown by Instructor", you now get a dropdown with your partner list
   - Previously, it was just a text input

4. **Enter Key Behavior**
   - Pressing Enter in list inputs (techniques, partners) now adds the item instead of submitting the form
   - Pressing Enter in textareas and the Save button still works normally

5. **Gender-Based Weight Classes**
   - When adding a new partner, you select their gender first
   - Weight class options automatically adjust based on gender
   - Male and Female competitors have different IBJJF weight ranges

---

## Data Migration

### No Action Required! ✅

The app will automatically work with your existing data:

- ✅ All existing logs will load normally
- ✅ All existing instructors will be available
- ✅ All existing Jiu-Jitsu partners will be available
- ✅ No data conversion needed
- ✅ No backup/restore needed

### What Happens to Old Partner Data?

**Existing partners** (added before this update):
- Will still appear in all dropdowns
- Weight classes remain as-is (no gender info added retroactively)
- You can continue using them normally

**New partners** (added after this update):
- Will have gender information (for accurate weight class display)
- Weight class will include the actual weight range

---

## Installation Steps

### If Using Git

```bash
# Pull the latest changes
git pull origin main

# Install any new dependencies (if any)
npm install

# Start the dev server
npm run dev
```

### If Using a Downloaded Version

1. Download the new version
2. Replace the `src/` folder with the new one
3. Copy over these new files:
   - `src/components/ErrorBoundary.jsx`
   - `REFACTOR_SUMMARY.md`
   - `TESTING_CHECKLIST.md`
   - `TECHNICAL_ARCHITECTURE.md`
   - `MIGRATION_GUIDE.md` (this file)
4. Run `npm install` (just in case)
5. Run `npm run dev`

---

## First-Time Usage After Update

### Step 1: Verify Your Data
1. Open the app
2. Check that all your existing logs are still there
3. Try editing an old log to ensure it works

### Step 2: Test New Features
1. Create a new Jiu-Jitsu log
2. Add a drilling partner (notice the gender selection)
3. Try adding the same person as a sparring partner without reloading
4. Add a technique and uncheck "Shown by Instructor" to see the new dropdown

### Step 3: Enjoy! 🎉
The app should now be more robust and user-friendly.

---

## Troubleshooting

### Issue: App Shows Error Boundary on Load

**Possible Cause:** Corrupted localStorage data

**Solution:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Type: `localStorage.clear()`
4. Press Enter
5. Reload the page

⚠️ **Warning:** This will delete all your logs. Only do this as a last resort.

**Better Solution:**
1. Export your data first (if you have an export feature)
2. Then clear localStorage
3. Reimport your data

---

### Issue: Peers Not Showing in Dropdowns

**Possible Cause:** Old localStorage data structure

**Solution:**
1. Open DevTools Console (F12)
2. Check your peer data:
   ```javascript
   JSON.parse(localStorage.getItem('ijust_jiujitsu_peers'))
   ```
3. If it looks malformed, clear just the peers:
   ```javascript
   localStorage.removeItem('ijust_jiujitsu_peers')
   ```
4. Re-add your peers through the UI

---

### Issue: Enter Key Still Submits Form

**Possible Cause:** Browser cache

**Solution:**
1. Hard refresh the page:
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`
2. Or clear browser cache for the site

---

### Issue: Weight Classes Look Wrong

**Possible Cause:** You're editing an old partner (added before gender feature)

**Expected Behavior:**
- Old partners will show their original weight class name (e.g., "Middle")
- New partners will show weight class + range (e.g., "Middle (168-181.5 lbs)")

**This is normal!** Old data is preserved as-is. Only new partners get the full gender/range info.

---

## Feature Comparison

| Feature | Old Version | New Version |
|---------|-------------|-------------|
| Error Handling | White screen | User-friendly error message |
| Peer Sync | Reload required | Instant across all fields |
| Technique "Shown By" | Text input | Creatable dropdown from peer pool |
| Enter Key | Submits form | Adds item to current list |
| Weight Classes | Static list | Gender-based with ranges |
| Gender Selection | Not available | Male/Female toggle |
| Crash Prevention | Minimal | Extensive defensive coding |

---

## Developer Notes

### If You're Contributing

1. **Run Linter:**
   ```bash
   npm run lint
   ```

2. **Run Tests (if added):**
   ```bash
   npm test
   ```

3. **Check for Errors:**
   - Open DevTools Console
   - Navigate through the app
   - Create/Edit/Delete logs
   - Ensure no console errors

### If You're Extending the App

**Adding New Peer-Related Fields:**
1. Pass `localPeers` and `onPeerAdded` props to your component
2. Use the same pattern as `TechniqueListField`
3. Call `onPeerAdded()` after saving a new peer

**Example:**
```javascript
const MyNewField = ({ localPeers, onPeerAdded }) => {
  const handleAddPeer = () => {
    saveJiuJitsuPeer(name, belt, weight);
    onPeerAdded?.(); // Refresh all peer lists
  };
  
  return (
    <div>
      {(localPeers || []).map(peer => (
        <div key={peer.name}>{peer.name}</div>
      ))}
    </div>
  );
};
```

---

## Rollback Instructions

If you need to revert to the old version:

### Using Git
```bash
git checkout <previous-commit-hash>
npm install
npm run dev
```

### Manual Rollback
1. Restore your backup of the old `src/` folder
2. Remove `ErrorBoundary.jsx`
3. Restore the old `main.jsx`
4. Restore the old `GenericForm.jsx`
5. Run `npm install`
6. Run `npm run dev`

**Note:** Your data (localStorage) will still work with the old version.

---

## Support

### Getting Help

1. **Check Documentation:**
   - `REFACTOR_SUMMARY.md` - What changed
   - `TECHNICAL_ARCHITECTURE.md` - How it works
   - `TESTING_CHECKLIST.md` - How to test

2. **Check Console:**
   - Open DevTools (F12)
   - Look for error messages
   - Copy the error text

3. **Report Issues:**
   - Include your browser version
   - Include the error message from console
   - Describe what you were doing when the error occurred

---

## FAQ

### Q: Will this update affect my mobile device?
**A:** If you're using the web app on mobile, you'll need to reload the page to get the update. Your data will remain intact.

### Q: Do I need to re-add all my partners?
**A:** No! All existing partners will continue to work. Only new partners will have the gender/weight range feature.

### Q: Can I still use the app offline?
**A:** Yes, the app still works offline once loaded (assuming you're using a PWA setup).

### Q: Will future updates require migration?
**A:** We'll try to keep all updates backward compatible. If a breaking change is necessary, we'll provide clear migration instructions.

### Q: Can I export my data before updating?
**A:** Yes, you can manually export your localStorage data:
```javascript
// In browser console
const data = {
  logs: localStorage.getItem('ijust_logs'),
  instructors: localStorage.getItem('ijust_instructors'),
  peers: localStorage.getItem('ijust_jiujitsu_peers')
};
console.log(JSON.stringify(data));
// Copy this and save it to a file
```

---

## Changelog

### Version 2.0 (February 2026)

**Added:**
- Error Boundary for crash prevention
- Real-time peer synchronization
- Creatable Select for technique peers
- Gender-based weight class system
- Global Enter key handler

**Fixed:**
- White screen crashes
- Peer availability issues
- Form submission on Enter key
- Weight class inaccuracies

**Changed:**
- Technique "Shown By" now uses peer dropdown
- Partner modal now includes gender selection
- Weight class dropdown is now dynamic

**Removed:**
- Nothing! All old features preserved.

---

## Next Steps

1. ✅ Read this migration guide
2. ✅ Update your code
3. ✅ Test with your existing data
4. ✅ Try the new features
5. ✅ Report any issues

Enjoy the improved I Just app! 🚀
