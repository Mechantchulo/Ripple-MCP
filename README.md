# Ripple

An MCP server that gives IBM Bob structured access to project-specific operational context — Git history, service health, CI state, deployment records, and documentation — so developers can investigate incidents without switching between multiple tools manually.

> Ripple turns fragmented project operations context into a single MCP interface for IBM Bob, so developers can investigate incidents without manually collecting information from multiple systems.

---

## The Problem

Modern coding agents handle code well. IBM Bob can already:

- read and edit source files
- run tests and fix local bugs
- use the terminal
- refactor and explain code

The gap is **operational context outside the codebase**. When an incident or failed deployment happens, a developer still needs to manually collect information from:

- Git history (what changed and when?)
- CI/CD dashboard (did the build pass?)
- Deployment records (what version is running?)
- Health endpoints (is the service up?)
- Runbooks and architecture docs (what is the expected configuration?)

In practice, the developer becomes the **human API** between those systems and the coding agent — copying and pasting context back and forth before the agent can reason about the problem.

---

## The Solution

Ripple exposes those sources as focused MCP tools that IBM Bob can call directly during a task.

```text
Developer
    ↓
IBM Bob
    ↓
Ripple MCP
    ├── Git
    ├── CI/CD
    ├── Deployment state
    ├── Service health
    └── Project docs
```

IBM Bob remains the reasoning agent. Ripple only exposes trusted, deterministic project tools and structured context. **Ripple does not contain another chatbot or LLM.**

---

## Why Ripple Matters

**Without Ripple**, investigating an incident looks like this:

```text
Incident
↓
Open Git → find the relevant commit
↓
Open CI dashboard → check whether the build passed
↓
Check deployment records → confirm what is running
↓
Hit the health endpoint → verify the service state
↓
Find the runbook → look up expected configuration
↓
Copy all of that context back into the AI
↓
Ask the question
```

**With Ripple**, the same investigation looks like this:

```text
Developer asks Bob once
↓
Bob calls Ripple tools in sequence
↓
Ripple retrieves the relevant context from each source
↓
Bob correlates the evidence
↓
Root cause is identified
```

Benefits:

- fewer context switches for the developer
- less manual information gathering
- more structured, consistent context for Bob
- faster incident investigation
- project-specific tooling that can be reused across tasks

---

## Demo Scenario

The hackathon demo uses a controlled incident designed to show this workflow end-to-end.

The demo FastAPI application originally expects a database connection string named:

```text
DATABASE_URL
```

A later code change renames the variable to:

```text
DB_URL
```

The environment and the project documentation still reference `DATABASE_URL`. This mismatch causes the application health check to report the database as unavailable.

The developer asks IBM Bob:

> The latest deployment is unhealthy. Investigate what happened and tell me what to fix.

Bob then uses Ripple tools to inspect:

- recent Git changes (what changed in the last commit?)
- CI state (did the pipeline pass after the change?)
- deployment information (what version is deployed and what environment is it using?)
- service health (is the application reachable and what does it report?)
- project documentation (what does the runbook say about required environment variables?)

Bob correlates those signals and identifies the `DATABASE_URL` → `DB_URL` mismatch as the root cause.

This is a **controlled hackathon scenario** with synthetic CI and deployment data. The incident is intentional and reproducible.

---

## Ripple MCP Tools

### `get_recent_changes(max_commits=5)`

Retrieves recent Git repository information including:

- latest commit hash, message, author, and date
- list of files changed in the latest commit
- diff excerpt (first 60 lines)
- list of recent commits

Helps Bob understand what changed in the codebase immediately before a regression or deployment problem.

### `check_service_health(url="")`

Performs an HTTP GET against the application health endpoint and returns a structured response. Defaults to `http://127.0.0.1:8000/health` or the `RIPPLE_HEALTH_URL` environment variable.

Returns one of three states:

- **healthy** — service is reachable and reporting healthy
- **degraded** — service is reachable but reporting a problem (e.g. database unavailable)
- **unreachable** — connection refused, timeout, or network error

Never crashes the MCP server if the application is offline.

