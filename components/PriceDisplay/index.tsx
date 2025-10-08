import classNames from 'classnames'

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'

export interface PriceDisplayProps {
  className?: string
  amount: number
  currency?: string
  size?: Size
}

export function PriceDisplay({ className, amount, currency = '¥', size = 'md' }: PriceDisplayProps) {
  const textSizeClass = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
  }[size]

  return (
    <span className={classNames('inline-flex items-baseline gap-x-[2px]', textSizeClass, className)}>
      <span className="text-[0.7em] font-bold align-baseline">{currency}</span>
      {amount.toFixed(2)}
    </span>
  )
}
