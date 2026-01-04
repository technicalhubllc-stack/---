import React from 'react';
import { GlobalHeader } from './GlobalHeader';
import { GlobalFooter } from './GlobalFooter';
import { Language } from '../../services/i18nService';
import { QuickSupportChat } from './QuickSupportChat';

interface MainLayoutProps {
  children: React.ReactNode;
  onNavigate: (stage: any) => void;
  onLogin: () => void;
  onStart: () => void;
  lang: Language;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, onNavigate, onLogin, onStart, lang }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden" dir="rtl">
      {/* Global Header */}
      <GlobalHeader onNavigate={onNavigate} onLogin={onLogin} onStart={onStart} lang={lang} />
      
      {/* Dynamic Content: Padding top compensates for fixed header */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Global Footer */}
      <GlobalFooter />
      
      {/* AI Floating Chat */}
      <QuickSupportChat />
    </div>
  );
};