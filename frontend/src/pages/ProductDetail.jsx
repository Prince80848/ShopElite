import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiShoppingCart, FiHeart, FiStar, FiMinus, FiPlus, FiArrowLeft, FiCheck, FiTruck } from 'react-icons/fi';
import { useGetProductByIdQuery, useAddReviewMutation } from '../store/api/productsApi';
import { addToCart } from '../store/slices/cartSlice';
import { PageLoader } from '../components/Loader';
import toast from 'react-hot-toast';
import axios from 'axios';
import { setCredentials } from '../store/slices/authSlice';

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user, token } = useSelector((s) => s.auth);
  const [qty, setQty] = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [showReview, setShowReview] = useState(false);

  const { data, isLoading } = useGetProductByIdQuery(id);
  const [addReview, { isLoading: reviewing }] = useAddReviewMutation();

  if (isLoading) return <PageLoader />;
  if (!data?.product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Product not found</h2>
        <Link to="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    </div>
  );

  const { product, reviews } = data;
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: qty }));
  };

  const handleWishlist = async () => {
    if (!user) { toast.error('Please login'); return; }
    try {
      const { data: res } = await axios.post(`/api/auth/wishlist/${product._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }, withCredentials: true,
      });
      dispatch(setCredentials({ user: { ...user, wishlist: res.wishlist }, token }));
      toast.success('Wishlist updated!');
    } catch { toast.error('Error'); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to review'); return; }
    try {
      await addReview({ id: product._id, ...reviewForm }).unwrap();
      toast.success('Review submitted!');
      setShowReview(false);
      setReviewForm({ rating: 5, title: '', comment: '' });
    } catch (err) { toast.error(err?.data?.message || 'Error'); }
  };

  return (
    <div className="min-h-screen pt-20 max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <Link to="/shop" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 text-sm mb-6 transition-colors">
        <FiArrowLeft size={14} /> Back to Shop
      </Link>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="relative aspect-square bg-white rounded-3xl overflow-hidden border border-slate-200 mb-4">
            <img
              src={product.images?.[selectedImg]?.url || 'https://placehold.co/600x600/13131f/7c3aed?text=Product'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 badge badge-error">{discountPercent}% OFF</span>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImg(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedImg === i ? 'border-purple-500' : 'border-slate-200'}`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="badge badge-primary mb-3">{product.category?.name}</p>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>
          {product.brand && <p className="text-slate-400 text-sm mb-4">by <span className="text-slate-900 font-medium">{product.brand}</span></p>}

          {/* Rating */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((s) => (
                <FiStar key={s} size={18} className={s <= Math.round(product.ratings) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'} fill={s <= Math.round(product.ratings) ? 'currentColor' : 'none'} />
              ))}
            </div>
            <span className="text-slate-700 font-medium">{product.ratings?.toFixed(1)}</span>
            <span className="text-slate-400 text-sm">({product.numReviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3 mb-6">
            <span className="text-4xl font-bold text-slate-900 font-bold">
              ₹{(product.discountPrice || product.price).toLocaleString()}
            </span>
            {product.discountPrice && (
              <span className="text-xl text-slate-400 line-through mb-1">₹{product.price.toLocaleString()}</span>
            )}
          </div>

          <p className="text-slate-400 leading-relaxed mb-6">{product.description}</p>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            {product.stock > 0 ? (
              <><FiCheck className="text-green-400" size={16} /><span className="text-green-400 text-sm font-medium">In Stock ({product.stock} available)</span></>
            ) : (
              <span className="badge badge-error">Out of Stock</span>
            )}
          </div>

          {/* Quantity */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <p className="text-slate-400 text-sm">Quantity:</p>
              <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-1">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors"><FiMinus size={14} /></button>
                <span className="w-8 text-center text-slate-900 font-medium">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors"><FiPlus size={14} /></button>
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex gap-3 mb-8">
            <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn-primary flex-1 py-3.5 justify-center">
              <FiShoppingCart size={18} /> Add to Cart
            </button>
            <button onClick={handleWishlist} className="btn-secondary px-4 py-3.5">
              <FiHeart size={18} className={user?.wishlist?.includes(product._id) ? 'fill-pink-400 text-pink-400' : ''} />
            </button>
          </div>

          {/* Delivery info */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200">
            <div className="flex items-start gap-3">
              <FiTruck className="text-slate-900 mt-0.5" size={18} />
              <div>
                <p className="font-medium text-slate-900 text-sm">Free Delivery</p>
                <p className="text-slate-400 text-xs">Order above ₹999 — Estimated delivery in 2–5 business days</p>
              </div>
            </div>
          </div>

          {/* Specs */}
          {product.specifications?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-slate-900 mb-3">Specifications</h3>
              <div className="space-y-2">
                {product.specifications.map((sp, i) => (
                  <div key={i} className="flex gap-6 text-sm">
                    <span className="text-slate-400 w-28 flex-shrink-0">{sp.key}</span>
                    <span className="text-slate-700">{sp.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Customer Reviews ({reviews?.length || 0})</h2>
          {user && (
            <button onClick={() => setShowReview(!showReview)} className="btn-primary text-sm py-2 px-5">
              Write a Review
            </button>
          )}
        </div>

        {/* Review Form */}
        {showReview && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-8">
            <h3 className="font-semibold text-slate-900 mb-4">Your Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map((s) => (
                    <button type="button" key={s} onClick={() => setReviewForm({ ...reviewForm, rating: s })}>
                      <FiStar size={24} className={`transition-colors ${s <= reviewForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} fill={s <= reviewForm.rating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>
              <input required value={reviewForm.title} onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })} placeholder="Review title" className="input-field" />
              <textarea required value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} placeholder="Share your experience..." rows={4} className="input-field resize-none" />
              <div className="flex gap-3">
                <button type="submit" disabled={reviewing} className="btn-primary">{reviewing ? 'Submitting...' : 'Submit Review'}</button>
                <button type="button" onClick={() => setShowReview(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        {reviews?.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div key={rev._id} className="bg-white rounded-2xl p-5 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-slate-900 font-bold text-sm flex-shrink-0">
                    {rev.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900 text-sm">{rev.user?.name}</p>
                      <p className="text-xs text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[1,2,3,4,5].map((s) => <FiStar key={s} size={11} className={s <= rev.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'} fill={s <= rev.rating ? 'currentColor' : 'none'} />)}
                    </div>
                  </div>
                </div>
                <p className="font-semibold text-slate-900 text-sm mb-1">{rev.title}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-400">No reviews yet. Be the first to review!</p>
          </div>
        )}
      </div>
    </div>
  );
}
