import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function MobileNav() {
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();

  return (
    <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#111111] border-t border-[#2B2B2B] px-2 py-2">
      <div className="flex items-center justify-around">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#F97316]' : 'text-[#A3A3A3]'
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#F97316]' : 'text-[#A3A3A3]'
            }`
          }
        >
          <Search className="w-5 h-5" />
          <span>Shop</span>
        </NavLink>

        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `relative flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#F97316]' : 'text-[#A3A3A3]'
            }`
          }
        >
          <ShoppingBag className="w-5 h-5" />
          {itemCount > 0 && (
            <span className="absolute -top-1 right-2 bg-[#F97316] text-[#111111] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
          <span>Cart</span>
        </NavLink>

        <NavLink
          to="/wishlist"
          className={({ isActive }) =>
            `relative flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#F97316]' : 'text-[#A3A3A3]'
            }`
          }
        >
          <Heart className="w-5 h-5" />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 right-2 bg-[#F97316] text-[#111111] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
          <span>Wishlist</span>
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#F97316]' : 'text-[#A3A3A3]'
            }`
          }
        >
          <User className="w-5 h-5" />
          <span>Account</span>
        </NavLink>
      </div>
    </nav>
  );
}
