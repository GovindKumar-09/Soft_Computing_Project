
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail, ArrowRight, AlertCircle } from 'lucide-react'

import AuthLayout from '../components/auth/AuthLayout'
import AuthInput from '../components/auth/AuthInput'
import PasswordInput from '../components/auth/PasswordInput'
import { useAuth } from '../app/useAuth'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  })

  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleChange = event => {
    const { name, value, checked, type } = event.target

    setFormData(previous => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value
    }))

    setMessage('')
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setSubmitting(true)
    setMessage('')
    try {
      await login(formData.email.trim(), formData.password, formData.remember)
      navigate(location.state?.from?.pathname || '/lectures', { replace: true })
    } catch (error) {
      setMessage(error.message || 'Unable to sign in.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Let's get learning."
      description="Sign in to continue where you left off."
      footer={
        <p className="text-center text-sm text-slate-400 mt-7">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-indigo-300 font-semibold hover:text-white"
          >
            Create an account
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">

        <AuthInput
          label="Email address"
          icon={Mail}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <PasswordInput
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          autoComplete="current-password"
        />

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
            className="accent-indigo-500 w-4 h-4"
          />

          <span className="text-xs text-slate-400">
            Remember me
          </span>
        </label>

        {message && (
          <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-200 leading-5">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="gradient-button w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold text-sm"
        >
          {submitting ? 'Signing in…' : 'Sign in'} <ArrowRight size={17} />
        </button>
      </form>

      <div className="relative my-8">
        <div className="border-t border-white/10" />
        <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-[#111020] px-3 text-[10px] text-slate-500">
          OR
        </span>
      </div>

      <p className="text-center text-xs text-slate-400">
        Sign in to access your lectures, notes and quizzes.
      </p>
    </AuthLayout>
  )
}

export default Login