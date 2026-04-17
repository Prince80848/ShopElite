import { useState } from 'react';
import { FiArrowLeft, FiPlus, FiX } from 'react-icons/fi';
import { useCreateProductMutation, useUpdateProductMutation } from '../../store/api/productsApi';
import toast from 'react-hot-toast';

export default function AddEditProduct({ product, categories, onClose }) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    discountPrice: product?.discountPrice || '',
    category: product?.category?._id || '',
    brand: product?.brand || '',
    stock: product?.stock || '',
    featured: product?.featured || false,
    images: product?.images || [],
    tags: product?.tags?.join(', ') || '',
  });
  const [imageUrl, setImageUrl] = useState('');

  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const isLoading = creating || updating;

  const addImage = () => {
    if (!imageUrl.trim()) return;
    setForm({ ...form, images: [...form.images, { url: imageUrl, public_id: `img_${Date.now()}` }] });
    setImageUrl('');
  };

  const removeImage = (i) => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) { toast.error('Please select a category'); return; }
    const payload = {
      ...form,
      price: Number(form.price),
      discountPrice: Number(form.discountPrice) || 0,
      stock: Number(form.stock),
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };
    try {
      if (isEdit) {
        await updateProduct({ id: product._id, ...payload }).unwrap();
        toast.success('Product updated!');
      } else {
        await createProduct(payload).unwrap();
        toast.success('Product created!');
      }
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed');
    }
  };

  return (
    <div>
      <button onClick={onClose} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 text-sm mb-6 transition-colors">
        <FiArrowLeft size={14} /> Back to Products
      </button>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-900">Basic Information</h2>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Product Name *</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="e.g. Apple iPhone 15 Pro" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Description *</label>
            <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" placeholder="Describe your product..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Category *</label>
              <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                <option value="">Select Category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Brand</label>
              <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input-field" placeholder="e.g. Apple" />
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-900">Pricing & Stock</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">MRP Price (₹) *</label>
              <input required type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" placeholder="1999" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Sale Price (₹)</label>
              <input type="number" min="0" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="input-field" placeholder="1499" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Stock *</label>
              <input required type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" placeholder="100" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="w-4 h-4 accent-purple-500" />
            <label htmlFor="featured" className="text-sm text-slate-700">Mark as Featured Product</label>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-900">Images</h2>
          <div className="flex gap-2">
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="input-field flex-1" placeholder="Paste image URL..." />
            <button type="button" onClick={addImage} className="btn-secondary text-sm px-4 py-2"><FiPlus size={16} /></button>
          </div>
          {form.images.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {form.images.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img.url} alt="" className="w-20 h-20 rounded-xl object-cover border border-slate-200" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-slate-900 hover:bg-red-400 transition-colors">
                    <FiX size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Tags (comma separated)</label>
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="input-field" placeholder="e.g. smartphone, apple, 5g" />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={isLoading} className="btn-primary flex-1 py-3.5 justify-center">
            {isLoading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
          <button type="button" onClick={onClose} className="btn-secondary px-8 py-3.5">Cancel</button>
        </div>
      </form>
    </div>
  );
}
