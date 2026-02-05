import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock fetch globally
globalThis.fetch = vi.fn();

describe('User Story 1: Log Expense - Frontend UI', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    fetch.mockClear();

    // Mock the initial GET /api/expenses call that happens on mount
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ expenses: [] })
    });
    
    // Mock the initial GET /api/expenses/total call that happens on mount
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ total: 0 })
    });
  });

  describe('Acceptance Criteria #1: Input fields for Item Name and Amount', () => {
    test('should render item name input field', () => {
      render(<App />);
      
      const itemNameInput = screen.getByLabelText(/item name/i);
      expect(itemNameInput).toBeInTheDocument();
      expect(itemNameInput).toHaveAttribute('type', 'text');
      expect(itemNameInput).toHaveAttribute('placeholder');
    });

    test('should render amount input field', () => {
      render(<App />);
      
      const amountInput = screen.getByLabelText(/amount/i);
      expect(amountInput).toBeInTheDocument();
      expect(amountInput).toHaveAttribute('type', 'number');
      expect(amountInput).toHaveAttribute('step', '0.01');
      expect(amountInput).toHaveAttribute('min', '0');
    });

    test('should render Add Expense button', () => {
      render(<App />);
      
      const button = screen.getByRole('button', { name: /add expense/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'submit');
    });

    test('should allow user to type in input fields', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const itemNameInput = screen.getByLabelText(/item name/i);
      const amountInput = screen.getByLabelText(/amount/i);

      await user.type(itemNameInput, 'Lunch');
      await user.type(amountInput, '25.50');

      expect(itemNameInput).toHaveValue('Lunch');
      expect(amountInput).toHaveValue(25.50);
    });
  });

  describe('Acceptance Criteria #2: Add Expense button saves to database', () => {
    test('should send POST request with valid data when form is submitted', async () => {
      const user = userEvent.setup();
      
      // Mock successful API response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: 'Expense added successfully',
          expense: {
            id: 1,
            item_name: 'Lunch',
            amount: '25.50',
            created_at: new Date().toISOString()
          }
        })
      });

      render(<App />);
      
      const itemNameInput = screen.getByLabelText(/item name/i);
      const amountInput = screen.getByLabelText(/amount/i);
      const submitButton = screen.getByRole('button', { name: /add expense/i });

      // Fill form
      await user.type(itemNameInput, 'Lunch');
      await user.type(amountInput, '25.50');
      
      // Submit
      await user.click(submitButton);

      // Verify API was called
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/expenses',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            itemName: 'Lunch',
            amount: 25.50,
          })
        })
      );
    });

    test('should display success message after successful submission', async () => {
      const user = userEvent.setup();
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: 'Expense added successfully',
          expense: { id: 1, item_name: 'Coffee', amount: '5.00' }
        })
      });

      render(<App />);
      
      await user.type(screen.getByLabelText(/item name/i), 'Coffee');
      await user.type(screen.getByLabelText(/amount/i), '5.00');
      await user.click(screen.getByRole('button', { name: /add expense/i }));

      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText(/expense added successfully/i)).toBeInTheDocument();
      });
    });

    test('should clear form inputs after successful submission', async () => {
      const user = userEvent.setup();
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Expense added successfully', expense: {} })
      });

      render(<App />);
      
      const itemNameInput = screen.getByLabelText(/item name/i);
      const amountInput = screen.getByLabelText(/amount/i);

      await user.type(itemNameInput, 'Snack');
      await user.type(amountInput, '3.50');
      await user.click(screen.getByRole('button', { name: /add expense/i }));

      // Wait for form to clear
      await waitFor(() => {
        expect(itemNameInput).toHaveValue('');
        expect(amountInput).toHaveValue(null);
      });
    });
  });

  describe('Acceptance Criteria #3: Validation prevents empty names and negative costs', () => {
    test('should show error for empty item name', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const amountInput = screen.getByLabelText(/amount/i);
      const submitButton = screen.getByRole('button', { name: /add expense/i });

      // Only fill amount, leave name empty
      await user.type(amountInput, '10.00');
      await user.click(submitButton);

      // Check for validation error
      await waitFor(() => {
        expect(screen.getByText(/item name cannot be empty/i)).toBeInTheDocument();
      });

      // Should not call POST API (only the initial GET calls from mount)
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/expenses');
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/expenses/total');
    });

    test('should show error for negative amount', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const itemNameInput = screen.getByLabelText(/item name/i);
      const amountInput = screen.getByLabelText(/amount/i);
      const submitButton = screen.getByRole('button', { name: /add expense/i });

      await user.type(itemNameInput, 'Invalid expense');
      
      // Remove min attribute temporarily to allow negative input
      amountInput.removeAttribute('min');
      await user.clear(amountInput);
      await user.type(amountInput, '-5');
      
      await user.click(submitButton);

      // Check for validation error
      await waitFor(() => {
        expect(screen.getByText(/amount must be a positive number/i)).toBeInTheDocument();
      });

      // Should not call POST API (only the initial GET calls from mount)
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/expenses');
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/expenses/total');
    });

    test('should show error message from server when API fails', async () => {
      const user = userEvent.setup();
      
      // Mock API error response
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: 'Item name is required and cannot be empty'
        })
      });

      render(<App />);
      
      await user.type(screen.getByLabelText(/item name/i), 'Valid name');
      await user.type(screen.getByLabelText(/amount/i), '10.00');
      await user.click(screen.getByRole('button', { name: /add expense/i }));

      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText(/item name is required/i)).toBeInTheDocument();
      });
    });

    test('should disable submit button while submitting', async () => {
      const user = userEvent.setup();
      
      // Mock slow API response
      fetch.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => ({ message: 'Success', expense: {} })
        }), 100))
      );

      render(<App />);
      
      await user.type(screen.getByLabelText(/item name/i), 'Test');
      await user.type(screen.getByLabelText(/amount/i), '5.00');
      
      const submitButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(submitButton);

      // Button should be disabled during submission
      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/adding/i)).toBeInTheDocument();
    });
  });

  describe('UI/UX Requirements', () => {
    test('should display SpendWise header', () => {
      render(<App />);
      expect(screen.getByRole('heading', { name: /spendwise/i })).toBeInTheDocument();
    });

    test('should display Log Expense section heading', () => {
      render(<App />);
      expect(screen.getByRole('heading', { name: /log expense/i })).toBeInTheDocument();
    });

    test('should have proper form structure', () => {
      render(<App />);
      
      const form = screen.getByRole('button', { name: /add expense/i }).closest('form');
      expect(form).toBeInTheDocument();
    });
  });
});

