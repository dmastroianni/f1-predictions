# IMPORTANT
I am creating this project to experiment with things that are new for me or that I haven't done in a while. Even though the visibility of the project is public, shall you decide to use it, please do so at your own risk. 

# F1 Predictions App

For over 20 years I have been playing a prediction game of F1 competitive sessions (quali and races, and more recently sprint qualis and sprint races) with a friend back in Brazil using a shared spreadsheet.

This web app digitizes that experience with a modern, easy-to-use interface built on Firebase.

## Features

- 🔐 **User Authentication** - Email/password or Google sign-in
- 📝 **Prediction Submission** - Submit predictions for races, qualifying, sprint races, and sprint qualifying
- 🏁 **Results Entry** - Manual entry or paste results (API fetch coming soon)
- 🏆 **Scoring Dashboard** - Automatic scoring (1 point per correct position match)
- 📊 **Leaderboard** - Track points across all sessions

## Tech Stack

- **Frontend**: React + Vite
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Hosting**: Firebase Hosting
- **All on Firebase Free Tier** ✨

## Quick Start (Local POC)

Want to try it out without any setup? **Just open `poc.html` in your browser!**

- ✅ No Firebase setup required
- ✅ No npm/node installation needed
- ✅ Works completely offline
- ✅ Data stored in browser localStorage
- ✅ Perfect for quick demos

See [LOCAL_DEV.md](LOCAL_DEV.md) for more local development options.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google (optional but recommended)
3. Create Firestore Database:
   - Go to Firestore Database
   - Create database in test mode (we'll deploy rules later)
4. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll down to "Your apps" and click the web icon (</>)
   - Copy the config object

### 3. Configure Firebase

1. Copy `.firebaserc.example` to `.firebaserc`:
   ```bash
   cp .firebaserc.example .firebaserc
   ```
   Edit `.firebaserc` and replace `YOUR_PROJECT_ID` with your Firebase project ID.

2. Update `src/firebase/config.js` with your Firebase config:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     // ... etc
   };
   ```

### 4. Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 6. Deploy to Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

Or use the npm script:
```bash
npm run deploy
```

## Usage

1. **Sign Up/Login**: Create an account or sign in with Google
2. **Create a Race**: Go to Predictions page and click "+ New Race"
3. **Submit Predictions**: Select a race, session type, and predict positions P1-P20
4. **Enter Results**: After the session, go to Results page and enter actual finishing positions
5. **View Dashboard**: Check the leaderboard to see scores and rankings

## Scoring System

- **1 point** per correct position match
- Example: If you predict VER in P1 and VER finishes P1, you get 1 point
- Points are calculated automatically when results are entered

## Driver Codes

The app uses standard F1 driver abbreviations:
- VER (Verstappen), PER (Pérez), LEC (Leclerc), SAI (Sainz)
- HAM (Hamilton), RUS (Russell), NOR (Norris), PIA (Piastri)
- ALO (Alonso), STR (Stroll), OCO (Ocon), GAS (Gasly)
- BOT (Bottas), ZHO (Zhou), ALB (Albon), SAR (Sargeant)
- MAG (Magnussen), HUL (Hülkenberg), TSU (Tsunoda), RIC (Ricciardo)

Update the driver list in `src/components/Predictions.jsx` and `src/components/Results.jsx` as needed for each season.

## Project Structure

```
├── src/
│   ├── components/       # React components
│   │   ├── Dashboard.jsx    # Leaderboard view
│   │   ├── Login.jsx        # Authentication
│   │   ├── Navbar.jsx       # Navigation
│   │   ├── Predictions.jsx  # Prediction submission
│   │   └── Results.jsx       # Results entry
│   ├── firebase/
│   │   └── config.js        # Firebase configuration
│   ├── utils/
│   │   └── scoring.js       # Scoring logic
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── firestore.rules          # Firestore security rules
├── firebase.json            # Firebase configuration
└── package.json             # Dependencies
```

## Future Enhancements

- [ ] Auto-fetch results from Ergast F1 API
- [ ] Email notifications for race reminders
- [ ] Historical race data visualization
- [ ] Admin panel for race management
- [ ] Mobile app (React Native)

## License

MIT