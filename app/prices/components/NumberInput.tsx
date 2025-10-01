import { useState, useId } from 'react'
import classNames from 'classnames'
import { formatNumberWithCommas, parseFormattedNumber } from '@/utils/format'

export interface NumberInputProps {
  value: string
  unit: string
  label: string
  onChange: (value: string, numericValue: number) => void
}

export function NumberInput(props: NumberInputProps) {
  const { value, unit, label, onChange } = props
  const [isFocused, setIsFocused] = useState(false)

  const id = useId()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
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

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  return (
    <div className="flex items-center box-border w-full h-12 rounded-lg bg-gray-800 gap-1">
      <div className="flex-1 h-full relative">
        <input
          id={id}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-16 bg-transparent text-white font-light focus:outline-none text-right min-w-0 border-0 w-full h-full py-0 px-3 leading-[3rem]"
        />
      </div>

      <label htmlFor={id} className="flex-shrink-0 h-12 flex items-center pr-3">
        <span
          className={classNames(
            'select-none pointer-events-none transition-all duration-200 ease-in-out bg-transparent inline-block text-gray-400 text-base transform origin-bottom-left',
            {
              'scale-75': !!(value || isFocused),
            }
          )}
        >
          {label}&nbsp;({unit})
        </span>
      </label>
    </div>
  )
}
