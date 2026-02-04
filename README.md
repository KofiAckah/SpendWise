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

### Sprint 1 - User Story 1: Log Expense ✓
- ✅ Input fields for Item Name and Amount
- ✅ "Add Expense" button saves to PostgreSQL database
- ✅ Client-side and server-side validation
- ✅ Prevents empty names and negative amounts
- ✅ Success/error feedback messages
- ✅ Fully containerized with Docker

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
```

## 🎯 Definition of Done

A feature is considered "Done" when:
- ✅ All acceptance criteria are met
- ✅ Code follows clean code principles
- ✅ Input validation implemented (client & server)
- ✅ Works in Docker containers
- ✅ Committed with conventional commit messages
- ✅ No dead code or debug statements

## 📅 Sprint Progress

- **Sprint 0:** Project setup and planning ✅
- **Sprint 1:** Currently implementing User Stories 1-3
  - US01: Log Expense ✅ **COMPLETED**
  - US02: View Expense List (Next)
  - US03: View Total Spending (Next)

## 👥 Contributors

- Joel Livingstone Kofi Ackah

## 📄 License

This project is part of the AmaliTech Agile & DevOps training program.
