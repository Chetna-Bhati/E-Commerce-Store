import React from 'react';
import { CreditCard, Banknote, ShieldCheck } from 'lucide-react';

export default function PaymentSelector({ selectedMethod, onSelectMethod }) {
  return (
    <div className="bg-[#FFFFFF] border border-[#E2E2E0] p-5 rounded space-y-4">
      <h3 className="font-heading text-sm text-[#111111] uppercase tracking-wide border-b border-[#E2E2E0] pb-2.5">
        2. Payment Method
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Razorpay Online */}
        <label
          className={`flex items-start gap-3 p-4 border rounded cursor-pointer transition-all ${
            selectedMethod === 'ONLINE'
              ? 'border-[#111111] bg-[#F5F4F2] ring-1 ring-[#111111]'
              : 'border-[#E2E2E0] hover:border-[#6B6B6B]'
          }`}
        >
          <input
            type="radio"
            name="payment_method"
            value="ONLINE"
            checked={selectedMethod === 'ONLINE'}
            onChange={() => onSelectMethod('ONLINE')}
            className="mt-0.5 accent-[#111111]"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#111111]">
              <CreditCard className="w-4 h-4 text-[#F97316]" />
              <span>Razorpay Online</span>
            </div>
            <p className="text-[11px] text-[#6B6B6B]">
              Pay instantly using UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, or Netbanking.
            </p>
          </div>
        </label>

        {/* Cash On Delivery */}
        <label
          className={`flex items-start gap-3 p-4 border rounded cursor-pointer transition-all ${
            selectedMethod === 'COD'
              ? 'border-[#111111] bg-[#F5F4F2] ring-1 ring-[#111111]'
              : 'border-[#E2E2E0] hover:border-[#6B6B6B]'
          }`}
        >
          <input
            type="radio"
            name="payment_method"
            value="COD"
            checked={selectedMethod === 'COD'}
            onChange={() => onSelectMethod('COD')}
            className="mt-0.5 accent-[#111111]"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#111111]">
              <Banknote className="w-4 h-4 text-[#F97316]" />
              <span>Cash on Delivery</span>
            </div>
            <p className="text-[11px] text-[#6B6B6B]">
              Pay in cash or via QR scan at your doorstep upon package arrival.
            </p>
          </div>
        </label>
      </div>

      <div className="p-3 bg-[#F5F4F2] border border-[#E2E2E0] text-[11px] text-[#6B6B6B] flex items-center gap-2 rounded">
        <ShieldCheck className="w-4 h-4 text-[#F97316] shrink-0" />
        <span>Transactions are secured with 256-bit encryption. Razorpay Test Mode active.</span>
      </div>
    </div>
  );
}
