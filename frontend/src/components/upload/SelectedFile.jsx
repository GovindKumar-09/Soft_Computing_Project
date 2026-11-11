
import {
  FileVideo,
  FileAudio,
  X,
  CheckCircle2
} from 'lucide-react'

function SelectedFile({ file, onRemove, onChoose, isAudio, formatSize }) {
  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/[0.06] p-5">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-300 shrink-0">
          {isAudio ? <FileAudio size={27} /> : <FileVideo size={27} />}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-white font-semibold text-sm truncate">
            {file.name}
          </p>

          <p className="text-slate-500 text-xs mt-2">
            {formatSize(file.size)} · {file.name.split('.').pop().toUpperCase()}
          </p>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="w-9 h-9 rounded-lg bg-white/5 hover:bg-red-500/15 text-slate-400 hover:text-red-400 flex items-center justify-center transition-colors"
          aria-label="Remove file"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-2 text-emerald-400 text-xs">
        <CheckCircle2 size={15} />
        File selected and format validated
      </div>

      <button
        type="button"
        onClick={onChoose}
        className="mt-5 text-xs font-semibold text-indigo-300 hover:text-white"
      >
        Choose a different file
      </button>
    </div>
  )
}

export default SelectedFile
