import { formatNumberWithCommas, parseUnit } from '@/utils/format'

export interface QuantityProps {
  quantity: number
  unit: string
}

export function Quantity({ quantity, unit }: QuantityProps) {
  const { number, unit: unitName } = parseUnit(unit)
  const finalQuantity = number ? quantity * number : quantity

  return (
    <span className="text-gray-400 text-sm">
      {formatNumberWithCommas(finalQuantity)}
      {unitName}
    </span>
  )
}
