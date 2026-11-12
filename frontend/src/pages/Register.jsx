import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  Mail,
  ArrowRight,
  AlertCircle
} from 'lucide-react'

import AuthLayout from '../components/auth/AuthLayout'
import AuthInput from '../components/auth/AuthInput'
import PasswordInput from '../components/auth/PasswordInput'
import { useAuth } from '../app/useAuth'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = event => {
    const { name, value } = event.target

    setFormData(previous => ({
      ...previous,
      [name]: value
    }))

    setMessage('')
    setError('')
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)

    try {
      // Direct FastAPI register API call
      const res = await registerUser(formData.name, formData.email, formData.password)

      if (res.success) {
        setMessage('Registration successful! Redirecting to login...')
        setTimeout(() => {
          navigate('/login')
        }, 1000)
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || 'Registration failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    if (!formData.agree) {
      setMessage('Please accept the Terms and Conditions.')
      return
    }

    setSubmitting(true)
    try {
      await register(formData.name.trim(), formData.email.trim(), formData.password)
      navigate('/lectures', { replace: true })
    } catch (error) {
      setMessage(error.message || 'Unable to create your account.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create an account."
      description="Start transforming your lectures into notes and quizzes."
      footer={
        <p className="text-center text-sm text-slate-400 mt-7">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-indigo-300 font-semibold hover:text-white"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          label="Full Name"
          icon={User}
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Govind Kumar"
          required
        />

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
          placeholder="Create a strong password"
          autoComplete="new-password"
          required
        />

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300 leading-5">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* Success Alert */}
        {message && (
          <div role="alert" className="flex gap-2 items-start rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-200 leading-5">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="gradient-button w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold text-sm"
        >
          {submitting ? 'Creating account…' : 'Create account'} <ArrowRight size={17} />
        </button>
      </form>
    </AuthLayout>
  )
}

// CRITICAL FIX: Default export must be present
export default Register