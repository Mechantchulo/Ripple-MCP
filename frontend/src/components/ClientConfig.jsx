import { useState } from 'react'
import CopyButton from './CopyButton'

const CLIENT_CONFIGS = {
  bob: {
    title: 'IBM Bob',
    filename: '.bob/mcp.json',
    description: 'Generated automatically by `ripple init`. Bob discovers and mounts Ripple on workspace load.',
    language: 'json',
    code: `{
  "mcpServers": {
    "ripple": {
      "command": "ripple",
      "args": ["serve"]
    }
  }
}`,
  },
  claude_desktop: {
    title: 'Claude Desktop',
    filename: 'claude_desktop_config.json',
    description: 'Add to ~/Library/Application Support/Claude/claude_desktop_config.json (macOS) or %APPDATA%/Claude/claude_desktop_config.json (Windows).',
    language: 'json',
    code: `{
  "mcpServers": {
    "ripple": {
      "command": "ripple",
      "args": ["serve"]
    }
  }
}`,
  },
  cursor: {
    title: 'Cursor / Windsurf',
    filename: '.cursor/mcp.json',
    description: 'Place in your project’s .cursor/mcp.json or paste into Settings → Features → MCP Servers.',
    language: 'json',
    code: `{
  "mcpServers": {
    "ripple": {
      "command": "ripple",
      "args": ["serve"]
    }
  }
}`,
  },
  claude_code: {
    title: 'Claude Code CLI',
    filename: 'terminal',
    description: 'Register Ripple with Claude Code CLI with a single terminal command.',
    language: 'bash',
    code: `claude mcp add ripple -- ripple serve`,
  },
  inspector: {
    title: 'MCP Inspector',
    filename: 'terminal',
    description: 'Interactively test and inspect Ripple’s 7 tools in your browser via the official MCP Inspector.',
    language: 'bash',
    code: `npx @modelcontextprotocol/inspector ripple serve`,
  },
}

export default function ClientConfig() {
  const [activeClient, setActiveClient] = useState('bob')
  const active = CLIENT_CONFIGS[activeClient]

  return (
    <section id="clients" className="border-b border-[#21262d] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="mb-2 text-xs font-mono uppercase tracking-widest text-[#58a6ff]">MCP Integration</p>
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-[#f0f6fc]">
            Connect your AI coding client
          </h2>
          <p className="text-sm leading-relaxed text-[#8b949e] sm:text-base">
            Ripple is a standard STDIO MCP server. It connects to IBM Bob out-of-the-box, as well as Claude Desktop, Cursor, Windsurf, or any MCP-compatible agent.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 border-b border-[#21262d] pb-3">
          {Object.entries(CLIENT_CONFIGS).map(([key, config]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveClient(key)}
              className={`rounded-md px-3.5 py-2 text-xs font-mono font-medium transition-all ${
                activeClient === key
                  ? 'border border-[#388bfd] bg-[#1f6feb]/15 text-[#58a6ff]'
                  : 'border border-[#30363d] bg-[#161b22] text-[#8b949e] hover:border-[#8b949e] hover:text-[#f0f6fc]'
              }`}
            >
              {config.title}
            </button>
          ))}
        </div>

        {/* Config Display Card */}
        <div className="mt-4 rounded-lg border border-[#30363d] bg-[#010409]">
          <div className="flex flex-wrap items-center justify-between border-b border-[#21262d] bg-[#161b22] px-4 py-3 gap-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-[#e6edf3]">{active.filename}</span>
              <span className="hidden sm:inline text-xs text-[#8b949e]">· {active.description}</span>
            </div>
            <CopyButton value={active.code} label="Copy configuration" />
          </div>

          <pre className="overflow-x-auto p-5 font-mono text-xs sm:text-sm text-[#79c0ff] leading-relaxed">
            <code>{active.code}</code>
          </pre>

          <div className="border-t border-[#21262d] bg-[#0d1117] px-4 py-2.5 text-xs text-[#8b949e]">
            <p>{active.description}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
