'use client'

import { useState, useEffect } from 'react'
import { BackspaceIcon } from '@heroicons/react/24/solid'

export interface ProductFilterProps {
  onFilterChange: (filterText: string) => void
  placeholder?: string
}

export function ProductFilter({ onFilterChange, placeholder = 'Filter products...' }: ProductFilterProps) {
  const [filterText, setFilterText] = useState<string>('')

  useEffect(() => {
    onFilterChange(filterText)
  }, [filterText, onFilterChange])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value)
  }

  const clearFilter = () => {
    setFilterText('')
  }

  return (
    <div className="flex gap-2 mb-3">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          value={filterText}
          onChange={handleInputChange}
        />
        {filterText && (
          <button
            onClick={clearFilter}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-white transition-colors"
            aria-label="Clear filter"
          >
            <BackspaceIcon />
          </button>
        )}
      </div>
    </div>
  )
}
