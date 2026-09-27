import { useState } from 'react'

const links = [
  { label: 'Status', href: '#status' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Tools', href: '#tools' },
  { label: 'Workflow', href: '#workflow' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#0d1117]/95 backdrop-blur border-b border-[#21262d]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-12">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2.5 group">
          <span className="w-2 h-2 rounded-full bg-[#3fb950]" />
          <span className="text-[#e6edf3] font-semibold text-sm tracking-tight">ripple</span>
          <span className="text-[#484f58] text-xs font-mono">mcp-gateway</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs text-[#8b949e] hover:text-[#e6edf3] transition-colors px-3 py-1.5 rounded hover:bg-[#161b22]"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Mechantchulo/Ripple-MCP"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs text-[#8b949e] hover:text-[#e6edf3] transition-colors border border-[#30363d] hover:border-[#484f58] px-3 py-1.5 rounded"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            GitHub
          </a>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-[#8b949e] hover:text-[#e6edf3] p-1"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-[#21262d] bg-[#0d1117] px-4 py-3 flex flex-col gap-1">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm text-[#8b949e] hover:text-[#e6edf3] py-2 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="https://github.com/Mechantchulo/Ripple-MCP"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-[#3fb950] mt-1"
          >
            GitHub ↗
          </a>
        </div>
      )}
    </header>
  )
}
