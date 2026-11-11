function Button({ children, onClick, variant = "primary" }) {

  const baseStyle =
    "px-5 py-2.5 rounded-lg font-semibold transition duration-200"

  const variants = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white",
    secondary: "bg-gray-800 hover:bg-gray-700 text-white",
    outline: "border border-gray-600 hover:bg-gray-800 text-white"
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]}`}
    >
      {children}
    </button>
  )
}

export default Button