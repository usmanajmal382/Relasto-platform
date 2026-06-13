import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, User, ArrowRight, Trash2 } from 'lucide-react';

export default function PropertyCard({ property, onDelete }) {
  // Use first image if available, else a premium placeholder
  const imageUrl = property.images?.length > 0 
    ? property.images[0].image 
    : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-white rounded-[32px] overflow-hidden shadow-premium hover:shadow-brand/20 transition-all duration-500 border border-gray-50 group flex flex-col h-full transform hover:-translate-y-2 animate-scale-in relative">
      {onDelete && (
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
          className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md p-3 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-lg"
          title="Delete Property"
        >
          <Trash2 size={18} />
        </button>
      )}
      
      <div className="relative h-72 shrink-0 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={property.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-2xl text-[10px] font-black text-gray-900 uppercase tracking-widest shadow-lg">
            {property.status === 'sale' ? 'For Sale' : 'For Rent'}
          </div>
          <div className="bg-brand-primary/90 backdrop-blur-md px-4 py-1.5 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest shadow-lg">
            {property.property_type}
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
           <Link 
            to={`/properties/${property.id}`}
            className="w-full bg-white text-brand-secondary font-black py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-primary hover:text-white transition-colors shadow-xl"
          >
            Quick View <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      
      <div className="p-8 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-black text-gray-900 line-clamp-1 flex-1 pr-4 tracking-tight group-hover:text-brand-primary transition-colors">
            {property.title}
          </h3>
        </div>

        <div className="flex items-center text-gray-400 mb-8 font-medium">
          <MapPin className="w-4 h-4 mr-2 text-brand-primary shrink-0" />
          <span className="line-clamp-1 text-sm">{property.address}</span>
        </div>
        
        <div className="flex justify-between items-center mb-8 bg-gray-50/50 p-4 rounded-3xl border border-gray-50">
          <div className="flex flex-col items-center">
            <span className="text-gray-900 font-black text-lg">{property.bedrooms}</span>
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Beds</span>
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <div className="flex flex-col items-center">
            <span className="text-gray-900 font-black text-lg">{property.bathrooms}</span>
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Baths</span>
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <div className="flex flex-col items-center">
            <span className="text-gray-900 font-black text-lg">{property.sqft}</span>
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">SQFT</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
          <p className="text-2xl font-black text-brand-primary tracking-tighter">
            ${parseFloat(property.price).toLocaleString()}
          </p>
          
          <div className="flex items-center -space-x-3">
             <div className="w-10 h-10 shrink-0 rounded-2xl overflow-hidden border-2 border-white shadow-md flex items-center justify-center bg-brand-secondary z-10">
              {property.agent?.profile?.profile_picture ? (
                <img src={property.agent.profile.profile_picture} className="w-full h-full object-cover" alt="Agent" />
              ) : (
                <User className="w-5 h-5 text-white/50" />
              )}
            </div>
            <div className="bg-gray-100 text-[10px] font-black text-gray-500 pl-6 pr-4 py-1.5 rounded-r-xl border border-gray-50">
               AGENCY
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
