const bobCalls = [
  'get_recent_changes',
  'get_ci_status',
  'check_service_health',
  'get_deployment_info',
  'search_project_docs',
]

export default function Demo() {
  return (
    <section id="demo" className="py-20 px-4 sm:px-6 border-t border-gray-800">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-teal-400 text-sm font-medium uppercase tracking-widest mb-3">Demo Scenario</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            The hackathon demo explained
          </h2>
          <p className="text-gray-400 max-w-2xl text-base leading-relaxed">
            A controlled, reproducible incident designed to show the full Ripple workflow end-to-end.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left — incident setup */}
          <div className="space-y-5">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">The Incident</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                The demo FastAPI application originally expects a database connection string named:
              </p>
              <div className="flex items-center gap-3 mb-4">
                <code className="bg-green-950 border border-green-800 text-green-300 text-sm px-3 py-1.5 rounded font-mono">
                  DATABASE_URL
                </code>
                <span className="text-gray-600 text-xs">expected by project + environment</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                A code change renames the variable to:
              </p>
              <div className="flex items-center gap-3 mb-4">
                <code className="bg-red-950 border border-red-800 text-red-300 text-sm px-3 py-1.5 rounded font-mono">
                  DB_URL
                </code>
                <span className="text-gray-600 text-xs">new (mismatched) variable name</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                The environment and project documentation still reference <code className="text-green-300 text-xs bg-gray-800 px-1.5 py-0.5 rounded">DATABASE_URL</code>.
                This mismatch causes the health check to report the database as{' '}
                <span className="text-yellow-400 font-medium">degraded</span>.
              </p>
            </div>

            {/* Developer prompt */}
            <div className="bg-teal-950/30 border border-teal-800/50 rounded-xl p-5">
              <p className="text-xs text-teal-500 uppercase tracking-wider mb-2">Developer asks IBM Bob</p>
              <p className="text-white text-sm leading-relaxed italic">
                "The latest deployment is unhealthy. Investigate what happened and tell me what to fix."
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-500 leading-relaxed">
                <span className="text-yellow-400">Note:</span> This is a controlled hackathon scenario with synthetic CI and deployment data.
                The incident is intentional and reproducible.
              </p>
            </div>
          </div>

          {/* Right — what happens */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">What happens next</h3>

            {/* Bob box */}
            <div className="flex flex-col items-center gap-1 mb-5">
              <div className="bg-teal-950 border border-teal-700 rounded-lg px-5 py-2 text-sm font-medium text-teal-300 w-full text-center">
                IBM Bob
              </div>
              <div className="text-gray-600 text-sm">↓ calls Ripple tools</div>
            </div>

            {/* Tool calls */}
            <div className="space-y-2 mb-5">
              {bobCalls.map(tool => (
                <div key={tool} className="flex items-center gap-3 bg-gray-800 rounded-lg px-3 py-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                  <code className="text-teal-300 text-xs font-mono">{tool}()</code>
                </div>
              ))}
            </div>

            <div className="text-gray-600 text-sm text-center mb-4">↓</div>

            {/* Outcome */}
            <div className="space-y-2">
              <div className="bg-gray-800 rounded-lg px-4 py-3 text-sm text-gray-300">
                Evidence is correlated by Bob
              </div>
              <div className="bg-gray-800 rounded-lg px-4 py-3 text-sm text-gray-300">
                Root cause identified:{' '}
                <code className="text-red-300 text-xs">DATABASE_URL</code>
                {' → '}
                <code className="text-red-300 text-xs">DB_URL</code>
                {' '}mismatch
              </div>
              <div className="bg-green-950 border border-green-800 rounded-lg px-4 py-3 text-sm text-green-300">
                Bob explains the fix to the developer
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-600 leading-relaxed border-t border-gray-800 pt-4">
              Ripple retrieves the evidence. IBM Bob performs all reasoning. Ripple does not diagnose root causes.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
