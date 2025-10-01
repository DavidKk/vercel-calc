import type { InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  prefix?: string
  required?: boolean
}

export function Input({ label, prefix, required, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-gray-300 text-sm font-medium">
        {label} {required && <span>*</span>}
      </label>
      <div className="flex items-center relative">
        {prefix && <span className="absolute left-3 text-gray-400">{prefix}</span>}
        <input
          className={`w-full bg-gray-800 text-white px-3 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            prefix ? 'pl-8' : ''
          } ${className || ''}`}
          required={required}
          {...props}
        />
      </div>
    </div>
  )
}
