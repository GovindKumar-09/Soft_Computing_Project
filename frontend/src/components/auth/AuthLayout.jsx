
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import AuthBrand from './AuthBrand'

function AuthLayout({ eyebrow, title, description, children, footer }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-5 py-16 overflow-hidden">

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-700/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-700/15 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <AuthBrand />

        <div className="glass-card p-6 sm:p-9">

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-indigo-300 text-xs font-bold tracking-widest uppercase mb-4">
              <Sparkles size={14} />
              {eyebrow}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {title}
            </h1>

            <p className="text-slate-400 text-sm mt-3 leading-6">
              {description}
            </p>
          </div>

          {children}

        </div>

        {footer}

        <Link
          to="/"
          className="block text-center text-xs text-slate-500 hover:text-white mt-7 transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  )
}

export default AuthLayout
