import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Navigation from './components/Navigation'
import AirbnbVoting from './components/AirbnbVoting'
import ExpenseTracker from './components/ExpenseTracker'
import TruthOrDare from './components/TruthOrDare'
import FoodWishlist from './components/FoodWishlist'
import ActivitiesWishlist from './components/ActivitiesWishlist'
import './App.css'

function App() {
  console.log('App component is loading...')
  
  const [currentUser, setCurrentUser] = useState(null)
  const [participants, setParticipants] = useState([])
  const [tripTitle, setTripTitle] = useState('Trip Planning')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  useEffect(() => {
    console.log('App useEffect running...')
    // Load user from localStorage
    const savedUser = localStorage.getItem('tripUser')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      setCurrentUser(user)
      
      // Load trip-group specific data
      const tripGroup = user.tripGroup || 'default'
      
      // Load participants from localStorage for this trip group
      const savedParticipants = localStorage.getItem(`tripParticipants_${tripGroup}`)
      if (savedParticipants) {
        setParticipants(JSON.parse(savedParticipants))
      }

      // Load trip title from localStorage for this trip group
      const savedTitle = localStorage.getItem(`tripTitle_${tripGroup}`)
      if (savedTitle) {
        setTripTitle(savedTitle)
      } else {
        // Set default trip title based on trip group
        if (tripGroup === 'Trip 1') {
          setTripTitle('July 18-20 Trip')
        } else if (tripGroup === 'Trip 2') {
          setTripTitle('July 4th Trip')
        }
      }
    } else {
      // Load participants from localStorage (legacy support)
      const savedParticipants = localStorage.getItem('tripParticipants')
      if (savedParticipants) {
        setParticipants(JSON.parse(savedParticipants))
      }

      // Load trip title from localStorage (legacy support)
      const savedTitle = localStorage.getItem('tripTitle')
      if (savedTitle) {
        setTripTitle(savedTitle)
      }
    }
  }, [])

  const handleLogin = (user) => {
    // Add trip group to user data if it exists
    const userWithTripGroup = {
      ...user,
      tripGroup: user.tripGroup || 'default'
    }
    
    setCurrentUser(userWithTripGroup)
    localStorage.setItem('tripUser', JSON.stringify(userWithTripGroup))
    
    // Set the correct trip title based on trip group
    const tripGroup = userWithTripGroup.tripGroup
    const savedTitle = localStorage.getItem(`tripTitle_${tripGroup}`)
    if (savedTitle) {
      setTripTitle(savedTitle)
    } else {
      // Set default trip title based on trip group
      if (tripGroup === 'Trip 1') {
        setTripTitle('July 18-20 Trip')
        localStorage.setItem(`tripTitle_${tripGroup}`, 'July 18-20 Trip')
      } else if (tripGroup === 'Trip 2') {
        setTripTitle('July 4th Trip')
        localStorage.setItem(`tripTitle_${tripGroup}`, 'July 4th Trip')
      }
    }
    
    // Add user to participants if not already there
    if (!participants.find(p => p.name === user.name && p.tripGroup === userWithTripGroup.tripGroup)) {
      const updatedParticipants = [...participants, userWithTripGroup]
      setParticipants(updatedParticipants)
      localStorage.setItem(`tripParticipants_${userWithTripGroup.tripGroup}`, JSON.stringify(updatedParticipants))
    } else {
      // Update existing user's avatar and admin status if they're logging in again
      const updatedParticipants = participants.map(p => 
        p.name === user.name && p.tripGroup === userWithTripGroup.tripGroup 
          ? { ...p, avatar: user.avatar, isAdmin: user.isAdmin } 
          : p
      )
      setParticipants(updatedParticipants)
      localStorage.setItem(`tripParticipants_${userWithTripGroup.tripGroup}`, JSON.stringify(updatedParticipants))
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('tripUser')
  }

  const getTripGroupKey = (baseKey) => {
    const tripGroup = currentUser?.tripGroup || 'default'
    return `${baseKey}_${tripGroup}`
  }

  const removeUser = (userName) => {
    if (window.confirm(`Are you sure you want to remove ${userName} and all their data?`)) {
      const updatedParticipants = participants.filter(p => p.name !== userName)
      setParticipants(updatedParticipants)
      localStorage.setItem(`tripParticipants_${currentUser.tripGroup}`, JSON.stringify(updatedParticipants))
      
      // Remove user's data from all components
      const keysToClean = [
        'tripAirbnbs', 'tripExpenses', 'tripFoodWishlist', 'tripActivities'
      ]
      
      keysToClean.forEach(key => {
        const data = localStorage.getItem(getTripGroupKey(key))
        if (data) {
          const parsedData = JSON.parse(data)
          // Remove items created by this user
          const cleanedData = parsedData.filter(item => item.author !== userName)
          localStorage.setItem(getTripGroupKey(key), JSON.stringify(cleanedData))
        }
      })
    }
  }

  const updateTripTitle = () => {
    if (newTitle.trim()) {
      setTripTitle(newTitle.trim())
      localStorage.setItem(getTripGroupKey('tripTitle'), newTitle.trim())
      setIsEditingTitle(false)
      setNewTitle('')
    }
  }

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear ALL data for this trip group? This cannot be undone!')) {
      // Clear all localStorage data for this trip group
      const keysToClear = [
        'tripAirbnbs', 'tripExpenses', 'tripFoodWishlist', 'tripActivities',
        'tripParticipants', 'tripTitle', 'tripUser'
      ]
      keysToClear.forEach(key => localStorage.removeItem(getTripGroupKey(key)))
      
      // Reset state
      setParticipants([])
      setTripTitle('Trip Planning')
      setCurrentUser(null)
    }
  }

  const clearUserCache = () => {
    if (window.confirm('Clear cached user data for this trip group? This will force all users to log in again with updated avatars.')) {
      // Clear user-related localStorage data for this trip group
      localStorage.removeItem(getTripGroupKey('tripUser'))
      localStorage.removeItem(getTripGroupKey('tripParticipants'))
      
      // Reset user state
      setCurrentUser(null)
      setParticipants([])
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
            <Route path="/truth-dare" element={<TruthOrDare />} />
            <Route path="/food" element={<FoodWishlist participants={participants} currentUser={currentUser} />} />
            <Route path="/activities" element={<ActivitiesWishlist participants={participants} currentUser={currentUser} />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
