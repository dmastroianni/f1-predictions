# Local Development Guide

This guide explains how to run the F1 Predictions app locally for development and testing.

## Option 1: Standalone HTML POC (No Dependencies)

The easiest way to see the app in action without any setup is to use the standalone HTML file:

1. **Open `poc.html` in your browser**
   - Simply double-click the file, or
   - Right-click → "Open with" → Your browser
   - Or drag and drop it into a browser window

2. **Features:**
   - ✅ Works completely offline
   - ✅ No Firebase setup required
   - ✅ No npm/node installation needed
   - ✅ Data stored in browser localStorage
   - ✅ All features demonstrated (login, predictions, results, dashboard)

3. **Demo Mode:**
   - Any email/password combination works for login
   - Data persists in your browser's localStorage
   - Perfect for quick demos and testing

## Option 2: Vite Development Server (Full React App)

To run the full React application locally with hot-reload:

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Firebase (Optional for local dev):**
   - If you want to test with Firebase, update `src/firebase/config.js` with your Firebase credentials
   - If you just want to see the UI, you can skip this step (the app will show errors but you can still navigate)

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - The app will be available at `http://localhost:5173`
   - Vite will automatically reload when you make changes

### Development Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run deploy` - Build and deploy to Firebase Hosting

## Option 3: Production Build Preview

To test the production build locally:

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Preview the build:**
   ```bash
   npm run preview
   ```

3. **Open your browser:**
   - The app will be available at `http://localhost:4173` (or the port shown in terminal)

## Comparison

| Feature | Standalone POC | Vite Dev Server | Production Build |
|---------|---------------|-----------------|------------------|
| Setup Time | Instant | ~2 minutes | ~2 minutes |
| Dependencies | None | Node.js + npm | Node.js + npm |
| Firebase Required | No | Optional | Optional |
| Hot Reload | No | Yes | No |
| File Size | Single HTML | Multiple files | Optimized bundle |
| Best For | Quick demos | Development | Testing production |

## Troubleshooting

### Vite Dev Server Issues

- **Port already in use:** Change the port in `vite.config.js` or use `npm run dev -- --port 3000`
- **Firebase errors:** The app will still work for UI testing, but you'll need Firebase configured for full functionality
- **Module not found:** Run `npm install` again

### Standalone POC Issues

- **Data not persisting:** Check that localStorage is enabled in your browser
- **Styles not loading:** Make sure you're opening the file directly (not through a file:// protocol issue)
- **JavaScript errors:** Check browser console for details

## Next Steps

- For production deployment, see the main [README.md](README.md)
- To set up Firebase, follow the Firebase setup instructions in the README
- To customize the app, edit the React components in `src/components/`

