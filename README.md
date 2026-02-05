# SpendWise

A containerized web application for tracking daily expenses, built with React, Node.js, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Git

### Running the Application

#### Production Mode
```bash
# Build and start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost
# Backend API: http://localhost:5000
# Database: localhost:5432
```

#### Development Mode (with hot-reloading)
```bash
# Start in development mode
docker-compose -f docker-compose.dev.yml up --build

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000
```

### Stopping the Application
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (deletes database data)
docker-compose down -v
```

## 📁 Project Structure
```
spendwise/
├── backend/              # Node.js Express API
│   ├── index.js         # Main server file
│   ├── init.sql         # Database schema
│   ├── Dockerfile       # Production Docker image
│   ├── Dockerfile.dev   # Development Docker image
│   └── package.json
├── frontend/            # React application
│   ├── src/
│   │   ├── App.jsx     # Main component
│   │   └── App.css     # Styles
│   ├── Dockerfile      # Production Docker image
│   ├── Dockerfile.dev  # Development Docker image
│   └── package.json
├── docs/               # Sprint documentation
│   ├── SPRINT_0.md
│   └── SPRINT_1.md
├── docker-compose.yml      # Production configuration
└── docker-compose.dev.yml  # Development configuration
```

## ✨ Features

### Sprint 1 - Completed ✅

#### User Story 1: Log Expense ✓
- ✅ Input fields for Item Name and Amount
- ✅ "Add Expense" button saves to PostgreSQL database
- ✅ Client-side and server-side validation
- ✅ Prevents empty names and negative amounts
- ✅ Success/error feedback messages
- ✅ Fully containerized with Docker

#### User Story 2: View Expense List ✓
- ✅ Fetches expenses from Node.js API
- ✅ Displays list in chronological order (newest first)
- ✅ Shows empty state when no expenses exist
- ✅ Auto-refreshes after adding expense
- ✅ Professional card layout with hover effects
- ✅ Responsive design for mobile devices

#### User Story 3: View Total Spending ✓
- ✅ Displays total sum of all expenses
- ✅ Backend calculates sum using PostgreSQL aggregation
- ✅ Formatted as GHS currency with 2 decimal places
- ✅ Auto-updates when expenses are added
- ✅ Prominent gradient badge design
- ✅ Only visible when expenses exist

### Sprint 2 - Planned 📋
- 🔲 Filter expenses by date range
- 🔲 Search expenses by item name
- 🔲 Delete expense functionality
- 🔲 Edit existing expenses
- 🔲 Expense categories

*See [docs/SPRINT_2.md](docs/SPRINT_2.md) for detailed planning.*

## 🛠 Technology Stack

- **Frontend:** React 19 + Vite
- **Backend:** Node.js + Express
- **Database:** PostgreSQL 16
- **DevOps:** Docker + Docker Compose
- **CI/CD:** GitHub Actions (to be configured)

## 📝 API Endpoints

### POST /api/expenses
Add a new expense.

**Request Body:**
```json
{
  "itemName": "Lunch",
  "amount": 25.50
}
```

**Response (201 Created):**
```json
{
  "message": "Expense added successfully",
  "expense": {
    "id": 1,
    "item_name": "Lunch",
    "amount": "25.50",
    "created_at": "2026-02-04T10:30:00.000Z"
  }
}
```

**Validation Errors (400 Bad Request):**
```json
{
  "error": "Item name is required and cannot be empty"
}
```
```json
{
  "error": "Amount must be a positive number"
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "SpendWise API is running"
}
```

### GET /api/expenses
Fetch all expenses in chronological order.

**Response (200 OK):**
```json
{
  "expenses": [
    {
      "id": 2,
      "item_name": "Dinner",
      "amount": "35.00",
      "created_at": "2026-02-05T18:00:00.000Z"
    },
    {
      "id": 1,
      "item_name": "Lunch",
      "amount": "25.50",
      "created_at": "2026-02-04T10:30:00.000Z"
    }
  ]
}
```

**Notes:**
- Returns expenses ordered by `created_at DESC` (newest first)
- Returns empty array if no expenses exist

### GET /api/expenses/total
Calculate total spending.

**Response (200 OK):**
```json
{
  "total": 60.50
}
```

**Notes:**
- Returns 0 if no expenses exist
- Uses PostgreSQL SUM aggregation for accuracy

## 🔧 Development

### Local Development (without Docker)

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Backend `.env`:
```
PORT=5000
DB_HOST=postgres
DB_PORT=5432
DB_NAME=spendwise
DB_USER=postgres
DB_PASSWORD=postgres123
```

## 📊 Database Schema

```sql
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  item_name VARCHAR(255) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_expenses_created_at ON expenses(created_at DESC);
```

**Schema Details:**
- `id`: Auto-incrementing primary key
- `item_name`: Expense description (required, max 255 chars)
- `amount`: Expense amount (required, must be >= 0, 2 decimal places)
- `created_at`: Timestamp of expense creation (auto-generated)
- Index on `created_at` for optimized chronological queries

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

**Test Coverage:**
- ✅ 20 tests passing
- User Story 1: 10 tests (validation, persistence, error handling)
- User Story 2: 5 tests (fetch, ordering, empty state)
- User Story 3: 5 tests (sum calculation, accuracy, decimals)

### Frontend Tests
```bash
cd frontend
npm test
```

**Test Coverage:**
- ✅ 29 tests passing
- User Story 1: 14 tests (UI rendering, validation, submission)
- User Story 2: 9 tests (list display, integration, empty state)
- User Story 3: 6 tests (total display, formatting, auto-update)

### Total Test Coverage
- ✅ **49 automated tests** (100% passing)
- Backend: Jest + Supertest
- Frontend: Vitest + React Testing Library

*See [TESTING.md](TESTING.md) for detailed test documentation.*

## 🎯 Definition of Done

A feature is considered "Done" when:
- ✅ All acceptance criteria are met
- ✅ Code follows clean code principles
- ✅ Input validation implemented (client & server)
- ✅ Backend and frontend tests written and passing
- ✅ Works in Docker containers
- ✅ CI/CD pipeline passes all checks
- ✅ Committed with conventional commit messages
- ✅ No dead code or debug statements
- ✅ Documentation updated

## 📅 Sprint Progress

- **Sprint 0:** Project setup and planning ✅
- **Sprint 1:** Core expense tracking features ✅ **COMPLETED**
  - US01: Log Expense ✅
  - US02: View Expense List ✅
  - US03: View Total Spending ✅
  - **Velocity:** 6 story points
  - **Tests:** 49/49 passing
  - **Documentation:** Complete with screenshots
- **Sprint 2:** Enhanced features 📋 **PLANNING**
  - US04: Filter by Date Range
  - US05: Search by Name
  - US06: Delete Expense
  - US07: Edit Expense
  - US08: Expense Categories

*See [docs/SPRINT_1.md](docs/SPRINT_1.md) for Sprint 1 detailed report.*
*See [docs/SPRINT_2.md](docs/SPRINT_2.md) for Sprint 2 planning.*

## 🚀 CI/CD Pipeline

GitHub Actions workflow automatically runs on every push and pull request:

1. **Backend Tests** - Jest tests with PostgreSQL service
2. **Frontend Tests** - Vitest tests with coverage
3. **Frontend Linting** - ESLint code quality checks
4. **Docker Build** - Verify all images build successfully
5. **Integration Tests** - Full stack testing with Docker Compose
6. **Status Check** - Final verification

**Current Status:** ✅ All pipeline stages passing

*See [.github/workflows/ci.yml](.github/workflows/ci.yml) for pipeline configuration.*

## 👥 Contributors

- Joel Livingstone Kofi Ackah

## 📄 License

This project is part of the AmaliTech Agile & DevOps training program.
