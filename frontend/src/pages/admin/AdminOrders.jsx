import { useState } from 'react';
import { FiChevronDown, FiPackage } from 'react-icons/fi';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../../store/api/ordersApi';
import toast from 'react-hot-toast';

const STATUSES = ['', 'Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

const statusColors = {
  Processing: 'badge-warning', Confirmed: 'badge-primary', Shipped: 'badge-primary',
  'Out for Delivery': 'badge-primary', Delivered: 'badge-success', Cancelled: 'badge-error',
};

export default function AdminOrders() {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetAllOrdersQuery({ status, page, limit: 10 });
  const [updateOrder] = useUpdateOrderStatusMutation();

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateOrder({ id, status: newStatus }).unwrap();
      toast.success('Order status updated!');
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orders Management</h1>
          <p className="text-slate-400 text-sm">{data?.total || 0} total orders</p>
        </div>
        {/* Status Filter */}
        <div className="relative">
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="input-field text-sm py-2 pr-8 appearance-none cursor-pointer">
            <option value="">All Statuses</option>
            {STATUSES.filter(Boolean).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
        </div>
      </div>

      <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 font-medium">Order ID</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="skeleton h-10 rounded-xl" /></td></tr>
                ))
                : data?.orders?.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-700 text-xs">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-4 py-3">
                      <p className="text-slate-900">{order.user?.name}</p>
                      <p className="text-xs text-slate-400">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{order.orderItems?.length} items</td>
                    <td className="px-4 py-3 text-slate-900 font-medium">₹{order.totalPrice?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs ${order.isPaid ? 'badge-success' : 'badge-warning'}`}>
                        {order.isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs ${statusColors[order.orderStatus] || 'badge-primary'}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="text-xs bg-white border border-slate-200 text-slate-700 rounded-lg px-2 py-1.5 appearance-none cursor-pointer hover:border-purple-500/50 transition-colors"
                        >
                          {STATUSES.filter(Boolean).map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
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

        {!isLoading && !data?.orders?.length && (
          <div className="text-center py-12">
            <FiPackage className="mx-auto text-slate-600 mb-2" size={36} />
            <p className="text-slate-400">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
