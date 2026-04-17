import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiShield, FiTruck, FiRefreshCw, FiHeadphones } from 'react-icons/fi';
import { useGetFeaturedProductsQuery, useGetCategoriesQuery } from '../store/api/productsApi';
import ProductCard from '../components/ProductCard';
import { SkeletonCard } from '../components/Loader';

export default function Home() {
  const { data: featuredData, isLoading: fpLoading } = useGetFeaturedProductsQuery();
  const { data: catData } = useGetCategoriesQuery();

  const features = [
    { icon: FiTruck, title: 'Free Shipping', desc: 'On orders over ₹999' },
    { icon: FiShield, title: 'Secure Payment', desc: 'Razorpay encrypted checkout' },
    { icon: FiRefreshCw, title: 'Easy Returns', desc: '30-day hassle-free returns' },
    { icon: FiHeadphones, title: '24/7 Support', desc: 'Always here for you' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(124,58,237,0.1) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 badge badge-primary mb-6">
                <FiStar size={12} className="fill-purple-400 text-slate-900" />
                #1 Premium E-Commerce Platform
              </div>
              <h1 className="section-title text-5xl md:text-6xl lg:text-7xl mb-6">
                Shop the{' '}
                <span className="text-slate-900 font-bold">Future</span>
                {' '}of Retail
              </h1>
              <p className="text-lg text-slate-400 mb-8 max-w-lg leading-relaxed">
                Discover thousands of premium products from top brands — electronics, fashion, home essentials and more. Unbeatable prices, lightning-fast delivery.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/shop" className="btn-primary text-base px-8 py-3.5">
                  Shop Now <FiArrowRight size={18} />
                </Link>
                <Link to="/shop?featured=true" className="btn-secondary text-base px-8 py-3.5">
                  View Featured
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12">
                {[
                  { value: '10K+', label: 'Products' },
                  { value: '50K+', label: 'Customers' },
                  { value: '99%', label: 'Satisfaction' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl font-bold text-slate-900 font-bold">{s.value}</div>
                    <div className="text-sm text-slate-400">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative hidden lg:block">
              <div className="relative animate-float">
                <div className="w-80 h-80 mx-auto rounded-3xl bg-indigo-600 text-white opacity-20 absolute inset-0 blur-2xl" />
                <img
                  src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600"
                  alt="Shopping"
                  className="relative w-80 h-80 mx-auto object-cover rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200"
                />
              </div>

              {/* Floating cards */}
              <div className="absolute -left-8 top-16 glass rounded-2xl p-3 shadow-xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center">
                    <FiTruck size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Free Delivery</p>
                    <p className="text-xs text-slate-400">In 2-3 days</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-8 bottom-16 glass rounded-2xl p-3 shadow-xl animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <FiStar size={14} className="text-yellow-400 fill-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">4.9 Rating</p>
                    <p className="text-xs text-slate-400">50K+ reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Row */}
      <section className="py-12 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-purple-500/20 border border-slate-200 flex items-center justify-center transition-colors flex-shrink-0">
                  <Icon className="text-indigo-600" size={18} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{title}</p>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {catData?.categories?.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="badge badge-primary mb-2">Explore</p>
              <h2 className="section-title text-3xl">Shop by Category</h2>
            </div>
            <Link to="/shop" className="btn-secondary text-sm py-2 px-4 hidden md:flex">
              All Categories <FiArrowRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {catData.categories.slice(0, 6).map((cat) => (
              <Link
                key={cat._id}
                to={`/shop?category=${cat._id}`}
                className="group relative overflow-hidden rounded-2xl aspect-square border border-slate-200 card-hover"
              >
                <img
                  src={cat.image || `https://placehold.co/300x300/13131f/7c3aed?text=${cat.name}`}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <p className="font-semibold text-slate-900 text-sm">{cat.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="badge badge-primary mb-2">Curated</p>
            <h2 className="section-title text-3xl">Featured Products</h2>
          </div>
          <Link to="/shop?featured=true" className="btn-secondary text-sm py-2 px-4 hidden md:flex">
            View All <FiArrowRight size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {fpLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : featuredData?.products?.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
        <div className="text-center mt-10">
          <Link to="/shop" className="btn-primary px-10 py-3.5">
            Explore All Products <FiArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Banner CTA */}
      <section className="mx-4 sm:mx-6 lg:mx-auto max-w-7xl mb-16">
        <div className="relative overflow-hidden rounded-3xl bg-indigo-600 text-white p-12 text-center">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }} />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Get 20% Off Your First Order!
            </h2>
            <p className="text-indigo-100 mb-8 text-lg">
              Sign up now and use code <span className="font-bold bg-indigo-500/50 px-2 py-0.5 rounded-lg">WELCOME20</span>
            </p>
            <Link to="/register" className="bg-white text-purple-700 font-bold px-10 py-3.5 rounded-xl hover:bg-purple-50 transition-colors inline-flex items-center gap-2">
              Get Started Free <FiArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
