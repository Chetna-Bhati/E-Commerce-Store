import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result?.success) {
      if (result.user.role === 'ADMIN' && !redirect.startsWith('/checkout')) {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    }
  };

  const handleQuickFill = (type) => {
    if (type === 'admin') {
      setEmail('admin@threadline.com');
      setPassword('password123');
    } else {
      setEmail('user@threadline.com');
      setPassword('password123');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-1">
        <h1 className="font-heading text-2xl sm:text-3xl text-[#111111]">Sign In to Threadline</h1>
        <p className="text-xs text-[#6B6B6B]">Access your saved cart, orders, and wishlist.</p>
      </div>

      <div className="bg-[#FFFFFF] border border-[#E2E2E0] p-6 rounded space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-[#111111]">Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. user@threadline.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[#F5F4F2] border border-[#E2E2E0] focus:border-[#111111] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#111111]">Password</label>
            <input
              type="password"
              required
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-[#F97316]" /> : 'Sign In'}
          </button>
        </form>

        {/* Demo Seed Credentials Quick-fill */}
        <div className="pt-4 border-t border-[#E2E2E0] space-y-2">
          <p className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider text-center">
            Quick Fill Demo Credentials
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="px-2 py-1.5 bg-[#F5F4F2] border border-[#E2E2E0] hover:border-[#111111] text-[11px] font-medium text-[#111111] transition-colors rounded text-center"
            >
              Fill Admin Account
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('user')}
              className="px-2 py-1.5 bg-[#F5F4F2] border border-[#E2E2E0] hover:border-[#111111] text-[11px] font-medium text-[#111111] transition-colors rounded text-center"
            >
              Fill Test Customer
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-[#6B6B6B]">
        Don't have an account yet?{' '}
        <Link to={`/register${redirect !== '/' ? `?redirect=${redirect}` : ''}`} className="font-bold text-[#111111] hover:text-[#F97316] underline">
          Create Account
        </Link>
      </p>
    </div>
  );
}
