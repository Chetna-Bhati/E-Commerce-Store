import React from 'react';

export default function ColorSelector({ colors = [], selectedColor, onSelectColor }) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <label className="text-xs font-bold uppercase tracking-wider text-[#111111]">
        Color: <span className="font-normal text-[#6B6B6B] normal-case ml-1">{selectedColor}</span>
      </label>

      <div className="flex items-center gap-3">
        {colors.map((color) => {
          const isSelected = selectedColor === color.name;
          return (
            <button
              key={color.name}
              type="button"
              onClick={() => onSelectColor(color.name)}
              className={`flex items-center gap-2 p-1 border rounded transition-all ${
                isSelected ? 'border-[#111111] ring-1 ring-[#111111] bg-[#F5F4F2]' : 'border-[#E2E2E0] hover:border-[#6B6B6B]'
              }`}
              title={color.name}
            >
              <span
                className="w-5 h-5 rounded-full border border-black/10 shrink-0"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-xs font-medium text-[#111111] pr-1.5">{color.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
