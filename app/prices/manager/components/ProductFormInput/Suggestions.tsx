import classNames from 'classnames'
import { useEffect, useRef } from 'react'

import type { SuggestionOption } from './Input'

export interface SuggestionsProps {
  isOpen: boolean
  suggestions: SuggestionOption[]
  activeIndex: number
  onSelect: (suggestion: SuggestionOption) => void
  onActiveIndexChange: (index: number) => void
  onOpenChange: (isOpen: boolean) => void
  onSuggestionSelect: (suggestion: SuggestionOption) => void
}

export function Suggestions({ isOpen, suggestions, activeIndex, onSelect, onActiveIndexChange, onOpenChange, onSuggestionSelect }: SuggestionsProps) {
  const listRef = useRef<HTMLDivElement>(null)

  // Scroll active suggestion into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement
      if (item) {
        item.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [activeIndex])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) {
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        onActiveIndexChange(activeIndex < suggestions.length - 1 ? activeIndex + 1 : activeIndex)
        break
      case 'ArrowUp':
        e.preventDefault()
        onActiveIndexChange(activeIndex > 0 ? activeIndex - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          onSuggestionSelect(suggestions[activeIndex])
        } else if (suggestions.length > 0) {
          onSuggestionSelect(suggestions[0])
        }
        break
      case 'Escape':
        onOpenChange(false)
        onActiveIndexChange(-1)
        break
    }
  }

  if (!isOpen || suggestions.length === 0) {
    return null
  }

  return (
    <div
      ref={listRef}
      className="absolute top-full left-0 right-0 mt-1 bg-gray-800 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto border border-gray-700"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {suggestions.map((suggestion, index) => (
        <div
          key={suggestion.value}
          className={classNames('px-3 py-2 cursor-pointer hover:bg-gray-700 text-white', {
            'bg-gray-700': index === activeIndex,
          })}
          onClick={() => onSelect(suggestion)}
          onMouseDown={(e) => e.preventDefault()} // Prevent blur on click
        >
          {suggestion.label}
        </div>
      ))}
    </div>
  )
}
