import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(name, email, password, phone);
    setLoading(false);
    if (result?.success) {
      navigate(redirect);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-1">
        <h1 className="font-heading text-2xl sm:text-3xl text-[#111111]">Create an Account</h1>
        <p className="text-xs text-[#6B6B6B]">Join Threadline for faster checkouts and order history.</p>
      </div>

      <div className="bg-[#FFFFFF] border border-[#E2E2E0] p-6 rounded space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-[#111111]">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Priya Nair"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[#F5F4F2] border border-[#E2E2E0] focus:border-[#111111] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#111111]">Email Address *</label>
            <input
              type="email"
              required
              placeholder="e.g. priya@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[#F5F4F2] border border-[#E2E2E0] focus:border-[#111111] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#111111]">10-Digit Mobile Number (Optional)</label>
            <input
              type="tel"
              maxLength={10}
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              className="w-full px-3 py-2 bg-[#F5F4F2] border border-[#E2E2E0] focus:border-[#111111] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#111111]">Password (min. 6 characters) *</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[#F5F4F2] border border-[#E2E2E0] focus:border-[#111111] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#111111] text-[#FFFFFF] font-heading font-extrabold text-xs uppercase tracking-wider hover:bg-[#2B2B2B] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 rounded"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-[#F97316]" /> : 'Create Account'}
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-[#6B6B6B]">
        Already have an account?{' '}
        <Link to={`/login${redirect !== '/' ? `?redirect=${redirect}` : ''}`} className="font-bold text-[#111111] hover:text-[#F97316] underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
