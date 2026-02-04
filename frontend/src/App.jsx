import { useState } from 'react'
import './App.css'

function App() {
  const [itemName, setItemName] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Client-side validation
    if (!itemName.trim()) {
      setError('Item name cannot be empty')
      return
    }

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount < 0) {
      setError('Amount must be a positive number')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemName: itemName.trim(),
          amount: numAmount,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add expense')
      }

      setSuccess('✓ Expense added successfully!')
      setItemName('')
      setAmount('')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'Failed to add expense')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>💰 SpendWise</h1>
        <p>Track your daily expenses</p>
      </header>

      <main className="main-content">
        <div className="expense-form-container">
          <h2>Log Expense</h2>
          
          <form onSubmit={handleSubmit} className="expense-form">
            <div className="form-group">
              <label htmlFor="itemName">Item Name</label>
              <input
                type="text"
                id="itemName"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g., Lunch, Bus fare"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount (GHS)</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                disabled={loading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Expense'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default App
