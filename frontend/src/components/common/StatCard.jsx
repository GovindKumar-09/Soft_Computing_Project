
function StatCard({ icon: Icon, title, value, color }) {
  return (
    <div className="bg-[#191927] border border-[#292938] rounded-xl p-5">
      <Icon className={color} size={28} />

      <p className="text-gray-400 mt-4">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-1">
        {value}
      </h2>
    </div>
  )
}

export default StatCard
