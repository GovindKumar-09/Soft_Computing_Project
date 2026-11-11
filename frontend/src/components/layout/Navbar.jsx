
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Play, ArrowRight, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/#features' },
    { name: 'My Lectures', path: '/lectures' },
    { name: 'Quiz', path: '/quiz' }
  ]

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, location.hash])

  const isLinkActive = (link) => {
    if (link.name === 'Home') {
      return location.pathname === '/' && !location.hash
    }

    if (link.name === 'Features') {
      return location.pathname === '/' && location.hash === '#features'
    }

    return location.pathname === link.path
  }

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()

    event.currentTarget.style.setProperty(
      '--mouse-x',
      `${event.clientX - rect.left}px`
    )

    event.currentTarget.style.setProperty(
      '--mouse-y',
      `${event.clientY - rect.top}px`
    )
  }

  const activeIndicator = (
    <motion.span
      layoutId="activeTab"
      className="absolute inset-0 -z-10 rounded-full border border-violet-300/20 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 shadow-[0_0_12px_rgba(139,92,246,0.5),0_0_28px_rgba(139,92,246,0.25),inset_0_1px_0_rgba(255,255,255,0.2)]"
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30
      }}
    />
  )

  return (
    <nav className="relative z-50 px-4 pt-5">
      <div className="max-w-7xl mx-auto">

        {/* Floating Navbar */}
        <div
          onMouseMove={handleMouseMove}
          className="group relative isolate flex items-center justify-between gap-4 rounded-full border border-white/[0.09] bg-[#100d1c]/85 backdrop-blur-2xl px-4 sm:px-6 py-3 shadow-[0_8px_40px_rgba(0,0,0,0.35)] hover:shadow-[0_8px_45px_rgba(139,92,246,0.18)] transition-shadow duration-500"
        >

          {/* Cursor Following Glow */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background:
                'radial-gradient(280px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(139, 92, 246, 0.20), transparent 75%)'
            }}
          />

          {/* Logo */}
          <Link to="/" className="relative z-10 flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
              <Play size={17} fill="white" />
            </div>

            <span className="text-white font-bold text-base sm:text-lg tracking-tight">
              AI Learning <span className="text-indigo-400">Assistant</span>
            </span>
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

            <Link
              to="/login"
              className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors"
            >
              Sign in
            </Link>

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
                    className={className}
                  >
                    {link.name}
                  </a>
                ) : (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    end={link.path === '/'}
                    className={className}
                  >
                    {link.name}
                  </NavLink>
                )
              })}
            </div>

            <div className="border-t border-white/10 mt-3 pt-3 space-y-2">
              <Link
                to="/login"
                className="block text-center text-sm text-slate-300 hover:text-white py-2"
              >
                Sign in
              </Link>

              <Link
                to="/upload"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full py-3 text-sm font-semibold shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              >
                Upload a lecture <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        )}

      </div>
    </nav>
  )
}

export default Navbar
