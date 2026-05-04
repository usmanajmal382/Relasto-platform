import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
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
    let url = 'properties/?';
    
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (statusFilter) params.append('status', statusFilter);
    if (typeFilter) params.append('property_type', typeFilter);
    if (ordering) params.append('ordering', ordering);

    // Update URL without reloading page
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
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, typeFilter, ordering]); // Refetch when filters change (except search typing)

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  return (
    <div className="bg-brand-bg min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Discover Properties</h1>
          <p className="text-xl text-gray-500 max-w-3xl">Browse our extensive catalog of premium real estate options.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-1/4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
              <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-gray-100">
                <SlidersHorizontal className="w-5 h-5 text-brand-primary" />
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              </div>
              
              <form onSubmit={handleSearchSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Search Location</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="City, Zip, etc..." 
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Property Status</label>
                  <select 
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary bg-white transition"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">Any Status</option>
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type</label>
                  <select 
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary bg-white transition"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="">Any Type</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="land">Land</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-brand-primary text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition shadow-sm"
                >
                  Apply Filters
                </button>
              </form>
            </div>
          </aside>

          {/* Property Grid */}
          <main className="w-full lg:w-3/4">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
              <p className="text-gray-600 font-medium mb-4 sm:mb-0">
                Showing <span className="text-brand-primary font-bold">{properties.length}</span> results
              </p>
              
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
                <select 
                  className="w-full sm:w-auto p-2 border border-gray-200 rounded-lg focus:outline-none text-sm font-medium bg-white"
                  value={ordering}
                  onChange={(e) => setOrdering(e.target.value)}
                >
                  <option value="-created_at">Newest First</option>
                  <option value="price">Price (Low to High)</option>
                  <option value="-price">Price (High to Low)</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-500 max-w-md mx-auto">We couldn't find any properties matching your current filters. Try adjusting your search criteria.</p>
                <button 
                  onClick={() => {
                    setSearchTerm(''); setStatusFilter(''); setTypeFilter(''); fetchProperties();
                  }}
                  className="mt-6 text-brand-primary font-semibold hover:text-orange-700 transition"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {properties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
