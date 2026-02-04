import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'spendwise',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

// Test database connection
pool.on('connect', () => {
  console.log('✓ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SpendWise API is running' });
});

// POST /api/expenses - Add new expense
app.post('/api/expenses', async (req, res) => {
  const { itemName, amount } = req.body;

  // Validation
  if (!itemName || itemName.trim() === '') {
    return res.status(400).json({ 
      error: 'Item name is required and cannot be empty' 
    });
  }

  if (amount === undefined || amount === null) {
    return res.status(400).json({ 
      error: 'Amount is required' 
    });
  }

  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount) || numAmount < 0) {
    return res.status(400).json({ 
      error: 'Amount must be a positive number' 
    });
  }

  try {
    const result = await pool.query(
      'INSERT INTO expenses (item_name, amount) VALUES ($1, $2) RETURNING *',
      [itemName.trim(), numAmount]
    );

    res.status(201).json({
      message: 'Expense added successfully',
      expense: result.rows[0]
    });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ 
      error: 'Failed to add expense to database' 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
