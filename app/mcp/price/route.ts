import { createMCPHttpServer } from '@/initializer/mcp'
import { version } from '@/package.json'
import calculatePrice from './calculatePrice'
import listProducts from './listProducts'

const name = 'price-service'
const description = 'Provides price calculation and product listing services'

export const { manifest: GET, execute: POST } = createMCPHttpServer(name, version, description, {
  calculate_price: calculatePrice,
  list_products: listProducts,
})
