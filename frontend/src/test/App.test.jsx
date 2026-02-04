import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock fetch globally
global.fetch = vi.fn();

describe('User Story 1: Log Expense - Frontend UI', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    fetch.mockClear();
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

      // Should not call API
      expect(fetch).not.toHaveBeenCalled();
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

      // Should not call API
      expect(fetch).not.toHaveBeenCalled();
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
