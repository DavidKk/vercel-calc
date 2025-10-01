import { Item } from './Item'
import type { HistoryRecord } from './types'
import { Spinner } from '@/components/Spinner'

export interface ListProps {
  history: HistoryRecord[]
  loading?: boolean
}

export function List({ history, loading = false }: ListProps) {
  return (
    <div className="space-y-3 h-full overflow-y-auto custom-scrollbar relative">
      {history.length > 0 ? (
        history.map((record) => <Item key={record.id} record={record} />)
      ) : (
        <div className="text-gray-400 text-center py-4 h-full flex items-center justify-center">暂无计算历史</div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center rounded-lg z-10">
          <Spinner color="text-white" />
        </div>
      )}
    </div>
  )
}
