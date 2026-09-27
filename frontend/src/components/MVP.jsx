const current = [
  { label: 'Local Git history', note: 'via git binary- subprocess calls' },
  { label: 'Service health check', note: 'HTTP GET to FastAPI health endpoint' },
  { label: 'CI status', note: 'Local JSON fixture (demo_data/ci_status.json)- simulated' },
  { label: 'Deployment info', note: 'Local JSON fixture (demo_data/deployment.json)- simulated' },
  { label: 'Project Markdown docs', note: 'Local text search, no embeddings, no LLM' },
  { label: 'IBM Bob MCP integration', note: '.bob/mcp.json- STDIO transport' },
]

const future = [
  'GitHub Actions (live CI/CD)',
  'GitHub Pull Requests',
  'Kubernetes / cloud deployment APIs',
  'Grafana / Prometheus (monitoring)',
  'Sentry (error tracking)',
  'Render or other deployment providers',
  'Internal APIs and release management systems',
]

export default function MVP() {
  return (
    <section id="future" className="py-20 px-4 sm:px-6 border-t border-gray-800">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-teal-400 text-sm font-medium uppercase tracking-widest mb-3">Roadmap</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Current MVP vs Future Integrations
          </h2>
          <p className="text-gray-400 max-w-2xl text-base leading-relaxed">
            The current MVP is a working hackathon submission. CI and deployment data use controlled local fixtures.
            Future versions can connect to real external systems.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          {/* Current */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <h3 className="text-white font-semibold">Current MVP</h3>
            </div>
            <ul className="space-y-3">
              {current.map(c => (
                <li key={c.label} className="flex flex-col gap-0.5">
                  <span className="text-gray-200 text-sm">{c.label}</span>
                  <span className="text-gray-500 text-xs">{c.note}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Future */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2 h-2 rounded-full bg-gray-500" />
              <h3 className="text-white font-semibold">Future Integrations</h3>
              <span className="text-xs text-gray-600 ml-auto">not currently implemented</span>
            </div>
            <ul className="space-y-2.5">
              {future.map(f => (
                <li key={f} className="flex items-center gap-2 text-gray-500 text-sm">
                  <span className="text-gray-700">›</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
