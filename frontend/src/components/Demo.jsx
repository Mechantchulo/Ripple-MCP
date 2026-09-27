const steps = [
  {
    index: '01',
    label: 'Incident detected',
    detail: 'Health check returns 503 · deployment marked degraded',
    prompt: 'The latest deployment is unhealthy. Investigate what happened.',
    isPrompt: true,
  },
  {
    index: '02',
    label: 'Bob investigates',
    detail: 'Calls Ripple tools to gather evidence',
    calls: [
      'check_service_health()',
      'get_deployment_info()',
      'get_recent_changes()',
      'get_ci_status()',
      'search_project_docs("database env var")',
    ],
  },
  {
    index: '03',
    label: 'Ripple gathers evidence',
    detail: 'Each tool returns structured data — no LLM inside Ripple',
    evidence: [
      { key: 'health', value: 'status: degraded · db unavailable' },
      { key: 'deploy', value: 'version: 6543c5e · env: production' },
      { key: 'git', value: 'changed: config.py · renamed DB var' },
      { key: 'ci', value: 'status: failing · tests: failing' },
      { key: 'docs', value: 'expects: DATABASE_URL' },
    ],
  },
  {
    index: '04',
    label: 'Bob identifies root cause',
    detail: 'Correlates evidence and reasons about the mismatch',
    finding: 'config.py renamed DATABASE_URL → DB_URL\nEnvironment and docs still reference DATABASE_URL\nHealth check fails: database not connected',
  },
  {
    index: '05',
    label: 'Bob fixes the code',
    detail: 'Restores the correct variable name in config.py',
    diff: '-DB_URL = os.getenv("DB_URL")\n+DATABASE_URL = os.getenv("DATABASE_URL")',
  },
  {
    index: '06',
    label: 'Ripple creates the PR',
    detail: 'Bob calls create_pull_request() through Ripple',
    call: 'create_pull_request(\n  title="fix: restore DATABASE_URL env var name",\n  body="Resolves health degradation...",\n  head_branch="erick",\n  base_branch="main"\n)',
    result: '→ PR #10 · open · https://github.com/Mechantchulo/Ripple-MCP/pull/10',
  },
]

export default function IncidentWorkflow() {
  return (
    <section id="workflow" className="py-16 px-4 sm:px-6 border-b border-[#21262d]">
      <div className="max-w-5xl mx-auto">

        <div className="mb-10">
          <p className="text-[#484f58] text-xs font-mono uppercase tracking-widest mb-2">incident workflow</p>
          <h2 className="text-2xl font-bold text-[#e6edf3] mb-3">
            From incident to merged fix
          </h2>
          <p className="text-sm text-[#8b949e] max-w-xl leading-relaxed">
            A controlled demo scenario: a config variable rename breaks the database connection.
            Bob investigates using Ripple, identifies the root cause, fixes the code, and opens a PR.
          </p>
        </div>

        <div className="space-y-0 border border-[#21262d] rounded overflow-hidden">
          {steps.map((s, i) => (
            <div
              key={s.index}
              className={`flex gap-5 px-5 py-4 bg-[#161b22] ${i < steps.length - 1 ? 'border-b border-[#21262d]' : ''}`}
            >
              {/* Step number + connector */}
              <div className="flex flex-col items-center pt-0.5">
                <span className="text-[#484f58] text-xs font-mono w-5 text-center">{s.index}</span>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 bg-[#21262d] mt-2" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[#e6edf3] text-sm font-medium">{s.label}</span>
                </div>
                <p className="text-[#8b949e] text-xs mb-3">{s.detail}</p>

                {/* Prompt */}
                {s.isPrompt && (
                  <div className="bg-[#0d1117] border border-[#21262d] rounded px-3 py-2.5">
                    <span className="text-[#484f58] text-xs font-mono">developer → IBM Bob</span>
                    <p className="text-[#e6edf3] text-xs mt-1 italic">"{s.prompt}"</p>
                  </div>
                )}

                {/* Tool calls */}
                {s.calls && (
                  <div className="bg-[#0d1117] border border-[#21262d] rounded overflow-hidden">
                    <div className="px-3 py-1.5 border-b border-[#21262d]">
                      <span className="text-[#484f58] text-xs font-mono">IBM Bob → Ripple MCP</span>
                    </div>
                    <div className="p-3 space-y-1">
                      {s.calls.map(c => (
                        <div key={c} className="flex items-center gap-2">
                          <span className="text-[#3fb950] text-xs font-mono">›</span>
                          <code className="text-[#58a6ff] text-xs font-mono">{c}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Evidence */}
                {s.evidence && (
                  <div className="bg-[#0d1117] border border-[#21262d] rounded overflow-hidden">
                    <div className="px-3 py-1.5 border-b border-[#21262d]">
                      <span className="text-[#484f58] text-xs font-mono">Ripple → IBM Bob · structured data</span>
                    </div>
                    <div className="p-3 space-y-1">
                      {s.evidence.map(e => (
                        <div key={e.key} className="flex items-start gap-3 text-xs font-mono">
                          <span className="text-[#484f58] w-12 shrink-0">{e.key}</span>
                          <span className="text-[#8b949e]">{e.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Finding */}
                {s.finding && (
                  <div className="bg-[#0d1117] border border-[#d29922]/40 rounded px-3 py-2.5">
                    <span className="text-[#d29922] text-xs font-mono">root cause</span>
                    <pre className="text-[#8b949e] text-xs font-mono mt-1.5 whitespace-pre-wrap leading-relaxed">{s.finding}</pre>
                  </div>
                )}

                {/* Diff */}
                {s.diff && (
                  <div className="bg-[#0d1117] border border-[#21262d] rounded overflow-hidden">
                    <div className="px-3 py-1.5 border-b border-[#21262d]">
                      <span className="text-[#484f58] text-xs font-mono">demo_app/app/config.py</span>
                    </div>
                    <div className="p-3">
                      {s.diff.split('\n').map((line, li) => (
                        <div
                          key={li}
                          className={`text-xs font-mono px-1 rounded ${line.startsWith('-') ? 'text-[#f85149] bg-[#f8514910]' : 'text-[#3fb950] bg-[#3fb95010]'}`}
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PR call */}
                {s.call && (
                  <div className="space-y-2">
                    <div className="bg-[#0d1117] border border-[#21262d] rounded overflow-hidden">
                      <div className="px-3 py-1.5 border-b border-[#21262d]">
                        <span className="text-[#484f58] text-xs font-mono">IBM Bob → Ripple MCP</span>
                      </div>
                      <pre className="p-3 text-xs font-mono text-[#58a6ff] whitespace-pre-wrap leading-relaxed">{s.call}</pre>
                    </div>
                    <div className="flex items-center gap-2 px-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950] shrink-0" />
                      <code className="text-[#3fb950] text-xs font-mono">{s.result}</code>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
