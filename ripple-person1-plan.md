# Ripple MCP — Person 1 Implementation Plan

## Top-Level Overview

Build the MCP foundation for **Ripple**, a local STDIO MCP server that exposes project-specific tools to IBM Bob. Person 1 owns: `server/main.py`, `server/tools/git_tools.py`, `server/tools/health_tools.py`, `.bob/mcp.json`, and `.env.example`.

The repository is currently a blank Git repo (only `.git/` exists). Everything must be created from scratch.

**Scope:**
- Python package scaffolding (dependencies, virtualenv-ready)
- `server/main.py` — MCP server init, tool registration, STDIO startup
- `server/tools/git_tools.py` — `get_recent_changes` tool
- `server/tools/health_tools.py` — `check_service_health` tool
- `.bob/mcp.json` — project-level Bob MCP configuration
- `.env.example` — environment variable documentation

**Non-goals (Person 2):**
- `server/tools/ci_tools.py`
- `server/tools/deployment_tools.py`
- `server/tools/docs_tools.py`
- `demo_data/`, `docs/`

---

## Architecture

```
IBM Bob  →  STDIO  →  server/main.py (FastMCP server)
                           ├── get_recent_changes   (git_tools.py)
                           └── check_service_health  (health_tools.py)
                           # Person 2 slots will register here later:
                           # ├── get_ci_status        (ci_tools.py)
                           # ├── get_deployment_info  (deployment_tools.py)
                           # └── search_project_docs  (docs_tools.py)
```

**MCP SDK:** `mcp[cli]` (official Python MCP SDK, pip-installable).  
Uses `FastMCP` high-level API — `@mcp.tool()` decorator pattern.  
Transport: STDIO (Bob spawns the process).

---

## Assumptions

1. Python 3.11+ is available in the environment where Bob runs.
2. `git` binary is on PATH where the MCP server runs.
3. The demo FastAPI app (owned by Person 2) will serve `GET /health` at `http://127.0.0.1:8000/health`.
4. Bob IDE (not Bob Shell) is being used; project-level `.bob/mcp.json` is the correct config location.
5. The `mcp` package is installed into a virtualenv at `server/.venv` or globally; the `.bob/mcp.json` command will use `python` or an explicit venv path — we document both options.
6. Person 2's tool modules will export simple callable functions; `main.py` will import and wrap them with `@mcp.tool()` when merging.

---

## Sub-Tasks

---

### Sub-Task 1 — Python Package Scaffolding

**Intent:** Create the minimal dependency declaration so the project can be installed and run. Without this, the MCP server cannot start.

**Expected Outcomes:**
- `requirements.txt` lists `mcp[cli]` and `python-dotenv`
- `server/__init__.py` and `server/tools/__init__.py` exist (empty, make the directories Python packages)
- Running `pip install -r requirements.txt` succeeds

**Todo List:**
- [ ] Create `requirements.txt` with `mcp[cli]>=1.0` and `python-dotenv>=1.0`
- [ ] Create `server/__init__.py` (empty)
- [ ] Create `server/tools/__init__.py` (empty)

**Relevant Context:**
- MCP Python SDK is published as the `mcp` package on PyPI; `mcp[cli]` includes the `fastmcp` extras needed for `FastMCP`.
- `python-dotenv` is used to load `.env` values in local development.

**Status:** [x] done

---

### Sub-Task 2 — `.env.example`

**Intent:** Document every environment variable Ripple uses so teammates know what to configure without exposing real credentials.

**Expected Outcomes:**
- `.env.example` exists at project root
- Documents `RIPPLE_HEALTH_URL` with a safe default example value
- No real secrets present

**Todo List:**
- [ ] Create `.env.example` documenting `RIPPLE_HEALTH_URL=http://127.0.0.1:8000/health`
- [ ] Add a comment explaining the variable's purpose

**Relevant Context:**
- `health_tools.py` reads `RIPPLE_HEALTH_URL` via `os.getenv` with fallback to `http://127.0.0.1:8000/health`.

**Status:** [x] done

---

### Sub-Task 3 — `server/tools/git_tools.py`

**Intent:** Implement the `get_recent_changes` business logic. This module must be independently testable (callable from Python without the MCP layer).

