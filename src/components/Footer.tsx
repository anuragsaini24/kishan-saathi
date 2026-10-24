import React from 'react';
import { Sprout, PhoneCall, Heart, Sparkles, ShieldCheck, ExternalLink } from 'lucide-react';
import { Language } from '../types/farming';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const isHi = language === 'hi';

  return (
    <footer className="mt-16 bg-stone-900 text-stone-300 border-t border-stone-800">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-lime-500 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white">
                KisanSaathi <span className="text-emerald-400">AI</span> 🌱
              </span>
            </div>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              {isHi
                ? 'गेमा ओपन-सोर्स एआई मॉडल्स द्वारा संचालित भारतीय किसानों का आधुनिक फसल स्वास्थ्य साथी। बीमारी की शीघ्र पहचान, सटीक मौसम अलर्ट एवं फसल सलाह।'
                : 'Modern AI-powered agricultural companion for Indian farmers powered by Gemma open-source models. Early plant disease detection, intelligent agro-meteorology, and Hindi voice chat.'}
            </p>
            <div className="inline-flex items-center gap-1.5 bg-emerald-950/70 text-emerald-300 border border-emerald-800/80 px-2.5 py-1 rounded-full text-[11px] font-semibold">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Gemma 2 Open Models • ICAR & CIBRC Protocols</span>
            </div>
          </div>

          {/* Emergency & Govt Portals */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {isHi ? 'महत्वपूर्ण हेल्पलाइन' : 'Agricultural Helplines'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="tel:18001801551"
                  className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Kisan Call Centre: 1800-180-1551</span>
                </a>
              </li>
              <li className="text-stone-400">
                {isHi ? 'समय: प्रातः 6:00 से रात्रि 10:00 (सभी 22 भाषाओं में)' : 'Toll-free 6:00 AM - 10:00 PM (All Indian languages)'}
              </li>
              <li>
                <span className="text-stone-400">{isHi ? 'कृषि विज्ञान केंद्र (KVK): ' : 'KVK Network: '}</span>
                <span className="text-emerald-400 font-medium">730+ Centers in India</span>
              </li>
            </ul>
          </div>

          {/* AI Disclaimer */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {isHi ? 'सुरक्षा एवं अस्वीकरण' : 'AI Safety Notice'}
            </h4>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              {isHi
                ? 'यह प्रणाली कंप्यूटर विज़न व एआई अनुमानों पर आधारित है। रासायनिक छिड़काव से पूर्व स्थानीय कृषि अधिकारी या केवीके विशेषज्ञ से पुष्टि अवश्य करें।'
                : 'KisanSaathi AI predictions provide early triage assistance and do not substitute certified laboratory foliar/soil tests. Always verify severe outbreaks with district agronomists.'}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} KisanSaathi AI 🌱 • Detect Early. Act Smarter. Save Crops.</p>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Open Source • Built for Indian Agriculture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
