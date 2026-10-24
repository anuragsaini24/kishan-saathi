import React from 'react';
import {
  Sprout,
  Activity,
  Mic,
  CloudSun,
  BookOpen,
  PhoneCall,
  Languages,
  Sparkles,
} from 'lucide-react';
import { Language } from '../types/farming';

interface NavbarProps {
  activeTab: 'doctor' | 'assistant' | 'weather' | 'advisory';
  setActiveTab: (tab: 'doctor' | 'assistant' | 'weather' | 'advisory') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
}) => {
  const isHi = language === 'hi';

  const navItems = [
    {
      id: 'doctor' as const,
      label: isHi ? 'फसल डॉक्टर' : 'AI Crop Doctor',
      sub: isHi ? 'रोग पहचान व उपचार' : 'Disease Detection',
      icon: Activity,
    },
    {
      id: 'assistant' as const,
      label: isHi ? 'किसान साथी बोल' : 'Voice & Chat',
      sub: isHi ? 'हिन्दी आवाज सहायक' : 'Hindi / English AI',
      icon: Mic,
    },
    {
      id: 'weather' as const,
      label: isHi ? 'मौसम अलर्ट' : 'Weather Alerts',
      sub: isHi ? 'स्प्रे व सिंचाई समय' : 'Spraying & Rain Advisory',
      icon: CloudSun,
    },
    {
      id: 'advisory' as const,
      label: isHi ? 'फसल सलाह' : 'Crop Advisory',
      sub: isHi ? 'बुवाई, पोषण व कीट' : 'Field Guides & IPM',
      icon: BookOpen,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top Banner with Gemma Open-Source Badge & Helpline */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-emerald-700/60 text-emerald-200 px-2 py-0.5 rounded-full text-[11px] font-medium border border-emerald-600/40">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Powered by Gemma Open-Source AI
            </span>
            <span className="hidden sm:inline text-emerald-200/80">|</span>
            <span className="hidden sm:inline text-emerald-100">
              {isHi
                ? 'भारतीय किसानों के लिए आधुनिक एआई साथी'
                : 'Empowering Indian Farmers with Open-Source Agri-Intelligence'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:18001801551"
              className="inline-flex items-center gap-1.5 text-emerald-100 hover:text-white transition-colors bg-emerald-800/80 hover:bg-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-600/30 font-medium"
              title="Kisan Call Centre Toll-Free (Govt. of India)"
            >
              <PhoneCall className="w-3 h-3 text-emerald-300 animate-pulse" />
              <span>{isHi ? 'किसान हेल्पलाइन' : 'Kisan Helpline'}: 1800-180-1551</span>
            </a>

            <button
              onClick={() => setLanguage(isHi ? 'en' : 'hi')}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors border border-white/20 cursor-pointer"
              title="Switch Language / भाषा बदलें"
            >
              <Languages className="w-3.5 h-3.5 text-amber-300" />
              <span>{isHi ? 'English' : 'हिन्दी'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo & Tagline */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('doctor')}
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-lime-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-emerald-950 font-sans">
                  KisanSaathi <span className="text-emerald-600">AI</span>
                </span>
                <span className="text-lg">🌱</span>
              </div>
              <p className="text-xs font-semibold text-emerald-700 tracking-wide uppercase">
                Detect Early. Act Smarter. Save Crops.
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 p-1.5 rounded-2xl border border-stone-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-700/20'
                      : 'text-stone-600 hover:text-emerald-800 hover:bg-stone-200/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-700'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick CTA on desktop */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setActiveTab('assistant')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-sm border border-emerald-200 transition-colors cursor-pointer"
            >
              <Mic className="w-4 h-4 text-emerald-600" />
              <span>{isHi ? 'आवाज से पूछें' : 'Ask with Voice'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar (Tabs) */}
      <div className="md:hidden border-t border-stone-100 bg-stone-50/90 px-2 py-1.5 overflow-x-auto scrollbar-none">
        <div className="flex items-center justify-around gap-1 min-w-[360px]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center py-1.5 px-2.5 rounded-xl text-xs font-medium transition-colors flex-1 cursor-pointer ${
                  isActive
                    ? 'text-emerald-800 bg-emerald-100/80 font-bold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-emerald-700' : 'text-stone-500'}`} />
                <span className="truncate max-w-[85px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
