import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Navigation from './components/Navigation'
import AirbnbVoting from './components/AirbnbVoting'
import ExpenseTracker from './components/ExpenseTracker'
import TruthOrDare from './components/TruthOrDare'
import FoodWishlist from './components/FoodWishlist'
import ActivitiesWishlist from './components/ActivitiesWishlist'
import { participantsService, tripTitleService } from './firebase/db'
import './App.css'

function App() {
  console.log('App component is loading...')
  
  const [currentUser, setCurrentUser] = useState(null)
  const [participants, setParticipants] = useState([])
  const [tripTitle, setTripTitle] = useState('Trip Planning')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  // Load user from localStorage on mount
  useEffect(() => {
    console.log('App useEffect running...')
    const savedUser = localStorage.getItem('tripUser')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      setCurrentUser(user)
    }
  }, [])

  // Real-time listeners for participants and trip title
  useEffect(() => {
    if (!currentUser?.tripGroup) return

    const tripGroup = currentUser.tripGroup

    try {
      // Subscribe to participants
      const unsubscribeParticipants = participantsService.subscribe(
        tripGroup, 
        (updatedParticipants) => {
          setParticipants(updatedParticipants || [])
        },
        (error) => {
          console.error('Error loading participants:', error)
        }
      )

      // Subscribe to trip title
      const unsubscribeTitle = tripTitleService.subscribe(
        tripGroup, 
        (title) => {
          setTripTitle(title || 'Trip Planning')
        },
        (error) => {
          console.error('Error loading trip title:', error)
        }
      )

      return () => {
        unsubscribeParticipants()
        unsubscribeTitle()
      }
    } catch (error) {
      console.error('Error setting up App listeners:', error)
    }
  }, [currentUser?.tripGroup])

  const handleLogin = async (user) => {
    // Add trip group to user data if it exists
    const userWithTripGroup = {
      ...user,
      tripGroup: user.tripGroup || 'default'
    }
    
    setCurrentUser(userWithTripGroup)
    localStorage.setItem('tripUser', JSON.stringify(userWithTripGroup))
    
    const tripGroup = userWithTripGroup.tripGroup

    // Initialize trip title if it doesn't exist
    try {
      // Check if trip document exists, if not create it with default title
      const defaultTitle = tripGroup === 'Hawaii Xmas 2025' ? 'Hawaii Xmas 2025' : 'Trip Planning'
      await tripTitleService.update(tripGroup, defaultTitle)
    } catch (error) {
      console.error('Error initializing trip title:', error)
    }
    
    // Add user to participants if not already there
    try {
      // Find by original user ID (stored in document data as 'userId', not Firestore doc ID)
      // Also check the 'id' field in case it's the original user ID (for backward compatibility)
      const existingParticipant = participants.find(p => 
        (p.userId && p.userId === user.id) || 
        (p.id === user.id && !p.userId) // Backward compatibility: if no userId field, check id
      )
      
      if (!existingParticipant) {
        // Store original user ID in the document for reference
        const participantData = {
          ...userWithTripGroup,
          userId: user.id, // Store original ID for matching
          // Keep the original id field for backward compatibility
          originalId: user.id
        }
        const docId = await participantsService.add(tripGroup, participantData)
        console.log('New participant added:', user.name, 'with Firestore ID:', docId)
      } else {
        // Update existing user's avatar and admin status using Firestore doc ID
        console.log('Updating existing participant:', existingParticipant.name, 'Firestore ID:', existingParticipant.id)
        await participantsService.update(tripGroup, existingParticipant.id, {
          avatar: user.avatar,
          isAdmin: user.isAdmin,
          name: user.name,
          userId: user.id, // Keep original ID reference
          tripGroup: tripGroup // Ensure trip group is set
        })
      }
    } catch (error) {
      console.error('Error adding/updating participant:', error)
      alert(`Failed to add/update participant: ${error.message}`)
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('tripUser')
  }


  const removeUser = async (userId) => {
    // Check if current user is admin
    if (!currentUser.isAdmin) {
      alert('Only admins can remove users.')
      return
    }
    
    // userId is the Firestore document ID passed from Navigation component
    const userToRemove = participants.find(p => p.id === userId)
    if (!userToRemove) {
      console.error('User not found:', userId)
      console.error('Available participants:', participants.map(p => ({ 
        firestoreId: p.id, 
        userId: p.userId, 
        name: p.name,
        isAdmin: p.isAdmin 
      })))
      alert('User not found.')
      return
    }
    
    // Prevent admin from removing themselves
    // Find current user's Firestore document ID by matching original userId
    const currentUserFirestoreDoc = participants.find(p => {
      const participantUserId = p.userId || (p.id && !p.userId ? p.id : null)
      return participantUserId === currentUser.id
    })
    
    if (userToRemove.id === currentUserFirestoreDoc?.id) {
      alert('You cannot remove yourself.')
      return
    }
    
    if (window.confirm(`Are you sure you want to remove ${userToRemove.name} and all their data?`)) {
      try {
        // Use Firestore document ID for deletion
        await participantsService.delete(currentUser.tripGroup, userToRemove.id)
        console.log('✅ User removed successfully:', userToRemove.name)
      } catch (error) {
        console.error('❌ Error removing user:', error)
        alert(`Failed to remove user: ${error.message}`)
      }
    }
  }

  const updateTripTitle = async () => {
    if (newTitle.trim()) {
      try {
        await tripTitleService.update(currentUser.tripGroup, newTitle.trim())
        setIsEditingTitle(false)
        setNewTitle('')
      } catch (error) {
        console.error('Error updating trip title:', error)
        alert('Failed to update trip title. Please try again.')
      }
    }
  }

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear ALL data for this trip group? This cannot be undone! This will delete all data from Firebase.')) {
      // Note: This would require deleting all subcollections in Firestore
      // For now, we'll just clear local state and logout
      // Full data deletion would need to be implemented server-side or via Firebase Admin SDK
      alert('Full data deletion requires Firebase Admin SDK. For now, data remains in Firebase.')
      setCurrentUser(null)
      localStorage.removeItem('tripUser')
    }
  }

  const clearUserCache = () => {
    if (window.confirm('Clear cached user data? This will force you to log in again.')) {
      setCurrentUser(null)
      localStorage.removeItem('tripUser')
    }
  }

  if (!currentUser) {
    console.log('Rendering LandingPage...')
    return <LandingPage onLogin={handleLogin} participants={participants} />
  }

  console.log('Rendering main app with user:', currentUser)
  return (
    <Router>
      <div className="app">
        <Navigation 
          currentUser={currentUser} 
          onLogout={handleLogout} 
          tripTitle={tripTitle}
          isAdmin={currentUser.isAdmin}
          isEditingTitle={isEditingTitle}
          setIsEditingTitle={setIsEditingTitle}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          updateTripTitle={updateTripTitle}
          participants={participants}
          removeUser={removeUser}
          clearAllData={clearAllData}
          clearUserCache={clearUserCache}
        />
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/airbnb" replace />} />
            <Route path="/airbnb" element={<AirbnbVoting participants={participants} currentUser={currentUser} />} />
            <Route path="/expenses" element={<ExpenseTracker participants={participants} currentUser={currentUser} />} />
            <Route path="/truth-dare" element={<TruthOrDare currentUser={currentUser} />} />
            <Route path="/food" element={<FoodWishlist participants={participants} currentUser={currentUser} />} />
            <Route path="/activities" element={<ActivitiesWishlist participants={participants} currentUser={currentUser} />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
