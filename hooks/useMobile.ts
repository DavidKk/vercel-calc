'use client'

import { useEffect, useState } from 'react'
import MobileDetect from 'mobile-detect'
2
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    function detectMobile() {
      let mobile = false

      // 方法 1：UA 检测
      const ua = navigator.userAgent || ''
      const md = new MobileDetect(ua)
      if (md.mobile() || md.tablet()) {
        mobile = true
      }

      // 方法 2：屏幕宽度判断
      const width = window.innerWidth
      if (width < 1024) {
        mobile = true
      }

      // 方法 3：Touch Events 判断
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      if (isTouchDevice && width < 1200) {
        mobile = true
      }

      // 方法 4：Orientation 判断
      const isPortrait = window.matchMedia('(orientation: portrait)').matches
      if (isPortrait && width < 1200) {
        mobile = true
      }

      setIsMobile(mobile)
    }

    detectMobile()

    window.addEventListener('resize', detectMobile)
    return () => window.removeEventListener('resize', detectMobile)
  }, [])

  return isMobile
}
