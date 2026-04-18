require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const categoryImages = {
  electronics: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
  fashion: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600",
  'home-living': "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600",
  sports: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600",
  beauty: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600",
  books: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600",
  automotive: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600",
  toys: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600"
};

const categories = [
  { name: 'Electronics', slug: 'electronics', description: 'Latest gadgets', featured: true, image: categoryImages['electronics'] },
  { name: 'Fashion', slug: 'fashion', description: 'Trending clothing', featured: true, image: categoryImages['fashion'] },
  { name: 'Home & Living', slug: 'home-living', description: 'Home essentials', featured: true, image: categoryImages['home-living'] },
  { name: 'Sports', slug: 'sports', description: 'Sporting goods', featured: false, image: categoryImages['sports'] },
  { name: 'Beauty', slug: 'beauty', description: 'Skincare products', featured: true, image: categoryImages['beauty'] },
  { name: 'Books', slug: 'books', description: 'Books & knowledge', featured: false, image: categoryImages['books'] },
  { name: 'Automotive', slug: 'automotive', description: 'Car accessories', featured: false, image: categoryImages['automotive'] },
  { name: 'Toys', slug: 'toys', description: 'Toys and games', featured: false, image: categoryImages['toys'] },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@shopelite.com',
      password: 'Admin@123',
      role: 'admin',
      isVerified: true,
    });
    await User.create({
      name: 'Test User',
      email: 'user@shopelite.com',
      password: 'User@123',
      role: 'user',
      isVerified: true,
    });
    console.log('✅ Users created');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log('✅ Categories created');

    const catMap = {};
    createdCategories.forEach(c => { catMap[c.slug] = c._id; });

    // Diverse products list with unique, accurate images for each product
    const products = [
      { name: 'Apple iPhone 15 Pro', description: 'Latest Apple flagship with titanium design and A17 Pro chip.', price: 129999, discountPrice: 119999, category: catMap['electronics'], brand: 'Apple', stock: 50, featured: true, ratings: 4.8, numReviews: 234, sold: 180, images: [{ url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600', public_id: 'img1' }], tags: ['smartphone', 'apple'] },
      { name: 'Samsung Galaxy S24 Ultra', description: 'Powerful Samsung flagship with 200MP camera and S Pen.', price: 109999, discountPrice: 99999, category: catMap['electronics'], brand: 'Samsung', stock: 40, featured: true, ratings: 4.7, numReviews: 189, sold: 145, images: [{ url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600', public_id: 'img2' }], tags: ['smartphone', 'samsung'] },
      { name: 'Sony WH-1000XM5 Headphones', description: 'Industry-leading noise cancellation with exceptional sound quality.', price: 29990, discountPrice: 24990, category: catMap['electronics'], brand: 'Sony', stock: 75, featured: true, ratings: 4.9, numReviews: 412, sold: 320, images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', public_id: 'img3' }], tags: ['headphones', 'audio'] },
      { name: 'MacBook Pro 14" M3', description: 'Apple MacBook Pro with M3 chip, stunning Liquid Retina XDR display.', price: 199900, discountPrice: 189900, category: catMap['electronics'], brand: 'Apple', stock: 30, featured: true, ratings: 4.9, numReviews: 156, sold: 89, images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', public_id: 'img4' }], tags: ['laptop', 'apple'] },
      { name: 'Premium Cotton T-Shirt', description: 'Ultra-soft 100% organic cotton t-shirt in multiple colors.', price: 999, discountPrice: 799, category: catMap['fashion'], brand: 'EcoWear', stock: 200, featured: false, ratings: 4.3, numReviews: 89, sold: 450, images: [{ url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600', public_id: 'img5' }], tags: ['clothing', 'cotton'] },
      { name: 'Luxury Leather Handbag', description: 'Genuine leather handbag with multiple compartments and gold hardware.', price: 14999, discountPrice: 11999, category: catMap['fashion'], brand: 'LuxBag', stock: 25, featured: true, ratings: 4.6, numReviews: 67, sold: 120, images: [{ url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600', public_id: 'img6' }], tags: ['bags', 'leather'] },
      { name: 'Waterproof Winter Jacket', description: 'High-performance waterproof jacket for extreme weather conditions.', price: 5999, discountPrice: 4499, category: catMap['fashion'], brand: 'TrekPro', stock: 60, featured: true, ratings: 4.5, numReviews: 145, sold: 320, images: [{ url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600', public_id: 'img7' }], tags: ['clothing', 'winter'] },
      { name: 'Minimalist Wall Clock', description: 'Nordic design silent sweep wall clock, perfect for any interior.', price: 2499, discountPrice: 1999, category: catMap['home-living'], brand: 'NordicHome', stock: 60, featured: false, ratings: 4.5, numReviews: 43, sold: 210, images: [{ url: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600', public_id: 'img8' }], tags: ['home', 'decor'] },
      { name: 'Scented Soy Candle Set', description: 'Set of 4 handcrafted soy wax candles with calming essential oils.', price: 1599, discountPrice: 1199, category: catMap['home-living'], brand: 'CandleCo', stock: 90, featured: false, ratings: 4.7, numReviews: 178, sold: 430, images: [{ url: 'https://images.unsplash.com/photo-1603006905593-68d2f7035fce?w=600', public_id: 'img9' }], tags: ['home', 'wellness'] },
      { name: 'Ergonomic Office Chair', description: 'Premium ergonomic chair with lumbar support and breathable mesh.', price: 15000, discountPrice: 12500, category: catMap['home-living'], brand: 'ErgoDesign', stock: 45, featured: true, ratings: 4.8, numReviews: 256, sold: 580, images: [{ url: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=600', public_id: 'img10' }], tags: ['furniture', 'office'] },
      { name: 'Yoga Mat Pro', description: 'Non-slip professional yoga mat with alignment lines and carry strap.', price: 3499, discountPrice: 2799, category: catMap['sports'], brand: 'FitLife', stock: 100, featured: false, ratings: 4.7, numReviews: 234, sold: 670, images: [{ url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600', public_id: 'img11' }], tags: ['fitness', 'yoga'] },
      { name: 'Adjustable Dumbbell Set', description: 'Space-saving adjustable dumbbells ranging from 5 to 52.5 lbs.', price: 18999, discountPrice: 15999, category: catMap['sports'], brand: 'IronGrip', stock: 35, featured: true, ratings: 4.8, numReviews: 452, sold: 890, images: [{ url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600', public_id: 'img12' }], tags: ['fitness', 'weights'] },
      { name: 'Vitamin C Brightening Serum', description: '20% Vitamin C serum for glowing, even-toned skin. Dermatologist tested.', price: 1299, discountPrice: 999, category: catMap['beauty'], brand: 'GlowLab', stock: 150, featured: true, ratings: 4.8, numReviews: 567, sold: 1200, images: [{ url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600', public_id: 'img13' }], tags: ['skincare', 'serum'] },
      { name: 'Hydrating Facial Cleanser', description: 'Gentle, non-foaming cleanser for all skin types, with hyaluronic acid.', price: 899, discountPrice: 799, category: catMap['beauty'], brand: 'DermaPure', stock: 200, featured: false, ratings: 4.6, numReviews: 312, sold: 850, images: [{ url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600', public_id: 'img14' }], tags: ['skincare', 'face'] },
      { name: 'Atomic Habits - James Clear', description: 'The #1 bestselling book on building good habits and breaking bad ones.', price: 599, discountPrice: 449, category: catMap['books'], brand: 'Penguin', stock: 300, featured: false, ratings: 4.9, numReviews: 1234, sold: 3400, images: [{ url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600', public_id: 'img15' }], tags: ['self-help', 'habits'] },
      { name: 'The Psychology of Money', description: 'Timeless lessons on wealth, greed, and happiness.', price: 499, discountPrice: 399, category: catMap['books'], brand: 'Harriman', stock: 250, featured: true, ratings: 4.8, numReviews: 980, sold: 2800, images: [{ url: 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=600', public_id: 'img16' }], tags: ['finance', 'wealth'] },
      { name: 'Wireless Gaming Mouse', description: 'Ultra-lightweight wireless gaming mouse with 70hr battery and RGB.', price: 6999, discountPrice: 5499, category: catMap['electronics'], brand: 'Logitech', stock: 80, featured: true, ratings: 4.6, numReviews: 312, sold: 560, images: [{ url: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600', public_id: 'img17' }], tags: ['gaming', 'peripheral'] },
      { name: 'Mechanical Keyboard (Red Switches)', description: 'Compact 75% layout mechanical keyboard with hot-swappable red switches.', price: 8999, discountPrice: 7499, category: catMap['electronics'], brand: 'KeyChron', stock: 65, featured: false, ratings: 4.7, numReviews: 215, sold: 410, images: [{ url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600', public_id: 'img18' }], tags: ['gaming', 'keyboard'] },
      { name: 'Car Vacuum Cleaner', description: 'Portable high-power car vacuum cleaner with multiple attachments.', price: 1999, discountPrice: 1499, category: catMap['automotive'], brand: 'AutoClean', stock: 120, featured: false, ratings: 4.4, numReviews: 89, sold: 320, images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', public_id: 'img19' }], tags: ['car', 'cleaning'] },
      { name: 'Microfiber Towel Set (6 Pack)', description: 'Premium scratch-free microfiber cleaning towels for detailing.', price: 599, discountPrice: 499, category: catMap['automotive'], brand: 'DetailPro', stock: 300, featured: true, ratings: 4.8, numReviews: 540, sold: 1500, images: [{ url: 'https://images.unsplash.com/photo-1611006173086-9d2b1af5e1c3?w=600', public_id: 'img20' }], tags: ['car', 'detailing'] },
      { name: 'LEGO Star Wars Millennium Falcon', description: 'Ultimate collector series building set with intricate details.', price: 14999, discountPrice: 13500, category: catMap['toys'], brand: 'LEGO', stock: 15, featured: true, ratings: 4.9, numReviews: 128, sold: 90, images: [{ url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600', public_id: 'img21' }], tags: ['lego', 'star wars'] },
      { name: 'Remote Control Drift Car', description: 'High-speed 1:16 scale 4WD remote control drift car.', price: 2999, discountPrice: 2499, category: catMap['toys'], brand: 'SpeedRc', stock: 85, featured: false, ratings: 4.5, numReviews: 167, sold: 420, images: [{ url: 'https://images.unsplash.com/photo-1568219656418-15c329312bf1?w=600', public_id: 'img22' }], tags: ['rc', 'toys'] },
    ];

    await Product.insertMany(products);
    console.log(`✅ ${products.length} Products created`);
    console.log('\n=== SEED COMPLETE ===');
    console.log('Admin: admin@shopelite.com / Admin@123');
    console.log('User:  user@shopelite.com / User@123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();
