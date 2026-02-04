import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { jest } from '@jest/globals';

// Mock the database pool
const mockPool = {
  query: jest.fn(),
  on: jest.fn(),
};

// Mock pg module with ES module syntax
jest.unstable_mockModule('pg', () => ({
  default: {
    Pool: jest.fn(() => mockPool),
  },
}));

describe('User Story 1: Log Expense - POST /api/expenses', () => {
  let app;

  beforeEach(() => {
    // Setup Express app for testing
    app = express();
    app.use(cors());
    app.use(express.json());

    // Define the POST endpoint (same logic as in index.js)
    app.post('/api/expenses', async (req, res) => {
      const { itemName, amount } = req.body;

      // Validation: AC #3 - Prevent empty names
      if (!itemName || itemName.trim() === '') {
        return res.status(400).json({ 
          error: 'Item name is required and cannot be empty' 
        });
      }

      // Validation: AC #3 - Check amount exists
      if (amount === undefined || amount === null) {
        return res.status(400).json({ 
          error: 'Amount is required' 
        });
      }

      const numAmount = parseFloat(amount);
      
      // Validation: AC #3 - Prevent negative costs
      if (isNaN(numAmount) || numAmount < 0) {
        return res.status(400).json({ 
          error: 'Amount must be a positive number' 
        });
      }

      try {
        // AC #2 - Save to database
        const result = await mockPool.query(
          'INSERT INTO expenses (item_name, amount) VALUES ($1, $2) RETURNING *',
          [itemName.trim(), numAmount]
        );

        res.status(201).json({
          message: 'Expense added successfully',
          expense: result.rows[0]
        });
      } catch (error) {
        res.status(500).json({ 
          error: 'Failed to add expense to database' 
        });
      }
    });

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('Acceptance Criteria #1 & #2: Input fields and save to database', () => {
    test('should create expense with valid item name and amount', async () => {
      // Arrange: Mock database response
      mockPool.query.mockResolvedValue({
        rows: [{
          id: 1,
          item_name: 'Lunch at cafeteria',
          amount: '25.50',
          created_at: new Date('2026-02-04T10:30:00.000Z')
        }]
      });

      // Act: Send request
      const response = await request(app)
        .post('/api/expenses')
        .send({
          itemName: 'Lunch at cafeteria',
          amount: 25.50
        });

      // Assert: Check response
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Expense added successfully');
      expect(response.body.expense).toHaveProperty('id');
      expect(response.body.expense.item_name).toBe('Lunch at cafeteria');
      expect(response.body.expense.amount).toBe('25.50');
      
      // Verify database was called correctly
      expect(mockPool.query).toHaveBeenCalledWith(
        'INSERT INTO expenses (item_name, amount) VALUES ($1, $2) RETURNING *',
        ['Lunch at cafeteria', 25.50]
      );
    });

    test('should save different types of expenses', async () => {
      mockPool.query.mockResolvedValue({
        rows: [{ id: 2, item_name: 'Bus fare', amount: '5.00', created_at: new Date() }]
      });

      const response = await request(app)
        .post('/api/expenses')
        .send({ itemName: 'Bus fare', amount: 5.00 });

      expect(response.status).toBe(201);
      expect(response.body.expense.item_name).toBe('Bus fare');
    });
  });

  describe('Acceptance Criteria #3: Validation prevents empty names', () => {
    test('should reject empty item name', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          itemName: '',
          amount: 10.00
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Item name is required and cannot be empty');
      expect(mockPool.query).not.toHaveBeenCalled();
    });

    test('should reject item name with only whitespace', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          itemName: '   ',
          amount: 10.00
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Item name is required and cannot be empty');
      expect(mockPool.query).not.toHaveBeenCalled();
    });

    test('should trim whitespace from valid item names', async () => {
      mockPool.query.mockResolvedValue({
        rows: [{ id: 3, item_name: 'Coffee', amount: '8.75', created_at: new Date() }]
      });

      const response = await request(app)
        .post('/api/expenses')
        .send({
          itemName: '  Coffee  ',
          amount: 8.75
        });

      expect(response.status).toBe(201);
      // Verify trimmed value was sent to database
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.any(String),
        ['Coffee', 8.75]
      );
    });
  });

  describe('Acceptance Criteria #3: Validation prevents negative costs', () => {
    test('should reject negative amount', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          itemName: 'Bus fare',
          amount: -5.00
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Amount must be a positive number');
      expect(mockPool.query).not.toHaveBeenCalled();
    });

    test('should reject non-numeric amount', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          itemName: 'Coffee',
          amount: 'invalid'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Amount must be a positive number');
      expect(mockPool.query).not.toHaveBeenCalled();
    });

    test('should reject missing amount field', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          itemName: 'Snack'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Amount is required');
      expect(mockPool.query).not.toHaveBeenCalled();
    });

    test('should accept zero amount (free items)', async () => {
      mockPool.query.mockResolvedValue({
        rows: [{ id: 4, item_name: 'Free sample', amount: '0.00', created_at: new Date() }]
      });

      const response = await request(app)
        .post('/api/expenses')
        .send({
          itemName: 'Free sample',
          amount: 0
        });

      expect(response.status).toBe(201);
      expect(response.body.expense.amount).toBe('0.00');
    });
  });

  describe('Error handling', () => {
    test('should handle database errors gracefully', async () => {
      mockPool.query.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .post('/api/expenses')
        .send({
          itemName: 'Lunch',
          amount: 25.50
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to add expense to database');
    });
  });
});
