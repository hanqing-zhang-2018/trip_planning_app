import { useState, useEffect } from 'react'
import { FiPlus, FiTrash2, FiShoppingCart } from 'react-icons/fi'

function Wishlist({ participants }) {
  const [wishlistItems, setWishlistItems] = useState([])
  const [newItem, setNewItem] = useState('')
  const [newItemAuthor, setNewItemAuthor] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    const savedWishlist = localStorage.getItem('tripWishlist')
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist))
    }
  }, [])

  const saveWishlist = (updatedWishlist) => {
    setWishlistItems(updatedWishlist)
    localStorage.setItem('tripWishlist', JSON.stringify(updatedWishlist))
  }

  const addWishlistItem = (e) => {
    e.preventDefault()
    if (newItem.trim() && newItemAuthor) {
      const wishlistItem = {
        id: Date.now(),
        text: newItem.trim(),
        author: newItemAuthor,
        completed: false,
        addedToGrocery: false,
        date: new Date().toISOString()
      }
      saveWishlist([...wishlistItems, wishlistItem])
      setNewItem('')
      setNewItemAuthor('')
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

  const deleteItem = (itemId) => {
    saveWishlist(wishlistItems.filter(item => item.id !== itemId))
  }

  const completedItems = wishlistItems.filter(item => item.completed)
  const pendingItems = wishlistItems.filter(item => !item.completed)
  const groceryItems = wishlistItems.filter(item => item.addedToGrocery)

  return (
    <div>
      <h1 className="pixel-title">📝 Wishlist & Groceries</h1>

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <button
          className="pixel-button"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <FiPlus size={16} style={{ marginRight: '8px' }} />
          Add Wishlist Item
        </button>
      </div>

      {showAddForm && (
        <div className="pixel-card">
          <h2 className="pixel-subtitle">Add New Item</h2>
          <form onSubmit={addWishlistItem}>
            <div style={{ marginBottom: '16px' }}>
              <label className="pixel-subtitle">What do you want?</label>
              <input
                type="text"
                className="pixel-input"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Pizza, Ice cream, Beach towels..."
                required
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
                Add to Wishlist
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
              />
            ))}
          </div>
        </div>
      )}

      {pendingItems.length > 0 && (
        <div className="pixel-card">
          <h2 className="pixel-subtitle">📋 Wishlist Items</h2>
          <div style={{ display: 'grid', gap: '8px' }}>
            {pendingItems.map((item) => (
              <WishlistItem
                key={item.id}
                item={item}
                participants={participants}
                onToggleStatus={toggleItemStatus}
                onDelete={deleteItem}
              />
            ))}
          </div>
        </div>
      )}

      {completedItems.length > 0 && (
        <div className="pixel-card">
          <h2 className="pixel-subtitle">✅ Completed Items</h2>
          <div style={{ display: 'grid', gap: '8px' }}>
            {completedItems.map((item) => (
              <WishlistItem
                key={item.id}
                item={item}
                participants={participants}
                onToggleStatus={toggleItemStatus}
                onDelete={deleteItem}
              />
            ))}
          </div>
        </div>
      )}

      {wishlistItems.length === 0 && (
        <div className="pixel-card" style={{ textAlign: 'center' }}>
          <h2 className="pixel-subtitle">No items yet!</h2>
          <p>Add some items to your wishlist to get started.</p>
        </div>
      )}

      <div className="pixel-card">
        <h2 className="pixel-subtitle">How it works</h2>
        <div style={{ display: 'grid', gap: '16px' }}>
          <div style={{ padding: '16px', border: '2px solid var(--primary-color)', borderRadius: 'var(--border-radius)', background: 'var(--light-color)' }}>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-color)' }}>📝 Wishlist</h3>
            <p style={{ margin: 0 }}>Add things you want to eat, buy, or bring on the trip</p>
          </div>
          
          <div style={{ padding: '16px', border: '2px solid var(--secondary-color)', borderRadius: 'var(--border-radius)', background: 'var(--light-color)' }}>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--secondary-color)' }}>🛒 Grocery List</h3>
            <p style={{ margin: 0 }}>Mark items as "grocery" to add them to the shopping list</p>
          </div>
          
          <div style={{ padding: '16px', border: '2px solid var(--success-color)', borderRadius: 'var(--border-radius)', background: 'var(--light-color)' }}>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--success-color)' }}>✅ Completed</h3>
            <p style={{ margin: 0 }}>Check off items when you've got them or done them</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function WishlistItem({ item, participants, onToggleStatus, onDelete }) {
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '20px' }}>{author?.avatar}</span>
          <span style={{ fontWeight: 'bold' }}>{item.text}</span>
        </div>
        <div style={{ fontSize: '14px', color: 'var(--dark-color)' }}>
          Added by {item.author}
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          className={`checkbox ${item.addedToGrocery ? 'checked' : ''}`}
          onClick={() => onToggleStatus(item.id, 'addedToGrocery')}
          title={item.addedToGrocery ? 'Remove from grocery list' : 'Add to grocery list'}
        >
          {item.addedToGrocery && <FiShoppingCart size={12} />}
        </button>
        
        <button
          className="pixel-button"
          onClick={() => onDelete(item.id)}
          style={{ background: 'var(--error-color)', padding: '4px 8px' }}
        >
          <FiTrash2 size={14} />
        </button>
      </div>
    </div>
  )
}

export default Wishlist 