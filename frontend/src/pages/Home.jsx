import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Compass, ShieldCheck, Zap, ArrowRight, Star } from 'lucide-react';
import api from '../api';
import PropertyCard from '../components/PropertyCard';

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);

    // Fetch latest properties for the featured section
    api.get('properties/?ordering=-created_at&limit=3')
      .then(res => {
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
    <div className="bg-brand-bg">
      {/* Premium Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=80" 
            alt="Luxury Mansion" 
            className="w-full h-full object-cover scale-110 animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-secondary/80 via-brand-secondary/40 to-brand-bg"></div>
        </div>
        
        {/* Decorative Floating Elements */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-brand-primary/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px]"></div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto animate-slide-up pt-16 md:pt-12">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-black uppercase tracking-[0.3em] mb-10 shadow-2xl">
            <Star className="w-3 h-3 mr-2 text-yellow-400 fill-current" />
            The Future of Living
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-black text-white mb-10 tracking-tighter leading-none drop-shadow-2xl">
            Modern <span className="text-gradient drop-shadow-none italic">Estates</span>
            <br />For Elite Living.
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-300 mb-16 font-medium max-w-2xl mx-auto drop-shadow-lg leading-relaxed">
            Experience the pinnacle of luxury with our curated collection of high-end real estate.
          </p>
          
          <form onSubmit={handleSearch} className="glass-dark p-3 rounded-[32px] flex flex-col md:flex-row items-center shadow-2xl max-w-4xl mx-auto border border-white/10 group transition-all duration-500 hover:border-brand-primary/30 gap-4 md:gap-0">
            <div className="flex items-center w-full md:w-auto flex-1 px-4">
              <Search className="w-6 h-6 text-brand-primary group-hover:scale-110 transition-transform" />
              <input 
                type="text" 
                placeholder="Search by city, neighborhood, or lifestyle..." 
                className="flex-1 py-4 md:py-6 px-6 outline-none text-white text-lg bg-transparent font-medium w-full placeholder:text-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="w-full md:w-auto bg-brand-primary text-white px-12 md:px-16 py-5 md:py-7 rounded-[24px] font-black uppercase tracking-widest text-sm hover:bg-orange-600 transition-all shadow-brand hover:shadow-brand/40 transform hover:-translate-y-1"
            >
              Search Now
            </button>
          </form>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          <div className="w-[1px] h-20 bg-gradient-to-b from-brand-primary to-transparent"></div>
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] [writing-mode:vertical-lr]">Scroll To Discover</span>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-brand-secondary mb-8 tracking-tighter">Featured <span className="text-brand-primary italic">Collections</span></h2>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">Our portfolio features only the most exclusive architectural masterpieces globally.</p>
          </div>
          <Link to="/properties" className="group flex items-center gap-4 bg-brand-secondary text-white px-10 py-5 rounded-[24px] font-black text-xs tracking-widest hover:bg-brand-primary transition-all shadow-premium">
            VIEW ALL PORTFOLIO
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-40">
            <div className="w-16 h-16 border-4 border-brand-primary/10 border-t-brand-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {featuredProperties.map((property, idx) => (
              <div key={property.id} className="animate-slide-up" style={{ animationDelay: `${0.2 * idx}s` }}>
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Features Showcase */}
      <section className="py-32 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="text-center group">
            <div className="w-20 h-20 bg-orange-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 group-hover:bg-brand-primary group-hover:rotate-6 transition-all duration-500">
              <Compass className="w-10 h-10 text-brand-primary group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-black text-brand-secondary mb-4">Elite Discovery</h3>
            <p className="text-gray-500 font-medium leading-relaxed px-4">Find unique properties tailored specifically to your aesthetic and lifestyle preferences.</p>
          </div>
          <div className="text-center group">
            <div className="w-20 h-20 bg-orange-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 group-hover:bg-brand-primary group-hover:rotate-6 transition-all duration-500">
              <ShieldCheck className="w-10 h-10 text-brand-primary group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-black text-brand-secondary mb-4">Trusted Advisors</h3>
            <p className="text-gray-500 font-medium leading-relaxed px-4">Our vetted agents are industry leaders dedicated to providing an unparalleled service experience.</p>
          </div>
          <div className="text-center group">
            <div className="w-20 h-20 bg-orange-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 group-hover:bg-brand-primary group-hover:rotate-6 transition-all duration-500">
              <Zap className="w-10 h-10 text-brand-primary group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-black text-brand-secondary mb-4">Instant Access</h3>
            <p className="text-gray-500 font-medium leading-relaxed px-4">Request visits and connect with sellers in real-time through our state-of-the-art interface.</p>
          </div>
        </div>
      </section>
      
      {/* High-Impact CTA */}
      <section className="relative py-40 overflow-hidden">
        <div className="absolute inset-0 bg-brand-secondary z-0">
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2400&q=80" className="w-full h-full object-cover opacity-20" alt="CTA BG" />
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-brand-secondary via-brand-secondary/90 to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-10 tracking-tighter leading-none animate-slide-up">
              Own Your <br /><span className="text-brand-primary italic underline decoration-white/10">Masterpiece.</span>
            </h2>
            <p className="text-2xl text-gray-400 mb-16 font-medium leading-relaxed">
              Join the Relasto network as an agent or a buyer and start your journey towards excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/register" className="bg-brand-primary text-white px-12 py-6 rounded-[24px] font-black tracking-widest text-sm hover:bg-orange-600 transition-all shadow-brand hover:shadow-brand/40 text-center">
                JOIN THE NETWORK
              </Link>
              <Link to="/properties" className="glass-dark text-white px-12 py-6 rounded-[24px] font-black tracking-widest text-sm hover:bg-white/10 transition-all text-center">
                EXPLORE PROPERTIES
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