describe('User Story 2: View Expense List - Frontend UI', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    fetch.mockClear();
    
    // Note: Each test will mock fetch responses as needed
    // since different tests require different mock data
  });

  describe('Acceptance Criteria #1: Fetches data from Node.js API', () => {
    test('should fetch expenses on component mount', async () => {
      const mockExpenses = [
        {
          id: 1,
          item_name: 'Lunch',
          amount: '25.50',
          created_at: '2026-02-05T12:00:00Z'
        },
        {
          id: 2,
          item_name: 'Coffee',
          amount: '5.00',
          created_at: '2026-02-05T09:00:00Z'
        }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ expenses: mockExpenses })
      });
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total: 30.50 })
      });

      render(<App />);

      // Verify fetch was called
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/expenses');
      });
    });

    test('should display fetched expenses', async () => {
      const mockExpenses = [
        {
          id: 1,
          item_name: 'Lunch',
          amount: '25.50',
          created_at: '2026-02-05T12:00:00Z'
        },
        {
          id: 2,
          item_name: 'Coffee',
          amount: '5.00',
          created_at: '2026-02-05T09:00:00Z'
        }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ expenses: mockExpenses })
      });
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total: 30.50 })
      });

      render(<App />);

      // Wait for expenses to be displayed
      await waitFor(() => {
        expect(screen.getByText('Lunch')).toBeInTheDocument();
        expect(screen.getByText('Coffee')).toBeInTheDocument();
      });

      // Verify amounts are displayed
      expect(screen.getByText(/25\.50/)).toBeInTheDocument();
      expect(screen.getByText(/5\.00/)).toBeInTheDocument();
    });
  });

  describe('Acceptance Criteria #2: Displays list in chronological order', () => {
    test('should display expenses in order by created_at DESC', async () => {
      const mockExpenses = [
        {
          id: 3,
          item_name: 'Dinner',
          amount: '45.00',
          created_at: '2026-02-05T18:00:00Z'
        },
        {
          id: 2,
          item_name: 'Lunch',
          amount: '25.50',
          created_at: '2026-02-05T12:00:00Z'
        },
        {
          id: 1,
          item_name: 'Breakfast',
          amount: '15.00',
          created_at: '2026-02-05T08:00:00Z'
        }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ expenses: mockExpenses })
      });
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total: 85.50 })
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Dinner')).toBeInTheDocument();
      });

      // Get all expense items
      const expenseItems = screen.getAllByText(/Dinner|Lunch|Breakfast/);
      
      // Verify order (newest first)
      expect(expenseItems[0]).toHaveTextContent('Dinner');
      expect(expenseItems[1]).toHaveTextContent('Lunch');
      expect(expenseItems[2]).toHaveTextContent('Breakfast');
    });
  });

  describe('Acceptance Criteria #3: Shows "No expenses" if empty', () => {
    test('should display empty state message when no expenses', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ expenses: [] })
      });
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total: 0 })
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/no expenses yet/i)).toBeInTheDocument();
      });
    });

    test('should display helpful message in empty state', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ expenses: [] })
      });
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total: 0 })
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/start tracking your spending/i)).toBeInTheDocument();
      });
    });
  });

  describe('UI/UX Requirements', () => {
    test('should display Expense History heading', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ expenses: [] })
      });
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total: 0 })
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /expense history/i })).toBeInTheDocument();
      });
    });

    test('should display expense with proper formatting', async () => {
      const mockExpenses = [
        {
          id: 1,
          item_name: 'Test Item',
          amount: '10.5',
          created_at: '2026-02-05T12:00:00Z'
        }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ expenses: mockExpenses })
      });
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total: 10.50 })
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Test Item')).toBeInTheDocument();
      });
      
      // Find the expense item (not the total)
      const expenseItems = screen.getAllByText(/GHS 10\.50/);
      // Should have total + expense item = 2 occurrences
      expect(expenseItems.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Integration with Add Expense', () => {
    test('should refresh expense list after adding new expense', async () => {
      const user = userEvent.setup();

      // Mock initial empty fetch
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ expenses: [] })
      });
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total: 0 })
      });

      render(<App />);

      // Wait for initial fetch
      await waitFor(() => {
        expect(screen.getByText(/no expenses yet/i)).toBeInTheDocument();
      });

      // Mock POST response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: 'Expense added successfully',
          expense: { id: 1, item_name: 'New Item', amount: '20.00' }
        })
      });

      // Mock GET response after adding
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          expenses: [{
            id: 1,
            item_name: 'New Item',
            amount: '20.00',
            created_at: '2026-02-05T12:00:00Z'
          }]
        })
      });
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total: 20.00 })
      });

      // Add expense
      await user.type(screen.getByLabelText(/item name/i), 'New Item');
      await user.type(screen.getByLabelText(/amount/i), '20.00');
      await user.click(screen.getByRole('button', { name: /add expense/i }));

      // Verify list is refreshed
      await waitFor(() => {
        expect(screen.getByText('New Item')).toBeInTheDocument();
      });

      // Empty state should no longer be visible
      expect(screen.queryByText(/no expenses yet/i)).not.toBeInTheDocument();
    });
  });

  describe('Error handling', () => {
    test('should display error message when fetch fails', async () => {
      globalThis.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ error: 'Failed to fetch expenses' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ total: 0 })
        });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/failed to fetch expenses/i)).toBeInTheDocument();
      });
    });
  });

  // User Story 3: View Total Spending
  describe('User Story 3: View Total Spending', () => {
    test('AC #1 & #2: should display total spending when expenses exist', async () => {
      globalThis.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            expenses: [
              { id: 1, item_name: 'Lunch', amount: '25.50', created_at: '2026-02-04T10:00:00Z' },
              { id: 2, item_name: 'Bus', amount: '5.00', created_at: '2026-02-04T11:00:00Z' }
            ]
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ total: 30.50 })
        });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/total spending/i)).toBeInTheDocument();
      });
      
      const totalSection = screen.getByText(/total spending/i).parentElement;
      expect(totalSection).toHaveTextContent('GHS 30.50');
    });

    test('AC #3: should format total as GHS currency with 2 decimal places', async () => {
      globalThis.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            expenses: [
              { id: 1, item_name: 'Item', amount: '99.99', created_at: '2026-02-04T10:00:00Z' }
            ]
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ total: 99.99 })
        });

      render(<App />);

      await waitFor(() => {
        const totalSection = screen.getByText(/total spending/i).parentElement;
        expect(totalSection).toHaveTextContent('GHS 99.99');
      });
    });

    test('should not display total when no expenses exist', async () => {
      globalThis.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ expenses: [] })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ total: 0 })
        });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/no expenses yet/i)).toBeInTheDocument();
      });

      expect(screen.queryByText(/total spending/i)).not.toBeInTheDocument();
    });

    test('AC #1: should update total when new expense is added', async () => {
      const user = userEvent.setup();

      globalThis.fetch = vi.fn()
        // Initial fetch expenses
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            expenses: [
              { id: 1, item_name: 'Existing', amount: '10.00', created_at: '2026-02-04T10:00:00Z' }
            ]
          })
        })
        // Initial fetch total
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ total: 10.00 })
        })
        // POST new expense
        .mockResolvedValueOnce({
          ok: true,
          status: 201,
          json: async () => ({
            message: 'Expense added successfully',
            expense: { id: 2, item_name: 'New Item', amount: 20.00, created_at: new Date().toISOString() }
          })
        })
        // Fetch expenses after POST
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            expenses: [
              { id: 2, item_name: 'New Item', amount: '20.00', created_at: '2026-02-04T11:00:00Z' },
              { id: 1, item_name: 'Existing', amount: '10.00', created_at: '2026-02-04T10:00:00Z' }
            ]
          })
        })
        // Fetch updated total
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ total: 30.00 })
        });

      render(<App />);

      // Wait for initial render
      await waitFor(() => {
        const totalSection = screen.getByText(/total spending/i).parentElement;
        expect(totalSection).toHaveTextContent('GHS 10.00');
      });

      // Add new expense
      await user.type(screen.getByLabelText(/item name/i), 'New Item');
      await user.type(screen.getByLabelText(/amount/i), '20.00');
      await user.click(screen.getByRole('button', { name: /add expense/i }));

      // Wait for updated total
      await waitFor(() => {
        const totalSection = screen.getByText(/total spending/i).parentElement;
        expect(totalSection).toHaveTextContent('GHS 30.00');
      });
    });

    test('AC #2: should handle large totals correctly', async () => {
      globalThis.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            expenses: [
              { id: 1, item_name: 'Big Purchase', amount: '1500.75', created_at: '2026-02-04T10:00:00Z' }
            ]
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ total: 1500.75 })
        });

      render(<App />);

      await waitFor(() => {
        const totalSection = screen.getByText(/total spending/i).parentElement;
        expect(totalSection).toHaveTextContent('GHS 1500.75');
      });
    });

    test('should handle fetch total error gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      globalThis.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            expenses: [
              { id: 1, item_name: 'Item', amount: '10.00', created_at: '2026-02-04T10:00:00Z' }
            ]
          })
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ error: 'Failed to fetch total' })
        });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Item')).toBeInTheDocument();
      });

      // Total should still display with default 0 value
      await waitFor(() => {
        expect(screen.getByText(/total spending/i)).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });
  });
});

