
function DashboardStats({ stats }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
      {stats.map(stat => {
        const Icon = stat.icon

        return (
          <div
            key={stat.title}
            className="glass-card p-6 flex items-center justify-between hover:border-indigo-500/30 transition-colors"
          >
            <div>
              <p className="text-sm text-slate-400">{stat.title}</p>
              <h2 className="text-3xl font-bold text-white mt-3">
                {stat.value}
              </h2>
            </div>

            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.background} ${stat.color}`}>
              <Icon size={23} />
            </div>
          </div>
        )
      })}
    </section>
  )
}

export default DashboardStats
