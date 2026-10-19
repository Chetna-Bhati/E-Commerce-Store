import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import api from '../api/client';
import ProductGrid from '../components/product/ProductGrid';
import { formatPrice } from '../utils/formatters';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, page: 1, limit: 12 });
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Read URL query params
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('q') || '';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const sortParam = searchParams.get('sort') || 'popular';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  // Local filter states
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams(searchParams);
        if (!queryParams.has('limit')) queryParams.set('limit', '12');

        const res = await api.get(`/products?${queryParams.toString()}`);
        if (res.data.success) {
          setProducts(res.data.data);
          setPagination(res.data.pagination);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [searchParams]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '1'); // reset page on filter change
    setSearchParams(next);
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (minPrice) next.set('minPrice', minPrice); else next.delete('minPrice');
    if (maxPrice) next.set('maxPrice', maxPrice); else next.delete('maxPrice');
    next.set('page', '1');
    setSearchParams(next);
  };

  const resetAllFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E2E2E0] pb-5">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl text-[#111111] tracking-tight">
            {categoryParam ? categoryParam.replace(/-/g, ' ').toUpperCase() : 'All Apparel & Essentials'}
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-1">
            Showing {products.length} of {pagination.total} items • Built for Indian everyday comfort
          </p>
        </div>

        {/* Sort & Filter Toggle */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden flex items-center gap-2 px-3 py-2 bg-[#FFFFFF] border border-[#E2E2E0] text-xs font-bold text-[#111111]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#6B6B6B] hidden sm:inline">Sort by:</span>
            <select
              value={sortParam}
              onChange={(e) => updateParam('sort', e.target.value)}
              aria-label="Sort products"
              className="px-3 py-2 bg-[#FFFFFF] border border-[#E2E2E0] focus:border-[#111111] text-xs font-medium text-[#111111]"
            >
              <option value="popular">Popularity & Rating</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Badges */}
      {(categoryParam || searchParam || minPriceParam || maxPriceParam) && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#6B6B6B]">Active filters:</span>
          {searchParam && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FFFFFF] border border-[#E2E2E0] text-[#111111] font-medium">
              Search: "{searchParam}"
              <button onClick={() => updateParam('q', '')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {categoryParam && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FFFFFF] border border-[#E2E2E0] text-[#111111] font-medium">
              Category: {categoryParam}
              <button onClick={() => updateParam('category', '')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {(minPriceParam || maxPriceParam) && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FFFFFF] border border-[#E2E2E0] text-[#111111] font-medium">
              Price: ₹{minPriceParam || '0'} - ₹{maxPriceParam || '5000+'}
              <button onClick={() => { updateParam('minPrice', ''); updateParam('maxPrice', ''); setMinPrice(''); setMaxPrice(''); }}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={resetAllFilters}
            className="text-[#F97316] font-bold underline hover:text-[#EA580C] ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Grid & Filter Sidebar Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filter Sidebar (Desktop) */}
        <aside className="hidden md:block space-y-6">
          <div className="bg-[#FFFFFF] border border-[#E2E2E0] p-4 rounded space-y-6">
            {/* Category Filter List */}
            <div className="space-y-3">
              <h4 className="font-heading text-xs uppercase tracking-wider text-[#111111]">Categories</h4>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => updateParam('category', '')}
                  className={`block w-full text-left py-1 hover:text-[#F97316] transition-colors ${
                    !categoryParam ? 'font-bold text-[#F97316]' : 'text-[#6B6B6B]'
                  }`}
                >
                  All Categories ({pagination.total})
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => updateParam('category', c.slug)}
                    className={`block w-full text-left py-1 hover:text-[#F97316] transition-colors ${
                      categoryParam === c.slug ? 'font-bold text-[#F97316]' : 'text-[#6B6B6B]'
                    }`}
                  >
                    {c.name} {c.product_count !== undefined && `(${c.product_count})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3 pt-4 border-t border-[#E2E2E0]">
              <h4 className="font-heading text-xs uppercase tracking-wider text-[#111111]">Price Range (₹)</h4>
              <form onSubmit={handlePriceApply} className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-2 py-1.5 bg-[#F5F4F2] border border-[#E2E2E0] focus:outline-none"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-2 py-1.5 bg-[#F5F4F2] border border-[#E2E2E0] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-1.5 bg-[#111111] text-[#FFFFFF] text-xs font-bold hover:bg-[#2B2B2B] transition-colors"
                >
                  Apply Price
                </button>
              </form>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="md:col-span-3 space-y-8">
          <ProductGrid products={products} loading={loading} />

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-[#E2E2E0]">
              <button
                disabled={!pagination.hasPrevPage}
                onClick={() => updateParam('page', (pagination.page - 1).toString())}
                className="px-3 py-1.5 bg-[#FFFFFF] border border-[#E2E2E0] text-xs font-bold text-[#111111] disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs text-[#6B6B6B] px-2">
                Page <strong className="text-[#111111]">{pagination.page}</strong> of <strong className="text-[#111111]">{pagination.totalPages}</strong>
              </span>
              <button
                disabled={!pagination.hasNextPage}
                onClick={() => updateParam('page', (pagination.page + 1).toString())}
                className="px-3 py-1.5 bg-[#FFFFFF] border border-[#E2E2E0] text-xs font-bold text-[#111111] disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
