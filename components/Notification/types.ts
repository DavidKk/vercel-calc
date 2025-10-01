export interface ShowOptions {
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

export interface NotificationItem {
  id: number
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration: number
  isVisible: boolean
}

export interface NotificationProps {
  maxNotifications?: number
}

export interface NotificationImperativeHandler {
  show: (message: string, options?: ShowOptions) => void
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
}
