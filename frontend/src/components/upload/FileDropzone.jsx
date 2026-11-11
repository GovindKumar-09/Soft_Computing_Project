
import {
  UploadCloud,
  FolderOpen,
  FileVideo,
  Music2
} from 'lucide-react'

function FileDropzone({
  dragActive,
  onBrowse,
  onDragOver,
  onDragLeave,
  onDrop
}) {
  const handleDragLeave = (event) => {
    event.preventDefault()

    // Prevent flickering when moving over child elements.
    if (!event.currentTarget.contains(event.relatedTarget)) {
      onDragLeave(event)
    }
  }

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={handleDragLeave}
      onDrop={onDrop}
      className={`relative min-h-[290px] flex flex-col items-center justify-center text-center px-5 py-10 sm:px-8 rounded-[14px] overflow-hidden transition-colors duration-300 ${
        dragActive
          ? 'bg-violet-500/[0.08]'
          : 'bg-[#0b0818] hover:bg-[#100c20]'
      }`}
    >

      {/* Subtle Inner Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute w-64 h-64 rounded-full blur-[100px] bg-violet-600/20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 ${
            dragActive ? 'opacity-100' : 'opacity-40'
          }`}
        />
      </div>

      {/* Upload Icon */}
      <div className="relative z-10">

        <div
          className={`relative w-[76px] h-[76px] rounded-2xl flex items-center justify-center border transition-all duration-300 ${
            dragActive
              ? 'bg-violet-500/20 border-violet-300/50 shadow-[0_0_35px_rgba(139,92,246,0.3)] scale-110'
              : 'bg-gradient-to-br from-indigo-500/15 to-violet-500/10 border-violet-400/20 shadow-[0_0_25px_rgba(139,92,246,0.08)]'
          }`}
        >
          <UploadCloud
            size={34}
            strokeWidth={1.6}
            className={`transition-colors duration-300 ${
              dragActive ? 'text-violet-200' : 'text-violet-400'
            }`}
          />

          <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg bg-[#171126] border border-violet-400/30 flex items-center justify-center">
            <FolderOpen size={14} className="text-violet-300" />
          </div>
        </div>

      </div>

      {/* Heading */}
      <div className="relative z-10 mt-7">

        <h3 className="text-white text-xl font-bold tracking-tight">
          {dragActive
            ? 'Drop your lecture here'
            : 'Upload your lecture'}
        </h3>

        <p className="text-slate-400 text-sm mt-3 leading-6">
          Drag and drop your recording here, or
          <button
            type="button"
            onClick={onBrowse}
            className="ml-1.5 text-violet-400 hover:text-violet-300 font-semibold transition-colors underline underline-offset-4 decoration-violet-500/40 hover:decoration-violet-300"
          >
            browse files
          </button>
        </p>

      </div>

      {/* Browse Button */}
      <button
        type="button"
        onClick={onBrowse}
        className="relative z-10 mt-6 flex items-center justify-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 hover:bg-violet-500/20 hover:border-violet-400/60 px-6 py-3 text-sm font-semibold text-violet-200 transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.18)]"
      >
        <FolderOpen size={16} />
        Browse files
      </button>

      {/* Supported Formats */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 mt-7">

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <FileVideo size={13} className="text-violet-400" />
          MP4, MOV, WEBM
        </div>

        <div className="w-1 h-1 rounded-full bg-slate-700" />

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Music2 size={13} className="text-violet-400" />
          MP3, WAV, M4A
        </div>

      </div>

      <p className="relative z-10 text-[10px] text-slate-600 mt-3">
        Maximum file size: 500 MB
      </p>

    </div>
  )
}

export default FileDropzone
