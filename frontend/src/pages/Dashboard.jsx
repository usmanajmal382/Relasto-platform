import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Home, Calendar, Plus, MapPin, CheckCircle2, Clock, XCircle, User } from 'lucide-react';
import api from '../api';
import PropertyCard from '../components/PropertyCard';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('properties'); // 'properties', 'visits', 'settings'
  const [profile, setProfile] = useState(null);
  const [properties, setProperties] = useState([]);
  const [visitRequests, setVisitRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
    bio: ''
  });
  const [updateStatus, setUpdateStatus] = useState('idle');

  const isAuthenticated = !!localStorage.getItem('access_token');

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          // 1. Fetch current user profile
          const profileRes = await api.get('accounts/profile/');
          const userData = profileRes.data;
          setProfile(userData);
          setFormData({
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            phone_number: userData.profile?.phone_number || '',
            address: userData.profile?.address || '',
            bio: userData.profile?.bio || ''
          });

          if (!userData.profile?.is_agent) {
             setActiveTab('settings');
          } else {
            // 2. Fetch Agent's Properties
            const propRes = await api.get(`properties/?agent=${userData.id}`);
            setProperties(propRes.data.results || propRes.data);

            // 3. Fetch Visit Requests assigned to Agent
            const visitRes = await api.get('interactions/visits/');
            setVisitRequests(visitRes.data.results || visitRes.data);
          }
        } catch (err) {
          console.error("Error fetching dashboard data:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isAuthenticated]);

  const updateVisitStatus = async (id, status) => {
    try {
      await api.patch(`interactions/visits/${id}/`, { status });
      // Update local state
      setVisitRequests(prev => prev.map(v => v.id === id ? { ...v, status } : v));
    } catch (err) {
      console.error("Error updating visit status:", err);
      alert("Failed to update status");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdateStatus('submitting');
    try {
      const res = await api.patch('accounts/profile/', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        profile: {
          phone_number: formData.phone_number,
          address: formData.address,
          bio: formData.bio
        }
      });
      setProfile(res.data);
      setUpdateStatus('success');
      setTimeout(() => setUpdateStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setUpdateStatus('error');
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: { pathname: '/dashboard' } }} />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-brand-bg">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-primary"></div>
      </div>
    );
  }

  const isAgent = profile?.profile?.is_agent;

  return (
    <div className="bg-brand-bg min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">

        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-6">
            <div className="w-20 h-20 rounded-full shrink-0 bg-gradient-to-br from-brand-primary to-orange-400 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-brand-primary/30 mb-4 sm:mb-0">
              {profile?.first_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Welcome back, {profile?.first_name || profile?.username}!
              </h1>
              <p className="text-base sm:text-lg text-gray-500 mt-1">
                {isAgent ? 'Manage your real estate empire.' : 'Manage your profile and visit requests.'}
              </p>
            </div>
          </div>
          {isAgent && (
            <Link
              to="/dashboard/add-property"
              className="w-full md:w-auto justify-center bg-brand-primary text-white font-bold py-3.5 px-8 rounded-full shadow-lg shadow-brand-primary/30 hover:bg-brand-primary-hover hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
            >
              <Plus size={20} />
              <span>New Listing</span>
            </Link>
          )}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap space-x-2 mb-8 bg-gray-100/50 p-1.5 rounded-2xl inline-flex gap-y-2">
          {isAgent && (
            <>
              <button
                onClick={() => setActiveTab('properties')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'properties' ? 'bg-white text-brand-text shadow-sm' : 'text-gray-500 hover:text-brand-text'}`}
              >
                <Home size={18} />
                My Properties ({properties.length})
              </button>
              <button
                onClick={() => setActiveTab('visits')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'visits' ? 'bg-white text-brand-text shadow-sm' : 'text-gray-500 hover:text-brand-text'}`}
              >
                <Calendar size={18} />
                Visit Requests ({visitRequests.length})
              </button>
            </>
          )}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'settings' ? 'bg-white text-brand-text shadow-sm' : 'text-gray-500 hover:text-brand-text'}`}
          >
            <User size={18} />
            Profile Settings
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'properties' && isAgent && (
          <div className="animate-slide-up">
            {properties.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
                <Home className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No active listings</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">Start listing properties to attract buyers and grow your business.</p>
                <Link
                  to="/dashboard/add-property"
                  className="text-brand-primary font-bold hover:text-brand-primary-hover transition-colors inline-flex items-center gap-2"
                >
                  <Plus size={20} /> Create your first listing
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'visits' && isAgent && (
          <div className="animate-slide-up">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              {visitRequests.length === 0 ? (
                <div className="p-16 text-center">
                  <Calendar className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No Visit Requests</h3>
                  <p className="text-gray-500 max-w-md mx-auto">When buyers request to visit your properties, they will appear here.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {visitRequests.map(visit => (
                    <div key={visit.id} className="p-8 hover:bg-gray-50 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${visit.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              visit.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                                visit.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  'bg-red-100 text-red-800'
                            }`}>
                            {visit.status}
                          </span>
                          <span className="text-gray-500 text-sm flex items-center gap-1">
                            <Clock size={14} /> {new Date(visit.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">{visit.property?.title || 'Unknown Property'}</h4>
                        <p className="text-brand-primary font-medium text-sm mt-1">Requested Date: {new Date(visit.preferred_date).toLocaleString()}</p>

                        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 inline-block">
                          <p className="font-semibold text-gray-900 text-sm mb-1">Contact: {visit.contact_name}</p>
                          <div className="text-gray-600 text-sm flex flex-col gap-1">
                            <span>{visit.contact_email}</span>
                            <span>{visit.contact_phone}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 min-w-[140px]">
                        {visit.status === 'pending' && (
                          <button onClick={() => updateVisitStatus(visit.id, 'reviewed')} className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-2 px-4 rounded-lg text-sm transition">
                            Mark Reviewed
                          </button>
                        )}
                        {(visit.status === 'pending' || visit.status === 'reviewed') && (
                          <>
                            <button onClick={() => updateVisitStatus(visit.id, 'completed')} className="w-full bg-green-50 hover:bg-green-100 text-green-700 font-bold py-2 px-4 rounded-lg text-sm transition flex items-center justify-center gap-1">
                              <CheckCircle2 size={16} /> Complete
                            </button>
                            <button onClick={() => updateVisitStatus(visit.id, 'cancelled')} className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-bold py-2 px-4 rounded-lg text-sm transition flex items-center justify-center gap-1">
                              <XCircle size={16} /> Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-slide-up">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
              
              {updateStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 flex items-center gap-2">
                  <CheckCircle2 size={20} />
                  <span className="font-semibold">Profile updated successfully!</span>
                </div>
              )}
              {updateStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-2">
                  <XCircle size={20} />
                  <span className="font-semibold">Failed to update profile. Please try again.</span>
                </div>
              )}

              <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                    <input 
                      type="text" 
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    <input 
                      type="text" 
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input 
                      type="text" 
                      value={formData.phone_number}
                      onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address / City</label>
                    <input 
                      type="text" 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                  <textarea 
                    rows="4"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary resize-none"
                    placeholder="Tell us a bit about yourself..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={updateStatus === 'submitting'}
                  className="bg-brand-primary text-white font-bold py-3.5 px-8 rounded-xl hover:bg-orange-600 transition shadow-md disabled:opacity-70"
                >
                  {updateStatus === 'submitting' ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
