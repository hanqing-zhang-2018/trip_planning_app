import { useLocation, useNavigate } from 'react-router-dom'
import { FiLogOut, FiEdit3, FiUsers, FiTrash2, FiSave, FiX } from 'react-icons/fi'
import { useState } from 'react'

function Navigation({ 
  currentUser, 
  onLogout, 
  tripTitle,
  isAdmin,
  isEditingTitle,
  setIsEditingTitle,
  newTitle,
  setNewTitle,
  updateTripTitle,
  participants,
  removeUser,
  clearAllData,
  clearUserCache
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const [showUserModal, setShowUserModal] = useState(false)

  const navItems = [
    { path: '/airbnb', label: '🏠 Airbnb' },
    { path: '/expenses', label: '💰 Expenses' },
    { path: '/truth-dare', label: '🎲 Truth or Dare' },
    { path: '/food', label: '🍕 Food' },
    { path: '/activities', label: '🎯 Activities' }
  ]

  return (
    <>
      <nav className="nav-bar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>{currentUser.avatar}</span>
              <span className="pixel-subtitle" style={{ margin: 0 }}>
                Welcome, {currentUser.name}!
                {currentUser.isAdmin && <span style={{ color: 'var(--warning-color)', marginLeft: '8px' }}>👑</span>}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isAdmin && (
                <>
                  <button
                    className="pixel-button"
                    onClick={() => setIsEditingTitle(!isEditingTitle)}
                    style={{ padding: '8px 12px', fontSize: '12px', background: 'var(--primary-color)' }}
                    title="Edit trip title"
                  >
                    <FiEdit3 size={14} />
                  </button>
                  <button
                    className="pixel-button"
                    onClick={() => setShowUserModal(true)}
                    style={{ padding: '8px 12px', fontSize: '12px', background: 'var(--secondary-color)' }}
                    title="Manage users"
                  >
                    <FiUsers size={14} />
                  </button>
                  <button
                    className="pixel-button"
                    onClick={clearUserCache}
                    style={{ padding: '8px 12px', fontSize: '12px', background: 'var(--warning-color)' }}
                    title="Clear user cache (force re-login)"
                  >
                    🔄
                  </button>
                  <button
                    className="pixel-button"
                    onClick={clearAllData}
                    style={{ padding: '8px 12px', fontSize: '12px', background: 'var(--error-color)' }}
                    title="Clear all data"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </>
              )}
              <button
                className="pixel-button"
                onClick={onLogout}
                style={{ padding: '8px 16px', fontSize: '12px' }}
              >
                <FiLogOut size={16} style={{ marginRight: '8px' }} />
                Logout
              </button>
            </div>
          </div>
          
          {/* Editable Trip Title */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            {isEditingTitle ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <input
                  type="text"
                  className="pixel-input"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={tripTitle}
                  style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}
                  onKeyPress={(e) => e.key === 'Enter' && updateTripTitle()}
                />
                <button
                  className="pixel-button"
                  onClick={updateTripTitle}
                  style={{ padding: '4px 8px', fontSize: '12px', background: 'var(--success-color)' }}
                >
                  <FiSave size={12} />
                </button>
                <button
                  className="pixel-button"
                  onClick={() => {
                    setIsEditingTitle(false)
                    setNewTitle('')
                  }}
                  style={{ padding: '4px 8px', fontSize: '12px', background: 'var(--error-color)' }}
                >
                  <FiX size={12} />
                </button>
              </div>
            ) : (
              <h1 className="pixel-title" style={{ margin: '16px 0', cursor: isAdmin ? 'pointer' : 'default' }}>
                {tripTitle}
                {isAdmin && (
                  <span 
                    style={{ fontSize: '14px', marginLeft: '8px', opacity: 0.7 }}
                    title="Click edit button to change title"
                  >
                    ✏️
                  </span>
                )}
              </h1>
            )}
          </div>
          
          <ul className="nav-list">
            {navItems.map((item) => (
              <li
                key={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* User Management Modal */}
      {showUserModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="pixel-card" style={{ maxWidth: '500px', width: '90%', maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 className="pixel-subtitle">👥 User Management</h2>
              <button
                className="pixel-button"
                onClick={() => setShowUserModal(false)}
                style={{ background: 'var(--error-color)', padding: '8px' }}
              >
                <FiX size={16} />
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '14px', color: 'var(--dark-color)' }}>
                Manage users and their data. Removing a user will delete all their contributions.
              </p>
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    border: '2px solid var(--dark-color)',
                    borderRadius: 'var(--border-radius)',
                    background: 'white'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>{participant.avatar}</span>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                        {participant.name}
                        {participant.isAdmin && <span style={{ color: 'var(--warning-color)', marginLeft: '8px' }}>👑 Admin</span>}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--dark-color)' }}>
                        {participant.isAdmin ? 'Full access to all features' : 'Regular user'}
                      </div>
                    </div>
                  </div>
                  
                  {(participant.id !== currentUser.id && participant.userId !== currentUser.id) && (
                    <button
                      className="pixel-button"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to remove ${participant.name}? This will delete all their data and cannot be undone.`)) {
                          removeUser(participant.id) // Use Firestore doc ID
                          setShowUserModal(false)
                        }
                      }}
                      style={{ background: 'var(--error-color)', padding: '8px 12px', fontSize: '12px' }}
                      title={`Remove ${participant.name}`}
                    >
                      <FiTrash2 size={14} style={{ marginRight: '4px' }} />
                      Remove
                    </button>
                  )}
                  
                  {(participant.id === currentUser.id || participant.userId === currentUser.id) && (
                    <span style={{ fontSize: '12px', color: 'var(--dark-color)', fontStyle: 'italic' }}>
                      Current user
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <button
                className="pixel-button"
                onClick={() => setShowUserModal(false)}
                style={{ padding: '12px 24px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navigation 