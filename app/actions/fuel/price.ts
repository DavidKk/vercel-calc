'use server'

export interface FuelPriceResponse {
  code: number
  message: string
  data: FuelPriceData
}

export interface FuelPriceData {
  previous: ProvincePrice[]
  current: ProvincePrice[]
  latestUpdated: number
  previousUpdated: number
}

export interface ProvincePrice {
  province: string
  b92: string // Oil price uses string type as it might be "0"
  b95: string
  b98: string
  b0: string
}

export interface FuelPrice {
  province: string
  '92': number
  '95': number
  '98': number
  diesel: number
}

// 全局缓存类型声明
declare global {
  var __fuelPriceCache:
    | {
        [key: string]: {
          data: FuelPrice
          timestamp: number
        }
      }
    | undefined
}

/**
 * Get fuel prices for all provinces
 * @returns Promise that resolves to array of fuel prices by province
 */
export async function getFuelPrices(): Promise<FuelPrice[]> {
  const apiUrl = process.env.FUEL_PRICE_API_URL || 'https://vercel-openapi-lake.vercel.app/api/fuel-price'
  const response = await fetch(apiUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch fuel prices: ${response.status} ${response.statusText}`)
  }
  const result: FuelPriceResponse = await response.json()

  // 转换数据格式以匹配我们现有的接口
  const fuelPrices: FuelPrice[] = result.data.current.map((item) => ({
    province: item.province,
    '92': parseFloat(item.b92) || 0,
    '95': parseFloat(item.b95) || 0,
    '98': parseFloat(item.b98) || 0,
    diesel: parseFloat(item.b0) || 0,
  }))

  return fuelPrices
}

/**
 * Get fuel price for a specific province
 * @param province Province name
 * @returns Promise that resolves to fuel price for the specified province
 */
export async function getFuelPriceByProvince(province: string): Promise<FuelPrice | undefined> {
  // Add cache for province fuel price data, cache time is 1 month
  const cacheKey = `fuel-price-${province}`
  const cacheExpiry = 30 * 24 * 60 * 60 * 1000 // 1个月的毫秒数

  // 检查是否存在有效的缓存
  if (typeof window === 'undefined') {
    // 服务器端环境
    // 注意：在服务器端，我们需要实现一个简单的内存缓存机制
    // 在实际生产环境中，可能需要使用Redis等外部缓存系统
    const cachedData = global.__fuelPriceCache?.[cacheKey]
    if (cachedData && Date.now() - cachedData.timestamp < cacheExpiry) {
      return cachedData.data
    }
  }

  const prices = await getFuelPrices()
  const price = prices.find((p) => p.province === province)

  // 如果在服务器端且获取到数据，则缓存结果
  if (typeof window === 'undefined' && price) {
    if (!global.__fuelPriceCache) {
      global.__fuelPriceCache = {}
    }
    global.__fuelPriceCache[cacheKey] = {
      data: price,
      timestamp: Date.now(),
    }
  }

  return price
}
