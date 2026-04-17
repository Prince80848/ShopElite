import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiShoppingBag } from 'react-icons/fi';

export default function Footer() {
  const links = {
    Shop: [
      { to: '/shop', label: 'All Products' },
      { to: '/shop?category=electronics', label: 'Electronics' },
      { to: '/shop?category=fashion', label: 'Fashion' },
      { to: '/shop?sort=popular', label: 'Best Sellers' },
    ],
    Account: [
      { to: '/login', label: 'Login' },
      { to: '/register', label: 'Register' },
      { to: '/orders', label: 'My Orders' },
      { to: '/wishlist', label: 'Wishlist' },
    ],
    Company: [
      { to: '/', label: 'About Us' },
      { to: '/', label: 'Blog' },
      { to: '/', label: 'Careers' },
      { to: '/', label: 'Contact' },
    ],
  };

  return (
    <footer className="mt-24 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                <FiShoppingBag className="text-white" size={18} />
              </div>
              <span className="font-bold text-2xl text-slate-900 font-bold">ShopElite</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Your premium destination for the latest electronics, fashion, and lifestyle products. Quality you can trust, prices you'll love.
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { icon: FiGithub, href: '#' },
                { icon: FiLinkedin, href: '#' },
                { icon: FiTwitter, href: '#' },
                { icon: FiMail, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href}
                  className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-indigo-500/20 border border-slate-200 hover:border-indigo-500/50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h3 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wider">{title}</h3>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className="text-sm text-slate-400 hover:text-slate-900 transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">© 2024 ShopElite. Built with MERN Stack.</p>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
