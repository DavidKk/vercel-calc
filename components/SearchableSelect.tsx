'use client'

import { ChevronDownIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useIsMobile } from '@/hooks/useMobile'
import { fuzzyMatch } from '@/utils/fuzzyMatch'

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
  enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'
  tabIndex?: number
}

export default function SearchableSelect(props: SearchableSelectProps) {
  const { className, options = [], value, placeholder, onChange, clearable = true, size = 'sm', searchable = true, enterKeyHint = 'done', tabIndex } = props

  const [selectedOption, setSelectedOption] = useState(value)
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const selectRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isMobile = useIsMobile()

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
        setActiveIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Focus input when dropdown opens
  useEffect(() => {
    if (isMobile) {
      return
    }

    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMobile])

  // Scroll active option into view
  useEffect(() => {
    if (activeIndex >= 0 && isOpen) {
      const optionElements = selectRef.current?.querySelectorAll('[data-option-index]')
      if (optionElements && optionElements[activeIndex]) {
        optionElements[activeIndex].scrollIntoView({ block: 'nearest' })
      }
    }
  }, [activeIndex, isOpen])

  const handleOptionSelect = (optionValue: any) => {
    setSelectedOption(optionValue)
    onChange && onChange(optionValue)
    setIsOpen(false)
    setSearchTerm('')
    setActiveIndex(-1)
    
    // Move focus to next element if enterKeyHint is 'next' or 'done'
    if (enterKeyHint === 'next' || enterKeyHint === 'done') {
      if (tabIndex !== undefined) {
        const nextElement = document.querySelector(`input[tabindex="${tabIndex + 1}"]`) as HTMLElement | null
        if (nextElement) {
          nextElement.focus()
        }
      }
    }
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

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setIsOpen(true)
        setActiveIndex(-1)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (filteredOptions.length > 0) {
          setActiveIndex(prevIndex => 
            prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : prevIndex
          )
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (filteredOptions.length > 0) {
          setActiveIndex(prevIndex => 
            prevIndex > 0 ? prevIndex - 1 : -1
          )
        }
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
          handleOptionSelect(filteredOptions[activeIndex].value)
        } else if (filteredOptions.length > 0) {
          handleOptionSelect(filteredOptions[0].value)
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setActiveIndex(-1)
        break
    }
  }

  return (
    <div
      ref={selectRef}
      className={classNames('relative', 'w-full', 'flex', 'flex-nowrap', className, {
        rounded: size === 'sm',
        'rounded-md': size === 'md',
        'rounded-lg': size === 'lg',
      })}
      onKeyDown={handleKeyDown}
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
        tabIndex={tabIndex}
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
                className={classNames(
                  'w-full',
                  'px-3',
                  'focus:outline-none',
                  'focus:ring-1',
                  'focus:ring-blue-500',
                  'bg-gray-800',
                  'text-white',
                  'rounded-md',
                  'border',
                  'border-gray-600',
                  {
                    'text-sm': size === 'sm',
                    'py-1': size === 'sm',
                    'text-base': size === 'md',
                    'py-2': size === 'md' || size === 'lg',
                    'text-lg': size === 'lg',
                  }
                )}
                onClick={(e) => e.stopPropagation()}
                enterKeyHint={enterKeyHint}
              />
            </div>
          )}

          {/* Options list */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  data-option-index={index}
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
                    index === activeIndex ? 'bg-gray-700' : '',
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