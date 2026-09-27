import Nav from './components/Nav'
import Hero from './components/Hero'
import Setup from './components/Setup'
import ClientConfig from './components/ClientConfig'
import Tools from './components/Tools'
import Demo from './components/Demo'
import Architecture from './components/Architecture'
import Closing from './components/Closing'

export default function App() {
  return (
    <div
      className="min-h-screen bg-[#0d1117] text-[#e6edf3]"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
    >
      <Nav />
      <main>
        <Hero />
        <Setup />
        <ClientConfig />
        <Tools />
        <Demo />
        <Architecture />
        <Closing />
      </main>

      <footer className="border-t border-[#21262d] px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs font-mono text-[#8b949e] sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#3fb950]" />
            <span>Ripple v0.1.0 · Global MCP Operational Gateway</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/Mechantchulo/Ripple-MCP"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-[#f0f6fc]"
            >
              GitHub Repository ↗
            </a>
            <a
              href="https://github.com/Mechantchulo/Ripple-MCP/blob/main/README.md"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-[#f0f6fc]"
            >
              Documentation ↗
            </a>
            <a href="#top" className="transition-colors hover:text-[#f0f6fc]">
              ↑ Top
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
