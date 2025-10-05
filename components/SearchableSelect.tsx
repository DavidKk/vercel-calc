'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import classNames from 'classnames'
import { fuzzyMatch } from '@/utils/fuzzyMatch'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

export interface Option {
  value: any
  label: string
}

export interface SearchableSelectProps {
  className?: string
  value?: any
  placeholder?: string
  options?: Option[]
  onChange?: (value: any) => void
  clearable?: boolean
  required?: boolean
  size?: 'sm' | 'md' | 'lg'
  searchable?: boolean
}

export default function SearchableSelect(props: SearchableSelectProps) {
  const { className, options = [], value, placeholder, onChange, clearable = true, size = 'sm', searchable = true } = props

  const [selectedOption, setSelectedOption] = useState(value)
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter options based on search term using fuzzy matching with useMemo
  const filteredOptions = useMemo(() => {
    if (searchTerm) {
      return options
        .map((option) => ({
          option,
          matchResult: fuzzyMatch(option.label, searchTerm),
        }))
        .filter(({ matchResult }) => matchResult.matched)
        .sort((a, b) => b.matchResult.score - a.matchResult.score)
        .map(({ option }) => option)
    } else {
      return options
    }
  }, [searchTerm, options])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleOptionSelect = (optionValue: any) => {
    setSelectedOption(optionValue)
    onChange && onChange(optionValue)
    setIsOpen(false)
    setSearchTerm('')
  }

  const clearSelection = () => {
    setSelectedOption('')
    onChange && onChange(undefined)
    setSearchTerm('')
  }

  // Update selected option when value prop changes
  useEffect(() => {
    setSelectedOption(value)
  }, [value])

  // Find the label for the selected value
  const selectedLabel = options.find((option) => option.value === selectedOption)?.label || ''

  return (
    <div
      ref={selectRef}
      className={classNames('relative', 'w-full', 'flex', 'flex-nowrap', className, {
        rounded: size === 'sm',
        'rounded-md': size === 'md',
        'rounded-lg': size === 'lg',
      })}
    >
      {/* Display selected value or placeholder */}
      <div
        className={classNames(
          'w-full',
          'pl-4',
          'pr-8',
          'appearance-none',
          'box-border',
          'bg-gray-800',
          'flex',
          'items-center',
          'cursor-pointer',
          'rounded-lg',
          'h-12',
          selectedOption ? 'text-white' : 'text-gray-400',
          {
            'text-sm': size === 'sm',
            'text-base': size === 'md',
            'text-lg': size === 'lg',
          }
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption ? <span className="truncate">{selectedLabel}</span> : <span className="text-gray-400">{placeholder || 'Select'}</span>}
      </div>

      {/* Dropdown arrow and clear button */}
      <div
        className={classNames('flex', 'items-center', 'justify-center', 'absolute', 'right-2', 'top-1/2', 'transform', '-translate-y-1/2', {
          'h-4 w-4': size === 'sm',
          'h-5 w-5': size === 'md',
          'h-6 w-6': size === 'lg',
        })}
      >
        {!!selectedOption && clearable ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              clearSelection()
            }}
            className="text-gray-400 hover:text-white"
          >
            &#10005;
          </button>
        ) : (
          <div className="pointer-events-none">
            <ChevronDownIcon
              className={classNames('text-gray-400', isOpen ? 'rotate-180' : '', 'transition-transform', {
                'h-4 w-4': size === 'sm',
                'h-5 w-5': size === 'md',
                'h-6 w-6': size === 'lg',
              })}
            />
          </div>
        )}
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={classNames(
            'absolute',
            'top-full',
            'left-0',
            'right-0',
            'mt-1',
            'bg-gray-800',
            {
              rounded: size === 'sm',
              'rounded-md': size === 'md',
              'rounded-lg': size === 'lg',
            },
            'shadow-lg',
            'z-10'
          )}
        >
          {/* Search input */}
          {searchable && (
            <div className="p-2">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className={classNames('w-full', 'px-3', 'focus:outline-none', 'focus:ring-1', 'focus:ring-blue-500', 'bg-gray-800', 'text-white', 'rounded-md', {
                  'text-sm': size === 'sm',
                  'py-1': size === 'sm',
                  'text-base': size === 'md',
                  'py-2': size === 'md' || size === 'lg',
                  'text-lg': size === 'lg',
                })}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* Options list */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={classNames(
                    'px-4',
                    'cursor-pointer',
                    'hover:bg-gray-700',
                    'flex',
                    'items-center',
                    'border-0',
                    'box-border',
                    'w-full',
                    'text-white',
                    option.value === selectedOption ? 'bg-gray-700 text-white' : '',
                    {
                      'py-1': size === 'sm',
                      'py-2': size === 'md',
                      'py-3': size === 'lg',
                    }
                  )}
                  onClick={() => handleOptionSelect(option.value)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div
                className={classNames('px-4', 'text-gray-400', 'flex', 'items-center', 'border-0', 'box-border', 'w-full', {
                  'py-1': size === 'sm',
                  'py-2': size === 'md',
                  'py-3': size === 'lg',
                })}
              >
                No matches found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
