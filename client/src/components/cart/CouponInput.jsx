import React, { useState } from 'react';
import { Tag, Check, X, Loader2 } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/formatters';

export default function CouponInput({ subtotal = 0, appliedCoupon, onApplyCoupon, onRemoveCoupon }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleApply = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    try {
      setLoading(true);
      const res = await api.post('/coupons/validate', {
        code: code.trim(),
        subtotal
      });

      if (res.data.success) {
        onApplyCoupon(res.data.data);
        addToast(res.data.message, 'success');
        setCode('');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid coupon code';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-900 font-medium">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-emerald-700" />
          <span>
            Code <strong>{appliedCoupon.code}</strong> applied ({formatPrice(appliedCoupon.discountAmount)} saved)
          </span>
        </div>
        <button
          onClick={onRemoveCoupon}
          className="p-1 text-emerald-700 hover:text-emerald-900 transition-colors"
          aria-label="Remove coupon"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleApply} className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Coupon code (e.g. FIRST100)"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="w-full pl-8 pr-3 py-2 text-xs bg-[#F5F4F2] border border-[#E2E2E0] focus:border-[#111111] focus:outline-none uppercase font-semibold"
          />
          <Tag className="w-3.5 h-3.5 text-[#6B6B6B] absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="px-4 py-2 bg-[#111111] text-[#FFFFFF] text-xs font-bold hover:bg-[#2B2B2B] disabled:opacity-50 transition-colors shrink-0"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
        </button>
      </div>
      <p className="text-[11px] text-[#6B6B6B]">
        Try <strong>FIRST100</strong> (₹100 off on ₹500+) or <strong>THREAD15</strong> (15% off).
      </p>
    </form>
  );
}
