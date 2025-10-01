'use client'

import { forwardRef, useCallback, useImperativeHandle, useRef, useState, type ForwardedRef } from 'react'
import { NotificationItem } from './NotificationItem'
import type { NotificationProps, ShowOptions, NotificationItem as NotificationItemType, NotificationImperativeHandler } from './types'

let notificationId = 0

function Notification(props: NotificationProps, ref: ForwardedRef<NotificationImperativeHandler>) {
  const { maxNotifications = 4 } = props
  const [notifications, setNotifications] = useState<NotificationItemType[]>([])
  const timersRef = useRef<Record<number, NodeJS.Timeout>>({})
  const removingIdsRef = useRef<Set<number>>(new Set())

  const removeNotification = useCallback((id: number) => {
    removingIdsRef.current.add(id)

    setNotifications((prev) => prev.map((notification) => (notification.id === id ? { ...notification, isVisible: false } : notification)))

    setTimeout(() => {
      setNotifications((prev) => prev.filter((notification) => notification.id !== id))
      removingIdsRef.current.delete(id)
      if (timersRef.current[id]) {
        clearTimeout(timersRef.current[id])
        delete timersRef.current[id]
      }
    }, 300)
  }, [])

  const show = useCallback(
    (message: string, options?: ShowOptions) => {
      const { type = 'info', duration = 3000 } = options || {}
      const id = notificationId++

      setNotifications((prev) => {
        const newNotifications = [...prev]
        if (newNotifications.length >= maxNotifications) {
          const oldest = newNotifications.find((notification) => !removingIdsRef.current.has(notification.id))
          if (oldest) {
            removeNotification(oldest.id)
          }
        }
        return [...newNotifications, { id, message, type, duration, isVisible: true }]
      })

      timersRef.current[id] = setTimeout(() => {
        removeNotification(id)
      }, duration)
    },
    [maxNotifications, removeNotification]
  )

  const success = useCallback(
    (message: string, duration = 3000) => {
      show(message, { type: 'success', duration })
    },
    [show]
  )

  const error = useCallback(
    (message: string, duration = 3000) => {
      show(message, { type: 'error', duration })
    },
    [show]
  )

  const warning = useCallback(
    (message: string, duration = 3000) => {
      show(message, { type: 'warning', duration })
    },
    [show]
  )

  const info = useCallback(
    (message: string, duration = 3000) => {
      show(message, { type: 'info', duration })
    },
    [show]
  )

  useImperativeHandle(ref, () => ({
    show,
    success,
    error,
    warning,
    info,
  }))

  return (
    <div className="fixed inset-x-0 top-[4.5rem] flex justify-center md:justify-end md:top-[4.5rem] md:right-4 md:left-auto z-[9999] pointer-events-none">
      <div className="flex flex-col items-end gap-y-3 w-full max-w-md px-4 md:max-w-xs md:px-0">
        {notifications.map((notification) => (
          <NotificationItem className="pointer-events-auto" notification={notification} onClose={removeNotification} key={notification.id} />
        ))}
      </div>
    </div>
  )
}

export default forwardRef<NotificationImperativeHandler, NotificationProps>(Notification)
