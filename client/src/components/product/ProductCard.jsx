import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { DiscountBadge } from '../common/Badge';
import { useWishlist } from '../../context/WishlistContext';
import { getImageUrl, DEFAULT_PRODUCT_IMAGE } from '../../utils/imageHelper';

export default function ProductCard({ product }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const discount = product.discountPercent || 
    (product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0);

  const imageSrc = getImageUrl(product.primary_image || (product.images && product.images[0]));

  return (
    <article className="group bg-[#FFFFFF] border border-[#E2E2E0] hover:border-[#111111] transition-all flex flex-col h-full relative">
      {/* 4:5 Aspect Ratio Image Container */}
      <div className="relative w-full aspect-[4/5] bg-[#EBEBE9] overflow-hidden">
        <Link to={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={imageSrc}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            onError={(e) => {
              e.target.src = DEFAULT_PRODUCT_IMAGE;
            }}
          />
        </Link>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <DiscountBadge discount={discount} />
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 z-10 p-1.5 bg-[#FFFFFF] border border-[#E2E2E0] hover:border-[#111111] transition-colors rounded ${
            isWishlisted ? 'text-[#F97316]' : 'text-[#111111]'
          }`}
          aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className="w-4 h-4" fill={isWishlisted ? '#F97316' : 'none'} />
        </button>
      </div>

      {/* Product Information */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Fabric / Category line */}
          <p className="text-[11px] font-semibold text-[#6B6B6B] uppercase tracking-wider truncate mb-1">
            {product.fabric || product.category_name}
          </p>

          {/* Product Title */}
          <Link to={`/products/${product.slug}`}>
            <h3 className="font-heading text-sm text-[#111111] hover:text-[#F97316] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price and Rating Row */}
        <div className="pt-2 mt-2 border-t border-[#E2E2E0] flex items-center justify-between">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-heading text-sm font-extrabold text-[#111111]">
              {formatPrice(product.price)}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-[#6B6B6B] line-through">
                {formatPrice(product.mrp)}
              </span>
            )}
          </div>

          {/* Rating Pill */}
          {product.rating && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#111111] bg-[#F5F4F2] px-1.5 py-0.5 border border-[#E2E2E0]">
              <Star className="w-3 h-3 text-[#F97316] fill-[#F97316]" />
              <span>{Number(product.rating).toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
