'use client'

import React from 'react'

import type { ShowOptions } from '@/components/Notification/types'
import { useNotification } from '@/components/Notification/useNotification'

export default function NotificationTestPage() {
  const { show, success, error, warning, info } = useNotification()

  // Component functions to handle different button clicks
  const handleShowNotification = () => {
    show('This is a regular notification', { duration: 3000 } as ShowOptions)
  }

  const handleSuccessNotification = () => {
    success('Operation successful!')
  }

  const handleErrorNotification = () => {
    error('Operation failed, please try again')
  }

  const handleWarningNotification = () => {
    warning('Please note, this is a warning message')
  }

  const handleInfoNotification = () => {
    info('This is an information prompt')
  }

  const handleLongDurationNotification = () => {
    success('This notification will display for a longer time', 5000)
  }

  const handleShortDurationNotification = () => {
    info('This notification will disappear quickly', 1000)
  }

  // New function to test long text notifications
  const handleLongTextNotification = () => {
    const longText =
      'This is a very long notification message to test how the notification component handles lengthy content. ' +
      'The notification should properly wrap the text and display it in a readable format without overflowing or causing layout issues. ' +
      'This ensures that our notification component works well with various content lengths and maintains good usability.'
    show(longText, { duration: 5000 } as ShowOptions)
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Notification Component Test Page</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button onClick={handleShowNotification} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
          Show
        </button>

        <button onClick={handleSuccessNotification} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
          Success
        </button>

        <button onClick={handleErrorNotification} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
          Error
        </button>

        <button onClick={handleWarningNotification} className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded">
          Warning
        </button>

        <button onClick={handleInfoNotification} className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded">
          Info
        </button>

        <button onClick={handleLongDurationNotification} className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded">
          Long
        </button>

        <button onClick={handleShortDurationNotification} className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded">
          Short
        </button>

        <button onClick={handleLongTextNotification} className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded">
          Long Text
        </button>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Instructions</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Click buttons to test different types of notifications</li>
          <li>Notifications will automatically disappear, default duration is 3 seconds</li>
          <li>You can manually close by clicking the close button in the upper right corner</li>
          <li>A maximum of 4 notifications can be displayed simultaneously, excess notifications will be automatically removed</li>
          <li>Test the "Long Text" to see how the component handles lengthy content</li>
        </ul>
      </div>
    </div>
  )
}
