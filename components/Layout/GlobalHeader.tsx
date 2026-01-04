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
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-12 ${scrolled ? 'py-4 bg-white/90 backdrop-blur-md border-b border-gray-100' : 'py-8 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center h-12">
        
        {/* Right: Logo & Brand */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('LANDING')}>
            <div className="w-8 h-8 bg-black flex items-center justify-center text-white text-[10px] font-bold">BD</div>
            <span className="text-lg font-black tracking-tight text-black">{t.brand}</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            <button onClick={() => onNavigate('LANDING')} className="hover:text-black transition-colors">{t.nav.home}</button>
            <button className="hover:text-black transition-colors">{t.nav.programs}</button>
            <button className="hover:text-black transition-colors">{t.nav.partners}</button>
          </div>
        </div>

        {/* Left: Language & Actions */}
        <div className="flex items-center gap-8">
          {/* Minimalist Language Switcher */}
          <div className="flex gap-3 border-l border-gray-100 pl-8 h-4 items-center">
            {(['ar', 'en', 'fr', 'zh'] as Language[]).map((l) => (
              <button 
                key={l}
                onClick={() => onLanguageChange(l)}
                className={`text-[9px] font-black uppercase transition-all hover:text-black ${lang === l ? 'text-black border-b border-black' : 'text-gray-300'}`}
              >
                {l}
              </button>
            ))}
          </div>

          <button onClick={onLogin} className="text-[11px] font-bold text-gray-400 hover:text-black transition-colors">{t.nav.login}</button>
          <button onClick={onStart} className="btn-primary px-8 py-3 text-[11px] tracking-widest uppercase">{t.nav.start}</button>
        </div>

      </div>
    </nav>
  );
};