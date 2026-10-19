import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, ExternalLink, Loader2 } from 'lucide-react';
import api from '../../api/client';
import { StatusBadge } from '../../components/common/Badge';
import { formatPrice, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);

  const { addToast } = useToast();

  const loadOrders = async () => {
    try {
      setLoading(true);
      const url = statusFilter !== 'ALL' ? `/admin/orders?status=${statusFilter}` : '/admin/orders';
      const res = await api.get(url);
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        addToast(res.data.message || `Order marked as ${newStatus}`, 'success');
        loadOrders();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Status update failed', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E2E0] pb-3">
        <div>
          <h1 className="font-heading text-2xl text-[#111111] tracking-tight">Customer Orders</h1>
          <p className="text-xs text-[#6B6B6B]">Track fulfillment, manage express dispatches, and update statuses</p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#6B6B6B]">Filter by:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#FFFFFF] border border-[#E2E2E0] text-xs font-medium text-[#111111]"
          >
            <option value="ALL">All Statuses</option>
            <option value="PLACED">Placed</option>
            <option value="PACKED">Packed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#FFFFFF] border border-[#E2E2E0] rounded overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F5F4F2] border-b border-[#E2E2E0] font-heading uppercase text-[#111111] text-[11px]">
            <tr>
              <th className="p-3">Order Number</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total Amount</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Date</th>
              <th className="p-3">Current Status</th>
              <th className="p-3 text-right">Update Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E2E0]">
            {loading ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-[#6B6B6B] animate-pulse">Loading orders...</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-[#6B6B6B]">No orders found for this status</td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="hover:bg-[#F5F4F2]/50 transition-colors">
                  <td className="p-3">
                    <Link
                      to={`/orders/${o.order_number}`}
                      className="font-heading font-extrabold text-[#111111] hover:text-[#F97316] flex items-center gap-1"
                    >
                      <span>{o.order_number}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                    <span className="text-[11px] text-[#6B6B6B]">{o.item_count} items</span>
                  </td>
                  <td className="p-3">
                    <p className="font-bold text-[#111111]">{o.customer_name}</p>
                    <p className="text-[11px] text-[#6B6B6B]">{o.customer_email}</p>
                  </td>
                  <td className="p-3 font-heading font-extrabold text-[#111111]">
                    {formatPrice(o.total)}
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-[#111111] block">{o.payment_method}</span>
                    <span className={`text-[10px] uppercase font-semibold ${
                      o.payment_status === 'PAID' ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {o.payment_status}
                    </span>
                  </td>
                  <td className="p-3 text-[#6B6B6B]">{formatDate(o.created_at)}</td>
                  <td className="p-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="p-3 text-right">
                    <select
                      value={o.status}
                      disabled={updatingId === o.id}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className="px-2 py-1 bg-[#F5F4F2] border border-[#E2E2E0] text-xs font-bold text-[#111111] focus:outline-none"
                    >
                      <option value="PLACED">Placed</option>
                      <option value="PACKED">Packed</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
