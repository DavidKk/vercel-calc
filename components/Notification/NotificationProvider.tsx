'use client'

import React, { createContext, useRef, useEffect, useState } from 'react'
import type { NotificationImperativeHandler } from './types'
import Notification from './Notification'

const defaultHandler: NotificationImperativeHandler = {
  show: (message: string) => {
    // eslint-disable-next-line no-console
    console.warn('Notification not initialized:', message)
  },
  success: (message: string) => {
    // eslint-disable-next-line no-console
    console.warn('Notification not initialized:', message)
  },
  error: (message: string) => {
    // eslint-disable-next-line no-console
    console.warn('Notification not initialized:', message)
  },
  warning: (message: string) => {
    // eslint-disable-next-line no-console
    console.warn('Notification not initialized:', message)
  },
  info: (message: string) => {
    // eslint-disable-next-line no-console
    console.warn('Notification not initialized:', message)
  },
}

export const NotificationContext = createContext<NotificationImperativeHandler>(defaultHandler)

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notificationRef = useRef<NotificationImperativeHandler>(null)
  const [handler, setHandler] = useState<NotificationImperativeHandler>(defaultHandler)

  useEffect(() => {
    if (notificationRef.current) {
      setHandler(notificationRef.current)
    }
  }, [])

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(NotificationContext.Provider, { value: handler }, children),
    React.createElement(Notification, { ref: notificationRef })
  )
}
