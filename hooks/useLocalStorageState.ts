import { useEffect, useState } from 'react'

export function useLocalStorageState<T>(key: string, defaultValue: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] {
  const token = `LOCAL_STORAGE_STATE_TOKEN_${key}`
  const [state, setState] = useState<T>(() => {
    if (localStorage.getItem(token)) {
      return JSON.parse(localStorage.getItem(token)!)
    }

    return typeof defaultValue === 'function' ? (defaultValue as () => T)() : defaultValue
  })

  useEffect(() => {
    try {
      localStorage.setItem(token, JSON.stringify(state))
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('localStorage write failed', e)
    }
  }, [token, state])

  return [state, setState]
}
