import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, DollarSign, MapPin, AlignLeft, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import api from '../api';

export default function AddProperty() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Details, 2: Images & Success
  const [createdPropertyId, setCreatedPropertyId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    status: 'sale',
    property_type: 'residential',
    address: '',
    bedrooms: 0,
    bathrooms: 0,
    sqft: 0
  });

  const [imageFile, setImageFile] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateProperty = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('properties/', formData);
      setCreatedPropertyId(response.data.id);
      setStep(2);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to create property. Check your inputs.');
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!imageFile || !createdPropertyId) return;

    setLoading(true);
    setError('');

    const uploadData = new FormData();
    uploadData.append('image', imageFile);
    uploadData.append('is_primary', 'true');

    try {
      await api.post(`properties/${createdPropertyId}/upload_image/`, uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to upload image. Property was created though.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
        
        <div className="bg-white rounded-3xl p-6 md:p-14 shadow-xl border border-gray-100 relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-20 -mt-20 z-0"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              {step === 1 ? 'List a New Property' : 'Add Property Image'}
            </h1>
            <p className="text-brand-muted mb-10">
              {step === 1 
                ? 'Fill out the details below to create your new real estate listing.'
                : 'Great! Now upload a stunning primary image for your property.'}
            </p>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleCreateProperty} className="space-y-6">
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Property Title</label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                      type="text" 
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Modern Luxury Villa in Beverly Hills" 
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input 
                        type="number" 
                        name="price"
                        required
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="1500000" 
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <select 
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition bg-gray-50 focus:bg-white appearance-none"
                    >
                      <option value="sale">For Sale</option>
                      <option value="rent">For Rent</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bedrooms</label>
                    <input 
                      type="number" 
                      name="bedrooms"
                      required
                      min="0"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bathrooms</label>
                    <input 
                      type="number" 
                      name="bathrooms"
                      required
                      min="0"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Sq Ft</label>
                    <input 
                      type="number" 
                      name="sqft"
                      required
                      min="0"
                      value={formData.sqft}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                      type="text" 
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main St, City, ST" 
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <div className="relative">
                    <AlignLeft className="absolute left-4 top-5 text-gray-400 w-5 h-5" />
                    <textarea 
                      name="description"
                      required
                      rows="5"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe the property's best features..." 
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition bg-gray-50 focus:bg-white resize-none"
                    ></textarea>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-lg shadow-brand-primary/30 flex items-center justify-center disabled:opacity-70"
                  >
                    {loading ? 'Creating Listing...' : 'Continue to Images'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleImageUpload} className="space-y-8 animate-slide-up">
                
                <div className="border-2 border-dashed border-brand-primary/30 bg-orange-50/50 rounded-2xl p-10 text-center hover:bg-orange-50 transition cursor-pointer relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    required
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <ImageIcon className="w-16 h-16 text-brand-primary/50 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {imageFile ? imageFile.name : 'Click or drag image to upload'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {imageFile ? 'Ready to upload' : 'JPEG, PNG up to 10MB'}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-8 rounded-xl transition-colors"
                  >
                    Skip for now
                  </button>
                  <button 
                    type="submit" 
                    disabled={!imageFile || loading}
                    className="flex-1 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-lg shadow-brand-primary/30 flex items-center justify-center disabled:opacity-70"
                  >
                    {loading ? 'Uploading...' : 'Upload & Finish'}
                  </button>
                </div>
              </form>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
