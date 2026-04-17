import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiHeart, FiTrash2, FiShoppingCart } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { PageLoader } from '../components/Loader';
import { setCredentials } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setWishlistProducts(data.user.wishlist || []);
      } catch (err) {
        toast.error('Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [token]);

  const removeWishlist = async (productId) => {
    try {
      const { data } = await axios.post(`/api/auth/wishlist/${productId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      dispatch(setCredentials({ user: { ...user, wishlist: data.wishlist }, token }));
      setWishlistProducts(wishlistProducts.filter(p => p._id !== productId));
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex items-center gap-3 mb-8">
        <FiHeart className="text-pink-500" size={28} />
        <h1 className="text-3xl font-bold text-slate-900">My Wishlist</h1>
        <span className="badge badge-primary ml-2">{wishlistProducts.length} Items</span>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm mt-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-slate-50 border border-slate-200 flex items-center justify-center">
            <FiHeart className="text-slate-400" size={36} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Your wishlist is empty</h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">Save your favorite items here while you continue shopping.</p>
          <Link to="/shop" className="btn-primary px-8">Explore Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <div key={product._id} className="relative group">
              <ProductCard product={product} />
              <button 
                onClick={() => removeWishlist(product._id)}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white shadow-md text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                title="Remove from wishlist"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