**Expected Outcomes:**
- Function `get_recent_changes(max_commits: int = 5) -> dict` exists
- Returns a dict with keys: `commit`, `message`, `author`, `date`, `changed_files`, `diff_excerpt`, `recent_commits`
- Uses `subprocess` to call `git` — no third-party git library required
- Handles: not a git repo, git not installed, no commits, subprocess errors
- Returns `{"error": "<message>"}` shape on failure instead of raising
- No LLM calls, no GitHub API calls

**Todo List:**
- [ ] Implement helper to run `git` subcommands safely (no shell=True with user input)
- [ ] Collect latest commit: `git log -1 --format=%H|%s|%an|%ai`
- [ ] Collect changed files for latest commit: `git diff-tree --no-commit-id -r --name-only HEAD`
- [ ] Collect diff excerpt (first 60 lines): `git diff HEAD~1 HEAD -- <changed_files>`
- [ ] Collect recent commit list: `git log -N --format=%H|%s|%an|%ai`
- [ ] Return structured dict; handle each subprocess failure individually

**Relevant Context:**
- Must work in the Ripple-MCP repo itself (the repo is a valid git repo)
- `subprocess.run(..., capture_output=True, text=True, check=False)` — never `shell=True` with dynamic input
- Error shape: `{"error": "not a git repository"}` etc.

**Status:** [x] done

---

### Sub-Task 4 — `server/tools/health_tools.py`

**Intent:** Implement the `check_service_health` business logic. This module must be independently testable.

**Expected Outcomes:**
- Function `check_service_health(url: str | None = None) -> dict` exists
- Reads `RIPPLE_HEALTH_URL` from environment with fallback `http://127.0.0.1:8000/health`
- Performs HTTP GET with a 5-second timeout
- Returns parsed JSON body if response is JSON
- Handles: non-200 status, connection error, timeout, invalid JSON
- Never raises — always returns a structured dict
- Healthy shape: `{"reachable": true, "status_code": 200, ...response_body_fields}`
- Unreachable shape: `{"reachable": false, "status": "unreachable", "error": "<msg>"}`

**Todo List:**
- [ ] Import `os`, `urllib.request`, `urllib.error`, `json` (stdlib only — no `requests` dependency)
- [ ] Read URL from `os.getenv("RIPPLE_HEALTH_URL", "http://127.0.0.1:8000/health")`
- [ ] Accept optional `url` parameter override
- [ ] Attempt `urllib.request.urlopen` with `timeout=5`
- [ ] Parse response body as JSON; merge with `reachable: true`, `status_code`
- [ ] Catch `urllib.error.URLError` → return unreachable shape
- [ ] Catch JSON decode error → return `{"reachable": true, "status_code": N, "raw_body": "..."}`

**Relevant Context:**
- Using stdlib `urllib` keeps dependencies minimal; no `requests` needed.
- `python-dotenv` loads `.env` at server startup in `main.py` — health_tools just reads env.

**Status:** [x] done

---

### Sub-Task 5 — `server/main.py`

**Intent:** Assemble the MCP server. Import tool modules, register tools with descriptions, start via STDIO. Designed so Person 2's tools can be added with minimal `main.py` changes.

**Expected Outcomes:**
- `FastMCP("ripple")` instance created
- `get_recent_changes` registered with full description
- `check_service_health` registered with full description, optional `url` parameter documented
- `.env` loaded via `python-dotenv` before tools run
- `mcp.run()` called with STDIO transport on `__main__`
- Clear TODO comment block marking where Person 2's tools will be imported and registered

**Todo List:**
- [ ] Create `server/main.py`
- [ ] Import `dotenv.load_dotenv` and call it early
- [ ] Import `get_recent_changes` from `server.tools.git_tools`
- [ ] Import `check_service_health` from `server.tools.health_tools`
- [ ] Use `@mcp.tool()` with explicit `name=` and `description=` for each tool
- [ ] Add TODO comment block for Person 2 tool registration (3 tools)
- [ ] Call `mcp.run()` under `if __name__ == "__main__"`

**Tool descriptions to use:**

