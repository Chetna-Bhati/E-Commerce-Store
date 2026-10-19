import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, FolderTree, LogOut, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-[#F97316] mx-auto" />
        <h1 className="font-heading text-2xl text-[#111111]">Admin Access Required</h1>
        <p className="text-xs text-[#6B6B6B]">
          You must be logged in as an administrator (e.g. <code>admin@threadline.com</code>) to view this console.
        </p>
        <Link to="/login?redirect=/admin" className="inline-block px-5 py-2.5 bg-[#111111] text-white text-xs font-bold rounded">
          Sign In as Admin
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F4F2] flex flex-col">
      {/* Admin Top Header */}
      <header className="bg-[#111111] text-[#FFFFFF] border-b border-[#2B2B2B] px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-baseline">
            <span className="font-heading font-extrabold text-xl tracking-tight text-[#FFFFFF]">
              threadline<span className="text-[#F97316]">.</span>
            </span>
          </Link>
          <span className="px-2 py-0.5 bg-[#2B2B2B] text-[#F97316] text-[10px] font-bold uppercase tracking-wider rounded">
            Admin Console
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <Link to="/" className="text-[#A3A3A3] hover:text-white flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="text-red-400 hover:text-red-300 flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Admin Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar Nav */}
        <aside className="md:col-span-3 space-y-1">
          <div className="bg-[#FFFFFF] border border-[#E2E2E0] p-3 rounded space-y-1 text-xs">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded font-medium transition-colors ${
                  isActive ? 'bg-[#111111] text-white font-bold' : 'text-[#111111] hover:bg-[#F5F4F2]'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4 text-[#F97316]" />
              <span>Dashboard & KPIs</span>
            </NavLink>

            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded font-medium transition-colors ${
                  isActive ? 'bg-[#111111] text-white font-bold' : 'text-[#111111] hover:bg-[#F5F4F2]'
                }`
              }
            >
              <Package className="w-4 h-4 text-[#F97316]" />
              <span>Product Catalog</span>
            </NavLink>

            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded font-medium transition-colors ${
                  isActive ? 'bg-[#111111] text-white font-bold' : 'text-[#111111] hover:bg-[#F5F4F2]'
                }`
              }
            >
              <ShoppingBag className="w-4 h-4 text-[#F97316]" />
              <span>Customer Orders</span>
            </NavLink>

            <NavLink
              to="/admin/categories"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded font-medium transition-colors ${
                  isActive ? 'bg-[#111111] text-white font-bold' : 'text-[#111111] hover:bg-[#F5F4F2]'
                }`
              }
            >
              <FolderTree className="w-4 h-4 text-[#F97316]" />
              <span>Categories</span>
            </NavLink>
          </div>
        </aside>

        {/* Admin Main Content Outlet */}
        <main className="md:col-span-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
