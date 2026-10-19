import React from 'react';

export function DiscountBadge({ discount }) {
  if (!discount || discount <= 0) return null;
  return (
    <span className="inline-block bg-[#111111] text-[#FFFFFF] text-[10px] font-bold px-1.5 py-0.5 tracking-wider uppercase">
      {discount}% OFF
    </span>
  );
}

export function StatusBadge({ status }) {
  const statusStyles = {
    PLACED: 'bg-neutral-100 text-neutral-800 border-neutral-300',
    PACKED: 'bg-amber-50 text-amber-900 border-amber-300',
    SHIPPED: 'bg-orange-50 text-orange-900 border-orange-300',
    DELIVERED: 'bg-emerald-50 text-emerald-900 border-emerald-300',
    CANCELLED: 'bg-red-50 text-red-800 border-red-300'
  };

  const currentStyle = statusStyles[status] || 'bg-neutral-100 text-neutral-800 border-neutral-300';

  return (
    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 border uppercase tracking-wider ${currentStyle}`}>
      {status}
    </span>
  );
}
