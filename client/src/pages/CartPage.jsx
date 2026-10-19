import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItemRow from '../components/cart/CartItemRow';
import OrderSummary from '../components/cart/OrderSummary';

export default function CartPage() {
  const {
    items,
    itemCount,
    summary,
    loading,
    appliedCoupon,
    setAppliedCoupon,
    updateQuantity,
    removeItem
  } = useCart();

  const navigate = useNavigate();

  if (items.length === 0 && !loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 bg-[#FFFFFF] border border-[#E2E2E0] rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8 text-[#6B6B6B]" />
        </div>
        <div className="space-y-1">
          <h1 className="font-heading text-2xl text-[#111111]">Your Cart is Empty</h1>
          <p className="text-xs text-[#6B6B6B]">Add heavyweight tees, linen shirts, or denim staples to start your order.</p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#111111] text-[#FFFFFF] font-heading font-bold text-xs uppercase tracking-wider hover:bg-[#2B2B2B] transition-colors rounded"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-[#E2E2E0] pb-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl text-[#111111] tracking-tight">Shopping Bag</h1>
          <p className="text-xs text-[#6B6B6B] mt-0.5">{itemCount} items in your order</p>
        </div>
        <Link to="/products" className="text-xs font-bold text-[#111111] hover:text-[#F97316] flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="divide-y divide-[#E2E2E0]">
            {items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-5">
          <OrderSummary
            summary={summary}
            appliedCoupon={appliedCoupon}
            onApplyCoupon={setAppliedCoupon}
            onRemoveCoupon={() => setAppliedCoupon(null)}
            actionButton={
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 px-6 bg-[#111111] text-[#FFFFFF] font-heading font-extrabold text-xs uppercase tracking-wider hover:bg-[#2B2B2B] transition-colors flex items-center justify-center gap-2 rounded"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
}
