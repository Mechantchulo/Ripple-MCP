const withRippleSteps = [
  { label: 'Developer asks Bob one question' },
  { label: 'Bob decides which Ripple tools are relevant' },
  { label: 'Ripple fetches structured evidence from each source' },
  { label: 'Bob correlates the evidence' },
  { label: 'Bob explains the likely root cause' },
]

const sources = [
  { label: 'Git', color: 'border-teal-700 text-teal-300' },
  { label: 'CI/CD', color: 'border-blue-700 text-blue-300' },
  { label: 'Service Health', color: 'border-green-700 text-green-300' },
  { label: 'Deployment State', color: 'border-purple-700 text-purple-300' },
  { label: 'Project Docs', color: 'border-yellow-700 text-yellow-300' },
]

export default function Solution() {
  return (
    <section id="solution" className="py-20 px-4 sm:px-6 border-t border-gray-800">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-teal-400 text-sm font-medium uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            One question. All the context.
          </h2>
          <p className="text-gray-400 max-w-2xl text-base leading-relaxed">
            Ripple exposes project sources as focused MCP tools that IBM Bob can call directly.
            Bob remains the reasoning agent; Ripple only exposes trusted, deterministic project tools.{' '}
            <span className="text-white font-medium">Ripple does not contain another chatbot or LLM.</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Flow diagram */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Flow</h3>

            {/* Developer */}
            <div className="flex flex-col items-center gap-1">
              <div className="bg-gray-800 border border-gray-700 rounded-lg px-5 py-2 text-sm font-medium text-white w-40 text-center">
                Developer
              </div>
              <div className="text-gray-600 text-lg">↓</div>

              {/* Bob */}
              <div className="bg-teal-950 border border-teal-700 rounded-lg px-5 py-2 text-sm font-medium text-teal-300 w-40 text-center">
                IBM Bob
              </div>
              <div className="text-gray-600 text-lg">↓ MCP</div>

              {/* Ripple */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg px-5 py-2 text-sm font-medium text-white w-40 text-center">
                Ripple MCP
              </div>
              <div className="text-gray-600 text-lg">↓</div>

              {/* Sources */}
              <div className="flex flex-wrap justify-center gap-2 mt-1">
                {sources.map(s => (
                  <span
                    key={s.label}
                    className={`border rounded px-2.5 py-1 text-xs font-medium ${s.color}`}
                  >
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Steps */}
          <div>
            <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-5">With Ripple</h3>
            <ol className="space-y-4">
              {withRippleSteps.map((s, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className="mt-0.5 w-6 h-6 rounded-full bg-teal-900 border border-teal-700 flex items-center justify-center text-xs text-teal-300 shrink-0 font-medium">
                    {i + 1}
                  </span>
                  <span className="text-gray-300 text-sm leading-relaxed">{s.label}</span>
                </li>
              ))}
            </ol>

            <div className="mt-8 p-4 bg-gray-900 border border-gray-800 rounded-lg">
              <p className="text-xs text-gray-500 leading-relaxed">
                <span className="text-teal-400 font-medium">Important:</span> IBM Bob performs all reasoning and
                root-cause analysis. Ripple only retrieves and structures the evidence.
                Ripple does not reason, infer or diagnose.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
