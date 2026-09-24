# Autonomous Database Optimizer — Dashboard

React + Vite dashboard for the [Autonomous Database Optimizer](https://github.com/IshaanTripathi03/autonomous-db-optimizer) — a Spring Boot agent that watches a PostgreSQL instance, diagnoses slow queries via RAG, and proposes index fixes for human approval.

This dashboard is the visual interface for that backend's approval workflow: real recommendations, real approve/reject actions, real execution results — no mock data.

## What it shows

- **Approval queue** — every recommendation the backend's autonomous monitor has queued, with live status (`PENDING`, `APPROVED`, `REJECTED`, `APPLIED`, `FAILED`)
- For each recommendation: target table, proposed index type/columns, the LLM's justification
- **Approve / Reject** actions, calling the backend directly — approving triggers real `CREATE INDEX CONCURRENTLY` execution and verification on the backend
- Verification results (before/after `EXPLAIN ANALYZE` timing) once a recommendation is applied
- Failure messages surfaced as-is when execution fails validation (e.g. a redundant index) — nothing hidden or faked

## Architecture

The dashboard is a pure API consumer — all diagnosis, RAG retrieval, LLM reasoning, and DDL execution happen in the backend. See the [backend repo](https://github.com/IshaanTripathi03/autonomous-db-optimizer) and its ADRs for the full system design and safety model.

## Running locally

Requires the backend running first at `localhost:8080` with CORS enabled for `localhost:5173` (already configured on the backend).

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Scope

This is a minimal, functional dashboard focused on the core approval loop — not a full production frontend. It only renders what the backend's real API returns; if a field or feature isn't in the API response, it isn't faked here.

## Tech stack

React 19, Vite, vanilla `fetch` (no state management library — app is small enough not to need one)
