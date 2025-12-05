// Firestore database service functions
// Provides real-time data synchronization across all users

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore'
import { db } from './config'

// Helper to get collection reference for a trip group
const getCollectionRef = (collectionName, tripGroup) => {
  return collection(db, `trips/${tripGroup}/${collectionName}`)
}

// Helper to get document reference
const getDocRef = (collectionName, tripGroup, docId) => {
  return doc(db, `trips/${tripGroup}/${collectionName}`, docId)
}

// ==================== PARTICIPANTS ====================
export const participantsService = {
  // Get all participants for a trip group (real-time)
  subscribe: (tripGroup, callback, onError) => {
    try {
      const participantsRef = getCollectionRef('participants', tripGroup)
      return onSnapshot(
        participantsRef, 
        (snapshot) => {
          const participants = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          callback(participants)
        },
        (error) => {
          console.error('Firestore error in participants:', error)
          if (onError) onError(error)
        }
      )
    } catch (error) {
      console.error('Error setting up participants listener:', error)
      if (onError) onError(error)
      return () => {} // Return empty unsubscribe function
    }
  },

  // Add a participant
  add: async (tripGroup, participant) => {
    const participantsRef = getCollectionRef('participants', tripGroup)
    const docRef = await addDoc(participantsRef, {
      ...participant,
      createdAt: serverTimestamp()
    })
    return docRef.id
  },

  // Update a participant
  update: async (tripGroup, participantId, updates) => {
    const docRef = getDocRef('participants', tripGroup, participantId)
    await updateDoc(docRef, updates)
  },

  // Delete a participant
  delete: async (tripGroup, participantId) => {
    const docRef = getDocRef('participants', tripGroup, participantId)
    await deleteDoc(docRef)
  }
}

