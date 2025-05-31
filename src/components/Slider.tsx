import React from 'react';

interface SliderProps {
  value: number[];
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number[]) => void;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min,
  max,
  step,
  onValueChange,
  className = ''
}) => {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={(e) => onValueChange([parseFloat(e.target.value)])}
      className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${className}`}
      style={{
        background: `linear-gradient(to right, hsl(var(--primary)) ${((value[0] - min) / (max - min)) * 100}%, hsl(var(--muted)) ${((value[0] - min) / (max - min)) * 100}%)`
      }}
    />
  );
}; 