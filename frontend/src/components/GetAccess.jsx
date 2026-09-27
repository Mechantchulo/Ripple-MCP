const steps = [
  {
    n: '1',
    title: 'Clone the repository',
    code: `git clone https://github.com/Mechantchulo/Ripple-MCP.git\ncd Ripple-MCP`,
  },
  {
    n: '2',
    title: 'Create and activate a virtual environment',
    code: `python3 -m venv .venv\nsource .venv/bin/activate   # macOS / Linux\n# Windows: .venv\\Scripts\\Activate.ps1`,
  },
  {
    n: '3',
    title: 'Install dependencies',
    code: `pip install -r requirements.txt`,
    note: 'Installs: mcp[cli]>=1.0  and  python-dotenv>=1.0',
  },
  {
    n: '4',
    title: 'Configure environment (optional)',
    code: `cp .env.example .env\n# Edit .env to change the health endpoint URL if needed`,
    note: 'Default health URL: http://127.0.0.1:8000/health , set via RIPPLE_HEALTH_URL',
  },
  {
    n: '5',
    title: 'Open in IBM Bob IDE',
    code: null,
    note: 'Open this project folder in the IBM Bob IDE. Bob automatically reads .bob/mcp.json and starts the Ripple MCP server as a child process over STDIO.',
  },
  {
    n: '6',
    title: 'Verify connection',
    code: null,
    note: 'Open Bob → Settings → MCP tab. Confirm "ripple" appears as connected. Expand it, all five tools should be listed.',
  },
  {
    n: '7',
    title: 'Use Bob normally',
    code: null,
    note: 'Ask Bob about your project. When Bob calls a Ripple tool you will be prompted to approve. Tool approval is explicit, alwaysAllow is empty in .bob/mcp.json.',
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
            Ripple runs as a local MCP server. No separate installation or service, Bob starts it automatically
            from the project workspace.
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
