import { useState, useEffect } from 'react'
import { FiPlus, FiThumbsUp, FiThumbsDown, FiStar, FiTrash2 } from 'react-icons/fi'

function AirbnbVoting({ participants, currentUser }) {
  const [airbnbs, setAirbnbs] = useState([])
  const [newLink, setNewLink] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newScore, setNewScore] = useState('')
  const [newReviewCount, setNewReviewCount] = useState('')
  const [newBedrooms, setNewBedrooms] = useState('')
  const [newBathrooms, setNewBathrooms] = useState('')
  const [newGuests, setNewGuests] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    const savedAirbnbs = localStorage.getItem('tripAirbnbs')
    if (savedAirbnbs) {
      setAirbnbs(JSON.parse(savedAirbnbs))
    }
  }, [])

  const saveAirbnbs = (updatedAirbnbs) => {
    setAirbnbs(updatedAirbnbs)
    localStorage.setItem('tripAirbnbs', JSON.stringify(updatedAirbnbs))
  }

  const addAirbnb = (e) => {
    e.preventDefault()
    if (newLink.trim() && newTitle.trim()) {
      const newAirbnb = {
        id: Date.now(),
        link: newLink.trim(),
        title: newTitle.trim(),
        description: newDescription.trim(),
        price: newPrice.trim() || 'Price not available',
        score: newScore.trim() || null,
        reviewCount: newReviewCount.trim() || null,
        bedrooms: newBedrooms.trim() || null,
        bathrooms: newBathrooms.trim() || null,
        guests: newGuests.trim() || null,
        votes: { like: [], dislike: [] },
        comments: [],
        author: currentUser.name
      }
      
      saveAirbnbs([...airbnbs, newAirbnb])
      setNewLink('')
      setNewTitle('')
      setNewDescription('')
      setNewPrice('')
      setNewScore('')
      setNewReviewCount('')
      setNewBedrooms('')
      setNewBathrooms('')
      setNewGuests('')
      setShowAddForm(false)
    }
  }

  const handleVote = (airbnbId, voteType, participantName) => {
    const updatedAirbnbs = airbnbs.map(airbnb => {
      if (airbnb.id === airbnbId) {
        const votes = { ...airbnb.votes }
        
        // Remove existing vote from this participant
        votes.like = votes.like.filter(name => name !== participantName)
        votes.dislike = votes.dislike.filter(name => name !== participantName)
        
        // Add new vote
        if (voteType === 'like') {
          votes.like.push(participantName)
        } else if (voteType === 'dislike') {
          votes.dislike.push(participantName)
        }
        
        return { ...airbnb, votes }
      }
      return airbnb
    })
    saveAirbnbs(updatedAirbnbs)
  }

  const deleteAirbnb = (airbnbId) => {
    const airbnb = airbnbs.find(a => a.id === airbnbId)
    const canDelete = currentUser.isAdmin || airbnb.author === currentUser.name
    
    if (canDelete && window.confirm('Are you sure you want to delete this property?')) {
      saveAirbnbs(airbnbs.filter(airbnb => airbnb.id !== airbnbId))
    }
  }

  const sortedAirbnbs = [...airbnbs].sort((a, b) => {
    const aScore = a.votes.like.length - a.votes.dislike.length
    const bScore = b.votes.like.length - b.votes.dislike.length
    return bScore - aScore
  })

  return (
    <div>
      <h1 className="pixel-title">🏠 Airbnb Voting</h1>
      
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <button
          className="pixel-button"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <FiPlus size={16} style={{ marginRight: '8px' }} />
          Add New Property
        </button>
      </div>

      {showAddForm && (
        <div className="pixel-card">
          <h2 className="pixel-subtitle">Add New Property</h2>
          <form onSubmit={addAirbnb}>
            <div style={{ marginBottom: '16px' }}>
              <label className="pixel-subtitle">Property Link: *</label>
              <input
                type="url"
                className="pixel-input"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="https://airbnb.com/..."
                required
              />
              <p style={{ fontSize: '12px', color: 'var(--dark-color)', marginTop: '4px' }}>
                Add the property link (required)
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="pixel-subtitle">Property Title: *</label>
              <input
                type="text"
                className="pixel-input"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Beautiful Beach House, Luxury Villa, Cozy Cabin..."
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="pixel-subtitle">Description:</label>
              <textarea
                className="pixel-input"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Describe the property, amenities, location, etc..."
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="pixel-subtitle">Total Price:</label>
                <input
                  type="text"
                  className="pixel-input"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="$1,200 total"
                />
              </div>
              <div>
                <label className="pixel-subtitle">Rating Score:</label>
                <input
                  type="number"
                  className="pixel-input"
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  placeholder="4.8"
                  min="0"
                  max="5"
                  step="0.1"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="pixel-subtitle">Bedrooms:</label>
                <input
                  type="number"
                  className="pixel-input"
                  value={newBedrooms}
                  onChange={(e) => setNewBedrooms(e.target.value)}
                  placeholder="3"
                  min="0"
                />
              </div>
              <div>
                <label className="pixel-subtitle">Bathrooms:</label>
                <input
                  type="number"
                  className="pixel-input"
                  value={newBathrooms}
                  onChange={(e) => setNewBathrooms(e.target.value)}
                  placeholder="2"
                  min="0"
                />
              </div>
              <div>
                <label className="pixel-subtitle">Guests:</label>
                <input
                  type="number"
                  className="pixel-input"
                  value={newGuests}
                  onChange={(e) => setNewGuests(e.target.value)}
                  placeholder="6"
                  min="1"
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="pixel-subtitle">Number of Reviews:</label>
              <input
                type="number"
                className="pixel-input"
                value={newReviewCount}
                onChange={(e) => setNewReviewCount(e.target.value)}
                placeholder="150"
                min="0"
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="submit" 
                className="pixel-button"
              >
                Add Property
              </button>
              <button
                type="button"
                className="pixel-button"
                onClick={() => setShowAddForm(false)}
                style={{ background: 'var(--error-color)' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {sortedAirbnbs.length === 0 ? (
        <div className="pixel-card" style={{ textAlign: 'center' }}>
          <h2 className="pixel-subtitle">No properties added yet!</h2>
          <p>Click "Add New Property" to get started.</p>
        </div>
      ) : (
        sortedAirbnbs.map((airbnb) => (
          <AirbnbCard
            key={airbnb.id}
            airbnb={airbnb}
            participants={participants}
            onVote={handleVote}
            onDelete={deleteAirbnb}
            currentUser={currentUser}
          />
        ))
      )}
    </div>
  )
}

function AirbnbCard({ airbnb, participants, onVote, onDelete, currentUser }) {
  const totalVotes = airbnb.votes.like.length + airbnb.votes.dislike.length
  const score = airbnb.votes.like.length - airbnb.votes.dislike.length
  const canDelete = currentUser.isAdmin || airbnb.author === currentUser.name

  return (
    <div className="pixel-card">
      {/* Main property info in one line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <h4 style={{ margin: 0, flex: '1 1 200px', fontSize: '16px', fontWeight: 'bold' }}>{airbnb.title}</h4>
        
        {airbnb.score && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '12px' }}>
            <FiStar size={12} style={{ color: 'var(--warning-color)' }} />
            <span style={{ fontWeight: 'bold' }}>{airbnb.score}</span>
            {airbnb.reviewCount && (
              <span style={{ fontSize: '10px', color: 'var(--dark-color)' }}>
                ({airbnb.reviewCount})
              </span>
            )}
          </div>
        )}
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '12px' }}>
          <span style={{ fontWeight: 'bold', color: 'var(--success-color)' }}>
            {airbnb.price}
          </span>
        </div>
        
        {(airbnb.bedrooms || airbnb.bathrooms || airbnb.guests) && (
          <div style={{ display: 'flex', gap: '4px', fontSize: '10px', color: 'var(--dark-color)' }}>
            {airbnb.bedrooms && <span>🛏️{airbnb.bedrooms}</span>}
            {airbnb.bathrooms && <span>🚿{airbnb.bathrooms}</span>}
            {airbnb.guests && <span>👥{airbnb.guests}</span>}
          </div>
        )}
        
        <a
          href={airbnb.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--primary-color)', textDecoration: 'underline', fontSize: '14px', fontWeight: 'bold' }}
        >
          View →
        </a>
        
        {canDelete && (
          <button
            className="pixel-button"
            onClick={() => onDelete(airbnb.id)}
            style={{ background: 'var(--error-color)', padding: '4px 6px', fontSize: '10px' }}
            title="Delete property"
          >
            <FiTrash2 size={10} />
          </button>
        )}
      </div>
      
      {/* Description on second line if exists */}
      {airbnb.description && (
        <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--dark-color)' }}>{airbnb.description}</p>
      )}

      {/* Author info */}
      <div style={{ fontSize: '12px', color: 'var(--dark-color)', marginBottom: '8px' }}>
        Added by {airbnb.author}
      </div>

      {/* Voting section - single set of buttons */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
          Score: {score} ({totalVotes} votes)
        </div>
        
        {/* Single set of voting buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <button
            className="vote-btn like"
            onClick={() => onVote(airbnb.id, 'like', 'Current User')}
            title="Vote like"
            style={{ padding: '8px 12px', fontSize: '14px' }}
          >
            <FiThumbsUp size={16} />
          </button>
          <button
            className="vote-btn dislike"
            onClick={() => onVote(airbnb.id, 'dislike', 'Current User')}
            title="Vote dislike"
            style={{ padding: '8px 12px', fontSize: '14px' }}
          >
            <FiThumbsDown size={16} />
          </button>
        </div>
        
        {/* Who voted/disliked list */}
        {(airbnb.votes.like.length > 0 || airbnb.votes.dislike.length > 0) && (
          <div style={{ fontSize: '12px', color: 'var(--dark-color)' }}>
            {airbnb.votes.like.length > 0 && (
              <div style={{ marginBottom: '4px' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--success-color)' }}>👍</span> {airbnb.votes.like.join(', ')}
              </div>
            )}
            {airbnb.votes.dislike.length > 0 && (
              <div>
                <span style={{ fontWeight: 'bold', color: 'var(--error-color)' }}>👎</span> {airbnb.votes.dislike.join(', ')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AirbnbVoting 