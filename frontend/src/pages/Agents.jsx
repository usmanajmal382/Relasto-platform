import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import api from '../api';

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    <div className="bg-brand-bg min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Our Premier Agents</h1>
          <p className="text-xl text-gray-500">Connect with top-rated professionals who can help you find your perfect home.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-primary"></div>
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No agents found</h3>
            <p className="text-gray-500">Check back later for updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {agents.map(agent => (
              <div key={agent.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="relative h-64 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {agent.profile?.profile_picture ? (
                    <img 
                      src={agent.profile.profile_picture} 
                      alt={agent.first_name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                      <span className="text-6xl font-black text-brand-primary/40 uppercase">
                        {agent.first_name?.charAt(0) || 'A'}
                      </span>
                    </div>
                  )}
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center shadow-sm">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-bold text-gray-900">
                      {agent.average_rating ? parseFloat(agent.average_rating).toFixed(1) : 'New'}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {agent.first_name} {agent.last_name}
                  </h3>
                  <p className="text-brand-primary font-semibold text-sm mb-4">Real Estate Agent</p>
                  
                  {agent.profile?.agency_name && (
                    <div className="flex items-center justify-center text-gray-500 text-sm mb-6">
                      <MapPin className="w-4 h-4 mr-1 shrink-0" />
                      <span className="line-clamp-1">{agent.profile.agency_name}</span>
                    </div>
                  )}
                  
                  <Link 
                    to={`/agents/${agent.id}`}
                    className="block w-full py-3 px-4 rounded-full border-2 border-gray-100 text-gray-700 font-bold hover:border-brand-primary hover:text-brand-primary transition"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
