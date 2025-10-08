import { getFuelPrices } from '@/app/actions/fuel/price'
import { Calculator } from '@/app/fuel/Calculator'

// Fuel data
const FUEL_TYPES = [
  { id: '92', name: '92 Gasoline', unit: 'L', unitPrice: 7.0 },
  { id: '95', name: '95 Gasoline', unit: 'L', unitPrice: 7.5 },
  { id: '98', name: '98 Gasoline', unit: 'L', unitPrice: 8.0 },
  { id: 'diesel', name: 'Diesel', unit: 'L', unitPrice: 6.5 },
]

export default async function FuelDiscountPage() {
  // Fetch fuel price data on the server side
  const fuelPrices = await getFuelPrices()

  return (
    <div className="flex justify-center w-full min-h-[calc(100vh-124px)] p-2 md:p-4 bg-black">
      <Calculator fuelTypes={FUEL_TYPES} fuelPrices={fuelPrices} />
    </div>
  )
}
