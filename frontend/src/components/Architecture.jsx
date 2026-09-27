const facts = [
  { label: 'Agent', value: 'IBM Bob IDE', note: 'All reasoning happens here' },
  { label: 'Interface', value: 'Model Context Protocol (MCP)', note: 'Standard tool protocol' },
  { label: 'Transport', value: 'STDIO (local)', note: 'Bob starts Ripple as a child process' },
  { label: 'Server language', value: 'Python 3.11+', note: 'mcp SDK v2.2.0' },
  { label: 'Tool behaviour', value: 'Deterministic', note: 'No LLM inside Ripple' },
  { label: 'Tool approval', value: 'Explicit', note: 'alwaysAllow: [] Bob asks before calling' },
]

export default function Architecture() {
  return (
    <section id="architecture" className="py-20 px-4 sm:px-6 border-t border-gray-800">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-teal-400 text-sm font-medium uppercase tracking-widest mb-3">Architecture</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            How Ripple fits into the stack
          </h2>
          <p className="text-gray-400 max-w-2xl text-base leading-relaxed">
            IBM Bob is the agent. Ripple is the MCP server. Bob decides which tools to invoke and when.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Diagram */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 font-mono text-sm">
            <p className="text-gray-500 text-xs mb-4 uppercase tracking-wider">Component diagram</p>
            <div className="space-y-1 text-gray-300 leading-relaxed">
              <p className="text-center">
                <span className="bg-gray-800 px-3 py-1 rounded text-white">Developer</span>
              </p>
              <p className="text-center text-gray-600">│</p>
              <p className="text-center text-gray-600">▼</p>
              <p className="text-center">
                <span className="bg-teal-950 border border-teal-700 px-3 py-1 rounded text-teal-300">IBM Bob</span>
              </p>
              <p className="text-center text-gray-600">│</p>
              <p className="text-center text-gray-500 text-xs">MCP / STDIO</p>
              <p className="text-center text-gray-600">│</p>
              <p className="text-center text-gray-600">▼</p>
              <p className="text-center">
                <span className="bg-gray-800 border border-gray-700 px-3 py-1 rounded text-white">Ripple MCP Server</span>
              </p>
              <p className="text-center text-gray-600">│</p>
              <p className="text-center text-gray-600">▼</p>
              {/* Sources row */}
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {['Git', 'CI/CD', 'Health', 'Deployment', 'Docs'].map(s => (
                  <span key={s} className="bg-gray-800 border border-gray-700 px-2 py-1 rounded text-xs text-gray-400">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Facts */}
          <div className="space-y-4">
            {facts.map(f => (
              <div key={f.label} className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 shrink-0" />
                <div>
                  <span className="text-gray-500 text-xs uppercase tracking-wider">{f.label}</span>
                  <p className="text-white text-sm font-medium">{f.value}</p>
                  <p className="text-gray-500 text-xs">{f.note}</p>
                </div>
              </div>
            ))}

            <div className="mt-6 p-4 bg-gray-900 border border-gray-800 rounded-lg">
              <p className="text-xs text-gray-400 leading-relaxed">
                <span className="text-teal-400 font-medium">Bob decides everything.</span>{' '}
                Ripple does not initiate conversations, push notifications  or call Bob.
                It only responds when Bob calls a tool.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
