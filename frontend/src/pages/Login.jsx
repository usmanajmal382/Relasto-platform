import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import api from '../api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('token/', {
        username,
        password
      });

      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user', JSON.stringify({ username }));

      window.location.href = from;
      
    } catch (err) {
      console.error(err);
      setError('Invalid username or password. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex relative overflow-hidden">
      {/* Visual Side (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-brand-secondary overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" 
            className="w-full h-full object-cover opacity-50 scale-110 animate-fade-in"
            alt="Luxury Interior"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary via-brand-secondary/60 to-brand-primary/20"></div>
        </div>
        
        <div className="relative z-10 w-full p-20 flex flex-col justify-between">
          <Link to="/" className="text-3xl font-black text-white flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-brand-primary text-white flex items-center justify-center text-2xl shadow-brand">R</div>
             Relasto
          </Link>
          
          <div className="animate-slide-up">
            <h2 className="text-4xl lg:text-6xl font-black text-white leading-none mb-8 tracking-tighter">
              The keys to your <br /><span className="text-brand-primary italic">Legacy.</span>
            </h2>
            <div className="space-y-6">
              {[
                "Exclusive High-End Listings",
                "World-Class Agent Network",
                "Seamless Property Management"
              ].map((item, i) => (
                <div key={i} className="flex items-center text-gray-300 gap-4 font-medium text-lg">
                  <div className="w-6 h-6 bg-brand-primary/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-brand-primary" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
          
          <p className="text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">© Relasto Platform | Established 2026</p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 pt-32 pb-12 lg:py-12 relative z-10">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-12 animate-slide-up">
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">Welcome back</h1>
            <p className="text-xl text-gray-400 font-medium italic">Enter your credentials to access your portal.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 text-red-600 font-bold text-sm rounded-2xl border border-red-100 flex items-center gap-3 animate-scale-in">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
              {error}
            </div>
          )}

          <form className="space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }} onSubmit={handleLogin}>
            <div className="group">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 transition-colors group-focus-within:text-brand-primary">Username</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-300 group-focus-within:text-brand-primary transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="agent_luxury"
                  className="block w-full pl-14 pr-5 py-5 bg-gray-50 border border-gray-100 rounded-3xl text-gray-900 font-semibold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all text-lg shadow-sm"
                />
              </div>
            </div>

            <div className="group">
              <div className="flex justify-between items-center mb-3 transition-colors group-focus-within:text-brand-primary">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Password</label>
                <Link to="/forgot-password" title="Recover your account" className="text-[10px] font-black text-brand-primary hover:text-orange-600 uppercase tracking-widest transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-300 group-focus-within:text-brand-primary transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-14 pr-5 py-5 bg-gray-50 border border-gray-100 rounded-3xl text-gray-900 font-semibold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all text-lg shadow-sm"
                />
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-6">
              <button
                type="submit"
                disabled={loading}
                className="group w-full flex justify-center items-center py-6 px-10 bg-brand-primary text-white font-black rounded-3xl shadow-brand hover:shadow-brand/40 transform hover:-translate-y-1 transition-all disabled:opacity-50 text-lg tracking-widest"
              >
                {loading ? 'AUTHENTICATING...' : 'SIGN IN NOW'}
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
              
              <div className="flex items-center gap-3 justify-center text-gray-400 font-semibold italic">
                <ShieldCheck className="w-4 h-4 text-brand-primary" />
                Secure encrypted authentication
              </div>
            </div>
          </form>

          <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <p className="text-gray-500 font-medium">
              Don't have an elite account yet?{' '}
              <Link to="/register" className="text-brand-primary font-black hover:underline underline-offset-8 transition-all">
                JOIN THE NETWORK
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
