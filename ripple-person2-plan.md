# Ripple — Person 2 Plan
## CI + Deployment + Project Docs Tools

### Overview

Person 1 has completed the MCP server foundation, `get_recent_changes`, and `check_service_health`.
Person 2 must implement the remaining three tool modules and their supporting data/documentation.

**Scope:**
- `server/tools/ci_tools.py` — `get_ci_status() -> dict`
- `server/tools/deployment_tools.py` — `get_deployment_info() -> dict`
- `server/tools/docs_tools.py` — `search_project_docs(query: str) -> dict`
- `demo_data/ci_status.json`
- `demo_data/deployment.json`
- `docs/architecture.md`
- `docs/runbook.md`
- `docs/configuration.md`

**Hard constraints (from Person 1 ownership boundary):**
- Do NOT modify `server/main.py`, `server/tools/git_tools.py`, `server/tools/health_tools.py`, `server/__init__.py`, `server/tools/__init__.py`, `.bob/mcp.json`.
- Do NOT register tools in `server/main.py` — Person 1 will do that after merge.
- No LLM calls, no async, no new external dependencies.
- All paths resolved project-relative via `pathlib` / `__file__`.

**Conventions observed in Person 1's code:**
- Return type annotated as `dict[str, Any]`
- Never raise — always return `{"error": "..."}` on failure
- Stdlib only (`json`, `pathlib`, `subprocess`, `urllib`, `os`, `re`)
- Module-level docstring documenting approach

---

## Sub-Task 1 — Create demo_data/ with synthetic CI and deployment JSON

**Intent:**  
Provide the deterministic local data files the two data-reading tools will consume. These must contain a realistic-enough hackathon scenario where CI is failing and the deployment is degraded, enabling Bob to investigate root causes later.

**Expected Outcomes:**
- `demo_data/ci_status.json` exists and is valid JSON
- `demo_data/deployment.json` exists and is valid JSON
- Both files match the schemas documented in the prompt

**Todo List:**
- [ ] Create `demo_data/ci_status.json` with workflow=CI, status=failing, a commit hash, null pipeline_url, stage list (tests=passing, health-check=failing), and an error message about the database
- [ ] Create `demo_data/deployment.json` with deployment_id, version matching the CI commit, environment=production, deployed_at timestamp, deployed_by=demo-pipeline, status=degraded, health_check=failed

**Relevant Context:**
- Example shapes are given in sections 7 and 8 of the brief
- The commit hash in both files should match (same revision was deployed and CI ran against it)

**Status:** [ ] pending

---

## Sub-Task 2 — Create server/tools/ci_tools.py

**Intent:**  
Implement `get_ci_status()` that safely reads `demo_data/ci_status.json` relative to the project root and returns its contents. Follows the exact same defensive error-handling pattern as `health_tools.py` and `git_tools.py`.

**Expected Outcomes:**
- `from server.tools.ci_tools import get_ci_status` works
- `get_ci_status()` returns the structured dict from the JSON file
- Missing file returns `{"error": "CI status data not found: ..."}`
- Malformed JSON returns `{"error": "CI status data is not valid JSON: ..."}`
- Non-dict JSON returns `{"error": "CI status data has unexpected format"}`

**Todo List:**
- [ ] Create `server/tools/ci_tools.py` with module docstring
- [ ] Resolve project root via `pathlib.Path(__file__).resolve().parents[2]` (tools/ → server/ → project root)
- [ ] Implement `get_ci_status() -> dict[str, Any]` using `json`, `pathlib`
- [ ] Handle `FileNotFoundError`, `json.JSONDecodeError`, non-dict result, and generic `Exception`
- [ ] Verify function returns dict for normal, missing-file, and malformed-JSON cases

**Relevant Context:**
- Data path: `demo_data/ci_status.json` relative to project root
- Pattern: `pathlib.Path(__file__).resolve().parents[2] / "demo_data" / "ci_status.json"`
- See `health_tools.py` for the error-return style

**Status:** [ ] pending

---

## Sub-Task 3 — Create server/tools/deployment_tools.py

