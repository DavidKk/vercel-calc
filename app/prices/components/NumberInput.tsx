import classNames from 'classnames'
import { useId, useRef, useState } from 'react'

import { useNotification } from '@/components/Notification'
import { formatNumberWithCommas, parseFormattedNumber } from '@/utils/format'

import { isFormula } from '../types'

export interface Suggestion {
  label: string
  value: string
}

export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  unit: string
  supportFormula?: boolean
  suggestions?: Suggestion[]
  onChange: (value: string, numericValue: number) => void
  onFocus?: () => void
  onBlur?: () => void
  enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'
  tabIndex?: number
}

export function NumberInput(props: NumberInputProps) {
  const { value, unit, supportFormula = true, suggestions = [], onChange, onFocus, onBlur, enterKeyHint, tabIndex, ...restProps } = props
  const inputRef = useRef<HTMLInputElement>(null)
  const { error } = useNotification()
  const [showSuggestions, setShowSuggestions] = useState(false)
  const id = useId()

  const isFormulaMode = isFormula(value)
  const displayValue = isFormulaMode ? value.substring(1) : value

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    // In normal mode, only allow digits, commas, periods, and minus sign
    if (!isFormulaMode) {
      // Allow empty value
      if (inputValue === '') {
        onChange('', 0)
        return
      }
    }

    if (!supportFormula) {
      const numericValue = parseFormattedNumber(inputValue)
      const dotMatch = inputValue.match(/\.+$/)

      let formattedValue = formatNumberWithCommas(inputValue)
      if (dotMatch) {
        if (!formattedValue.endsWith('.')) {
          formattedValue += '.'
        }
      }

      if (inputValue.startsWith('=')) {
        error('not support formula')
        return
      }

      onChange(formattedValue, numericValue)
      return
    }

    if (isFormulaMode) {
      onChange('=' + inputValue, 0)
      return
    }

    if (inputValue.startsWith('=')) {
      const formulaContent = inputValue.substring(1)
      onChange('=' + formulaContent, 0)
      return
    }

    const numericValue = parseFormattedNumber(inputValue)
    const dotMatch = inputValue.match(/\.+$/)

    let formattedValue = formatNumberWithCommas(inputValue)
    if (dotMatch) {
      if (!formattedValue.endsWith('.')) {
        formattedValue += '.'
      }
    }

    onChange(formattedValue, numericValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!supportFormula) {
      return
    }

    if (isFormulaMode && displayValue === '' && e.key === 'Backspace') {
      onChange('', 0)
    }

    // Handle Enter key based on enterKeyHint
    if (e.key === 'Enter') {
      // If enterKeyHint is 'done', blur the input to close keyboard
      if (enterKeyHint === 'done') {
        inputRef.current?.blur()
        e.preventDefault()
        return
      }

      // For 'next' or other navigation hints, try to focus next element
      if (enterKeyHint === 'next') {
        // Try to focus next element based on tabIndex
        if (tabIndex !== undefined) {
          const nextElement = document.querySelector(`input[tabindex="${tabIndex + 1}"]`) as HTMLElement | null
          if (nextElement) {
            nextElement.focus()
            e.preventDefault()
            return
          }
        }
      }
    }
  }

  const handleFocus = () => {
    setShowSuggestions(true)
    onFocus?.()
  }

  const handleBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 150)
    onBlur?.()
  }

  const handleSuggestionSelect = (value: string) => {
    // When a suggestion is selected, we need to parse the value to get the numeric part
    // If it's a formula (starts with =), we pass 0 as numeric value
    const isFormulaValue = isFormula(value)
    onChange(value, isFormulaValue ? 0 : parseFormattedNumber(value))
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  // Determine if we should show suggestions
  // Only show if there are suggestions, supportFormula is enabled, and the input is empty
  const shouldShowSuggestions = showSuggestions && supportFormula && suggestions.length > 0

  return (
    <div className="flex flex-col relative">
      <div className="flex items-center box-border w-full h-12 rounded-lg bg-gray-800">
        {isFormulaMode && (
          <div className="flex items-center justify-center flex-shrink-0 h-12 min-w-6 pl-3">
            <span className="select-none pointer-events-none bg-transparent inline-block text-gray-400 text-base">=</span>
          </div>
        )}

        <div className="flex-1 h-full relative">
          <input
            {...restProps}
            id={id}
            ref={inputRef}
            className={classNames('bg-transparent text-white font-light focus:outline-none min-w-0 border-0 w-full h-full py-0 px-3 leading-[3rem]', {
              'text-left': isFormulaMode,
              'text-right': !isFormulaMode,
            })}
            value={displayValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            enterKeyHint={enterKeyHint}
            tabIndex={tabIndex}
          />
        </div>

        {!isFormulaMode && (
          <div className="flex items-center justify-center flex-shrink-0 h-12 min-w-6 pr-3">
            <span className="select-none pointer-events-none bg-transparent inline-block text-gray-400 text-base">{unit}</span>
          </div>
        )}
      </div>

      {/* Suggestions dropdown - only show when there are suggestions and input is empty */}
      {shouldShowSuggestions && (
        <div className="absolute top-[calc(100%+2px)] mt-1 w-full bg-gray-800 rounded-md shadow-lg overflow-hidden border border-gray-700 z-10">
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer" onClick={() => handleSuggestionSelect(suggestion.value)}>
                {suggestion.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
