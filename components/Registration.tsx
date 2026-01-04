
import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole, SECTORS } from '../types';
import { playPositiveSound, playCelebrationSound } from '../services/audioService';

interface RegistrationProps {
  role?: UserRole;
  onRegister: (profile: UserProfile) => void;
  lang: any;
}

const REG_IMAGES = [
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=1200"
];

export const Registration: React.FC<RegistrationProps> = ({ role = 'STARTUP', onRegister }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserProfile>({
    firstName: '', lastName: '', email: '', phone: '', city: '', 
    agreedToTerms: false, startupName: '', startupDescription: '', industry: 'Technology',
    skills: []
  });

  const handleNext = () => { 
    if (step < 3) { setStep(s => s + 1); playPositiveSound(); window.scrollTo({ top: 0, behavior: 'smooth' }); } 
    else { playCelebrationSound(); onRegister(formData); }
  };

  const inputClass = "w-full p-5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-sm text-slate-900 placeholder-slate-300";
  const labelClass = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pr-2";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f8fafc]" dir="rtl">
      
      {/* Visual Left Side - Fixed Cinematic View */}
      <div className="lg:w-[40%] relative hidden lg:flex flex-col justify-between p-24 text-white overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <img src={REG_IMAGES[0]} className="w-full h-full object-cover brightness-[0.25] grayscale" alt="Side View" />
          <div className="absolute inset-0 cinematic-grid opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
        </div>

        <div className="relative z-10">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-2xl">BD</div>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-5xl font-black leading-tight tracking-tight">ابدأ رحلة <br/> التميز الريادي.</h2>
          <p className="text-slate-400 font-medium text-lg max-w-xs">نحن لا نقوم فقط بالتسجيل، نحن نقوم بهندسة قصة نجاحك القادمة.</p>
        </div>

        <div className="relative z-10 flex gap-4">
          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
          <div className="w-2 h-2 rounded-full bg-white/20"></div>
          <div className="w-2 h-2 rounded-full bg-white/20"></div>
        </div>
      </div>

      {/* Form Right Side */}
      <main className="flex-1 flex items-center justify-center p-8 md:p-24 relative">
        <div className="max-w-xl w-full space-y-16 animate-fade-in-up">
           <header className="space-y-4">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">Protocol Phase 0{step}</span>
              <h3 className="text-5xl font-black text-slate-900 tracking-tighter">
                {step === 1 && "بيانات المؤسس"}
                {step === 2 && "هوية المشروع"}
                {step === 3 && "الموافقة والبدء"}
              </h3>
           </header>

           <div className="min-h-[400px]">
              {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                  <div className="space-y-2"><label className={labelClass}>الاسم الأول</label><input className={inputClass} value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="الاسم" /></div>
                  <div className={labelClass ? "space-y-2" : ""}>
                    <label className={labelClass}>اللقب</label>
                    <input className={inputClass} value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="العائلة" />
                  </div>
                  <div className="md:col-span-2 space-y-2"><label className={labelClass}>البريد الرسمي</label><input className={inputClass} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" placeholder="name@corporate.ai" /></div>
                  <div className="md:col-span-2 space-y-2"><label className={labelClass}>رقم الجوال</label><input className={inputClass} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="05xxxxxxxx" /></div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-fade-in">
                  <div className="space-y-2"><label className={labelClass}>اسم الكيان التجاري</label><input className={inputClass} value={formData.startupName} onChange={e => setFormData({...formData, startupName: e.target.value})} placeholder="اسم شركتك" /></div>
                  <div className="space-y-2">
                    <label className={labelClass}>قطاع العمل الرئيسي</label>
                    <select className={inputClass} value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})}>
                      {SECTORS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2"><label className={labelClass}>مهمة المشروع / الوصف</label><textarea className={inputClass + " h-40 resize-none leading-relaxed"} value={formData.startupDescription} onChange={e => setFormData({...formData, startupDescription: e.target.value})} placeholder="صف الفجوة التي تعالجها في السوق..." /></div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-10 animate-fade-in">
                   <div className="p-10 bg-white border border-slate-200 rounded-[2.5rem] shadow-xl space-y-8">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">📜</div>
                        <h4 className="text-xl font-black text-slate-900">بروتوكول الانضمام الذكي</h4>
                      </div>
                      <p className="text-slate-500 font-medium leading-relaxed text-base">بالضغط على إتمام، فإنك تتعهد بصحة البيانات وبدء مرحلة الفلترة والتقييم الذكي (AI Analysis) لمشروعك.</p>
                      <label className="flex items-center gap-4 cursor-pointer pt-8 border-t border-slate-100 group">
                         <div className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all ${formData.agreedToTerms ? 'bg-blue-600 border-blue-600 shadow-lg' : 'border-slate-300'}`}>
                           {formData.agreedToTerms && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg>}
                         </div>
                         <input type="checkbox" checked={formData.agreedToTerms} onChange={e => setFormData({...formData, agreedToTerms: e.target.checked})} className="hidden" />
                         <span className="font-bold text-sm text-slate-700 group-hover:text-blue-600 transition-colors">أوافق على سياسات الخصوصية والاحتضان.</span>
                      </label>
                   </div>
                </div>
              )}
           </div>

           <div className="flex flex-col md:flex-row gap-4 pt-12 border-t border-slate-200">
              {step > 1 && <button onClick={() => setStep(s => s - 1)} className="px-12 py-5 bg-white text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-900 hover:border-slate-900 border border-slate-200 rounded-xl transition-all">الرجوع</button>}
              <button 
                onClick={handleNext} 
                disabled={step === 3 && !formData.agreedToTerms}
                className="flex-1 py-5 bg-slate-900 text-white text-xs font-black uppercase tracking-widest shadow-2xl hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-20 rounded-xl btn-glow"
              >
                {step === 3 ? "إتمام وتفعيل الحساب" : "الخطوة القادمة"}
              </button>
           </div>
        </div>
      </main>
    </div>
  );
};
