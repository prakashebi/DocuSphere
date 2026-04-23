import { InputHTMLAttributes, forwardRef } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, Props>(({ label, error, className = '', ...props }, ref) => (
  <div className="w-full">
    {label && (
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
    )}
    <input
      ref={ref}
      className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors
        focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500
        ${error ? 'border-red-400' : 'border-gray-300'}
        ${className}`}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
))

Input.displayName = 'Input'
export default Input
