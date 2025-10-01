import { useState, useCallback } from 'react'

// 封装通用的异步操作hook
export function useAction<T extends any[], R>(action: (...params: T) => Promise<R>, deps: any[] = []) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(
    async (...params: T): Promise<R | undefined> => {
      setLoading(true)
      setError(null)
      try {
        const result = await action(...params)
        return result
      } catch (err) {
        setError(err as Error)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [action, ...deps]
  )

  return [execute, loading, error] as const
}
