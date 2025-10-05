'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export function useFullscreen<T extends HTMLElement = HTMLElement>() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const elementRef = useRef<T>(null)

  const toggleFullscreen = useCallback((element?: T) => {
    const targetElement = element || elementRef.current || document.documentElement

    if (!document.fullscreenElement) {
      // Enter fullscreen mode
      if (targetElement.requestFullscreen) {
        targetElement
          .requestFullscreen()
          .then(() => {
            setIsFullscreen(true)
          })
          .catch((error) => {
            const message = error instanceof Error ? error.message : error.toString()
            // eslint-disable-next-line no-console
            console.error(`Error attempting to enable fullscreen: ${message}`)
          })
      }

      return
    }

    // Exit fullscreen mode
    if (document.exitFullscreen) {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullscreen(false)
        })
        .catch((error) => {
          const message = error instanceof Error ? error.message : error.toString()
          // eslint-disable-next-line no-console
          console.error(`Error attempting to exit fullscreen: ${message}`)
        })
    }
  }, [])

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  return { isFullscreen, toggleFullscreen, elementRef }
}
