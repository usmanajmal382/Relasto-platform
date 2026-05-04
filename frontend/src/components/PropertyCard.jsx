import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, User } from 'lucide-react';

export default function PropertyCard({ property }) {
  // Use first image if available, else a premium placeholder
  const imageUrl = property.images?.length > 0 
    ? property.images[0].image 
    : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={property.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 uppercase tracking-wider">
          {property.status === 'sale' ? 'For Sale' : 'For Rent'}
        </div>
        <div className="absolute top-4 right-4 bg-brand-primary/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
          {property.property_type}
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1 flex-1 pr-4">{property.title}</h3>
          <p className="text-xl font-extrabold text-brand-primary whitespace-nowrap">
            ${parseFloat(property.price).toLocaleString()}
          </p>
        </div>
        
        <div className="flex items-center text-gray-500 mb-6 text-sm">
          <MapPin className="w-4 h-4 mr-1 text-brand-primary shrink-0" />
          <span className="line-clamp-1">{property.address}</span>
        </div>

        {/* We can map specific features if they exist, else show placeholders to maintain design */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 py-4 border-y border-gray-100">
          <div className="flex flex-col items-center justify-center text-gray-600">
            <Bed className="w-4 h-4 sm:w-5 sm:h-5 mb-1 text-gray-400" />
            <span className="text-xs sm:text-sm font-semibold">3 Beds</span>
          </div>
          <div className="flex flex-col items-center justify-center text-gray-600 border-x border-gray-100">
            <Bath className="w-4 h-4 sm:w-5 sm:h-5 mb-1 text-gray-400" />
            <span className="text-xs sm:text-sm font-semibold">2 Baths</span>
          </div>
          <div className="flex flex-col items-center justify-center text-gray-600">
            <Square className="w-4 h-4 sm:w-5 sm:h-5 mb-1 text-gray-400" />
            <span className="text-xs sm:text-sm font-semibold">2000 sqft</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center text-brand-primary">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Agent</p>
              <p className="text-sm font-bold text-gray-900">{property.agent?.first_name || property.agent?.username || 'Relasto Agent'}</p>
            </div>
          </div>
          <Link 
            to={`/properties/${property.id}`}
            className="text-brand-primary font-semibold text-sm hover:text-orange-700 transition"
          >
            View Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