describe('User Story 4: Delete Expense - Frontend UI', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    fetch.mockClear();

    // Mock window.confirm
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  describe('Acceptance Criteria #1: Visible Delete button for each list item', () => {
    test('should render delete button for each expense', async () => {
      // Mock GET /api/expenses with expenses
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          expenses: [
            { id: 1, item_name: 'Lunch', amount: '25.50', created_at: new Date().toISOString() },
            { id: 2, item_name: 'Bus fare', amount: '5.00', created_at: new Date().toISOString() }
          ]
        })
      });

      // Mock GET /api/expenses/total
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total: 30.50 })
      });

      render(<App />);

      // Wait for expenses to load
      await waitFor(() => {
        expect(screen.getByText('Lunch')).toBeInTheDocument();
      });

      // Check delete buttons exist
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      expect(deleteButtons).toHaveLength(2);
      expect(deleteButtons[0]).toHaveTextContent('🗑️');
    });

    test('should have accessible label for delete button', async () => {
      // Mock GET /api/expenses with one expense
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          expenses: [
            { id: 1, item_name: 'Lunch', amount: '25.50', created_at: new Date().toISOString() }
          ]
        })
      });

      // Mock GET /api/expenses/total
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total: 25.50 })
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Lunch')).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole('button', { name: /delete lunch/i });
      expect(deleteButton).toBeInTheDocument();
    });
  });

  describe('Acceptance Criteria #2: Clicking removes record from database', () => {
    test('should show confirmation dialog before deleting', async () => {
      const user = userEvent.setup();

      // Mock GET /api/expenses
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          expenses: [
            { id: 1, item_name: 'Lunch', amount: '25.50', created_at: new Date().toISOString() }
          ]
        })
      });

      // Mock GET /api/expenses/total
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total: 25.50 })
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Lunch')).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole('button', { name: /delete lunch/i });
      await user.click(deleteButton);

      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this expense?');
    });

    test('should send DELETE request when delete button is clicked and confirmed', async () => {
      const user = userEvent.setup();

      // Mock GET /api/expenses
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          expenses: [
            { id: 1, item_name: 'Lunch', amount: '25.50', created_at: new Date().toISOString() }
          ]
        })
      });

      // Mock GET /api/expenses/total
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total: 25.50 })
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Lunch')).toBeInTheDocument();
      });

      // Mock DELETE /api/expenses/1
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: 'Expense deleted successfully',
          id: 1
        })
      });

      // Mock refreshed GET /api/expenses (empty list)
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ expenses: [] })
      });

      // Mock refreshed GET /api/expenses/total
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total: 0 })
      });

      const deleteButton = screen.getByRole('button', { name: /delete lunch/i });
      await user.click(deleteButton);

      // Verify DELETE request was sent
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:5000/api/expenses/1',
          { method: 'DELETE' }
        );
      });
    });

    test('should not delete if user cancels confirmation', async () => {
      const user = userEvent.setup();
      
      // Mock user canceling
      window.confirm.mockReturnValueOnce(false);

      // Mock GET /api/expenses
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          expenses: [
            { id: 1, item_name: 'Lunch', amount: '25.50', created_at: new Date().toISOString() }
          ]
        })
      });

      // Mock GET /api/expenses/total
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total: 25.50 })
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Lunch')).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole('button', { name: /delete lunch/i });
      const initialFetchCount = fetch.mock.calls.length;
      
      await user.click(deleteButton);

      // Verify no additional fetch calls were made
      expect(fetch).toHaveBeenCalledTimes(initialFetchCount);
    });
  });

  describe('Acceptance Criteria #3: Total spending updates immediately', () => {
    test('should refresh both expense list and total after deletion', async () => {
      const user = userEvent.setup();

      // Mock initial GET /api/expenses with two expenses
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          expenses: [
            { id: 1, item_name: 'Lunch', amount: '25.50', created_at: new Date().toISOString() },
            { id: 2, item_name: 'Bus fare', amount: '5.00', created_at: new Date().toISOString() }
          ]
        })
      });

      // Mock initial GET /api/expenses/total
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total: 30.50 })
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Lunch')).toBeInTheDocument();
        expect(screen.getByText(/GHS 30.50/)).toBeInTheDocument();
      });

      // Mock DELETE /api/expenses/1
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: 'Expense deleted successfully',
          id: 1
        })
      });

      // Mock refreshed GET /api/expenses (one expense remaining)
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          expenses: [
            { id: 2, item_name: 'Bus fare', amount: '5.00', created_at: new Date().toISOString() }
          ]
        })
      });

      // Mock refreshed GET /api/expenses/total
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total: 5.00 })
      });

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);

      // Verify list updated
      await waitFor(() => {
        expect(screen.queryByText('Lunch')).not.toBeInTheDocument();
        expect(screen.getByText('Bus fare')).toBeInTheDocument();
      });

      // Verify total updated to 5.00 (remaining expense)
      await waitFor(() => {
        const totalElements = screen.getAllByText(/GHS 5\.00/);
        expect(totalElements.length).toBeGreaterThan(0);
      });
    });

    test('should show success message after deletion', async () => {
      const user = userEvent.setup();

      // Mock GET /api/expenses
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          expenses: [
            { id: 1, item_name: 'Lunch', amount: '25.50', created_at: new Date().toISOString() }
          ]
        })
      });

      // Mock GET /api/expenses/total
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total: 25.50 })
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Lunch')).toBeInTheDocument();
      });

      // Mock DELETE success
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: 'Expense deleted successfully',
          id: 1
        })
      });

      // Mock refreshed data
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ expenses: [] })
      });

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total: 0 })
      });

      const deleteButton = screen.getByRole('button', { name: /delete lunch/i });
      await user.click(deleteButton);

      // Verify success message appears
      await waitFor(() => {
        expect(screen.getByText(/expense deleted successfully/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error handling', () => {
    test('should display error message if deletion fails', async () => {
      const user = userEvent.setup();

      // Mock GET /api/expenses
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          expenses: [
            { id: 1, item_name: 'Lunch', amount: '25.50', created_at: new Date().toISOString() }
          ]
        })
      });

      // Mock GET /api/expenses/total
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total: 25.50 })
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Lunch')).toBeInTheDocument();
      });

      // Mock DELETE failure
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: 'Expense not found'
        })
      });

      const deleteButton = screen.getByRole('button', { name: /delete lunch/i });
      await user.click(deleteButton);

      // Verify error message appears
      await waitFor(() => {
        expect(screen.getByText(/expense not found/i)).toBeInTheDocument();
      });
    });
  });

  afterEach(() => {
    window.confirm.mockRestore();
  });
});
