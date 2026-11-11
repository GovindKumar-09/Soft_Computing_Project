
function ConceptCard({ item, index }) {
  const title = typeof item === 'string'
    ? item
    : item.title || item.name || `Concept ${index + 1}`

  const description = typeof item === 'string'
    ? ''
    : item.description || item.explanation || item.text || ''

  return (
    <article className="glass-card p-6 hover:border-indigo-500/40 transition-colors">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 shrink-0 rounded-xl bg-indigo-500/15 text-indigo-300 flex items-center justify-center font-bold text-sm">
          {String(index + 1).padStart(2, '0')}
        </div>

        <div>
          <h3 className="text-white text-base font-bold">{title}</h3>
          <p className="text-slate-400 text-sm leading-7 mt-3">
            {description}
          </p>
        </div>
      </div>
    </article>
  )
}

export default ConceptCard
