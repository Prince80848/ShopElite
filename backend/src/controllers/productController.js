const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Review = require('../models/Review');

// @desc   Get all products (with filters, search, pagination)
// @route  GET /api/products
exports.getProducts = asyncHandler(async (req, res) => {
  const { keyword, category, minPrice, maxPrice, rating, sort, page = 1, limit = 12 } = req.query;

  const query = {};
  if (keyword) query.$text = { $search: keyword };
  if (category) {
    if (mongoose.Types.ObjectId.isValid(category)) {
      query.category = category;
    } else {
      const cat = await Category.findOne({ slug: category });
      query.category = cat ? cat._id : null;
    }
  }
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice && !isNaN(minPrice)) query.price.$gte = Number(minPrice);
    if (maxPrice && !isNaN(maxPrice)) query.price.$lte = Number(maxPrice);
  }
  if (rating) query.ratings = { $gte: Number(rating) };

  const sortOptions = {
    newest: { createdAt: -1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    rating: { ratings: -1 },
    popular: { sold: -1 },
  };

  const sortBy = sortOptions[sort] || { createdAt: -1 };
  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find(query).populate('category', 'name slug').sort(sortBy).skip(skip).limit(Number(limit)),
    Product.countDocuments(query),
  ]);

  res.json({
    success: true,
    products,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    total,
  });
});

// @desc   Get single product
// @route  GET /api/products/:id
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug');
  if (!product) { res.status(404); throw new Error('Product not found'); }

  const reviews = await Review.find({ product: product._id })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });

  res.json({ success: true, product, reviews });
});

// @desc   Get featured products
// @route  GET /api/products/featured
exports.getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ featured: true }).populate('category', 'name').limit(8);
  res.json({ success: true, products });
});

// @desc   Create product (Admin)
// @route  POST /api/products
exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

// @desc   Update product (Admin)
// @route  PUT /api/products/:id
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, product });
});

// @desc   Delete product (Admin)
// @route  DELETE /api/products/:id
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted' });
});

// @desc   Add/update review
// @route  POST /api/products/:id/reviews
exports.addReview = asyncHandler(async (req, res) => {
  const { rating, title, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }

  const existing = await Review.findOne({ product: product._id, user: req.user._id });
  if (existing) {
    existing.rating = rating;
    existing.title = title;
    existing.comment = comment;
    await existing.save();
  } else {
    await Review.create({ product: product._id, user: req.user._id, rating, title, comment });
  }

  const reviews = await Review.find({ product: product._id });
  product.numReviews = reviews.length;
  product.ratings = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  await product.save();

  res.status(201).json({ success: true, message: 'Review submitted' });
});
