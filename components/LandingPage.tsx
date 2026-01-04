
import React, { useState, useEffect } from 'react';
import { Language, getTranslation } from '../services/i18nService';

interface LandingPageProps {
  onStart: () => void;
  onRoadmap: () => void;
  onImpact: () => void;
  lang: Language;
}

// صورة حقيقية لجبال طويق تعبر عن القوة والامتداد
const TUWAIQ_HERO = "https://images.unsplash.com/photo-1623151820421-9705a6111195?auto=format&fit=crop&q=80&w=2400";

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onRoadmap, onImpact, lang }) => {
  const t = getTranslation(lang);

  return (
    <div className="animate-fade-in relative overflow-hidden">
      <style>{`
        @keyframes subtle-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.08); }
        }
        .animate-tuwaiq {
          animation: subtle-zoom 25s ease-out forwards;
        }
        .cinematic-overlay {
          background: radial-gradient(circle at center, rgba(2, 6, 23, 0.7) 0%, rgba(2, 6, 23, 0.95) 100%);
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-6 md:px-24 overflow-hidden bg-slate-950">
        
        {/* Background Layers */}
        <div className="absolute inset-0 z-0">
          {/* Base Image with Cinematic Processing */}
          <img 
            src={TUWAIQ_HERO} 
            className="w-full h-full object-cover brightness-[0.25] contrast-[1.1] grayscale-[30%] animate-tuwaiq"
            alt="Tuwaiq Mountains - Strength and Extension"
          />
          
          {/* Dark Overlay (85% Depth) */}
          <div className="absolute inset-0 cinematic-overlay z-10"></div>
          
          {/* Technical Grid Overlay */}
          <div className="absolute inset-0 cinematic-grid opacity-20 z-15"></div>
          
          {/* Bottom Vignette for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-20"></div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto w-full relative z-30">
          <div className="max-w-4xl space-y-14">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-6 py-2.5 glass-premium rounded-full border border-white/10 shadow-2xl">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <p className="text-white font-black text-[10px] uppercase tracking-[0.4em]">Sovereign Strategic Entity</p>
              </div>
              <h1 className="text-5xl md:text-8xl font-black leading-[1.05] text-white tracking-tighter">
                منهجية احتضان <br/> 
                <span className="text-blue-500 text-shimmer">احترافية.</span>
              </h1>
            </div>
            
            <p className="text-slate-300 text-xl md:text-3xl font-medium leading-relaxed max-w-3xl border-r-4 border-blue-600 pr-10">
              لتحويل الأفكار الجريئة إلى <span className="text-white font-black underline underline-offset-8 decoration-blue-500/50">كيانات مستدامة</span>، عبر دمج الذكاء الاصطناعي السيادي مع الخبرة العملية العميقة.
            </p>
            
            <div className="flex flex-wrap gap-8 pt-6">
              <button 
                onClick={onStart} 
                className="bg-blue-600 text-white px-14 py-6 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all btn-glow shadow-3xl active:scale-95"
              >
                {t.hero.apply}
              </button>
              <button 
                onClick={onRoadmap} 
                className="px-12 py-6 glass-premium text-white text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10 rounded-2xl"
              >
                {t.hero.methodology}
              </button>
            </div>
          </div>
        </div>

        {/* Floating Indicator */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-40 opacity-40 group cursor-default">
           <div className="w-px h-20 bg-gradient-to-b from-blue-500 to-transparent mx-auto group-hover:h-24 transition-all duration-700"></div>
           <p className="text-white text-[9px] font-black uppercase tracking-[0.5em] mt-6 rotate-180" style={{writingMode: 'vertical-rl'}}>Tuwaiq Escarpment</p>
        </div>
      </section>

      {/* Stats Board */}
      <section className="px-12 py-32 bg-white relative z-20">
        <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24">
              {[
                { label: t.stats.startups, val: '180+' },
                { label: t.stats.capital, val: '$42M' },
                { label: t.stats.experts, val: '65+' },
                { label: t.stats.countries, val: '14' }
              ].map((s, i) => (
                <div key={i} className="space-y-4 group border-r border-slate-100 pr-10">
                   <p className="text-6xl font-black text-slate-900 tracking-tighter group-hover:text-blue-600 transition-colors">{s.val}</p>
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-tight">{s.label}</p>
                </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
};
