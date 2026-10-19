import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag, ShieldCheck, RefreshCw, ChevronRight, Check } from 'lucide-react';
import api from '../api/client';
import ImageGallery from '../components/product/ImageGallery';
import SizeSelector from '../components/product/SizeSelector';
import ColorSelector from '../components/product/ColorSelector';
import DeliveryChecker from '../components/product/DeliveryChecker';
import { DiscountBadge } from '../components/common/Badge';
import { formatPrice } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const res = await api.get(`/products/${slug}`);
        if (res.data.success) {
          const prod = res.data.data;
          setProduct(prod);
          // Set initial color
          if (prod.colors && prod.colors.length > 0) {
            setSelectedColor(prod.colors[0].name);
          }
          // Set initial available size
          if (prod.sizes && prod.sizes.length > 0) {
            const firstInStock = prod.sizes.find((s) => s.stock > 0);
            if (firstInStock) {
              setSelectedSize(firstInStock.size);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="font-heading text-lg text-[#111111] animate-pulse">Loading garment details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="font-heading text-xl text-[#111111]">Product Not Found</p>
        <Link to="/products" className="inline-block px-4 py-2 bg-[#111111] text-white text-xs font-bold">
          Browse Catalog
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      addToast('Please select an available size', 'error');
      return;
    }
    setIsAdding(true);
    await addToCart(product.id, selectedSize, selectedColor || 'Standard', 1);
    setIsAdding(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-[#6B6B6B]">
        <Link to="/" className="hover:text-[#111111]">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/products" className="hover:text-[#111111]">Apparel</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`/products?category=${product.category_slug}`} className="hover:text-[#111111]">
          {product.category_name}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#111111] font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Grid: Gallery on Left, Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7">
          <ImageGallery images={product.images} alt={product.name} />
        </div>

        {/* Right Column: Product Specs and Purchase */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2 border-b border-[#E2E2E0] pb-5">
            {/* Category / Fabric line */}
            <p className="text-xs font-bold text-[#F97316] uppercase tracking-wider">
              {product.fabric}
            </p>

            {/* Product Title */}
            <h1 className="font-heading text-2xl sm:text-3xl text-[#111111] tracking-tight">
              {product.name}
            </h1>

            {/* Rating pill */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center gap-1 bg-[#111111] text-[#FFFFFF] px-2 py-0.5 text-xs font-bold">
                <Star className="w-3 h-3 text-[#F97316] fill-[#F97316]" />
                <span>{Number(product.rating).toFixed(1)}</span>
              </div>
              <span className="text-xs text-[#6B6B6B]">
                ({product.review_count} verified Indian customer reviews)
              </span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="font-heading text-2xl font-black text-[#111111]">
                {formatPrice(product.price)}
              </span>
              {product.mrp > product.price && (
                <>
                  <span className="text-sm text-[#6B6B6B] line-through">
                    {formatPrice(product.mrp)}
                  </span>
                  <DiscountBadge discount={product.discountPercent} />
                </>
              )}
            </div>
            <p className="text-[11px] text-[#6B6B6B]">Inclusive of all taxes. Free shipping on orders above ₹999.</p>
          </div>

          {/* Description */}
          <div className="text-xs text-[#6B6B6B] leading-relaxed">
            <p>{product.description}</p>
          </div>

          {/* Color Selector */}
          <ColorSelector
            colors={product.colors}
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
          />

          {/* Size Selector */}
          <SizeSelector
            sizes={product.sizes}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            {/* Add to Cart: Black text on orange */}
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex-1 py-3.5 px-6 bg-[#F97316] text-[#111111] font-heading font-extrabold text-xs uppercase tracking-wider hover:bg-[#EA580C] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 rounded"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
            </button>

            {/* Outlined Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-3.5 border border-[#111111] hover:bg-[#F5F4F2] transition-colors rounded ${
                isWishlisted ? 'text-[#F97316]' : 'text-[#111111]'
              }`}
              aria-label="Toggle Wishlist"
            >
              <Heart className="w-4 h-4" fill={isWishlisted ? '#F97316' : 'none'} />
            </button>
          </div>

          {/* Pincode Delivery Check */}
          <DeliveryChecker />

          {/* Editorial Specs Accordion Strip */}
          <div className="border-t border-[#E2E2E0] pt-4 space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#111111]">Fabric Specs: </strong>
                <span className="text-[#6B6B6B]">{product.fabric}. Breathable & pre-shrunk.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <RefreshCw className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#111111]">7-Day Return Policy: </strong>
                <span className="text-[#6B6B6B]">Free doorstep pickup across India with full refund.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#111111]">Care Instructions: </strong>
                <span className="text-[#6B6B6B]">Machine wash cold inside out. Do not tumble dry.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
