import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Loader2, X, Upload } from 'lucide-react';
import api from '../../api/client';
import { formatPrice } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { getImageUrl, DEFAULT_PRODUCT_IMAGE } from '../../utils/imageHelper';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category_id: '1',
    description: '',
    fabric: '',
    price: '',
    mrp: '',
    stock: '',
    sizes: '[{"size":"S","stock":10},{"size":"M","stock":10},{"size":"L","stock":10},{"size":"XL","stock":5}]',
    colors: '[{"name":"Charcoal","hex":"#1C1C1C"}]'
  });
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  const { addToast } = useToast();

  const loadProducts = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/products?page=${page}&limit=15&q=${encodeURIComponent(search)}`);
      if (res.data.success) {
        setProducts(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to load admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadCats() {
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.data);
        if (res.data.data.length > 0) {
          setFormData((prev) => ({ ...prev, category_id: res.data.data[0].id.toString() }));
        }
      }
    }
    loadCats();
  }, []);

  useEffect(() => {
    loadProducts(1);
  }, [search]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category_id: categories[0]?.id?.toString() || '1',
      description: '',
      fabric: '',
      price: '',
      mrp: '',
      stock: '',
      sizes: '[{"size":"S","stock":10},{"size":"M","stock":10},{"size":"L","stock":10},{"size":"XL","stock":5}]',
      colors: '[{"name":"Charcoal","hex":"#1C1C1C"}]'
    });
    setFiles([]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category_id: p.category_id.toString(),
      description: p.description,
      fabric: p.fabric,
      price: p.price.toString(),
      mrp: p.mrp.toString(),
      stock: p.stock.toString(),
      sizes: typeof p.sizes === 'string' ? p.sizes : JSON.stringify(p.sizes),
      colors: typeof p.colors === 'string' ? p.colors : JSON.stringify(p.colors)
    });
    setFiles([]);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this product?')) return;
    try {
      const res = await api.delete(`/admin/products/${id}`);
      if (res.data.success) {
        addToast('Product deactivated', 'info');
        loadProducts(pagination.page);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingProduct) {
        // Update product
        const res = await api.put(`/admin/products/${editingProduct.id}`, {
          ...formData,
          price: parseFloat(formData.price),
          mrp: parseFloat(formData.mrp),
          stock: parseInt(formData.stock, 10),
          category_id: parseInt(formData.category_id, 10)
        });
        if (res.data.success) {
          addToast('Product updated successfully', 'success');
          setIsModalOpen(false);
          loadProducts(pagination.page);
        }
      } else {
        // Create product with Multer multipart
        const data = new FormData();
        data.append('name', formData.name);
        data.append('category_id', formData.category_id);
        data.append('description', formData.description);
        data.append('fabric', formData.fabric);
        data.append('price', formData.price);
        data.append('mrp', formData.mrp);
        data.append('stock', formData.stock);
        data.append('sizes', formData.sizes);
        data.append('colors', formData.colors);

        for (let i = 0; i < files.length; i++) {
          data.append('images', files[i]);
        }

        const res = await api.post('/admin/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data.success) {
          addToast('Product created successfully', 'success');
          setIsModalOpen(false);
          loadProducts(1);
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E2E0] pb-3">
        <div>
          <h1 className="font-heading text-2xl text-[#111111] tracking-tight">Products Management</h1>
          <p className="text-xs text-[#6B6B6B]">Add garments, manage pricing, and adjust stock quantities</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#111111] text-[#FFFFFF] text-xs font-bold hover:bg-[#2B2B2B] rounded"
        >
          <Plus className="w-4 h-4 text-[#F97316]" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="Filter products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FFFFFF] border border-[#E2E2E0] focus:border-[#111111] focus:outline-none"
        />
        <Search className="w-4 h-4 text-[#6B6B6B] absolute left-2.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* Products Table */}
      <div className="bg-[#FFFFFF] border border-[#E2E2E0] rounded overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F5F4F2] border-b border-[#E2E2E0] font-heading uppercase text-[#111111] text-[11px]">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price / MRP</th>
              <th className="p-3">Stock Units</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E2E0]">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-[#6B6B6B] animate-pulse">Loading catalog...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-[#6B6B6B]">No products found</td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-[#F5F4F2]/50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 aspect-[4/5] bg-[#EBEBE9] border border-[#E2E2E0] overflow-hidden shrink-0">
                        <img
                          src={getImageUrl(p.primary_image)}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = DEFAULT_PRODUCT_IMAGE; }}
                        />
                      </div>
                      <div>
                        <p className="font-bold text-[#111111]">{p.name}</p>
                        <p className="text-[11px] text-[#6B6B6B]">{p.fabric}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-[#111111] font-medium">{p.category_name}</td>
                  <td className="p-3">
                    <span className="font-bold text-[#111111]">{formatPrice(p.price)}</span>
                    <span className="text-[#6B6B6B] line-through ml-1.5">{formatPrice(p.mrp)}</span>
                  </td>
                  <td className="p-3">
                    <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      p.stock < 10 ? 'bg-red-100 text-red-800' : 'bg-neutral-100 text-neutral-800'
                    }`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 border ${
                      p.is_active ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                    }`}>
                      {p.is_active ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1 hover:text-[#F97316] transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1 hover:text-red-600 transition-colors"
                        title="Deactivate Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Product Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFFFF] border border-[#E2E2E0] w-full max-w-2xl rounded shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-[#E2E2E0] pb-3">
              <h3 className="font-heading text-base text-[#111111]">
                {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Garment to Catalog'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#6B6B6B] hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-[#111111]">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F4F2] border border-[#E2E2E0] focus:border-[#111111] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#111111]">Category *</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F4F2] border border-[#E2E2E0] focus:border-[#111111] focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#111111]">Fabric Specs *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 240 GSM 100% Combed Cotton"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F4F2] border border-[#E2E2E0] focus:border-[#111111] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#111111]">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F4F2] border border-[#E2E2E0] focus:border-[#111111] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#111111]">MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F4F2] border border-[#E2E2E0] focus:border-[#111111] focus:outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-[#111111]">Total Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F4F2] border border-[#E2E2E0] focus:border-[#111111] focus:outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-[#111111]">Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F4F2] border border-[#E2E2E0] focus:border-[#111111] focus:outline-none"
                  />
                </div>

                {!editingProduct && (
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-[#111111]">Upload Product Photos (Up to 5 images)</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setFiles(e.target.files)}
                      className="w-full text-xs p-2 bg-[#F5F4F2] border border-[#E2E2E0]"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E2E0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E2E2E0] font-bold text-[#111111] hover:bg-[#F5F4F2] rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#111111] text-[#FFFFFF] font-heading font-extrabold text-xs uppercase tracking-wider hover:bg-[#2B2B2B] disabled:opacity-50 transition-colors flex items-center gap-2 rounded"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin text-[#F97316]" /> : (editingProduct ? 'Update Product' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
