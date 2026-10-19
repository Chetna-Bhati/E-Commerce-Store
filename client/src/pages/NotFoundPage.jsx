import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
      <p className="font-heading text-6xl font-black text-[#111111]">404</p>
      <h1 className="font-heading text-xl text-[#111111]">Page Not Found</h1>
      <p className="text-xs text-[#6B6B6B]">
        The page you are looking for might have been moved or does not exist.
      </p>
      <div className="pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111111] text-white font-heading font-bold text-xs uppercase tracking-wider rounded"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
