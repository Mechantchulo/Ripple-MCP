export default function Closing() {
  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center">

        <p className="text-[#484f58] text-xs font-mono uppercase tracking-widest mb-8">
          ripple / mcp-gateway
        </p>

        <blockquote className="text-2xl sm:text-3xl font-bold text-[#e6edf3] leading-snug mb-4">
          Bob understands the code.
        </blockquote>
        <blockquote className="text-2xl sm:text-3xl font-bold text-[#8b949e] leading-snug mb-12">
          Ripple gives Bob operational awareness.
        </blockquote>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://github.com/Mechantchulo/Ripple-MCP"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#8b949e] hover:text-[#e6edf3] px-4 py-2 rounded border border-[#30363d] hover:border-[#484f58] transition-colors font-mono"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            Mechantchulo/Ripple-MCP
          </a>
          <a
            href="#top"
            className="inline-flex items-center gap-2 text-sm text-[#484f58] hover:text-[#8b949e] transition-colors font-mono"
          >
            ↑ back to top
          </a>
        </div>

      </div>
    </section>
  )
}
