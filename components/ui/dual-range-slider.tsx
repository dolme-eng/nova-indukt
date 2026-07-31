'use client'

import { useCallback } from 'react'

interface DualRangeSliderProps {
  min: number
  max: number
  step?: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  className?: string
}

export function DualRangeSlider({
  min,
  max,
  step = 50,
  value,
  onChange,
  className = '',
}: DualRangeSliderProps) {
  const [minVal, maxVal] = value

  const minPercent = ((minVal - min) / (max - min)) * 100
  const maxPercent = ((maxVal - min) / (max - min)) * 100

  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMin = Math.min(Number(e.target.value), maxVal - step)
      onChange([newMin, maxVal])
    },
    [maxVal, step, onChange]
  )

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMax = Math.max(Number(e.target.value), minVal + step)
      onChange([minVal, newMax])
    },
    [minVal, step, onChange]
  )

  return (
    <div className={`relative h-2 rounded-full bg-gray-100 ${className}`}>
      {/* Active range fill */}
      <div
        className="absolute bottom-0 top-0 rounded-full bg-[#4ECCA3]"
        style={{
          left: `${minPercent}%`,
          width: `${maxPercent - minPercent}%`,
        }}
      />

      {/* Min thumb */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minVal}
        onChange={handleMinChange}
        aria-label="Minimaler Preis"
        className="absolute inset-0 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#4ECCA3] [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-md [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#4ECCA3] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110"
        style={{ zIndex: minVal > max - 100 ? 5 : 3 }}
      />

      {/* Max thumb */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxVal}
        onChange={handleMaxChange}
        aria-label="Maximaler Preis"
        className="absolute inset-0 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#4ECCA3] [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-md [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#4ECCA3] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110"
        style={{ zIndex: 4 }}
      />
    </div>
  )
}
