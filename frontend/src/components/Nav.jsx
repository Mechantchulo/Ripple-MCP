import { useState } from 'react'

const links = [
  { label: 'Overview', href: '#overview' },
  { label: 'Problem', href: '#problem' },
  { label: 'How It Works', href: '#solution' },
  { label: 'Tools', href: '#tools' },
  { label: 'Demo', href: '#demo' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Get Access', href: '#access' },
  { label: 'Future', href: '#future' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        {/* Logo */}
        <a href="#overview" className="text-teal-400 font-semibold text-lg tracking-tight">
          Ripple
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-gray-400 hover:text-teal-400 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="https://github.com/Mechantchulo/Ripple-MCP"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-gray-400 hover:text-teal-400 transition-colors"
          >
            GitHub ↗
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-gray-400 hover:text-white"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="lg:hidden border-t border-gray-800 bg-gray-950 px-4 py-4 flex flex-col gap-3">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm text-gray-300 hover:text-teal-400 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="https://github.com/Mechantchulo/Ripple-MCP"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-teal-400"
          >
            GitHub ↗
          </a>
        </nav>
      )}
    </header>
  )
}
