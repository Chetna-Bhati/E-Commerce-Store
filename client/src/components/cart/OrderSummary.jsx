import React from 'react';
import { formatPrice } from '../../utils/formatters';
import CouponInput from './CouponInput';
import { Truck, ShieldCheck } from 'lucide-react';

export default function OrderSummary({
  summary,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  actionButton,
  showCouponInput = true
}) {
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const effectiveSubtotal = Math.max(0, summary.subtotal - discountAmount);
  const finalTotal = effectiveSubtotal + summary.shipping;

  return (
    <div className="bg-[#FFFFFF] border border-[#E2E2E0] p-5 rounded space-y-5">
      <h3 className="font-heading text-base text-[#111111] uppercase tracking-wide border-b border-[#E2E2E0] pb-3">
        Order Summary
      </h3>

      {/* Breakdown Rows */}
      <div className="space-y-2.5 text-xs">
        <div className="flex justify-between text-[#6B6B6B]">
          <span>Total MRP</span>
          <span className="font-medium text-[#111111]">{formatPrice(summary.mrpTotal)}</span>
        </div>

        {summary.discountOnMrp > 0 && (
          <div className="flex justify-between text-emerald-700 font-medium">
            <span>Discount on MRP</span>
            <span>-{formatPrice(summary.discountOnMrp)}</span>
          </div>
        )}

        <div className="flex justify-between text-[#6B6B6B]">
          <span>Subtotal</span>
          <span className="font-medium text-[#111111]">{formatPrice(summary.subtotal)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-700 font-medium">
            <span>Coupon Discount ({appliedCoupon.code})</span>
            <span>-{formatPrice(discountAmount)}</span>
          </div>
        )}

        <div className="flex justify-between text-[#6B6B6B] items-center">
          <span className="flex items-center gap-1">
            Shipping Fee
            {summary.shipping === 0 && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-bold uppercase">Free</span>
            )}
          </span>
          <span className="font-medium text-[#111111]">
            {summary.shipping === 0 ? 'FREE' : formatPrice(summary.shipping)}
          </span>
        </div>

        {summary.amountNeededForFreeShipping > 0 && (
          <div className="p-2.5 bg-[#F5F4F2] border border-[#E2E2E0] rounded text-[11px] text-[#111111] flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#F97316] shrink-0" />
            <span>Add <strong>{formatPrice(summary.amountNeededForFreeShipping)}</strong> more for free standard delivery.</span>
          </div>
        )}
      </div>

      {/* Optional Coupon Component */}
      {showCouponInput && (
        <div className="pt-3 border-t border-[#E2E2E0]">
          <CouponInput
            subtotal={summary.subtotal}
            appliedCoupon={appliedCoupon}
            onApplyCoupon={onApplyCoupon}
            onRemoveCoupon={onRemoveCoupon}
          />
        </div>
      )}

      {/* Final Total */}
      <div className="pt-3 border-t border-[#E2E2E0] flex justify-between items-baseline">
        <div>
          <span className="font-heading text-base font-extrabold text-[#111111]">Total Amount</span>
          <p className="text-[10px] text-[#6B6B6B]">Includes all applicable taxes & shipping</p>
        </div>
        <span className="font-heading text-lg font-black text-[#111111]">
          {formatPrice(finalTotal)}
        </span>
      </div>

      {/* Action Button */}
      {actionButton && (
        <div className="pt-2">
          {actionButton}
        </div>
      )}

      <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#6B6B6B] border-t border-[#E2E2E0]">
        <ShieldCheck className="w-3.5 h-3.5 text-[#F97316]" />
        <span>Threadline 7-Day Guarantee & Secure Checkout</span>
      </div>
    </div>
  );
}
