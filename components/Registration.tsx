
import React, { useState } from 'react';
import { UserProfile, UserRole, SECTORS } from '../types';
import { playPositiveSound, playCelebrationSound } from '../services/audioService';
import { Language, getTranslation } from '../services/i18nService';
import { storageService } from '../services/storageService';

interface RegistrationProps {
  role?: UserRole;
  onRegister: (profile: UserProfile) => void;
  onStaffLogin?: () => void;
  lang: Language;
}

export const Registration: React.FC<RegistrationProps> = ({ role = 'STARTUP', onRegister, onStaffLogin, lang }) => {
  const t = getTranslation(lang);
  const [step, setStep] = useState(1);
  const [isDetecting, setIsDetecting] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    firstName: '', lastName: '', email: '', phone: '', city: '', 
    agreedToTerms: false, agreedToContract: false,
    startupName: '', startupDescription: '', industry: 'Technology',
    existingRoles: [], missingRoles: [], supportNeeded: [], mentorExpertise: [], mentorSectors: [],
    skills: []
  });

  const roleMeta = {
    STARTUP: { title: 'مؤسس مشروع', color: 'blue', icon: '🚀', total: 5 },
    PARTNER: { title: 'شريك استراتيجي', color: 'emerald', icon: '🤝', total: 5 },
    MENTOR: { title: 'مرشد خبير', color: 'purple', icon: '🧠', total: 5 }
  }[role] || { title: 'تسجيل', color: 'blue', icon: '🚀', total: 5 };

  const handleNext = () => { 
    if (step < roleMeta.total) {
      setStep(s => s + 1); 
      playPositiveSound(); 
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(s => s - 1);
  };

  const handleSubmit = () => {
    playCelebrationSound();
    onRegister(formData);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("متصفحك لا يدعم تحديد الموقع الجغرافي.");
      return;
    }
    
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // In a real app, we would use reverse geocoding here.
        // For this elite demo, we'll set a verified location string.
        setFormData(prev => ({ ...prev, city: "الرياض (تحديد تلقائي)" }));
        setIsDetecting(false);
        playPositiveSound();
      },
      (error) => {
        console.error(error);
        setIsDetecting(false);
        alert("فشل تحديد الموقع. يرجى إدخال المدينة يدوياً.");
      }
    );
  };

  const inputClass = "w-full p-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[1.8rem] outline-none focus:border-primary transition-all font-bold text-lg dark:text-white placeholder-slate-300 dark:placeholder-slate-700 shadow-inner";
  const labelClass = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pr-4";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-slate-950 font-sans" dir="rtl">
      {/* Context Panel */}
      <div className="lg:w-2/5 bg-slate-900 p-12 md:p-20 flex flex-col justify-between relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="relative z-10 space-y-12">
          <div className="w-20 h-20 bg-primary rounded-[2.2rem] flex items-center justify-center text-4xl shadow-3xl transform rotate-6">
            {roleMeta.icon}
          </div>
          <div className="space-y-6">
            <h1 className="text-6xl font-black leading-tight tracking-tighter">{roleMeta.title}</h1>
            <p className="text-slate-400 text-2xl font-medium leading-relaxed max-w-md">انضم إلى مجتمع النخبة وابدأ في بناء مشروعك بمعايير استثمارية عالمية.</p>
          </div>
        </div>
        
        <div className="relative z-10 space-y-8">
           <div className="flex gap-3">
              {[...Array(roleMeta.total)].map((_, s) => (
                <div key={s} className={`h-1.5 rounded-full transition-all duration-700 ${step > s ? 'w-12 bg-primary' : 'w-4 bg-white/10'}`}></div>
              ))}
           </div>
           <div className="flex items-center gap-4 text-slate-500 font-bold text-xs uppercase tracking-widest">
              <span>خطوة {step}</span>
              <div className="w-1 h-1 rounded-full bg-slate-700"></div>
              <span>{roleMeta.total} خطوات للإتمام</span>
           </div>
        </div>
      </div>

      {/* Form Panel */}
      <main className="flex-1 flex items-center justify-center p-8 md:p-20 overflow-y-auto bg-slate-50 dark:bg-transparent">
        <div className="max-w-xl w-full space-y-12 animate-fade-up">
           <header className="space-y-2">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Section {step}</span>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white">
                {step === 1 && "البيانات الشخصية"}
                {step === 2 && "هوية المشروع"}
                {step === 3 && "تفاصيل القطاع"}
                {step === 4 && "الاحتياجات والمهارات"}
                {step === 5 && "الموافقة والبدء"}
              </h2>
           </header>

           <div className="space-y-8 min-h-[400px]">
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className={labelClass}>الاسم الأول</label>
                      <input className={inputClass} placeholder="مثال: فيصل" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>اللقب</label>
                      <input className={inputClass} placeholder="مثال: القحطاني" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>البريد الإلكتروني الرسمي</label>
                    <input className={inputClass} placeholder="name@company.ai" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className={labelClass}>رقم الجوال</label>
                      <input className={inputClass} placeholder="05XXXXXXXX" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                    <div className="space-y-1 relative">
                      <label className={labelClass}>المدينة</label>
                      <div className="relative">
                        <input className={`${inputClass} pl-16`} placeholder="مثال: الرياض" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                        <button 
                          onClick={handleDetectLocation}
                          disabled={isDetecting}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center text-primary shadow-sm hover:scale-105 active:scale-95 transition-all"
                          title="تحديد الموقع الجغرافي"
                        >
                          {isDetecting ? (
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                          ) : "📍"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-1">
                    <label className={labelClass}>اسم المشروع</label>
                    <input className={inputClass} placeholder="ما هو اسم شركتك الناشئة؟" value={formData.startupName} onChange={e => setFormData({...formData, startupName: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>وصف مختصر للمشروع</label>
                    <textarea className={inputClass + " h-40 resize-none"} placeholder="تحدث عن المشكلة التي تحلها في جملتين..." value={formData.startupDescription} onChange={e => setFormData({...formData, startupDescription: e.target.value})} />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-1">
                    <label className={labelClass}>القطاع المستهدف</label>
                    <select className={inputClass} value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})}>
                      {SECTORS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className={labelClass}>مرحلة المشروع الحالية</label>
                    <div className="grid grid-cols-2 gap-3">
                       {['Idea', 'MVP', 'Growth', 'InvestReady'].map(s => (
                         <button key={s} onClick={() => setFormData({...formData, stage: s as any})} className={`p-4 rounded-2xl font-bold text-xs border-2 transition-all ${formData.stage === s ? 'border-primary bg-primary/5 text-primary shadow-lg' : 'border-slate-200 text-slate-400'}`}>
                           {s === 'Idea' && '💡 فكرة'}
                           {s === 'MVP' && '📦 منتج أولي'}
                           {s === 'Growth' && '📈 نمو'}
                           {s === 'InvestReady' && '💎 جاهز للاستثمار'}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-1">
                    <label className={labelClass}>أهم المهارات المتوفرة لديك</label>
                    <input className={inputClass} placeholder="مثال: برمجة، تسويق، إدارة..." onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = (e.target as HTMLInputElement).value;
                        if (val) setFormData({...formData, skills: [...(formData.skills || []), val]});
                        (e.target as HTMLInputElement).value = '';
                      }
                    }} />
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.skills?.map(s => <span key={s} className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold">{s}</span>)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>أكبر تحدي يواجهك حالياً</label>
                    <textarea className={inputClass + " h-32 resize-none"} placeholder="ما الذي تحتاجه للنمو؟" onChange={e => setFormData({...formData, startupBio: e.target.value})} />
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-8 animate-fade-in">
                   <div className="p-8 bg-blue-50 border border-blue-100 rounded-[2.5rem] space-y-4">
                      <h4 className="font-black text-blue-900 text-xl">مراجعة الشروط والخصوصية</h4>
                      <p className="text-blue-700 text-sm leading-relaxed">بضغطك على "إتمام التسجيل" أنت توافق على سياسة الخصوصية الخاصة بـ بيزنس ديفلوبرز ومعالجة بيانات مشروعك عبر محرك الذكاء الاصطناعي.</p>
                      <label className="flex items-center gap-4 cursor-pointer pt-4 group">
                         <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${formData.agreedToTerms ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white border-slate-200'}`}>
                           {formData.agreedToTerms && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>}
                         </div>
                         <input type="checkbox" className="hidden" checked={formData.agreedToTerms} onChange={e => setFormData({...formData, agreedToTerms: e.target.checked})} />
                         <span className="text-sm font-black text-slate-700">أوافق على كافة الشروط والأحكام</span>
                      </label>
                   </div>
                   <div className="text-center space-y-4">
                      <p className="text-slate-400 font-bold">كل شيء جاهز للبدء!</p>
                      <div className="flex justify-center text-5xl">🏁</div>
                   </div>
                </div>
              )}
           </div>

           <div className="flex gap-4">
              {step > 1 && (
                <button onClick={handlePrev} className="flex-1 py-6 bg-slate-100 text-slate-600 rounded-[2.2rem] font-black text-lg transition-all hover:bg-slate-200">عودة</button>
              )}
              <button 
                onClick={handleNext} 
                disabled={step === 5 && !formData.agreedToTerms}
                className={`flex-[2] py-7 bg-primary text-white rounded-[2.2rem] font-black text-2xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-6 disabled:opacity-30`}
              >
                <span>{step === roleMeta.total ? "إتمام التسجيل والبدء" : "المتابعة للمرحلة التالية"}</span>
                <svg className="w-8 h-8 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
           </div>
           
           <div className="text-center">
              <button onClick={onStaffLogin} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">Central Administration Portal</button>
           </div>
        </div>
      </main>
    </div>
  );
};
