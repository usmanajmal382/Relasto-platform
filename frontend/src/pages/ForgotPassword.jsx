import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ShieldCheck, CheckCircle, Info } from 'lucide-react';
import api from '../api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await api.post('accounts/password-reset/', { email });
      setStatus('success');
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.error || 'Failed to send reset link. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex relative overflow-hidden">
      {/* Visual Side (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-brand-secondary overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80" 
            className="w-full h-full object-cover opacity-40 scale-110 animate-fade-in"
            alt="Secure Real Estate"
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
              Secure <br /><span className="text-brand-primary italic">Recovery.</span>
            </h2>
            <p className="text-gray-400 text-xl font-medium leading-relaxed max-w-md">
              We take your security seriously. Follow the steps to regain access to your elite property portfolio.
            </p>
          </div>
          
          <p className="text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">© Relasto Platform | Established 2026</p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-12 relative z-10">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-12 animate-slide-up">
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">Reset Access</h1>
            <p className="text-xl text-gray-400 font-medium italic">Enter your email to receive a secure reset link.</p>
          </div>

          {status === 'success' ? (
            <div className="bg-white p-10 rounded-[40px] shadow-premium border border-green-100 text-center animate-scale-in">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/30">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">Email Sent!</h3>
              <p className="text-gray-500 font-medium leading-relaxed mb-10">
                If an account exists with that email, we've sent a secure reset link. Please check your inbox.
              </p>
              <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 mb-8 flex items-start gap-3 text-left">
                <Info className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                <p className="text-xs text-brand-primary font-bold">
                  LOCAL DEV: Since this is a test project, check the backend terminal/console to see the actual reset link!
                </p>
              </div>
              <Link to="/login" className="block w-full bg-brand-secondary text-white font-black py-5 rounded-2xl hover:bg-slate-800 transition shadow-lg">
                BACK TO LOGIN
              </Link>
            </div>
          ) : (
            <>
              {status === 'error' && (
                <div className="mb-8 p-4 bg-red-50 text-red-600 font-bold text-sm rounded-2xl border border-red-100 flex items-center gap-3 animate-scale-in">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  {errorMessage}
                </div>
              )}

              <form className="space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }} onSubmit={handleSubmit}>
                <div className="group">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 transition-colors group-focus-within:text-brand-primary">Registered Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-300 group-focus-within:text-brand-primary transition-colors" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="luxury@relasto.com"
                      className="block w-full pl-14 pr-5 py-5 bg-gray-50 border border-gray-100 rounded-3xl text-gray-900 font-semibold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all text-lg shadow-sm"
                    />
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-6">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="group w-full flex justify-center items-center py-6 px-10 bg-brand-primary text-white font-black rounded-3xl shadow-brand hover:shadow-brand/40 transform hover:-translate-y-1 transition-all disabled:opacity-50 text-lg tracking-widest"
                  >
                    {status === 'loading' ? 'SENDING LINK...' : 'SEND RESET LINK'}
                    <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </button>
                  
                  <div className="flex items-center gap-3 justify-center text-gray-400 font-semibold italic">
                    <ShieldCheck className="w-4 h-4 text-brand-primary" />
                    Automated security protocol
                  </div>
                </div>
              </form>

              <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <p className="text-gray-500 font-medium">
                  Remembered your credentials?{' '}
                  <Link to="/login" className="text-brand-primary font-black hover:underline underline-offset-8 transition-all">
                    LOG IN
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
