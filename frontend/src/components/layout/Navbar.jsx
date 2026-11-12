
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Play, ArrowRight, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'motion/react'
import { useAuth } from '../../app/useAuth'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuth()

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/#features' },
    { name: 'My Lectures', path: '/lectures' },
    { name: 'Quiz', path: '/quiz' }
  ]

  const isLinkActive = (link) => {
    if (link.name === 'Home') {
      return location.pathname === '/' && !location.hash
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

          {/* Segmented Navigation */}
          <div className="relative z-10 hidden lg:flex items-center rounded-full border border-white/[0.07] bg-black/40 p-1.5">

            {links.map((link) => {
              const active = isLinkActive(link)

              const className = `relative z-10 block px-5 py-2.5 text-sm font-medium transition-colors duration-300 ${
                active
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white'
              }`

              return link.name === 'Features' ? (
                <a
                  key={link.name}
                  href="/#features"
                  onClick={() => setMenuOpen(false)}
                  className={className}
                >
                  {active && activeIndicator}
                  {link.name}
                </a>
              ) : (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={className}
                >
                  {active && activeIndicator}
                  {link.name}
                </NavLink>
              )
            })}

          </div>

          {/* Desktop Actions */}
          <div className="relative z-10 hidden md:flex items-center gap-3 shrink-0">

            {isAuthenticated ? (
              <>
                <span className="text-sm text-slate-400">{user?.name || user?.email}</span>
                <button type="button" onClick={logout} className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors">Sign out</button>
              </>
            ) : (
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors">Sign in</Link>
            )}

            {/* Neon Upload Button */}
            <motion.div
              whileHover={{ y: -2, scale: 1.025 }}
              whileTap={{ scale: 0.97 }}
              className="relative isolate group/upload"
            >
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 blur-md opacity-35 group-hover/upload:opacity-80 transition-opacity duration-300" />

              <Link
                to="/upload"
                className="relative flex items-center gap-2 rounded-full border border-violet-300/25 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 group-hover/upload:shadow-[0_0_25px_rgba(139,92,246,0.55)]"
              >
                Upload a lecture
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover/upload:translate-x-1"
                />
              </Link>
            </motion.div>

          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative z-10 lg:hidden text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="lg:hidden mt-3 rounded-3xl border border-white/10 bg-[#100d1c]/95 backdrop-blur-2xl p-4 shadow-2xl"
          >
            <div className="space-y-1">
              {links.map((link) => {
                const active = isLinkActive(link)

                const className = `block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-indigo-600/20 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`

                return link.name === 'Features' ? (
                  <a
                    key={link.name}
                    href="/#features"
                    onClick={() => setMenuOpen(false)}
                    className={className}
                  >
                    {link.name}
                  </a>
                ) : (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    end={link.path === '/'}
                    onClick={() => setMenuOpen(false)}
                    className={className}
                  >
                    {link.name}
                  </NavLink>
                )
              })}
            </div>

            <div className="border-t border-white/10 mt-3 pt-3 space-y-2">
              {isAuthenticated ? (
                <div className="flex items-center justify-between px-2">
                  <span className="text-sm text-slate-400 truncate">{user?.name || user?.email}</span>
                  <button type="button" onClick={logout} className="text-sm text-slate-300 hover:text-white py-2">Sign out</button>
                </div>
              ) : (
                <Link to="/login" className="block text-center text-sm text-slate-300 hover:text-white py-2">Sign in</Link>
              )}

              <Link
                to="/upload"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full py-3 text-sm font-semibold shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              >
                Upload a lecture <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
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