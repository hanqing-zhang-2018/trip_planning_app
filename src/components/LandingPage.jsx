import { useState } from 'react'

const avatars = [
  '😀', '😎', '🤖', '🐱', '🐶', '🦄', '🍕', '🎮', '🌈', '⭐', '🌙', '☀️',
  '🐵', '🦁', '🐯', '🐸', '🐼', '🐨', '🐰', '🦊', '🐻', '🐷', '🐮', '🐔',
  '🐧', '🐦', '🦉', '🦜', '🦢', '🦩', '🐢', '🐍', '🦖', '🦕',
  '🐙', '🦑', '🦀', '🦞', '🦐', '🦦', '🦥', '🦔', '🦦',
  '🦓', '🦒', '🦘', '🦥', '🦨', '🦡', '🦦', '🦧',
  '🐲', '👽', '👾', '🤡', '🎩', '👑', '🧙‍♂️', '🧚‍♀️', '🧞‍♂️', '🧜‍♀️',
  '🍉', '🍦', '🍩', '🍔', '🍟', '🍣', '🍤', '🍿', '🍭', '🍬', '🍫',
  '⚽', '🏀', '🏈', '⚾', '🎲', '🎸', '🎤', '🎧', '🎨', '🎬',
]

// You can change these invite codes to whatever you want
const INVITE_CODES = {
  'HANQINGNB2025': { tripGroup: 'Trip 1', description: 'July 18-20 Trip' },
  'JULY4TH2025': { tripGroup: 'Trip 2', description: 'July 4th Trip' }
}

// Admin codes linked to specific admin identities and trip groups
const ADMIN_CODES = {
  'JULY18ADM': { 
    id: 'admin_trip1',
    name: 'Emily', 
    avatar: '🐶', 
    isAdmin: true, 
    tripGroup: 'Trip 1',
    description: 'July 18-20 Trip'
  },
  'JULY4ADM': { 
    id: 'admin_trip2',
    name: 'Emily', 
    avatar: '🐶', 
    isAdmin: true, 
    tripGroup: 'Trip 2',
    description: 'July 4th Trip'
  }
//   'MONA2025': { name: 'Mona', avatar: '🌸', isAdmin: true },
  // Add more admin codes as needed
  // 'CODE2025': { id: 'unique_id', name: 'AdminName', avatar: '🎯', isAdmin: true, tripGroup: 'Trip X', description: 'Trip Description' },
}

