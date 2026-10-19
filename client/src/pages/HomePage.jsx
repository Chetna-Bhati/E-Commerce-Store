import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import api from '../api/client';
import ProductGrid from '../components/product/ProductGrid';
import CategoryChips from '../components/product/CategoryChips';
import InfoStrip from '../components/common/InfoStrip';
import { getImageUrl, DEFAULT_PRODUCT_IMAGE } from '../utils/imageHelper';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get(`/products?limit=8${selectedCategory !== 'all' ? `&category=${selectedCategory}` : ''}`)
        ]);

        if (catRes.data.success) {
          setCategories(catRes.data.data);
        }
        if (prodRes.data.success) {
          setProducts(prodRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [selectedCategory]);

  return (
    <div className="space-y-10 pb-16">
      {/* Editorial Split Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 border border-[#E2E2E0] overflow-hidden rounded">
          {/* Left Block: Deep Black Statement Block */}
          <div className="lg:col-span-7 bg-[#111111] text-[#F5F4F2] p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#222222] border border-[#333333] text-[11px] font-bold text-[#F97316] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>New Season Essentials</span>
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#FFFFFF] tracking-tight leading-[1.05]">
                Everyday clothes. <br />
                <span className="text-[#F97316]">Fair prices.</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#A3A3A3] max-w-md leading-relaxed pt-2">
                Heavyweight 240 GSM combed cottons, natural French linen blends, and genuine raw selvedge denim built to withstand daily Indian weather without the middleman markup.
              </p>
            </div>

            <div className="pt-8 sm:pt-12 flex flex-wrap items-center gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#F97316] text-[#111111] font-heading font-extrabold text-xs uppercase tracking-wider hover:bg-[#EA580C] transition-colors rounded"
              >
                <span>Shop Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products?category=t-shirts"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-transparent border border-[#333333] text-[#FFFFFF] font-heading font-bold text-xs uppercase tracking-wider hover:bg-[#222222] transition-colors rounded"
              >
                <span>Heavyweight Tees</span>
              </Link>
            </div>
          </div>

          {/* Right Block: Warm Orange Brand Visual Showcase */}
          <div className="lg:col-span-5 bg-[#F97316] p-8 sm:p-12 flex flex-col justify-center items-center text-[#111111] relative overflow-hidden">
            <div className="relative w-full max-w-sm aspect-[4/5] bg-[#FFFFFF] border-2 border-[#111111] shadow-2xl p-3 flex flex-col justify-between rounded">
              <div className="w-full aspect-[4/5] bg-[#EBEBE9] overflow-hidden border border-[#E2E2E0]">
                <img
                  src={getImageUrl('/images/products/heavyweight-boxy-tee-1')}
                  alt="Heavyweight Boxy Tee"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = DEFAULT_PRODUCT_IMAGE;
                  }}
                />
              </div>
              <div className="pt-3 flex items-center justify-between">
                <div>
                  <p className="font-heading text-xs uppercase font-extrabold text-[#111111]">Featured Essential</p>
                  <p className="text-[11px] text-[#6B6B6B]">Heavyweight Boxy Tee • 240 GSM</p>
                </div>
                <span className="font-heading text-sm font-black text-[#111111]">₹799</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Strip */}
      <InfoStrip />

      {/* Catalog & Filter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E2E2E0] pb-4">
          <div>
            <p className="text-xs font-bold text-[#F97316] uppercase tracking-wider">Curated Wardrobe</p>
            <h2 className="font-heading text-2xl sm:text-3xl text-[#111111] tracking-tight mt-0.5">
              Popular Staples
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-[#111111] hover:text-[#F97316] flex items-center gap-1 transition-colors"
          >
            <span>View all 40 products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Category Chips */}
        <CategoryChips
          categories={categories}
          activeCategory={selectedCategory}
          onSelectCategory={(slug) => setSelectedCategory(slug)}
        />

        {/* Products Grid */}
        <ProductGrid products={products} loading={loading} />
      </section>
    </div>
  );
}
