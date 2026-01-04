
import React from 'react';
import { Language, getTranslation } from '../services/i18nService';

interface LandingPageProps {
  onStart: () => void;
  onRoadmap: () => void;
  onImpact: () => void;
  lang: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onRoadmap, onImpact, lang }) => {
  const t = getTranslation(lang);

  return (
    <div className="animate-fade-in bg-white">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center px-12">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
          <div className="lg:col-span-7 space-y-12">
            <h1 className="title-ar !text-6xl md:!text-7xl leading-[1.1] whitespace-pre-line">
              {t.hero.title}
            </h1>
            <p className="text-gray-500 text-xl font-light leading-relaxed max-w-2xl">
              {t.hero.sub}
            </p>
            <div className="flex gap-6 pt-4">
              <button onClick={onStart} className="btn-primary px-12 py-5 text-[11px] uppercase tracking-[0.2em]">{t.hero.apply}</button>
              <button onClick={onRoadmap} className="btn-secondary px-12 py-5 text-[11px] uppercase tracking-[0.2em]">{t.hero.methodology}</button>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
             <div className="aspect-[3/4] bg-gray-50 border border-gray-100 overflow-hidden relative grayscale opacity-80 hover:opacity-100 transition-all duration-1000">
                <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200" alt="Architecture" className="w-full h-full object-cover" />
             </div>
          </div>
        </div>
      </section>

      {/* Stats - Minimalist Grid */}
      <section className="px-12 border-t border-gray-50 bg-slate-50/50">
        <div className="max-w-7xl mx-auto py-32">
           <div className="flex justify-between items-end mb-20">
              <div className="space-y-4">
                <h3 className="text-4xl font-black text-black tracking-tight">أرقام تصنع الفارق</h3>
                <p className="text-slate-500 font-medium">إحصائيات موثقة تعكس حجم القوة التي يمتلكها شركاؤنا.</p>
              </div>
              <button onClick={onImpact} className="px-10 py-4 bg-white border border-slate-200 rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">عرض تقرير الأثر الكامل ←</button>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-24">
              {[
                { l: t.stats.startups, v: '180+' },
                { l: t.stats.capital, v: '$42M' },
                { l: t.stats.experts, v: '65+' },
                { l: t.stats.countries, v: '14' }
              ].map((s, i) => (
                <div key={i} className="space-y-4">
                   <p className="text-6xl font-black text-black tracking-tighter">{s.v}</p>
                   <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] leading-loose">{s.l}</p>
                </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
};
