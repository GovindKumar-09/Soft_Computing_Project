
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLectures } from '../features/lectures/lectureSlice'

import DashboardHeader from '../components/dashboard/DashboardHeader'
import DashboardStats from '../components/dashboard/DashboardStats'
import LectureFilters from '../components/dashboard/LectureFilters'
import LectureGrid from '../components/dashboard/LectureGrid'

import {
  FileVideo,
  CheckCircle2,
  LoaderCircle
} from 'lucide-react'

function getLectureStatus(lecture) {
  const status = (lecture.status || '').toLowerCase()

  if (['processed', 'completed'].includes(status)) return 'completed'
  if (status === 'failed') return 'failed'

  return 'processing'
}

function Dashboard() {
  const dispatch = useDispatch()

  const {
    lectures = [],
    loading,
    error
  } = useSelector(state => state.lectures)

  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')

  useEffect(() => {
    dispatch(fetchLectures())
  }, [dispatch])

  // Search, filter and sort
  const filteredLectures = useMemo(() => {
    let result = [...lectures]

    if (search.trim()) {
      const term = search.toLowerCase()

      result = result.filter(lecture =>
        `${lecture.title || ''} ${lecture.subject || ''}`
          .toLowerCase()
          .includes(term)
      )
    }

    if (activeFilter !== 'all') {
      result = result.filter(
        lecture => getLectureStatus(lecture) === activeFilter
      )
    }

    result.sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt || 0).getTime()
      const dateB = new Date(b.date || b.createdAt || 0).getTime()

      return sortOrder === 'newest'
        ? dateB - dateA
        : dateA - dateB
    })

    return result
  }, [lectures, search, activeFilter, sortOrder])

  // Statistics
  const completedCount = lectures.filter(
    lecture => getLectureStatus(lecture) === 'completed'
  ).length

  const processingCount = lectures.filter(
    lecture => getLectureStatus(lecture) === 'processing'
  ).length

  const stats = [
    {
      title: 'Total lectures',
      value: lectures.length,
      icon: FileVideo,
      color: 'text-indigo-300',
      background: 'bg-indigo-500/15'
    },
    {
      title: 'Completed',
      value: completedCount,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      background: 'bg-emerald-500/10'
    },
    {
      title: 'Processing',
      value: processingCount,
      icon: LoaderCircle,
      color: 'text-amber-400',
      background: 'bg-amber-500/10'
    }
  ]

  // Formatting helpers
  const formatDate = date => {
    if (!date) return 'Recently added'

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Recently added'
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatDuration = duration => {
    if (!duration) return 'Duration unavailable'

    const minutes = Math.floor(duration / 60)
    const seconds = Math.floor(duration % 60)

    return `${minutes}:${String(seconds).padStart(2, '0')} min`
  }

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[500px] bg-indigo-700/20 blur-[150px] rounded-full" />
        <div className="absolute top-[500px] -right-40 w-[450px] h-[450px] bg-violet-700/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

        <DashboardHeader />

        <DashboardStats stats={stats} />

        <section className="pb-24">

          {/* Library heading */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-7">
            <div>
              <p className="text-indigo-400 text-xs font-bold uppercase tracking-[0.18em]">
                Your library
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3">
                All lectures
              </h2>

              <p className="text-slate-500 text-sm mt-2">
                Manage and revisit your uploaded learning material.
              </p>
            </div>
          </div>

          <LectureFilters
            search={search}
            setSearch={setSearch}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            loading={loading}
            onRefresh={() => dispatch(fetchLectures())}
          />

          {error && (
            <div className="mb-6 border border-red-500/20 bg-red-500/10 rounded-xl p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <LectureGrid
            lectures={filteredLectures}
            loading={loading}
            search={search}
            activeFilter={activeFilter}
            getStatus={getLectureStatus}
            formatDate={formatDate}
            formatDuration={formatDuration}
          />

        </section>
      </div>
    </div>
  )
}

export default Dashboard
