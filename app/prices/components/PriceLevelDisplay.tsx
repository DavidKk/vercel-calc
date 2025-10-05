import classNames from 'classnames'

import { getPriceLevelText, PriceLevel } from '@/app/prices/types'
import { useLanguage } from '@/contexts/language'

export interface PriceLevelDisplayProps {
  priceLevel: PriceLevel | null
  className?: string
}

export function PriceLevelDisplay({ priceLevel, className }: PriceLevelDisplayProps) {
  const { tl } = useLanguage()

  return (
    <div
      className={classNames('inline-flex items-center font-medium text-sm flex-shrink-0', className, {
        'text-gray-400': !priceLevel,
        'text-blue-400': priceLevel === PriceLevel.EXCELLENT,
        'text-green-400': priceLevel === PriceLevel.GOOD,
        'text-yellow-500': priceLevel === PriceLevel.ACCEPTABLE,
        'text-orange-400': priceLevel === PriceLevel.HIGH,
        'text-red-500': priceLevel === PriceLevel.EXPENSIVE,
        'text-red-400': priceLevel === PriceLevel.FAMILY_TREASURE,
      })}
    >
      {priceLevel !== null ? tl(getPriceLevelText(priceLevel), 'zh-CN') : ''}
    </div>
  )
}
