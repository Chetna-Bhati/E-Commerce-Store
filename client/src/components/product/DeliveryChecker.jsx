import React, { useState } from 'react';
import { Truck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import api from '../../api/client';

export default function DeliveryChecker() {
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setError('Enter a valid 6-digit Indian PIN code');
      setResult(null);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/delivery/${pincode}`);
      if (res.data.success) {
        setResult(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'PIN code unserviceable.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-[#E2E2E0] bg-[#FFFFFF] p-4 rounded space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111111]">
        <Truck className="w-4 h-4 text-[#F97316]" />
        <span>Delivery & Serviceability Check</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit PIN code"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
          className="flex-1 px-3 py-2 text-xs bg-[#F5F4F2] border border-[#E2E2E0] focus:border-[#111111] focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || pincode.length !== 6}
          className="px-4 py-2 bg-[#111111] text-[#FFFFFF] text-xs font-bold hover:bg-[#2B2B2B] disabled:opacity-50 transition-colors shrink-0"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Check'}
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium pt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="pt-2 border-t border-[#E2E2E0] space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Serviceable: Expected delivery in {result.estimatedDays}</span>
          </div>
          <p className="text-[#6B6B6B]">Estimated Date: <strong className="text-[#111111]">{result.estimatedDate}</strong></p>
          <p className="text-[#6B6B6B]">Cash on Delivery: <strong className="text-[#111111]">Available</strong></p>
        </div>
      )}
    </div>
  );
}
