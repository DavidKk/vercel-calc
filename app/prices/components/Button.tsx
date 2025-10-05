import type { ButtonHTMLAttributes, ReactNode } from 'react'
import classnames from 'classnames'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'icon'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  loading?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  loading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'font-medium transition-all duration-200 flex items-center justify-center rounded-lg shadow-lg hover:shadow-xl active:scale-95 disabled:cursor-not-allowed'

  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10 text-base',
    lg: 'h-12 text-lg',
  }

  const iconSizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  }

  const variantClasses = {
    primary: 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
    ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-gray-700',
    icon: 'bg-gray-700 text-gray-400 hover:text-white hover:bg-indigo-600 rounded transition-all duration-200 ease-in-out flex items-center justify-center',
  }

  const disabledClasses = {
    primary: 'bg-gray-600 text-gray-300 cursor-not-allowed',
    secondary: 'bg-gray-600 text-gray-300 cursor-not-allowed',
    danger: 'bg-gray-600 text-gray-300 cursor-not-allowed',
    success: 'bg-gray-600 text-gray-300 cursor-not-allowed',
    ghost: 'bg-transparent text-gray-400 cursor-not-allowed',
    icon: 'bg-gray-700 text-gray-400 cursor-not-allowed',
  }

  const iconMargin = children ? (size === 'sm' ? 'mx-1' : size === 'md' ? 'mx-1.5' : 'mx-2') : ''

  const Spinner = () => (
    <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  )

  return (
    <button
      className={classnames(
        baseClasses,
        {
          [sizeClasses[size]]: variant !== 'icon',
          [iconSizeClasses[size]]: variant === 'icon',
          [variantClasses[variant]]: !disabled && !loading,
          [disabledClasses[variant]]: disabled || loading,
          'w-full': fullWidth,
        },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="mr-2">
            <Spinner />
          </span>
          {children}
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className={iconMargin}>{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className={iconMargin}>{icon}</span>}
        </>
      )}
    </button>
  )
}
