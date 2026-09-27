const steps = [
  {
    n: '1',
    title: 'Install Ripple globally',
    code: `pipx install git+https://github.com/Mechantchulo/Ripple-MCP.git`,
    note: 'Run this once. The ripple command is then available from every project.',
  },
  {
    n: '2',
    title: 'Initialize the current project',
    code: `cd my-project\nripple init`,
    note: 'Creates .ripple/config.json and safely adds Ripple to .bob/mcp.json.',
  },
  {
    n: '3',
    title: 'Authenticate GitHub writes',
    code: `ripple auth github`,
    note: 'The token prompt is hidden. The credential is stored outside the repository.',
  },
  {
    n: '4',
    title: 'Run the health check',
    code: `ripple doctor`,
    note: 'Checks Git, GitHub connectivity, authentication, health endpoint, MCP readiness, and all seven tools.',
  },
  {
    n: '5',
    title: 'Connect an MCP client',
    code: `ripple serve`,
    note: 'IBM Bob reads the generated config automatically. Other STDIO MCP clients can launch the same command.',
  },
  {
    n: '6',
    title: 'Verify connection',
    code: null,
    note: 'Confirm ripple is connected and all seven project-aware tools are listed.',
  },
]

export default function GetAccess() {
  return (
    <section id="access" className="py-20 px-4 sm:px-6 border-t border-gray-800">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-teal-400 text-sm font-medium uppercase tracking-widest mb-3">Get Access</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Use Ripple
          </h2>
          <p className="text-gray-400 max-w-2xl text-base leading-relaxed">
            Install Ripple once with pipx, initialize each project, and let any STDIO MCP client launch it
            with <code className="text-teal-300">ripple serve</code>.
          </p>
        </div>

        <div className="space-y-4">
          {steps.map(s => (
            <div key={s.n} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <span className="w-7 h-7 rounded-full bg-teal-900 border border-teal-700 text-teal-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {s.n}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium mb-2">{s.title}</h3>
                  {s.code && (
                    <pre className="bg-gray-950 border border-gray-700 rounded-lg p-4 text-sm text-teal-300 font-mono overflow-x-auto whitespace-pre leading-relaxed mb-2">
                      {s.code}
                    </pre>
                  )}
                  {s.note && (
                    <p className="text-gray-500 text-xs leading-relaxed">{s.note}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="https://github.com/Mechantchulo/Ripple-MCP"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-gray-950 font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
          >
            View Repository ↗
          </a>
          <a
            href="https://github.com/Mechantchulo/Ripple-MCP/blob/main/.env.example"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-gray-700 hover:border-gray-600 text-gray-400 hover:text-white px-5 py-2.5 rounded-lg transition-colors text-sm"
          >
            View .env.example ↗
          </a>
        </div>
      </div>
    </section>
  )
}
