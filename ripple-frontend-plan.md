# Ripple Frontend Plan

## Top-Level Overview

The Ripple frontend is a fully scaffolded, static informational product website living inside `frontend/` of the Ripple-MCP repository. It is built with Vite + React + Tailwind CSS v4. All 11 content sections and a footer are implemented across 12 React components wired together in `App.jsx`.

**Current state:** The scaffold is complete and `npm run build` passes cleanly. All components were externally polished (minor punctuation/wording tweaks) after initial scaffolding. No structural or content issues exist.

**Scope of this plan:** Polish, accessibility, cross-browser safety, and quality assurance — making the site submission-ready for the hackathon.

**Out of scope:**
- Backend, auth, database, chatbot
- Files outside `frontend/`
- Changes to `server/`, `.bob/`, `demo_data/`, `bob_sessions/`

---

## Sub-Tasks

---

### Sub-Task 1 — Verify clean build after external edits

**Intent:** Confirm the externally modified components still compile and build without errors or warnings after the polishing edits made outside the agent.

**Expected Outcomes:**
- `npm run build` exits 0 with no errors or warnings
- `npm run dev` starts without console errors
- All 11 sections render visibly in the browser

**Todo List:**
- [ ] Run `npm run build` inside `frontend/`
- [ ] Run `npm run dev` and visually confirm all sections load
- [ ] Check browser console for React warnings (missing keys, prop errors)

**Relevant Context:**
- [`frontend/src/App.jsx`](frontend/src/App.jsx) — root component
- All components in [`frontend/src/components/`](frontend/src/components/)
- [`frontend/src/index.css`](frontend/src/index.css) — Tailwind v4 import
- [`frontend/vite.config.js`](frontend/vite.config.js) — Tailwind plugin config

**Status:** [ ] pending

---

### Sub-Task 2 — Smooth scrolling and navigation anchor wiring

**Intent:** Ensure all Nav links scroll smoothly to their target sections and that every section has the correct `id` attribute matching the Nav href values.

**Expected Outcomes:**
- Clicking any Nav link scrolls to the correct section smoothly
- No broken anchors (clicking a link that jumps to top = broken)
- Mobile menu closes after a link is tapped

**Todo List:**
- [ ] Add `scroll-behavior: smooth` to the `html` element via `index.css` or `index.html`
- [ ] Audit every section `id` against the Nav `links` array:
  - `#overview` → Hero section
  - `#problem` → Problem section
  - `#solution` → Solution section
  - `#tools` → Tools section
  - `#demo` → Demo section
  - `#architecture` → Architecture section
  - `#access` → GetAccess section
  - `#future` → MVP section
- [ ] Confirm `LocalMCP`, `WhyItMatters`, and `Hackathon` sections do not need nav entries (they are currently not linked — confirm this is intentional)

**Relevant Context:**
- [`frontend/src/components/Nav.jsx`](frontend/src/components/Nav.jsx) — `links` array with href values
- Each section component's root `<section id="...">` attribute

**Status:** [ ] pending

---

### Sub-Task 3 — Responsive layout audit

**Intent:** Confirm the site renders correctly on mobile (375px), tablet (768px), and desktop (1280px). Diagrams and code blocks must remain readable on small screens.

**Expected Outcomes:**
- No horizontal overflow on any viewport width
- Code `<pre>` blocks scroll horizontally rather than breaking layout
- Diagram nodes wrap gracefully on mobile
- Nav hamburger menu works correctly on mobile

**Todo List:**
- [ ] Test at 375px width — check Hero, Problem, Solution, Tools cards, Demo, Architecture, GetAccess code blocks
- [ ] Check `<pre>` blocks in `GetAccess.jsx` have `overflow-x-auto` (already present — confirm)
- [ ] Check Tools grid collapses from 2-col to 1-col on mobile (already `sm:grid-cols-2` — confirm)
- [ ] Check Architecture and Solution flow diagrams on mobile — ensure center alignment holds
- [ ] Fix any overflows found

**Relevant Context:**
- [`frontend/src/components/GetAccess.jsx`](frontend/src/components/GetAccess.jsx) — `<pre>` code blocks
- [`frontend/src/components/Tools.jsx`](frontend/src/components/Tools.jsx) — `grid sm:grid-cols-2`
- [`frontend/src/components/Architecture.jsx`](frontend/src/components/Architecture.jsx) — mono diagram
- [`frontend/src/components/Solution.jsx`](frontend/src/components/Solution.jsx) — flow diagram

**Status:** [ ] pending

---

### Sub-Task 4 — Accessibility audit

**Intent:** Ensure the site meets basic accessibility requirements: semantic HTML, heading hierarchy, sufficient contrast, keyboard navigation, and no information conveyed only through colour.

**Expected Outcomes:**
- Heading hierarchy is correct (`h1` once in Hero, `h2` per section, `h3` for sub-headings)
- All interactive elements (links, buttons) are keyboard reachable
- Nav hamburger button has `aria-label`
- External links have `target="_blank" rel="noreferrer"` (already present — confirm)
- Badge colours (green/yellow) have supporting text labels, not just colour

