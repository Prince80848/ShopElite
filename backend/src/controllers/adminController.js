const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');

// @desc   Get admin dashboard stats
// @route  GET /api/admin/stats
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalProducts, totalOrders, revenueData] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]),
  ]);

  const totalRevenue = revenueData[0]?.totalRevenue || 0;

  // Monthly revenue for chart (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyRevenue = await Order.aggregate([
    { $match: { orderStatus: { $ne: 'Cancelled' }, createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  // Order status distribution
  const orderStatusData = await Order.aggregate([
    { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
  ]);

  // Category-wise sales
  const categorySales = await Order.aggregate([
    { $unwind: '$orderItems' },
    { $lookup: { from: 'products', localField: 'orderItems.product', foreignField: '_id', as: 'productInfo' } },
    { $unwind: '$productInfo' },
    { $lookup: { from: 'categories', localField: 'productInfo.category', foreignField: '_id', as: 'catInfo' } },
    { $unwind: '$catInfo' },
    { $group: { _id: '$catInfo.name', sales: { $sum: '$orderItems.quantity' }, revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } } } },
    { $sort: { revenue: -1 } },
    { $limit: 6 },
  ]);

  // Recent orders
  const recentOrders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(5);

  // Top products
  const topProducts = await Product.find().sort({ sold: -1 }).limit(5).select('name sold price images');

  res.json({
    success: true,
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
    monthlyRevenue,
    orderStatusData,
    categorySales,
    recentOrders,
    topProducts,
  });
});

// @desc   Get all orders (Admin)
// @route  GET /api/admin/orders
exports.getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const query = status ? { orderStatus: status } : {};
  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    Order.find(query).populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Order.countDocuments(query),
  ]);
  res.json({ success: true, orders, total, pages: Math.ceil(total / limit) });
});

// @desc   Update order status (Admin)
// @route  PUT /api/admin/orders/:id
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      orderStatus: req.body.status,
      ...(req.body.status === 'Delivered' && { deliveredAt: Date.now() }),
      ...(req.body.trackingNumber && { trackingNumber: req.body.trackingNumber }),
    },
    { new: true }
  );
  if (!order) { res.status(404); throw new Error('Order not found'); }
  res.json({ success: true, order });
});

// @desc   Get all users (Admin)
// @route  GET /api/admin/users
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ success: true, users });
});

// @desc   Toggle user admin role
// @route  PUT /api/admin/users/:id/role
exports.toggleUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  user.role = user.role === 'admin' ? 'user' : 'admin';
  await user.save();
  res.json({ success: true, user });
});
