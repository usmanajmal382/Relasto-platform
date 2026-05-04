import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAuthenticated = !!localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <Link to="/" className="text-2xl md:text-3xl font-extrabold text-brand-primary tracking-tighter flex items-center gap-2 z-50">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-orange-400 text-white flex items-center justify-center text-xl">R</span>
              Relasto
            </Link>
            <div className="hidden md:flex space-x-8 text-sm font-semibold tracking-wide">
              <Link to="/" className="text-slate-600 hover:text-brand-primary transition">HOME</Link>
              <Link to="/properties" className="text-slate-600 hover:text-brand-primary transition">PROPERTIES</Link>
              <Link to="/agents" className="text-slate-600 hover:text-brand-primary transition">AGENTS</Link>
            </div>
          </div>
          
          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-base font-medium text-gray-700 hover:text-brand-primary transition">Dashboard</Link>
                <button onClick={handleLogout} className="text-base font-semibold bg-gray-100 text-gray-700 px-6 py-2.5 rounded-full hover:bg-gray-200 transition shadow-sm">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-base font-medium text-gray-700 hover:text-brand-primary transition">Log in</Link>
                <Link to="/register" className="text-base font-semibold bg-brand-primary text-white px-6 py-2.5 rounded-full hover:bg-orange-600 transition shadow-md">
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center z-50">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-brand-primary focus:outline-none p-2"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white shadow-xl border-t border-gray-100 flex flex-col px-6 py-8 space-y-6 animate-fade-in z-40 h-[calc(100vh-80px)] overflow-y-auto">
            <Link to="/" className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">HOME</Link>
            <Link to="/properties" className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">PROPERTIES</Link>
            <Link to="/agents" className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">AGENTS</Link>
            
            <div className="pt-4 flex flex-col space-y-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-center text-lg font-bold bg-brand-primary/10 text-brand-primary px-6 py-3 rounded-xl">Dashboard</Link>
                  <button onClick={handleLogout} className="text-center text-lg font-bold bg-gray-100 text-gray-700 px-6 py-3 rounded-xl">
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-center text-lg font-bold bg-gray-100 text-gray-700 px-6 py-3 rounded-xl">Log in</Link>
                  <Link to="/register" className="text-center text-lg font-bold bg-brand-primary text-white px-6 py-3 rounded-xl">Sign up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
      
      <main className="flex-1 bg-brand-bg">
        {children}
      </main>

      <footer className="bg-[#111] text-white py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-brand-primary mb-6 flex justify-center md:justify-start items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-orange-400 text-white flex items-center justify-center text-xl">R</span>
              Relasto
            </h3>
            <p className="text-gray-400 text-base max-w-sm leading-relaxed mx-auto md:mx-0">
              Your premium real estate platform for discovering the best properties and top-rated agents in the market.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">Discover</h4>
            <ul className="space-y-4 text-base text-gray-400">
              <li><Link to="/properties" className="hover:text-white transition">Buy a Property</Link></li>
              <li><Link to="/properties?status=rent" className="hover:text-white transition">Rent a Property</Link></li>
              <li><Link to="/agents" className="hover:text-white transition">Find an Agent</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">Company</h4>
            <ul className="space-y-4 text-base text-gray-400">
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Relasto Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
