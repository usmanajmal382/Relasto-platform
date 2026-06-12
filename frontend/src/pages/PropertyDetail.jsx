import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Calendar, CheckCircle2, Share2, Heart, ShieldCheck, Map, Clock, ArrowLeft, Send, MessageCircle, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api';

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  
  // Visit Request Form State
  const [visitDate, setVisitDate] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [visitMessage, setVisitMessage] = useState('');
  const [visitStatus, setVisitStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const isAuthenticated = !!localStorage.getItem('access');

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get(`properties/${id}/`)
      .then(res => {
        setProperty(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching property:", err);
        setLoading(false);
      });
  }, [id]);

  const handleVisitRequest = async (e) => {
    e.preventDefault();
    setVisitStatus('submitting');
    
    try {
      // Ensure date format is ISO compliant for Django
      const formattedDate = visitDate.includes('T') ? visitDate : `${visitDate}T00:00`;
      
      await api.post('interactions/visits/', {
        property_id: id,
        agent_id: property.agent.id,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        preferred_date: formattedDate,
        message: visitMessage
      });
      setVisitStatus('success');
    } catch (err) {
      console.error("Visit Request Error:", err.response?.data);
      setVisitStatus('error');
      // Show specific field errors if available
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const firstError = Object.values(data)[0];
        setErrorMessage(Array.isArray(firstError) ? firstError[0] : firstError || 'Failed to request visit.');
      } else {
        setErrorMessage('Failed to request visit. Please check your connection.');
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Property link copied to clipboard!', {
      style: { borderRadius: '16px', background: '#333', color: '#fff' }
    });
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      toast.success('Saved to your exclusive collection.', { icon: '🤍', style: { borderRadius: '16px', background: '#333', color: '#fff' } });
    } else {
      toast('Removed from collection.', { style: { borderRadius: '16px', background: '#333', color: '#fff' } });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-brand-bg">
        <div className="w-20 h-20 border-4 border-brand-primary/10 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-40">
        <h2 className="text-4xl font-black text-brand-secondary mb-8">Estate Not Found</h2>
        <Link to="/properties" className="bg-brand-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Return to Collection</Link>
      </div>
    );
  }

  const imageUrl = property.images?.length > 0 
    ? property.images[0].image 
    : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80';

  return (
    <div className="bg-brand-bg min-h-screen pb-32">
      {/* Premium Hero Image Section */}
      <div className="w-full h-[70vh] md:h-[85vh] relative overflow-hidden">
        <img src={imageUrl} alt={property.title} className="w-full h-full object-cover animate-fade-in scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary via-brand-secondary/20 to-transparent"></div>
        
        {/* Floating Action Bar */}
        <div className="absolute top-32 left-0 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex justify-between items-center z-10 animate-fade-in">
            <Link to="/properties" className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-2xl border border-white/20 hover:bg-white/20 transition-all font-bold text-sm">
                <ArrowLeft size={18} />
                BACK TO COLLECTION
            </Link>
            <div className="flex gap-4">
                <button onClick={handleSave} className={`p-4 backdrop-blur-md rounded-2xl border transition-all ${isSaved ? 'bg-red-500/20 border-red-500/50 text-red-500' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}>
                    <Heart size={20} className={isSaved ? 'fill-current' : ''} />
                </button>
                <button onClick={handleShare} className="p-4 bg-white/10 backdrop-blur-md text-white rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
                    <Share2 size={20} />
                </button>
            </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-20 max-w-7xl mx-auto z-10 animate-slide-up">
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-brand-primary text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-brand">
              <Sparkles size={14} />
              {property.status === 'sale' ? 'EXCLUSIVELY FOR SALE' : 'EXCLUSIVELY FOR RENT'}
            </div>
            <span className="bg-white/10 backdrop-blur-md text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] border border-white/30">
              {property.property_type}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-8xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl">{property.title}</h1>
          <div className="flex items-center text-white/80 text-xl font-medium italic">
            <MapPin className="w-6 h-6 mr-3 text-brand-primary animate-pulse" />
            {property.address}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* Main Content Redesigned */}
        <div className="lg:col-span-2 space-y-20">
          
          {/* Key Details Grid - Professional Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white p-10 rounded-[40px] shadow-premium border border-gray-50 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-col items-center justify-center border-r border-gray-50">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Market Value</p>
              <p className="text-3xl font-black text-brand-primary tracking-tighter">${parseFloat(property.price).toLocaleString()}</p>
            </div>
            <div className="flex flex-col items-center justify-center border-r border-gray-50">
              <div className="flex items-center gap-2 mb-2">
                 <Bed className="w-5 h-5 text-gray-300" />
                 <p className="text-2xl font-black text-brand-secondary">{property.bedrooms}</p>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bedrooms</p>
            </div>
            <div className="flex flex-col items-center justify-center border-r border-gray-50">
              <div className="flex items-center gap-2 mb-2">
                 <Bath className="w-5 h-5 text-gray-300" />
                 <p className="text-2xl font-black text-brand-secondary">{property.bathrooms}</p>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bathrooms</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 mb-2">
                 <Square className="w-5 h-5 text-gray-300" />
                 <p className="text-2xl font-black text-brand-secondary">{property.sqft.toLocaleString()}</p>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sq Footage</p>
            </div>
          </div>

          {/* Detailed Narrative */}
          <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-4 mb-8">
                <div className="w-1.5 h-10 bg-brand-primary rounded-full"></div>
                <h2 className="text-4xl font-black text-brand-secondary tracking-tighter uppercase text-xs tracking-[0.3em]">Estate Narrative</h2>
            </div>
            <div className="bg-white p-12 rounded-[40px] shadow-premium border border-gray-50 text-gray-500 text-lg leading-relaxed italic font-medium whitespace-pre-line relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
              {property.description}
            </div>
          </section>

          {/* Features Redesigned */}
          {property.features?.length > 0 && (
            <section className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-1.5 h-10 bg-brand-primary rounded-full"></div>
                <h2 className="text-4xl font-black text-brand-secondary tracking-tighter uppercase text-xs tracking-[0.3em]">Amenities & Integrity</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {property.features.map((feature, idx) => (
                  <div key={feature.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50 flex items-center gap-6 hover:shadow-xl transition-all group">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{feature.key}</span>
                      <span className="text-lg font-black text-brand-secondary tracking-tight">{feature.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* Premium Sidebar Redesigned */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 space-y-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            
            {/* Agent Dossier Card */}
            <div className="bg-brand-secondary p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-primary"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl"></div>
              
              <h3 className="text-white text-[10px] font-black uppercase tracking-[0.4em] mb-10 text-center opacity-50">Authorized Advisory</h3>
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-[32px] overflow-hidden border-4 border-white/10 shadow-2xl mb-8 relative">
                  {property.agent?.profile?.profile_picture ? (
                    <img src={property.agent.profile.profile_picture} className="w-full h-full object-cover" alt="Agent" />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center text-4xl font-black text-white/50">
                      {property.agent?.first_name?.charAt(0) || 'A'}
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-primary rounded-2xl flex items-center justify-center shadow-lg">
                    <ShieldCheck className="text-white w-5 h-5" />
                  </div>
                </div>
                <div className="text-center mb-10">
                  <Link to={`/agents/${property.agent?.id}`} className="text-3xl font-black text-white hover:text-brand-primary transition tracking-tighter">
                    {property.agent?.first_name} {property.agent?.last_name}
                  </Link>
                  <p className="text-gray-400 font-medium italic mt-2">Executive Real Estate Partner</p>
                </div>
                <Link to={`/agents/${property.agent?.id}`} className="w-full text-center bg-white/5 border border-white/10 text-white font-black py-5 rounded-2xl hover:bg-white hover:text-brand-secondary transition-all text-xs tracking-widest uppercase">
                  VIEW PARTNER DOSSIER
                </Link>
              </div>
            </div>

            {/* Premium Visit Scheduler */}
            <div className="bg-white p-10 rounded-[50px] shadow-premium border border-gray-50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-2 h-full bg-brand-primary group-hover:w-4 transition-all duration-500"></div>
              <h3 className="text-3xl font-black text-brand-secondary tracking-tighter mb-4">Private Tour</h3>
              <p className="text-gray-400 font-medium italic text-sm mb-10">Request a curated viewing session for this masterpiece.</p>
              
              {visitStatus === 'success' ? (
                <div className="bg-green-50 p-10 rounded-[32px] text-center border border-green-100 animate-scale-in">
                  <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
                  <h4 className="text-2xl font-black text-green-900 mb-2 tracking-tight">Request Logged.</h4>
                  <p className="text-green-700 font-medium italic text-sm">Our partner will reach out shortly for coordination.</p>
                </div>
              ) : (
                <form onSubmit={handleVisitRequest} className="space-y-8">
                  {visitStatus === 'error' && (
                    <div className="p-4 bg-red-50 text-red-600 text-[10px] font-black uppercase rounded-2xl border border-red-100 animate-fade-in">
                      {errorMessage}
                    </div>
                  )}
                  <div className="group">
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 transition-colors group-focus-within:text-brand-primary">Full Name</label>
                    <input type="text" required value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Full Identity" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all font-semibold" />
                  </div>

                  <div className="group">
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 transition-colors group-focus-within:text-brand-primary">Email Address</label>
                    <input type="email" required value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="Secure Email" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all font-semibold" />
                  </div>

                  <div className="group">
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 transition-colors group-focus-within:text-brand-primary">Phone Number</label>
                    <input type="tel" required value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="Direct Line" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all font-semibold" />
                  </div>
                  
                  <div className="group">
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 transition-colors group-focus-within:text-brand-primary">Preferred Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-300 w-4 h-4 group-focus-within:text-brand-primary transition-colors" />
                      <input type="datetime-local" required value={visitDate} onChange={(e) => setVisitDate(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all font-semibold" />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 transition-colors group-focus-within:text-brand-primary">Confidential Message</label>
                    <textarea rows="4" value={visitMessage} onChange={(e) => setVisitMessage(e.target.value)} placeholder="Specific requirements or questions..." className="w-full p-6 bg-gray-50 border border-gray-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all font-semibold resize-none text-sm italic leading-relaxed"></textarea>
                  </div>

                  <button type="submit" disabled={visitStatus === 'submitting'} className="w-full bg-brand-primary text-white font-black py-6 rounded-[24px] shadow-brand hover:shadow-brand/40 transform hover:-translate-y-1 transition-all disabled:opacity-50 text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-4">
                    {visitStatus === 'submitting' ? 'TRANSMITTING...' : 'REQUEST PRIVATE TOUR'}
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Market Insights Placeholder */}
            <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100 flex items-center gap-6">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-primary shadow-sm">
                    <MessageCircle size={24} />
                </div>
                <div>
                    <h4 className="font-black text-brand-secondary tracking-tight text-lg">Market Intelligence</h4>
                    <p className="text-gray-400 text-xs font-bold italic">Real-time demand for this sector: HIGH</p>
                </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
