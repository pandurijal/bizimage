import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Image as ImageIcon, ShoppingBag, ShieldCheck } from 'lucide-react';
import Button from './Button';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b bg-white/80 backdrop-blur-md fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">BizImage.ai</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
            <Button onClick={() => navigate('/dashboard')}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          AI Product Photography <br className="hidden md:block" />
          <span className="text-indigo-600">in Seconds.</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          Stop spending thousands on photoshoots. Upload your product or type a prompt, 
          and get commercial-grade business images instantly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => navigate('/dashboard')} className="shadow-xl shadow-indigo-200">
            Generate Free Images <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
        <p className="mt-4 text-sm text-slate-500">No credit card required for trial • 10 Free Credits</p>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Text-to-Ad Creative</h3>
              <p className="text-slate-600">Describe your ad concept and get 4 unique variations instantly. Perfect for social media visuals.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Product Scene Gen</h3>
              <p className="text-slate-600">Upload a simple product photo. We place it in a studio, lifestyle, or premium setting automatically.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Commercial Safe</h3>
              <p className="text-slate-600">Built for business. Secure storage, private gallery, and commercial usage rights for all generated images.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2024 BizImage.ai MVP. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;