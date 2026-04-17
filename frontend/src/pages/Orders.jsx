import { useGetMyOrdersQuery } from '../store/api/ordersApi';
import { Link } from 'react-router-dom';
import { FiPackage, FiArrowRight, FiClock, FiCheck, FiTruck, FiXCircle } from 'react-icons/fi';
import { PageLoader } from '../components/Loader';

const statusConfig = {
  Processing:    { color: 'badge-warning', icon: FiClock },
  Confirmed:     { color: 'badge-primary', icon: FiCheck },
  Shipped:       { color: 'badge-primary', icon: FiTruck },
  'Out for Delivery': { color: 'badge-primary', icon: FiTruck },
  Delivered:     { color: 'badge-success', icon: FiCheck },
  Cancelled:     { color: 'badge-error', icon: FiXCircle },
};

export default function Orders() {
  const { data, isLoading } = useGetMyOrdersQuery();

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen pt-20 max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">My Orders</h1>

      {!data?.orders?.length ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-white border border-slate-200 flex items-center justify-center">
            <FiPackage className="text-slate-900" size={36} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No orders yet</h3>
          <p className="text-slate-400 mb-6">Start shopping to see your orders here</p>
          <Link to="/shop" className="btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {data.orders.map((order) => {
            const { color, icon: StatusIcon } = statusConfig[order.orderStatus] || statusConfig.Processing;
            return (
              <div key={order._id} className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-200 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Order ID</p>
                    <p className="font-mono text-sm text-slate-700">#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div className="text-right sm:text-left">
                    <p className="text-xs text-slate-400 mb-1">Date</p>
                    <p className="text-sm text-slate-700">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Total</p>
                    <p className="font-bold text-slate-900">₹{order.totalPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className={`badge ${color} flex items-center gap-1`}>
                      <StatusIcon size={11} /> {order.orderStatus}
                    </span>
                  </div>
                  <Link to={`/orders/${order._id}`} className="flex items-center gap-1 text-sm text-slate-900 hover:text-slate-700 transition-colors">
                    View <FiArrowRight size={14} />
                  </Link>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-1">
                  {order.orderItems?.slice(0, 4).map((item, i) => (
                    <div key={i} className="flex-shrink-0 flex items-center gap-2 bg-slate-50 rounded-xl p-2 pr-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="text-xs text-slate-900 line-clamp-1 max-w-24">{item.name}</p>
                        <p className="text-xs text-slate-400">×{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {order.orderItems?.length > 4 && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 text-xs self-center">
                      +{order.orderItems.length - 4}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
