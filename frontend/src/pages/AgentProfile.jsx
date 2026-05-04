import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';
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
    // Fetch Agent Details
    api.get(`accounts/agents/${id}/`)
      .then(res => {
        setAgent(res.data);
      })
      .catch(err => console.error("Error fetching agent:", err));

    // Fetch Properties listed by this agent
    // Assuming backend filters properties by agent id using 'agent' param or similar, 
    // or we fetch all and filter locally for now if backend doesn't support it directly.
    // Assuming backend has `?agent=id`
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
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-brand-bg min-h-screen pb-20">
      
      {/* Agent Header */}
      <div className="bg-white border-b border-gray-200 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            
            {/* Avatar */}
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl shrink-0 bg-gray-100">
              {agent.profile?.profile_picture ? (
                <img src={agent.profile.profile_picture} alt={agent.first_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                  <span className="text-6xl font-black text-brand-primary/40 uppercase">{agent.first_name?.charAt(0) || 'A'}</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left mt-4 md:mt-0">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                {agent.first_name} {agent.last_name}
              </h1>
              <p className="text-xl text-brand-primary font-semibold mb-4">Professional Real Estate Agent</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-600 mb-6">
                {agent.profile?.agency_name && (
                  <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <MapPin className="w-4 h-4 mr-2 text-brand-primary" />
                    {agent.profile.agency_name}
                  </div>
                )}
                {agent.profile?.phone_number && (
                  <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <Phone className="w-4 h-4 mr-2 text-brand-primary" />
                    {agent.profile.phone_number}
                  </div>
                )}
                <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                  <Mail className="w-4 h-4 mr-2 text-brand-primary" />
                  {agent.email}
                </div>
              </div>

              {agent.profile?.bio && (
                <p className="text-gray-600 max-w-2xl leading-relaxed">
                  {agent.profile.bio}
                </p>
              )}
            </div>

            {/* Stats Card */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center min-w-[200px]">
              <div className="flex justify-center items-center mb-2">
                <Star className="w-8 h-8 text-yellow-400 fill-current mr-2" />
                <span className="text-4xl font-black text-gray-900">
                  {agent.average_rating ? parseFloat(agent.average_rating).toFixed(1) : 'New'}
                </span>
              </div>
              <p className="text-gray-500 font-medium">Average Rating</p>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Main Content: Agent's Properties */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Listings ({agentProperties.length})</h2>
          
          {agentProperties.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
              <p className="text-gray-500">This agent currently has no active listings.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {agentProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          {/* Reviews List */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Client Reviews ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
                <p className="text-gray-500">No reviews yet for this agent.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map(review => (
                  <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold">
                          {review.user?.first_name?.charAt(0) || review.user?.username?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{review.user?.first_name} {review.user?.last_name || review.user?.username}</p>
                          <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-gray-600 italic">"{review.comment}"</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Review Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-primary border-t-8 sticky top-28">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Leave a Review</h3>
            <p className="text-sm text-gray-500 mb-6">Share your experience working with {agent.first_name}.</p>
            
            {!isAuthenticated ? (
              <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-100">
                <p className="text-gray-600 mb-4">You must be logged in to leave a review.</p>
                <Link to="/login" className="inline-block bg-brand-primary text-white font-bold py-3 px-8 rounded-full hover:bg-orange-600 transition">
                  Log In
                </Link>
              </div>
            ) : reviewStatus === 'success' ? (
              <div className="bg-green-50 p-6 rounded-xl text-center border border-green-100">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-green-800 mb-2">Review Submitted!</h4>
                <p className="text-green-700 text-sm">Thank you for sharing your feedback.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {reviewStatus === 'error' && (
                  <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                    {errorMessage}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`focus:outline-none transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
                      >
                        <Star className={`w-8 h-8 ${star <= rating ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Your Review</label>
                  <textarea 
                    required
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell others about your experience..."
                    className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary resize-none"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={reviewStatus === 'submitting'}
                  className="w-full bg-brand-primary text-white font-bold py-3.5 rounded-xl hover:bg-orange-600 transition shadow-md disabled:opacity-70"
                >
                  {reviewStatus === 'submitting' ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
