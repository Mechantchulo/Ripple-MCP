const steps = [
  { icon: '🔔', label: 'Incident occurs' },
  { icon: '📂', label: 'Open Git, find the relevant commit' },
  { icon: '⚙️', label: 'Open CI dashboard and check the build' },
  { icon: '🚀', label: 'Check deployment records, what is running?' },
  { icon: '🩺', label: 'Hit the health endpoint, is the service up?' },
  { icon: '📖', label: 'Find the runbook and look up expected config' },
  { icon: '📋', label: 'Copy all context back into the AI' },
  { icon: '💬', label: 'Ask the question' },
]

const capabilities = [
  'Read and edit source files',
  'Run tests and fix local bugs',
  'Use the terminal',
  'Refactor and explain code',
]

export default function Problem() {
  return (
    <section id="problem" className="py-20 px-4 sm:px-6 border-t border-gray-800">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-teal-400 text-sm font-medium uppercase tracking-widest mb-3">The Problem</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Developers are the middleman
          </h2>
          <p className="text-gray-400 max-w-2xl text-base leading-relaxed">
            Modern coding agents already handle code well. The gap is the{' '}
            <span className="text-white font-medium">fragmented operational context outside the codebase</span>.
            When a deployment fails, developers manually collect evidence from multiple systems then
            carry it all back to the AI.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* What Bob can already do */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              IBM Bob already handles
            </h3>
            <ul className="space-y-3">
              {capabilities.map(c => (
                <li key={c} className="flex items-center gap-3 text-gray-300 text-sm">
                  <svg className="w-4 h-4 text-green-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.707-4.707a1 1 0 011.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-5 border-t border-gray-800">
              <p className="text-sm text-gray-500 leading-relaxed">
                The gap Ripple addresses is the <span className="text-teal-400">operational context around the code</span> :
                what changed, what is deployed, what is healthy and what the project expects.
              </p>
            </div>
          </div>

          {/* Without Ripple workflow */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
              Without Ripple- investigating an incident
            </h3>
            <ol className="space-y-2">
              {steps.map((s, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-400">
                  <span className="w-5 h-5 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs text-gray-500 shrink-0">
                    {i + 1}
                  </span>
                  <span>{s.label}</span>
                  {i < steps.length - 1 && (
                    <span className="ml-auto text-gray-700">↓</span>
                  )}
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs text-gray-600 italic">
              Developer becomes the human API between systems and the coding agent.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
