import React from 'react';
import ProductCard from './ProductCard';
import { ProductGridSkeleton } from '../common/Skeleton';

export default function ProductGrid({ products = [], loading = false, emptyMessage = 'No products found matching your selection.' }) {
  if (loading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-[#FFFFFF] border border-[#E2E2E0] p-8">
        <p className="font-heading text-lg text-[#111111]">{emptyMessage}</p>
        <p className="text-xs text-[#6B6B6B] mt-1">Try broadening your search or resetting active filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
