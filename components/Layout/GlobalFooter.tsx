import React from 'react';
import { Language, getTranslation } from '../../services/i18nService';

interface GlobalFooterProps {
  lang: Language;
}

export const GlobalFooter: React.FC<GlobalFooterProps> = ({ lang }) => {
  const t = getTranslation(lang);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-12 pt-32 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-24 mb-32">
          
          <div className="col-span-1 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-black text-white text-[8px] flex items-center justify-center font-bold">BD</div>
              <span className="text-sm font-black text-black uppercase tracking-widest">{t.brand}</span>
            </div>
            <p className="text-gray-400 text-[11px] leading-relaxed font-medium max-w-[200px]">
              {t.footer.mission}
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em]">Protocol</h4>
            <ul className="space-y-3 text-[11px] font-bold text-gray-500">
              <li className="hover:text-black cursor-pointer">Incubation</li>
              <li className="hover:text-black cursor-pointer">Acceleration</li>
              <li className="hover:text-black cursor-pointer">Post-Launch</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em]">Governance</h4>
            <ul className="space-y-3 text-[11px] font-bold text-gray-500">
              <li className="hover:text-black cursor-pointer">Privacy Policy</li>
              <li className="hover:text-black cursor-pointer">Terms of Service</li>
              <li className="hover:text-black cursor-pointer">Compliance</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em]">Connect</h4>
            <ul className="space-y-3 text-[11px] font-bold text-gray-500">
              <li className="text-black">HQ - Riyadh, KSA</li>
              <li className="text-gray-400">intelligence@bizdev.ai</li>
            </ul>
          </div>

        </div>

        <div className="pt-12 border-t border-gray-50 flex justify-between items-center text-[9px] font-black text-gray-300 uppercase tracking-[0.5em]">
          <p>© {currentYear} {t.brand}. {t.footer.rights}</p>
          <div className="flex gap-8">
            <span>Powered by Gemini 3.0</span>
            <span>Digital Core v1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};