**Todo List:**
- [ ] Audit heading levels across all components — currently `h1` in Hero, `h2` in each section, `h3` in sub-cards
- [ ] Confirm Nav hamburger has `aria-label="Toggle menu"` (already present — confirm)
- [ ] Confirm all `<a target="_blank">` have `rel="noreferrer"` (already present — confirm)
- [ ] Confirm tool badge text ("Live", "Fixture (MVP)") is present alongside colour — not colour-only (already present — confirm)
- [ ] Check that the footer "Back to top" link is keyboard focusable

**Relevant Context:**
- [`frontend/src/components/Nav.jsx`](frontend/src/components/Nav.jsx) — hamburger `aria-label`
- [`frontend/src/components/Hero.jsx`](frontend/src/components/Hero.jsx) — sole `h1`
- [`frontend/src/components/Tools.jsx`](frontend/src/components/Tools.jsx) — badge text + colour

**Status:** [ ] pending

---

### Sub-Task 5 — Content accuracy final check

**Intent:** Verify all content on the site is factually accurate against the actual repo files. No invented commands, URLs, or feature descriptions.

**Expected Outcomes:**
- Setup commands match `requirements.txt` and README exactly
- GitHub URL is correct (`https://github.com/Mechantchulo/Ripple-MCP`)
- CI and deployment fixture labels clearly say "simulated" / "Fixture (MVP)"
- `check_service_health` default URL matches `.env.example` (`http://127.0.0.1:8000/health`)
- `search_project_docs` described as deterministic text search (no LLM)
- No claims that Ripple reasons, diagnoses, or is an AI agent

**Todo List:**
- [ ] Cross-check `GetAccess.jsx` setup steps against `requirements.txt` and README
- [ ] Cross-check `Tools.jsx` health URL note against `.env.example`
- [ ] Confirm CI/deployment badge labels in `Tools.jsx` say "Fixture (MVP)"
- [ ] Confirm `MVP.jsx` fixture notes reference `demo_data/ci_status.json` and `demo_data/deployment.json`
- [ ] Confirm no section calls Ripple an AI, agent, or LLM

**Relevant Context:**
- [`requirements.txt`](requirements.txt) — `mcp[cli]>=1.0`, `python-dotenv>=1.0`
- [`.env.example`](.env.example) — `RIPPLE_HEALTH_URL=http://127.0.0.1:8000/health`
- [`README.md`](README.md) — setup commands and tool descriptions
- [`frontend/src/components/Tools.jsx`](frontend/src/components/Tools.jsx)
- [`frontend/src/components/GetAccess.jsx`](frontend/src/components/GetAccess.jsx)

**Status:** [ ] pending

---

### Sub-Task 6 — Production build verification and dev run confirmation

**Intent:** Confirm the final site builds cleanly for production and runs correctly in development. This is the submission-readiness gate.

**Expected Outcomes:**
- `npm run build` exits 0, no errors, no warnings
- `dist/` folder is generated with `index.html`, CSS, and JS assets
- `npm run dev` starts on a local port without errors
- The site title in browser tab reads "Ripple — MCP Developer Operations Gateway"

**Todo List:**
- [ ] Run `npm run build` from inside `frontend/` — confirm clean exit
- [ ] Confirm `dist/index.html` exists after build
- [ ] Run `npm run dev` and confirm dev server starts
- [ ] Check browser tab title matches `index.html` `<title>` tag
- [ ] Report final bundle sizes

**Relevant Context:**
- [`frontend/index.html`](frontend/index.html) — page title
- [`frontend/vite.config.js`](frontend/vite.config.js) — build config
- [`frontend/package.json`](frontend/package.json) — scripts

**Status:** [ ] pending

---

## Files Owned by This Plan

All inside `frontend/`:

| File | Role |
|------|------|
| `src/App.jsx` | Root — assembles all sections |
| `src/main.jsx` | Entry point |
| `src/index.css` | Tailwind v4 import |
| `index.html` | Page shell + title |
| `vite.config.js` | Vite + Tailwind plugin |
| `src/components/Nav.jsx` | Sticky nav |
| `src/components/Hero.jsx` | Hero / overview |
| `src/components/Problem.jsx` | Problem section |
| `src/components/Solution.jsx` | How it works / flow |
| `src/components/Tools.jsx` | MCP tools cards |
| `src/components/Demo.jsx` | Hackathon demo scenario |
| `src/components/Architecture.jsx` | Architecture diagram |
| `src/components/GetAccess.jsx` | Setup guide |
| `src/components/LocalMCP.jsx` | Why local MCP |
| `src/components/MVP.jsx` | Current MVP vs future |
| `src/components/WhyItMatters.jsx` | Value proposition |
| `src/components/Hackathon.jsx` | Hackathon context |

## Files That Must Not Be Modified

```
server/
.bob/
demo_data/
bob_sessions/
README.md
docs/
requirements.txt
.env.example
```
