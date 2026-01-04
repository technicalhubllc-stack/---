import React, { useState, useEffect } from 'react';
import { Language } from '../../services/i18nService';

interface GlobalHeaderProps {
  onNavigate: (stage: any) => void;
  onLogin: () => void;
  onStart: () => void;
  lang: Language;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({ onNavigate, onLogin, onStart, lang }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-12 ${scrolled ? 'py-4 bg-white/90 backdrop-blur-md border-b border-gray-100' : 'py-8 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center h-12">
        
        {/* Right: Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('LANDING')}>
          <div className="w-8 h-8 bg-black flex items-center justify-center text-white text-[10px] font-bold">BD</div>
          <span className="text-lg font-black tracking-tight text-black">بيزنس ديفلوبرز</span>
        </div>

        {/* Center: Navigation - Simplified */}
        <div className="hidden lg:flex items-center gap-12 text-[13px] font-medium text-gray-500 uppercase tracking-wider">
          <button onClick={() => onNavigate('LANDING')} className="hover:text-black transition-colors">الرئيسية</button>
          <button onClick={() => onNavigate('INCUBATION_PROGRAM')} className="hover:text-black transition-colors">البرامج</button>
          <button onClick={() => onNavigate('PARTNER_CONCEPT')} className="hover:text-black transition-colors">الشركاء</button>
          <button onClick={() => onNavigate('CONTACT')} className="hover:text-black transition-colors">تواصل</button>
        </div>

        {/* Left: Actions */}
        <div className="flex items-center gap-8">
          <button onClick={onLogin} className="text-[13px] font-bold text-gray-400 hover:text-black transition-colors">دخول</button>
          <button onClick={onStart} className="btn-primary px-8 py-3 text-[13px] tracking-wide">ابدأ الرحلة</button>
        </div>

      </div>
    </nav>
  );
};