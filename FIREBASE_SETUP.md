# Firebase Setup Guide

This app now uses **Firebase Firestore** for real-time data synchronization across all users. When User A adds a food item on their phone, User B will see it instantly!

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "Trip Pixel App")
4. Disable Google Analytics (optional, you can enable it later)
5. Click **"Create project"**

## Step 2: Register Your Web App

1. In your Firebase project, click the **Web icon** (`</>`)
2. Register your app with a nickname (e.g., "Trip Pixel Web")
3. **Copy the Firebase configuration object** - you'll need these values:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQLtYDXsr9sF3ZjYbTZo1-503ALqR78Ro",
  authDomain: "trip-pixel-app.firebaseapp.com",
  projectId: "trip-pixel-app",
  storageBucket: "trip-pixel-app.firebasestorage.app",
  messagingSenderId: "449991817034",
  appId: "1:449991817034:web:7d8b6bb3e9dfde3b1073b3",
  measurementId: "G-RLRVPBTRDE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
## Step 3: Set Up Firestore Database

1. In Firebase Console, go to **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location (choose the closest to your users)
5. Click **"Enable"**

### Important: Set Up Security Rules

After creating the database, go to the **"Rules"** tab and update the rules to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to trips collection
    match /trips/{tripGroup}/{document=**} {
      allow read, write: if true; // For development - restrict in production!
    }
  }
}
```

**⚠️ Note:** The above rules allow anyone to read/write. For production, you should add authentication and proper security rules.

## Step 4: Configure Environment Variables

1. Create a `.env` file in the root of your project (same level as `package.json`)
2. Add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Replace the values with your actual Firebase config values.

## Step 5: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open the app and log in with an invite code
3. Add some data (e.g., a food item)
4. Open the app in another browser/device with the same invite code
5. You should see the data appear in real-time! 🎉

## How It Works

- **Real-time synchronization**: All data is stored in Firestore and synced in real-time
- **Trip group isolation**: Each trip group has its own data collection
- **Automatic updates**: When one user adds/updates/deletes data, all other users see it instantly
- **No page refresh needed**: Changes appear automatically thanks to Firestore's `onSnapshot` listeners

## Firebase Free Tier Limits

The Firebase free tier (Spark plan) includes:
- 1 GB storage
- 10 GB/month network egress
- 50K reads/day
- 20K writes/day
- 20K deletes/day

This should be sufficient for small to medium-sized trips. Monitor usage in the Firebase Console.

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Make sure your `.env` file exists and has all required variables
- Restart your dev server after creating/updating `.env`
- Check that variable names start with `VITE_`

### Data not syncing
- Check browser console for errors
- Verify Firestore security rules allow read/write
- Check Firebase Console → Firestore Database to see if data is being saved

### "Permission denied" errors
- Update Firestore security rules (see Step 3)
- Make sure rules allow read/write access

## Next Steps

1. Set up proper authentication (Firebase Auth) for better security
2. Update Firestore security rules to restrict access based on trip groups
3. Add error handling and offline support
4. Monitor usage in Firebase Console

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Console](https://console.firebase.google.com/)

