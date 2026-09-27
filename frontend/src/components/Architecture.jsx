export default function Architecture() {
  return (
    <section id="architecture" className="border-b border-[#21262d] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="mb-2 text-xs font-mono uppercase tracking-widest text-[#58a6ff]">Architecture</p>
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-[#f0f6fc]">
            Global engine. Local repository context.
          </h2>
          <p className="text-sm leading-relaxed text-[#8b949e] sm:text-base">
            Ripple is not another AI chatbot. It is a deterministic, fast MCP server executing native Git commands, HTTP health checks, and local file searches.
          </p>
        </div>

        {/* Diagram Card */}
        <div className="rounded-lg border border-[#30363d] bg-[#010409] p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-3 items-center">
            {/* Box 1: Client */}
            <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-5 text-center">
              <span className="inline-block rounded border border-[#1f6feb]/30 bg-[#1f6feb]/10 px-2 py-0.5 text-[11px] font-mono text-[#58a6ff] mb-2">
                Agent / MCP Client
              </span>
              <h3 className="text-base font-bold text-[#f0f6fc]">IBM Bob / Claude / Cursor</h3>
              <p className="mt-2 text-xs text-[#8b949e]">
                Reasons over user prompts, picks which Ripple tools to call, and plans fixes.
              </p>
            </div>

            {/* Middle: MCP STDIO Protocol */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-2 text-xs font-mono text-[#8b949e] mb-1">
                <span>STDIO Protocol</span>
              </div>
              <div className="w-full flex items-center justify-center">
                <span className="hidden lg:block h-0.5 w-16 bg-[#30363d]" />
                <span className="rounded-md border border-[#238636] bg-[#0d2818] px-3 py-1 font-mono text-xs font-bold text-[#3fb950]">
                  ripple serve
                </span>
                <span className="hidden lg:block h-0.5 w-16 bg-[#30363d]" />
              </div>
              <span className="mt-2 text-[11px] font-mono text-[#484f58]">JSON-RPC 2.0 via STDIO</span>
            </div>

            {/* Box 3: Sources */}
            <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-5 text-center">
              <span className="inline-block rounded border border-[#238636]/30 bg-[#238636]/10 px-2 py-0.5 text-[11px] font-mono text-[#3fb950] mb-2">
                Project Operations
              </span>
              <h3 className="text-base font-bold text-[#f0f6fc]">Operational Sources</h3>
              <p className="mt-2 text-xs text-[#8b949e]">
                Git repository · FastAPI health check · GitHub Actions CI · Markdown docs · GitHub PR API
              </p>
            </div>
          </div>

          {/* Three Key Architectural Pillars */}
          <div className="mt-8 grid gap-4 border-t border-[#21262d] pt-8 sm:grid-cols-3">
            <div>
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#e6edf3]">
                1. Single Global Install
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-[#8b949e]">
                Install once via <code className="text-[#c9d1d9]">pipx</code>. You don't need a virtualenv or clone inside every project.
              </p>
            </div>
            <div>
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#e6edf3]">
                2. Project-Local Scoping
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-[#8b949e]">
                Each workspace gets non-secret settings in <code className="text-[#c9d1d9]">.ripple/config.json</code> and <code className="text-[#c9d1d9]">.bob/mcp.json</code>.
              </p>
            </div>
            <div>
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#e6edf3]">
                3. Ironclad Token Security
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-[#8b949e]">
                Secrets are stored in <code className="text-[#c9d1d9]">~/.config/ripple/auth.json</code> with 0600 permissions, never in repo or git history.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
