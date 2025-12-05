// Debug utility to check Firebase configuration
export const checkFirebaseConfig = () => {
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  }

  console.log('=== Firebase Configuration Check ===')
  console.log('API Key:', config.apiKey ? '✅ Set' : '❌ Missing')
  console.log('Project ID:', config.projectId ? '✅ Set' : '❌ Missing')
  console.log('Auth Domain:', config.authDomain ? '✅ Set' : '❌ Missing')
  console.log('Storage Bucket:', config.storageBucket ? '✅ Set' : '❌ Missing')
  console.log('Messaging Sender ID:', config.messagingSenderId ? '✅ Set' : '❌ Missing')
  console.log('App ID:', config.appId ? '✅ Set' : '❌ Missing')
  
  const allSet = Object.values(config).every(val => val)
  if (!allSet) {
    console.error('❌ Some Firebase environment variables are missing!')
    console.error('Make sure your .env file exists and has all VITE_FIREBASE_* variables')
    console.error('Then restart your dev server: npm run dev')
  } else {
    console.log('✅ All Firebase config variables are set!')
  }
  
  return allSet
}

