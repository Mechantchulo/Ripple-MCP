const statuses = [
  {
    key: 'CI',
    value: 'failing',
    detail: 'tests · erick',
    dot: 'bg-[#f85149]',
    text: 'text-[#f85149]',
  },
  {
    key: 'Deployment',
    value: 'degraded',
    detail: 'production · deploy-14',
    dot: 'bg-[#d29922]',
    text: 'text-[#d29922]',
  },
  {
    key: 'Health',
    value: '503',
    detail: '/health · db unavailable',
    dot: 'bg-[#f85149]',
    text: 'text-[#f85149]',
  },
  {
    key: 'Branch',
    value: 'erick',
    detail: 'b8c4e7a · 1 ahead',
    dot: 'bg-[#58a6ff]',
    text: 'text-[#58a6ff]',
  },
  {
    key: 'PR',
    value: 'open',
    detail: '#10 · ready for review',
    dot: 'bg-[#3fb950]',
    text: 'text-[#3fb950]',
  },
]

export default function StatusStrip() {
  return (
    <section id="status" className="border-b border-[#21262d] bg-[#0d1117]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-0">
        {/* Label row */}
        <div className="flex items-center gap-2 pt-5 pb-3">
          <span className="text-[#484f58] text-xs font-mono uppercase tracking-wider">live demo state</span>
          <span className="text-[#21262d] text-xs">—</span>
          <span className="text-[#484f58] text-xs">Mechantchulo/Ripple-MCP</span>
        </div>

        {/* Status row */}
        <div className="flex flex-wrap gap-0 border border-[#21262d] rounded overflow-hidden mb-5">
          {statuses.map((s, i) => (
            <div
              key={s.key}
              className={`flex-1 min-w-[140px] px-4 py-3 bg-[#161b22] ${i < statuses.length - 1 ? 'border-r border-[#21262d]' : ''}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
                <span className="text-[#8b949e] text-xs font-mono">{s.key}</span>
              </div>
              <div className={`text-sm font-semibold font-mono ${s.text}`}>{s.value}</div>
              <div className="text-[#484f58] text-xs font-mono mt-0.5">{s.detail}</div>
            </div>
          ))}
        </div>

        {/* Caption */}
        <p className="text-[#484f58] text-xs font-mono pb-5">
          $ ripple status — incident active · CI failing · health degraded · PR #10 open
        </p>
      </div>
    </section>
  )
}
