import { useEffect, useState } from 'react'

import { PROVINCE_MAPPING } from '@/constants/city'

interface LocationInfo {
  province: {
    chinese: string | null
    english: string | null
  }
  loading: boolean
}

export function useLocation(): LocationInfo {
  const [province, setProvince] = useState<{ chinese: string | null; english: string | null }>({
    chinese: null,
    english: null,
  })
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const CACHE_KEY = 'user_location_cache'
    const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hour cache

    // Safely read cache from sessionStorage
    const getCachedLocation = () => {
      if (typeof window === 'undefined') return null
      try {
        const cached = sessionStorage.getItem(CACHE_KEY)
        if (cached) {
          const { province, timestamp } = JSON.parse(cached)
          if (Date.now() - timestamp < CACHE_DURATION) {
            return province
          }
        }
        // If not found in sessionStorage, try to read from localStorage (for backward compatibility)
        const localCached = localStorage.getItem(CACHE_KEY)
        if (localCached) {
          const { province, timestamp } = JSON.parse(localCached)
          if (Date.now() - timestamp < CACHE_DURATION) {
            // Migrate cache from localStorage to sessionStorage
            sessionStorage.setItem(CACHE_KEY, localCached)
            localStorage.removeItem(CACHE_KEY)
            return province
          }
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Failed to read location cache from storage:', e)
      }
      return null
    }

    // Safely cache location info to sessionStorage
    const cacheLocation = (provinceInfo: { chinese: string | null; english: string | null }) => {
      if (typeof window === 'undefined') return
      try {
        const cacheData = {
          province: provinceInfo,
          timestamp: Date.now(),
        }
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
        // Also clean up old cache in localStorage (for backward compatibility)
        localStorage.removeItem(CACHE_KEY)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Failed to cache location to sessionStorage:', e)
      }
    }

    const fetchLocation = async () => {
      try {
        // Using a free IP geolocation service
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()
        if (data.region) {
          // Map common region names to province names used in the data
          const englishRegion = data.region
          const chineseProvince = PROVINCE_MAPPING[englishRegion] || englishRegion
          const provinceInfo = {
            chinese: chineseProvince,
            english: englishRegion,
          }
          setProvince(provinceInfo)
          // Cache to sessionStorage
          cacheLocation(provinceInfo)
        }
        setLoading(false)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to get location:', error)
        setLoading(false)
      }
    }

    // First try to get location info from cache
    const cachedProvince = getCachedLocation()
    if (cachedProvince) {
      setProvince(cachedProvince)
      setLoading(false)
    } else {
      // If no cache, fetch location info from network
      fetchLocation()
    }
  }, [])

  return {
    province,
    loading,
  }
}
