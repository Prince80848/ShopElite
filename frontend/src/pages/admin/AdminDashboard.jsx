import { useGetAdminStatsQuery } from '../../store/api/ordersApi';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FiUsers, FiShoppingBag, FiPackage, FiDollarSign, FiTrendingUp, FiArrowUpRight } from 'react-icons/fi';
import { PageLoader } from '../../components/Loader';
import { Link } from 'react-router-dom';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const PIE_COLORS = ['#7c3aed', '#f472b6', '#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

const STATUS_COLORS = {
  Processing: '#f59e0b', Confirmed: '#7c3aed', Shipped: '#3b82f6',
  'Out for Delivery': '#8b5cf6', Delivered: '#10b981', Cancelled: '#ef4444',
};

export default function AdminDashboard() {
  const { data, isLoading } = useGetAdminStatsQuery();
  if (isLoading) return <PageLoader />;

  const stats = [
    { label: 'Total Revenue', value: `₹${(data?.totalRevenue || 0).toLocaleString()}`, icon: FiDollarSign, color: '#7c3aed', bg: 'bg-slate-100', border: 'border-slate-200', change: '+12.5%' },
    { label: 'Total Orders', value: data?.totalOrders || 0, icon: FiPackage, color: '#f472b6', bg: 'bg-pink-500/10', border: 'border-pink-500/20', change: '+8.2%' },
    { label: 'Total Products', value: data?.totalProducts || 0, icon: FiShoppingBag, color: '#10b981', bg: 'bg-green-500/10', border: 'border-green-500/20', change: '+3.1%' },
    { label: 'Total Users', value: data?.totalUsers || 0, icon: FiUsers, color: '#f59e0b', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', change: '+18.7%' },
  ];

  const chartData = (data?.monthlyRevenue || []).map((d) => ({
    month: MONTHS[d._id.month - 1],
    revenue: d.revenue,
    orders: d.orders,
  }));

  const pieData = (data?.orderStatusData || []).map((d) => ({
    name: d._id,
    value: d.count,
  }));

  const categoryData = (data?.categorySales || []).map((d) => ({
    name: d._id,
    revenue: d.revenue,
    sales: d.sales,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="glass rounded-xl p-3 text-sm">
        <p className="text-slate-400 mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }} className="font-medium">
            {p.name}: {p.name === 'revenue' ? `₹${p.value?.toLocaleString()}` : p.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-400 text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg, border, change }) => (
          <div key={label} className={`${bg} border ${border} rounded-2xl p-5`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center border ${border}`}>
                <Icon size={20} style={{ color }} />
              </div>
              <span className="badge badge-success text-xs flex items-center gap-0.5">
                <FiArrowUpRight size={10} /> {change}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-slate-400 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-slate-900">Revenue Overview</h2>
              <p className="text-xs text-slate-400">Last 6 months performance</p>
            </div>
            <div className="flex items-center gap-1 badge badge-success text-xs">
              <FiTrendingUp size={10} /> Growing
            </div>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e30" />
                <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="revenue" stroke="#7c3aed" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-52 flex items-center justify-center text-slate-400">No revenue data yet. Seed your database!</div>
          )}
        </div>

        {/* Order Status Pie */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
          <h2 className="font-semibold text-slate-900 mb-1">Order Status</h2>
          <p className="text-xs text-slate-400 mb-4">Distribution overview</p>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={STATUS_COLORS[entry.name] || PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} />
                <Legend formatter={(v) => <span className="text-xs text-slate-400">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-52 flex items-center justify-center text-slate-400 text-sm">No orders yet</div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Category Bar Chart */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
          <h2 className="font-semibold text-slate-900 mb-1">Category Revenue</h2>
          <p className="text-xs text-slate-400 mb-4">Top performing categories</p>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e30" />
                <XAxis dataKey="name" stroke="#475569" tick={{ fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" name="revenue" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-52 flex items-center justify-center text-slate-400 text-sm">No sales data yet</div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Top Selling Products</h2>
          {data?.topProducts?.length > 0 ? (
            <div className="space-y-3">
              {data.topProducts.map((p, i) => (
                <div key={p._id} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-4">{i + 1}</span>
                  <img src={p.images?.[0]?.url} alt={p.name} className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 font-medium truncate">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.sold} sold · ₹{p.price?.toLocaleString()}</p>
                  </div>
                  <div className="w-16">
                    <div className="h-1.5 bg-white rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${Math.min(100, (p.sold / (data.topProducts[0]?.sold || 1)) * 100)}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-slate-400 text-sm">No sales data yet</div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-slate-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-slate-900 hover:text-slate-700 transition-colors">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-slate-200">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data?.recentOrders?.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 font-mono text-slate-700">#{order._id.slice(-6).toUpperCase()}</td>
                  <td className="py-3 text-slate-700">{order.user?.name}</td>
                  <td className="py-3 text-slate-900 font-medium">₹{order.totalPrice?.toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`badge text-xs ${
                      order.orderStatus === 'Delivered' ? 'badge-success' :
                      order.orderStatus === 'Cancelled' ? 'badge-error' :
                      order.orderStatus === 'Processing' ? 'badge-warning' : 'badge-primary'
                    }`}>{order.orderStatus}</span>
                  </td>
                  <td className="py-3 text-slate-400">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!data?.recentOrders?.length && (
            <p className="text-center py-8 text-slate-400">No orders yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
