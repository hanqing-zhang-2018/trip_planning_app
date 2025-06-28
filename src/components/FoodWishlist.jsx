import { useState, useEffect } from 'react'
import { FiPlus, FiTrash2, FiShoppingCart, FiCoffee } from 'react-icons/fi'

function FoodWishlist({ participants, currentUser }) {
  const [wishlistItems, setWishlistItems] = useState([])
  const [newItem, setNewItem] = useState('')
  const [newItemAuthor, setNewItemAuthor] = useState('')
  const [newItemDescription, setNewItemDescription] = useState('')
  const [newItemType, setNewItemType] = useState('grocery')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingComment, setEditingComment] = useState(null)
  const [commentText, setCommentText] = useState('')

  useEffect(() => {
    const savedWishlist = localStorage.getItem('tripFoodWishlist')
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist))
    }
  }, [])

  const saveWishlist = (updatedWishlist) => {
    setWishlistItems(updatedWishlist)
    localStorage.setItem('tripFoodWishlist', JSON.stringify(updatedWishlist))
  }

  const addWishlistItem = (e) => {
    e.preventDefault()
    if (newItem.trim() && newItemAuthor) {
      const wishlistItem = {
        id: Date.now(),
        text: newItem.trim(),
        description: newItemDescription.trim(),
        author: newItemAuthor,
        type: newItemType, // 'grocery' or 'restaurant'
        completed: false,
        comment: '',
        date: new Date().toISOString(),
        createdBy: currentUser.name
      }
      saveWishlist([...wishlistItems, wishlistItem])
      setNewItem('')
      setNewItemAuthor('')
      setNewItemDescription('')
      setNewItemType('grocery')
      setShowAddForm(false)
    }
  }

  const toggleItemStatus = (itemId, field) => {
    const updatedWishlist = wishlistItems.map(item => {
      if (item.id === itemId) {
        return { ...item, [field]: !item[field] }
      }
      return item
    })
    saveWishlist(updatedWishlist)
  }

  const addComment = (itemId) => {
    const updatedWishlist = wishlistItems.map(item => {
      if (item.id === itemId) {
        return { ...item, comment: commentText.trim() }
      }
      return item
    })
    saveWishlist(updatedWishlist)
    setEditingComment(null)
    setCommentText('')
  }

  const deleteItem = (itemId) => {
    const item = wishlistItems.find(i => i.id === itemId)
    const canDelete = currentUser.isAdmin || item.createdBy === currentUser.name
    
    if (canDelete && window.confirm('Are you sure you want to delete this item?')) {
      saveWishlist(wishlistItems.filter(item => item.id !== itemId))
    }
  }

  const completedGroceryItems = wishlistItems.filter(item => item.completed && item.type === 'grocery')
  const completedRestaurantItems = wishlistItems.filter(item => item.completed && item.type === 'restaurant')
  const groceryItems = wishlistItems.filter(item => !item.completed && item.type === 'grocery')
  const restaurantItems = wishlistItems.filter(item => !item.completed && item.type === 'restaurant')

  return (
    <div>
      <h1 className="pixel-title">🍕 Food Wishlist</h1>

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <button
          className="pixel-button"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <FiPlus size={16} style={{ marginRight: '8px' }} />
          Add Food Item
        </button>
      </div>

      {showAddForm && (
        <div className="pixel-card">
          <h2 className="pixel-subtitle">Add New Food Item</h2>
          <form onSubmit={addWishlistItem}>
            <div style={{ marginBottom: '16px' }}>
              <label className="pixel-subtitle">Food Type:</label>
              <select
                className="pixel-input"
                value={newItemType}
                onChange={(e) => setNewItemType(e.target.value)}
                required
              >
                <option value="grocery">🛒 Grocery Item</option>
                <option value="restaurant">🍽️ Restaurant</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="pixel-subtitle">
                {newItemType === 'grocery' ? 'What do you want to buy?' : 'What restaurant do you want to try?'}
              </label>
              <input
                type="text"
                className="pixel-input"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder={newItemType === 'grocery' ? 'Pizza, Ice cream, Tacos, Sushi...' : 'McDonald\'s, Pizza Hut, Sushi Bar...'}
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="pixel-subtitle">Description (optional):</label>
              <textarea
                className="pixel-input"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                placeholder={newItemType === 'grocery' ? 'Specific brand, flavor, or notes...' : 'What to order, location, or notes...'}
                rows={2}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="pixel-subtitle">Added by:</label>
              <select
                className="pixel-input"
                value={newItemAuthor}
                onChange={(e) => setNewItemAuthor(e.target.value)}
                required
              >
                <option value="">Select who wants this</option>
                {participants.map((participant) => (
                  <option key={participant.name} value={participant.name}>
                    {participant.avatar} {participant.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="pixel-button">
                Add to Food List
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

      {groceryItems.length > 0 && (
        <div className="pixel-card">
          <h2 className="pixel-subtitle">
            <FiShoppingCart size={20} style={{ marginRight: '8px' }} />
            Grocery List
          </h2>
          <div style={{ display: 'grid', gap: '8px' }}>
            {groceryItems.map((item) => (
              <WishlistItem
                key={item.id}
                item={item}
                participants={participants}
                onToggleStatus={toggleItemStatus}
                onDelete={deleteItem}
                editingComment={editingComment}
                setEditingComment={setEditingComment}
                commentText={commentText}
                setCommentText={setCommentText}
                addComment={addComment}
                currentUser={currentUser}
              />
            ))}
          </div>
        </div>
      )}

      {restaurantItems.length > 0 && (
        <div className="pixel-card">
          <h2 className="pixel-subtitle">
            <FiCoffee size={20} style={{ marginRight: '8px' }} />
            Restaurant Wishlist
          </h2>
          <div style={{ display: 'grid', gap: '8px' }}>
            {restaurantItems.map((item) => (
              <WishlistItem
                key={item.id}
                item={item}
                participants={participants}
                onToggleStatus={toggleItemStatus}
                onDelete={deleteItem}
                editingComment={editingComment}
                setEditingComment={setEditingComment}
                commentText={commentText}
                setCommentText={setCommentText}
                addComment={addComment}
                currentUser={currentUser}
              />
            ))}
          </div>
        </div>
      )}

      {completedGroceryItems.length > 0 && (
        <div className="pixel-card">
          <h2 className="pixel-subtitle">
            <FiShoppingCart size={20} style={{ marginRight: '8px' }} />
            Completed Grocery List
          </h2>
          <div style={{ display: 'grid', gap: '8px' }}>
            {completedGroceryItems.map((item) => (
              <WishlistItem
                key={item.id}
                item={item}
                participants={participants}
                onToggleStatus={toggleItemStatus}
                onDelete={deleteItem}
                editingComment={editingComment}
                setEditingComment={setEditingComment}
                commentText={commentText}
                setCommentText={setCommentText}
                addComment={addComment}
                currentUser={currentUser}
              />
            ))}
          </div>
        </div>
      )}

      {completedRestaurantItems.length > 0 && (
        <div className="pixel-card">
          <h2 className="pixel-subtitle">
            <FiCoffee size={20} style={{ marginRight: '8px' }} />
            Completed Restaurant Wishlist
          </h2>
          <div style={{ display: 'grid', gap: '8px' }}>
            {completedRestaurantItems.map((item) => (
              <WishlistItem
                key={item.id}
                item={item}
                participants={participants}
                onToggleStatus={toggleItemStatus}
                onDelete={deleteItem}
                editingComment={editingComment}
                setEditingComment={setEditingComment}
                commentText={commentText}
                setCommentText={setCommentText}
                addComment={addComment}
                currentUser={currentUser}
              />
            ))}
          </div>
        </div>
      )}

      {wishlistItems.length === 0 && (
        <div className="pixel-card" style={{ textAlign: 'center' }}>
          <h2 className="pixel-subtitle">No food items yet!</h2>
          <p>Add some delicious food to your wishlist to get started.</p>
        </div>
      )}

      <div className="pixel-card">
        <h2 className="pixel-subtitle">How it works</h2>
        <div style={{ display: 'grid', gap: '16px' }}>
          <div style={{ padding: '16px', border: '2px solid var(--primary-color)', borderRadius: 'var(--border-radius)', background: 'var(--light-color)' }}>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-color)' }}>🛒 Grocery List</h3>
            <p style={{ margin: 0 }}>Add food items you want to buy and cook</p>
          </div>
          
          <div style={{ padding: '16px', border: '2px solid var(--secondary-color)', borderRadius: 'var(--border-radius)', background: 'var(--light-color)' }}>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--secondary-color)' }}>🍽️ Restaurant List</h3>
            <p style={{ margin: 0 }}>Add restaurants you want to visit during the trip</p>
          </div>
          
          <div style={{ padding: '16px', border: '2px solid var(--success-color)', borderRadius: 'var(--border-radius)', background: 'var(--light-color)' }}>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--success-color)' }}>✅ Eaten</h3>
            <p style={{ margin: 0 }}>Check off items when you've eaten them</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function WishlistItem({ item, participants, onToggleStatus, onDelete, editingComment, setEditingComment, commentText, setCommentText, addComment, currentUser }) {
  const author = participants.find(p => p.name === item.author)

  return (
    <div className={`wishlist-item ${item.completed ? 'completed' : ''}`}>
      <div
        className={`checkbox ${item.completed ? 'checked' : ''}`}
        onClick={() => onToggleStatus(item.id, 'completed')}
      >
        {item.completed && '✓'}
      </div>
      
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '20px' }}>{author?.avatar}</span>
          <span style={{ fontWeight: 'bold' }}>{item.text}</span>
          {item.type === 'grocery' && item.description && (
            <span style={{ fontSize: '12px', color: 'var(--dark-color)', fontStyle: 'italic' }}>
              ({item.description})
            </span>
          )}
          <span style={{ 
            fontSize: '12px', 
            padding: '2px 6px', 
            borderRadius: '4px',
            background: item.type === 'grocery' ? 'var(--primary-color)' : 'var(--secondary-color)',
            color: 'white'
          }}>
            {item.type === 'grocery' ? '🛒' : '🍽️'}
          </span>
        </div>
        
        <div style={{ fontSize: '14px', color: 'var(--dark-color)', marginBottom: '4px' }}>
          Added by {item.author}
        </div>
        
        {item.type === 'restaurant' && item.description && (
          <div style={{ fontSize: '12px', color: 'var(--dark-color)', fontStyle: 'italic' }}>
            {item.description}
          </div>
        )}
        
        {item.completed && item.comment && (
          <div style={{ fontSize: '12px', color: 'var(--success-color)', fontWeight: 'bold', marginTop: '4px' }}>
            💬 {item.comment}
          </div>
        )}
        
        {item.completed && !item.comment && (
          <div style={{ marginTop: '4px' }}>
            {editingComment === item.id ? (
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <input
                  type="text"
                  className="pixel-input"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add comment..."
                  style={{ fontSize: '12px', padding: '4px 8px' }}
                  onKeyPress={(e) => e.key === 'Enter' && addComment(item.id)}
                />
                <button
                  className="pixel-button"
                  onClick={() => addComment(item.id)}
                  style={{ padding: '4px 8px', fontSize: '10px' }}
                >
                  Add
                </button>
                <button
                  className="pixel-button"
                  onClick={() => {
                    setEditingComment(null)
                    setCommentText('')
                  }}
                  style={{ background: 'var(--error-color)', padding: '4px 8px', fontSize: '10px' }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                className="pixel-button"
                onClick={() => setEditingComment(item.id)}
                style={{ padding: '4px 8px', fontSize: '10px', background: 'var(--success-color)' }}
              >
                💬 Add Comment
              </button>
            )}
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {currentUser.isAdmin || item.createdBy === currentUser.name && (
          <button
            className="pixel-button"
            onClick={() => onDelete(item.id)}
            style={{ background: 'var(--error-color)', padding: '4px 8px' }}
          >
            <FiTrash2 size={14} />
          </button>
        )}
      </div>
    </div>
  )
}

export default FoodWishlist 