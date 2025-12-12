import React, { useState, useEffect } from 'react';
import { Zap, LayoutGrid, Image as ImageIcon, CreditCard, Wand2, PlusCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User, GeneratedImage, ScenePreset } from '../types';
import { SCENES, CREDIT_PACKAGES } from '../constants';
import * as GeminiService from '../services/geminiService';
import Button from './Button';
import ImageGrid from './ImageGrid';

// Mock Data Management
const getStoredUser = (): User => {
  const stored = localStorage.getItem('bizimage_user');
  return stored ? JSON.parse(stored) : { id: 'u1', email: 'user@example.com', credits: 10 };
};

const getStoredImages = (): GeneratedImage[] => {
  const stored = localStorage.getItem('bizimage_history');
  return stored ? JSON.parse(stored) : [];
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>(getStoredUser());
  const [images, setImages] = useState<GeneratedImage[]>(getStoredImages());
  const [activeTab, setActiveTab] = useState<'text' | 'product' | 'gallery' | 'credits'>('text');
  
  // Text to Image State
  const [textPrompt, setTextPrompt] = useState('');
  const [isGeneratingText, setIsGeneratingText] = useState(false);

  // Product to Scene State
  const [productImage, setProductImage] = useState<string | null>(null);
  const [selectedScene, setSelectedScene] = useState<ScenePreset>(ScenePreset.STUDIO);
  const [productPrompt, setProductPrompt] = useState('');
  const [isGeneratingProduct, setIsGeneratingProduct] = useState(false);

  // Persist State
  useEffect(() => {
    localStorage.setItem('bizimage_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('bizimage_history', JSON.stringify(images));
  }, [images]);

  const handleLogout = () => {
    navigate('/');
  };

  const deductCredit = (amount: number) => {
    setUser(prev => ({ ...prev, credits: prev.credits - amount }));
  };

  const handleDeleteImage = (id: string) => {
    if (window.confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
      setImages(prev => prev.filter(img => img.id !== id));
    }
  };

  const handleTextGeneration = async () => {
    if (user.credits < 1) {
      setActiveTab('credits');
      return;
    }
    if (!textPrompt.trim()) return;

    setIsGeneratingText(true);
    try {
      const urls = await GeminiService.generateTextToImage(textPrompt);
      
      const newImages: GeneratedImage[] = urls.map(url => ({
        id: crypto.randomUUID(),
        url,
        prompt: textPrompt,
        type: 'text-to-image',
        createdAt: Date.now()
      }));

      setImages(prev => [...newImages, ...prev]);
      deductCredit(1);
      setTextPrompt('');
    } catch (err) {
      alert("Generation failed. Please try again.");
    } finally {
      setIsGeneratingText(false);
    }
  };

  const handleProductUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductGeneration = async () => {
    if (user.credits < 1) {
      setActiveTab('credits');
      return;
    }
    if (!productImage) {
      alert("Please upload a product image first.");
      return;
    }

    setIsGeneratingProduct(true);
    try {
      const sceneConfig = SCENES.find(s => s.id === selectedScene);
      if (!sceneConfig) return;

      const urls = await GeminiService.generateProductScene(productImage, sceneConfig.promptModifier, productPrompt);
      
      const newImages: GeneratedImage[] = urls.map(url => ({
        id: crypto.randomUUID(),
        url,
        prompt: `Product in ${sceneConfig.label}: ${productPrompt}`,
        type: 'product-to-scene',
        createdAt: Date.now()
      }));

      setImages(prev => [...newImages, ...prev]);
      deductCredit(1);
    } catch (err) {
      alert("Generation failed. Please try a clearer product image.");
    } finally {
      setIsGeneratingProduct(false);
    }
  };

  const handleBuyCredits = (amount: number) => {
    // Mock Payment
    const confirmed = window.confirm(`Confirm purchase of ${amount} credits?`);
    if (confirmed) {
      setUser(prev => ({ ...prev, credits: prev.credits + amount }));
      alert("Credits added successfully!");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 bg-white border-r border-gray-200 z-10">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Zap className="text-indigo-600 w-6 h-6 mr-2" />
          <span className="font-bold text-lg text-slate-800">BizImage.ai</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('text')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'text' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-gray-50'}`}
          >
            <Wand2 className="w-5 h-5 mr-3" />
            Text to Image
          </button>
          <button 
            onClick={() => setActiveTab('product')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'product' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-gray-50'}`}
          >
            <ImageIcon className="w-5 h-5 mr-3" />
            Product Scene
          </button>
          <button 
            onClick={() => setActiveTab('gallery')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'gallery' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-gray-50'}`}
          >
            <LayoutGrid className="w-5 h-5 mr-3" />
            My Images
          </button>
          <button 
            onClick={() => setActiveTab('credits')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'credits' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-gray-50'}`}
          >
            <CreditCard className="w-5 h-5 mr-3" />
            Buy Credits
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="bg-indigo-50 p-4 rounded-xl mb-4">
            <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wide mb-1">Available Credits</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-indigo-900">{user.credits}</span>
              <button onClick={() => setActiveTab('credits')} className="text-xs bg-indigo-200 hover:bg-indigo-300 text-indigo-800 px-2 py-1 rounded transition-colors">Top up</button>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center text-sm text-slate-500 hover:text-red-600 transition-colors w-full px-2">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center">
            <Zap className="text-indigo-600 w-6 h-6 mr-2" />
            <span className="font-bold">BizImage</span>
          </div>
          <div className="flex gap-2">
            <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded-full">{user.credits} cr</span>
            <button onClick={() => setActiveTab('credits')} className="text-indigo-600"><PlusCircle size={20}/></button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-5xl mx-auto">
          
          {/* TEXT TO IMAGE */}
          {activeTab === 'text' && (
            <div className="space-y-8">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Create Ad Creative from Text</h2>
                <p className="text-slate-500 mb-6">Describe the image you want. Be specific about lighting, style, and mood.</p>
                
                <div className="space-y-4">
                  <textarea 
                    value={textPrompt}
                    onChange={(e) => setTextPrompt(e.target.value)}
                    placeholder="E.g., A minimalist skincare bottle on a marble table with water droplets, bright natural lighting, 4k advertising photography"
                    className="w-full p-4 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px] resize-none text-slate-900 placeholder-slate-400"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Cost: 1 Credit</span>
                    <Button 
                      onClick={handleTextGeneration} 
                      isLoading={isGeneratingText}
                      disabled={!textPrompt}
                      size="lg"
                    >
                      Generate Images
                    </Button>
                  </div>
                </div>
              </div>
              <ImageGrid 
                images={images.filter(i => i.type === 'text-to-image').slice(0, 4)} 
                title="Recent Text Generations" 
                onDelete={handleDeleteImage}
              />
            </div>
          )}

          {/* PRODUCT SCENE */}
          {activeTab === 'product' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h2 className="text-xl font-bold text-slate-800 mb-4">1. Upload Product</h2>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative bg-white">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleProductUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {productImage ? (
                      <img src={productImage} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-sm" />
                    ) : (
                      <div className="space-y-2">
                        <div className="mx-auto w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                          <PlusCircle />
                        </div>
                        <p className="text-sm font-medium text-slate-700">Click to upload product</p>
                        <p className="text-xs text-slate-400">PNG or JPG, max 5MB</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h2 className="text-xl font-bold text-slate-800 mb-4">2. Choose Scene</h2>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {SCENES.map((scene) => (
                      <button
                        key={scene.id}
                        onClick={() => setSelectedScene(scene.id)}
                        className={`p-3 rounded-lg border text-left transition-all ${selectedScene === scene.id ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                      >
                        <span className="block font-medium text-sm text-slate-900">{scene.label}</span>
                        <span className="block text-xs text-slate-500 mt-1 truncate">{scene.description}</span>
                      </button>
                    ))}
                  </div>
                  
                  <label className="block text-sm font-medium text-slate-700 mb-2">Additional details (Optional)</label>
                  <input 
                    type="text"
                    value={productPrompt}
                    onChange={(e) => setProductPrompt(e.target.value)}
                    placeholder="E.g., Add some lemon slices"
                    className="w-full p-2 rounded-lg border border-gray-300 bg-white focus:ring-indigo-500 mb-6 text-slate-900 placeholder-slate-400"
                  />
                  
                  <Button 
                    onClick={handleProductGeneration} 
                    isLoading={isGeneratingProduct} 
                    disabled={!productImage}
                    className="w-full"
                  >
                    Generate Scene (1 Credit)
                  </Button>
                </div>
              </div>
              <ImageGrid 
                images={images.filter(i => i.type === 'product-to-scene').slice(0, 4)} 
                title="Recent Product Scenes" 
                onDelete={handleDeleteImage}
              />
            </div>
          )}

          {/* GALLERY */}
          {activeTab === 'gallery' && (
            <div>
               <h2 className="text-2xl font-bold text-slate-800 mb-6">My Gallery</h2>
               <ImageGrid 
                 images={images} 
                 onDelete={handleDeleteImage}
               />
            </div>
          )}

          {/* BUY CREDITS */}
          {activeTab === 'credits' && (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Top Up Credits</h2>
              <p className="text-center text-slate-500 mb-10">Pay as you go. No subscription required.</p>
              
              <div className="grid md:grid-cols-3 gap-6">
                {CREDIT_PACKAGES.map((pkg, idx) => (
                  <div key={idx} className={`relative bg-white p-6 rounded-2xl border ${pkg.popular ? 'border-indigo-600 ring-1 ring-indigo-600 shadow-lg' : 'border-gray-200 shadow-sm'} flex flex-col`}>
                    {pkg.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span>}
                    <h3 className="text-lg font-bold text-slate-900">{pkg.label}</h3>
                    <div className="mt-4 mb-6">
                      <span className="text-4xl font-extrabold text-slate-900">${pkg.price}</span>
                    </div>
                    <ul className="space-y-3 mb-8 flex-1">
                      <li className="flex items-center text-sm text-slate-600">
                        <Zap className="w-4 h-4 text-indigo-600 mr-2" /> {pkg.credits} Image Generations
                      </li>
                      <li className="flex items-center text-sm text-slate-600">
                        <Zap className="w-4 h-4 text-indigo-600 mr-2" /> Commercial License
                      </li>
                      <li className="flex items-center text-sm text-slate-600">
                        <Zap className="w-4 h-4 text-indigo-600 mr-2" /> High Resolution
                      </li>
                    </ul>
                    <Button onClick={() => handleBuyCredits(pkg.credits)} variant={pkg.popular ? 'primary' : 'outline'} className="w-full">
                      Buy Now
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-3 z-50">
         <button onClick={() => setActiveTab('text')} className={`p-2 rounded-full ${activeTab === 'text' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}><Wand2 size={24}/></button>
         <button onClick={() => setActiveTab('product')} className={`p-2 rounded-full ${activeTab === 'product' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}><ImageIcon size={24}/></button>
         <button onClick={() => setActiveTab('gallery')} className={`p-2 rounded-full ${activeTab === 'gallery' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}><LayoutGrid size={24}/></button>
      </div>
    </div>
  );
};

export default Dashboard;