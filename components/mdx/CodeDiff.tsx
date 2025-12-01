'use client'

interface CodeDiffProps {
  before: string
  after: string
  language?: string
  beforeLabel?: string
  afterLabel?: string
}

export function CodeDiff({
  before,
  after,
  language = 'plaintext',
  beforeLabel = 'Avant',
  afterLabel = 'Après'
}: CodeDiffProps) {
  return (
    <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
      {/* Before */}
      <div className="border-3 border-border overflow-hidden">
        <div className="bg-red-500 text-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
          <span className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center bg-white/20 text-xs">−</span>
          {beforeLabel}
        </div>
        <pre className="p-3 sm:p-4 bg-bg-inverse text-text-inverse overflow-x-auto text-xs sm:text-sm">
          <code className="font-mono" data-language={language}>
            {before}
          </code>
        </pre>
      </div>

      {/* After */}
      <div className="border-3 border-border overflow-hidden">
        <div className="bg-emerald-500 text-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
          <span className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center bg-white/20 text-xs">+</span>
          {afterLabel}
        </div>
        <pre className="p-3 sm:p-4 bg-bg-inverse text-text-inverse overflow-x-auto text-xs sm:text-sm">
          <code className="font-mono" data-language={language}>
            {after}
          </code>
        </pre>
      </div>
    </div>
  )
}

export default CodeDiff
