import type { ProductType } from '@/app/actions/prices/product'

export interface ProductSelectorProps {
  productTypes: ProductType[]
  selectedProductType: ProductType
  onProductChange: (product: ProductType) => void
}

export function ProductSelector({ productTypes, selectedProductType, onProductChange }: ProductSelectorProps) {
  return (
    <select
      id="productType"
      value={selectedProductType.id}
      onChange={(e) => {
        const selected = productTypes.find((type) => type.id === e.target.value) || productTypes[0]
        onProductChange(selected)
      }}
      className="w-full bg-white text-gray-700 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-md"
    >
      {productTypes.map((type) => (
        <option key={type.id} value={type.id}>
          {type.brand
            ? `${type.name} - ${type.brand} (推荐价格: ¥${type.recommendedPrice.toFixed(2)} ${type.unit})`
            : `${type.name} (推荐价格: ¥${type.recommendedPrice.toFixed(2)} ${type.unit})`}
        </option>
      ))}
    </select>
  )
}
