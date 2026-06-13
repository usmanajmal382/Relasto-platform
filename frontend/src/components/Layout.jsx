import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, LogOut, UserPlus, LogIn, Compass, Home as HomeIcon, Users, Bell } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import NotificationBell from './NotificationBell';
import ChatBot from './ChatBot';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isAuthenticated = !!localStorage.getItem('access');

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const isAgentProfile = location.pathname.match(/^\/agents\/\d+$/);

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-brand-primary/20">
      <Toaster position="top-right" reverseOrder={false} />
      {!isAgentProfile && (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-4' : 'py-6'}`}>
          <nav className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 ${scrolled ? 'glass-dark rounded-[32px] shadow-2xl mx-4 md:mx-auto' : 'bg-transparent'}`}>
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center space-x-12">
              <Link to="/" className="text-2xl md:text-3xl font-black tracking-tighter flex items-center gap-3 z-50 group">
                <div className="w-10 h-10 rounded-2xl bg-brand-primary text-white flex items-center justify-center text-2xl shadow-brand group-hover:rotate-12 transition-transform duration-500">
                  R
                </div>
                <span className={`${scrolled ? 'text-white' : 'text-brand-secondary'} transition-colors duration-500`}>Relasto</span>
              </Link>
              
              <div className="hidden md:flex space-x-10">
                {[
                  { name: 'HOME', path: '/', icon: HomeIcon },
                  { name: 'PROPERTIES', path: '/properties', icon: Compass },
                  { name: 'AGENTS', path: '/agents', icon: Users },
                ].map((item) => (
                  <Link 
                    key={item.name}
                    to={item.path} 
                    className={`group flex items-center text-[11px] font-black tracking-[0.2em] transition-all ${scrolled ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-brand-primary'}`}
                  >
                    <item.icon className={`w-3.5 h-3.5 mr-2 opacity-0 group-hover:opacity-100 transition-opacity ${scrolled ? 'text-brand-primary' : 'text-brand-primary'}`} />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Desktop Auth */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated && <NotificationBell />}
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className={`text-[11px] font-black tracking-widest px-6 py-2.5 rounded-2xl transition-all flex items-center gap-2 ${scrolled ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20'}`}>
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    DASHBOARD
                  </Link>
                  <button onClick={handleLogout} className="group p-2.5 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className={`text-[11px] font-black tracking-widest px-6 py-2.5 transition-all ${scrolled ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-brand-primary'}`}>
                    LOG IN
                  </Link>
                  <Link to="/register" className="text-[11px] font-black tracking-widest bg-brand-primary text-white px-8 py-3 rounded-2xl hover:bg-orange-600 transition-all shadow-brand hover:shadow-brand/40 transform hover:-translate-y-1">
                    SIGN UP
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center gap-4 z-50">
              {isAuthenticated && <NotificationBell />}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-2xl transition-colors ${scrolled ? 'text-white bg-white/10' : 'text-gray-700 bg-gray-100'}`}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-brand-secondary z-40 flex flex-col p-8 pt-32 space-y-8 animate-fade-in">
             {[
                  { name: 'HOME', path: '/' },
                  { name: 'PROPERTIES', path: '/properties' },
                  { name: 'AGENTS', path: '/agents' },
              ].map((item) => (
                <Link key={item.name} to={item.path} className="text-2xl font-black text-white hover:text-brand-primary transition-colors tracking-tighter">
                  {item.name}
                </Link>
              ))}
            <div className="pt-12 border-t border-white/10 flex flex-col space-y-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="w-full bg-brand-primary text-white text-center py-5 rounded-3xl font-black tracking-widest text-sm flex items-center justify-center gap-3">
                    <LayoutDashboard className="w-5 h-5" /> DASHBOARD
                  </Link>
                  <button onClick={handleLogout} className="w-full bg-white/5 text-white text-center py-5 rounded-3xl font-black tracking-widest text-sm flex items-center justify-center gap-3">
                    <LogOut className="w-5 h-5" /> LOG OUT
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="w-full bg-white/5 text-white text-center py-5 rounded-3xl font-black tracking-widest text-sm flex items-center justify-center gap-3">
                    <LogIn className="w-5 h-5" /> LOG IN
                  </Link>
                  <Link to="/register" className="w-full bg-brand-primary text-white text-center py-5 rounded-3xl font-black tracking-widest text-sm flex items-center justify-center gap-3">
                    <UserPlus className="w-5 h-5" /> SIGN UP
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
      )}
      
      <main className="flex-1 bg-brand-bg pt-0">
        {children}
      </main>

      <footer className="bg-brand-secondary text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-20">
            <div className="lg:col-span-2">
              <Link to="/" className="text-4xl font-black text-white tracking-tighter flex items-center gap-3 mb-10 group">
                <div className="w-12 h-12 rounded-[20px] bg-brand-primary text-white flex items-center justify-center text-3xl shadow-brand">R</div>
                Relasto
              </Link>
              <p className="text-gray-400 text-xl max-w-md leading-relaxed font-light italic">
                "Redefining the way you discover, experience, and own premium real estate with state-of-the-art technology."
              </p>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-brand-primary mb-10">Explore</h4>
              <ul className="space-y-6 text-lg font-medium">
                <li><Link to="/properties" className="text-gray-400 hover:text-white transition-colors">The Collection</Link></li>
                <li><Link to="/agents" className="text-gray-400 hover:text-white transition-colors">Elite Network</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Direct Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-brand-primary mb-10">Relasto HQ</h4>
              <p className="text-gray-400 text-lg leading-relaxed font-light mb-8">
                101 Luxury Avenue, Silicon Suite<br />New York, NY 10001
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-brand-primary transition-colors cursor-pointer"></div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-brand-primary transition-colors cursor-pointer"></div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-brand-primary transition-colors cursor-pointer"></div>
              </div>
            </div>
          </div>
          <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-gray-500 font-bold tracking-widest text-[10px] uppercase italic">
              &copy; {new Date().getFullYear()} RELASTO PLATFORM. ELEVATING EXPERIENCES.
            </p>
            <div className="flex gap-10 text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">
               <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
      {isAuthenticated && <ChatBot />}
    </div>
  );
}
