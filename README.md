# SpendWise

A containerized web application for tracking daily expenses, built with React, Node.js, and PostgreSQL.

## Project Summary

**SpendWise** is a full-stack expense tracking web application developed using Agile methodology with complete DevOps practices. The project was completed over two sprints, delivering five user stories with 104 automated tests and achieving 100% completion rate.

### Key Achievements
- **Development:** React 19 frontend, Node.js/Express backend, PostgreSQL 16 database
- **Testing:** 104 automated tests (37 backend Jest tests, 67 frontend Vitest tests)
- **DevOps:** Fully containerized with Docker Compose, CI/CD pipeline with GitHub Actions
- **Monitoring:** Morgan HTTP request logging for production observability
- **Agile:** Two successful sprints (6 and 7 story points), comprehensive retrospectives
- **Documentation:** Complete sprint documentation with screenshots and metrics

### Features Delivered
1. **Log Expense** - Add expenses with validation and persistent storage
2. **View Expense List** - Display expenses chronologically with real-time updates
3. **View Total Spending** - Calculate and display total with currency formatting
4. **Delete Expense** - Remove expenses with confirmation dialog
5. **Filter by Category** - Organize and filter expenses by six categories

### Technical Highlights
- Production-ready Docker containerization with separate dev/prod configurations
- Comprehensive API with CRUD operations and query parameter filtering
- Database indexing for optimized queries (created_at and category)
- Client and server-side validation with proper error handling
- Responsive UI with professional design and user feedback
- CI/CD pipeline with automated testing, linting, and Docker builds

For detailed sprint documentation, see [docs/SPRINT_1.md](docs/SPRINT_1.md) and [docs/SPRINT_2.md](docs/SPRINT_2.md).

## Quick Start

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

