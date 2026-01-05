
import React, { useState, useEffect } from 'react';
import { Language, getTranslation } from '../../services/i18nService';
import { Logo } from '../Branding/Logo';

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
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ease-in-out px-6 md:px-12 ${
        scrolled 
        ? 'py-3 bg-deep-navy/70 backdrop-blur-2xl border-b border-white/5 shadow-2xl' 
        : 'py-8 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo & Branding - Scales on Scroll */}
        <div className="flex items-center gap-12">
          <div 
            className={`cursor-pointer transition-all duration-500 ${scrolled ? 'scale-90' : 'scale-100'}`} 
            onClick={() => onNavigate('LANDING')}
          >
            <Logo variant="light" className={scrolled ? 'h-9' : 'h-12'} />
          </div>

          <div className={`hidden lg:flex items-center gap-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] transition-all duration-500 ${scrolled ? 'opacity-80' : 'opacity-100'}`}>
            <button onClick={() => onNavigate('LANDING')} className="hover:text-white transition-colors relative group">
              الرئيسية
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-electric-blue transition-all group-hover:w-full"></span>
            </button>
            <button className="hover:text-white transition-colors relative group">البرامج</button>
            <button className="hover:text-white transition-colors relative group">الشركاء</button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-8">
          <div className={`hidden sm:flex items-center gap-2 p-1 rounded-full border transition-all duration-500 ${scrolled ? 'bg-white/5 border-white/10' : 'bg-transparent border-white/5'}`}>
            {(['ar', 'en'] as Language[]).map((l) => (
              <button 
                key={l}
                onClick={() => onLanguageChange(l)}
                className={`text-[8px] font-black uppercase transition-all px-3 py-1.5 rounded-full ${
                  lang === l 
                  ? 'bg-electric-blue text-white shadow-lg' 
                  : 'text-slate-500 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={onLogin} 
              className={`text-[10px] font-black text-white hover:text-electric-blue uppercase tracking-widest transition-all duration-300 ${scrolled ? 'opacity-80' : 'opacity-100'}`}
            >
              {t.nav.login}
            </button>
            <button 
              onClick={onStart} 
              className={`bg-electric-blue text-white rounded-xl font-black uppercase tracking-widest btn-glow transition-all duration-500 shadow-xl shadow-blue-600/20 ${
                scrolled 
                ? 'px-6 py-2.5 text-[9px]' 
                : 'px-9 py-3.5 text-[11px]'
              }`}
            >
              {t.nav.start}
            </button>
          </div>
        </div>

      </div>
    </nav>
  );
};
