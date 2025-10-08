import { useEffect, useState } from 'react'

export function useLocalStorageState<T>(key: string, defaultValue: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] {
  const token = `LOCAL_STORAGE_STATE_TOKEN_${key}`
  const [state, setState] = useState<T>(() => (typeof defaultValue === 'function' ? (defaultValue as () => T)() : defaultValue))

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const content = localStorage.getItem(token)
      if (!(typeof content === 'string' && content.length > 0)) {
        return
      }

      try {
        const data = JSON.parse(content)
        setState(data)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('localStorage read failed', e)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof state !== 'undefined') {
      try {
        localStorage.setItem(token, JSON.stringify(state))
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('localStorage write failed', e)
      }
    }
  }, [token, state])

  return [state, setState]
}
