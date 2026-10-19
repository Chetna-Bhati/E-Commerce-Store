import React from 'react';

export default function CategoryChips({
  categories = [],
  activeCategory = 'all',
  onSelectCategory
}) {
  const allCategories = [{ id: 'all', slug: 'all', name: 'All' }, ...categories];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {allCategories.map((cat) => {
        const isActive = activeCategory.toLowerCase() === cat.slug.toLowerCase();
        return (
          <button
            key={cat.slug}
            onClick={() => onSelectCategory(cat.slug)}
            className={`whitespace-nowrap px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-all ${
              isActive
                ? 'bg-[#111111] text-[#FFFFFF] border-[#111111]'
                : 'bg-[#FFFFFF] text-[#111111] border-[#E2E2E0] hover:border-[#111111]'
            }`}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