## Project Structure
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
├── docker-compose.yml      # Production configuration
└── docker-compose.dev.yml  # Development configuration
```

## Features

### Sprint 1 - Completed

#### User Story 1: Log Expense
- Input fields for Item Name and Amount
- "Add Expense" button saves to PostgreSQL database
- Client-side and server-side validation
- Prevents empty names and negative amounts
- Success/error feedback messages
- Fully containerized with Docker

#### User Story 2: View Expense List
- Fetches expenses from Node.js API
- Displays list in chronological order (newest first)
- Shows empty state when no expenses exist
- Auto-refreshes after adding expense
- Professional card layout with hover effects
- Responsive design for mobile devices

#### User Story 3: View Total Spending
- Displays total sum of all expenses
- Backend calculates sum using PostgreSQL aggregation
- Formatted as GHS currency with 2 decimal places
- Auto-updates when expenses are added
- Prominent gradient badge design
- Only visible when expenses exist

### Sprint 2 - Completed

#### User Story 4: Delete Expense
- Delete button on each expense item
- Confirmation dialog prevents accidental deletion
- DELETE API endpoint removes from database
- UI updates immediately after deletion
- Total recalculates after deletion
- Success notification shown to user

#### User Story 5: Filter by Category
- Category dropdown in expense form
- Six categories: Food, Transport, Entertainment, Shopping, Bills, Other
- Filter control above expense list
- Total updates based on selected category
- Category badges displayed on each expense
- Default category "Other" for backward compatibility

*See [docs/SPRINT_2.md](docs/SPRINT_2.md) for detailed sprint report.*

## Technology Stack

- **Frontend:** React 19 + Vite
- **Backend:** Node.js + Express
- **Database:** PostgreSQL 16
- **DevOps:** Docker + Docker Compose
- **CI/CD:** GitHub Actions (to be configured)

## API Endpoints

### POST /api/expenses
Add a new expense.

**Request Body:**
```json
{
  "itemName": "Lunch",
  "amount": 25.50,
  "category": "Food"
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
    "category": "Food",
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

**Notes:**
- `category` is optional; defaults to "Other" if not provided
- Valid categories: Food, Transport, Entertainment, Shopping, Bills, Other

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
Fetch all expenses, optionally filtered by category.

**Query Parameters:**
- `category` (optional): Filter by category (Food, Transport, Entertainment, Shopping, Bills, Other)

**Response (200 OK):**
```json
{
  "expenses": [
    {
      "id": 2,
      "item_name": "Dinner",
      "amount": "35.00",
      "category": "Food",
      "created_at": "2026-02-05T18:00:00.000Z"
    },
    {
      "id": 1,
      "item_name": "Lunch",
      "amount": "25.50",
      "category": "Food",
      "created_at": "2026-02-04T10:30:00.000Z"
    }
  ]
}
```

**Examples:**
- `GET /api/expenses` - Returns all expenses
- `GET /api/expenses?category=Food` - Returns only Food expenses

**Notes:**
- Returns expenses ordered by `created_at DESC` (newest first)
- Returns empty array if no expenses exist or match filter

### GET /api/expenses/total
Calculate total spending, optionally filtered by category.

**Query Parameters:**
- `category` (optional): Calculate total for specific category only

**Response (200 OK):**
```json
{
  "total": 60.50
}
```

**Examples:**
- `GET /api/expenses/total` - Total of all expenses
- `GET /api/expenses/total?category=Food` - Total of Food expenses only

**Notes:**
- Returns 0 if no expenses exist or match filter
- Uses PostgreSQL SUM aggregation for accuracy

### DELETE /api/expenses/:id
Delete a specific expense.

**URL Parameters:**
- `id`: The expense ID to delete

**Response (200 OK):**
```json
{
  "message": "Expense deleted successfully"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Expense not found"
}
```

**Notes:**
- Returns 404 if expense with given ID does not exist
- Deletion is permanent and cannot be undone

## Development

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

## Database Schema

```sql
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  item_name VARCHAR(255) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  category VARCHAR(50) DEFAULT 'Other',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_expenses_created_at ON expenses(created_at DESC);
CREATE INDEX idx_expenses_category ON expenses(category);
```

**Schema Details:**
- `id`: Auto-incrementing primary key
- `item_name`: Expense description (required, max 255 chars)
- `amount`: Expense amount (required, must be >= 0, 2 decimal places)
- `category`: Expense category (default: "Other")
- `created_at`: Timestamp of expense creation (auto-generated)
- Index on `created_at` for optimized chronological queries
- Index on `category` for optimized category filtering

## Testing

### Backend Tests
```bash
cd backend
npm test
```

**Test Coverage:**
- 37 tests passing
- User Story 1: 10 tests (validation, persistence, error handling)
- User Story 2: 5 tests (fetch, ordering, empty state)
- User Story 3: 5 tests (sum calculation, accuracy, decimals)
- User Story 4: 6 tests (delete functionality, 404 handling, success response)
- User Story 5: 11 tests (category creation, filtering, total calculation)

### Frontend Tests
```bash
cd frontend
npm test
```

**Test Coverage:**
- 67 tests passing
- User Story 1: 14 tests (UI rendering, validation, submission)
- User Story 2: 9 tests (list display, integration, empty state)
- User Story 3: 6 tests (total display, formatting, auto-update)
- User Story 4: 12 tests (delete button, confirmation, UI refresh, total update)
- User Story 5: 26 tests (category dropdown, filter control, badges, filtered total)

### Total Test Coverage
- **104 automated tests** (100% passing)
- Backend: 37 tests (Jest + Supertest)
- Frontend: 67 tests (Vitest + React Testing Library)

*See [docs/TESTING.md](docs/TESTING.md) for detailed test documentation.*

## Definition of Done

A feature is considered "Done" when:
- All acceptance criteria are met
- Code follows clean code principles
- Input validation implemented (client & server)
- Backend and frontend tests written and passing
- Works in Docker containers
- CI/CD pipeline passes all checks
- Committed with conventional commit messages
- No dead code or debug statements
- Documentation updated

## Sprint Progress

- **Sprint 0:** Project setup and planning - COMPLETED
- **Sprint 1:** Core expense tracking features - COMPLETED
  - US01: Log Expense
  - US02: View Expense List
  - US03: View Total Spending
  - **Velocity:** 6 story points
  - **Tests:** 49/49 passing
  - **Documentation:** Complete with screenshots
- **Sprint 2:** Enhanced features - COMPLETED
  - US04: Delete Expense
  - US05: Filter by Category
  - **Velocity:** 7 story points
  - **Tests:** 104/104 passing
  - **Documentation:** Complete with screenshots

*See [docs/SPRINT_1.md](docs/SPRINT_1.md) for Sprint 1 detailed report.*
*See [docs/SPRINT_2.md](docs/SPRINT_2.md) for Sprint 2 detailed report.*

## CI/CD Pipeline

GitHub Actions workflow automatically runs on every push and pull request:

1. **Backend Tests** - Jest tests with PostgreSQL service
2. **Frontend Tests** - Vitest tests with coverage
3. **Frontend Linting** - ESLint code quality checks
4. **Docker Build** - Verify all images build successfully
5. **Integration Tests** - Full stack testing with Docker Compose
6. **Status Check** - Final verification

**Current Status:** All pipeline stages passing

*See [.github/workflows/ci.yml](.github/workflows/ci.yml) for pipeline configuration.*
