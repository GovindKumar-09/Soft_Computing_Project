import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser, logoutUser } from '../../services/authService'

function Header() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Page load hone par check karega ki user logged in hai ya nahi
    getCurrentUser()
      .then(res => {
        if (res.success) {
          setUser(res.user)
        }
      })
      .catch(() => {
        setUser(null)
      })
  }, [])

  const handleLogout = async () => {
    try {
      await logoutUser()
      setUser(null)
      navigate('/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return (
    <header className="flex items-center justify-between px-6 py-4">
      {/* Brand Logo */}
      <Link to="/" className="text-xl font-bold text-white flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">▶</span>
        AI Learning Assistant
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        <Link to="/" className="text-sm text-slate-300 hover:text-white">Home</Link>
        <Link to="/features" className="text-sm text-slate-300 hover:text-white">Features</Link>
        {user && (
          <Link to="/lectures" className="text-sm text-slate-300 hover:text-white">My Lectures</Link>
        )}
      </div>

      {/* Auth Actions (Login vs Logged In User) */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-indigo-200">
              {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30 transition-all"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="text-sm font-semibold text-slate-300 hover:text-white"
          >
            Sign in
          </Link>
        )}

        <Link
          to={user ? "/upload" : "/login"}
          className="gradient-button px-4 py-2 rounded-xl text-white font-semibold text-sm flex items-center gap-2"
        >
          Upload a lecture →
        </Link>
      </div>
    </header>
  )
}

export default Header