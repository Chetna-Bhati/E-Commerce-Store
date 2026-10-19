import React from 'react';
import { Truck, RotateCcw, Banknote } from 'lucide-react';

export default function InfoStrip() {
  return (
    <section className="bg-[#FFFFFF] border-y border-[#E2E2E0] py-8 my-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Feature 1 */}
          <div className="flex items-start gap-3.5 p-3">
            <div className="p-2.5 bg-[#F5F4F2] border border-[#E2E2E0] text-[#111111] shrink-0">
              <Truck className="w-5 h-5 text-[#F97316]" />
            </div>
            <div>
              <h4 className="font-heading text-sm text-[#111111] uppercase tracking-wide">Free Delivery Over ₹999</h4>
              <p className="text-xs text-[#6B6B6B] mt-0.5">Reliable dispatch within 24 hours across India.</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start gap-3.5 p-3">
            <div className="p-2.5 bg-[#F5F4F2] border border-[#E2E2E0] text-[#111111] shrink-0">
              <RotateCcw className="w-5 h-5 text-[#F97316]" />
            </div>
            <div>
              <h4 className="font-heading text-sm text-[#111111] uppercase tracking-wide">7-Day Hassle-Free Returns</h4>
              <p className="text-xs text-[#6B6B6B] mt-0.5">Instant doorstep pickup with full exchange or refund.</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start gap-3.5 p-3">
            <div className="p-2.5 bg-[#F5F4F2] border border-[#E2E2E0] text-[#111111] shrink-0">
              <Banknote className="w-5 h-5 text-[#F97316]" />
            </div>
            <div>
              <h4 className="font-heading text-sm text-[#111111] uppercase tracking-wide">Cash on Delivery Available</h4>
              <p className="text-xs text-[#6B6B6B] mt-0.5">Pay at your doorstep with Cash or UPI.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
