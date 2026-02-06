# Testing Guide for SpendWise - User Story 1

## Overview
This guide explains how to run tests for User Story 1: Log Expense feature.

---

## Backend Tests

### Setup
```bash
cd backend
npm install
```

### Run Tests
```bash
# Run all tests once
npm test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch
```

### Test Coverage
The backend tests verify all acceptance criteria for US01:

**9 Test Cases:**
1. ✅ Create expense with valid item name and amount (AC #1, #2)
2. ✅ Save different types of expenses (AC #1, #2)
3. ✅ Reject empty item name (AC #3)
4. ✅ Reject whitespace-only item name (AC #3)
5. ✅ Trim whitespace from valid names (AC #1)
6. ✅ Reject negative amounts (AC #3)
7. ✅ Reject non-numeric amounts (AC #3)
8. ✅ Reject missing amount field (AC #3)
9. ✅ Accept zero amount for free items (AC #1)
10. ✅ Handle database errors gracefully

**Expected Output:**
```
PASS  __tests__/expenses.test.js
  User Story 1: Log Expense - POST /api/expenses
    Acceptance Criteria #1 & #2: Input fields and save to database
      ✓ should create expense with valid item name and amount
      ✓ should save different types of expenses
    Acceptance Criteria #3: Validation prevents empty names
      ✓ should reject empty item name
      ✓ should reject item name with only whitespace
      ✓ should trim whitespace from valid item names
    Acceptance Criteria #3: Validation prevents negative costs
      ✓ should reject negative amount
      ✓ should reject non-numeric amount
      ✓ should reject missing amount field
      ✓ should accept zero amount (free items)
    Error handling
      ✓ should handle database errors gracefully

Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
```

---

## Frontend Tests

### Setup
```bash
cd frontend
npm install
```

### Run Tests
```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

### Test Coverage
The frontend tests verify UI/UX for US01:

**16 Test Cases:**
1. ✅ Render item name input field (AC #1)
2. ✅ Render amount input field (AC #1)
3. ✅ Render Add Expense button (AC #1)
4. ✅ Allow user to type in input fields (AC #1)
5. ✅ Send POST request with valid data (AC #2)
6. ✅ Display success message after submission (AC #2)
7. ✅ Clear form after successful submission (AC #2)
8. ✅ Show error for empty item name (AC #3)
9. ✅ Show error for negative amount (AC #3)
10. ✅ Show server error messages (AC #3)
11. ✅ Disable button while submitting (UX)
12. ✅ Display SpendWise header (UI)
13. ✅ Display Log Expense heading (UI)
14. ✅ Have proper form structure (UI)

**Expected Output:**
```
✓ src/test/App.test.jsx (16)
   ✓ User Story 1: Log Expense - Frontend UI (16)
     ✓ Acceptance Criteria #1: Input fields (4)
     ✓ Acceptance Criteria #2: Save to database (3)
     ✓ Acceptance Criteria #3: Validation (3)
     ✓ UI/UX Requirements (3)

Test Files  1 passed (1)
     Tests  16 passed (16)
```

---

## CI/CD Pipeline

### What It Does
The GitHub Actions pipeline automatically runs when you:
- Push to `main`, `develop`, or feature branches
- Create pull requests

### Pipeline Stages
1. **Backend Tests** - Runs all 10 backend tests with PostgreSQL
2. **Frontend Tests** - Runs all 16 frontend tests + linting + build
3. **Docker Build** - Verifies both images build successfully
4. **Integration Tests** - Tests full stack with Docker Compose
5. **Status Check** - Confirms all stages passed

### Viewing Results
1. Go to your GitHub repository
2. Click the **Actions** tab
3. Click on the latest workflow run
4. See green ✅ checkmarks for each stage

### Expected Pipeline Output
```
✅ Backend Tests (User Story 1) - 10/10 passed
✅ Frontend Tests (User Story 1) - 16/16 passed
✅ Docker Build Verification - Images built
✅ Integration Tests - API working
✅ All Tests Passed - Ready for Story 2!
```

---

## Understanding the Tests

### What is Jest? (Backend)
Jest is a JavaScript testing framework that makes it easy to write tests.

**Basic Structure:**
```javascript
test('description of what you are testing', async () => {
  // Arrange: Setup test data
  const input = { itemName: 'Lunch', amount: 25.50 };
  
  // Act: Perform the action
  const response = await request(app).post('/api/expenses').send(input);
  
  // Assert: Check the result
  expect(response.status).toBe(201);
});
```

### What is Vitest? (Frontend)
Vitest is Vite's native testing framework, similar to Jest but faster.

**Basic Structure:**
```javascript
test('should render input field', () => {
  // Arrange: Render component
  render(<App />);
  
  // Act & Assert: Find element and check
  const input = screen.getByLabelText(/item name/i);
  expect(input).toBeInTheDocument();
});
```

### Key Testing Concepts
- `describe()` - Groups related tests
- `test()` or `it()` - Individual test case
- `expect()` - Makes assertions
- `beforeEach()` - Setup before each test
- `mock` - Fake version of real dependencies

---

## Troubleshooting

### Backend Tests Fail
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install
npm test
```

### Frontend Tests Fail
```bash
# Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
npm test
```

### Pipeline Fails on GitHub
1. Check Actions tab for detailed logs
2. Common issues:
   - Missing `package-lock.json` - Run `npm install` locally and commit
   - Syntax errors - Run tests locally first
   - Docker issues - Verify Dockerfiles are correct

---

## Definition of Done Checklist

Before marking User Story 1 as complete:

### Testing Requirements ✅
- [ ] All 10 backend tests pass
- [ ] All 16 frontend tests pass
- [ ] CI/CD pipeline shows green ✅
- [ ] Integration tests pass

### Code Quality ✅
- [ ] No console errors or warnings
- [ ] Code follows clean code principles
- [ ] Conventional commit messages used

### Acceptance Criteria ✅
- [ ] AC #1: Input fields for Item Name and Amount
- [ ] AC #2: "Add Expense" button saves to Postgres
- [ ] AC #3: Validation prevents empty names & negative costs

---

## Next Steps

Once all tests pass:
1. ✅ Mark User Story 1 as DONE
2. ✅ Update Sprint 1 documentation
3. ✅ Commit all changes incrementally
4. ✅ Push to GitHub and verify green pipeline
5. ✅ Move to User Story 2: View Expense List

---

## Quick Commands Reference

```bash
# Backend
cd backend && npm test              # Run backend tests
cd backend && npm run test:watch    # Watch mode

# Frontend  
cd frontend && npm test             # Run frontend tests
cd frontend && npm run test:watch   # Watch mode
cd frontend && npm run test:ui      # UI mode

# Both
npm test                            # From root (if configured)

# Docker
docker-compose up                   # Run full stack
docker-compose down -v              # Stop and clean
```
