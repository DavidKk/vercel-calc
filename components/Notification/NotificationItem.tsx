import { XMarkIcon } from '@heroicons/react/24/outline'
import type { NotificationItem as NotificationItemType } from './types'

interface NotificationItemProps {
  notification: NotificationItemType
  onClose: (id: number) => void
  className?: string
}

const getBackgroundColor = (type: 'success' | 'error' | 'warning' | 'info') => {
  switch (type) {
    case 'success':
      return 'bg-green-500'
    case 'error':
      return 'bg-red-500'
    case 'warning':
      return 'bg-yellow-500'
    case 'info':
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
}

const getIcon = (type: 'success' | 'error' | 'warning' | 'info') => {
  switch (type) {
    case 'success':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      )
    case 'error':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      )
    case 'warning':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          ></path>
        </svg>
      )
    case 'info':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )
    default:
      return null
  }
}

export function NotificationItem({ notification, onClose, className = '' }: NotificationItemProps) {
  return (
    <div
      className={`
        ${getBackgroundColor(notification.type)} 
        text-white rounded shadow-lg 
        transform transition-all duration-300 ease-in-out 
        inline-flex items-center
        ${notification.isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        p-2 md:p-3
        ${className}
      `}
    >
      <span className="flex-shrink-0">{getIcon(notification.type)}</span>
      <span className="flex-1 break-words md:text-sm text-xs mx-2 select-none">{notification.message}</span>
      <button className="text-white hover:text-gray-200 focus:outline-none flex-shrink-0" onClick={() => onClose(notification.id)}>
        <XMarkIcon className="md:w-4 md:h-4 w-3 h-3" />
      </button>
    </div>
  )
}
