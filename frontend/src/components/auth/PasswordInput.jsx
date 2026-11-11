
import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'

function PasswordInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  autoComplete,
  minLength
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs font-semibold text-slate-300 mb-2"
      >
        {label}
      </label>

      <div className="relative">
        <Lock
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          id={name}
          type={visible ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={minLength}
          required
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/70 transition-colors"
        />

        <button
          type="button"
          onClick={() => setVisible(previous => !previous)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  )
}

export default PasswordInput
