# Architecture

## Purpose

This is a demo Python web application built for the Ripple hackathon project. It exposes a small HTTP API backed by a PostgreSQL database. The application is used to demonstrate how IBM Bob, combined with the Ripple MCP server, can investigate and diagnose a live incident end-to-end without the developer manually gathering context from multiple systems.

---

## Local Development Architecture

```
Developer
    │
    ▼
IBM Bob IDE
    │  MCP (STDIO)
    ▼
Ripple MCP Server          ← exposes project tools to Bob
    ├── get_recent_changes  ← reads local git history
    ├── check_service_health ← HTTP GET /health on demo app
    ├── get_ci_status       ← reads demo_data/ci_status.json
    ├── get_deployment_info ← reads demo_data/deployment.json
    └── search_project_docs ← keyword search over docs/*.md

Demo Application           ← FastAPI, runs on http://127.0.0.1:8000
    └── PostgreSQL database ← connection string read from DATABASE_URL
```

All components run locally. There is no cloud infrastructure in the current MVP.

---

## Demo Application

- **Language:** Python 3.11+
- **Framework:** FastAPI
- **Default address:** `http://127.0.0.1:8000`
- **Database:** PostgreSQL, connection string read from the `DATABASE_URL` environment variable

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Returns application health status and database connectivity state |
| GET | `/items` | Returns a list of items from the database |
| POST | `/items` | Creates a new item |

### Health Endpoint

`GET /health` returns a JSON object. Example responses:

**Healthy:**
```json
{
  "status": "healthy",
  "database": "connected"
}
```

**Degraded (database unavailable):**
```json
{
  "status": "degraded",
  "database": "unavailable",
  "error": "could not connect to database"
}
```

The application reports `degraded` when it cannot establish a database connection. This is the expected state when `DATABASE_URL` is misconfigured or missing.

---

## Configuration

The application reads configuration from environment variables. The primary required variable is `DATABASE_URL`. See [configuration.md](configuration.md) for the full reference.

---

## CI Flow

Each commit triggers the CI workflow, which runs three stages in order:

1. **lint** — runs the code style and static analysis checks
2. **tests** — runs the unit and integration test suite
3. **health-check** — starts the application and calls `GET /health`; fails if the response is not `{"status": "healthy"}`

If the health-check stage fails, the overall workflow status is `failing`. The CI state is recorded in `demo_data/ci_status.json`.

---

## Relationship Between Components

| Component | Role |
|-----------|------|
| IBM Bob | AI coding and investigation agent — calls Ripple tools, correlates results, identifies root causes |
| Ripple MCP | Project-specific tool server — exposes structured read-only context to Bob |
| Demo application | The subject of investigation — a FastAPI app with a PostgreSQL dependency |
| `demo_data/*.json` | Synthetic CI and deployment fixtures representing the current pipeline and deployment state |
| `docs/*.md` | Project documentation — architecture, configuration reference, and operational runbooks |

Ripple does not contain another AI agent or LLM. It only exposes deterministic tools that read from local files, Git, and HTTP endpoints.
