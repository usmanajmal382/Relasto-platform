import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Compass, Map, Grid, List, Sparkles } from 'lucide-react';
import api from '../api';
import PropertyCard from '../components/PropertyCard';

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('property_type') || '');
  const [ordering, setOrdering] = useState(searchParams.get('ordering') || '-created_at');

  const fetchProperties = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (statusFilter) params.append('status', statusFilter);
    if (typeFilter) params.append('property_type', typeFilter);
    if (ordering) params.append('ordering', ordering);

    setSearchParams(params);

    api.get(`properties/?${params.toString()}`)
      .then(res => {
        const data = res.data.results || res.data;
        setProperties(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching properties:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProperties();
  }, [statusFilter, typeFilter, ordering]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  return (
    <div className="bg-brand-bg min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Premium Page Header */}
        <div className="mb-16 animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand-primary" />
             </div>
             <span className="text-xs font-black text-brand-primary uppercase tracking-[0.3em]">Exclusive Listings</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-secondary mb-6 tracking-tighter">
            Discover <span className="text-brand-primary italic">Properties</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl font-medium leading-relaxed">
            Experience the art of living with our curated collection of architectural masterpieces and premium estates.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Filters - Redesigned */}
          <aside className="w-full lg:w-1/4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white p-8 rounded-[32px] shadow-premium border border-gray-100 sticky top-32 overflow-hidden group">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-24 h-24 bg-brand-primary/5 rounded-full"></div>
              
              <div className="flex items-center space-x-3 mb-10">
                <SlidersHorizontal className="w-6 h-6 text-brand-primary" />
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest text-xs">Filter Selection</h2>
              </div>
              
              <form onSubmit={handleSearchSubmit} className="space-y-8">
                <div className="group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Search Context</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-brand-primary transition-colors" />
                    <input 
                      type="text" 
                      placeholder="City, Zip, Street..." 
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all font-semibold"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Market Status</label>
                  <select 
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 bg-white transition-all font-semibold appearance-none"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">Any Availability</option>
                    <option value="sale">For Purchase</option>
                    <option value="rent">For Lease</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Estate Category</label>
                  <select 
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 bg-white transition-all font-semibold appearance-none"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="land">Development Land</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-brand-primary text-white py-5 rounded-[20px] font-black tracking-widest text-xs hover:bg-orange-600 transition-all shadow-brand hover:shadow-brand/40 transform hover:-translate-y-1 uppercase"
                >
                  Apply Settings
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-50 text-center">
                 <button 
                    onClick={() => {
                        setSearchTerm(''); setStatusFilter(''); setTypeFilter(''); fetchProperties();
                    }}
                    className="text-[10px] font-black text-gray-400 hover:text-brand-primary uppercase tracking-widest transition-colors"
                >
                    Reset All Filters
                </button>
              </div>
            </div>
          </aside>

          {/* Property Grid - Redesigned */}
          <main className="w-full lg:w-3/4">
            {/* Results Header Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-[32px] shadow-premium border border-gray-50 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-6 mb-4 sm:mb-0">
                <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                    <button className="p-2 bg-white rounded-xl shadow-sm text-brand-primary"><Grid className="w-5 h-5" /></button>
                    <button className="p-2 text-gray-400 hover:text-brand-secondary transition-colors"><List className="w-5 h-5" /></button>
                </div>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                  Found <span className="text-brand-primary">{properties.length}</span> Masterpieces
                </p>
              </div>
              
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort:</span>
                <select 
                  className="w-full sm:w-auto p-3 border border-gray-100 rounded-xl focus:outline-none text-xs font-black bg-gray-50 uppercase tracking-widest"
                  value={ordering}
                  onChange={(e) => setOrdering(e.target.value)}
                >
                  <option value="-created_at">Latest Listings</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-brand-primary/10 border-t-brand-primary rounded-full animate-spin"></div>
                    <Compass className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-brand-primary animate-pulse" />
                </div>
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white rounded-[40px] p-20 text-center border border-gray-50 shadow-premium animate-scale-in">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Map className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-3xl font-black text-brand-secondary mb-4 tracking-tight">No results matched.</h3>
                <p className="text-gray-400 max-w-sm mx-auto font-medium leading-relaxed italic mb-10">We couldn't find any estates matching your specific requirements in our current collection.</p>
                <button 
                  onClick={() => {
                    setSearchTerm(''); setStatusFilter(''); setTypeFilter(''); fetchProperties();
                  }}
                  className="bg-brand-secondary text-white px-10 py-5 rounded-2xl font-black tracking-widest text-xs hover:bg-slate-800 transition shadow-lg"
                >
                  VIEW ALL INVENTORY
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {properties.map((property, idx) => (
                  <div key={property.id} className="animate-fade-in" style={{ animationDelay: `${0.1 * idx}s` }}>
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
