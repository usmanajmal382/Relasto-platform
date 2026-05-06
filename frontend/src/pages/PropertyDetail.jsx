import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Calendar, CheckCircle2 } from 'lucide-react';
import api from '../api';

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Visit Request Form State
  const [visitDate, setVisitDate] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [visitMessage, setVisitMessage] = useState('');
  const [visitStatus, setVisitStatus] = useState('idle'); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const isAuthenticated = !!localStorage.getItem('access_token');

  useEffect(() => {
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
      await api.post('interactions/visits/', {
        property_id: id,
        agent_id: property.agent.id,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        preferred_date: visitDate,
        message: visitMessage
      });
      setVisitStatus('success');
    } catch (err) {
      console.error(err);
      setVisitStatus('error');
      setErrorMessage(err.response?.data?.detail || 'Failed to request visit. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-primary"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold mb-4">Property Not Found</h2>
        <Link to="/properties" className="text-brand-primary hover:underline">Return to properties</Link>
      </div>
    );
  }

  const imageUrl = property.images?.length > 0 
    ? property.images[0].image 
    : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80';

  return (
    <div className="bg-brand-bg min-h-screen pb-20">
      {/* Hero Image Section */}
      <div className="w-full h-[50vh] md:h-[65vh] relative">
        <img src={imageUrl} alt={property.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 max-w-7xl mx-auto">
          <div className="flex items-center space-x-4 mb-4">
            <span className="bg-brand-primary text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide">
              {property.status === 'sale' ? 'For Sale' : 'For Rent'}
            </span>
            <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide border border-white/30">
              {property.property_type}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">{property.title}</h1>
          <div className="flex items-center text-gray-200 text-lg">
            <MapPin className="w-5 h-5 mr-2 text-brand-primary" />
            {property.address}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Key Details Row */}
          <div className="flex flex-wrap items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-6">
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Price</p>
              <p className="text-3xl font-extrabold text-brand-primary">${parseFloat(property.price).toLocaleString()}</p>
            </div>
            <div className="flex space-x-6 sm:space-x-8">
              <div className="text-center">
                <Bed className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                <p className="font-bold text-gray-900 text-sm sm:text-base">{property.bedrooms} <span className="text-xs sm:text-sm font-normal text-gray-500">Beds</span></p>
              </div>
              <div className="text-center">
                <Bath className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                <p className="font-bold text-gray-900 text-sm sm:text-base">{property.bathrooms} <span className="text-xs sm:text-sm font-normal text-gray-500">Baths</span></p>
              </div>
              <div className="text-center">
                <Square className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                <p className="font-bold text-gray-900 text-sm sm:text-base">{property.sqft.toLocaleString()} <span className="text-xs sm:text-sm font-normal text-gray-500">SqFt</span></p>
              </div>
            </div>
          </div>

          {/* Description */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About this property</h2>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-gray-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </div>
          </section>

          {/* Features */}
          {property.features?.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Features & Amenities</h2>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.features.map(feature => (
                  <div key={feature.id} className="flex items-center text-gray-700">
                    <CheckCircle2 className="w-5 h-5 mr-3 text-brand-primary" />
                    {feature.feature_name}
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-8">
            
            {/* Agent Info */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Listed By</h3>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-primary flex items-center justify-center bg-orange-50">
                  {property.agent?.profile?.profile_picture ? (
                    <img src={property.agent.profile.profile_picture} className="w-full h-full object-cover" alt="Agent" />
                  ) : (
                    <span className="text-xl font-bold text-brand-primary uppercase">
                      {property.agent?.first_name?.charAt(0) || 'A'}
                    </span>
                  )}
                </div>
                <div>
                  <Link to={`/agents/${property.agent?.id}`} className="text-xl font-bold text-gray-900 hover:text-brand-primary transition">
                    {property.agent?.first_name} {property.agent?.last_name}
                  </Link>
                  <p className="text-gray-500">{property.agent?.email}</p>
                </div>
              </div>
              <Link to={`/agents/${property.agent?.id}`} className="mt-6 block w-full text-center border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-full hover:border-brand-primary hover:text-brand-primary transition">
                View Profile
              </Link>
            </div>

            {/* Visit Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-primary border-t-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Schedule a Visit</h3>
              <p className="text-sm text-gray-500 mb-6">Want to see this property in person? Send a request to the agent.</p>
              
              {visitStatus === 'success' ? (
                <div className="bg-green-50 p-6 rounded-xl text-center border border-green-100">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-green-800 mb-2">Request Sent!</h4>
                  <p className="text-green-700 text-sm">The agent will contact you shortly to confirm the appointment.</p>
                </div>
              ) : (
                <form onSubmit={handleVisitRequest} className="space-y-4">
                  {visitStatus === 'error' && (
                    <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                      {errorMessage}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="jane@example.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                      <input 
                        type="tel" 
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="(555) 123-4567"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Date & Time</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input 
                        type="datetime-local" 
                        required
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Message (Optional)</label>
                    <textarea 
                      rows="3"
                      value={visitMessage}
                      onChange={(e) => setVisitMessage(e.target.value)}
                      placeholder="I'd like to ask about..."
                      className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary resize-none"
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={visitStatus === 'submitting'}
                    className="w-full bg-brand-primary text-white font-bold py-3.5 rounded-xl hover:bg-orange-600 transition shadow-md disabled:opacity-70"
                  >
                    {visitStatus === 'submitting' ? 'Sending Request...' : 'Submit Request'}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
