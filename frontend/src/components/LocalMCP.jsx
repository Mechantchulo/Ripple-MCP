export default function LocalMCP() {
  return (
    <section className="py-20 px-4 sm:px-6 border-t border-gray-800">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Text */}
          <div>
            <p className="text-teal-400 text-sm font-medium uppercase tracking-widest mb-3">Local MCP</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why does Ripple run locally?
            </h2>
            <p className="text-gray-400 text-base leading-relaxed mb-4">
              Ripple currently runs as a <span className="text-white font-medium">local STDIO MCP server</span>.
              IBM Bob starts it from the project workspace by reading{' '}
              <code className="text-teal-300 bg-teal-950/50 text-xs px-1.5 py-0.5 rounded">.bob/mcp.json</code>.
            </p>
            <p className="text-gray-400 text-base leading-relaxed mb-6">
              <span className="text-white font-medium">Local does not mean local-only.</span> Ripple tools can
              still call remote APIs and services over HTTPS. A local MCP server is simply the transport layer
              between Bob and the tools, not a constraint on what those tools can reach.
            </p>

            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start gap-2">
                <span className="text-teal-400 mt-0.5">›</span>
                No separate server to deploy or manage
              </div>
              <div className="flex items-start gap-2">
                <span className="text-teal-400 mt-0.5">›</span>
                Starts and stops with your Bob session
              </div>
              <div className="flex items-start gap-2">
                <span className="text-teal-400 mt-0.5">›</span>
                Works on any developer machine that has the repo
              </div>
              <div className="flex items-start gap-2">
                <span className="text-teal-400 mt-0.5">›</span>
                Can still call GitHub, Grafana or any HTTPS API
              </div>
            </div>
          </div>

          {/* Diagram */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 font-mono text-sm">
            <p className="text-gray-500 text-xs mb-4 uppercase tracking-wider">Transport diagram</p>
            <div className="space-y-2 text-gray-300">
              <div className="text-center">
                <span className="bg-teal-950 border border-teal-700 px-3 py-1.5 rounded text-teal-300 text-sm">IBM Bob</span>
              </div>
              <div className="text-center text-gray-600">↓</div>
              <div className="text-center text-gray-500 text-xs">STDIO transport</div>
              <div className="text-center text-gray-600">↓</div>
              <div className="text-center">
                <span className="bg-gray-800 border border-gray-700 px-3 py-1.5 rounded text-white text-sm">Local Ripple MCP</span>
              </div>
              <div className="text-center text-gray-600">↓</div>
              <div className="text-center text-gray-500 text-xs">HTTPS (when tools call external APIs)</div>
              <div className="text-center text-gray-600">↓</div>
              <div className="flex flex-wrap justify-center gap-2 mt-1">
                {['GitHub', 'Sentry', 'Grafana', 'Render', 'APIs'].map(s => (
                  <span key={s} className="bg-gray-800 border border-gray-700 px-2 py-1 rounded text-xs text-gray-400">
                    {s}
                  </span>
                ))}
              </div>
              <p className="text-center text-xs text-gray-600 mt-3">(future integrations shown)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
