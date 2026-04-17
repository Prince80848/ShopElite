import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { removeFromCart, updateQuantity, selectCartItems, selectCartTotal } from '../store/slices/cartSlice';

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const { user } = useSelector((s) => s.auth);

  const shippingPrice = total >= 999 ? 0 : 79;
  const taxPrice = Math.round(total * 0.18);
  const grandTotal = total + shippingPrice + taxPrice;

  if (items.length === 0) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="text-center animate-fade-in-up">
        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-white border border-slate-200 flex items-center justify-center">
          <FiShoppingBag className="text-slate-900" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
        <p className="text-slate-400 mb-8">Add some amazing products to get started!</p>
        <Link to="/shop" className="btn-primary px-8">Shop Now</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Shopping Cart ({items.length} items)</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product._id} className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center gap-4">
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.images?.[0]?.url || 'https://placehold.co/80x80/13131f/7c3aed?text=?'}
                  alt={product.name}
                  className="w-20 h-20 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${product._id}`} className="font-semibold text-slate-900 hover:text-slate-700 transition-colors line-clamp-2 text-sm">
                  {product.name}
                </Link>
                <p className="text-xs text-slate-400 mt-0.5">{product.category?.name}</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1 bg-slate-50 rounded-xl border border-slate-200 p-1">
                    <button onClick={() => dispatch(updateQuantity({ productId: product._id, quantity: quantity - 1 }))}
                      className="w-6 h-6 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
                      <FiMinus size={12} />
                    </button>
                    <span className="w-6 text-center text-slate-900 text-sm">{quantity}</span>
                    <button onClick={() => dispatch(updateQuantity({ productId: product._id, quantity: quantity + 1 }))}
                      className="w-6 h-6 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
                      <FiPlus size={12} />
                    </button>
                  </div>
                  <button onClick={() => dispatch(removeFromCart(product._id))}
                    className="text-red-400 hover:text-red-300 transition-colors text-xs flex items-center gap-1">
                    <FiTrash2 size={13} /> Remove
                  </button>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-slate-900">₹{((product.discountPrice || product.price) * quantity).toLocaleString()}</p>
                {product.discountPrice && <p className="text-xs text-slate-400 line-through">₹{(product.price * quantity).toLocaleString()}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 h-fit sticky top-24">
          <h2 className="font-bold text-slate-900 text-lg mb-6">Order Summary</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Subtotal</span>
              <span className="text-slate-900">₹{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Shipping</span>
              <span className={shippingPrice === 0 ? 'text-green-400' : 'text-slate-900'}>
                {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">GST (18%)</span>
              <span className="text-slate-900">₹{taxPrice.toLocaleString()}</span>
            </div>
            <div className="border-t border-slate-200 pt-3 flex justify-between font-bold">
              <span className="text-slate-900">Total</span>
              <span className="text-slate-900 font-bold text-lg">₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {total < 999 && (
            <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 mb-4 text-xs text-slate-700">
              Add ₹{(999 - total).toLocaleString()} more for free shipping!
            </div>
          )}

          {user ? (
            <Link to="/checkout" state={{ orderSummary: { items, itemsPrice: total, shippingPrice, taxPrice, totalPrice: grandTotal } }}
              className="btn-primary w-full py-3.5 justify-center">
              Proceed to Checkout <FiArrowRight size={16} />
            </Link>
          ) : (
            <Link to="/login?redirect=/checkout" className="btn-primary w-full py-3.5 justify-center">
              Login to Checkout <FiArrowRight size={16} />
            </Link>
          )}

          <Link to="/shop" className="btn-secondary w-full py-3 justify-center mt-3 text-sm">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
