# Zawadi Sales Management System

A full-stack sales and inventory management system with a React + TypeScript frontend and a FastAPI backend. The application supports authentication, role-based access control, persistent products, stock adjustments, multi-item sales, inventory logs, analytics, and user administration.

## Stack

- Frontend: React + TypeScript + Vite
- Backend: FastAPI
- Database: PostgreSQL via `DATABASE_URL`, with SQLite fallback for development
- Auth: JWT + bcrypt password hashing

## Project Structure

```text
/backend
  main.py
  database.py
  /models
  /schemas
  /routes
  /services
  /auth
  /utils
/src
  /components
  /hooks
  /lib
  /services
  /styles
```

## Environment Variables

Copy `.env.example` to `.env` and update values as needed.

```bash
cp .env.example .env
```

Important variables:

- `DATABASE_URL`: PostgreSQL connection string or SQLite URL like `sqlite:///./sales_management.db`
- `SECRET_KEY`: JWT signing secret
- `ACCESS_TOKEN_EXPIRE_MINUTES`: token lifetime in minutes
- `CORS_ORIGINS`: comma-separated allowed frontend origins
- `DEFAULT_ADMIN_EMAIL`: seeded admin login email
- `DEFAULT_ADMIN_PASSWORD`: seeded admin login password
- `VITE_API_BASE_URL`: frontend API base URL

## Backend Setup

1. Create a virtual environment.
2. Install backend dependencies.
3. Start the API server.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn main:app --reload
```

The API will:

- create tables automatically on startup
- seed a default admin user if none exists
- seed starter products if the database is empty

### Default Admin Login

- Email: `admin@zawadi.local`
- Password: `Admin123!`

## Frontend Setup

```bash
npm install
npm run dev
```

The frontend expects the API at `http://localhost:8000/api` by default.

## Database Notes / Migration Approach

This implementation creates tables automatically from SQLAlchemy models during application startup. For local development that is enough to begin using the system immediately.

Recommended production migration path:

1. Add Alembic to the backend environment.
2. Generate an initial migration from the SQLAlchemy models.
3. Apply migrations during deployment before starting the API.

## Core Business Rules Implemented

- Selling products deducts stock atomically.
- Sales fail when requested stock exceeds available stock.
- Every stock change is written to `inventory_logs`.
- Sales totals are calculated from persisted product prices.
- Role-based access restricts product/user management actions.

## Main API Areas

- `/api/auth` - login, first-user registration, current user
- `/api/products` - CRUD, stock adjustments, inventory logs
- `/api/sales` - list sales and create transactions
- `/api/dashboard/summary` - analytics summary
- `/api/users` - admin user management

## Running Locally

Terminal 1:

```bash
uvicorn main:app --reload
```

Terminal 2:

```bash
npm run dev
```

Open the frontend on `http://localhost:3000`.
