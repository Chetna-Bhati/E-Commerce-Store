import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Package, MapPin, CreditCard, ShoppingBag, Download } from 'lucide-react';
import api from '../api/client';
import OrderTimeline from '../components/order/OrderTimeline';
import { StatusBadge } from '../components/common/Badge';
import { formatPrice, formatDate } from '../utils/formatters';
import { getImageUrl, DEFAULT_PRODUCT_IMAGE } from '../utils/imageHelper';

export default function OrderSuccessPage() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        const res = await api.get(`/orders/${orderNumber}`);
        if (res.data.success) {
          setOrder(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load order details:', err);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-3">
        <p className="font-heading text-lg text-[#111111] animate-pulse">Generating your Threadline invoice...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-heading text-2xl text-[#111111]">Order Not Found</h2>
        <Link to="/orders" className="inline-block px-5 py-2.5 bg-[#111111] text-white text-xs font-bold">
          View My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Success Hero Header */}
      <div className="bg-[#FFFFFF] border border-[#E2E2E0] p-6 sm:p-8 rounded space-y-4 text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">Order Confirmed</span>
            <h1 className="font-heading text-2xl sm:text-3xl text-[#111111] tracking-tight">
              Thank You for Your Order
            </h1>
            <p className="text-xs text-[#6B6B6B] mt-1">
              Order ID: <strong className="text-[#111111]">{order.orderNumber}</strong> • Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* Visual Tracking Timeline */}
      <OrderTimeline status={order.status} timeline={order.timeline} />

      {/* Grid: Delivery Snapshot & Payment Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Address Card */}
        <div className="bg-[#FFFFFF] border border-[#E2E2E0] p-5 rounded space-y-2 text-xs">
          <div className="flex items-center gap-2 font-heading text-xs uppercase tracking-wider text-[#111111] border-b border-[#E2E2E0] pb-2">
            <MapPin className="w-4 h-4 text-[#F97316]" />
            <span>Delivery Address</span>
          </div>
          <p className="font-bold text-[#111111]">{order.address.name}</p>
          <p className="text-[#6B6B6B]">{order.address.street_address}</p>
          {order.address.landmark && <p className="text-[#6B6B6B]">Landmark: {order.address.landmark}</p>}
          <p className="text-[#6B6B6B]">{order.address.city}, {order.address.state} - <strong>{order.address.pincode}</strong></p>
          <p className="text-[#6B6B6B]">Mobile: {order.address.phone}</p>
        </div>

        {/* Payment Summary */}
        <div className="bg-[#FFFFFF] border border-[#E2E2E0] p-5 rounded space-y-2 text-xs">
          <div className="flex items-center gap-2 font-heading text-xs uppercase tracking-wider text-[#111111] border-b border-[#E2E2E0] pb-2">
            <CreditCard className="w-4 h-4 text-[#F97316]" />
            <span>Payment Breakdown</span>
          </div>
          <div className="space-y-1 text-[#6B6B6B]">
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <strong className="text-[#111111]">{order.paymentMethod === 'ONLINE' ? 'Razorpay Online (UPI/Card)' : 'Cash on Delivery'}</strong>
            </div>
            <div className="flex justify-between">
              <span>Payment Status:</span>
              <strong className={order.paymentStatus === 'PAID' ? 'text-emerald-700' : 'text-amber-700'}>
                {order.paymentStatus}
              </strong>
            </div>
            {order.couponCode && (
              <div className="flex justify-between text-emerald-700">
                <span>Coupon ({order.couponCode}):</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-[#E2E2E0] pt-2 font-heading text-sm font-extrabold text-[#111111]">
              <span>Total Paid:</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Items Table */}
      <div className="bg-[#FFFFFF] border border-[#E2E2E0] p-5 rounded space-y-4">
        <h3 className="font-heading text-xs uppercase tracking-wider text-[#111111] border-b border-[#E2E2E0] pb-2">
          Ordered Garments ({order.items.length})
        </h3>

        <div className="divide-y divide-[#E2E2E0]">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-3 text-xs">
              <div className="w-14 aspect-[4/5] bg-[#EBEBE9] border border-[#E2E2E0] overflow-hidden shrink-0">
                <img
                  src={getImageUrl(item.imageUrl)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = DEFAULT_PRODUCT_IMAGE; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading text-xs font-bold text-[#111111] truncate">{item.name}</p>
                <p className="text-[11px] text-[#6B6B6B]">Size: <strong>{item.size}</strong> • Color: <strong>{item.color}</strong> • Qty: <strong>{item.quantity}</strong></p>
              </div>
              <div className="text-right">
                <p className="font-heading font-extrabold text-[#111111]">{formatPrice(item.price * item.quantity)}</p>
                <p className="text-[10px] text-[#6B6B6B]">{item.quantity} × {formatPrice(item.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-4">
        <Link
          to="/orders"
          className="text-xs font-bold text-[#111111] hover:text-[#F97316] underline transition-colors"
        >
          View All Past Orders
        </Link>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#111111] text-[#FFFFFF] font-heading font-extrabold text-xs uppercase tracking-wider hover:bg-[#2B2B2B] transition-colors rounded"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
