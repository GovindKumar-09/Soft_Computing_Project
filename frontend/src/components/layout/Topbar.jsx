function Topbar() {
  return (
    <header className="h-16 bg-gray-800 text-white flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold">
        AI Video Learning Assistant
      </h2>

      <div className="flex items-center gap-3">
        <span className="text-gray-300">Welcome, Student</span>

        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center">
          A
        </div>
      </div>
    </header>
  )
}

export default Topbar
