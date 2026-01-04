
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
      <div className="max-w-7xl