const points = [
  {
    title: 'Fewer context switches',
    body: 'Bob retrieves project evidence directly. Developers stay in the conversation instead of jumping between multiple dashboards.',
  },
  {
    title: 'Less manual gathering',
    body: 'Ripple removes the developer from being the middleman between Bob and the systems surrounding the code.',
  },
  {
    title: 'Structured operational evidence',
    body: 'Ripple returns consistent, typed JSON that Bob can reason over reliably not freeform clipboard text.',
  },
  {
    title: 'Reusable project-specific tools',
    body: 'Install Ripple once, then run ripple init in any repository. Each project keeps its own non-secret configuration.',
  },
  {
    title: 'IBM Bob remains central',
    body: 'Ripple never tries to reason or diagnose. All intelligence stays in Bob. Ripple only changes what data Bob can reach.',
  },
]

export default function WhyItMatters() {
  return (
    <section className="py-20 px-4 sm:px-6 border-t border-gray-800">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-teal-400 text-sm font-medium uppercase tracking-widest mb-3">Why Ripple Matters</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Coding agents already understand code.
            <br />
            <span className="text-teal-400">Ripple gives them operational awareness.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {points.map(p => (
            <div key={p.title} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-2 text-sm">{p.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>

        {/* Closing statement */}
        <div className="bg-teal-950/30 border border-teal-800/40 rounded-xl p-6 text-center">
          <p className="text-teal-200 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
            Ripple does not try to make IBM Bob smarter. It makes the project's operational
            context easier for Bob to reach.
          </p>
        </div>
      </div>
    </section>
  )
}
