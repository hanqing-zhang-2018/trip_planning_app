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
      const existingParticipant = participants.find(p => p.id === user.id && p.tripGroup === tripGroup)
      if (!existingParticipant) {
        await participantsService.add(tripGroup, userWithTripGroup)
      } else {
        // Update existing user's avatar and admin status
        await participantsService.update(tripGroup, user.id, {
          avatar: user.avatar,
          isAdmin: user.isAdmin,
          name: user.name
        })
      }
    } catch (error) {
      console.error('Error adding/updating participant:', error)
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('tripUser')
  }


  const removeUser = async (userId) => {
    const userToRemove = participants.find(p => p.id === userId)
    if (!userToRemove) return
    
    if (window.confirm(`Are you sure you want to remove ${userToRemove.name} and all their data?`)) {
      try {
        await participantsService.delete(currentUser.tripGroup, userId)
        // Note: User's data in other collections will remain but can be cleaned up by admin if needed
      } catch (error) {
        console.error('Error removing user:', error)
        alert('Failed to remove user. Please try again.')
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
