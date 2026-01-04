
import React from 'react';
import { Language, getTranslation } from '../../services/i18nService';

interface GlobalFooterProps {
  lang: Language;
}

export const GlobalFooter: React.FC<GlobalFooterProps> = ({ lang }) => {
  const t = getTranslation(lang);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-12 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-24 mb-24">
          
          <div className="col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-slate-900 text-white text-[8px] flex items-center justify-center font-bold">BD</div>
              <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{t.brand}</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed font-medium">
              {t.footer.mission}
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">Protocol</h4>
            <ul className="space-y-3 text-[11px] font-bold text-slate-500">
              <li className="hover:text-slate-900 cursor-pointer transition-colors">Incubation</li>
              <li className="hover:text-slate-900 cursor-pointer transition-colors">Acceleration</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">Governance</h4>
            <ul className="space-y-3 text-[11px] font-bold text-slate-500">
              <li className="hover:text-slate-900 cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-slate-900 cursor-pointer transition-colors">Terms</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">Connect</h4>
            <p className="text-[11px] font-bold text-slate-900">Riyadh Headquarters, KSA</p>
            <p className="text-[11px] font-bold text-slate-400">hq@bizdev.accelerator</p>
          </div>

        </div>

        <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">
          <p>© {currentYear} {t.brand}. All rights reserved.</p>
          <div className="flex gap-8">
            <span>Corporate Edition v1.0</span>
            <span className="text-slate-900">Powered by Enterprise Intelligence</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
