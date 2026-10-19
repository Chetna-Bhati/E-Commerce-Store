import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, RefreshCw, Truck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-[#F5F4F2] pt-14 pb-20 md:pb-12 border-t border-[#2B2B2B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#2B2B2B]">
          {/* Brand Column */}
          <div className="space-y-4">
            <span className="font-heading font-extrabold text-2xl tracking-tight text-[#FFFFFF]">
              threadline<span className="text-[#F97316]">.</span>
            </span>
            <p className="text-xs text-[#A3A3A3] leading-relaxed max-w-xs">
              Everyday apparel built for the Indian climate. Heavyweight GSM cottons, natural linen blends, and honest prices without the luxury markup.
            </p>
            <div className="text-[11px] text-[#A3A3A3] pt-2">
              <p>Crafted for Indian sizing (S to XXL, Waist 30–38).</p>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-heading text-sm text-[#FFFFFF] uppercase tracking-wider mb-4">Shop Categories</h4>
            <ul className="space-y-2 text-xs text-[#A3A3A3]">
              <li><Link to="/products?category=t-shirts" className="hover:text-[#F97316] transition-colors">T-shirts & Polos</Link></li>
              <li><Link to="/products?category=shirts" className="hover:text-[#F97316] transition-colors">Linen & Oxford Shirts</Link></li>
              <li><Link to="/products?category=jeans" className="hover:text-[#F97316] transition-colors">Raw Indigo & Carpenter Jeans</Link></li>
              <li><Link to="/products?category=trousers" className="hover:text-[#F97316] transition-colors">Tailored Chinos & Cargos</Link></li>
              <li><Link to="/products?category=jackets-and-hoodies" className="hover:text-[#F97316] transition-colors">Jackets & 400 GSM Hoodies</Link></li>
              <li><Link to="/products?category=shoes" className="hover:text-[#F97316] transition-colors">Footwear & Sneakers</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-heading text-sm text-[#FFFFFF] uppercase tracking-wider mb-4">Customer Support</h4>
            <ul className="space-y-2 text-xs text-[#A3A3A3]">
              <li><Link to="/orders" className="hover:text-[#F97316] transition-colors">Track Your Order</Link></li>
              <li><span className="hover:text-white cursor-pointer">Shipping & Delivery Policies</span></li>
              <li><span className="hover:text-white cursor-pointer">7-Day Return Process</span></li>
              <li><span className="hover:text-white cursor-pointer">Size Guide & Fit Matrix</span></li>
              <li><span className="hover:text-white cursor-pointer">Contact Care: care@threadline.in</span></li>
            </ul>
          </div>

          {/* Standards Column */}
          <div>
            <h4 className="font-heading text-sm text-[#FFFFFF] uppercase tracking-wider mb-4">The Threadline Guarantee</h4>
            <div className="space-y-3 text-xs text-[#A3A3A3]">
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
                <span>Express courier across all 19,000+ Indian pincodes.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <RefreshCw className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
                <span>Doorstep return pickup with zero deduction guarantee.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
                <span>100% secure checkout powered by 256-bit encryption.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A3A3A3]">
          <p>© {new Date().getFullYear()} Threadline Retail Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Made in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
