# Ripple

An install-once MCP server that gives coding agents structured access to the current project's Git history, service health, CI state, deployment records, documentation, and GitHub pull requests.

## Install once, use anywhere

Install Ripple globally with [pipx](https://pipx.pypa.io/):

```bash
pipx install git+https://github.com/Mechantchulo/Ripple-MCP.git
```

From a local Ripple clone, the equivalent development install is `pipx install .`.

Then initialize it from any Git project:

```bash
cd my-project
ripple init
ripple auth github   # needed for write operations such as creating a PR
ripple doctor
```

`ripple init` creates project-specific, non-secret configuration in
`.ripple/config.json` and configures IBM Bob in `.bob/mcp.json`. Authentication
is stored outside the repository in the user's config directory. The
`RIPPLE_GITHUB_TOKEN` environment variable remains available as an override.

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

### `create_pull_request(title, body, head_branch="", base_branch="main")`

Creates a GitHub pull request for the current project. This write operation
requires authentication from `ripple auth github` or `RIPPLE_GITHUB_TOKEN`.

### `get_pull_request_status(pr_number)`

Reads a pull request's state, merge information, branches, and CI checks.
Public repositories can be queried without authentication where GitHub permits.

---

## Architecture

```text
IBM Bob ───────────┐
Other MCP client ──┼──> Ripple MCP ──> GitHub / CI / Health / Deployments / Docs
IDE MCP client ───┘
```

- **The MCP client** is the agent — IBM Bob is the demo client, but Ripple works with any STDIO MCP-compatible client.
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
├── ripple/
│   ├── cli.py                     ← global CLI commands
│   ├── config.py                  ← current-project discovery
│   └── auth.py                    ← secure local token storage
├── .bob/
│   └── mcp.json                  ← Bob launches `ripple serve`
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
├── pyproject.toml                     ← package and `ripple` entry point
├── requirements.txt
└── README.md
```

---

## CLI commands

| Command | Purpose |
|---|---|
| `ripple init` | Detect the current Git project and create `.ripple/config.json` plus Bob's `.bob/mcp.json` |
| `ripple auth github` | Prompt without echo and securely store a GitHub token outside the project |
| `ripple doctor` | Check installation, Git, GitHub, health endpoint, MCP readiness, and all seven tools |
| `ripple serve` | Start Ripple as a standard STDIO MCP server using the current project |

## MCP Client Configuration

Ripple uses standard STDIO transport and connects to any MCP-compatible agent.

### IBM Bob (`.bob/mcp.json`)

Created automatically in your project by `ripple init`:

```json
{
  "mcpServers": {
    "ripple": {
      "command": "ripple",
      "args": ["serve"]
    }
  }
}
```

### Claude Desktop (`claude_desktop_config.json`)

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "ripple": {
      "command": "ripple",
      "args": ["serve"]
    }
  }
}
```

### Cursor / Windsurf (`.cursor/mcp.json`)

```json
{
  "mcpServers": {
    "ripple": {
      "command": "ripple",
      "args": ["serve"]
    }
  }
}
```

### Claude Code CLI

```bash
claude mcp add ripple -- ripple serve
```

### MCP Inspector (Browser UI)

Test all seven tools interactively:

```bash
npx @modelcontextprotocol/inspector ripple serve
```

To run the bundled demo application for health and deployment tests:

```bash
# From project root, once the demo app is available:
uvicorn demo_app:app --host 127.0.0.1 --port 8000
```

---

## Testing the MCP Server

The following tests were performed during Person 1's implementation:

| Test | Method | Result |
|------|--------|--------|
| Server startup | `ripple serve` | Starts the STDIO MCP server cleanly |
| Tool discovery | `mcp.list_tools()` async call | All seven tools registered with correct names, descriptions, and input schemas |
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
- GitHub tokens are entered with hidden input and stored outside the project with owner-only permissions on POSIX systems
- `RIPPLE_GITHUB_TOKEN` overrides the locally stored token for CI and advanced setups
- `.env` is excluded from version control via `.gitignore`
- No client, confidential, or personal data is used
- CI and deployment data for the hackathon MVP uses synthetic, controlled fixtures
- Pull-request creation requires GitHub authentication; public read-only GitHub requests work without it where GitHub allows

---

## Current MVP vs Future Integrations

**Current MVP uses:**

| Source | Current implementation |
|--------|----------------------|
| Git history | Local `git` binary via subprocess |
| Service health | HTTP GET to local FastAPI app |
| CI status | GitHub Actions, with a current-project fixture fallback |
| Deployment info | Current-project JSON fixture |
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

MCP gives Ripple a standard interface for exposing project-specific tools to any compatible client without building a custom integration for each tool. The client discovers available tools at startup, calls them by name, and receives structured JSON responses it can reason over.

The same globally installed Ripple server can serve different projects because configuration, Git operations, docs, and data are resolved from the directory where `ripple serve` is launched.

---

## Summary

> Ripple does not try to make IBM Bob smarter. It makes the project's operational context easier for Bob to reach.

Instead of developers manually gathering evidence from multiple systems, Ripple gives Bob focused project tools so it can investigate an incident workflow end-to-end — from a single question in the chat.
