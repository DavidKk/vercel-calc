import { XMarkIcon } from '@heroicons/react/24/outline'
import { PriceLevelDisplay } from '@/app/prices/components/PriceLevelDisplay'
import { formatNumberWithCommas } from '@/utils/format'
import { Spinner } from '@/components/Spinner'
import { useHistoryActions } from '@/app/prices/contexts/history'
import { useNotification } from '@/components/Notification/useNotification'
import type { HistoryRecord } from './types'

export interface ItemProps {
  record: HistoryRecord
  onDelete?: (id: number) => void
  loading?: boolean
}

export function Item({ record, onDelete, loading }: ItemProps) {
  const notification = useNotification()
  const { loading: contextLoading, removeFromHistory, loadingRemoveFromHistory } = useHistoryActions()
  const isLoading = loading || contextLoading || loadingRemoveFromHistory

  const handleDelete = async () => {
    if (isLoading) return

    if (confirm(`Are you sure you want to delete this history record for ${record.productType}?`)) {
      try {
        await removeFromHistory(record.id)
        if (onDelete) {
          onDelete(record.id)
        }
      } catch (error) {
        notification.error(`Failed to delete history record: ${error}`)
      }
    }
  }

  const displayProductName = record.brand ? `${record.productType} - ${record.brand}` : record.productType
  const remark = record.remark || record.product?.remark

  return (
    <div
      className={`flex flex-col gap-2 px-3 py-2 bg-gray-800 rounded-md relative transition-all duration-300 ease-in-out group hover:shadow-md ${
        isLoading ? 'opacity-75 pointer-events-none' : 'hover:bg-gray-750'
      }`}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 rounded-md z-10">
          <Spinner />
        </div>
      )}

      <button
        onClick={handleDelete}
        disabled={isLoading}
        className={`absolute top-1 right-1 h-5 w-5 text-gray-500 hover:text-white rounded transition-all duration-200 ease-in-out flex items-center justify-center ${
          isLoading ? 'bg-gray-600 cursor-not-allowed opacity-50' : 'bg-gray-700 hover:bg-gray-600 opacity-0 group-hover:opacity-100'
        }`}
        title="Delete"
      >
        <XMarkIcon className="h-5 w-5 mx-auto" />
      </button>

      <div className="flex flex-col">
        <div className="flex font-medium text-white text-sm">{displayProductName}</div>
        {remark && <div className="text-gray-400 text-xs">{remark}</div>}
        <div className="flex justify-between gap-x-4">
          <div className="inline-flex flex-wrap items-center gap-x-2">
            <span className="text-white text-lg font-medium break-all">
              <b className="text-sm">¥</b>
              {formatNumberWithCommas(record.totalPrice, 2)}
            </span>
            <span className="text-gray-400 text-xs break-all">({record.unit})</span>
            <span className="text-gray-400 text-xs break-all">
              = <b className="text-xxs">¥</b>
              {formatNumberWithCommas(record.totalPrice, 2)} / {formatNumberWithCommas(record.totalQuantity)}
            </span>
          </div>

          <PriceLevelDisplay priceLevel={record.priceLevel} />
        </div>

        <div className="flex justify-between items-center text-gray-500 text-xs">
          <span className="inline-flex gap-x-1">
            Best Price: <b className="text-xxs">¥</b>
            {formatNumberWithCommas(record.unitBestPrice, 2)}
            &nbsp;
            {record.unit}
          </span>
          <span>{record.timestamp}</span>
        </div>
      </div>
    </div>
  )
}
