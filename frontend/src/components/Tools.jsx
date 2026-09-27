const tools = [
  {
    name: 'get_recent_changes',
    sig: '(max_commits=5)',
    group: 'git',
    desc: 'Latest commit hash, message, changed files, diff excerpt, and recent commit list.',
    use: 'What changed just before this regression?',
    returns: 'commit · message · changed_files · diff_excerpt · recent_commits',
    source: 'local git',
  },
  {
    name: 'check_service_health',
    sig: '(url="")',
    group: 'health',
    desc: 'HTTP GET against the health endpoint — returns healthy / degraded / unreachable.',
    use: 'Is the app up? What did the health check say after the deploy?',
    returns: 'reachable · status · http_code · error',
    source: 'live HTTP',
  },
  {
    name: 'get_ci_status',
    sig: '()',
    group: 'ci',
    desc: 'Latest GitHub Actions run for the branch — pass/fail, triggering commit, stage breakdown.',
    use: 'Did CI pass after this commit?',
    returns: 'status · workflow · commit · stages · pipeline_url',
    source: 'GitHub Actions API',
  },
  {
    name: 'get_deployment_info',
    sig: '()',
    group: 'deploy',
    desc: 'Latest deployment record: version, environment, timestamp, deploy status, health result.',
    use: 'What version is in production right now?',
    returns: 'version · environment · deployed_at · status · health_check',
    source: 'deployment fixture',
  },
  {
    name: 'search_project_docs',
    sig: '(query)',
    group: 'docs',
    desc: 'Keyword-scores local Markdown docs and returns up to 3 matching sections with excerpts.',
    use: 'What env var does this project expect for the database?',
    returns: 'sections · title · excerpt · source_file',
    source: 'local docs',
  },
  {
    name: 'create_pull_request',
    sig: '(title, body, head_branch="", base_branch="main")',
    group: 'github',
    desc: 'Creates a GitHub PR via REST API. Auto-detects head branch from local git if omitted.',
    use: 'Code is fixed, tests pass — open a PR.',
    returns: 'success · pr_number · title · state · head_branch · base_branch · url',
    source: 'GitHub REST API',
  },
  {
    name: 'get_pull_request_status',
    sig: '(pr_number)',
    group: 'github',
    desc: 'Returns PR state, merged/mergeable flags, and CI check-run results for the head commit.',
    use: 'Has the PR been reviewed? Are checks passing?',
    returns: 'state · merged · mergeable · checks · url',
    source: 'GitHub REST API',
  },
]

const groupColors = {
  git:    'text-[#58a6ff]',
  health: 'text-[#3fb950]',
  ci:     'text-[#d29922]',
  deploy: 'text-[#d29922]',
  docs:   'text-[#8b949e]',
  github: 'text-[#bc8cff]',
}

const groupDots = {
  git:    'bg-[#58a6ff]',
  health: 'bg-[#3fb950]',
  ci:     'bg-[#d29922]',
  deploy: 'bg-[#d29922]',
  docs:   'bg-[#8b949e]',
  github: 'bg-[#bc8cff]',
}

export default function Tools() {
  return (
    <section id="tools" className="py-16 px-4 sm:px-6 border-b border-[#21262d]">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <p className="text-[#484f58] text-xs font-mono uppercase tracking-widest mb-2">mcp tools</p>
          <h2 className="text-2xl font-bold text-[#e6edf3] mb-2">
            7 registered tools
          </h2>
          <p className="text-sm text-[#8b949e] max-w-xl">
            Each tool retrieves one type of operational evidence. IBM Bob decides which to call and in what order.
          </p>
        </div>

        {/* Command-palette style list */}
        <div className="border border-[#21262d] rounded overflow-hidden">

          {/* Header row */}
          <div className="flex items-center px-4 py-2 bg-[#0d1117] border-b border-[#21262d] text-[#484f58] text-xs font-mono">
            <span className="w-56 shrink-0">tool</span>
            <span className="hidden sm:block flex-1">description</span>
            <span className="hidden md:block w-36 text-right shrink-0">source</span>
          </div>

          {tools.map((t, i) => (
            <div
              key={t.name}
              className={`group px-4 py-3 bg-[#161b22] hover:bg-[#1c2128] transition-colors ${i < tools.length - 1 ? 'border-b border-[#21262d]' : ''}`}
            >
              {/* Top row */}
              <div className="flex items-start gap-3">
                {/* Dot + name */}
                <div className="flex items-center gap-2 w-56 shrink-0 min-w-0">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-0.5 ${groupDots[t.group]}`} />
                  <div className="min-w-0">
                    <code className={`text-xs font-mono font-semibold ${groupColors[t.group]}`}>
                      {t.name}
                    </code>
                    <code className="text-[#484f58] text-xs font-mono">{t.sig}</code>
                  </div>
                </div>

                {/* Desc — hidden on small */}
                <p className="hidden sm:block flex-1 text-xs text-[#8b949e] leading-relaxed pt-0.5">
                  {t.desc}
                </p>

                {/* Source badge */}
                <span className="hidden md:block w-36 text-right text-xs text-[#484f58] font-mono shrink-0 pt-0.5">
                  {t.source}
                </span>
              </div>

              {/* Expanded detail — always visible on small, collapsible feel on large */}
              <div className="mt-2 ml-5 space-y-1">
                <p className="sm:hidden text-xs text-[#8b949e] leading-relaxed">{t.desc}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-0.5">
                  <span className="text-xs text-[#484f58] font-mono">
                    <span className="text-[#30363d]">use: </span>{t.use}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {t.returns.split(' · ').map(r => (
                    <span
                      key={r}
                      className="text-xs font-mono text-[#484f58] bg-[#0d1117] border border-[#21262d] px-1.5 py-0.5 rounded"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-[#484f58] font-mono">
          # Registered in server/main.py · implemented in server/tools/
        </p>
      </div>
    </section>
  )
}
