import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Sparkles, Users, Search, ArrowRight, ShieldCheck, Trophy } from 'lucide-react';
import api from '../api';

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get('accounts/agents/')
      .then(res => {
        const data = res.data.results || res.data;
        setAgents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching agents:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-brand-bg min-h-screen pt-40 pb-24 relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 animate-slide-up">
           <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-secondary text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-xl">
            <Users className="w-3 h-3 mr-2" />
            Elite Advisory
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-brand-secondary mb-8 tracking-tighter">
            Premier <span className="text-brand-primary italic">Professionals</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed italic">
            Collaborate with the world's most distinguished real estate experts to navigate the global luxury market.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-40">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-brand-primary/10 border-t-brand-primary rounded-full animate-spin"></div>
                <Trophy className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-brand-primary animate-pulse" />
            </div>
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[40px] border border-gray-50 shadow-premium animate-scale-in">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-2xl font-black text-brand-secondary mb-2">No professionals found.</h3>
            <p className="text-gray-400 font-medium italic">Our advisory network is currently expanding.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {agents.map((agent, idx) => (
              <div key={agent.id} className="bg-white rounded-[40px] overflow-hidden shadow-premium hover:shadow-2xl transition-all duration-500 border border-gray-50 group animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="relative h-80 bg-gray-100 overflow-hidden">
                  {agent.profile?.profile_picture ? (
                    <img 
                      src={agent.profile.profile_picture} 
                      alt={agent.first_name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-secondary to-slate-900 flex items-center justify-center">
                      <span className="text-7xl font-black text-white/10 uppercase">
                        {agent.first_name?.charAt(0) || 'A'}
                      </span>
                    </div>
                  )}
                  
                  {/* Floating Rating Badge */}
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-2xl flex items-center shadow-2xl border border-white/50 transform group-hover:scale-110 transition-transform">
                    <Star className="w-4 h-4 text-brand-primary fill-current mr-2" />
                    <span className="text-sm font-black text-brand-secondary">
                      {agent.average_rating ? parseFloat(agent.average_rating).toFixed(1) : 'NEW'}
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
                </div>
                
                <div className="p-8 text-center relative">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-brand-primary rounded-[24px] flex items-center justify-center shadow-brand transform group-hover:-translate-y-2 transition-transform duration-500">
                     <ShieldCheck className="text-white w-8 h-8" />
                  </div>
                  
                  <div className="mt-8">
                      <h3 className="text-2xl font-black text-brand-secondary mb-1 tracking-tighter">
                        {agent.first_name} {agent.last_name}
                      </h3>
                      <p className="text-brand-primary font-black text-[10px] uppercase tracking-[0.3em] mb-6 italic">Certified Elite Advisory</p>
                      
                      {agent.profile?.agency_name && (
                        <div className="flex items-center justify-center text-gray-400 text-xs font-bold mb-8 uppercase tracking-tighter">
                          <MapPin className="w-3 h-3 mr-2 text-brand-primary" />
                          <span className="line-clamp-1">{agent.profile.agency_name}</span>
                        </div>
                      )}
                      
                      <Link 
                        to={`/agents/${agent.id}`}
                        className="group/btn flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-gray-50 text-brand-secondary font-black text-[10px] tracking-widest uppercase hover:bg-brand-secondary hover:text-white transition-all shadow-sm"
                      >
                        VIEW DOSSIER
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
