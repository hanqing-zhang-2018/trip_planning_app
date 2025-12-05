# Troubleshooting: "Loading..." Never Completes

If you see "Loading Properties/Food/..." but data never loads, follow these steps:

## Step 1: Check Browser Console

1. Open your browser's Developer Tools (F12 or Right-click → Inspect)
2. Go to the **Console** tab
3. Look for any red error messages

Common errors you might see:

### Error: "Firebase: Error (auth/configuration-not-found)"
**Solution:** Your `.env` file is missing or not loaded
- Make sure `.env` file exists in the project root
- Restart your dev server after creating/updating `.env`
- Check that all variables start with `VITE_`

### Error: "Missing or insufficient permissions"
**Solution:** Firestore security rules are blocking access
- Go to Firebase Console → Firestore Database → Rules
- Update rules to allow read/write (see FIREBASE_SETUP.md)

### Error: "Firebase App named '[DEFAULT]' already exists"
**Solution:** This is usually fine, but if it causes issues:
- Clear browser cache
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## Step 2: Verify Firebase Configuration

1. Check if `.env` file exists in project root
2. Verify all environment variables are set:
   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

3. **Restart your dev server** after creating/updating `.env`:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

## Step 3: Verify Firestore is Set Up

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database**
4. Make sure the database is **created** (not just initialized)
5. Check the **Rules** tab - should allow read/write

### Test Firestore Rules

Your rules should look like this (for development):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /trips/{tripGroup}/{document=**} {
      allow read, write: if true;
    }
  }
}
```

Click **Publish** after updating rules.

## Step 4: Check Network Tab

1. Open Developer Tools → **Network** tab
2. Filter by "firestore" or "googleapis"
3. Look for failed requests (red status codes)
4. Check the response for error messages

## Step 5: Test Firebase Connection

Add this to your browser console while the app is running:

```javascript
// Check if Firebase is initialized
console.log('Firebase config:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'set' : 'missing',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'set' : 'missing'
})
```

## Step 6: Verify Trip Group

Make sure you're logged in with a valid invite code:
- Check that `currentUser.tripGroup` is set
- Look in console for: `"App useEffect running..."` and `"Firebase initialized successfully"`

## Step 7: Check Firestore Data Structure

1. Go to Firebase Console → Firestore Database
2. Check if data structure matches:
   ```
   trips/
     {tripGroup}/
       participants/
       airbnbs/
       expenses/
       foodWishlist/
       activities/
   ```

## Common Issues & Solutions

### Issue: Environment variables not loading
**Solution:**
- Make sure `.env` is in project root (same level as `package.json`)
- Variable names must start with `VITE_`
- Restart dev server after changes

### Issue: Firestore rules blocking access
**Solution:**
- Update rules in Firebase Console
- Make sure rules are published
- Wait a few seconds for rules to propagate

### Issue: CORS errors
**Solution:**
- Check Firebase project settings
- Make sure your domain is authorized (if using custom domain)

### Issue: Still stuck on "Loading..."
**Solution:**
- Check browser console for specific error messages
- Verify Firebase project is active (not paused)
- Try in incognito/private browsing mode
- Clear browser cache and localStorage

## Quick Test

1. Open app in browser
2. Open Console (F12)
3. Look for:
   - ✅ "Firebase initialized successfully" 
   - ✅ "App useEffect running..."
   - ❌ Any red error messages

If you see errors, they will tell you exactly what's wrong!

## Still Not Working?

1. Check the exact error message in console
2. Verify `.env` file exists and has correct values
3. Verify Firestore database is created and rules are set
4. Try logging out and logging back in
5. Clear browser localStorage: `localStorage.clear()` in console

