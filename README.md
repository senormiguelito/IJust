# I Just - Lifestyle Logger

A beautiful, config-driven React web app for tracking your daily activities. Built with React, Tailwind CSS, and Lucide React icons.

## Features

- **Config-Driven Architecture**: All activities and their form fields are defined in a single configuration file
- **Generic Form Component**: Dynamically generates forms based on activity configuration
- **5 Activity Types**:
  - 💪 Workout (Duration, Type, Intensity, Notes)
  - 🤼 Jiu-Jitsu (Techniques, Partners, Instructor, Reflection)
  - 🎵 Music (Instrument, Type, Duration, Notes)
  - 👥 Social (Who, Activity, Location)
  - 🎨 Creative (Type, Output Description)
- **LocalStorage Persistence**: All logs saved locally in your browser
- **Beautiful UI**: Distinct color coding for each activity type
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **LocalStorage** - Data persistence

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd /Users/macbookpro/CursorProjects/IJust
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## Project Structure

```
IJust/
├── src/
│   ├── config/
│   │   └── activityConfig.js      # Activity schema configuration
│   ├── components/
│   │   ├── ActivitySelector.jsx   # Activity selection modal
│   │   ├── GenericForm.jsx        # Dynamic form component
│   │   └── LogCard.jsx           # Log display component
│   ├── utils/
│   │   ├── storage.js            # LocalStorage utilities
│   │   └── dateUtils.js          # Date formatting utilities
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # App entry point
│   └── index.css                 # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Configuration

### Adding a New Activity

To add a new activity type, edit `src/config/activityConfig.js`:

```javascript
export const activityConfig = {
  // ... existing activities
  
  newActivity: {
    id: 'newActivity',
    label: 'New Activity',
    icon: 'IconName', // Lucide React icon name
    color: 'bg-blue-500',
    colorLight: 'bg-blue-100',
    colorText: 'text-blue-600',
    fields: [
      {
        name: 'fieldName',
        label: 'Field Label',
        type: 'text', // text, number, textarea, select, slider, tags
        required: true,
        placeholder: 'Enter value...'
      }
      // ... more fields
    ]
  }
};
```

### Supported Field Types

- **text**: Single-line text input
- **number**: Numeric input
- **textarea**: Multi-line text input
- **select**: Dropdown with predefined options
- **slider**: Range slider (1-10 scale)
- **tags**: Multiple tag input (press Enter to add)

## Usage

1. Click the **"I Just..."** button
2. Select an activity type
3. Fill in the form fields
4. Click **Save** to log the activity
5. View your activity feed on the home screen
6. Delete logs by clicking the trash icon

## Color Coding

- 💚 **Workout**: Green
- 💜 **Jiu-Jitsu**: Purple
- 💙 **Music**: Indigo
- 💗 **Social**: Pink
- 🧡 **Creative**: Orange

## Data Persistence

All logs are stored in your browser's LocalStorage. Data persists between sessions but is specific to your browser and device.

## Contributing

Feel free to fork this project and customize it for your own needs!

## License

MIT License - feel free to use this project however you'd like.
