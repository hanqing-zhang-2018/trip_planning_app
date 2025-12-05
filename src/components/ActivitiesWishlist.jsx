import { useState, useEffect } from 'react'
import { FiPlus, FiTrash2, FiMapPin, FiCalendar } from 'react-icons/fi'
import { activitiesService } from '../firebase/db'

function ActivitiesWishlist({ participants, currentUser }) {
  const [activities, setActivities] = useState([])
  const [newActivity, setNewActivity] = useState('')
  const [newActivityAuthor, setNewActivityAuthor] = useState('')
  const [newActivityLocation, setNewActivityLocation] = useState('')
  const [newActivityDate, setNewActivityDate] = useState('')
  const [newActivityLink, setNewActivityLink] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const tripGroup = currentUser?.tripGroup || 'default'

  // Real-time listener for activities
  useEffect(() => {
    if (!currentUser?.tripGroup) return

    setLoading(true)
    const unsubscribe = activitiesService.subscribe(tripGroup, (updatedActivities) => {
      setActivities(updatedActivities)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [tripGroup, currentUser?.tripGroup])

  const addActivity = async (e) => {
    e.preventDefault()
    if (newActivity.trim() && newActivityAuthor) {
      try {
        const activity = {
          name: newActivity.trim(),
          author: newActivityAuthor,
          location: newActivityLocation.trim(),
          preferredDate: newActivityDate,
          link: newActivityLink.trim(),
          completed: false,
          confirmed: false,
          date: new Date().toISOString(),
          createdById: currentUser.id,
          createdBy: currentUser.name
        }
        await activitiesService.add(tripGroup, activity)
        setNewActivity('')
        setNewActivityAuthor('')
        setNewActivityLocation('')
        setNewActivityDate('')
        setNewActivityLink('')
        setShowAddForm(false)
      } catch (error) {
        console.error('Error adding activity:', error)
        alert('Failed to add activity. Please try again.')
      }
    }
  }

  const toggleActivityStatus = async (activityId, field) => {
    try {
      const activity = activities.find(a => a.id === activityId)
      if (!activity) return
      await activitiesService.update(tripGroup, activityId, { [field]: !activity[field] })
    } catch (error) {
      console.error('Error updating activity:', error)
      alert('Failed to update activity. Please try again.')
    }
  }

  const deleteActivity = async (activityId) => {
    const activity = activities.find(a => a.id === activityId)
    const canDelete = currentUser.isAdmin || activity?.createdById === currentUser.id
    
    if (canDelete && window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await activitiesService.delete(tripGroup, activityId)
      } catch (error) {
        console.error('Error deleting activity:', error)
        alert('Failed to delete activity. Please try again.')
      }
    }
  }

  const completedActivities = activities.filter(activity => activity.completed)
  const pendingActivities = activities.filter(activity => !activity.completed)
  const confirmedActivities = activities.filter(activity => activity.confirmed && !activity.completed)

  if (loading) {
    return (
      <div>
        <h1 className="pixel-title">🎯 Activities Wishlist</h1>
        <div className="pixel-card" style={{ textAlign: 'center' }}>
          <p>Loading activities...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="pixel-title">🎯 Activities Wishlist</h1>

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <button
          className="pixel-button"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <FiPlus size={16} style={{ marginRight: '8px' }} />
          Add Activity
        </button>
      </div>

      {showAddForm && (
        <div className="pixel-card">
          <h2 className="pixel-subtitle">Add New Activity</h2>
          <form onSubmit={addActivity}>
            <div style={{ marginBottom: '16px' }}>
              <label className="pixel-subtitle">What activity do you want to do?</label>
              <input
                type="text"
                className="pixel-input"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                placeholder="Hiking, Beach day, Museum visit, Wine tasting..."
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="pixel-subtitle">Location (optional):</label>
              <input
                type="text"
                className="pixel-input"
                value={newActivityLocation}
                onChange={(e) => setNewActivityLocation(e.target.value)}
                placeholder="Central Park, Downtown, Beach..."
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="pixel-subtitle">Preferred Date (optional):</label>
              <input
                type="date"
                className="pixel-input"
                value={newActivityDate}
                onChange={(e) => setNewActivityDate(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="pixel-subtitle">Suggested by:</label>
              <select
                className="pixel-input"
                value={newActivityAuthor}
                onChange={(e) => setNewActivityAuthor(e.target.value)}
                required
              >
                <option value="">Select who suggested this</option>
                {participants.map((participant) => (
                  <option key={participant.name} value={participant.name}>
                    {participant.avatar} {participant.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="pixel-subtitle">Link (optional):</label>
              <input
                type="text"
                className="pixel-input"
                value={newActivityLink}
                onChange={(e) => setNewActivityLink(e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="pixel-button">
                Add Activity
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

      {confirmedActivities.length > 0 && (
        <div className="pixel-card">
          <h2 className="pixel-subtitle">✅ Confirmed Activities</h2>
          <div style={{ display: 'grid', gap: '8px' }}>
            {confirmedActivities.map((activity) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                participants={participants}
                onToggleStatus={toggleActivityStatus}
                onDelete={deleteActivity}
                currentUser={currentUser}
              />
            ))}
          </div>
        </div>
      )}

      {pendingActivities.length > 0 && (
        <div className="pixel-card">
          <h2 className="pixel-subtitle">🎯 Activity Ideas</h2>
          <div style={{ display: 'grid', gap: '8px' }}>
            {pendingActivities.map((activity) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                participants={participants}
                onToggleStatus={toggleActivityStatus}
                onDelete={deleteActivity}
                currentUser={currentUser}
              />
            ))}
          </div>
        </div>
      )}

      {completedActivities.length > 0 && (
        <div className="pixel-card">
          <h2 className="pixel-subtitle">🎉 Completed Activities</h2>
          <div style={{ display: 'grid', gap: '8px' }}>
            {completedActivities.map((activity) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                participants={participants}
                onToggleStatus={toggleActivityStatus}
                onDelete={deleteActivity}
                currentUser={currentUser}
              />
            ))}
          </div>
        </div>
      )}

      {activities.length === 0 && (
        <div className="pixel-card" style={{ textAlign: 'center' }}>
          <h2 className="pixel-subtitle">No activities yet!</h2>
          <p>Add some fun activities to your wishlist to get started.</p>
        </div>
      )}

      <div className="pixel-card">
        <h2 className="pixel-subtitle">How it works</h2>
        <div style={{ display: 'grid', gap: '16px' }}>
          <div style={{ padding: '16px', border: '2px solid var(--primary-color)', borderRadius: 'var(--border-radius)', background: 'var(--light-color)' }}>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-color)' }}>🎯 Activity Ideas</h3>
            <p style={{ margin: 0 }}>Suggest activities you want to do during the trip</p>
          </div>
          
          <div style={{ padding: '16px', border: '2px solid var(--secondary-color)', borderRadius: 'var(--border-radius)', background: 'var(--light-color)' }}>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--secondary-color)' }}>✅ Confirmed</h3>
            <p style={{ margin: 0 }}>Mark activities as confirmed when the group agrees</p>
          </div>
          
          <div style={{ padding: '16px', border: '2px solid var(--success-color)', borderRadius: 'var(--border-radius)', background: 'var(--light-color)' }}>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--success-color)' }}>🎉 Completed</h3>
            <p style={{ margin: 0 }}>Check off activities when you've done them</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActivityItem({ activity, participants, onToggleStatus, onDelete, currentUser }) {
  const author = participants.find(p => p.name === activity.author)

  return (
    <div className={`wishlist-item ${activity.completed ? 'completed' : ''}`}>
      <div
        className={`checkbox ${activity.completed ? 'checked' : ''}`}
        onClick={() => onToggleStatus(activity.id, 'completed')}
      >
        {activity.completed && '✓'}
      </div>
      
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '20px' }}>{author?.avatar}</span>
          <span style={{ fontWeight: 'bold' }}>{activity.name}</span>
          {activity.link && (
            <a
              href={activity.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--primary-color)', textDecoration: 'underline', fontSize: '12px', fontWeight: 'bold' }}
            >
              🔗 Link
            </a>
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: 'var(--dark-color)' }}>
          <span>Added by {activity.author}</span>
          {activity.location && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FiMapPin size={12} />
              {activity.location}
            </span>
          )}
          {activity.preferredDate && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FiCalendar size={12} />
              {new Date(activity.preferredDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          className={`checkbox ${activity.confirmed ? 'checked' : ''}`}
          onClick={() => onToggleStatus(activity.id, 'confirmed')}
          title={activity.confirmed ? 'Unconfirm activity' : 'Confirm activity'}
        >
          {activity.confirmed && '✓'}
        </button>
        
        {currentUser.isAdmin || activity.createdById === currentUser.id && (
          <button
            className="pixel-button"
            onClick={() => onDelete(activity.id)}
            style={{ background: 'var(--error-color)', padding: '4px 8px' }}
          >
            <FiTrash2 size={14} />
          </button>
        )}
      </div>
    </div>
  )
}

export default ActivitiesWishlist 