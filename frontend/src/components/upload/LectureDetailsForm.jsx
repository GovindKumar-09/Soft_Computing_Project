
function LectureDetailsForm({ title, setTitle, subject, setSubject }) {
  return (
    <div className="glass-card p-5 sm:p-7">
      <h2 className="text-white text-lg font-bold mb-2">
        Lecture details
      </h2>

      <p className="text-slate-500 text-xs mb-7">
        Give your recording a name so you can find it easily.
      </p>

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Lecture title
          </label>

          <input
            type="text"
            value={title}
            onChange={event => setTitle(event.target.value)}
            placeholder="e.g. Introduction to Database Management"
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/60 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Subject or course
          </label>

          <input
            type="text"
            value={subject}
            onChange={event => setSubject(event.target.value)}
            placeholder="e.g. Operating Systems"
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/60 transition-colors"
          />
        </div>
      </div>
    </div>
  )
}

export default LectureDetailsForm
