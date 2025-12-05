// Firebase configuration
// Replace these values with your Firebase project config
// Get these from: https://console.firebase.google.com/ → Project Settings → General → Your apps

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Validate Firebase config
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('Firebase configuration is missing! Please check your .env file.')
  console.error('Current config:', {
    hasApiKey: !!firebaseConfig.apiKey,
    hasProjectId: !!firebaseConfig.projectId,
    envVars: {
      VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY ? 'set' : 'missing',
      VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'set' : 'missing'
    }
  })
}

// Initialize Firebase
let app
let db

try {
  app = initializeApp(firebaseConfig)
  db = getFirestore(app)
  console.log('Firebase initialized successfully')
} catch (error) {
  console.error('Error initializing Firebase:', error)
  throw error
}

export { db }
export default app

