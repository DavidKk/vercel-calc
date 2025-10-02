import type { ProductType } from '@/app/actions/prices/product'
import { PriceDisplay } from '../PriceDisplay'

export interface PlaceholderProps {
  product: ProductType
}

export function Placeholder(props: PlaceholderProps) {
  const { product } = props
  const { name, brand, unit, unitBestPrice } = product
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-[4px]">
      <div className="text-white text-lg font-medium">
        {name}
        {brand && <span className="text-gray-400 text-base font-normal">&nbsp;/&nbsp;{brand}</span>}
      </div>

      <div className="font-light text-white">
        <PriceDisplay amount={unitBestPrice} size="lg" />
        {unit && <span className="text-gray-400 text-sm">&nbsp;/&nbsp;{unit}</span>}
      </div>
    </div>
  )
}
