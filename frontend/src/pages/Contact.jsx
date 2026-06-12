import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-brand-bg pt-40 pb-24 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100/30 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/4"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-20 animate-slide-up">
           <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            <MessageSquare className="w-3 h-3 mr-2" />
            Direct Communication
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-brand-secondary mb-8 tracking-tighter leading-none">
            Get in <span className="text-brand-primary italic">Touch</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed italic">
            Whether you're looking for your next architectural masterpiece or seeking professional advisory, our concierge team is ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Contact Cards - Redesigned */}
          <div className="lg:col-span-1 space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {[
                { icon: MapPin, title: 'Global HQ', content: '101 Luxury Avenue, New York, NY 10001', label: 'LOCATE US' },
                { icon: Phone, title: 'Direct Line', content: '+1 (555) 888-0001', label: 'CALL NOW' },
                { icon: Mail, title: 'Inquiries', content: 'concierge@relasto.com', label: 'EMAIL US' }
            ].map((item, i) => (
                <div key={i} className="bg-white p-10 rounded-[40px] shadow-premium border border-gray-50 group hover:border-brand-primary/30 transition-all duration-500 transform hover:-translate-y-2">
                    <div className="w-16 h-16 bg-brand-secondary rounded-2xl flex items-center justify-center text-white mb-8 group-hover:bg-brand-primary transition-colors shadow-xl group-hover:rotate-6">
                        <item.icon size={28} />
                    </div>
                    <span className="text-[10px] font-black text-brand-primary tracking-[0.3em] uppercase mb-2 block">{item.label}</span>
                    <h3 className="text-2xl font-black text-brand-secondary mb-3 tracking-tight">{item.title}</h3>
                    <p className="text-gray-500 font-medium leading-relaxed italic">{item.content}</p>
                </div>
            ))}
          </div>

          {/* Premium Contact Form */}
          <div className="lg:col-span-2 bg-white p-10 md:p-20 rounded-[50px] shadow-2xl border border-gray-50 animate-slide-up relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-brand-primary to-transparent"></div>
            
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 animate-scale-in">
                <div className="w-28 h-28 bg-green-500 rounded-[40px] flex items-center justify-center text-white shadow-2xl shadow-green-500/30 mb-10 rotate-12">
                  <CheckCircle size={48} />
                </div>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-secondary tracking-tighter mb-4">Message Received.</h3>
                <p className="text-xl text-gray-400 font-medium italic max-w-md mx-auto mb-12 leading-relaxed">
                  Your inquiry has been encrypted and transmitted to our concierge team. Expect a response within the next few hours.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="bg-brand-secondary text-white px-12 py-5 rounded-2xl font-black tracking-widest text-xs uppercase hover:bg-slate-800 transition shadow-lg"
                >
                  NEW TRANSMISSION
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="group">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 transition-colors group-focus-within:text-brand-primary">Identity Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-8 py-5 bg-gray-50 border border-gray-50 rounded-3xl text-brand-secondary font-semibold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all text-lg"
                      placeholder="Johnathan Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 transition-colors group-focus-within:text-brand-primary">Secure Email</label>
                    <input 
                      type="email" 
                      required
                      className="w-full px-8 py-5 bg-gray-50 border border-gray-50 rounded-3xl text-brand-secondary font-semibold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all text-lg"
                      placeholder="john@relasto.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 transition-colors group-focus-within:text-brand-primary">Inquiry Narrative</label>
                  <textarea 
                    required
                    rows={8}
                    className="w-full px-8 py-8 bg-gray-50 border border-gray-50 rounded-[40px] text-brand-secondary font-semibold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all text-lg resize-none leading-relaxed"
                    placeholder="Describe your vision or requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-4">
                    <p className="text-gray-400 text-sm font-medium italic max-w-xs">
                        By transmitting this message, you agree to our premium service protocols.
                    </p>
                    <button 
                    type="submit"
                    className="group bg-brand-primary text-white font-black py-6 px-16 rounded-[24px] transition-all shadow-brand hover:shadow-brand/40 transform hover:-translate-y-1 flex items-center justify-center gap-4 tracking-[0.2em] text-xs uppercase"
                    >
                    <span>TRANSMIT NOW</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
              </form>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
