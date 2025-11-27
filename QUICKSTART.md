# Quick Start Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Firebase Setup (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" → Name it (e.g., "f1-predictions")
3. **Enable Authentication:**
   - Click "Authentication" → "Get started"
   - Enable "Email/Password"
   - Enable "Google" (optional)
4. **Create Firestore Database:**
   - Click "Firestore Database" → "Create database"
   - Start in "test mode" (we'll deploy rules)
   - Choose a location
5. **Get your config:**
   - Click the gear icon → "Project settings"
   - Scroll to "Your apps" → Click web icon `</>`
   - Register app → Copy the `firebaseConfig` object

## 3. Configure the App

1. **Update Firebase config:**
   ```bash
   # Edit src/firebase/config.js
   # Paste your firebaseConfig object
   ```

2. **Create .firebaserc:**
   ```bash
   cp .firebaserc.example .firebaserc
   # Edit .firebaserc and replace YOUR_PROJECT_ID with your Firebase project ID
   ```

3. **Deploy Firestore rules:**
   ```bash
   firebase deploy --only firestore:rules
   ```

## 4. Run the App

```bash
npm run dev
```

Open http://localhost:5173

## 5. First Steps

1. **Sign up** with your email or Google
2. Go to **Predictions** page
3. Click **"+ New Race"** → Create your first race (e.g., "Bahrain GP", date: "2024-03-02")
4. Select the race and submit a prediction
5. Go to **Results** page → Enter the actual results
6. Check **Dashboard** to see your score!

## Deploy to Production

```bash
npm run build
firebase deploy --only hosting
```

Your app will be live at: `https://YOUR_PROJECT_ID.web.app`

## Troubleshooting

**"Firebase: Error (auth/unauthorized-domain)"**
- Go to Firebase Console → Authentication → Settings → Authorized domains
- Add your domain

**"Permission denied" errors**
- Make sure you deployed Firestore rules: `firebase deploy --only firestore:rules`

**Can't see predictions/results**
- Make sure you're logged in
- Check browser console for errors
- Verify Firestore rules are deployed correctly

## Need Help?

Check the main README.md for detailed documentation.
