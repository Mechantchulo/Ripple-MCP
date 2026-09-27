export default function Hero() {
  return (
    <section id="overview" className="relative py-24 sm:py-32 px-4 sm:px-6 text-center overflow-hidden">
      {/* Subtle background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
      </div>

      <div className="relative max-w-4xl mx-auto">

        {/* Heading */}
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white mb-6">
          Ripple
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-gray-300 max-w-2xl mx-auto mb-4 leading-relaxed">
          Give IBM Bob direct access to your project's operational context.
        </p>

        {/* Supporting copy */}
        <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          Ripple is an MCP-based developer operations gateway that connects IBM Bob to
          project-specific sources such as Git, CI/CD, service health, deployment state
          and project documentation.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://github.com/Mechantchulo/Ripple-MCP"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-gray-950 font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.58 9.58 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            View on GitHub
          </a>
          <a
            href="#solution"
            className="inline-flex items-center gap-2 border border-gray-700 hover:border-teal-700 text-gray-300 hover:text-teal-400 font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
          >
            How Ripple Works ↓
          </a>
        </div>

        {/* Positioning summary */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-medium">Bob</span>
            <span>=</span>
            <span>Reasoning</span>
          </div>
          <div className="w-px h-4 bg-gray-700 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-teal-400 font-medium">Ripple</span>
            <span>=</span>
            <span>Access</span>
          </div>
        </div>
      </div>
    </section>
  )
}
