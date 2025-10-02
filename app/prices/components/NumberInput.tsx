import { useRef } from 'react'
import classNames from 'classnames'
import { formatNumberWithCommas, parseFormattedNumber } from '@/utils/format'
import { isFormula } from '../types'
import { useNotification } from '@/components/Notification'

export interface NumberInputProps {
  value: string
  unit: string
  supportFormula?: boolean
  onChange: (value: string, numericValue: number) => void
}

export function NumberInput(props: NumberInputProps) {
  const { value, unit, supportFormula = false, onChange } = props
  const inputRef = useRef<HTMLInputElement>(null)
  const { error } = useNotification()

  const isFormulaMode = isFormula(value)
  const displayValue = isFormulaMode ? value.substring(1) : value

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
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
  }

  return (
    <div className="flex items-center box-border w-full h-12 rounded-lg bg-gray-800">
      {isFormulaMode && (
        <div className="flex items-center justify-center flex-shrink-0 h-12 min-w-6 pl-3">
          <span className="select-none pointer-events-none bg-transparent inline-block text-gray-400 text-base">=</span>
        </div>
      )}

      <div className="flex-1 h-full relative">
        <input
          ref={inputRef}
          className={classNames('bg-transparent text-white font-light focus:outline-none min-w-0 border-0 w-full h-full py-0 px-3 leading-[3rem]', {
            'text-left': isFormulaMode,
            'text-right': !isFormulaMode,
          })}
          type="text"
          value={displayValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>

      {!isFormulaMode && (
        <div className="flex items-center justify-center flex-shrink-0 h-12 min-w-6 pr-3">
          <span className="select-none pointer-events-none bg-transparent inline-block text-gray-400 text-base">{unit}</span>
        </div>
      )}
    </div>
  )
}
