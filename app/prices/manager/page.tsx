import { ProductManager } from './ProductManager'
import { generate } from '@/components/Meta'
import { checkAccess } from '@/services/auth/access'
import { getAllProducts } from '@/app/actions/prices/product'
import { ProductProvider } from '@/app/prices/contexts/product'

const { generateMetadata } = generate({
  title: 'Product Manager',
  description: 'Manage product information including name, brand, unit and recommended price',
})

export { generateMetadata }

export default async function ManagerPage() {
  await checkAccess({ isApiRouter: false, redirectUrl: '/prices/manager' })
  const products = await getAllProducts()

  return (
    <div className="flex justify-center w-full min-h-[calc(100vh-124px)] p-2 md:p-4 bg-black">
      <ProductProvider initialProducts={products}>
        <ProductManager />
      </ProductProvider>
    </div>
  )
}
