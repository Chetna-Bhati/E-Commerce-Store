import React, { useState, useEffect } from 'react';
import { Plus, FolderTree, Loader2 } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSaving(true);
      const res = await api.post('/admin/categories', { name, description });
      if (res.data.success) {
        addToast('Category created successfully', 'success');
        setName('');
        setDescription('');
        loadCategories();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create category', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E2E2E0] pb-3">
        <h1 className="font-heading text-2xl text-[#111111] tracking-tight">Category Management</h1>
        <p className="text-xs text-[#6B6B6B]">Add and manage fashion categories across Threadline</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Creation Form */}
        <div className="bg-[#FFFFFF] border border-[#E2E2E0] p-5 rounded space-y-4">
          <h3 className="font-heading text-sm text-[#111111] uppercase tracking-wider">
            Add New Category
          </h3>
          <form onSubmit={handleCreate} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#111111]">Category Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Knitwear & Cardigans"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#F5F4F2] border border-[#E2E2E0] focus:border-[#111111] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-[#111111]">Description</label>
              <textarea
                rows={2}
                placeholder="Short editorial summary"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-[#F5F4F2] border border-[#E2E2E0] focus:border-[#111111] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="w-full py-2.5 bg-[#111111] text-[#FFFFFF] font-heading font-extrabold text-xs uppercase tracking-wider hover:bg-[#2B2B2B] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 rounded"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F97316]" /> : 'Create Category'}
            </button>
          </form>
        </div>

        {/* Existing Categories List */}
        <div className="lg:col-span-2 bg-[#FFFFFF] border border-[#E2E2E0] p-5 rounded space-y-4">
          <h3 className="font-heading text-sm text-[#111111] uppercase tracking-wider">
            Active Store Categories ({categories.length})
          </h3>
          <div className="divide-y divide-[#E2E2E0]">
            {loading ? (
              <p className="text-xs text-[#6B6B6B] py-4 text-center animate-pulse">Loading categories...</p>
            ) : categories.map((cat) => (
              <div key={cat.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                <div>
                  <p className="font-bold text-[#111111] text-sm">{cat.name}</p>
                  <p className="text-[#6B6B6B] mt-0.5">{cat.description || 'No description provided'}</p>
                  <span className="text-[11px] text-[#A3A3A3] font-mono">slug: {cat.slug}</span>
                </div>
                <span className="px-2.5 py-1 bg-[#F5F4F2] border border-[#E2E2E0] font-bold text-[#111111] rounded shrink-0">
                  {cat.product_count || 0} items
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
