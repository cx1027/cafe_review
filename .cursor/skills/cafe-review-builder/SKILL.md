---
name: cafe-review-builder
description: Build a cafe review application step by step using FastAPI, React, PostgreSQL, Docker Compose, and TDD. Use when the user asks to create a cafe review, cafe feedback, or customer feedback application.
---

# Cafe Review Builder

## Purpose

This skill builds a small full-stack cafe review application in controlled steps.

Default stack:
- Frontend: React + TypeScript + Vite
- Backend: FastAPI + Python
- Database: PostgreSQL
- Local runtime: Docker Compose

## When to use

Use this skill when the user asks for tasks like:

- Create a cafe review application
- Build a cafe feedback app
- Scaffold a customer feedback app
- Start a FastAPI + React + PostgreSQL review project

## Source of truth

Use `@cafe-review-workflow.md` as the source of truth for:
- step order
- requirements
- validation gates
- Docker/Postgres verification
- TDD workflow

If the workflow file is missing, ask the user to create or restore it before proceeding.

## Required behavior

- Execute exactly one workflow step at a time.
- Do not skip ahead.
- Do not implement future steps early.
- After each step, stop and output:
  1. files created
  2. files modified
  3. tests added or updated
  4. validation commands
  5. expected validation results
  6. status: READY FOR NEXT STEP or BLOCKED
- Do not continue until the user confirms validation or asks to continue.

## TDD behavior

For implementation steps:
1. Write or update tests first.
2. Ensure tests fail for the intended reason.
3. Implement the minimum code needed to pass.
4. Refactor after tests are green.
5. Briefly state what was red and what is now green.

## Database behavior

- PostgreSQL is the only default database target.
- Do not use SQLite unless the user explicitly overrides the stack.
- When Docker is introduced, require the database to be created using `POSTGRES_DB`.
- Provide an exact command to verify the database exists.

## Output boundaries

- Only output full contents of files created or modified in the current step.
- Do not repeat unchanged files.
- Keep the implementation simple and review-friendly.
- Prefer deterministic structure over alternative architectures unless the user asks for options.

## Start behavior

If the user gives a broad request, start from Step 1 only.

Example:
User: Create a cafe review application.
Assistant behavior:
- activate this skill
- read `@cafe-review-workflow.md`
- execute Step 1 only
- stop for validation