### `get_ci_status()`

Returns the latest CI pipeline state for recent commits, including pass/fail status and stage breakdown.

For the hackathon MVP, CI data is sourced from a controlled local fixture. A future version can integrate directly with GitHub Actions, Jenkins, or other CI systems.

### `get_deployment_info()`

Returns the latest deployment record including version, environment, deployment timestamp, and associated health state.

For the hackathon MVP, deployment data is sourced from a controlled local fixture that matches the demo scenario.

### `search_project_docs(query)`

Searches local project Markdown documentation including architecture notes, configuration references, and runbooks.

The current implementation uses deterministic local text search — no embeddings, no additional LLM calls.

---

## Architecture

```text
                    Developer
                        │
                        ▼
                    IBM Bob
                        │
                      MCP
                        │
                        ▼
                     Ripple
            ┌───────────┼───────────┐
            ▼           ▼           ▼
          Git        CI/CD       Health
            │           │           │
            └──────┬────┴────┬──────┘
                   ▼         ▼
              Deployment   Docs
```

- **IBM Bob** is the agent — it reasons, decides which tools to call, and produces the final answer.
- **Ripple** is the MCP server — it exposes focused tools and returns structured data.
- Ripple tools are **deterministic** — they read from Git, files, or HTTP endpoints.
- Ripple **does not call another LLM**.
- Bob decides which tools to use and in what order.

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| AI agent | IBM Bob IDE |
| MCP interface | Model Context Protocol (MCP) |
| MCP server language | Python 3.11+ |
| MCP SDK | `mcp` Python SDK v2.2.0 |
| MCP transport | STDIO |
| Demo application | FastAPI |
| Version control | Git / GitHub |
| CI data (MVP) | Local JSON fixture |
| Deployment data (MVP) | Local JSON fixture |
| Project docs | Markdown |
| Dependency management | pip + virtualenv |

---

## Project Structure

```text
Ripple-MCP/
├── .bob/
│   └── mcp.json                  ← Bob project-level MCP configuration
├── bob_sessions/                 ← Hackathon session screenshots
│   └── README.md
├── server/
│   ├── main.py                   ← MCP server entry point
│   └── tools/
│       ├── git_tools.py          ← get_recent_changes (implemented)
│       ├── health_tools.py       ← check_service_health (implemented)
│       ├── ci_tools.py           ← get_ci_status (Person 2)
│       ├── deployment_tools.py   ← get_deployment_info (Person 2)
│       └── docs_tools.py         ← search_project_docs (Person 2)
├── demo_data/
│   ├── ci_status.json            ← controlled CI fixture
│   └── deployment.json           ← controlled deployment fixture
├── docs/
│   ├── architecture.md
│   ├── configuration.md
│   └── runbook.md
├── .env.example
├── requirements.txt
└── README.md
```

> **Note:** `ci_tools.py`, `deployment_tools.py`, `docs_tools.py`, `demo_data/`, and `docs/` are Person 2's scope and will be present in the merged branch.

---

## How to Run Ripple

**1. Clone the repository**

```bash
git clone https://github.com/Mechantchulo/Ripple-MCP.git
cd Ripple-MCP
```

**2. Create and activate a virtual environment**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

**3. Install dependencies**

```bash
pip install -r requirements.txt
```

**4. Configure environment variables (optional)**

```bash
cp .env.example .env
# Edit .env if you need a non-default health endpoint URL
```

**5. Connect Ripple to IBM Bob**

Open this project folder in the IBM Bob IDE. Bob automatically reads `.bob/mcp.json` and starts the Ripple MCP server as a child process over STDIO.

