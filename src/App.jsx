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
  
  // Extremely minimal test
  return (
    <div style={{ 
      padding: '20px', 
      background: 'red', 
      color: 'white', 
      fontSize: '24px',
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div>
        <h1>🚨 EMERGENCY TEST 🚨</h1>
        <p>RED BACKGROUND = React is working!</p>
        <p>If you see this, the issue is with CSS or components.</p>
        <p>If you see blank, React is broken.</p>
      </div>
    </div>
  )
  
  /*
  const [currentUser, setCurrentUser] = useState(null)
  const [participants, setParticipants] = useState([])
  const [tripTitle, setTripTitle] = useState('Trip Pixel App')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  useEffect(() => {
    console.log('App useEffect running...')
    // Load user from localStorage
    const savedUser = localStorage.getItem('tripUser')
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }

    // Load participants from localStorage
    const savedParticipants = localStorage.getItem('tripParticipants')
    if (savedParticipants) {
      setParticipants(JSON.parse(savedParticipants))
    }

    // Load trip title from localStorage
    const savedTitle = localStorage.getItem('tripTitle')
    if (savedTitle) {
      setTripTitle(savedTitle)
    }
  }, [])

  const handleLogin = (user) => {
    setCurrentUser(user)
    localStorage.setItem('tripUser', JSON.stringify(user))
    
    // Add user to participants if not already there
    if (!participants.find(p => p.name === user.name)) {
      const updatedParticipants = [...participants, user]
      setParticipants(updatedParticipants)
      localStorage.setItem('tripParticipants', JSON.stringify(updatedParticipants))
    } else {
      // Update existing user's avatar and admin status if they're logging in again
      const updatedParticipants = participants.map(p => 
        p.name === user.name ? { ...p, avatar: user.avatar, isAdmin: user.isAdmin } : p
      )
      setParticipants(updatedParticipants)
      localStorage.setItem('tripParticipants', JSON.stringify(updatedParticipants))
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('tripUser')
  }

  const removeUser = (userName) => {
    if (window.confirm(`Are you sure you want to remove ${userName} and all their data?`)) {
      const updatedParticipants = participants.filter(p => p.name !== userName)
      setParticipants(updatedParticipants)
      localStorage.setItem('tripParticipants', JSON.stringify(updatedParticipants))
      
      // Remove user's data from all components
      const keysToClean = [
        'tripAirbnbs', 'tripExpenses', 'tripFoodWishlist', 'tripActivities'
      ]
      
      keysToClean.forEach(key => {
        const data = localStorage.getItem(key)
        if (data) {
          const parsedData = JSON.parse(data)
          // Remove items created by this user
          const cleanedData = parsedData.filter(item => item.author !== userName)
          localStorage.setItem(key, JSON.stringify(cleanedData))
        }
      })
    }
  }

  const updateTripTitle = () => {
    if (newTitle.trim()) {
      setTripTitle(newTitle.trim())
      localStorage.setItem('tripTitle', newTitle.trim())
      setIsEditingTitle(false)
      setNewTitle('')
    }
  }

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
      // Clear all localStorage data
      const keysToClear = [
        'tripAirbnbs', 'tripExpenses', 'tripFoodWishlist', 'tripActivities',
        'tripParticipants', 'tripTitle', 'tripUser'
      ]
      keysToClear.forEach(key => localStorage.removeItem(key))
      
      // Reset state
      setParticipants([])
      setTripTitle('Trip Pixel App')
      setCurrentUser(null)
    }
  }

  const clearUserCache = () => {
    if (window.confirm('Clear cached user data? This will force all users to log in again with updated avatars.')) {
      // Clear user-related localStorage data
      localStorage.removeItem('tripUser')
      localStorage.removeItem('tripParticipants')
      
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
  */
}

export default App
