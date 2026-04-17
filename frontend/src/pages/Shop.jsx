import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX, FiChevronDown, FiSearch } from 'react-icons/fi';
import { useGetProductsQuery, useGetCategoriesQuery } from '../store/api/productsApi';
import ProductCard from '../components/ProductCard';
import { SkeletonCard } from '../components/Loader';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating = searchParams.get('rating') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page')) || 1;

  const { data, isLoading } = useGetProductsQuery({ keyword, category, minPrice, maxPrice, rating, sort, page, limit: 12 });
  const { data: catData } = useGetCategoriesQuery();

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    if (key !== 'page') params.set('page', '1');
    setSearchParams(params);
  };

  const clearFilters = () => setSearchParams(new URLSearchParams());

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
  ];

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wide">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => updateParam('category', '')}
            className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${!category ? 'bg-slate-100 text-slate-900 font-medium' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            All Categories
          </button>
          {catData?.categories?.map((cat) => (
            <button
              key={cat._id}
              onClick={() => updateParam('category', cat._id)}
              className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${category === cat._id ? 'bg-slate-100 text-slate-900 font-medium' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wide">Price Range</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Min (₹)</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => updateParam('minPrice', e.target.value)}
              placeholder="0"
              className="input-field text-sm py-2"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Max (₹)</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => updateParam('maxPrice', e.target.value)}
              placeholder="Any"
              className="input-field text-sm py-2"
            />
          </div>
        </div>
        <div className="mt-2 space-y-1">
          {[['0', '1000'], ['1000', '10000'], ['10000', '50000'], ['50000', '']].map(([min, max]) => (
            <button key={min} onClick={() => { updateParam('minPrice', min); updateParam('maxPrice', max); }}
              className="block w-full text-left text-xs text-slate-400 hover:text-slate-900 px-1 py-1 transition-colors">
              ₹{Number(min).toLocaleString()} {max ? `– ₹${Number(max).toLocaleString()}` : '& above'}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wide">Min Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((r) => (
            <button key={r} onClick={() => updateParam('rating', r === Number(rating) ? '' : r)}
              className={`flex items-center gap-1 text-sm px-3 py-2 rounded-lg w-full transition-colors ${Number(rating) === r ? 'bg-slate-100 font-medium text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
              {'★'.repeat(r)}{'☆'.repeat(5 - r)} & above
            </button>
          ))}
        </div>
      </div>

      <button onClick={clearFilters} className="btn-secondary w-full text-sm py-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300">
        <FiX size={14} /> Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {keyword ? `Results for "${keyword}"` : 'All Products'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">{data?.total || 0} products found</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="input-field text-sm py-2 pl-3 pr-8 appearance-none cursor-pointer"
            >
              {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
          </div>
          {/* Filter toggle mobile */}
          <button onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden btn-secondary text-sm py-2 px-3">
            <FiFilter size={15} /> Filters
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 sticky top-24">
            <FilterContent />
          </div>
        </aside>

        {/* Mobile Filter Drawer */}
        {showFilters && (
          <div className="fixed inset-0 z-50 flex lg:hidden" onClick={() => setShowFilters(false)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative ml-auto w-72 bg-slate-50 h-full p-5 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-slate-900">Filters</h2>
                <button onClick={() => setShowFilters(false)} className="text-slate-400"><FiX size={20}/></button>
              </div>
              <FilterContent />
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : data?.products?.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {data.products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
              {/* Pagination */}
              {data.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => updateParam('page', p)}
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${page === p ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 border border-slate-200 hover:border-indigo-500/50'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No products found</h3>
              <p className="text-slate-400 mb-6">Try adjusting your filters or search terms</p>
              <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
