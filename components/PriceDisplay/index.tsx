import classNames from 'classnames'

export type Size = 'sm' | 'md' | 'lg'

export interface PriceDisplayProps {
  className?: string
  amount: number
  currency?: string
  size?: Size
}

export function PriceDisplay({ className, amount, currency = '¥', size = 'md' }: PriceDisplayProps) {
  const textSizeClass = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }[size]

  return (
    <span className={classNames('inline-flex items-baseline gap-x-[2px]', textSizeClass, className)}>
      <span className="text-[0.7em] font-bold align-baseline">{currency}</span>
      {amount.toFixed(2)}
    </span>
  )
}
