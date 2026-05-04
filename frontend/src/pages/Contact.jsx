import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-brand-bg py-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-text mb-6">Get in Touch</h1>
          <p className="text-xl text-brand-muted font-light">
            Have questions about our platform or need help finding your perfect property? Our team is here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-transform hover:-translate-y-1 duration-300">
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-brand-primary mb-6">
                <MapPin size={28} />
              </div>
              <h3 className="text-xl font-bold text-brand-text mb-2">Our Office</h3>
              <p className="text-brand-muted">123 Real Estate Blvd<br/>Suite 100<br/>San Francisco, CA 94107</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-transform hover:-translate-y-1 duration-300">
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-brand-primary mb-6">
                <Phone size={28} />
              </div>
              <h3 className="text-xl font-bold text-brand-text mb-2">Call Us</h3>
              <p className="text-brand-muted">+1 (555) 123-4567<br/>Mon-Fri, 9am - 6pm PST</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-transform hover:-translate-y-1 duration-300">
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-brand-primary mb-6">
                <Mail size={28} />
              </div>
              <h3 className="text-xl font-bold text-brand-text mb-2">Email Us</h3>
              <p className="text-brand-muted">support@relasto.com<br/>sales@relasto.com</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white p-10 md:p-14 rounded-3xl shadow-xl border border-gray-100 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-10">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500">
                  <Send size={40} />
                </div>
                <h3 className="text-3xl font-bold text-brand-text">Message Sent!</h3>
                <p className="text-brand-muted text-lg max-w-md">
                  Thank you for reaching out. A member of our team will get back to you within 24 hours.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-brand-primary font-semibold hover:text-brand-primary-hover"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-semibold text-brand-text mb-2">Full Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none bg-gray-50 focus:bg-white"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-text mb-2">Email Address</label>
                    <input 
                      type="email" 
                      required
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none bg-gray-50 focus:bg-white"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-2">Message</label>
                  <textarea 
                    required
                    rows={6}
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none bg-gray-50 focus:bg-white resize-none"
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-lg shadow-brand-primary/30 flex items-center justify-center space-x-2"
                >
                  <span>Send Message</span>
                  <Send size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
