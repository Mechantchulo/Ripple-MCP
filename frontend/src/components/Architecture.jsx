const specs = [
  { label: 'Protocol', value: 'Model Context Protocol (MCP)', note: 'Tool call standard' },
  { label: 'Transport', value: 'STDIO', note: 'Bob spawns Ripple as a child process' },
  { label: 'Server', value: 'Python 3.11+ / mcp SDK v2.2', note: 'server/main.py' },
  { label: 'Tool behaviour', value: 'Deterministic', note: 'No LLM inside Ripple' },
  { label: 'Auth', value: 'Explicit approval', note: 'alwaysAllow: [] — Bob asks before each call' },
  { label: 'Tools registered', value: '7', note: 'All in server/tools/' },
]

const sources = [
  { label: 'GitHub Actions', sub: 'CI status' },
  { label: 'Git (local)', sub: 'Recent changes' },
  { label: 'Health API', sub: 'Service health' },
  { label: 'Deployment', sub: 'Deploy state' },
  { label: 'Markdown docs', sub: 'Project docs' },
  { label: 'GitHub REST', sub: 'Pull requests' },
]

export default function Architecture() {
  return (
    <section id="architecture" className="py-16 px-4 sm:px-6 border-b border-[#21262d]">
      <div className="max-w-5xl mx-auto">

        {/* Section header */}
        <div className="mb-10">
          <p className="text-[#484f58] text-xs font-mono uppercase tracking-widest mb-2">architecture</p>
          <h2 className="text-2xl font-bold text-[#e6edf3] mb-3">
            How Ripple fits into the stack
          </h2>
          <p className="text-sm text-[#8b949e] max-w-xl leading-relaxed">
            IBM Bob is the agent. Ripple is the MCP server. Bob decides which tools to invoke and when —
            Ripple only responds, never initiates.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* Flow diagram */}
          <div className="border border-[#21262d] rounded bg-[#161b22]">
            <div className="px-4 py-2.5 border-b border-[#21262d] flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#21262d]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#21262d]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#21262d]" />
              </div>
              <span className="text-[#484f58] text-xs font-mono ml-1">ripple-architecture.txt</span>
            </div>
            <div className="p-5 font-mono text-sm space-y-1">
              <div className="text-center">
                <span className="text-[#8b949e] text-xs">Developer</span>
              </div>
              <div className="text-center text-[#30363d] text-xs">│</div>
              <div className="text-center text-[#30363d] text-xs">▼  prompt</div>
              <div className="text-center">
                <span className="text-[#e6edf3] bg-[#0d419d] border border-[#1f6feb] px-4 py-1 rounded text-xs inline-block">
                  IBM Bob
                </span>
              </div>
              <div className="text-center text-[#30363d] text-xs">│</div>
              <div className="text-center text-[#484f58] text-xs">MCP tool call · STDIO</div>
              <div className="text-center text-[#30363d] text-xs">▼</div>
              <div className="text-center">
                <span className="text-[#e6edf3] bg-[#161b22] border border-[#30363d] px-4 py-1 rounded text-xs inline-block">
                  Ripple MCP Server
                </span>
              </div>
              <div className="text-center text-[#30363d] text-xs">│</div>
              <div className="text-center text-[#30363d] text-xs">▼  dispatches to</div>
              {/* Sources grid */}
              <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                {sources.map(s => (
                  <div key={s.label} className="border border-[#21262d] rounded px-2.5 py-1.5 text-center">
                    <div className="text-[#8b949e] text-xs">{s.label}</div>
                    <div className="text-[#484f58] text-xs">{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Specs */}
          <div className="space-y-0 border border-[#21262d] rounded overflow-hidden">
            {specs.map((s, i) => (
              <div
                key={s.label}
                className={`flex items-start gap-4 px-4 py-3 bg-[#161b22] ${i < specs.length - 1 ? 'border-b border-[#21262d]' : ''}`}
              >
                <div className="w-28 shrink-0">
                  <span className="text-[#484f58] text-xs font-mono">{s.label}</span>
                </div>
                <div>
                  <div className="text-[#e6edf3] text-xs font-mono">{s.value}</div>
                  <div className="text-[#484f58] text-xs mt-0.5">{s.note}</div>
                </div>
              </div>
            ))}
            <div className="px-4 py-3 bg-[#0d1117] border-t border-[#21262d]">
              <p className="text-[#484f58] text-xs font-mono leading-relaxed">
                # Ripple does not diagnose, decide, or initiate.<br />
                # It retrieves. Bob reasons.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
