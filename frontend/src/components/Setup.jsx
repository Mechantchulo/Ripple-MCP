import CopyButton from './CopyButton'

const STEPS = [
  {
    step: '01',
    title: 'Install once globally',
    desc: 'Install Ripple into an isolated global environment using pipx. The binary is added to your PATH and ready for any repository.',
    cmd: 'pipx install git+https://github.com/Mechantchulo/Ripple-MCP.git',
    note: 'For local development, clone the repo and run: pip install -e .',
  },
  {
    step: '02',
    title: 'Initialize in your project',
    desc: 'Run inside any Git repository. Ripple inspects your repo, auto-detects remotes and branches, and writes .ripple/config.json & .bob/mcp.json.',
    cmd: 'cd my-project\nripple init',
    note: 'Safe & idempotent: preserves any existing servers already configured in .bob/mcp.json.',
  },
  {
    step: '03',
    title: 'Authenticate GitHub (Optional)',
    desc: 'Needed only for creating pull requests. The token is entered with hidden input and stored outside the project in ~/.config/ripple/auth.json.',
    cmd: 'ripple auth github',
    note: 'Alternatively, export RIPPLE_GITHUB_TOKEN in your environment or CI.',
  },
  {
    step: '04',
    title: 'Verify setup with doctor',
    desc: 'Runs a pre-flight readiness check validating Git, GitHub API, application health check endpoints, and imports all 7 MCP tools.',
    cmd: 'ripple doctor',
    note: 'Prints a clean checklist with green checkmarks for verified components.',
  },
]

const ALL_STEPS_SCRIPT = `pipx install git+https://github.com/Mechantchulo/Ripple-MCP.git
cd my-project
ripple init
ripple auth github
ripple doctor`

export default function Setup() {
  return (
    <section id="quickstart" className="border-b border-[#21262d] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-mono uppercase tracking-widest text-[#3fb950]">Setup in 2 minutes</p>
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-[#f0f6fc]">
              Global install. Zero project bloat.
            </h2>
            <p className="text-sm leading-relaxed text-[#8b949e] sm:text-base">
              Ripple lives globally on your workstation. When your coding agent starts in a project folder, Ripple reads that project’s local Git history, files, and health status dynamically.
            </p>
          </div>
          <div className="shrink-0">
            <CopyButton value={ALL_STEPS_SCRIPT} label="Copy all 4 steps" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {STEPS.map(item => (
            <div
              key={item.step}
              className="flex flex-col justify-between rounded-lg border border-[#21262d] bg-[#161b22] p-5 sm:p-6 transition-colors hover:border-[#30363d]"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#58a6ff]">STEP {item.step}</span>
                  <CopyButton value={item.cmd} label="Copy" />
                </div>
                <h3 className="text-base font-semibold text-[#f0f6fc]">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#8b949e] sm:text-sm">{item.desc}</p>
              </div>

              <div className="mt-5">
                <pre className="overflow-x-auto rounded-md border border-[#30363d] bg-[#0d1117] p-3 font-mono text-xs text-[#79c0ff] leading-relaxed">
                  <code>
                    {item.cmd.split('\n').map((line, i) => (
                      <div key={i} className="table-row">
                        <span className="table-cell select-none pr-2.5 text-[#484f58]">$</span>
                        <span className="table-cell">{line}</span>
                      </div>
                    ))}
                  </code>
                </pre>
                <p className="mt-2 text-[11px] font-mono text-[#8b949e]">ℹ {item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
