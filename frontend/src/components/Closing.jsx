import CopyButton from './CopyButton'

const INSTALL_ONE_LINER = 'pipx install git+https://github.com/Mechantchulo/Ripple-MCP.git'

export default function Closing() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[#58a6ff]">
          Built for modern agentic workflows
        </p>

        <h2 className="text-3xl font-extrabold tracking-tight text-[#f0f6fc] sm:text-4xl">
          Your coding agent handles the code.
        </h2>
        <p className="mt-2 text-2xl font-bold text-[#8b949e] sm:text-3xl">
          Ripple delivers the operational reality.
        </p>

        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-[#8b949e]">
          Install once, initialize in seconds, and let your AI coding agent investigate incidents with zero manual tab-switching.
        </p>

        {/* Quick Copy Box */}
        <div className="mx-auto mt-8 max-w-xl rounded-lg border border-[#30363d] bg-[#161b22] p-3 text-left">
          <div className="flex items-center justify-between gap-3">
            <code className="truncate font-mono text-xs text-[#79c0ff] sm:text-sm">
              <span className="select-none text-[#484f58]">$ </span>
              {INSTALL_ONE_LINER}
            </code>
            <CopyButton value={INSTALL_ONE_LINER} label="Copy" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
          <a
            href="#quickstart"
            className="rounded-md border border-[#238636] bg-[#238636] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#2ea043]"
          >
            Get Started ↓
          </a>
          <a
            href="https://github.com/Mechantchulo/Ripple-MCP"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-md border border-[#30363d] bg-[#161b22] px-4 py-2 text-[#c9d1d9] transition-colors hover:border-[#8b949e] hover:text-[#f0f6fc]"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            Mechantchulo/Ripple-MCP
          </a>
          <a
            href="#top"
            className="rounded-md border border-[#30363d] px-3 py-2 text-[#8b949e] transition-colors hover:border-[#8b949e] hover:text-[#f0f6fc]"
          >
            ↑ Back to top
          </a>
        </div>
      </div>
    </section>
  )
}
