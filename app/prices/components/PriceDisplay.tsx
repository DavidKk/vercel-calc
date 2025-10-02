import classNames from 'classnames'

export type Size = 'sm' | 'md' | 'lg'

export interface PriceDisplayProps {
  amount: number
  currency?: string
  size?: Size
}

export function PriceDisplay({ amount, currency = '¥', size = 'md' }: PriceDisplayProps) {
  const textSizeClass = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }[size]

  return (
    <span className={classNames('inline-flex items-baseline gap-x-[2px]', textSizeClass)}>
      <span className="text-[0.7em] font-bold align-baseline">{currency}</span>
      {amount.toFixed(2)}
    </span>
  )
}
