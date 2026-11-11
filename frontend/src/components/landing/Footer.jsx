
import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import { motion } from 'motion/react'

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-5">

        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Play size={17} fill="white" />
          </div>

          <span className="text-white font-bold">
            AI Learning Assistant
          </span>
        </Link>

        <p className="text-slate-500 text-xs text-center">
          Learn smarter. Understand better. © 2026 AI Learning Assistant.
        </p>

        <div className="flex gap-5 text-xs text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>

          <Link to="/lectures" className="hover:text-white transition-colors">
            Lectures
          </Link>

          <Link to="/chat" className="hover:text-white transition-colors">
            AI Tutor
          </Link>
        </div>

      </div>
    </motion.footer>
  )
}

export default Footer
