
import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'

function AuthBrand() {
  return (
    <Link to="/" className="flex justify-center items-center gap-3 mb-9">
      <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
        <Play size={18} fill="white" />
      </div>

      <span className="text-white font-bold text-xl">
        AI Learning <span className="text-indigo-400">Assistant</span>
      </span>
    </Link>
  )
}

export default AuthBrand