**Intent:**  
Implement `get_deployment_info()` that safely reads `demo_data/deployment.json`. Identical defensive pattern to `ci_tools.py`.

**Expected Outcomes:**
- `from server.tools.deployment_tools import get_deployment_info` works
- Normal call returns the structured deployment dict
- Missing file → `{"error": "..."}`
- Malformed JSON → `{"error": "..."}`

**Todo List:**
- [ ] Create `server/tools/deployment_tools.py` with module docstring
- [ ] Resolve project root via `pathlib.Path(__file__).resolve().parents[2]`
- [ ] Implement `get_deployment_info() -> dict[str, Any]`
- [ ] Same error handling as ci_tools.py
- [ ] Verify all three cases

**Relevant Context:**
- Data path: `demo_data/deployment.json` relative to project root
- Same parent-resolution pattern as ci_tools.py

**Status:** [ ] pending

---

## Sub-Task 4 — Create docs/ Markdown files

**Intent:**  
Create three realistic project documentation files that Bob will search later. These are project docs for the demo application, not meta-docs about Ripple or Bob. They must document `DATABASE_URL` (not `DB_URL`) as the correct configuration variable — the `DB_URL` mismatch is the intentional breaking change Bob will discover by correlating tools.

**Expected Outcomes:**
- `docs/architecture.md` describes the demo app's purpose, local architecture, endpoints, CI flow, and the relationship between IBM Bob / Ripple / demo app / project data
- `docs/runbook.md` contains database-unavailable troubleshooting steps referencing `DATABASE_URL`, health-check guidance, and deployment check steps
- `docs/configuration.md` documents `DATABASE_URL` as the required variable with an example connection string

**Todo List:**
- [ ] Create `docs/architecture.md`
- [ ] Create `docs/runbook.md` (troubleshooting steps for database unavailable, health check failures, deployment issues — without mentioning `DB_URL`)
- [ ] Create `docs/configuration.md` (documents `DATABASE_URL`, not `DB_URL`)

**Relevant Context:**
- `DB_URL` must NOT appear in any of these docs — it is introduced later as the breaking change
- Troubleshooting steps should lead Bob to check `DATABASE_URL` config, git changes, CI, deployment, health endpoint — in that logical order

**Status:** [ ] pending

---

## Sub-Task 5 — Create server/tools/docs_tools.py

**Intent:**  
Implement `search_project_docs(query: str) -> dict` using deterministic keyword scoring over Markdown section headings and body text. No embeddings, no LLM, no external APIs — pure stdlib (`pathlib`, `re`).

**Algorithm:**
1. Normalise query → lowercase tokens, strip punctuation, remove stop words
2. Walk `docs/*.md` files
3. Split each file into sections at `#` headings
4. Score each section by counting distinct query-token matches in heading + body
5. Sort by descending score, take top-3 non-zero sections
6. Return excerpt (first 3 non-blank lines of matching section body, max 300 chars)

**Expected Outcomes:**
- `from server.tools.docs_tools import search_project_docs` works
- `search_project_docs("database environment variable")` → result referencing `DATABASE_URL` from `configuration.md`
- `search_project_docs("health troubleshooting")` → result from `runbook.md`
- `search_project_docs("application architecture")` → result from `architecture.md`
- `search_project_docs("totally unrelated phrase")` → `{"query": "...", "results": []}`
- Empty query → `{"query": "", "results": []}`
- Missing docs dir → `{"query": "...", "results": []}`

**Todo List:**
- [ ] Create `server/tools/docs_tools.py` with module docstring
- [ ] Implement `_get_docs_dir()` helper to resolve `docs/` relative to project root
- [ ] Implement `_parse_sections(text, filename)` to split Markdown into `(heading, body, file)` tuples
- [ ] Implement `_score_section(heading, body, tokens)` returning int keyword-overlap score
- [ ] Implement `search_project_docs(query: str) -> dict[str, Any]`
- [ ] Handle empty query, missing directory, unreadable files, no matches
- [ ] Verify all test cases from section 16 of the brief

