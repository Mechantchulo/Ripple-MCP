# Ripple Demo App

A minimal FastAPI service that gives the Ripple MCP server a real runtime signal to investigate.

This app is **not** the hackathon product — Ripple is. The demo app exists solely to produce a realistic incident for Ripple/Bob to diagnose.

---

## Quick Start

```bash
cd demo_app
pip install -r requirements.txt
DATABASE_URL=postgresql://demo:demo@localhost:5432/ripple uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The health endpoint will be available at:

```
http://127.0.0.1:8000/health
```

---

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Service identity |
| GET | `/health` | Database health check |
| POST | `/login` | Demo authentication |
| GET | `/users` | Static demo user list |

---

## Health Behaviour

| Condition | Status code | Response |
|-----------|-------------|----------|
| `DATABASE_URL` is set | 200 | `{"status": "healthy", "database": "connected"}` |
| `DATABASE_URL` is absent | 503 | `{"status": "degraded", "database": "unavailable", "error": "..."}` |

---

## Demo Login

```json
POST /login
{"email": "demo@example.com", "password": "password"}
```

---

## Running Tests

From the repository root:

```bash
pip install -r demo_app/requirements.txt
pytest demo_app/tests
```

Or from inside `demo_app/`:

```bash
cd demo_app
pytest tests/
```

---

## Environment Variables

| Variable | Required by | Description |
|----------|-------------|-------------|
| `DATABASE_URL` | Demo application | Connection string (placeholder — no real DB needed) |

Copy `.env.example` to `.env` to set values locally:

```bash
cp demo_app/.env.example demo_app/.env
```

---

## The Incident

The demo's incident is triggered by a single-line change in [`app/config.py`](app/config.py):

**Healthy (baseline):**
```python
DATABASE_URL = os.getenv("DATABASE_URL")
```

**Broken (breaking commit):**
```python
DATABASE_URL = os.getenv("DB_URL")
```

The environment and project docs still reference `DATABASE_URL`, so the app reads `None`, `/health` returns `503 degraded`, and Ripple/Bob can trace the mismatch through `get_recent_changes()` + `search_project_docs()`.

> Do NOT introduce the breaking commit until the healthy baseline is confirmed and committed.
