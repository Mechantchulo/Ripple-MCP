const tools = [
  {
    name: 'get_recent_changes',
    signature: 'get_recent_changes(max_commits=5)',
    purpose: 'Retrieves recent Git commits, changed files and a diff excerpt from the repository.',
    useCase: 'Understanding what changed immediately before a regression or deployment problem.',
    returns: ['Latest commit hash, message, author, date', 'Files changed in the latest commit', 'Diff excerpt (first 60 lines)', 'List of recent commits'],
    badge: 'Live',
    badgeColor: 'bg-green-900 text-green-300 border-green-700',
    accent: 'border-teal-800',
    note: null,
  },
  {
    name: 'check_service_health',
    signature: 'check_service_health(url="")',
    purpose: 'Performs an HTTP GET against the configured application health endpoint and returns a structured response.',
    useCase: 'Investigating runtime failures or verifying service recovery after a deployment.',
    returns: [
      'healthy- service reachable and reporting healthy',
      'degraded- reachable but reporting a problem (e.g. database unavailable)',
      'unreachable- connection refused, timeout or network error',
    ],
    badge: 'Live',
    badgeColor: 'bg-green-900 text-green-300 border-green-700',
    accent: 'border-blue-800',
    note: 'Default endpoint: http://127.0.0.1:8000/health a configurable via RIPPLE_HEALTH_URL environment variable.',
  },
  {
    name: 'get_ci_status',
    signature: 'get_ci_status()',
    purpose: 'Returns the latest CI pipeline state for recent commits, including pass/fail status and stage breakdown.',
    useCase: 'Checking whether the CI pipeline passed or failed after a code change.',
    returns: ['Pipeline state per commit', 'Stage-level pass/fail breakdown', 'Failure details where applicable'],
    badge: 'Fixture (MVP)',
    badgeColor: 'bg-yellow-900 text-yellow-300 border-yellow-700',
    accent: 'border-purple-800',
    note: 'Current MVP: CI data is sourced from a controlled local fixture (demo_data/ci_status.json). Future versions will integrate directly with GitHub Actions or other CI providers.',
  },
  {
    name: 'get_deployment_info',
    signature: 'get_deployment_info()',
    purpose: 'Returns the latest deployment record including version, environment, deployment timestamp and associated health state.',
    useCase: 'Confirming what version is currently deployed and what environment configuration it is using.',
    returns: ['Deployment version and commit', 'Environment name', 'Deployment timestamp', 'Deployment health state'],
    badge: 'Fixture (MVP)',
    badgeColor: 'bg-yellow-900 text-yellow-300 border-yellow-700',
    accent: 'border-orange-800',
    note: 'Current MVP: deployment data is sourced from a controlled local fixture (demo_data/deployment.json) that matches the demo scenario.',
  },
  {
    name: 'search_project_docs',
    signature: 'search_project_docs(query)',
    purpose: 'Searches local project Markdown documentation including architecture notes, configuration references and runbooks.',
    useCase: 'Retrieving expected configuration, environment variables or troubleshooting guidance from project documentation.',
    returns: ['Relevant doc sections matching the query', 'Source file and section reference'],
    badge: 'Live',
    badgeColor: 'bg-green-900 text-green-300 border-green-700',
    accent: 'border-green-800',
    note: 'Uses deterministic local text search- no embeddings, no additional LLM calls.',
  },
]

export default function Tools() {
  return (
    <section id="tools" className="py-20 px-4 sm:px-6 border-t border-gray-800">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <p className="text-teal-400 text-sm font-medium uppercase tracking-widest mb-3">MCP Tools</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Five focused tools
          </h2>
          <p className="text-gray-400 max-w-2xl text-base leading-relaxed">
            Each tool retrieves a specific type of operational evidence. IBM Bob decides which tools to
            call and in what order based on the developer's question.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {tools.map(t => (
            <div
              key={t.name}
              className={`bg-gray-900 border-l-2 ${t.accent} border border-gray-800 rounded-xl p-5 flex flex-col gap-3`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <code className="text-teal-300 text-sm font-mono bg-teal-950/50 px-2 py-1 rounded">
                  {t.signature}
                </code>
                <span className={`text-xs font-medium border px-2 py-0.5 rounded-full shrink-0 ${t.badgeColor}`}>
                  {t.badge}
                </span>
              </div>

              {/* Purpose */}
              <p className="text-gray-300 text-sm leading-relaxed">{t.purpose}</p>

              {/* Use case */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Use case</p>
                <p className="text-gray-400 text-sm">{t.useCase}</p>
              </div>

              {/* Returns */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">Returns</p>
                <ul className="space-y-1">
                  {t.returns.map(r => (
                    <li key={r} className="text-xs text-gray-500 flex items-start gap-1.5">
                      <span className="text-teal-600 mt-0.5">›</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Note */}
              {t.note && (
                <p className="text-xs text-gray-600 border-t border-gray-800 pt-3 leading-relaxed">
                  {t.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
