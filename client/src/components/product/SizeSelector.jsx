import React from 'react';

export default function SizeSelector({ sizes = [], selectedSize, onSelectSize }) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-[#111111]">
          Select Size
        </label>
        <button
          type="button"
          onClick={() => alert('Threadline Standard Indian Fit: S(38"), M(40"), L(42"), XL(44"), XXL(46"). Jeans: True to waist size in inches.')}
          className="text-xs font-medium text-[#6B6B6B] hover:text-[#111111] underline transition-colors"
        >
          Size Guide
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {sizes.map((item) => {
          const isOOS = item.stock <= 0;
          const isSelected = selectedSize === item.size;

          return (
            <button
              key={item.size}
              type="button"
              disabled={isOOS}
              onClick={() => onSelectSize(item.size)}
              className={`min-w-[48px] h-10 px-3 flex items-center justify-center text-xs font-bold border transition-all relative ${
                isOOS
                  ? 'bg-[#F5F4F2] text-[#A3A3A3] border-[#E2E2E0] cursor-not-allowed line-through'
                  : isSelected
                  ? 'bg-[#111111] text-[#FFFFFF] border-[#111111]'
                  : 'bg-[#FFFFFF] text-[#111111] border-[#E2E2E0] hover:border-[#111111]'
              }`}
            >
              {item.size}
              {isOOS && (
                <span className="sr-only">(Out of Stock)</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
