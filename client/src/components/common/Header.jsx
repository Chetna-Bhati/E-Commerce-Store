import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E2E2E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-baseline shrink-0">
            <span className="font-heading font-extrabold text-2xl tracking-tight text-[#111111]">
              threadline<span className="text-[#F97316]">.</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#111111]">
            <Link
              to="/products"
              className={`hover:text-[#F97316] transition-colors ${
                location.pathname === '/products' && !location.search ? 'text-[#F97316]' : ''
              }`}
            >
              All Products
            </Link>
            <Link
              to="/products?category=t-shirts"
              className="hover:text-[#F97316] transition-colors"
            >
              T-shirts
            </Link>
            <Link
              to="/products?category=shirts"
              className="hover:text-[#F97316] transition-colors"
            >
              Shirts
            </Link>
            <Link
              to="/products?category=jeans"
              className="hover:text-[#F97316] transition-colors"
            >
              Jeans
            </Link>
            <Link
              to="/products?category=trousers"
              className="hover:text-[#F97316] transition-colors"
            >
              Trousers
            </Link>
            <Link
              to="/products?category=jackets-and-hoodies"
              className="hover:text-[#F97316] transition-colors"
            >
              Jackets
            </Link>
            <Link
              to="/products?category=dresses-and-kurtas"
              className="hover:text-[#F97316] transition-colors"
            >
              Dresses & Kurtas
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Search fabric, styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F5F4F2] border border-[#E2E2E0] focus:border-[#111111] focus:outline-none placeholder-[#6B6B6B]"
            />
            <Search className="w-4 h-4 text-[#6B6B6B] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2 text-[#111111] hover:text-[#F97316] transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#F97316] text-[#111111] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="relative p-2 text-[#111111] hover:text-[#F97316] transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#111111] text-[#FFFFFF] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Account / Auth Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-1.5 p-1.5 border border-[#E2E2E0] rounded hover:border-[#111111] transition-colors text-xs font-medium"
                  >
                    <User className="w-4 h-4 text-[#111111]" />
                    <span className="hidden sm:inline max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                  </button>

                  {isMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-[#FFFFFF] border border-[#E2E2E0] rounded shadow-md py-1 z-50 animate-fade-in"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="px-3 py-2 border-b border-[#E2E2E0]">
                        <p className="text-xs font-bold text-[#111111] truncate">{user.name}</p>
                        <p className="text-[11px] text-[#6B6B6B] truncate">{user.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#111111] hover:bg-[#F5F4F2]"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-[#F97316]" />
                          Admin Panel
                        </Link>
                      )}

                      <Link
                        to="/orders"
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#111111] hover:bg-[#F5F4F2]"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        My Orders
                      </Link>

                      <button
                        onClick={logout}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-[#F5F4F2] border-t border-[#E2E2E0]"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-xs font-semibold px-3 py-1.5 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
