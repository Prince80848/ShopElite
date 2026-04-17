import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiCheck, FiCreditCard, FiMapPin, FiPackage } from 'react-icons/fi';
import { useCreateOrderMutation, useCreatePaymentOrderMutation, useVerifyPaymentMutation } from '../store/api/ordersApi';
import { clearCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const STEPS = ['Shipping', 'Payment', 'Confirm'];

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((s) => s.auth);
  const { orderSummary } = location.state || {};

  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({
    fullName: user?.name || '', phone: '', street: '', city: '', state: '', pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  const [createOrder] = useCreateOrderMutation();
  const [createPaymentOrder] = useCreatePaymentOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [loading, setLoading] = useState(false);

  if (!orderSummary) {
    navigate('/cart');
    return null;
  }

  const { items, itemsPrice, shippingPrice, taxPrice, totalPrice } = orderSummary;

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!address.phone || !address.street || !address.city || !address.pincode) {
      toast.error('Please fill all fields');
      return;
    }
    setStep(1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderItems = items.map((i) => ({
        product: i.product._id,
        name: i.product.name,
        image: i.product.images?.[0]?.url || '',
        price: i.product.discountPrice || i.product.price,
        quantity: i.quantity,
      }));

      const { data: newOrder } = await createOrder({
        orderItems,
        shippingAddress: address,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }).unwrap().then(d => ({ data: d })).catch(e => { throw e; });

      const order = await createOrder({ orderItems, shippingAddress: address, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice }).unwrap();

      if (paymentMethod === 'cod') {
        dispatch(clearCart());
        toast.success('Order placed successfully!');
        navigate(`/orders/${order.order._id}`);
        return;
      }

      // Razorpay
      const paymentData = await createPaymentOrder({ amount: totalPrice, orderId: order.order._id }).unwrap();

      const options = {
        key: paymentData.order.id ? process.env.VITE_RAZORPAY_KEY || paymentData.key : paymentData.key,
        amount: paymentData.order.amount,
        currency: 'INR',
        name: 'ShopElite',
        description: 'Order Payment',
        order_id: paymentData.order.id,
        handler: async (response) => {
          try {
            await verifyPayment({ ...response, orderId: order.order._id }).unwrap();
            dispatch(clearCart());
            toast.success('Payment successful! Order confirmed 🎉');
            navigate(`/orders/${order.order._id}`);
          } catch { toast.error('Payment verification failed'); }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: '#7c3aed' },
        modal: { ondismiss: () => toast('Payment cancelled', { icon: '⚠️' }) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Load Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="min-h-screen pt-20 max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${i <= step ? 'bg-slate-900 text-white text-slate-900' : 'bg-white text-slate-400 border border-slate-200'}`}>
                {i < step ? <FiCheck size={14} /> : <span className="w-4 h-4 rounded-full border border-current text-xs flex items-center justify-center">{i + 1}</span>}
                {s}
              </div>
              {i < STEPS.length - 1 && <div className={`w-12 h-0.5 ${i < step ? 'bg-purple-500' : 'bg-slate-100'}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Step 0: Address */}
            {step === 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center gap-2 mb-6">
                  <FiMapPin className="text-slate-900" size={20} />
                  <h2 className="font-bold text-slate-900 text-lg">Shipping Address</h2>
                </div>
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Full Name *</label>
                      <input value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} required className="input-field" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Phone *</label>
                      <input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} required className="input-field" placeholder="10-digit number" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Street Address *</label>
                    <input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} required className="input-field" placeholder="House no, Street, Colony" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">City *</label>
                      <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required className="input-field" placeholder="City" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">State *</label>
                      <input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} required className="input-field" placeholder="State" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Pincode *</label>
                      <input value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} required className="input-field" placeholder="6-digit" />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary w-full py-3.5 justify-center mt-2">Continue to Payment</button>
                </form>
              </div>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center gap-2 mb-6">
                  <FiCreditCard className="text-slate-900" size={20} />
                  <h2 className="font-bold text-slate-900 text-lg">Payment Method</h2>
                </div>
                <div className="space-y-3">
                  {[
                    { value: 'razorpay', label: 'Razorpay', desc: 'Pay with UPI, Cards, Net Banking, Wallets', icon: '💳' },
                    { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: '💰' },
                  ].map((m) => (
                    <button key={m.value} onClick={() => setPaymentMethod(m.value)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${paymentMethod === m.value ? 'border-purple-500 bg-slate-100' : 'border-slate-200 hover:border-slate-300'}`}>
                      <span className="text-2xl">{m.icon}</span>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{m.label}</p>
                        <p className="text-xs text-slate-400">{m.desc}</p>
                      </div>
                      <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === m.value ? 'border-purple-500 bg-purple-500' : 'border-slate-600'}`}>
                        {paymentMethod === m.value && <FiCheck size={12} className="text-slate-900" />}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(0)} className="btn-secondary flex-1 justify-center py-3">Back</button>
                  <button onClick={() => setStep(2)} className="btn-primary flex-1 justify-center py-3">Review Order</button>
                </div>
              </div>
            )}

            {/* Step 2: Confirm */}
            {step === 2 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center gap-2 mb-6">
                  <FiPackage className="text-slate-900" size={20} />
                  <h2 className="font-bold text-slate-900 text-lg">Order Confirmation</h2>
                </div>

                <div className="space-y-3 mb-6">
                  {items.map(({ product, quantity }) => (
                    <div key={product._id} className="flex items-center gap-3">
                      <img src={product.images?.[0]?.url} alt={product.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900 line-clamp-1">{product.name}</p>
                        <p className="text-xs text-slate-400">Qty: {quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-slate-900">₹{((product.discountPrice || product.price) * quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 rounded-xl p-4 mb-6 text-sm">
                  <p className="font-medium text-slate-900 mb-1">Shipping to:</p>
                  <p className="text-slate-400">{address.fullName}, {address.street}, {address.city}, {address.state} - {address.pincode}</p>
                  <p className="text-slate-400">📱 {address.phone}</p>
                  <p className="text-slate-900 mt-2 font-medium">Payment: {paymentMethod === 'razorpay' ? 'Razorpay' : 'Cash on Delivery'}</p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center py-3">Back</button>
                  <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1 justify-center py-3">
                    {loading ? 'Processing...' : paymentMethod === 'razorpay' ? 'Pay Now' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Price Summary */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 h-fit">
            <h3 className="font-bold text-slate-900 mb-4">Price Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-400">{items.length} items</span><span className="text-slate-900">₹{itemsPrice.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Shipping</span><span className={shippingPrice === 0 ? 'text-green-400' : 'text-slate-900'}>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">GST</span><span className="text-slate-900">₹{taxPrice.toLocaleString()}</span></div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold">
                <span className="text-slate-900">Grand Total</span>
                <span className="text-slate-900 font-bold text-lg">₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
