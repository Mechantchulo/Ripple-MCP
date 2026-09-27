import { useState } from 'react'
import CopyButton from './CopyButton'

const INSTALL_COMMAND = 'pipx install git+https://github.com/Mechantchulo/Ripple-MCP.git'

const SNIPPETS = {
  quick: {
    label: 'Quick Start',
    code: `cd my-project
ripple init
ripple auth github
ripple doctor`,
    summary: 'Initialize Ripple in any Git repo and verify readiness in 10 seconds.',
  },
  pipx: {
    label: 'Global Install (pipx)',
    code: `pipx install git+https://github.com/Mechantchulo/Ripple-MCP.git`,
    summary: 'Installs Ripple globally in an isolated Python environment.',
  },
  dev: {
    label: 'Local Dev (Editable)',
    code: `git clone https://github.com/Mechantchulo/Ripple-MCP.git
cd Ripple-MCP
pip install -e .
ripple doctor`,
    summary: 'Clone and develop locally with live changes.',
  },
}

export default function Hero() {
  const [activeTab, setActiveTab] = useState('quick')

  return (
    <section id="top" className="relative border-b border-[#21262d] px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28">
      <div className="mx-auto max-w-6xl">
        {/* Top Badges */}
        <div className="mb-6 flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#30363d] bg-[#161b22] px-3 py-1 text-xs font-mono text-[#8b949e]">
            <span className="h-2 w-2 rounded-full bg-[#3fb950]" />
            v0.1.0 · Open Source
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#30363d] bg-[#161b22] px-3 py-1 text-xs font-mono text-[#58a6ff]">
            STDIO MCP Server
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#30363d] bg-[#161b22] px-3 py-1 text-xs font-mono text-[#d29922]">
            7 Built-in Tools
          </span>
          <span className="hidden sm:inline-flex items-center rounded-full border border-[#30363d] bg-[#161b22] px-3 py-1 text-xs font-mono text-[#8b949e]">
            Deterministic · No extra LLM
          </span>
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left Column: Value Prop */}
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#f0f6fc] sm:text-5xl lg:text-6xl leading-[1.1]">
              Operational context for your{' '}
              <span className="bg-gradient-to-r from-[#58a6ff] via-[#79c0ff] to-[#bc8cff] bg-clip-text text-transparent">
                coding agent.
              </span>
            </h1>

            <p className="mt-6 text-base leading-relaxed text-[#8b949e] sm:text-lg">
              When an incident strikes or tests fail, stop manually copying Git logs, CI statuses,
              health endpoints, and runbooks into your AI chat. Ripple gives{' '}
              <strong className="font-semibold text-[#e6edf3]">IBM Bob</strong>, Claude, and modern agents
              direct, structured access to project operations.
            </p>

            {/* Quick 1-Click Install Bar */}
            <div className="mt-8 rounded-lg border border-[#30363d] bg-[#161b22] p-2 sm:p-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2 overflow-x-auto pl-2 font-mono text-xs sm:text-sm text-[#e6edf3]">
                  <span className="select-none text-[#58a6ff]">$</span>
                  <span className="truncate">{INSTALL_COMMAND}</span>
                </div>
                <CopyButton value={INSTALL_COMMAND} label="Copy command" />
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#quickstart"
                className="inline-flex items-center gap-2 rounded-md bg-[#238636] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#2ea043] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#238636]"
              >
                Quickstart Guide
                <span aria-hidden="true">↓</span>
              </a>
              <a
                href="#clients"
                className="inline-flex items-center gap-2 rounded-md border border-[#30363d] bg-[#161b22] px-4 py-2 text-sm font-medium text-[#c9d1d9] transition-colors hover:border-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]"
              >
                MCP Client Configs
              </a>
              <a
                href="https://github.com/Mechantchulo/Ripple-MCP"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-[#30363d] px-3.5 py-2 text-sm font-medium text-[#8b949e] transition-colors hover:border-[#8b949e] hover:text-[#f0f6fc]"
              >
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                GitHub
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Terminal */}
          <div className="rounded-lg border border-[#30363d] bg-[#010409] shadow-2xl">
            {/* Terminal Tab Bar */}
            <div className="flex flex-wrap items-center justify-between border-b border-[#21262d] bg-[#161b22] px-4 py-2 gap-2">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#f85149]/80" />
                <span className="h-3 w-3 rounded-full bg-[#d29922]/80" />
                <span className="h-3 w-3 rounded-full bg-[#3fb950]/80" />
                <span className="ml-2 text-xs font-mono text-[#8b949e]">bash</span>
              </div>
              <div className="flex items-center gap-1">
                {Object.entries(SNIPPETS).map(([key, item]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveTab(key)}
                    className={`rounded px-2.5 py-1 text-xs font-mono transition-colors ${
                      activeTab === key
                        ? 'bg-[#21262d] text-[#f0f6fc] font-semibold'
                        : 'text-[#8b949e] hover:text-[#c9d1d9]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Terminal Body */}
            <div className="p-5 font-mono text-xs sm:text-sm">
              <div className="flex items-center justify-between text-[#8b949e] mb-3 text-xs">
                <span>{SNIPPETS[activeTab].summary}</span>
                <CopyButton value={SNIPPETS[activeTab].code} label="Copy snippet" />
              </div>
              <pre className="overflow-x-auto text-[#c9d1d9] leading-relaxed">
                <code>
                  {SNIPPETS[activeTab].code.split('\n').map((line, idx) => (
                    <div key={idx} className="table-row">
                      <span className="table-cell select-none pr-3 text-[#484f58]">$</span>
                      <span className="table-cell">
                        {line.startsWith('#') ? (
                          <span className="text-[#8b949e]">{line}</span>
                        ) : (
                          line
                        )}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>

            {/* Terminal Footer */}
            <div className="flex items-center justify-between border-t border-[#21262d] bg-[#0d1117] px-4 py-2.5 text-xs font-mono text-[#8b949e]">
              <span className="flex items-center gap-1.5 text-[#3fb950]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3fb950]" />
                ready for IBM Bob, Claude, Cursor, Windsurf
              </span>
              <span className="text-[#484f58]">ripple serve</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
