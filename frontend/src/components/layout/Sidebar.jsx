
import {
  LayoutDashboard,
  Video,
  Upload,
  MessageCircle,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    { name: 'Dashboard', path: '/lectures', icon: LayoutDashboard },
    { name: 'My Lectures', path: '/lectures', icon: Video },
    { name: 'Upload Lecture', path: '/upload', icon: Upload },
    { name: 'AI Tutor', path: '/chat', icon: MessageCircle }
  ]

  return (
    <aside
      className={`hidden md:flex flex-col h-[calc(100vh-80px)] sticky top-20
      border-r border-white/10 bg-[#0b0a16]/80 backdrop-blur-xl
      transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}
    >
      <div className="flex items-center justify-between p-5">
        {!collapsed && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest">
              Workspace
            </p>
            <h2 className="text-white font-semibold mt-1">Learning Space</h2>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="px-3 mt-4">
        {!collapsed && (
          <p className="text-[11px] text-gray-500 uppercase tracking-widest px-3 mb-3">
            Menu
          </p>
        )}

        <nav className="space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.name}
                to={item.path}
                title={collapsed ? item.name : ''}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                  ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon size={20} />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </NavLink>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto p-4">
        <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/40 to-[#171326] p-4">
          <Sparkles className="text-purple-300 mb-3" size={22} />

          {!collapsed && (
            <>
              <p className="text-sm font-semibold text-white">
                Learn Smarter
              </p>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Turn your lectures into notes, quizzes and interactive learning.
              </p>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
