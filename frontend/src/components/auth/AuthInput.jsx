
function AuthInput({
  label,
  icon: Icon,
  ...inputProps
}) {
  return (
    <div>
      <label
        htmlFor={inputProps.name}
        className="block text-xs font-semibold text-slate-300 mb-2"
      >
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />
        )}

        <input
          id={inputProps.name}
          {...inputProps}
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/70 transition-colors"
        />
      </div>
    </div>
  )
}

export default AuthInput
