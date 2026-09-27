import CopyButton from './CopyButton'

const INCIDENT_PROMPT =
  'The latest deployment is unhealthy. Investigate what happened, find the root cause, and tell me what to fix.'

const STEPS = [
  {
    step: 1,
    title: 'Service Health Check',
    tool: 'check_service_health()',
    finding: 'Endpoint returns HTTP 503 Degraded. Database connection refused.',
    tag: '503 DEGRADED',
    tagColor: 'text-[#f85149] border-[#f85149]/30 bg-[#f85149]/10',
  },
  {
    step: 2,
    title: 'Git History Inspection',
    tool: 'get_recent_changes()',
    finding: 'Latest commit 6543c5e renamed environment variable DATABASE_URL to DB_URL.',
    tag: 'DIFF FOUND',
    tagColor: 'text-[#58a6ff] border-[#58a6ff]/30 bg-[#58a6ff]/10',
  },
  {
    step: 3,
    title: 'Documentation Verification',
    tool: 'search_project_docs("database config")',
    finding: 'Runbook docs specify that the deployment environment injects DATABASE_URL.',
    tag: 'DOC MATCH',
    tagColor: 'text-[#d29922] border-[#d29922]/30 bg-[#d29922]/10',
  },
  {
    step: 4,
    title: 'Automated Pull Request',
    tool: 'create_pull_request("fix: restore DATABASE_URL", ...)',
    finding: 'Agent automatically patches the mismatch and opens a GitHub PR ready for review.',
    tag: 'PR CREATED',
    tagColor: 'text-[#3fb950] border-[#3fb950]/30 bg-[#3fb950]/10',
  },
]

export default function Demo() {
  return (
    <section id="demo" className="border-b border-[#21262d] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="mb-2 text-xs font-mono uppercase tracking-widest text-[#d29922]">Incident Walkthrough</p>
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-[#f0f6fc]">
            One user prompt. Four systems investigated.
          </h2>
          <p className="text-sm leading-relaxed text-[#8b949e] sm:text-base">
            In our hackathon demo scenario, a code refactor renamed a database variable, breaking the health check. See how the AI agent correlates evidence across Git, docs, and health checks to resolve it.
          </p>
        </div>

        {/* Prompt Card with 1-Click Copy */}
        <div className="mb-8 rounded-lg border border-[#388bfd]/40 bg-[#0d1f38]/30 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#58a6ff]">
              Developer prompt to IBM Bob / Claude
            </span>
            <CopyButton value={INCIDENT_PROMPT} label="Copy prompt" />
          </div>
          <p className="font-mono text-sm sm:text-base text-[#f0f6fc]">
            “{INCIDENT_PROMPT}”
          </p>
        </div>

        {/* Step-by-Step Flow */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(item => (
            <div
              key={item.step}
              className="flex flex-col justify-between rounded-lg border border-[#21262d] bg-[#161b22] p-4 transition-colors hover:border-[#30363d]"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#21262d] text-xs font-mono font-bold text-[#8b949e]">
                    {item.step}
                  </span>
                  <span className={`rounded border px-2 py-0.5 text-[10px] font-mono font-medium ${item.tagColor}`}>
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-[#f0f6fc]">{item.title}</h3>
                <code className="mt-2 block rounded bg-[#0d1117] p-2 font-mono text-xs text-[#58a6ff] break-all border border-[#21262d]">
                  {item.tool}
                </code>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-[#8b949e]">{item.finding}</p>
            </div>
          ))}
        </div>

        {/* Comparison: Without Ripple vs With Ripple */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-[#f85149]/20 bg-[#161b22] p-5">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-[#f85149]">
              <span>✕</span> Without Ripple (Manual Frustration)
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-[#8b949e] leading-relaxed">
              <li className="flex gap-2"><span>1.</span> Open terminal to run <code className="text-[#c9d1d9]">git log -p</code> and copy commits.</li>
              <li className="flex gap-2"><span>2.</span> Open browser tab to test <code className="text-[#c9d1d9]">/health</code> endpoint.</li>
              <li className="flex gap-2"><span>3.</span> Open GitHub Actions tab to inspect why CI is red.</li>
              <li className="flex gap-2"><span>4.</span> Search runbooks in Notion or wiki to check variable names.</li>
              <li className="flex gap-2"><span>5.</span> Paste all 4 snippets into AI chat. 15 minutes wasted.</li>
            </ul>
          </div>

          <div className="rounded-lg border border-[#238636]/30 bg-[#0d1f14] p-5">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-[#3fb950]">
              <span>✓</span> With Ripple MCP (Instant Resolution)
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-[#c9d1d9] leading-relaxed">
              <li className="flex gap-2"><span>1.</span> Ask Bob or Claude one question in the chat.</li>
              <li className="flex gap-2"><span>2.</span> Agent automatically queries Ripple’s 7 project tools.</li>
              <li className="flex gap-2"><span>3.</span> Agent correlates Git diff, health failure, and runbook docs.</li>
              <li className="flex gap-2"><span>4.</span> Agent writes the fix and creates a pull request.</li>
              <li className="flex gap-2"><span>5.</span> Resolved in under 30 seconds with full traceability.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
