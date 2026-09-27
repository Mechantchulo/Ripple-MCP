import Nav from './components/Nav'
import Hero from './components/Hero'
import Problem from './components/Problem'
import Solution from './components/Solution'
import Tools from './components/Tools'
import Demo from './components/Demo'
import Architecture from './components/Architecture'
import GetAccess from './components/GetAccess'
import LocalMCP from './components/LocalMCP'
import MVP from './components/MVP'
import WhyItMatters from './components/WhyItMatters'
import Hackathon from './components/Hackathon'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Tools />
        <Demo />
        <Architecture />
        <GetAccess />
        <LocalMCP />
        <MVP />
        <WhyItMatters />
        <Hackathon />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-10 px-4 sm:px-6 text-center">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <span>
            <span className="text-teal-400 font-medium">Ripple</span> — MCP Developer Operations Gateway
          </span>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/Mechantchulo/Ripple-MCP"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gray-400 transition-colors"
            >
              GitHub ↗
            </a>
            <a href="#overview" className="hover:text-gray-400 transition-colors">
              Back to top ↑
            </a>
          </div>
        </div>
        <p className="mt-6 text-xs text-gray-800">
          IBM Bob 2.0 Hackathon submission
        </p>
      </footer>
    </div>
  )
}