// ==================== TRIP TITLE ====================
export const tripTitleService = {
  // Get trip title (real-time)
  subscribe: (tripGroup, callback, onError) => {
    try {
      const tripRef = doc(db, `trips/${tripGroup}`)
      return onSnapshot(
        tripRef, 
        (snapshot) => {
          const data = snapshot.data()
          callback(data?.title || 'Trip Planning')
        },
        (error) => {
          console.error('Firestore error in trip title:', error)
          if (onError) onError(error)
        }
      )
    } catch (error) {
      console.error('Error setting up trip title listener:', error)
      if (onError) onError(error)
      return () => {} // Return empty unsubscribe function
    }
  },

  // Update trip title (creates document if it doesn't exist)
  update: async (tripGroup, title) => {
    const tripRef = doc(db, `trips/${tripGroup}`)
    const tripDoc = await getDoc(tripRef)
    
    if (tripDoc.exists()) {
      await updateDoc(tripRef, {
        title,
        updatedAt: serverTimestamp()
      })
    } else {
      await setDoc(tripRef, {
        title,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    }
  }
}

// ==================== AIRBNBS ====================
export const airbnbsService = {
  // Get all airbnbs for a trip group (real-time)
  subscribe: (tripGroup, callback, onError) => {
    try {
      const airbnbsRef = getCollectionRef('airbnbs', tripGroup)
      return onSnapshot(
        airbnbsRef, 
        (snapshot) => {
          const airbnbs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          callback(airbnbs)
        },
        (error) => {
          console.error('Firestore error in airbnbs:', error)
          if (onError) onError(error)
        }
      )
    } catch (error) {
      console.error('Error setting up airbnbs listener:', error)
      if (onError) onError(error)
      return () => {} // Return empty unsubscribe function
    }
  },

  // Add an airbnb
  add: async (tripGroup, airbnb) => {
    const airbnbsRef = getCollectionRef('airbnbs', tripGroup)
    const docRef = await addDoc(airbnbsRef, {
      ...airbnb,
      createdAt: serverTimestamp()
    })
    return docRef.id
  },

  // Update an airbnb
  update: async (tripGroup, airbnbId, updates) => {
    const docRef = getDocRef('airbnbs', tripGroup, airbnbId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
  },

  // Delete an airbnb
  delete: async (tripGroup, airbnbId) => {
    const docRef = getDocRef('airbnbs', tripGroup, airbnbId)
    await deleteDoc(docRef)
  }
}

// ==================== EXPENSES ====================
export const expensesService = {
  // Get all expenses for a trip group (real-time)
  subscribe: (tripGroup, callback, onError) => {
    try {
      const expensesRef = getCollectionRef('expenses', tripGroup)
      return onSnapshot(
        expensesRef, 
        (snapshot) => {
          const expenses = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          callback(expenses)
        },
        (error) => {
          console.error('Firestore error in expenses:', error)
          if (onError) onError(error)
        }
      )
    } catch (error) {
      console.error('Error setting up expenses listener:', error)
      if (onError) onError(error)
      return () => {} // Return empty unsubscribe function
    }
  },

  // Add an expense
  add: async (tripGroup, expense) => {
    const expensesRef = getCollectionRef('expenses', tripGroup)
    const docRef = await addDoc(expensesRef, {
      ...expense,
      createdAt: serverTimestamp()
    })
    return docRef.id
  },

  // Update an expense
  update: async (tripGroup, expenseId, updates) => {
    const docRef = getDocRef('expenses', tripGroup, expenseId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
  },

  // Delete an expense
  delete: async (tripGroup, expenseId) => {
    const docRef = getDocRef('expenses', tripGroup, expenseId)
    await deleteDoc(docRef)
  }
}

// ==================== FOOD WISHLIST ====================
export const foodWishlistService = {
  // Get all food items for a trip group (real-time)
  subscribe: (tripGroup, callback, onError) => {
    try {
      const foodRef = getCollectionRef('foodWishlist', tripGroup)
      return onSnapshot(
        foodRef, 
        (snapshot) => {
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          callback(items)
        },
        (error) => {
          console.error('Firestore error in food wishlist:', error)
          if (onError) onError(error)
        }
      )
    } catch (error) {
      console.error('Error setting up food wishlist listener:', error)
      if (onError) onError(error)
      return () => {} // Return empty unsubscribe function
    }
  },

  // Add a food item
  add: async (tripGroup, item) => {
    const foodRef = getCollectionRef('foodWishlist', tripGroup)
    const docRef = await addDoc(foodRef, {
      ...item,
      createdAt: serverTimestamp()
    })
    return docRef.id
  },

  // Update a food item
  update: async (tripGroup, itemId, updates) => {
    const docRef = getDocRef('foodWishlist', tripGroup, itemId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
  },

  // Delete a food item
  delete: async (tripGroup, itemId) => {
    const docRef = getDocRef('foodWishlist', tripGroup, itemId)
    await deleteDoc(docRef)
  }
}

// ==================== ACTIVITIES ====================
export const activitiesService = {
  // Get all activities for a trip group (real-time)
  subscribe: (tripGroup, callback, onError) => {
    try {
      const activitiesRef = getCollectionRef('activities', tripGroup)
      return onSnapshot(
        activitiesRef, 
        (snapshot) => {
          const activities = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          callback(activities)
        },
        (error) => {
          console.error('Firestore error in activities:', error)
          if (onError) onError(error)
        }
      )
    } catch (error) {
      console.error('Error setting up activities listener:', error)
      if (onError) onError(error)
      return () => {} // Return empty unsubscribe function
    }
  },

  // Add an activity
  add: async (tripGroup, activity) => {
    const activitiesRef = getCollectionRef('activities', tripGroup)
    const docRef = await addDoc(activitiesRef, {
      ...activity,
      createdAt: serverTimestamp()
    })
    return docRef.id
  },

  // Update an activity
  update: async (tripGroup, activityId, updates) => {
    const docRef = getDocRef('activities', tripGroup, activityId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
  },

  // Delete an activity
  delete: async (tripGroup, activityId) => {
    const docRef = getDocRef('activities', tripGroup, activityId)
    await deleteDoc(docRef)
  }
}

// ==================== TRUTH OR DARE ====================
export const truthOrDareService = {
  // Get custom questions (real-time)
  subscribe: (tripGroup, type, callback, onError) => {
    try {
      const questionsRef = getCollectionRef(`truthOrDare_${type}`, tripGroup)
      return onSnapshot(
        questionsRef, 
        (snapshot) => {
          const questions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          callback(questions)
        },
        (error) => {
          console.error(`Firestore error in truthOrDare ${type}:`, error)
          if (onError) onError(error)
        }
      )
    } catch (error) {
      console.error(`Error setting up truthOrDare ${type} listener:`, error)
      if (onError) onError(error)
      return () => {} // Return empty unsubscribe function
    }
  },

  // Add a custom question
  add: async (tripGroup, type, question) => {
    const questionsRef = getCollectionRef(`truthOrDare_${type}`, tripGroup)
    const docRef = await addDoc(questionsRef, {
      ...question,
      createdAt: serverTimestamp()
    })
    return docRef.id
  },

  // Delete a custom question
  delete: async (tripGroup, type, questionId) => {
    const docRef = getDocRef(`truthOrDare_${type}`, tripGroup, questionId)
    await deleteDoc(docRef)
  }
}

