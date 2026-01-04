
import React, { useState, useEffect } from 'react';
import { Language, getTranslation } from '../services/i18nService';

interface LandingPageProps {
  onStart: () => void;
  onRoadmap: () => void;
  onImpact: () => void;
  lang: Language;
}

const CINEMATIC_IMAGES = [
  "https://images.unsplash.com/photo-1632731871210-911e92d77d70?auto=format&fit=crop&q=80&w=2000", 
  "https://images.unsplash.com/photo-1641372756627-d0d00f6b33cc?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1623151820421-97?auto=format&fit=crop&q=80&w=2000"
];

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onRoadmap, onImpact, lang }) => {
  const t = getTranslation(lang);
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % CINEMATIC_IMAGES.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="animate-fade-in relative overflow-hidden">
      <style>{`
        @keyframes cinematic-zoom-pan {
          0% { transform: scale(1.1) translate(0, 0); }
          100% { transform: scale(1.05) translate(-0.5%, -0.5%); }
        }
        .animate-hero-bg {
          animation: cinematic-zoom-pan 15s ease-out forwards;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-6 md:px-24 overflow-hidden bg-slate-950">
        
        {/* Background Layers */}
        <div className="absolute inset-0 z-0">
          {CINEMATIC_IMAGES.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-[4000ms] ease-in-out ${idx === bgIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <img 
                src={img} 
                className={`w-full h-full object-cover brightness-[0.35] grayscale-[20%] ${idx === bgIndex ? 'animate-hero-bg' : ''}`}
                alt="Saudi Landmark"
              />
            </div>
          ))}
          {/* Technical Grid Overlay */}
          <div className="absolute inset-0 cinematic-grid opacity-30 z-10"></div>
          {/* Deep Vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950 z-15"></div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto w-full relative z-20">
          <div className="max-w-3xl space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-5 py-2 glass-premium rounded-full border border-white/10 shadow-2xl">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <p className="text-white font-black text-[9px] uppercase tracking-[0.3em]">Kingdom Strategic Core</p>
              </div>
              <h1 className="text-7xl md:text-[10rem] font-black leading-[0.85] text-white tracking-tighter">
                طموح <br/> 
                <span className="text-blue-500 text-shimmer">يعانق السماء.</span>
              </h1>
            </div>
            
            <p className="text-slate-300 text-xl md:text-2xl font-medium leading-relaxed max-w-2xl border-r-4 border-blue-600 pr-8">
              بيزنس ديفلوبرز: المسرعة الذكية التي تحول الرؤية الجريئة إلى مخرجات استثمارية عالمية، بدمج الذكاء الاصطناعي مع الخبرة الاستراتيجية.
            </p>
            
            <div className="flex flex-wrap gap-6 pt-6">
              <button 
                onClick={onStart} 
                className="bg-blue-600 text-white px-12 py-5 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all btn-glow shadow-2xl active:scale-95"
              >
                {t.hero.apply}
              </button>
              <button 
                onClick={onRoadmap} 
                className="px-10 py-5 glass-premium text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10"
              >
                {t.hero.methodology}
              </button>
            </div>
          </div>
        </div>

        {/* Floating Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 opacity-40">
           <div className="w-px h-16 bg-gradient-to-b from-white to-transparent mx-auto"></div>
           <p className="text-white text-[8px] font-black uppercase tracking-[0.4em] mt-4 rotate-180" style={{writingMode: 'vertical-rl'}}>Explore</p>
        </div>
      </section>

      {/* Stats Board */}
      <section className="px-12 py-24 bg-white relative z-20">
        <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24">
              {[
                { label: t.stats.startups, val: '180+' },
                { label: t.stats.capital, val: '$42M' },
                { label: t.stats.experts, val: '65+' },
                { label: t.stats.countries, val: '14' }
              ].map((s, i) => (
                <div key={i} className="space-y-3 group border-r border-slate-100 pr-8">
                   <p className="text-5xl font-black text-slate-900 tracking-tighter group-hover:text-blue-600 transition-colors">{s.val}</p>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">{s.label}</p>
                </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
};
