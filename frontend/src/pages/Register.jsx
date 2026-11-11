
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  User,
  Mail,
  ArrowRight,
  CheckCircle2
} from 'lucide-react'

import AuthLayout from '../components/auth/AuthLayout'
import AuthInput from '../components/auth/AuthInput'
import PasswordInput from '../components/auth/PasswordInput'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false
  })

  const [message, setMessage] = useState('')

  const handleChange = event => {
    const { name, value, type, checked } = event.target

    setFormData(previous => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value
    }))

    setMessage('')
  }

  const handleSubmit = event => {
    event.preventDefault()
    setMessage('')

    if (formData.password.length < 8) {
      setMessage('Password must contain at least 8 characters.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    if (!formData.agree) {
      setMessage('Please accept the Terms and Conditions.')
      return
    }

    setMessage(
      'Your form is valid! Account creation will be enabled after backend authentication is connected.'
    )
  }

  return (
    <AuthLayout
      eyebrow="Start your learning journey"
      title="Create your account"
      description="One account. A smarter way to learn."
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
          label="Full name"
          icon={User}
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          autoComplete="name"
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
          placeholder="At least 8 characters"
          autoComplete="new-password"
          minLength={8}
        />

        <PasswordInput
          label="Confirm password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your password"
          autoComplete="new-password"
        />

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
            className="mt-1 accent-indigo-500"
          />

          <span className="text-xs text-slate-400 leading-5">
            I agree to the Terms and Conditions and Privacy Policy.
          </span>
        </label>

        {message && (
          <div className="flex gap-2 items-start rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-3 text-xs text-indigo-200 leading-5">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            {message}
          </div>
        )}

        <button
          type="submit"
          className="gradient-button w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold text-sm"
        >
          Create account <ArrowRight size={17} />
        </button>
      </form>

      <div className="relative my-7">
        <div className="border-t border-white/10" />
        <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-[#111020] px-3 text-[10px] text-slate-500">
          OR
        </span>
      </div>

      <p className="text-center text-xs text-slate-400">
        Your learning workspace starts here.
      </p>
    </AuthLayout>
  )
}

export default Register
