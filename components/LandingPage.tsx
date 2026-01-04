
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
    <div className="animate-fade-in">
      {/* Minimalist Hero Section */}
      <section className="min-h-[85vh] flex items-center px-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-3xl space-y-8">
            <div className="space-y-4">
              <p className="text-blue-600 font-bold text-xs uppercase tracking-widest">مسرعة الأعمال الاستراتيجية</p>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] text-slate-900">
                هندسة النمو <br/> 
                <span className="text-slate-400">للمؤسسات الواعدة.</span>
              </h1>
            </div>
            
            <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed border-r-2 border-slate-100 pr-8">
              نظام متكامل يدير مسارات الشركات الناشئة من التحقق المبدئي إلى الجاهزية الاستثمارية، مدعوماً بأدوات ذكاء اصطناعي سيادي.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <button onClick={onStart} className="btn-primary">
                {t.hero.apply}
              </button>
              <button onClick={onRoadmap} className="px-8 py-3 border border-slate-200 text-slate-900 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">
                {t.hero.methodology}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Stats */}
      <section className="px-12 py-24 bg-slate-50/30">
        <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {[
                { l: t.stats.startups, v: '180+' },
                { l: t.stats.capital, v: '$42M' },
                { l: t.stats.experts, v: '65+' },
                { l: t.stats.countries, v: '14' }
              ].map((s, i) => (
                <div key={i} className="space-y-2 border-r border-slate-100 pr-6">
                   <p className="text-3xl font-black text-slate-900">{s.v}</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.l}</p>
                </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
};
