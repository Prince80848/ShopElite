import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiPackage } from 'react-icons/fi';
import { useGetProductsQuery, useDeleteProductMutation, useGetCategoriesQuery } from '../../store/api/productsApi';
import { SkeletonCard } from '../../components/Loader';
import toast from 'react-hot-toast';
import AddEditProduct from './AddEditProduct';

export default function AdminProducts() {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const { data, isLoading } = useGetProductsQuery({ page, keyword, limit: 10 });
  const { data: catData } = useGetCategoriesQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteProduct(id).unwrap();
      toast.success('Product deleted');
    } catch { toast.error('Failed to delete'); }
  };

  if (showForm || editProduct) return (
    <AddEditProduct
      product={editProduct}
      categories={catData?.categories || []}
      onClose={() => { setShowForm(false); setEditProduct(null); }}
    />
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-400 text-sm">{data?.total || 0} total products</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm py-2 px-4">
          <FiPlus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          value={keyword}
          onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
          placeholder="Search products..."
          className="input-field pl-10"
        />
      </div>

      {/* Products Table */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Sold</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="skeleton h-10 w-full rounded-xl" /></td></tr>
                ))
                : data?.products?.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0]?.url || 'https://placehold.co/40x40/13131f/7c3aed?text=?'}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                        />
                        <div>
                          <p className="text-slate-900 font-medium line-clamp-1">{p.name}</p>
                          {p.brand && <p className="text-xs text-slate-400">{p.brand}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{p.category?.name}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-slate-900 font-medium">₹{(p.discountPrice || p.price).toLocaleString()}</p>
                        {p.discountPrice && <p className="text-xs text-slate-400 line-through">₹{p.price.toLocaleString()}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs ${p.stock > 10 ? 'badge-success' : p.stock > 0 ? 'badge-warning' : 'badge-error'}`}>
                        {p.stock > 0 ? p.stock : 'Out'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{p.sold || 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditProduct(p)}
                          className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 hover:bg-purple-500/20 flex items-center justify-center transition-colors">
                          <FiEdit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(p._id, p.name)}
                          className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {data?.pages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-slate-200">
            {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm transition-all ${page === p ? 'bg-slate-900 text-white text-slate-900' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}>
                {p}
              </button>
            ))}
          </div>
        )}

        {!isLoading && !data?.products?.length && (
          <div className="text-center py-12">
            <FiPackage className="mx-auto text-slate-600 mb-2" size={36} />
            <p className="text-slate-400">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}
