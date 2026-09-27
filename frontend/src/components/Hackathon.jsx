export default function Hackathon() {
  return (
    <section className="py-16 px-4 sm:px-6 border-t border-gray-800">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-6">
          {/* Badge */}
          <div className="shrink-0">
            <div className="w-12 h-12 rounded-xl bg-teal-950 border border-teal-800 flex items-center justify-center">
              <svg className="w-6 h-6 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="text-teal-400 text-xs font-medium uppercase tracking-widest mb-2">
              Built for IBM Bob 2.0 Hackathon
            </p>
            <h3 className="text-white font-semibold text-lg mb-3">
              Developer workflow improvement via MCP
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
              Ripple was designed and built specifically to demonstrate how the{' '}
              <span className="text-white font-medium">Model Context Protocol (MCP)</span> can give IBM Bob
              structured, project-specific operational context reducing manual context gathering during
              debugging and incident investigation. The submission includes a complete working MCP server,
              a controlled demo scenario and full hackathon session evidence.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {['IBM Bob IDE', 'MCP', 'Python 3.11+', 'STDIO transport', 'Deterministic tools', 'Developer workflow'].map(tag => (
                <span
                  key={tag}
                  className="text-xs text-gray-400 border border-gray-700 bg-gray-800 px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
