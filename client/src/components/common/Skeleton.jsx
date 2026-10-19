import React from 'react';

export function Skeleton({ className = '' }) {
  return (
    <div className={`bg-[#EBEBE9] animate-pulse rounded ${className}`} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-[#FFFFFF] border border-[#E2E2E0] p-3 space-y-3">
      <Skeleton className="w-full aspect-[4/5]" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