**Relevant Context:**
- Docs path: `pathlib.Path(__file__).resolve().parents[2] / "docs"`
- Return shape: `{"query": str, "results": [{"title": str, "excerpt": str, "file": str}]}`
- Max 3 results; excerpt capped at ~300 chars to avoid flooding context

**Status:** [ ] pending

---

## Sub-Task 6 — Import verification

**Intent:**  
Confirm all three functions can be imported and return `dict` without modifying `server/main.py`.

**Expected Outcomes:**
- All three imports succeed
- Direct calls return `dict` instances
- No uncaught exceptions

**Todo List:**
- [ ] Run `python3 -c "from server.tools.ci_tools import get_ci_status; r = get_ci_status(); assert isinstance(r, dict); print(r)"`
- [ ] Run `python3 -c "from server.tools.deployment_tools import get_deployment_info; r = get_deployment_info(); assert isinstance(r, dict); print(r)"`
- [ ] Run `python3 -c "from server.tools.docs_tools import search_project_docs; r = search_project_docs('database environment variable'); assert isinstance(r, dict); print(r)"`
- [ ] Verify all test scenarios from sections 14–16 of the brief

**Status:** [ ] pending

---

## Files to Create

| File | Owner |
|------|-------|
| `demo_data/ci_status.json` | Person 2 |
| `demo_data/deployment.json` | Person 2 |
| `server/tools/ci_tools.py` | Person 2 |
| `server/tools/deployment_tools.py` | Person 2 |
| `server/tools/docs_tools.py` | Person 2 |
| `docs/architecture.md` | Person 2 |
| `docs/runbook.md` | Person 2 |
| `docs/configuration.md` | Person 2 |

## Files NOT to Touch

```
server/main.py
server/tools/git_tools.py
server/tools/health_tools.py
server/__init__.py
server/tools/__init__.py
.bob/mcp.json
```

## Dependencies

No new `requirements.txt` entries needed. All three modules use only Python stdlib:
- `json` — JSON reading
- `pathlib` — project-relative path resolution
- `re` — keyword tokenisation in docs search
- `typing.Any` — type hints

## Path Resolution Strategy

All three tool modules resolve the project root from their own file path:

```python
_PROJECT_ROOT = pathlib.Path(__file__).resolve().parents[2]
# __file__ = .../Ripple-MCP/server/tools/ci_tools.py
# parents[0] = .../server/tools/
# parents[1] = .../server/
# parents[2] = .../Ripple-MCP/   ← project root
```

This works regardless of clone location and does not use hardcoded absolute paths.

## Integration Instructions for Person 1 (after merge)

In `server/main.py`, uncomment the TODO block and update it with the recommended descriptions:

```python
from server.tools.ci_tools import get_ci_status as _get_ci_status
from server.tools.deployment_tools import get_deployment_info as _get_deployment_info
from server.tools.docs_tools import search_project_docs as _search_project_docs

@mcp.tool(
    name="get_ci_status",
    description=(
        "Retrieves the latest CI state for the demo project, including workflow status, "
        "associated commit, stage results, and relevant failure information. "
        "Use this when investigating build failures, validation failures, regressions "
        "after a change, or deployment readiness."
    ),
)
def get_ci_status() -> dict:
    return _get_ci_status()

@mcp.tool(
    name="get_deployment_info",
    description=(
        "Retrieves the latest simulated deployment record for the demo project, including "
        "deployed version, environment, deployment time, status, and health-check outcome. "
        "Use this when investigating deployment failures, runtime incidents, or correlating "
        "an unhealthy service with a particular deployed revision."
    ),
)
def get_deployment_info() -> dict:
    return _get_deployment_info()

@mcp.tool(
    name="search_project_docs",
    description=(
        "Searches the project's Markdown documentation and returns relevant documented "
        "project guidance with source filenames. Use this when investigating expected "
        "configuration, architecture, operational procedures, troubleshooting steps, "
        "or other project-specific behavior."
    ),
)
def search_project_docs(query: str) -> dict:
    """
    Args:
        query: Required natural-language search terms describing the project information
               to find. Examples: "database environment variable", "health check
               troubleshooting", or "application architecture".
    """
    return _search_project_docs(query=query)
```
