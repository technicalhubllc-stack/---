
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
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-12 ${scrolled ? 'py-4 bg-white/95 backdrop-blur-md border-b border-slate-200' : 'py-8 bg-white border-b border-slate-100'}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('LANDING')}>
            <div className="w-8 h-8 bg-slate-900 flex items-center justify-center text-white text-[10px] font-bold">BD</div>
            <span className="text-lg font-black tracking-tight text-slate-900">{t.brand}</span>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <button onClick={() => onNavigate('LANDING')} className="hover:text-slate-900 transition-colors">{t.nav.home}</button>
            <button className="hover:text-slate-900 transition-colors">{t.nav.programs}</button>
            <button className="hover:text-slate-900 transition-colors">{t.nav.partners}</button>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex gap-2">
            {(['ar', 'en'] as Language[]).map((l) => (
              <button 
                key={l}
                onClick={() => onLanguageChange(l)}
                className={`text-[9px] font-bold uppercase transition-all px-2 py-1 ${lang === l ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}
              >
                {l}
              </button>
            ))}
          </div>

          <button onClick={onLogin} className="text-[10px] font-bold text-slate-900 hover:text-blue-600 uppercase tracking-widest transition-colors">{t.nav.login}</button>
          <button onClick={onStart} className="btn-primary text-[10px] tracking-widest uppercase">
            {t.nav.start}
          </button>
        </div>

      </div>
    </nav>
  );
};
