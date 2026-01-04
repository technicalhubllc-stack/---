import React from 'react';

export const GlobalFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-12 pt-32 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-24 mb-32">
          
          <div className="col-span-1 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black flex items-center justify-center text-white text-[10px] font-bold">BD</div>
              <span className="text-lg font-black text-black uppercase tracking-tight">بيزنس ديفلوبرز</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed font-medium uppercase tracking-widest">
              هندسة المشاريع الناشئة بذكاء استراتيجي متكامل.
            </p>
          </div>

          <div className="space-y-8">
            <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">الملاحة</h4>
            <ul className="space-y-4 text-[13px] font-bold">
              <li><button className="hover:text-blue-600 transition-colors">البرامج</button></li>
              <li><button className="hover:text-blue-600 transition-colors">الشركاء</button></li>
              <li><button className="hover:text-blue-600 transition-colors">الأسئلة الشائعة</button></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">قانوني</h4>
            <ul className="space-y-4 text-[13px] font-bold">
              <li><button className="hover:text-blue-600 transition-colors">الشروط والأحكام</button></li>
              <li><button className="hover:text-blue-600 transition-colors">سياسة الخصوصية</button></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">تواصل</h4>
            <ul className="space-y-4 text-[13px] font-bold">
              <li className="text-black">support@bizdev.ai</li>
              <li className="text-black">الرياض، السعودية</li>
            </ul>
          </div>

        </div>

        <div className="pt-12 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-300 text-[10px] font-bold uppercase tracking-[0.4em]">
          <p>© 2026 BUSINESS DEVELOPERS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <span>Powered by Gemini 3.0</span>
            <span>Virtual Accelerator</span>
          </div>
        </div>
      </div>
    </footer>
  );
};