To verify:
- Open Bob → Settings → MCP tab
- Confirm `ripple` appears with status **connected**
- Expand `ripple` — both `get_recent_changes` and `check_service_health` (and Person 2's tools after merge) should be listed

**6. Run the demo application (for health and deployment tests)**

```bash
# From project root, once the demo app is available:
uvicorn demo_app:app --host 127.0.0.1 --port 8000
```

---

## Testing the MCP Server

The following tests were performed during Person 1's implementation:

| Test | Method | Result |
|------|--------|--------|
| Server startup | `echo "" \| python3 server/main.py` | Clean exit, no errors |
| Tool discovery | `mcp.list_tools()` async call | Both tools registered with correct names, descriptions, and input schemas |
| `get_recent_changes` — real repo data | Direct Python call + `mcp.call_tool()` | Returns commit hash, message, diff excerpt, recent commits |
| `check_service_health` — online | In-process mock server on :8000 | Returns `{"reachable": true, "status": "healthy", ...}` |
| `check_service_health` — offline | No server running | Returns `{"reachable": false, "status": "unreachable", "error": "..."}` — no crash |
| `check_service_health` — degraded | Mock server returning HTTP 503 | Returns `{"reachable": true, "status_code": 503, "status": "degraded", ...}` |
| Full MCP protocol path | Both tools via `mcp.call_tool()` | `CallToolResult` with correct JSON text, `is_error: False` |
| MCP Inspector | `mcp dev server/main.py` | Inspector launched at `http://127.0.0.1:6274`, tools visible and invocable |
| Bob tool invocation | Bob chat → Ripple tool call | Bob proposed and called `get_recent_changes` successfully |

---

## Hackathon Evidence

The `bob_sessions/` folder contains IBM Bob task-session consumption summary screenshots captured during development. These are required for the hackathon submission to document Bob usage across implementation tasks.

Screenshots follow the naming convention:

```text
ripple_<participant>_<description>.png
```

---

## Team Responsibilities

### Person 1 (Erick)
- MCP server foundation (`server/main.py`)
- IBM Bob MCP configuration (`.bob/mcp.json`)
- Git tool (`server/tools/git_tools.py` → `get_recent_changes`)
- Health tool (`server/tools/health_tools.py` → `check_service_health`)
- Final MCP registration and integration of Person 2's tools after merge

### Person 2
- CI tool (`server/tools/ci_tools.py` → `get_ci_status`)
- Deployment tool (`server/tools/deployment_tools.py` → `get_deployment_info`)
- Project docs search (`server/tools/docs_tools.py` → `search_project_docs`)
- Demo data fixtures (`demo_data/`)
- Project documentation (`docs/`)

---

## Security and Data Handling

- No secrets are hardcoded anywhere in the repository
- Sensitive configuration is handled through environment variables documented in `.env.example`
- `.env` is excluded from version control via `.gitignore`
- No client, confidential, or personal data is used
- CI and deployment data for the hackathon MVP uses synthetic, controlled fixtures
- All Ripple tools are **read-only** in the current MVP
- MCP tool approval is kept **explicit** — `alwaysAllow` is empty in `.bob/mcp.json`, so Bob must ask before calling any tool

---

## Current MVP vs Future Integrations

**Current MVP uses:**

| Source | Current implementation |
|--------|----------------------|
| Git history | Local `git` binary via subprocess |
| Service health | HTTP GET to local FastAPI app |
| CI status | Local JSON fixture |
| Deployment info | Local JSON fixture |
| Project docs | Local Markdown files, text search |

**Future integrations could include:**

- GitHub Actions or Jenkins (live CI/CD)
- Kubernetes or cloud deployment APIs
- Grafana or Prometheus (monitoring/logs)
- Sentry (error tracking)
- Jira or Linear (issue tracking)
- Internal deployment or release management APIs

These are not implemented in the current MVP.

---

## Why MCP?

MCP gives Ripple a standard interface for exposing project-specific tools to IBM Bob without building a custom integration for each tool. Bob discovers available tools at startup, calls them by name, and receives structured JSON responses it can reason over.

The same Ripple server can be connected to any Bob session on the project simply by committing `.bob/mcp.json` to the repository. No per-developer setup is required beyond installing the Python dependencies.

---

## Summary

> Ripple does not try to make IBM Bob smarter. It makes the project's operational context easier for Bob to reach.

Instead of developers manually gathering evidence from multiple systems, Ripple gives Bob focused project tools so it can investigate an incident workflow end-to-end — from a single question in the chat.
