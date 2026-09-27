import Nav from './components/Nav'
import Hero from './components/Hero'
import StatusStrip from './components/StatusStrip'
import Architecture from './components/Architecture'
import Tools from './components/Tools'
import Demo from './components/Demo'
import Closing from './components/Closing'

export default function App() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]" style={{ fontFamily: '-apple-system, "Segoe UI", system-ui, sans-serif' }}>
      <Nav />
      <main>
        <Hero />
        <StatusStrip />
        <Architecture />
        <Tools />
        <Demo />
        <Closing />
      </main>

      <footer className="border-t border-[#21262d] py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#484f58] font-mono">
          <span>ripple · mcp-gateway · 7 tools · Python 3.11 · MCP SDK v2.2</span>
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/Mechantchulo/Ripple-MCP"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#8b949e] transition-colors"
            >
              github.com/Mechantchulo/Ripple-MCP ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
