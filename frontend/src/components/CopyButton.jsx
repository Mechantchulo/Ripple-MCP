import { useState } from 'react'

export default function CopyButton({
  value,
  label = 'Copy',
  copiedLabel = 'Copied!',
  showLabel = true,
  className = '',
}) {
  const [copied, setCopied] = useState(false)

  async function copy(e) {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers or restricted permissions
      try {
        const textArea = document.createElement('textarea')
        textArea.value = value
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2000)
      } catch {
        setCopied(false)
      }
    }
  }

  const baseClasses =
    'inline-flex items-center gap-1.5 rounded-md border text-xs font-mono font-medium transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#58a6ff]'

  const stateClasses = copied
    ? 'border-[#238636] bg-[#0d2818] text-[#3fb950]'
    : 'border-[#30363d] bg-[#21262d] text-[#c9d1d9] hover:border-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]'

  const paddingClasses = showLabel ? 'px-2.5 py-1.5' : 'p-1.5'

  return (
    <button
      type="button"
      onClick={copy}
      className={`${baseClasses} ${stateClasses} ${paddingClasses} ${className}`}
      aria-label={copied ? 'Copied to clipboard' : `${label} to clipboard`}
      title={copied ? 'Copied!' : label}
    >
      {copied ? (
        <>
          <svg
            className="h-3.5 w-3.5 shrink-0 text-[#3fb950]"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m3.5 8.5 3 3 6-7" />
          </svg>
          {showLabel && <span>{copiedLabel}</span>}
        </>
      ) : (
        <>
          <svg
            className="h-3.5 w-3.5 shrink-0 text-[#8b949e]"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="5.5" y="5.5" width="7.5" height="7.5" rx="1.5" />
            <path d="M10.5 5.5v-2a1.5 1.5 0 0 0-1.5-1.5h-5.5a1.5 1.5 0 0 0-1.5 1.5v5.5a1.5 1.5 0 0 0 1.5 1.5h2" />
          </svg>
          {showLabel && <span>{label}</span>}
        </>
      )}
    </button>
  )
}
