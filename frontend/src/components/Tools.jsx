import { useState } from 'react'
import CopyButton from './CopyButton'

const TOOLS = [
  {
    name: 'get_recent_changes',
    signature: 'get_recent_changes(max_commits=5)',
    category: 'Git',
    categoryColor: 'text-[#58a6ff] border-[#1f6feb]/30 bg-[#1f6feb]/10',
    description: 'Inspects recent git commits, authors, commit messages, modified files, and extracts a 60-line focused diff.',
    returns: `{
  "commit": "6543c5e...",
  "author": "Erick Mutua",
  "message": "refactor: rename database config variable",
  "files_changed": ["demo_app/config.py"],
  "diff_excerpt": "- DATABASE_URL = ...\\n+ DB_URL = ..."
}`,
  },
  {
    name: 'check_service_health',
    signature: 'check_service_health(url="")',
    category: 'HTTP',
    categoryColor: 'text-[#3fb950] border-[#238636]/30 bg-[#238636]/10',
    description: 'Performs a non-crashing HTTP GET check against the configured service health endpoint. Returns healthy, degraded, or unreachable status.',
    returns: `{
  "reachable": true,
  "status_code": 503,
  "status": "degraded",
  "database": "unavailable",
  "error": "database connection refused"
}`,
  },
  {
    name: 'get_ci_status',
    signature: 'get_ci_status()',
    category: 'CI/CD',
    categoryColor: 'text-[#d29922] border-[#9e6a03]/30 bg-[#9e6a03]/10',
    description: 'Fetches current GitHub Actions pipeline execution status for the current branch, including job failures and step logs.',
    returns: `{
  "status": "failure",
  "branch": "erick",
  "workflow": "ci.yml",
  "failed_step": "test_health_endpoint",
  "conclusion": "failure"
}`,
  },
  {
    name: 'get_deployment_info',
    signature: 'get_deployment_info()',
    category: 'Deployment',
    categoryColor: 'text-[#d29922] border-[#9e6a03]/30 bg-[#9e6a03]/10',
    description: 'Queries the current deployment version, environment target, active revision timestamp, and deployment-level status.',
    returns: `{
  "environment": "staging",
  "version": "v1.4.2",
  "deployed_at": "2026-09-27T15:20:00Z",
  "last_known_health": "degraded"
}`,
  },
  {
    name: 'search_project_docs',
    signature: 'search_project_docs(query)',
    category: 'Docs',
    categoryColor: 'text-[#8b949e] border-[#30363d] bg-[#21262d]',
    description: 'Performs deterministic keyword and section search across local Markdown files (runbooks, architecture, configuration guides). Zero LLM overhead.',
    returns: `{
  "matches": [
    {
      "file": "docs/configuration.md",
      "section": "Database Configuration",
      "snippet": "Requires DATABASE_URL in environment for PostgreSQL connection pooling."
    }
  ]
}`,
  },
  {
    name: 'create_pull_request',
    signature: 'create_pull_request(title, body, head_branch="", base_branch="main")',
    category: 'GitHub API',
    categoryColor: 'text-[#bc8cff] border-[#8957e5]/30 bg-[#8957e5]/10',
    description: 'Opens a pull request on GitHub using securely stored local credentials. Validates diffs and never leaks authorization tokens into chat.',
    returns: `{
  "success": true,
  "pr_number": 12,
  "url": "https://github.com/Mechantchulo/Ripple-MCP/pull/12",
  "head_branch": "erick",
  "base_branch": "main"
}`,
  },
  {
    name: 'get_pull_request_status',
    signature: 'get_pull_request_status(pr_number)',
    category: 'GitHub API',
    categoryColor: 'text-[#bc8cff] border-[#8957e5]/30 bg-[#8957e5]/10',
    description: 'Monitors the state of an open pull request: check-suite runs, merge conflict status, review comments, and approval status.',
    returns: `{
  "pr_number": 12,
  "state": "open",
  "mergeable": true,
  "checks": { "total": 2, "passed": 2, "failed": 0 }
}`,
  },
]

export default function Tools() {
  const [expandedTool, setExpandedTool] = useState(null)

  function toggleExpand(name) {
    setExpandedTool(prev => (prev === name ? null : name))
  }

  return (
    <section id="tools" className="border-b border-[#21262d] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-mono uppercase tracking-widest text-[#bc8cff]">MCP Tool Reference</p>
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-[#f0f6fc]">
              7 purpose-built tools. Zero AI bloat.
            </h2>
            <p className="text-sm leading-relaxed text-[#8b949e] sm:text-base">
              Each tool provides one atomic slice of operational reality. Your AI agent (IBM Bob, Claude, Cursor) calls them on demand and reasons over structured JSON data.
            </p>
          </div>
          <span className="w-fit rounded-full border border-[#30363d] bg-[#161b22] px-3.5 py-1 text-xs font-mono text-[#8b949e]">
            All 7 verified by <code className="text-[#58a6ff]">ripple doctor</code>
          </span>
        </div>

        {/* Tools List */}
        <div className="space-y-3">
          {TOOLS.map(tool => {
            const isExpanded = expandedTool === tool.name
            return (
              <div
                key={tool.name}
                className="overflow-hidden rounded-lg border border-[#21262d] bg-[#161b22] transition-colors hover:border-[#30363d]"
              >
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                    <span
                      className={`inline-flex w-fit items-center rounded-md border px-2 py-0.5 text-[11px] font-mono font-medium ${tool.categoryColor}`}
                    >
                      {tool.category}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-semibold text-[#f0f6fc] font-mono">{tool.name}</code>
                        <CopyButton value={tool.name} label="Copy name" showLabel={false} />
                      </div>
                      <p className="text-xs text-[#8b949e] mt-1 sm:text-sm">{tool.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand(tool.name)}
                      className="rounded border border-[#30363d] bg-[#0d1117] px-2.5 py-1 text-xs font-mono text-[#8b949e] transition-colors hover:border-[#8b949e] hover:text-[#f0f6fc]"
                    >
                      {isExpanded ? 'Hide output ▲' : 'View return JSON ▼'}
                    </button>
                    <CopyButton value={tool.signature} label="Copy call" />
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-[#21262d] bg-[#010409] p-4 font-mono text-xs">
                    <div className="mb-2 flex items-center justify-between text-[#8b949e]">
                      <span>Example structured JSON returned to agent:</span>
                      <CopyButton value={tool.returns} label="Copy JSON" />
                    </div>
                    <pre className="overflow-x-auto text-[#79c0ff] leading-relaxed">
                      <code>{tool.returns}</code>
                    </pre>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Security & Token Note */}
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg border border-[#30363d] bg-[#0d1117] p-4 text-xs font-mono text-[#8b949e]">
          <div className="flex items-center gap-2">
            <span className="text-[#3fb950]">🔒</span>
            <span>
              <strong className="text-[#f0f6fc]">Token Security:</strong> GitHub tokens are stored in <code className="text-[#c9d1d9]">~/.config/ripple/auth.json</code> with 0600 permissions. Never leaked to LLMs or committed to git.
            </span>
          </div>
          <span className="text-[#58a6ff]">write operations safe by default</span>
        </div>
      </div>
    </section>
  )
}
