
import { Link } from 'react-router-dom'
import { Upload, ArrowUpRight } from 'lucide-react'

function UploadCard() {
  return (
    <Link
      to="/upload"
      className="min-h-[350px] border-2 border-dashed border-indigo-400/25 hover:border-indigo-400/70 rounded-2xl p-7 flex flex-col items-center justify-center text-center bg-indigo-500/[0.03] hover:bg-indigo-500/[0.08] transition-all group"
    >
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
        <Upload size={28} />
      </div>

      <h3 className="text-white text-lg font-bold">
        Add a new lecture
      </h3>

      <p className="text-slate-500 text-xs leading-6 mt-3 max-w-[220px]">
        Drop in a video or audio file and turn it into a complete learning experience.
      </p>

      <span className="mt-6 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl text-xs font-semibold transition-colors">
        Choose a file <ArrowUpRight size={15} />
      </span>

      <p className="text-slate-600 text-[10px] mt-5">
        MP4 · MOV · WEBM
      </p>
    </Link>
  )
}

export default UploadCard
