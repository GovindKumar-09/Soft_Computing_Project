
import { LoaderCircle, Search, FileVideo } from 'lucide-react'
import DashboardLectureCard from './DashboardLectureCard'
import UploadCard from './UploadCard'

function LectureGrid({
  lectures,
  loading,
  search,
  activeFilter,
  getStatus,
  formatDate,
  formatDuration
}) {
  const hasFilters = search.trim() || activeFilter !== 'all'

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

      {loading && lectures.length === 0 && (
        <div className="col-span-full py-24 flex flex-col items-center justify-center text-center">
          <LoaderCircle size={35} className="text-indigo-400 animate-spin mb-5" />
          <p className="text-white font-medium">Loading your lectures...</p>
          <p className="text-slate-500 text-sm mt-2">
            Getting your library ready.
          </p>
        </div>
      )}

      {!loading && lectures.length === 0 && (
        <div className="col-span-full glass-card py-20 px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6">
            <Search size={27} className="text-indigo-300" />
          </div>

          <h3 className="text-xl font-bold text-white">
            {hasFilters ? 'No matching lectures' : 'Your library is waiting'}
          </h3>

          <p className="text-slate-400 text-sm mt-3 max-w-md mx-auto leading-6">
            {hasFilters
              ? 'Try changing your search or selecting another filter.'
              : 'Upload your first lecture and transform it into notes, quizzes and interactive learning.'
            }
          </p>

          {!hasFilters && (
            <div className="flex justify-center mt-7">
              <FileVideo size={22} className="text-indigo-300" />
            </div>
          )}
        </div>
      )}

      {lectures.map(lecture => (
        <DashboardLectureCard
          key={lecture._id || lecture.id}
          lecture={lecture}
          getStatus={getStatus}
          formatDate={formatDate}
          formatDuration={formatDuration}
        />
      ))}

      <UploadCard />
    </div>
  )
}

export default LectureGrid
