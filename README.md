# Cafe Review

A full-stack customer feedback application where visitors can submit ratings and reviews for a cafe.

## Overview

Single-page application that collects feedback (email, comment, rating, and favorite aspect) and displays submitted entries in real time.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Backend | FastAPI (Python 3.12) + SQLAlchemy |
| Database | PostgreSQL 16 |
| Container runtime | Docker Compose |
| Testing (frontend) | Vitest + React Testing Library |
| Testing (backend) | pytest |

## Folder Structure

```
.
├── docker-compose.yml          # Docker services: frontend, backend, db
├── backend/
│   ├── Dockerfile              # Python 3.12 container image
│   ├── requirements.txt        # Python dependencies
│   ├── .env                   # Local DATABASE_URL (non-Docker)
│   └── app/
│       ├── main.py            # FastAPI app entry + CORS config
│       ├── database.py        # SQLAlchemy session + init_db()
│       ├── core/
│       │   ├── config.py      # Environment variable loading
│       │   └── db_base.py    # SQLAlchemy declarative base
│       ├── models/
│       │   └── feedback.py    # Feedback ORM model
│       ├── routers/
│       │   └── feedback.py    # POST & GET /api/feedback
│       ├── schemas/
│       │   └── feedback.py    # Pydantic request/response schemas
│       ├── services/
│       │   └── feedback_service.py  # Business logic
│       └── tests/
│           └── test_feedback.py     # 14 backend test cases
└── frontend/
    ├── Dockerfile             # Node builder + nginx alpine
    ├── nginx.conf             # SPA serve + /api/ proxy
    ├── vitest.config.ts       # Test configuration
    ├── src/
    │   ├── main.tsx           # React entry point
    │   ├── App.tsx            # Root component
    │   ├── App.css            # Component styles
    │   ├── types/
    │   │   └── feedback.ts    # TypeScript interfaces
    │   ├── api/
    │   │   └── feedback.ts    # API client (fetch-based)
    │   ├── hooks/
    │   │   └── useFeedback.ts # State management hook
    │   ├── components/
    │   │   ├── FeedbackForm.tsx   # Feedback submission form
    │   │   └── FeedbackList.tsx   # Feedback entry list
    │   └── styles/
    │       └── index.css      # Base styles
    └── tests/
        ├── setup.tsx          # Vitest + jest-dom setup
        ├── FeedbackForm.test.tsx       # 15 form test cases
        └── FeedbackIntegration.test.tsx # 7 integration test cases
```

## Setup

### Non-Docker Setup

#### Prerequisites

- Node.js 20+
- Python 3.12+
- PostgreSQL running locally (or use Docker for DB only)

#### Backend

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create the database (run once)
psql -U postgres -c "CREATE DATABASE cafe_review;"

# Start the server
uvicorn app.main:app --reload --port 8000
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The frontend dev server runs at `http://localhost:5173` and calls the backend at `http://localhost:8000`.

### Docker Compose Setup

```bash
# Build and start all services
docker compose up -d --build
docker compose up -d

# Stop services
docker compose down
```

Services:

| Service | URL |
|---|---|
| Frontend | http://localhost:5174 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

## Environment Variables

### Backend

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/cafe_review` | PostgreSQL connection string |

In Docker Compose, the backend uses `postgresql://postgres:postgres@db:5432/cafe_review` (using the Docker service name `db`).

### Frontend

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Backend base URL for API calls |

In Docker Compose, this is set to `http://backend:8000` at build time via `--build-arg`.

## API Endpoints

### `POST /api/feedback`

Create a new feedback entry.

**Request body:**

```json
{
  "email": "visitor@cafe.com",
  "comment": "Great coffee and lovely atmosphere!",
  "rating": 5,
  "favorite_aspect": "Coffee"
}
```

**Response (201 Created):**

```json
{
  "id": 1,
  "email": "visitor@cafe.com",
  "comment": "Great coffee and lovely atmosphere!",
  "rating": 5,
  "favorite_aspect": "Coffee",
  "created_at": "2026-04-26T10:00:00Z"
}
```

### `GET /api/feedback`

List all feedback entries, newest first.

**Response (200 OK):**

```json
[
  {
    "id": 2,
    "email": "bob@cafe.com",
    "comment": "Good food",
    "rating": 4,
    "favorite_aspect": "Food",
    "created_at": "2026-04-26T11:30:00Z"
  },
  {
    "id": 1,
    "email": "visitor@cafe.com",
    "comment": "Great coffee and lovely atmosphere!",
    "rating": 5,
    "favorite_aspect": "Coffee",
    "created_at": "2026-04-26T10:00:00Z"
  }
]
```

### `GET /health`

Health check endpoint.

**Response (200 OK):**

```json
{
  "status": "ok"
}
```

## Validation Rules

### Field constraints

| Field | Rule |
|---|---|
| `email` | Required. Must be a valid email address. |
| `comment` | Required. Non-empty string. |
| `rating` | Required. Integer between 1 and 5 inclusive. |
| `favorite_aspect` | Required. Must be one of: `Food`, `Coffee`, `Service`, `Atmosphere`. |

Invalid requests return HTTP `422 Unprocessable Entity`.

## Test Commands

### Frontend tests (22 tests)

```bash
cd frontend
npm test
```

### Frontend tests with watch mode

```bash
cd frontend
npm run test:watch
```

### Backend tests (14 tests)

```bash
cd backend
venv/bin/python -m pytest tests/ -v
```

### All tests

```bash
# Frontend
cd frontend && npm test

# Backend
cd backend && venv/bin/python -m pytest tests/ -v
```

## How the PostgreSQL Database is Created

The `cafe_review` database is created automatically by the official `postgres:16-alpine` Docker image using the `POSTGRES_DB` environment variable. No manual database creation step is required when using Docker Compose.

```yaml
# docker-compose.yml
db:
  image: postgres:16-alpine
  environment:
    - POSTGRES_DB=cafe_review
    - POSTGRES_USER=postgres
    - POSTGRES_PASSWORD=postgres
```

The `feedback` table is created automatically on backend startup via FastAPI's `lifespan` event handler, which calls `init_db()` to run `Base.metadata.create_all()`.

## How to Verify Database Existence

```bash
# List all databases (cafe_review should appear)
docker compose exec db psql -U postgres -l

# List tables inside cafe_review
docker compose exec db psql -U postgres -d cafe_review -c '\dt'

# Query the feedback table
docker compose exec db psql -U postgres -d cafe_review -c 'SELECT * FROM feedback;'
```

Expected output from `\dt`:

```
          List of relations
 Schema |   Name   | Type  |  Owner
--------+----------+-------+----------
 public | feedback | table | postgres
(1 row)
```

## Submission Notes

- All 36 tests pass (14 backend + 15 frontend form + 7 integration).
- Frontend tests use Vitest with jsdom environment and React Testing Library.
- Backend tests use pytest with FastAPI's `TestClient` and SQLite in-memory database.
- The backend runs in a Docker volume mount (`./backend/app:/app/app`) for hot-reload during development.
- CORS is configured to allow `http://localhost:5173`, `http://localhost:5174`, and `http://localhost:8000` (for API docs access).
