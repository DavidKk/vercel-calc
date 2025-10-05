'use client'

import React, { useContext } from 'react'

import { NotificationContext } from './NotificationProvider'

// 自定义 hook，用于在组件中使用通知功能
export const useNotification = () => {
  const context = useContext(NotificationContext)
  return context
}

// 为了向后兼容，重新导出 NotificationProvider 和 NotificationContext
export { NotificationProvider } from './NotificationProvider'
export { NotificationContext } from './NotificationProvider'
export type { NotificationImperativeHandler } from './types'
