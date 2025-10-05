import { useClickAway } from 'ahooks'
import classNames from 'classnames'
import { useEffect, useMemo, useRef, useState } from 'react'

import { fuzzyMatch } from '@/utils/fuzzyMatch'

import { Suggestions } from './Suggestions'

export interface SuggestionOption {
  label: string
  value: string
}

export interface ProductFormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  required?: boolean
  suggestions?: SuggestionOption[]
  value?: string
  validator?: (value: string) => true | string
}

export function ProductFormInput({ label, prefix, required, suggestions = [], className, disabled, value, validator, ...props }: ProductFormInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validate = (valueToValidate: string) => {
    if (!validator) {
      return true
    }

    // If the value contains product info in parentheses, extract just the unit conversion part for validation
    let valueForValidation = valueToValidate || ''
    if (valueForValidation.includes(' (') && valueForValidation.endsWith(')')) {
      // Extract just the unit conversion part (before the parentheses)
      valueForValidation = valueForValidation.split(' (')[0]
    }

    const result = validator(valueForValidation)
    if (result === true) {
      setError(false)
      setErrorMessage('')
      inputRef.current?.setCustomValidity('')
      return true
    }

    setError(true)

    const errorMessage = result || 'Invalid input'
    setErrorMessage(errorMessage)
    inputRef.current?.setCustomValidity(errorMessage)

    return false
  }

  const filteredSuggestions = useMemo(() => {
    if (!suggestions || suggestions.length === 0) {
      return []
    }

    if (!value) {
      return suggestions
    }

    const matchedSuggestions = []
    for (let i = 0; i < suggestions.length; i++) {
      const suggestion = suggestions[i]
      const matchResult = fuzzyMatch(suggestion.label, value)

      if (matchResult.matched) {
        matchedSuggestions.push({
          suggestion,
          score: matchResult.score,
        })
      }
    }

    matchedSuggestions.sort((a, b) => b.score - a.score)
    return matchedSuggestions.map(({ suggestion }) => suggestion)
  }, [value, suggestions])

  useClickAway(() => {
    setIsOpen(false)
    setActiveIndex(-1)
    setIsFocused(false)
  }, containerRef)

  const handleSuggestionSelect = (suggestion: SuggestionOption) => {
    setIsOpen(false)
    setActiveIndex(-1)

    validate(suggestion.value)

    if (props.onChange) {
      // When selecting a suggestion, we want to populate the input with just the unit conversion part
      // Extract just the unit conversion part (before the parentheses) if it contains product info
      let valueToSet = suggestion.value
      if (valueToSet.includes(' (') && valueToSet.endsWith(')')) {
        // Extract just the unit conversion part (before the parentheses)
        valueToSet = valueToSet.split(' (')[0]
      }

      const target = { value: valueToSet }
      const event = { target } as React.ChangeEvent<HTMLInputElement>
      props.onChange(event)
    }

    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    if (suggestions && suggestions.length > 0) {
      setIsOpen(true)
    }

    props.onFocus?.(e)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validate(e.target.value)
    props.onChange?.(e)
  }

  useEffect(() => {
    if (value) {
      validate(value)
    }
  }, [value])

  useEffect(() => {
    const handleReset = () => {
      setError(false)
      setErrorMessage('')
      inputRef.current?.setCustomValidity('')
    }

    const form = inputRef.current?.closest('form')
    form?.addEventListener('reset', handleReset)
    return () => form?.removeEventListener('reset', handleReset)
  }, [])

  return (
    <div className="flex flex-col gap-2">
      <label className="text-gray-300 text-sm font-medium">
        {label} {required && <span>*</span>}
      </label>

      <div ref={containerRef} className="flex flex-col gap-1 relative">
        <div className="flex items-center relative">
          {prefix && <span className="absolute left-3 text-gray-400 z-10">{prefix}</span>}
          <input
            {...props}
            ref={inputRef}
            className={classNames(
              'w-full bg-gray-800 text-white px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500',
              {
                'pl-8': prefix,
                'bg-gray-700 border-gray-600 text-gray-400': disabled,
                'border-red-500': error && !disabled,
                'border-gray-700 focus:border-transparent': !error && !disabled,
              },
              className
            )}
            required={required}
            disabled={disabled}
            value={value}
            onFocus={handleFocus}
            onChange={handleChange}
          />
          {disabled && <div className="absolute inset-0 bg-gray-700 bg-opacity-50 rounded-md cursor-not-allowed z-10"></div>}
        </div>

        <Suggestions
          isOpen={isOpen}
          suggestions={filteredSuggestions}
          activeIndex={activeIndex}
          onSelect={handleSuggestionSelect}
          onActiveIndexChange={setActiveIndex}
          onOpenChange={setIsOpen}
          onSuggestionSelect={handleSuggestionSelect}
        />

        {isFocused && error && errorMessage && (
          <div
            className={classNames('absolute', 'w-full', 'z-50', {
              'bottom-full': filteredSuggestions && filteredSuggestions.length > 0,
              'mb-1': filteredSuggestions && filteredSuggestions.length > 0,
              'top-full': !filteredSuggestions || filteredSuggestions.length === 0,
              'mt-1': !filteredSuggestions || filteredSuggestions.length === 0,
            })}
          >
            <div className="bg-red-50 border border-red-200 text-red-500 text-sm rounded-md p-2 break-words">{errorMessage}</div>
          </div>
        )}
      </div>
    </div>
  )
}
