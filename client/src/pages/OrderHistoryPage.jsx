import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, ExternalLink } from 'lucide-react';
import api from '../api/client';
import { StatusBadge } from '../components/common/Badge';
import { formatPrice, formatDate } from '../utils/formatters';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const res = await api.get('/orders');
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load user orders:', err);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-[#E2E2E0] pb-4">
        <h1 className="font-heading text-2xl sm:text-3xl text-[#111111] tracking-tight">Order History</h1>
        <p className="text-xs text-[#6B6B6B] mt-0.5">Track and view invoices for all your past purchases</p>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <p className="font-heading text-base text-[#111111] animate-pulse">Loading your order history...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-[#FFFFFF] border border-[#E2E2E0] p-12 text-center space-y-4 rounded">
          <Package className="w-10 h-10 text-[#6B6B6B] mx-auto" />
          <div>
            <h3 className="font-heading text-lg text-[#111111]">No Orders Yet</h3>
            <p className="text-xs text-[#6B6B6B] mt-1">You have not placed any orders with Threadline yet.</p>
          </div>
          <Link to="/products" className="inline-block px-5 py-2.5 bg-[#111111] text-white text-xs font-bold rounded">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-[#FFFFFF] border border-[#E2E2E0] hover:border-[#111111] transition-all p-5 rounded space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E2E0] pb-3 text-xs">
                <div>
                  <span className="font-heading text-xs font-bold text-[#111111]">
                    {order.order_number}
                  </span>
                  <span className="text-[#6B6B6B] ml-2">Placed on {formatDate(order.created_at)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  <Link
                    to={`/orders/${order.order_number}`}
                    className="font-bold text-[#111111] hover:text-[#F97316] flex items-center gap-1"
                  >
                    <span>View Tracking & Receipt</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs text-[#6B6B6B]">
                <p>
                  Items: <strong className="text-[#111111]">{order.item_count} items</strong> • Payment: <strong className="text-[#111111]">{order.payment_method} ({order.payment_status})</strong>
                </p>
                <p className="font-heading text-sm font-extrabold text-[#111111]">
                  Total: {formatPrice(order.total)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
