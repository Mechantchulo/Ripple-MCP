export default function Hero() {
  return (
    <section id="top" className="pt-20 pb-16 px-4 sm:px-6 border-b border-[#21262d]">
      <div className="max-w-4xl mx-auto">

        {/* Version badge */}
        <div className="flex items-center gap-2 mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8b949e] border border-[#30363d] px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]" />
            v1.0 · 7 tools · MCP SDK v2.2
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl font-bold text-[#e6edf3] tracking-tight leading-tight mb-4">
          Ripple
        </h1>
        <p className="text-xl sm:text-2xl text-[#8b949e] font-normal mb-6 leading-snug">
          Operational context for coding agents.
        </p>

        {/* Core message */}
        <p className="text-base text-[#8b949e] max-w-2xl leading-relaxed mb-3">
          Ripple is an MCP-based operational gateway that gives coding agents like{' '}
          <span className="text-[#e6edf3]">IBM Bob</span> access to the systems around the code —
          Git history, CI pipelines, deployment state, service health, project documentation,
          and GitHub pull requests.
        </p>
        <p className="text-sm text-[#484f58] max-w-xl leading-relaxed mb-10">
          Bob understands the code. Ripple gives Bob operational awareness.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="#workflow"
            className="inline-flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] text-[#e6edf3] text-sm font-medium px-4 py-2 rounded border border-[#2ea043] transition-colors"
          >
            View Demo Flow
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </a>
          <a
            href="https://github.com/Mechantchulo/Ripple-MCP"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#8b949e] hover:text-[#e6edf3] px-4 py-2 rounded border border-[#30363d] hover:border-[#484f58] transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            GitHub
          </a>
        </div>

      </div>
    </section>
  )
}
