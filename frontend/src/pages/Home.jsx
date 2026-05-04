import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import api from '../api';
import PropertyCard from '../components/PropertyCard';

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch latest properties for the featured section
    api.get('properties/?ordering=-created_at&limit=3')
      .then(res => {
        // Handle pagination if applicable
        const data = res.data.results || res.data;
        setFeaturedProperties(data.slice(0, 3));
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching featured properties:", err);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[700px] flex items-center justify-center overflow-hidden animate-fade-in">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80" 
            alt="Luxury Mansion" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 tracking-tight drop-shadow-2xl">
            Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-brand-primary">dream home</span> today.
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-12 font-light max-w-3xl mx-auto drop-shadow-md">
            Browse thousands of premium properties to find the perfect fit for your lifestyle.
          </p>
          
          <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur-md p-3 rounded-3xl md:rounded-full flex flex-col md:flex-row items-center shadow-2xl max-w-3xl mx-auto transition-transform hover:scale-[1.02] duration-300 gap-3 md:gap-0">
            <div className="flex items-center w-full md:w-auto flex-1">
              <div className="pl-4 md:pl-6 pr-2 md:pr-4 text-brand-primary">
                <Search className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <input 
                type="text" 
                placeholder="Search by city, neighborhood..." 
                className="flex-1 py-3 md:py-4 px-2 outline-none text-brand-text text-base md:text-lg bg-transparent font-medium w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="w-full md:w-auto bg-brand-primary text-white px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-full font-bold text-base md:text-lg hover:bg-brand-primary-hover transition-colors shadow-lg shadow-brand-primary/30"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Featured Properties</h2>
            <p className="text-xl text-gray-500">Explore our handpicked selection of premium real estate.</p>
          </div>
          <Link to="/properties" className="hidden md:inline-block text-brand-primary font-bold hover:text-orange-700 transition">
            View All Properties &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center md:hidden">
          <Link to="/properties" className="inline-block border-2 border-brand-primary text-brand-primary font-bold px-8 py-3 rounded-full hover:bg-brand-primary hover:text-white transition">
            View All Properties
          </Link>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary to-slate-800 z-0"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl z-0"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl z-0"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Are you a Real Estate Agent?</h2>
          <p className="text-lg md:text-xl text-gray-300 mb-10 md:mb-12 font-light max-w-2xl mx-auto">
            Join Relasto today to list your premium properties and connect with thousands of highly qualified buyers globally.
          </p>
          <Link to="/register" className="inline-block bg-white text-brand-secondary px-8 md:px-12 py-4 md:py-5 rounded-full font-bold text-base md:text-lg hover:bg-gray-50 transition shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transform hover:-translate-y-1">
            Create Agent Account
          </Link>
        </div>
      </section>
    </div>
  );
}
