import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Home, Calendar, Plus, MapPin, CheckCircle2, Clock, XCircle, User, LayoutDashboard, Settings, ShieldCheck, Mail, LogOut, Camera } from 'lucide-react';
import api from '../api';
import PropertyCard from '../components/PropertyCard';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('properties');
  const [profile, setProfile] = useState(null);
  const [properties, setProperties] = useState([]);
  const [visitRequests, setVisitRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
    bio: ''
  });
  const [updateStatus, setUpdateStatus] = useState('idle');
  const [avatarFile, setAvatarFile] = useState(null);

  const isAuthenticated = !!localStorage.getItem('access');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
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
            const propRes = await api.get(`properties/?agent=${userData.id}`);
            setProperties(propRes.data.results || propRes.data);

            const visitRes = await api.get('interactions/visits/');
            setVisitRequests(visitRes.data.results || visitRes.data);
          }

          if (userData.is_staff) {
            const usersRes = await api.get('accounts/users/');
            setAllUsers(usersRes.data.results || usersRes.data);

            const propsRes = await api.get('properties/');
            setAllProperties(propsRes.data.results || propsRes.data);
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
      setVisitRequests(prev => prev.map(v => v.id === id ? { ...v, status } : v));
    } catch (err) {
      console.error("Error updating visit status:", err);
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

  const handleAvatarUpload = async (e) => {
    e.preventDefault();
    if (!avatarFile) return;
    setUpdateStatus('submitting');
    try {
      const fd = new FormData();
      fd.append('profile_picture', avatarFile);
      const res = await api.post('accounts/profile/', fd);
      setProfile(res.data);
      setUpdateStatus('success');
      setAvatarFile(null);
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
      <div className="flex justify-center items-center min-h-screen bg-brand-bg">
        <div className="w-20 h-20 border-4 border-brand-primary/10 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const isAgent = profile?.profile?.is_agent;
  const isAdmin = profile?.is_staff;

  return (
    <div className="bg-brand-bg min-h-screen pt-52 md:pt-48 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Premium Dashboard Header */}
        <div className="relative overflow-hidden bg-brand-secondary rounded-[40px] p-8 md:p-12 mb-12 animate-slide-up shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="relative group">
                <div className="w-28 h-28 rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl bg-white/5 backdrop-blur-md">
                    {profile?.profile?.profile_picture ? (
                        <img src={profile.profile.profile_picture} className="w-full h-full object-cover" alt="Avatar" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-black text-white/50">
                            {profile?.first_name?.charAt(0) || 'U'}
                        </div>
                    )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-xl border-4 border-brand-secondary flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tighter mb-2">
                  Welcome, <span className="text-brand-primary italic">{profile?.first_name || profile?.username}</span>
                </h1>
                <p className="text-gray-400 font-medium text-lg flex items-center justify-center md:justify-start gap-2">
                  <ShieldCheck className="w-5 h-5 text-brand-primary" />
                  {isAgent ? 'Luxury Real Estate Agent' : 'Premium Member'}
                </p>
              </div>
            </div>

            {isAgent && (
              <Link
                to="/dashboard/add-property"
                className="group bg-brand-primary text-white font-black py-5 px-10 rounded-2xl shadow-brand hover:shadow-brand/40 transform hover:-translate-y-1 transition-all flex items-center gap-3 uppercase tracking-widest text-xs"
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                NEW LISTING
              </Link>
            )}
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex flex-wrap gap-4 mb-12 bg-white p-2.5 rounded-[28px] shadow-premium border border-gray-50 animate-fade-in">
          {isAgent && (
            <>
              <button
                onClick={() => setActiveTab('properties')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-[20px] font-black text-xs tracking-widest transition-all ${activeTab === 'properties' ? 'bg-brand-secondary text-white shadow-xl scale-105' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                <Home size={18} />
                PORTFOLIO ({properties.length})
              </button>
              <button
                onClick={() => setActiveTab('visits')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-[20px] font-black text-xs tracking-widest transition-all ${activeTab === 'visits' ? 'bg-brand-secondary text-white shadow-xl scale-105' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                <Calendar size={18} />
                LEADS ({visitRequests.length})
              </button>
            </>
          )}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-[20px] font-black text-xs tracking-widest transition-all ${activeTab === 'settings' ? 'bg-brand-secondary text-white shadow-xl scale-105' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <Settings size={18} />
            SETTINGS
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-[20px] font-black text-xs tracking-widest transition-all ${activeTab === 'admin' ? 'bg-brand-primary text-white shadow-xl scale-105' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <LayoutDashboard size={18} />
              SITE ADMIN
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {activeTab === 'properties' && isAgent && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {properties.length === 0 ? (
                  <div className="lg:col-span-3 bg-white rounded-[40px] p-24 text-center border border-gray-50 shadow-premium">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                      <Home className="w-12 h-12 text-gray-300" />
                    </div>
                    <h3 className="text-3xl font-black text-brand-secondary mb-4 tracking-tight">No properties listed.</h3>
                    <p className="text-gray-400 max-w-sm mx-auto font-medium italic mb-10">Start building your legacy by listing your first premium estate.</p>
                    <Link to="/dashboard/add-property" className="bg-brand-primary text-white px-12 py-5 rounded-2xl font-black tracking-widest text-xs shadow-brand">
                        ADD PROPERTY NOW
                    </Link>
                  </div>
                ) : (
                  properties.map((property, idx) => (
                    <div key={property.id} className="animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                      <PropertyCard property={property} />
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'visits' && isAgent && (
              <div className="space-y-8">
                {visitRequests.length === 0 ? (
                    <div className="bg-white rounded-[40px] p-24 text-center border border-gray-50 shadow-premium">
                        <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-8" />
                        <h3 className="text-2xl font-black text-brand-secondary">No active leads.</h3>
                    </div>
                ) : (
                    visitRequests.map((visit, idx) => (
                        <div key={visit.id} className="bg-white p-8 rounded-[40px] shadow-premium border border-gray-50 hover:border-brand-primary/20 transition-all group flex flex-col md:flex-row justify-between items-center gap-8 animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                           <div className="flex flex-col md:flex-row items-center gap-8 w-full">
                                <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-lg shrink-0">
                                    <img src={visit.property?.images?.[0]?.image || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt="Property" />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${visit.status === 'pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'}`}>
                                            {visit.status}
                                        </span>
                                        <span className="text-xs text-gray-400 font-bold flex items-center gap-1 uppercase tracking-tighter">
                                            <Clock size={14} /> {new Date(visit.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h4 className="text-2xl font-black text-brand-secondary tracking-tight mb-2">{visit.property?.title}</h4>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                            <User size={16} className="text-brand-primary" /> {visit.contact_name}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                            <Mail size={16} className="text-brand-primary" /> {visit.contact_email}
                                        </div>
                                    </div>
                                </div>
                           </div>
                           
                           <div className="flex gap-4 min-w-[300px]">
                                {visit.status === 'pending' && (
                                    <button onClick={() => updateVisitStatus(visit.id, 'reviewed')} className="flex-1 bg-brand-secondary text-white font-black py-4 rounded-2xl text-[10px] tracking-widest hover:bg-slate-800 transition">
                                        MARK REVIEWED
                                    </button>
                                )}
                                <button onClick={() => updateVisitStatus(visit.id, 'completed')} className="flex-1 bg-green-500 text-white font-black py-4 rounded-2xl text-[10px] tracking-widest hover:bg-green-600 transition shadow-lg shadow-green-500/20">
                                    COMPLETE
                                </button>
                                <button onClick={() => updateVisitStatus(visit.id, 'cancelled')} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition">
                                    <XCircle size={20} />
                                </button>
                           </div>
                        </div>
                    ))
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-[40px] shadow-premium border border-gray-50 p-10 md:p-16">
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-1.5 h-10 bg-brand-primary rounded-full"></div>
                    <h2 className="text-4xl font-black text-brand-secondary tracking-tighter">Profile Core</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Left: Avatar Upload */}
                    <div className="lg:col-span-1">
                        <form onSubmit={handleAvatarUpload} className="text-center">
                            <div className="relative inline-block group mb-8">
                                <div className="w-48 h-48 rounded-[40px] overflow-hidden border-8 border-gray-50 shadow-2xl relative">
                                    {profile?.profile?.profile_picture ? (
                                        <img src={profile.profile.profile_picture} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" alt="Avatar" />
                                    ) : (
                                        <div className="w-full h-full bg-brand-primary/10 flex items-center justify-center text-6xl font-black text-brand-primary">
                                            {profile?.first_name?.charAt(0) || 'U'}
                                        </div>
                                    )}
                                </div>
                                <label className="absolute -bottom-4 -right-4 w-16 h-16 bg-brand-secondary rounded-3xl flex items-center justify-center cursor-pointer shadow-2xl hover:bg-brand-primary transition-colors border-4 border-white">
                                    <Camera className="text-white w-6 h-6" />
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])} />
                                </label>
                            </div>
                            
                            {avatarFile && (
                                <button type="submit" className="w-full bg-brand-primary text-white py-4 rounded-2xl font-black text-[10px] tracking-widest animate-fade-in shadow-brand">
                                    UPLOAD NEW IMAGE
                                </button>
                            )}
                        </form>
                    </div>

                    {/* Right: Form Info */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleProfileUpdate} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="group">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Legal First Name</label>
                                    <input type="text" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border border-gray-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all font-semibold" />
                                </div>
                                <div className="group">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Legal Last Name</label>
                                    <input type="text" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border border-gray-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all font-semibold" />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="group">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Professional Contact</label>
                                    <input type="text" value={formData.phone_number} onChange={(e) => setFormData({...formData, phone_number: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border border-gray-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all font-semibold" />
                                </div>
                                <div className="group">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Primary Location</label>
                                    <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border border-gray-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all font-semibold" />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Professional Biography</label>
                                <textarea rows="5" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="w-full p-6 bg-gray-50 border border-gray-50 rounded-3xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all font-semibold resize-none"></textarea>
                            </div>

                            <button type="submit" disabled={updateStatus === 'submitting'} className="bg-brand-primary text-white py-6 px-16 rounded-3xl font-black tracking-widest text-xs hover:bg-orange-600 transition-all shadow-brand hover:shadow-brand/40">
                                {updateStatus === 'submitting' ? 'UPDATING...' : 'SAVE PROFILE CHANGES'}
                            </button>
                        </form>
                    </div>
                </div>
              </div>
            )}

            {activeTab === 'admin' && isAdmin && (
              <div className="space-y-12">
                {/* Stats Cards Redesigned */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                   {[
                       { label: 'Total Users', value: allUsers.length, color: 'text-brand-secondary' },
                       { label: 'Live Inventory', value: allProperties.length, color: 'text-brand-primary' },
                       { label: 'Platform Load', value: 'Optimized', color: 'text-green-500' }
                   ].map((stat, i) => (
                       <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-50 shadow-premium">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
                           <p className={`text-4xl font-black ${stat.color} tracking-tighter`}>{stat.value}</p>
                       </div>
                   ))}
                </div>

                {/* Users Table Redesigned */}
                <div className="bg-white rounded-[40px] shadow-premium border border-gray-50 overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <h3 className="text-2xl font-black text-brand-secondary tracking-tight uppercase text-xs tracking-widest">Global Intelligence</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                    <th className="px-8 py-6">Identity</th>
                                    <th className="px-8 py-6">Access Role</th>
                                    <th className="px-8 py-6">Registration</th>
                                    <th className="px-8 py-6 text-right">Reference</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {allUsers.map(u => (
                                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-8 py-6">
                                            <p className="font-black text-brand-secondary">{u.first_name} {u.last_name || u.username}</p>
                                            <p className="text-xs text-gray-400 font-medium">{u.email}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${u.is_staff ? 'bg-purple-50 text-purple-600' : u.profile?.is_agent ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                                                {u.is_staff ? 'STAFF' : u.profile?.is_agent ? 'ELITE AGENT' : 'PREMIUM BUYER'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-xs text-gray-500 font-bold uppercase tracking-tighter">Verified</td>
                                        <td className="px-8 py-6 text-right text-gray-300 font-black text-xs">#{u.id}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
