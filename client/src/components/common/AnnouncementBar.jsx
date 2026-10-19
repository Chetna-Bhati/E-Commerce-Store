import React from 'react';
import { Truck, RotateCcw, Banknote } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <aside aria-label="Store Announcements" className="bg-[#111111] text-[#F5F4F2] text-xs font-medium py-2 px-4 border-b border-[#2B2B2B]">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 text-center overflow-x-auto whitespace-nowrap scrollbar-none">
        <div className="flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-[#F97316]" />
          <span>Free delivery over ₹999</span>
        </div>
        <span className="text-[#6B6B6B] hidden sm:inline">•</span>
        <div className="flex items-center gap-1.5 hidden sm:flex">
          <Banknote className="w-3.5 h-3.5 text-[#F97316]" />
          <span>Cash on delivery available</span>
        </div>
        <span className="text-[#6B6B6B] hidden md:inline">•</span>
        <div className="flex items-center gap-1.5 hidden md:flex">
          <RotateCcw className="w-3.5 h-3.5 text-[#F97316]" />
          <span>7-day easy returns</span>
        </div>
      </div>
    </aside>
  );
}
