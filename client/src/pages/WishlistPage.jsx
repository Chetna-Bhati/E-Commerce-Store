import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/product/ProductCard';

export default function WishlistPage() {
  const { wishlist, loading } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-[#E2E2E0] pb-4">
        <h1 className="font-heading text-2xl sm:text-3xl text-[#111111] tracking-tight">Saved Wishlist</h1>
        <p className="text-xs text-[#6B6B6B] mt-0.5">{wishlist.length} saved essentials</p>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <p className="font-heading text-base text-[#111111] animate-pulse">Loading wishlist...</p>
        </div>
      ) : wishlist.length === 0 ? (
        <div className="bg-[#FFFFFF] border border-[#E2E2E0] p-12 text-center space-y-4 rounded">
          <Heart className="w-10 h-10 text-[#6B6B6B] mx-auto" />
          <div>
            <h3 className="font-heading text-lg text-[#111111]">Your Wishlist is Empty</h3>
            <p className="text-xs text-[#6B6B6B] mt-1">Tap the heart icon on any garment to save it for later.</p>
          </div>
          <Link to="/products" className="inline-block px-5 py-2.5 bg-[#111111] text-white text-xs font-bold rounded">
            Explore Apparel
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {wishlist.map((item) => (
            <ProductCard
              key={item.productId}
              product={{
                id: item.productId,
                name: item.name,
                slug: item.slug,
                fabric: item.fabric,
                price: item.price,
                mrp: item.mrp,
                discountPercent: item.discountPercent,
                primary_image: item.primaryImage,
                rating: item.rating,
                review_count: item.reviewCount
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
