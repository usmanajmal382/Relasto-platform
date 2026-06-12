import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Mail, Phone, MapPin, CheckCircle2, MessageSquare, Briefcase, Award, AlignLeft } from 'lucide-react';
import api from '../api';
import PropertyCard from '../components/PropertyCard';

export default function AgentProfile() {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [agentProperties, setAgentProperties] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewStatus, setReviewStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const isAuthenticated = !!localStorage.getItem('access_token');

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);

    // Fetch Agent Details
    api.get(`accounts/agents/${id}/`)
      .then(res => {
        setAgent(res.data);
      })
      .catch(err => console.error("Error fetching agent:", err));

    // Fetch Properties listed by this agent
    api.get(`properties/?agent=${id}`)
      .then(res => {
        const data = res.data.results || res.data;
        setAgentProperties(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching agent properties:", err);
        setLoading(false);
      });

    // Fetch Reviews for this agent
    api.get(`interactions/reviews/?agent=${id}`)
      .then(res => {
        const data = res.data.results || res.data;
        setReviews(data);
      })
      .catch(err => console.error("Error fetching reviews:", err));
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewStatus('submitting');
    
    try {
      await api.post('interactions/reviews/', {
        agent_id: id,
        rating: rating,
        comment: comment
      });
      setReviewStatus('success');
      // Re-fetch reviews to show new one
      const res = await api.get(`interactions/reviews/?agent=${id}`);
      setReviews(res.data.results || res.data);
    } catch (err) {
      console.error(err);
      setReviewStatus('error');
      setErrorMessage(err.response?.data?.detail || 'Failed to submit review.');
    }
  };

  if (loading || !agent) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-brand-bg">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-brand-primary/10 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-bg min-h-screen">
      
      {/* Premium Hero Header */}
      <div className="relative h-[450px] overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 bg-brand-secondary z-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-12">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8 w-full animate-slide-up">
            
            {/* Avatar with Glow */}
            <div className="relative group">
              <div className="absolute inset-0 bg-brand-primary blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="w-48 h-48 rounded-[40px] overflow-hidden border-4 border-white/10 shadow-2xl relative z-10 bg-white/5 backdrop-blur-sm animate-scale-in">
                {agent.profile?.profile_picture ? (
                  <img src={agent.profile.profile_picture} alt={agent.first_name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-primary/20 to-brand-primary/40 flex items-center justify-center">
                    <span className="text-7xl font-black text-white/50 uppercase">{agent.first_name?.charAt(0) || 'A'}</span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-green-500 border-4 border-brand-secondary rounded-2xl flex items-center justify-center z-20 shadow-lg">
                <CheckCircle2 className="text-white w-6 h-6" />
              </div>
            </div>

            {/* Info Container */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-sm">
                  {agent.first_name} {agent.last_name}
                </h1>
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-orange-400 text-sm font-bold uppercase tracking-wider">
                  <Award className="w-4 h-4 mr-2" />
                  Top Rated Agent
                </div>
              </div>
              
              <p className="text-xl text-gray-300 font-medium mb-6 flex items-center justify-center md:justify-start">
                <Briefcase className="w-5 h-5 mr-3 text-brand-primary" />
                {agent.profile?.agency_name || 'Independent Real Estate Expert'}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                {agent.profile?.phone_number && (
                  <a href={`tel:${agent.profile.phone_number}`} className="glass-dark px-6 py-3 rounded-2xl text-white font-semibold flex items-center hover:bg-white/20 transition-all transform hover:-translate-y-1">
                    <Phone className="w-4 h-4 mr-3 text-brand-primary" />
                    {agent.profile.phone_number}
                  </a>
                )}
                <a href={`mailto:${agent.email}`} className="glass-dark px-6 py-3 rounded-2xl text-white font-semibold flex items-center hover:bg-white/20 transition-all transform hover:-translate-y-1">
                  <Mail className="w-4 h-4 mr-3 text-brand-primary" />
                  {agent.email}
                </a>
              </div>
            </div>

            {/* Premium Stats Widget */}
            <div className="glass-dark p-8 rounded-[32px] text-center min-w-[220px] animate-fade-in shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-50"></div>
              <div className="flex justify-center items-center mb-2">
                <Star className="w-10 h-10 text-yellow-400 fill-current mr-3 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                <span className="text-5xl font-black text-white italic">
                  {agent.average_rating ? parseFloat(agent.average_rating).toFixed(1) : 'New'}
                </span>
              </div>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Customer Satisfaction</p>
              <div className="mt-4 text-sm text-brand-primary font-bold">
                {reviews.length} Verified Reviews
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Sidebar Left: About & Bio */}
          <div className="lg:col-span-1 space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white p-8 rounded-[32px] shadow-premium border border-gray-100">
              <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
                <AlignLeft className="w-6 h-6 mr-3 text-brand-primary" />
                About {agent.first_name}
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg font-light mb-8 italic">
                {agent.profile?.bio || "A dedicated real estate professional committed to finding your perfect home with excellence and integrity."}
              </p>
              
              <div className="space-y-4 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Listings</span>
                  <span className="text-gray-900 font-bold">{agentProperties.length} Properties</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Experience</span>
                  <span className="text-gray-900 font-bold">5+ Years</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Response Rate</span>
                  <span className="text-gray-900 font-bold text-green-500">100%</span>
                </div>
              </div>
            </div>

            {/* Leave a Review Form Widget */}
            <div className="bg-white p-8 rounded-[32px] shadow-brand border-2 border-brand-primary relative overflow-hidden group">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-brand-primary/5 rounded-full"></div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Write a Review</h3>
              <p className="text-gray-500 mb-8 font-medium">Share your success story with the community.</p>
              
              {!isAuthenticated ? (
                <div className="bg-gray-50 p-8 rounded-3xl text-center border border-gray-100">
                  <p className="text-gray-600 mb-6 font-medium">Join the platform to share your feedback.</p>
                  <Link to="/login" className="block w-full bg-brand-secondary text-white font-black py-4 rounded-2xl hover:bg-slate-800 transition shadow-lg transform hover:scale-[1.02]">
                    Login to Review
                  </Link>
                </div>
              ) : reviewStatus === 'success' ? (
                <div className="bg-green-50 p-8 rounded-3xl text-center border border-green-100 animate-scale-in">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-xl font-black text-green-900 mb-2">Done!</h4>
                  <p className="text-green-700 font-medium">Your review was posted successfully.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  {reviewStatus === 'error' && (
                    <div className="p-4 bg-red-50 text-red-700 text-sm font-bold rounded-2xl border border-red-100">
                      {errorMessage}
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Select Rating</label>
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`focus:outline-none transition-all duration-300 transform hover:scale-125 ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
                        >
                          <Star className={`w-8 h-8 ${star <= rating ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Message</label>
                    <textarea 
                      required
                      rows="5"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us about the service..."
                      className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all resize-none font-medium"
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={reviewStatus === 'submitting'}
                    className="w-full bg-brand-primary text-white font-black py-5 rounded-2xl hover:bg-orange-600 transition shadow-brand hover:shadow-brand/40 transform hover:-translate-y-1 disabled:opacity-50"
                  >
                    {reviewStatus === 'submitting' ? 'Posting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Listings Section */}
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Active Listings</h2>
                <div className="h-px flex-1 bg-gray-100 mx-8"></div>
                <span className="text-brand-primary font-bold bg-orange-50 px-4 py-1 rounded-full">{agentProperties.length} TOTAL</span>
              </div>
              
              {agentProperties.length === 0 ? (
                <div className="bg-white p-12 rounded-[32px] border border-dashed border-gray-200 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Briefcase className="w-10 h-10 text-gray-300" />
                  </div>
                  <p className="text-xl text-gray-400 font-medium">No properties listed at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {agentProperties.map((property, idx) => (
                    <div key={property.id} className="animate-fade-in" style={{ animationDelay: `${0.1 * idx}s` }}>
                      <PropertyCard property={property} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Client Feedback</h2>
                <div className="h-px flex-1 bg-gray-100 mx-8"></div>
                <MessageSquare className="w-6 h-6 text-brand-primary" />
              </div>

              {reviews.length === 0 ? (
                <div className="bg-white p-12 rounded-[32px] border border-dashed border-gray-200 text-center">
                   <p className="text-xl text-gray-400 font-medium italic">"Waiting for first client review..."</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {reviews.map((review, idx) => (
                    <div key={review.id} className="bg-white p-8 rounded-[32px] shadow-premium border border-gray-50 hover:border-brand-primary/20 transition-all group animate-fade-in" style={{ animationDelay: `${0.1 * idx}s` }}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 rounded-2xl bg-brand-secondary text-white flex items-center justify-center font-black text-xl shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform">
                            {review.user?.first_name?.charAt(0) || review.user?.username?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-black text-xl text-gray-900">{review.user?.first_name} {review.user?.last_name || review.user?.username}</p>
                            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="flex text-yellow-400 bg-yellow-50 px-4 py-2 rounded-full border border-yellow-100">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <div className="relative">
                          <span className="absolute -top-4 -left-2 text-6xl text-brand-primary/10 font-serif">“</span>
                          <p className="text-gray-600 text-lg leading-relaxed font-light pl-6 italic relative z-10">
                            {review.comment}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
