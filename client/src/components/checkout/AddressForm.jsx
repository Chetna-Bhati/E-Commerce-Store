import React from 'react';

export default function AddressForm({ address, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...address, [name]: value });
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E2E2E0] p-5 rounded space-y-4">
      <h3 className="font-heading text-sm text-[#111111] uppercase tracking-wide border-b border-[#E2E2E0] pb-2.5">
        1. Shipping Address
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="font-bold text-[#111111]">Full Name *</label>
          <input
            type="text"
            name="name"
            required
            placeholder="e.g. Aarav Sharma"
            value={address.name || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-[#F5F4F2] border border-[#E2E2E0] focus:border-[#111111] focus:outline-none"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="font-bold text-[#111111]">10-Digit Mobile Number *</label>
          <input
            type="tel"
            name="phone"
            required
            maxLength={10}
            placeholder="e.g. 9812345678"
            value={address.phone || ''}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              onChange({ ...address, phone: val });
            }}
            className="w-full px-3 py-2 bg-[#F5F4F2] border border-[#E2E2E0] focus:border-[#111111] focus:outline-none"
          />
        </div>

        {/* Street Address */}
        <div className="sm:col-span-2 space-y-1">
          <label className="font-bold text-[#111111]">Flat / House No. / Building / Street *</label>
          <textarea
            name="street_address"
            required
            rows={2}
            placeholder="e.g. Flat 402, Green Glen Heights, Bellandur Outer Ring Road"
            value={address.street_address || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-[#F5F4F2] border border-[#E2E2E0] focus:border-[#111111] focus:outline-none"
          />
        </div>

        {/* Landmark */}
        <div className="sm:col-span-2 space-y-1">
          <label className="font-bold text-[#111111]">Landmark (Optional)</label>
          <input
            type="text"
            name="landmark"
            placeholder="e.g. Near EcoSpace Tech Park"
            value={address.landmark || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-[#F5F4F2] border border-[#E2E2E0] focus:border-[#111111] focus:outline-none"
          />
        </div>

        {/* City */}
        <div className="space-y-1">
          <label className="font-bold text-[#111111]">City *</label>
          <input
            type="text"
            name="city"
            required
            placeholder="e.g. Bengaluru"
            value={address.city || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-[#F5F4F2] border border-[#E2E2E0] focus:border-[#111111] focus:outline-none"
          />
        </div>

        {/* State */}
        <div className="space-y-1">
          <label className="font-bold text-[#111111]">State *</label>
          <input
            type="text"
            name="state"
            required
            placeholder="e.g. Karnataka"
            value={address.state || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-[#F5F4F2] border border-[#E2E2E0] focus:border-[#111111] focus:outline-none"
          />
        </div>

        {/* Pincode */}
        <div className="space-y-1">
          <label className="font-bold text-[#111111]">6-Digit PIN Code *</label>
          <input
            type="text"
            name="pincode"
            required
            maxLength={6}
            placeholder="e.g. 560103"
            value={address.pincode || ''}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              onChange({ ...address, pincode: val });
            }}
            className="w-full px-3 py-2 bg-[#F5F4F2] border border-[#E2E2E0] focus:border-[#111111] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
