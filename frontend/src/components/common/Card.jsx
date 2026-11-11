function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-[#191927] border border-[#292938] rounded-xl p-5 ${className}`}
    >
      {children}
    </div>
  )
}

export default Card