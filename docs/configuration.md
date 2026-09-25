# Configuration

## Environment Variables

The application reads all configuration from environment variables. Do not hardcode credentials or connection strings in source code.

---

## Database Configuration

The application requires a database connection string to start correctly.

**Variable:** `DATABASE_URL`

The application reads `DATABASE_URL` on startup to establish the database connection pool. If this variable is absent or points to an unreachable database, the application will start but the `/health` endpoint will report `degraded` and database-backed endpoints will fail.

**Format:**

```
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
```

**Example (local development):**

```
DATABASE_URL=postgresql://ripple_user:ripple_pass@localhost:5432/ripple_db
```

**Example (local Docker):**

```
DATABASE_URL=postgresql://ripple_user:ripple_pass@127.0.0.1:5432/ripple_db
```

---

## Health Endpoint URL (Ripple MCP)

The Ripple MCP server uses a separate variable to locate the application health endpoint.

**Variable:** `RIPPLE_HEALTH_URL`

**Default:** `http://127.0.0.1:8000/health`

This variable is read by the Ripple `check_service_health` tool, not by the demo application itself.

---

## Setting Variables for Local Development

Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
```

The `.env` file is excluded from version control. Never commit real credentials.

---

## Required Variables Summary

| Variable | Required by | Description |
|----------|-------------|-------------|
| `DATABASE_URL` | Demo application | PostgreSQL connection string |
| `RIPPLE_HEALTH_URL` | Ripple MCP `check_service_health` | Health endpoint URL (optional, has default) |