function LandingPage({ onLogin, participants }) {
  const [name, setName] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState('')
  const [isNewUser, setIsNewUser] = useState(true)
  const [inviteCode, setInviteCode] = useState('')
  const [showInviteForm, setShowInviteForm] = useState(true)
  const [inviteError, setInviteError] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminIdentity, setAdminIdentity] = useState(null)
  const [currentTripGroup, setCurrentTripGroup] = useState(null)

  const handleInviteSubmit = (e) => {
    e.preventDefault()
    const code = inviteCode.trim().toUpperCase()
    
    console.log('Submitted code:', code)
    console.log('Available admin codes:', Object.keys(ADMIN_CODES))
    console.log('Available invite codes:', Object.keys(INVITE_CODES))
    console.log('Is admin code?', ADMIN_CODES[code])
    console.log('Is invite code?', INVITE_CODES[code])
    
    if (INVITE_CODES[code]) {
      // Regular user with specific trip group
      setCurrentTripGroup(INVITE_CODES[code].tripGroup)
      setShowInviteForm(false)
      setInviteError('')
      setIsAdmin(false)
      setAdminIdentity(null)
    } else if (ADMIN_CODES[code]) {
      // Admin user with specific trip group
      setCurrentTripGroup(ADMIN_CODES[code].tripGroup)
      setShowInviteForm(false)
      setInviteError('')
      setIsAdmin(true)
      setAdminIdentity(ADMIN_CODES[code])
      // Pre-fill admin details
      setName(ADMIN_CODES[code].name)
      setSelectedAvatar(ADMIN_CODES[code].avatar)
    } else {
      setInviteError('Invalid invite code. Please try again.')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim() && selectedAvatar) {
      // Generate a unique ID for this user
      const userId = `${name.trim()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const userData = {
        id: userId,
        name: name.trim(),
        avatar: selectedAvatar,
        isAdmin: isAdmin,
        tripGroup: currentTripGroup || 'default'
      }
      onLogin(userData)
    }
  }

  const handleExistingUserLogin = (participant) => {
    const userData = {
      ...participant,
      tripGroup: currentTripGroup || participant.tripGroup || 'default'
    }
    onLogin(userData)
  }

  // Filter out admin users from the existing users list for normal users
  // Also filter by trip group
  const visibleParticipants = isAdmin 
    ? participants.filter(p => p.tripGroup === currentTripGroup)
    : participants.filter(p => !p.isAdmin && p.tripGroup === currentTripGroup)

  if (showInviteForm) {
    return (
      <div className="container landing-page">
        <div className="pixel-card">
          <h1 className="pixel-title">🎉 Trip Pixel App 🎉</h1>
          <p style={{ textAlign: 'center', marginBottom: '32px', fontSize: '18px' }}>
            Welcome to your exclusive trip planning app!
          </p>
          
          <form onSubmit={handleInviteSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label className="pixel-subtitle">Enter Invite Code:</label>
              <input
                type="text"
                className="pixel-input"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Enter your invite code..."
                required
                style={{ textTransform: 'uppercase' }}
              />
              {inviteError && (
                <p style={{ color: 'var(--error-color)', marginTop: '8px', fontSize: '14px' }}>
                  {inviteError}
                </p>
              )}
            </div>
            
            <button type="submit" className="pixel-button" style={{ width: '100%' }}>
              Join the Trip!
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="container landing-page">
      <div className="pixel-card">
        <h1 className="pixel-title">🎉 Trip Pixel App 🎉</h1>
        
        {!isAdmin && currentTripGroup && (
          <div style={{ 
            background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', 
            color: 'white', 
            padding: '12px', 
            borderRadius: 'var(--border-radius)', 
            marginBottom: '24px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            🎉 Welcome to {INVITE_CODES[inviteCode.trim().toUpperCase()]?.description || 'Trip'}!
          </div>
        )}
        
        {isAdmin && (
          <div style={{ 
            background: 'linear-gradient(135deg, var(--warning-color), var(--error-color))', 
            color: 'white', 
            padding: '12px', 
            borderRadius: 'var(--border-radius)', 
            marginBottom: '24px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            👑 Admin Mode - {currentTripGroup || 'Trip Group'} - You have special privileges!
            {adminIdentity?.description && (
              <div style={{ fontSize: '0.8rem', marginTop: '4px', opacity: 0.9 }}>
                {adminIdentity.description}
              </div>
            )}
          </div>
        )}
        
        {visibleParticipants.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 className="pixel-subtitle">
              {isAdmin ? 'All Users:' : 'Returning Friends:'}
            </h2>
            <div className="avatar-grid">
              {visibleParticipants.map((participant, index) => (
                <div
                  key={participant.id}
                  className="avatar-option"
                  onClick={() => handleExistingUserLogin(participant)}
                  title={`Login as ${participant.name}${participant.isAdmin ? ' (Admin)' : ''}`}
                >
                  {participant.avatar}
                  {participant.isAdmin && <span style={{ fontSize: '10px', position: 'absolute', top: '-5px', right: '-5px' }}>👑</span>}
                  {/* Show a small identifier for users with the same name */}
                  {visibleParticipants.filter(p => p.name === participant.name).length > 1 && (
                    <span style={{ 
                      fontSize: '8px', 
                      position: 'absolute', 
                      bottom: '-2px', 
                      right: '-2px',
                      background: 'var(--primary-color)',
                      color: 'white',
                      borderRadius: '50%',
                      width: '12px',
                      height: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold'
                    }}>
                      {visibleParticipants.filter(p => p.name === participant.name).findIndex(p => p.id === participant.id) + 1}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <button
            className="pixel-button"
            onClick={() => {
              setIsNewUser(!isNewUser)
              if (isNewUser) {
                setName('')
                setSelectedAvatar('')
              }
            }}
            style={{ marginBottom: '16px' }}
          >
            {isNewUser ? 'Join the Trip!' : 'New Friend? Join Here!'}
          </button>
        </div>

        {isNewUser && (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label className="pixel-subtitle">What's your name?</label>
              <input
                type="text"
                className="pixel-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                required
                readOnly={adminIdentity !== null}
                style={adminIdentity !== null ? { background: 'var(--light-color)' } : {}}
              />
              {adminIdentity && (
                <p style={{ fontSize: '12px', color: 'var(--dark-color)', marginTop: '4px' }}>
                  Admin identity pre-filled from your code
                </p>
              )}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label className="pixel-subtitle">Choose your avatar:</label>
              <div className="avatar-grid">
                {avatars.map((avatar, index) => (
                  <div
                    key={index}
                    className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`}
                    onClick={() => setSelectedAvatar(avatar)}
                    style={adminIdentity !== null && avatar !== adminIdentity.avatar ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                  >
                    {avatar}
                  </div>
                ))}
              </div>
              {adminIdentity && (
                <p style={{ fontSize: '12px', color: 'var(--dark-color)', marginTop: '8px', textAlign: 'center' }}>
                  Admin avatar pre-selected from your code
                </p>
              )}
            </div>

            <button
              type="submit"
              className="pixel-button"
              disabled={!name.trim() || !selectedAvatar}
              style={{ width: '100%' }}
            >
              {isAdmin ? 'Start as Admin!' : 'Start Adventure!'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default LandingPage 