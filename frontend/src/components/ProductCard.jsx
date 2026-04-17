import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiShoppingCart, FiHeart, FiStar, FiEye } from 'react-icons/fi';
import { addToCart } from '../store/slices/cartSlice';
import axios from 'axios';
import { setCredentials } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to add to wishlist'); return; }
    try {
      const { data } = await axios.post(`/api/auth/wishlist/${product._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      dispatch(setCredentials({ user: { ...user, wishlist: data.wishlist }, token }));
      toast.success('Wishlist updated!');
    } catch { toast.error('Failed to update wishlist'); }
  };

  const inWishlist = user?.wishlist?.includes(product._id);

  return (
    <div onClick={() => navigate(`/product/${product._id}`)} className="group block cursor-pointer">
      <div className="relative bg-white rounded-2xl overflow-hidden border border-slate-200 card-hover">
        {/* Image */}
        <div className="relative overflow-hidden aspect-square bg-slate-50">
          <img
            src={product.images?.[0]?.url || 'https://via.placeholder.com/400x400/e2e8f0/0f172a.png?text=Product'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discountPercent > 0 && (
              <span className="badge badge-error text-xs">{discountPercent}% OFF</span>
            )}
            {product.featured && (
              <span className="badge badge-primary text-xs">Featured</span>
            )}
            {product.stock === 0 && (
              <span className="badge bg-gray-700/80 text-gray-300 border-gray-600 text-xs">Out of Stock</span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
            <button
              onClick={(e) => { e.stopPropagation(); handleWishlist(e); }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-sm ${
                inWishlist ? 'bg-pink-50 text-pink-500' : 'bg-white text-slate-500 hover:bg-pink-50 hover:text-pink-600'
              }`}
            >
              <FiHeart size={15} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
            <Link
              to={`/product/${product._id}`}
              onClick={(e) => e.stopPropagation()}
              className="w-9 h-9 rounded-xl bg-white text-slate-500 hover:bg-slate-100 flex items-center justify-center transition-all shadow-sm"
            >
              <FiEye size={15} />
            </Link>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-slate-900 mb-1 font-medium">{product.category?.name || 'General'}</p>
          <h3 className="font-semibold text-slate-900 text-sm leading-tight mb-2 line-clamp-2 group-hover:text-slate-700 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <FiStar
                  key={s}
                  size={12}
                  className={s <= Math.round(product.ratings) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}
                  fill={s <= Math.round(product.ratings) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <span className="text-xs text-slate-400">({product.numReviews || 0})</span>
          </div>

          {/* Price + Add to cart */}
          <div className="flex items-center justify-between gap-2">
            <div>
              {product.discountPrice ? (
                <>
                  <span className="font-bold text-slate-900">₹{product.discountPrice.toLocaleString()}</span>
                  <span className="text-xs text-slate-400 line-through ml-1.5">₹{product.price.toLocaleString()}</span>
                </>
              ) : (
                <span className="font-bold text-slate-900">₹{product.price.toLocaleString()}</span>
              )}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleAddToCart(e); }}
              disabled={product.stock === 0}
              className="w-9 h-9 rounded-xl bg-indigo-600 text-white hover:opacity-90 flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
            >
              <FiShoppingCart size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
