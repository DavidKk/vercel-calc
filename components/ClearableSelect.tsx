'use client'

import { useEffect, useState, useRef } from 'react'
import classNames from 'classnames'
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline'

export interface Option {
  value: any
  label: string
}

export interface ClearableSelectProps {
  value?: any
  placeholder?: string
  options?: Option[]
  onChange?: (value: any) => void
  clearable?: boolean
  required?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function ClearableSelect(props: ClearableSelectProps) {
  const { options = [], value, placeholder, onChange, clearable = true, required, size = 'sm' } = props
  const [selectedOption, setSelectedOption] = useState(value)
  const selectRef = useRef<HTMLSelectElement>(null)

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    setSelectedOption(value)
    onChange && onChange(value)
  }

  const clearSelection = () => {
    setSelectedOption('')
    onChange && onChange(undefined)
  }

  useEffect(() => {
    setSelectedOption(value)
  }, [value])

  return (
    <div
      className={classNames('relative', 'w-auto', 'flex', 'flex-nowarp', 'shrink-0', {
        rounded: size === 'sm',
        'rounded-md': size === 'md',
        'rounded-lg': size === 'lg',
      })}
    >
      <select
        required={required}
        value={selectedOption}
        onChange={handleOptionChange}
        className={classNames(
          'w-full',
          'pl-4',
          'pr-8',
          'appearance-none',
          'border',
          'rounded-sm',
          'box-border',
          'hover:border-gray-500',
          'bg-white',
          selectedOption ? 'text-black' : 'text-gray-400',
          {
            'h-8': size === 'sm',
            'text-sm': size === 'sm',
            'h-10': size === 'md',
            'text-base': size === 'md',
            'h-12': size === 'lg',
            'text-lg': size === 'lg',
            rounded: size === 'sm',
            'rounded-md': size === 'md',
            'rounded-lg': size === 'lg',
          }
        )}
      >
        {!selectedOption && <option value="">{placeholder || 'Select'}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={!option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <div
        className={classNames('flex', 'items-center', 'justify-center', 'absolute', 'right-2', 'top-1/2', 'transform', '-translate-y-1/2', {
          'h-4 w-4': size === 'sm',
          'h-5 w-5': size === 'md',
          'h-6 w-6': size === 'lg',
        })}
      >
        {!!selectedOption && clearable ? (
          <button onClick={clearSelection} className="text-gray-500 hover:text-gray-800">
            <XMarkIcon className="h-4 w-4" />
          </button>
        ) : (
          <div className="pointer-events-none">
            <ChevronDownIcon
              className={classNames('text-gray-500', {
                'h-4 w-4': size === 'sm',
                'h-5 w-5': size === 'md',
                'h-6 w-6': size === 'lg',
              })}
            />
          </div>
        )}
      </div>
    </div>
  )
}
