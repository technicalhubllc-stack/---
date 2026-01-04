
import React, { useState, useEffect } from 'react';
import { Language, getTranslation } from '../../services/i18nService';

interface GlobalHeaderProps {
  onNavigate: (stage: any) => void;
  onLogin: () => void;
  onStart: () => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({ onNavigate, onLogin, onStart, lang, onLanguageChange }) => {
  const [scrolled, setScrolled] = useState(false);
  const t = getTranslation(lang);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-8 md:px-12 ${
      scrolled 
      ? 'py-4 bg-deep-navy/80 backdrop-blur-xl border-b border-white/5' 
      : 'py-8 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        <div className="flex items-center gap-16">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('LANDING')}>
            <div className="w-10 h-10 bg-electric-blue rounded-xl flex items-center justify-center text-white text-xs font-black shadow-2xl transition-transform group-hover:rotate-6">BD</div>
            <span className="text-xl font-black tracking-tight text-white uppercase">{t.brand}</span>
          </div>

          <div className="hidden lg:flex items-center gap-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            <button onClick={() => onNavigate('LANDING')} className="hover:text-white transition-colors">الرئيسية</button>
            <button className="hover:text-white transition-colors">البرامج</button>
            <button className="hover:text-white transition-colors">الشركاء</button>
            <button className="hover:text-white transition-colors">عن المسرعة</button>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="hidden sm:flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/5">
            {(['ar', 'en'] as Language[]).map((l) => (
              <button 
                key={l}
                onClick={() => onLanguageChange(l)}
                className={`text-[9px] font-black uppercase transition-all px-3 py-1 rounded-full ${lang === l ? 'bg-electric-blue text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button onClick={onLogin} className="text-[11px] font-black text-white hover:text-electric-blue uppercase tracking-widest transition-colors">{t.nav.login}</button>
            <button onClick={onStart} className="bg-electric-blue text-white px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest btn-glow">
              {t.nav.start}
            </button>
          </div>
        </div>

      </div>
    </nav>
  );
};
