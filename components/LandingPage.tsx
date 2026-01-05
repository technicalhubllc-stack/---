
import React, { useState, useEffect } from 'react';
import { Language, getTranslation } from '../services/i18nService';

interface LandingPageProps {
  onStart: () => void;
  onRoadmap: () => void;
  onImpact: () => void;
  lang: Language;
}

const CINEMATIC_IMAGES = [
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2400",
  "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&q=80&w=2400",
  "https://images.unsplash.com/photo-1506477331477-33d6d8b3dc85?auto=format&fit=crop&q=80&w=2400",
  "https://images.unsplash.com/photo-1623151820421-9705a6111195?auto=format&fit=crop&q=80&w=2400"
];

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onRoadmap, onImpact, lang }) => {
  const t = getTranslation(lang);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % CINEMATIC_IMAGES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden bg-deep-navy">
      <style>{`
        @keyframes cinematic-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .bg-layer {
          position: absolute;
          inset: 0;
          transition: opacity 2.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-cinematic {
          animation: cinematic-zoom 20s ease-in-out infinite alternate;
        }
        .cinematic-overlay {
          background: linear-gradient(to bottom, rgba(2, 6, 23, 0.3) 0%, rgba(2, 6, 23, 0.95) 100%);
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-8 md:px-24 overflow-hidden">
        
        {/* Background Layers for Cross-fade */}
        <div className="absolute inset-0 z-0">
          {CINEMATIC_IMAGES.map((img, idx) => (
            <div 
              key={idx}
              className={`bg-layer ${idx === currentIdx ? 'opacity-100' : 'opacity-0'}`}
            >
              <img 
                src={img} 
                className={`w-full h-full object-cover brightness-[0.3] contrast-[1.05] ${idx === currentIdx ? 'animate-cinematic' : ''}`}
                alt={`Cinematic Background ${idx}`}
              />
            </div>
          ))}
          <div className="absolute inset-0 cinematic-overlay z-10"></div>
          <div className="absolute inset-0 cinematic-grid opacity-25 z-15"></div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto w-full relative z-30">
          <div className="max-w-5xl space-y-12 animate-reveal">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-5 py-2 glass-premium rounded-full border border-white/10 shadow-glow">
                <span className="w-1.5 h-1.5 rounded-full bg-electric-blue animate-pulse"></span>
                <p className="text-white font-black text-[9px] uppercase tracking-[0.4em]">Sovereign Strategic Intelligence</p>
              </div>
              <h1 className="text-6xl md:text-[8rem] font-black leading-[0.9] text-white tracking-tighter">
                بناء الكيانات <br/> 
                <span className="text-shimmer">بسيادة رقمية.</span>
              </h1>
            </div>
            
            <p className="text-slate-300 text-xl md:text-3xl font-medium leading-relaxed max-w-4xl border-r-[10px] border-electric-blue pr-10">
              نهج استباقي لتحويل الرؤى إلى <span className="text-white font-black">مؤسسات سيادية</span>، <br className="hidden md:block" />
              عبر دمج ذكاء Gemini الاستراتيجي مع دقة التنفيذ الميداني.
            </p>
            
            <div className="flex flex-wrap gap-6 pt-12">
              <button 
                onClick={onStart} 
                className="bg-electric-blue text-white px-14 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all btn-glow shadow-premium active:scale-95 flex items-center gap-4"
              >
                <span>{t.hero.apply}</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
              <button 
                onClick={onRoadmap} 
                className="px-12 py-6 glass-premium text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all border border-white/10 rounded-[2.5rem]"
              >
                {t.hero.methodology}
              </button>
            </div>
          </div>
        </div>

        {/* Cinematic Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 opacity-40 group cursor-default hidden md:block">
           <div className="w-[1px] h-16 bg-gradient-to-b from-electric-blue to-transparent mx-auto group-hover:h-24 transition-all duration-1000"></div>
           <p className="text-white text-[8px] font-black uppercase tracking-[0.5em] mt-6" style={{writingMode: 'vertical-rl'}}>Explore Potential</p>
        </div>
      </section>

      {/* Stats Board */}
      <section className="px-12 py-32 bg-white relative z-20">
        <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-20">
              {[
                { label: t.stats.startups, val: '185+', icon: '🚀' },
                { label: t.stats.capital, val: '$42M', icon: '💰' },
                { label: t.stats.experts, val: '65+', icon: '🧠' },
                { label: t.stats.countries, val: '14', icon: '🌍' }
              ].map((s, i) => (
                <div key={i} className="space-y-4 group border-r-2 border-slate-50 pr-8 hover:border-electric-blue transition-all duration-500">
                   <div className="text-3xl mb-2 grayscale group-hover:grayscale-0 transition-all duration-700 opacity-40 group-hover:opacity-100">{s.icon}</div>
                   <p className="text-6xl font-black text-slate-900 tracking-tighter tabular-nums group-hover:text-electric-blue transition-colors">{s.val}</p>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">{s.label}</p>
                </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
};
