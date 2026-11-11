
import {
  FileVideo,
  Clock,
  Calendar,
  Trash2,
  FileText,
  Brain,
  ArrowUpRight,
  LoaderCircle
} from 'lucide-react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { removeLecture } from '../../features/lectures/lectureSlice'

function LectureCard({ lecture }) {
  const dispatch = useDispatch()

  const id = lecture._id || lecture.id
  const isProcessed =
    lecture.status?.toLowerCase() === 'processed'

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      dispatch(removeLecture(id))
    }
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden group hover:border-purple-500/40 transition duration-300">

      {/* Preview */}
      <div className="h-40 bg-gradient-to-br from-[#302052] to-[#12121e] relative flex items-center justify-center">

        <FileVideo size={48} className="text-purple-300/60" />

        <span className={`absolute top-4 left-4 flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border ${
          isProcessed
            ? 'bg-green-500/10 text-green-400 border-green-500/20'
            : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
        }`}>
          {isProcessed
            ? <FileText size={13} />
            : <LoaderCircle size={13} className="animate-spin" />
          }
          {lecture.status || 'Uploaded'}
        </span>

        <button
          onClick={handleDelete}
          className="absolute top-3 right-3 p-2 rounded-lg bg-black/40 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
          title="Delete lecture"
        >
          <Trash2 size={17} />
        </button>

        {lecture.duration > 0 && (
          <span className="absolute bottom-3 right-3 text-xs bg-black/60 px-2 py-1 rounded">
            {lecture.duration} min
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-5">

        <p className="text-xs text-purple-400 font-medium">
          {lecture.subject || 'General'}
        </p>

        <h3 className="text-lg font-bold mt-2 truncate">
          {lecture.title}
        </h3>

        <div className="flex items-center gap-4 text-xs text-gray-500 mt-4">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {lecture.date
              ? new Date(lecture.date).toLocaleDateString()
              : 'Recently added'}
          </span>

          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {lecture.duration || '--'} min
          </span>
        </div>

        <div className="border-t border-white/5 mt-5 pt-4 flex items-center justify-between">

          {isProcessed ? (
            <Link
              to={`/transcript/${id}`}
              className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-2 font-semibold"
            >
              Open Lecture
              <ArrowUpRight size={16} />
            </Link>
          ) : (
            <span className="text-sm text-orange-400 flex items-center gap-2">
              <LoaderCircle size={15} className="animate-spin" />
              Processing
            </span>
          )}

          {isProcessed && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Brain size={14} />
              AI Ready
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default LectureCard