`get_recent_changes`:
> Retrieves recent Git repository changes for the current project, including the latest commit, changed files, diff excerpt, and a list of recent commits. Use this when investigating regressions, failures after a change, configuration changes, or determining what recently changed in the project.

`check_service_health`:
> Checks the configured demo application's health endpoint and returns current service availability and health information. Use this when investigating runtime failures, degraded services, deployment problems, or verifying whether the application recovered after a fix. Optional parameter: url (string) — override the health endpoint URL; defaults to the RIPPLE_HEALTH_URL environment variable.

**Relevant Context:**
- `FastMCP` from `mcp` package: `from mcp.server.fastmcp import FastMCP`
- STDIO run: `mcp.run(transport="stdio")` or just `mcp.run()` (default is stdio)

**Status:** [x] done

---

### Sub-Task 6 — `.bob/mcp.json`

**Intent:** Register Ripple with IBM Bob at project level so it is available to all team members who clone this repo.

**Expected Outcomes:**
- `.bob/mcp.json` exists with valid JSON
- Contains `mcpServers.ripple` entry
- Uses STDIO transport (`command: "python3"`, `args: ["server/main.py"]`)
- `cwd` set to project root (relative or absolute pattern documented in comments)
- `disabled: false`
- `alwaysAllow: []` (empty — explicit approval required per security requirements)
- No secrets in this file

**Todo List:**
- [ ] Create `.bob/` directory
- [ ] Create `.bob/mcp.json` with the ripple server entry
- [ ] Set `command` to `python3` and `args` to `["server/main.py"]`
- [ ] Document in `.env.example` that a virtualenv may need to be used

**Config shape:**
```json
{
  "mcpServers": {
    "ripple": {
      "command": "python3",
      "args": ["server/main.py"],
      "cwd": "${workspaceFolder}",
      "env": {},
      "alwaysAllow": [],
      "disabled": false
    }
  }
}
```

**Note:** If Bob requires a fully qualified python path (e.g. when using a venv), the `command` can be changed to the venv python path. Document this in `.env.example` comments.

**Relevant Context:**
- Bob IDE project-level MCP: `.bob/mcp.json` (confirmed by IBM docs)
- `${workspaceFolder}` is the standard Bob/VS Code workspace folder variable
- `alwaysAllow: []` — per security requirements, no tools auto-approved

**Status:** [x] done

---

### Sub-Task 7 — Verification Checklist

**Intent:** Confirm each layer works before declaring Person 1 done.

**Expected Outcomes (all must pass):**
- Test A: `python server/main.py` starts without errors (or `mcp dev server/main.py` lists tools)
- Test B: `get_recent_changes` returns real data from this repo's git history
- Test C: `check_service_health` returns healthy response when demo app is running
- Test D: `check_service_health` returns unreachable response when demo app is offline
- Test E: Bob sees Ripple in MCP server list and can propose a tool call

**Todo List:**
- [ ] Run `python server/main.py` and confirm no import errors
- [ ] Call `get_recent_changes` directly in Python REPL and inspect output
- [ ] Call `check_service_health` with demo app running; inspect output
- [ ] Call `check_service_health` with demo app stopped; inspect output
- [ ] Open Bob → Settings → MCP tab → confirm Ripple appears
- [ ] Confirm both tools appear under Ripple in Bob's tool list

**Relevant Context:**
- `mcp dev server/main.py` launches the MCP inspector (if mcp CLI installed) for interactive testing
- Direct Python test: `python -c "from server.tools.git_tools import get_recent_changes; import json; print(json.dumps(get_recent_changes(), indent=2))"`

**Status:** [x] done

---

## Person 2 Integration Notes (for later)

When Person 2's files are merged:

1. Inspect exported function signatures in `ci_tools.py`, `deployment_tools.py`, `docs_tools.py`
2. In `server/main.py`, replace the TODO block with:
   ```python
   from server.tools.ci_tools import get_ci_status
   from server.tools.deployment_tools import get_deployment_info
   from server.tools.docs_tools import search_project_docs
   ```
3. Register each with `@mcp.tool(name=..., description=...)`
4. Verify all 5 tools appear in Bob

Do NOT rewrite Person 2's internal implementations.
