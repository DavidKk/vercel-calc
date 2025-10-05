'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export function useFullscreen<T extends HTMLElement = HTMLElement>() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const elementRef = useRef<T>(null)

  const toggleFullscreen = useCallback(async (element?: T) => {
    const targetElement = element || elementRef.current || document.documentElement

    // Check if fullscreen API is supported
    if (!targetElement.requestFullscreen && 
        !(targetElement as any).webkitRequestFullscreen && 
        !(targetElement as any).mozRequestFullScreen && 
        !(targetElement as any).msRequestFullscreen) {
      console.warn('Fullscreen API is not supported in this browser')
      return
    }

    if (!document.fullscreenElement && 
        !(document as any).webkitFullscreenElement && 
        !(document as any).mozFullScreenElement && 
        !(document as any).msFullscreenElement) {
      // Enter fullscreen mode
      try {
        if (targetElement.requestFullscreen) {
          await targetElement.requestFullscreen()
        } else if ((targetElement as any).webkitRequestFullscreen) {
          // Safari
          await (targetElement as any).webkitRequestFullscreen()
        } else if ((targetElement as any).mozRequestFullScreen) {
          // Firefox
          await (targetElement as any).mozRequestFullScreen()
        } else if ((targetElement as any).msRequestFullscreen) {
          // IE/Edge
          await (targetElement as any).msRequestFullscreen()
        }
        setIsFullscreen(true)
      } catch (error) {
        const message = error instanceof Error ? error.message : Object.prototype.toString.call(error)
        console.error(`Error attempting to enable fullscreen: ${message}`)
      }

      return
    }

    // Exit fullscreen mode
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
      } else if ((document as any).webkitExitFullscreen) {
        // Safari
        await (document as any).webkitExitFullscreen()
      } else if ((document as any).mozCancelFullScreen) {
        // Firefox
        await (document as any).mozCancelFullScreen()
      } else if ((document as any).msExitFullscreen) {
        // IE/Edge
        await (document as any).msExitFullscreen()
      }
      setIsFullscreen(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : Object.prototype.toString.call(error)
      console.error(`Error attempting to exit fullscreen: ${message}`)
    }
  }, [])

  // Listen for fullscreen change events (including vendor prefixes)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement || 
                      !!(document as any).webkitFullscreenElement || 
                      !!(document as any).mozFullScreenElement || 
                      !!(document as any).msFullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  return { isFullscreen, toggleFullscreen, elementRef }
}