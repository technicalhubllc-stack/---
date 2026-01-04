import React, { useState } from 'react';
import { UserProfile, UserRole, SECTORS } from '../types';
import { playPositiveSound, playCelebrationSound } from '../services/audioService';

interface RegistrationProps {
  role?: UserRole;
  onRegister: (profile: UserProfile) => void;
  lang: any;
}

export const Registration: React.FC<RegistrationProps> = ({ role = 'STARTUP', onRegister }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserProfile>({
    firstName: '', lastName: '', email: '', phone: '', city: '', 
    agreedToTerms: false, startupName: '', startupDescription: '', industry: 'Technology',
    skills: []
  });

  const handleNext = () => { 
    if (step < 3) { setStep(s => s + 1); playPositiveSound(); window.scrollTo({ top: 0 }); } 
    else { playCelebrationSound(); onRegister(formData); }
  };

  const inputClass = "w-full p-5 bg-white border border-gray-200 rounded-none outline-none focus:border-black transition-all font-medium text-sm";
  const labelClass = "block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 pr-1";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white" dir="rtl">
      {/* Left Panel - Sharp & Dark */}
      <div className="lg:w-1/3 bg-black p-16 md:p-24 flex flex-col justify-between text-white">
        <div className="w-10 h-10 bg-white flex items-center justify-center text-black font-black">BD</div>
        <div className="space-y-8">
          <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tighter uppercase">Join the <br/> Elite.</h1>
          <p className="text-gray-500 text-lg font-light leading-relaxed max-w-xs">بوابتك الرسمية للانضمام إلى أقوى شبكة تسريع أعمال رقمية في المنطقة.</p>
        </div>
        <div className="pt-12 border-t border-white/10 opacity-30">
           <p className="text-[10px] font-black uppercase tracking-[0.5em]">Incubation Protocol v3.0</p>
        </div>
      </div>

      {/* Right Panel - Workspace */}
      <main className="flex-1 flex items-center justify-center p-12 md:p-24 bg-white">
        <div className="max-w-xl w-full space-y-20 animate-fade-in">
           <header className="space-y-4">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Step 0{step} / 03</span>
              <h2 className="text-4xl font-bold text-black">
                {step === 1 && "بيانات المؤسس"}
                {step === 2 && "هوية المشروع"}
                {step === 3 && "الموافقة والبدء"}
              </h2>
           </header>

           <div className="space-y-12 min-h-[350px]">
              {step === 1 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2"><label className={labelClass}>الاسم الأول</label><input className={inputClass} value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} /></div>
                    <div className="space-y-2"><label className={labelClass}>اللقب</label><input className={inputClass} value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} /></div>
                  </div>
                  <div className="space-y-2"><label className={labelClass}>البريد الرسمي</label><input className={inputClass} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" /></div>
                  <div className="space-y-2"><label className={labelClass}>الجوال</label><input className={inputClass} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  <div className="space-y-2"><label className={labelClass}>اسم الكيان التجاري</label><input className={inputClass} value={formData.startupName} onChange={e => setFormData({...formData, startupName: e.target.value})} /></div>
                  <div className="space-y-2">
                    <label className={labelClass}>القطاع</label>
                    <select className={inputClass} value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})}>
                      {SECTORS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2"><label className={labelClass}>المهمة / الوصف</label><textarea className={inputClass + " h-32 resize-none"} value={formData.startupDescription} onChange={e => setFormData({...formData, startupDescription: e.target.value})} /></div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-10">
                   <div className="p-10 bg-gray-50 border border-gray-100 rounded-none text-black space-y-6">
                      <h4 className="text-xl font-bold">جاهزية المسار الاستراتيجي</h4>
                      <p className="text-gray-500 font-light leading-relaxed">بالضغط على إتمام، فإنك تتعهد بدقة المعلومات وبدء بروتوكول الاحتضان الرسمي.</p>
                      <label className="flex items-center gap-4 cursor-pointer pt-6 border-t border-gray-200">
                         <input type="checkbox" checked={formData.agreedToTerms} onChange={e => setFormData({...formData, agreedToTerms: e.target.checked})} className="w-5 h-5 accent-black" />
                         <span className="font-bold text-sm">أوافق على الشروط والسياسات.</span>
                      </label>
                   </div>
                </div>
              )}
           </div>

           <div className="flex gap-6 pt-10 border-t border-gray-100">
              {step > 1 && <button onClick={() => setStep(s => s - 1)} className="px-10 py-5 bg-white text-gray-400 text-sm font-bold uppercase tracking-widest hover:text-black transition-all">عودة</button>}
              <button 
                onClick={handleNext} 
                disabled={step === 3 && !formData.agreedToTerms}
                className="flex-1 py-5 btn-primary text-sm uppercase tracking-widest disabled:opacity-20"
              >
                {step === 3 ? "إتمام وتأسيس" : "المتابعة"}
              </button>
           </div>
        </div>
      </main>
    </div>
  );
};