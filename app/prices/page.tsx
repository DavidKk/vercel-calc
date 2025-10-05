import { getHistoryList } from '@/app/actions/prices/history'
import { getAllProducts, type ProductType } from '@/app/actions/prices/product'
import { generate } from '@/components/Meta'
import { AccessProvider } from '@/contexts/access'
import { validateCookie } from '@/services/auth/access'

import { Calculator } from './Calculator'
import { HistoryProvider } from './contexts/history'

const { generateMetadata } = generate({
  title: 'Price Calculator',
  description: 'Calculator for computing unit price of products, supporting multiple units and product types',
})

export { generateMetadata }

export default async function CalculatorPage() {
  const access = await validateCookie()
  const productTypes: ProductType[] = await getAllProducts()
  const initialProductType = productTypes.length > 0 ? productTypes[0] : null
  const initialHistory = await getHistoryList(initialProductType?.name)

  return (
    <HistoryProvider initialHistory={initialHistory}>
      <AccessProvider access={access}>
        <div className="flex justify-center w-full min-h-[calc(100vh-124px)] p-2 md:p-4 bg-black">
          <Calculator productTypes={productTypes} initialProductType={initialProductType} />
        </div>
      </AccessProvider>
    </HistoryProvider>
  )
}
