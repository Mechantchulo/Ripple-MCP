import { useState } from 'react'

const NAV_LINKS = [
  { label: 'Quickstart', href: '#quickstart' },
  { label: 'Client Configs', href: '#clients' },
  { label: 'Tools', href: '#tools' },
  { label: 'Incident Demo', href: '#demo' },
  { label: 'Architecture', href: '#architecture' },
]

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[#21262d] bg-[#0d1117]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <a href="#top" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#238636] font-mono text-xs font-black text-white">
            R
          </span>
          <span className="font-bold tracking-tight text-[#f0f6fc]">Ripple</span>
          <span className="hidden sm:inline rounded bg-[#161b22] border border-[#30363d] px-1.5 py-0.5 text-[10px] font-mono text-[#8b949e]">
            MCP Gateway
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-xs font-medium text-[#8b949e] transition-colors hover:bg-[#161b22] hover:text-[#f0f6fc]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Action */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Mechantchulo/Ripple-MCP"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-[#30363d] bg-[#161b22] px-3 py-1.5 text-xs font-mono font-medium text-[#c9d1d9] transition-colors hover:border-[#8b949e] hover:text-[#f0f6fc]"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            GitHub
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-md border border-[#30363d] p-1.5 text-[#8b949e] hover:text-[#f0f6fc]"
            aria-label="Toggle navigation menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-[#21262d] bg-[#0d1117] px-4 py-3 md:hidden">
          <div className="flex flex-col space-y-2">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-[#8b949e] hover:bg-[#161b22] hover:text-[#f0f6fc]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://github.com/Mechantchulo/Ripple-MCP"
              target="_blank"
              rel="noreferrer"
              className="rounded-md px-3 py-2 text-sm font-medium text-[#3fb950] hover:bg-[#161b22]"
            >
              GitHub Repository ↗
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
