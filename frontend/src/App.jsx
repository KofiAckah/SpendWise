import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [itemName, setItemName] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [expenses, setExpenses] = useState([])
  const [fetchError, setFetchError] = useState('')
  const [totalSpending, setTotalSpending] = useState(0)

  // Fetch expenses on component mount
  useEffect(() => {
    fetchExpenses()
    fetchTotal()
  }, [])

  const fetchExpenses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/expenses')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch expenses')
      }

      setExpenses(data.expenses)
      setFetchError('')
    } catch (err) {
      setFetchError(err.message || 'Failed to load expenses')
    }
  }

  const fetchTotal = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/expenses/total')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch total')
      }

      setTotalSpending(data.total)
    } catch (err) {
      console.error('Failed to fetch total spending:', err)
    }
  }

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
      
      // Refresh expense list and total
      fetchExpenses()
      fetchTotal()
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'Failed to add expense')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAmount = (amount) => {
    return parseFloat(amount).toFixed(2)
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

        <div className="expense-list-container">
          <h2>Expense History</h2>
          
          {fetchError && (
            <div className="error-message">{fetchError}</div>
          )}

          {!fetchError && expenses.length === 0 && (
            <div className="empty-state">
              <p>No expenses yet. Start tracking your spending!</p>
            </div>
          )}

          {!fetchError && expenses.length > 0 && (
            <>
              <div className="total-spending">
                <span className="total-label">Total Spending</span>
                <span className="total-amount">GHS {formatAmount(totalSpending)}</span>
              </div>

              <div className="expense-list">
                {expenses.map((expense) => (
                  <div key={expense.id} className="expense-item">
                    <div className="expense-info">
                      <span className="expense-name">{expense.item_name}</span>
                      <span className="expense-date">{formatDate(expense.created_at)}</span>
                    </div>
                    <div className="expense-amount">
                      GHS {formatAmount(expense.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
