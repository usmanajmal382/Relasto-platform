import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle, Briefcase, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    is_agent: false
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('accounts/register/', formData);

      toast.success('Registration successful! Please sign in.');
      navigate('/login');
      
    } catch (err) {
      console.error(err);
      if (err.response?.data) {
        const firstErrorKey = Object.keys(err.response.data)[0];
        setError(`${firstErrorKey}: ${err.response.data[firstErrorKey]}`);
      } else {
        setError('Registration failed. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex relative overflow-hidden">
      {/* Visual Side (Desktop) */}
      <div className="hidden lg:flex lg:w-1/3 relative bg-brand-secondary overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80" 
            className="w-full h-full object-cover opacity-40 scale-110 animate-fade-in"
            alt="Elite Real Estate"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary via-brand-secondary/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full p-16 flex flex-col justify-between">
          <Link to="/" className="text-3xl font-black text-white flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-brand-primary text-white flex items-center justify-center text-2xl shadow-brand">R</div>
             Relasto
          </Link>
          
          <div className="animate-slide-up">
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-8 tracking-tighter">
              Join the <br /><span className="text-brand-primary italic">Elite Network.</span>
            </h2>
            <p className="text-gray-400 text-lg font-medium leading-relaxed">
              Become part of a global community dedicated to excellence in premium real estate.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-gray-500 font-bold text-[10px] uppercase tracking-widest">
            <span>Discover</span>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <span>Connect</span>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <span>Own</span>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-2/3 flex flex-col justify-center px-8 sm:px-12 lg:px-24 pt-32 pb-12 lg:py-24 relative z-10 overflow-y-auto">
        <div className="max-w-2xl w-full mx-auto">
          <div className="mb-12 animate-slide-up">
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">Create Account</h1>
            <p className="text-xl text-gray-400 font-medium italic">Start your journey with Relasto today.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 text-red-600 font-bold text-sm rounded-2xl border border-red-100 flex items-center gap-3 animate-scale-in">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              {error}
            </div>
          )}

          <form className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up" style={{ animationDelay: '0.1s' }} onSubmit={handleRegister}>
            
            <div className="group">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 transition-colors group-focus-within:text-brand-primary">Username</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-300 group-focus-within:text-brand-primary transition-colors" />
                </div>
                <input
                  type="text" name="username" required value={formData.username} onChange={handleChange}
                  placeholder="luxury_agent"
                  className="block w-full pl-14 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 font-semibold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 transition-colors group-focus-within:text-brand-primary">Email</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-300 group-focus-within:text-brand-primary transition-colors" />
                </div>
                <input
                  type="email" name="email" required value={formData.email} onChange={handleChange}
                  placeholder="contact@example.com"
                  className="block w-full pl-14 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 font-semibold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 transition-colors group-focus-within:text-brand-primary">First Name</label>
              <input
                type="text" name="first_name" required value={formData.first_name} onChange={handleChange}
                placeholder="John"
                className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 font-semibold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all shadow-sm"
              />
            </div>

            <div className="group">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 transition-colors group-focus-within:text-brand-primary">Last Name</label>
              <input
                type="text" name="last_name" required value={formData.last_name} onChange={handleChange}
                placeholder="Doe"
                className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 font-semibold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all shadow-sm"
              />
            </div>

            <div className="group md:col-span-2">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 transition-colors group-focus-within:text-brand-primary">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-300 group-focus-within:text-brand-primary transition-colors" />
                </div>
                <input
                  type="password" name="password" required value={formData.password} onChange={handleChange} minLength={8}
                  placeholder="••••••••"
                  className="block w-full pl-14 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 font-semibold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <div className={`relative overflow-hidden p-6 rounded-3xl border-2 transition-all cursor-pointer ${formData.is_agent ? 'border-brand-primary bg-orange-50/50 shadow-md' : 'border-gray-100 bg-gray-50'}`}
                   onClick={() => setFormData({...formData, is_agent: !formData.is_agent})}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${formData.is_agent ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-black text-gray-900 uppercase tracking-widest text-xs">Real Estate Agent</p>
                      <p className="text-sm text-gray-400 font-medium">I want to list and manage properties</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.is_agent ? 'bg-brand-primary border-brand-primary' : 'border-gray-300'}`}>
                    {formData.is_agent && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                </div>
                <input type="checkbox" name="is_agent" className="hidden" checked={formData.is_agent} onChange={handleChange} />
              </div>
            </div>

            <div className="md:col-span-2 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="group w-full flex justify-center items-center py-6 px-10 bg-brand-primary text-white font-black rounded-3xl shadow-brand hover:shadow-brand/40 transform hover:-translate-y-1 transition-all disabled:opacity-50 text-lg tracking-widest"
              >
                {loading ? 'CREATING PROFILE...' : 'COMPLETE REGISTRATION'}
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </form>

          <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <p className="text-gray-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-primary font-black hover:underline underline-offset-8 transition-all">
                SIGN IN INSTEAD
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
