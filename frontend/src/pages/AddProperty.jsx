import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building, DollarSign, MapPin, AlignLeft, Image as ImageIcon, CheckCircle2, ArrowRight, Sparkles, Plus, Home, Loader2 } from 'lucide-react';
import api from '../api';

export default function AddProperty() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
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
  
  // AI Generation State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiTone, setAiTone] = useState('Professional & Formal');
  const [aiFeatures, setAiFeatures] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      await api.post(`properties/${createdPropertyId}/upload_image/`, uploadData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to upload image. Property was created though.');
      setLoading(false);
    }
  };

  const handleGenerateDescription = async () => {
    if (!formData.title || !formData.price || !formData.address) {
      setError("Please fill out the Listing Title, Price, and Location first to generate a description.");
      return;
    }

    setAiLoading(true);
    setAiError('');

    try {
      // PROMPT ENGINEERING: System prompt forces Gemini to behave as a 
      // Pakistani real estate copywriter with strict output rules —
      // no filler text, exactly 3 paragraphs, local terminology only.

      // DYNAMIC CONTEXT INJECTION: All form values (title, price, 
      // location, beds, baths, tone, features) are injected here so 
      // Gemini has full property context before generating.
      const prompt = `You are an elite, highly professional real estate copywriter. Write a compelling, Pakistani real estate listing description for the following property.
Title: ${formData.title}
Price: PKR ${formData.price}
Location: ${formData.address}
Property Type: ${formData.property_type}
Status: For ${formData.status === 'sale' ? 'Sale' : 'Rent'}
Bedrooms: ${formData.bedrooms}
Bathrooms: ${formData.bathrooms}
Area: ${formData.sqft}
Tone: ${aiTone}
Key Features: ${aiFeatures || 'None specific'}

Write EXACTLY 3 compelling paragraphs. Make it sound extremely premium and persuasive. Do not include any placeholder text or conversational filler. Output ONLY the description.`;

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          errData.error?.message || `API Error: ${response.status}`
        );
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error("AI returned no response. Please try again.");
      }

      setFormData(prev => ({ ...prev, description: text.trim() }));

    } catch (error) {
      setAiError("Could not generate description: " + error.message);
      // Display this error on screen — do NOT just console.log it
      
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen pt-40 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
        
        <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-premium border border-gray-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/5 rounded-full blur-[100px] -mr-20 -mt-20 z-0 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-100/50 rounded-full blur-[80px] -ml-20 -mb-20 z-0"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-primary text-white flex items-center justify-center shadow-brand">
                    {step === 1 ? <Plus className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
                </div>
                <div>
                    <h1 className="text-4xl font-black text-brand-secondary tracking-tighter">
                        {step === 1 ? 'Market an' : 'Visual'} <span className="text-brand-primary italic">{step === 1 ? 'Estate' : 'Identity'}</span>
                    </h1>
                </div>
            </div>
            
            <p className="text-xl text-gray-500 font-medium italic mb-12">
              {step === 1 
                ? 'Curate the details of your new listing for the elite market.'
                : 'Upload the primary visual masterpiece for this property.'}
            </p>

            {error && (
              <div className="mb-10 p-5 bg-red-50 border border-red-100 text-red-600 rounded-[20px] text-sm font-black uppercase tracking-widest flex items-center gap-4 animate-scale-in">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                {error}
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleCreateProperty} className="space-y-10">
                
                <div className="group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 transition-colors group-focus-within:text-brand-primary">Listing Title</label>
                  <div className="relative">
                    <Building className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-brand-primary transition-colors" />
                    <input 
                      type="text" 
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. The Sapphire Heights Penthouse" 
                      className="w-full pl-16 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all font-semibold text-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="group">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Investment Price ($)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-brand-primary transition-colors" />
                      <input 
                        type="number" 
                        name="price"
                        required
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="5,500,000" 
                        className="w-full pl-16 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all font-semibold text-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Contract Status</label>
                    <select 
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all font-bold appearance-none text-lg"
                    >
                      <option value="sale">For Purchase</option>
                      <option value="rent">For Lease</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-gray-50 rounded-[32px] border border-gray-100">
                  <div>
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Bedrooms</label>
                    <input 
                      type="number" 
                      name="bedrooms"
                      required
                      min="0"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 font-black text-lg text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Bathrooms</label>
                    <input 
                      type="number" 
                      name="bathrooms"
                      required
                      min="0"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 font-black text-lg text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Sq Footage</label>
                    <input 
                      type="number" 
                      name="sqft"
                      required
                      min="0"
                      value={formData.sqft}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 font-black text-lg text-center"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Location Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-brand-primary transition-colors" />
                    <input 
                      type="text" 
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="e.g. 742 Evergreen Terrace, Springfield" 
                      className="w-full pl-16 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="bg-brand-primary/5 p-8 rounded-[32px] border border-brand-primary/10">
                  <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI Description Assistant
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3">Writing Tone</label>
                      <select 
                        value={aiTone} 
                        onChange={(e) => setAiTone(e.target.value)} 
                        className="w-full px-6 py-4 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all font-bold appearance-none text-sm"
                      >
                        <option value="Professional & Formal">Professional & Formal</option>
                        <option value="Warm & Inviting">Warm & Inviting</option>
                        <option value="Luxury & Premium">Luxury & Premium</option>
                        <option value="Brief & Factual">Brief & Factual</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3">Key Features (Optional)</label>
                      <input 
                        type="text" 
                        value={aiFeatures} 
                        onChange={(e) => setAiFeatures(e.target.value)} 
                        placeholder="e.g. corner plot, pool" 
                        className="w-full px-6 py-4 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all font-semibold text-sm"
                      />
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleGenerateDescription}
                    disabled={aiLoading}
                    className="w-full bg-white border-2 border-brand-primary text-brand-primary font-black py-4 rounded-xl transition-all hover:bg-brand-primary hover:text-white disabled:opacity-50 flex items-center justify-center gap-3 tracking-[0.2em] text-[10px] uppercase"
                  >
                    {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {aiLoading ? 'GENERATING WITH GEMINI...' : 'AUTO-GENERATE NARRATIVE'}
                  </button>
                  {aiError && (
                    <div style={{ color: 'red', marginTop: '8px', fontSize: '14px' }}>
                      ⚠️ {aiError}
                    </div>
                  )}
                </div>

                <div className="group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Narrative Description</label>
                  <div className="relative">
                    <AlignLeft className="absolute left-6 top-6 text-gray-300 w-5 h-5 group-focus-within:text-brand-primary transition-colors" />
                    <textarea 
                      name="description"
                      required
                      rows="8"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Craft a compelling story for this property..." 
                      className="w-full pl-16 pr-6 py-6 bg-gray-50 border border-gray-100 rounded-[32px] focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all font-semibold resize-none text-lg leading-relaxed"
                    ></textarea>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-brand-secondary text-white font-black py-6 px-12 rounded-[24px] transition-all shadow-premium hover:bg-brand-primary transform hover:-translate-y-1 disabled:opacity-50 flex items-center justify-center gap-4 tracking-[0.2em] text-sm uppercase"
                  >
                    {loading ? 'PROCESSING...' : 'PROCEED TO MEDIA'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleImageUpload} className="space-y-12 animate-slide-up">
                
                <div className="relative group overflow-hidden bg-gray-50 rounded-[40px] border-4 border-dashed border-gray-100 p-16 text-center hover:border-brand-primary/30 hover:bg-orange-50/30 transition-all cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*"
                    required
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  <div className="relative z-10">
                    <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                        <ImageIcon className="w-10 h-10 text-brand-primary" />
                    </div>
                    <h3 className="text-2xl font-black text-brand-secondary mb-2 tracking-tight">
                        {imageFile ? imageFile.name : 'Select Primary Masterpiece'}
                    </h3>
                    <p className="text-gray-400 font-medium italic">
                        {imageFile ? 'Asset localized and ready for upload' : 'High-resolution JPEG or PNG recommended'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  <button 
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="flex-1 bg-white border-2 border-gray-100 text-gray-400 font-black py-5 px-10 rounded-2xl transition-all hover:bg-gray-50 tracking-widest text-xs uppercase"
                  >
                    POSTPONE MEDIA
                  </button>
                  <button 
                    type="submit" 
                    disabled={!imageFile || loading}
                    className="flex-1 bg-brand-primary text-white font-black py-5 px-10 rounded-2xl transition-all shadow-brand hover:shadow-brand/40 transform hover:-translate-y-1 disabled:opacity-50 flex items-center justify-center gap-3 tracking-widest text-xs uppercase"
                  >
                    {loading ? 'TRANSMITTING...' : 'FINALIZE LISTING'}
                    <Sparkles className="w-4 h-4" />
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
