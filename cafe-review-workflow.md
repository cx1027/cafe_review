# Cafe Review Workflow

This workflow defines the required implementation process for building a small cafe review application.

## Goal

Build a small full-stack cafe review application using:

- Frontend: React + TypeScript + Vite
- Backend: FastAPI + Python
- Database: PostgreSQL
- Local setup: Docker Compose

The application should collect:

- email
- comment
- rating from 1 to 5
- favorite aspect: Food, Coffee, Service, Atmosphere

All fields are required.

## Execution policy

- Execute exactly one step at a time.
- Do not start the next step until the current step is validated.
- After each step, stop and present:
  1. files created
  2. files modified
  3. validation commands
  4. expected validation result
  5. current status: `READY FOR NEXT STEP` or `BLOCKED`
- If validation has not passed, do not continue.
- Ask for confirmation before moving to the next step unless the user explicitly asked for autonomous step progression.
- Follow TDD for implementation steps:
  - Red: write failing tests first
  - Green: write the minimum code to pass
  - Refactor: clean up while keeping tests passing
- Do not skip verification.
- Do not switch databases; PostgreSQL is the only target database.
- Do not introduce unrelated features.

## Global implementation constraints

- Keep the project simple and review-friendly.
- Only output files created or changed in the current step.
- Do not repeat unchanged files.
- Do not implement future steps early.
- Use environment variables for configuration.
- Use Docker Compose for local PostgreSQL runtime.
- When Docker is introduced, the PostgreSQL container must create the application database using `POSTGRES_DB`.
- Include an exact command to verify that the target PostgreSQL database exists.

## Step 1 — Scaffold project

### Objective

Create the initial project structure only.

### Requirements

- Create:
  - `frontend/`
  - `backend/`
  - `README.md`
  - `docker-compose.yml` placeholder
- Frontend uses Vite + React + TypeScript.
- Backend uses a clean FastAPI structure:
  - `app/main.py`
  - `app/routers/`
  - `app/schemas/`
  - `app/models/`
  - `app/services/`
  - `app/core/`
  - `requirements.txt`
- Add backend and frontend test folders so the project is TDD-ready.
- Do not implement routes, models, or form behavior yet.

### Validation

- Frontend starter app runs.
- Backend starter app runs.
- Test folders exist.
- Folder structure matches the workflow.

## Step 2 — Backend tests first, then model, schemas, DB config, routes

### Objective

Using TDD, build backend validation, database config, model, service layer, and API routes.

### Requirements

- Use FastAPI + Pydantic + PostgreSQL.
- Use SQLAlchemy or SQLModel.
- Use `DATABASE_URL`.
- Create `Feedback` model with:
  - `id`
  - `email`: The email field must be validated with a regex pattern on the frontend
  - `comment`
  - `rating`:The rating must be constrained to whole numbers between 1 and 5
  - `favorite_aspect`:Food, Coffee, Service, or Atmosphere. The highlight field must be one of the four permitted values
  - `created_at`
- Create schemas for input and output.
- Add:
  - `POST /api/feedback`
  - `GET /api/feedback`
- Keep route handlers thin.
- Enable CORS for local frontend use.

### Required tests first

- valid feedback submission
- invalid email rejection
- missing field rejection
- invalid rating rejection
- invalid favorite_aspect rejection
- feedback listing

### Validation

- Backend tests pass.
- API starts successfully.
- Request and response examples match schema behavior.

## Step 3 — Frontend tests first, then form with validation

### Objective

Using TDD, build the frontend form and validation.

### Requirements

- Create a single-page form.
- Required fields:
  - email
  - comment
  - rating
  - favorite_aspect
- Validate email with regex.
- Prevent invalid submission.
- Show inline validation messages.
- Use controlled inputs.
- Use a mock submit handler only in this step.

### Required tests first

- required field validation
- invalid email validation
- blocked invalid submission
- valid mock submission

### Validation

- Frontend tests pass.
- Form renders correctly.
- Invalid input is blocked.
- Valid input reaches mock handler.

## Step 4 — Integration tests first, then connect frontend to backend and render list

### Objective

Using TDD, connect frontend and backend and render feedback entries.

### Requirements

- Replace mock submit with real API call.
- After successful submit:
  - show success message
  - reset form
  - refresh or append list
- Load data from `GET /api/feedback`
- Show:
  - email
  - comment
  - rating
  - favorite_aspect
  - created_at
- Show loading, empty, success, and error states.
- Keep API logic separate from UI components.
- Use frontend environment variable for backend base URL.

### Required tests first

- successful submit flow
- failed submit flow
- loading state
- empty state
- feedback list render
- error state

### Validation

- Frontend tests pass.
- Backend still passes relevant tests.
- Frontend can submit and fetch feedback successfully.

## Step 5 — Dockerfiles, Docker Compose, Postgres creation, and verification

### Objective

Add Docker support and confirm PostgreSQL database creation.

### Requirements

- Create:
  - `backend/Dockerfile`
  - `frontend/Dockerfile`
  - `docker-compose.yml`
- Services:
  - `frontend`
  - `backend`
  - `db`
- Use official PostgreSQL image.
- Add persistent volume for PostgreSQL data.
- Backend must connect using Docker service name, not `localhost`.
- Add environment variables:
  - `POSTGRES_USER`
  - `POSTGRES_PASSWORD`
  - `POSTGRES_DB`
  - `DATABASE_URL`
- The PostgreSQL container must create the application database automatically.

### Validation

- `docker compose up --build` succeeds.
- frontend, backend, and db are running.
- backend connects to db successfully.
- exact database verification command is provided and works.

### Required database verification example

```bash
docker compose exec db psql -U postgres -l
```

or, if the database name is known:

```bash
docker compose exec db psql -U postgres -d cafe_review -c '\dt'
```

## Step 6 — README and final tests review

### Objective

Prepare the project for submission.

### Requirements

- Write `README.md` with:
  - overview
  - tech stack
  - folder structure
  - non-Docker setup
  - Docker Compose setup
  - environment variables
  - API endpoints
  - validation rules
  - test commands
  - submission notes
  - how Postgres DB is created
  - how to verify DB existence
- Review backend and frontend tests.
- Add missing tests only if a stated requirement is uncovered.

### Validation

- README is complete.
- test commands are documented.
- all required implemented tests pass.
- project is ready for local reviewer execution.

## Standard step output format

For every step, output in this format:

1. Step name
2. Files to create
3. Files to modify
4. Files unchanged
5. Tests added or updated
6. Implementation files changed
7. Validation commands
8. Expected validation results
9. Status: `READY FOR NEXT STEP` or `BLOCKED`
10. Short note on what should happen in the next step
