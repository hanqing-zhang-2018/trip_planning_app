import { useState, useEffect } from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'

function ExpenseTracker({ participants, currentUser }) {
  const [expenses, setExpenses] = useState([])
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    paidBy: '',
    splitBetween: []
  })

  // Helper function to get trip-group-specific storage key
  const getStorageKey = (baseKey) => {
    const tripGroup = currentUser?.tripGroup || 'default'
    return `${baseKey}_${tripGroup}`
  }

  useEffect(() => {
    const storageKey = getStorageKey('tripExpenses')
    const savedExpenses = localStorage.getItem(storageKey)
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses))
    }
  }, [currentUser?.tripGroup])

  const saveExpenses = (updatedExpenses) => {
    setExpenses(updatedExpenses)
    const storageKey = getStorageKey('tripExpenses')
    localStorage.setItem(storageKey, JSON.stringify(updatedExpenses))
  }

  const addExpense = (e) => {
    e.preventDefault()
    if (newExpense.description && newExpense.amount && newExpense.paidBy && newExpense.splitBetween.length > 0) {
      const expense = {
        id: Date.now(),
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        date: new Date().toISOString(),
        createdById: currentUser.id,
        createdBy: currentUser.name
      }
      saveExpenses([...expenses, expense])
      setNewExpense({
        description: '',
        amount: '',
        paidBy: '',
        splitBetween: []
      })
    }
  }

  const deleteExpense = (expenseId) => {
    const expense = expenses.find(e => e.id === expenseId)
    const canDelete = currentUser.isAdmin || expense.createdById === currentUser.id
    
    if (canDelete && window.confirm('Are you sure you want to delete this expense?')) {
      saveExpenses(expenses.filter(expense => expense.id !== expenseId))
    }
  }

  const toggleParticipantSplit = (participantName) => {
    setNewExpense(prev => ({
      ...prev,
      splitBetween: prev.splitBetween.includes(participantName)
        ? prev.splitBetween.filter(name => name !== participantName)
        : [...prev.splitBetween, participantName]
    }))
  }

  const calculateBalances = () => {
    const balances = {}
    participants.forEach(participant => {
      balances[participant.name] = 0
    })

    expenses.forEach(expense => {
      const amountPerPerson = expense.amount / expense.splitBetween.length
      
      // Add what they paid
      balances[expense.paidBy] += expense.amount
      
      // Subtract what they owe
      expense.splitBetween.forEach(participantName => {
        balances[participantName] -= amountPerPerson
      })
    })

    return balances
  }

  const balances = calculateBalances()

  return (
    <div>
      <h1 className="pixel-title">💰 Expense Tracker</h1>

      <div className="pixel-card">
        <h2 className="pixel-subtitle">Add New Expense</h2>
        <form onSubmit={addExpense}>
          <div style={{ marginBottom: '16px' }}>
            <label className="pixel-subtitle">Description:</label>
            <input
              type="text"
              className="pixel-input"
              value={newExpense.description}
              onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Dinner, Gas, Groceries..."
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="pixel-subtitle">Amount ($):</label>
            <input
              type="number"
              step="0.01"
              className="pixel-input"
              value={newExpense.amount}
              onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="25.50"
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="pixel-subtitle">Paid by:</label>
            <select
              className="pixel-input"
              value={newExpense.paidBy}
              onChange={(e) => setNewExpense(prev => ({ ...prev, paidBy: e.target.value }))}
              required
            >
              <option value="">Select who paid</option>
              {participants.map((participant) => (
                <option key={participant.name} value={participant.name}>
                  {participant.avatar} {participant.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="pixel-subtitle">Split between:</label>
            <div className="participants-grid">
              {participants.map((participant) => (
                <div
                  key={participant.name}
                  className={`avatar-with-name ${newExpense.splitBetween.includes(participant.name) ? 'selected' : ''}`}
                  onClick={() => toggleParticipantSplit(participant.name)}
                  title={`${participant.name} - Click to toggle`}
                >
                  <div className="avatar">{participant.avatar}</div>
                  <div className="name">{participant.name}</div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="pixel-button" disabled={newExpense.splitBetween.length === 0}>
            <FiPlus size={16} style={{ marginRight: '8px' }} />
            Add Expense
          </button>
        </form>
      </div>

      <div className="pixel-card">
        <h2 className="pixel-subtitle">Current Balances</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          {participants.map((participant) => (
            <div
              key={participant.name}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                border: '2px solid var(--dark-color)',
                borderRadius: 'var(--border-radius)',
                background: balances[participant.name] > 0 ? 'var(--success-color)' : 
                           balances[participant.name] < 0 ? 'var(--error-color)' : 'white',
                color: balances[participant.name] !== 0 ? 'white' : 'var(--dark-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>{participant.avatar}</span>
                <span style={{ fontWeight: 'bold' }}>{participant.name}</span>
              </div>
              <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
                ${balances[participant.name].toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pixel-card">
        <h2 className="pixel-subtitle">Expense History</h2>
        {expenses.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No expenses added yet!</p>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {expenses.map((expense) => (
              <div
                key={expense.id}
                style={{
                  padding: '16px',
                  border: '2px solid var(--dark-color)',
                  borderRadius: 'var(--border-radius)',
                  background: 'white'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>{expense.description}</h3>
                    <p style={{ margin: '4px 0', color: 'var(--dark-color)' }}>
                      Paid by: {expense.paidBy} • ${expense.amount.toFixed(2)}
                    </p>
                    <p style={{ margin: '4px 0', fontSize: '12px', color: 'var(--dark-color)' }}>
                      Added by: {expense.createdBy}
                    </p>
                  </div>
                  {(currentUser.isAdmin || expense.createdById === currentUser.id) && (
                    <button
                      className="pixel-button"
                      onClick={() => deleteExpense(expense.id)}
                      style={{ background: 'var(--error-color)', padding: '8px' }}
                      title="Delete expense"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
                
                <div>
                  <span style={{ fontWeight: 'bold' }}>Split between: </span>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    {participants.map((participant) => (
                      <div
                        key={participant.name}
                        className={`avatar-with-name ${expense.splitBetween.includes(participant.name) ? 'selected' : ''}`}
                      >
                        <div className="avatar">{participant.avatar}</div>
                        <div className="name">{participant.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ExpenseTracker 