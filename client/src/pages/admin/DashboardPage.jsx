import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, ShoppingBag, Package, Users, AlertTriangle, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import api from '../../api/client';
import { formatPrice } from '../../utils/formatters';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const res = await api.get('/admin/stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <p className="font-heading text-base text-[#111111] animate-pulse">Loading analytics dashboard...</p>
      </div>
    );
  }

  const { kpis, lowStockProducts, weeklySales } = stats || {};

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E2E2E0] pb-3">
        <h1 className="font-heading text-2xl text-[#111111] tracking-tight">Admin Overview</h1>
        <p className="text-xs text-[#6B6B6B]">Store performance, live sales, and inventory alerts</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-[#FFFFFF] border border-[#E2E2E0] p-4 rounded space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">Gross Sales</span>
            <IndianRupee className="w-4 h-4 text-[#F97316]" />
          </div>
          <p className="font-heading text-2xl font-black text-[#111111]">
            {formatPrice(kpis?.totalRevenue || 0)}
          </p>
          <p className="text-[10px] text-emerald-700 font-bold">All settled orders</p>
        </div>

        {/* Total Orders */}
        <div className="bg-[#FFFFFF] border border-[#E2E2E0] p-4 rounded space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#F97316]" />
          </div>
          <p className="font-heading text-2xl font-black text-[#111111]">
            {kpis?.totalOrders || 0}
          </p>
          <p className="text-[10px] text-[#6B6B6B]">Lifetime transactions</p>
        </div>

        {/* Total Active Products */}
        <div className="bg-[#FFFFFF] border border-[#E2E2E0] p-4 rounded space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">Catalog</span>
            <Package className="w-4 h-4 text-[#F97316]" />
          </div>
          <p className="font-heading text-2xl font-black text-[#111111]">
            {kpis?.totalProducts || 0}
          </p>
          <p className="text-[10px] text-[#6B6B6B]">Active garments</p>
        </div>

        {/* Registered Users */}
        <div className="bg-[#FFFFFF] border border-[#E2E2E0] p-4 rounded space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">Customers</span>
            <Users className="w-4 h-4 text-[#F97316]" />
          </div>
          <p className="font-heading text-2xl font-black text-[#111111]">
            {kpis?.totalCustomers || 0}
          </p>
          <p className="text-[10px] text-[#6B6B6B]">Registered accounts</p>
        </div>
      </div>

      {/* 7-Day Sales Trend Chart with Recharts */}
      <div className="bg-[#FFFFFF] border border-[#E2E2E0] p-5 rounded space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-sm text-[#111111] uppercase tracking-wider">7-Day Revenue Trend (₹)</h3>
            <p className="text-xs text-[#6B6B6B]">Daily revenue from completed and placed orders</p>
          </div>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklySales || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E2E0" vertical={false} />
              <XAxis dataKey="day" stroke="#6B6B6B" fontSize={11} tickLine={false} />
              <YAxis stroke="#6B6B6B" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
              <Tooltip
                formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                contentStyle={{ backgroundColor: '#111111', color: '#FFFFFF', border: 'none', borderRadius: '4px', fontSize: '12px' }}
              />
              <Bar dataKey="sales" fill="#111111" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Low-Stock Inventory Alerts */}
      <div className="bg-[#FFFFFF] border border-[#E2E2E0] p-5 rounded space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2E2E0] pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#F97316]" />
            <h3 className="font-heading text-sm text-[#111111] uppercase tracking-wider">
              Low-Stock Alerts (Stock &lt; 10 units)
            </h3>
          </div>
          <Link to="/admin/products" className="text-xs font-bold text-[#111111] hover:text-[#F97316] flex items-center gap-1">
            <span>Manage All Stock</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {lowStockProducts && lowStockProducts.length === 0 ? (
          <p className="text-xs text-[#6B6B6B] py-2">All product inventory levels are healthy (&gt;= 10 units).</p>
        ) : (
          <div className="divide-y divide-[#E2E2E0] text-xs">
            {lowStockProducts?.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-[#111111]">{item.name}</p>
                  <p className="text-[11px] text-[#6B6B6B]">{item.category_name} • {formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-red-100 text-red-800 font-extrabold rounded text-[11px]">
                    {item.stock} left
                  </span>
                  <Link
                    to="/admin/products"
                    className="px-2.5 py-1 bg-[#111111] text-[#FFFFFF] font-bold rounded text-[11px] hover:bg-[#2B2B2B]"
                  >
                    Restock
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
