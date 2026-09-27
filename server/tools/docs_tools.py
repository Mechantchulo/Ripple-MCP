"""
docs_tools.py — Ripple MCP
Provides search_project_docs(query): deterministic keyword search over docs/*.md.
No LLM calls. No embeddings. No external APIs. Pure stdlib text matching.
Never raises; always returns a structured dict.

The docs/ directory is resolved relative to the CURRENT PROJECT (CWD),
not the Ripple package installation directory.
"""

import re
from typing import Any

from ripple.config import get_docs_dir

# Common English stop words to skip when scoring
_STOP_WORDS = {
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "this", "that", "these", "those", "it",
    "its", "i", "you", "he", "she", "we", "they", "what", "which", "who",
    "how", "when", "where", "why", "not", "no", "if", "from", "as", "by",
}

_MAX_RESULTS = 3
_EXCERPT_MAX_CHARS = 300
_EXCERPT_MAX_LINES = 4


def _tokenise(text: str) -> set[str]:
    """Lowercase, strip punctuation, remove stop words, return unique tokens."""
    words = re.findall(r"[a-z0-9]+", text.lower())
    return {w for w in words if w not in _STOP_WORDS and len(w) > 1}


def _parse_sections(text: str, filename: str) -> list[dict[str, str]]:
    """
    Split a Markdown document into sections at heading lines (# …).

    Returns a list of dicts with keys: title, body, file.
    Content before the first heading is grouped under the document filename as title.
    """
    sections: list[dict[str, str]] = []
    current_title: str = filename
    current_lines: list[str] = []

    for line in text.splitlines():
        if line.startswith("#"):
            # Save previous section
            if current_lines or current_title != filename:
                sections.append({
                    "title": current_title,
                    "body": "\n".join(current_lines).strip(),
                    "file": filename,
                })
            current_title = line.lstrip("#").strip()
            current_lines = []
        else:
            current_lines.append(line)

    # Save the last section
    sections.append({
        "title": current_title,
        "body": "\n".join(current_lines).strip(),
        "file": filename,
    })

    return sections


def _score_section(title: str, body: str, query_tokens: set[str]) -> int:
    """Count how many distinct query tokens appear in the section title + body."""
    section_tokens = _tokenise(title + " " + body)
    return len(query_tokens & section_tokens)


def _make_excerpt(body: str) -> str:
    """Return the first few non-blank lines of body, capped at _EXCERPT_MAX_CHARS."""
    lines = [ln for ln in body.splitlines() if ln.strip()]
    excerpt = "\n".join(lines[:_EXCERPT_MAX_LINES])
    if len(excerpt) > _EXCERPT_MAX_CHARS:
        excerpt = excerpt[:_EXCERPT_MAX_CHARS].rstrip() + "…"
    return excerpt


def search_project_docs(query: str) -> dict[str, Any]:
    """
    Search the project's Markdown documentation for sections relevant to the query.

    Uses deterministic keyword scoring over docs/*.md — no LLM, no embeddings.

    Parameters:
        query: Natural-language search terms (e.g. "database environment variable").

    Returns a dict with:
        query  (str): the original query string
        results (list): up to 3 matching sections, each with title, excerpt, file

    Returns {"query": query, "results": []} when nothing matches, the docs
    directory is missing, or the query is empty. Never raises.
    """
    empty_result: dict[str, Any] = {"query": query, "results": []}

    if not query or not query.strip():
        return empty_result

    query_tokens = _tokenise(query)
    if not query_tokens:
        return empty_result

    docs_dir = get_docs_dir()
    if not docs_dir.is_dir():
        return empty_result

    scored: list[tuple[int, dict[str, str]]] = []

    for md_path in sorted(docs_dir.glob("*.md")):
        try:
            text = md_path.read_text(encoding="utf-8")
        except OSError:
            # Skip unreadable files silently
            continue

        for section in _parse_sections(text, md_path.name):
            score = _score_section(section["title"], section["body"], query_tokens)
            if score > 0:
                scored.append((score, section))

    # Sort by descending score, take top results
    scored.sort(key=lambda x: x[0], reverse=True)
    top = scored[:_MAX_RESULTS]

    results = [
        {
            "title": s["title"],
            "excerpt": _make_excerpt(s["body"]),
            "file": s["file"],
        }
        for _, s in top
        if s["body"].strip()  # skip sections with no body text
    ]

    return {"query": query, "results": results}
