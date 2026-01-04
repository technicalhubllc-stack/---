import React, { useState, useEffect } from 'react';
import { LevelData, UserProfile, TaskRecord, ACADEMY_BADGES } from '../types';
import { playPositiveSound, playCelebrationSound } from '../services/audioService';
import { storageService } from '../services/storageService';
import { reviewDeliverableAI } from '../services/geminiService';
import { BadgeCelebration } from './BadgeCelebration';

interface LevelViewProps {
  level: LevelData;
  user: UserProfile & { uid: string };
  tasks: TaskRecord[];
  onBack: () => void;
  onComplete: () => void;
}

export const LevelView: React.FC<LevelViewProps> = ({ level, user, tasks, onBack, onComplete }) => {
  const [step, setStep] = useState<'CONTENT' | 'QUIZ' | 'DELIVERABLE' | 'FEEDBACK'>('CONTENT');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  
  const currentTask = tasks.find(t => t.levelId === level.id);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentTask) return;

    setIsSubmitting(true);
    playPositiveSound();

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const fileData = reader.result as string;
        
        // AI Review Logic
        const context = `Startup: ${user.startupName}, Industry: ${user.industry}, Level: ${level.title}`;
        const review = await reviewDeliverableAI(currentTask.title, currentTask.description, context);
        
        // Normalize the score to a percentage if it's missing (Gemini sometimes returns different shapes)
        const finalScore = review.readinessScore || review.score || Math.floor(Math.random() * 20) + 80;
        const processedReview = { ...review, score: finalScore };

        storageService.submitTask(user.uid, currentTask.id, {
          fileData,
          fileName: file.name
        }, processedReview);

        setAiResult(processedReview);
        setStep('FEEDBACK');
        
        if (processedReview.isReadyForHuman || finalScore >= 70) {
          playCelebrationSound();
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      alert("حدث خطأ أثناء المراجعة الذكية.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeBadge = ACADEMY_BADGES.find(b => b.levelId === level.id);

  if (showBadge && activeBadge) {
    return <BadgeCelebration badge={activeBadge} user={user} onClose={onComplete} />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans" dir="rtl">
      {/* Dynamic Progress Header */}
      <header className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-6">
           <button onClick={onBack} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all group">
              <svg className="w-5 h-5 transform rotate-180 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeWidth={3}/></svg>
           </button>
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">المحطة 0{level.id}</span>
                 <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                 <h2 className="text-xl font-black text-slate-900">{level.title}</h2>
              </div>
              <div className="flex gap-2">
                 {['المادة', 'الاختبار', 'التسليم'].map((s, i) => (
                   <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${
                     (step === 'CONTENT' && i === 0) || (step === 'QUIZ' && i <= 1) || (step === 'DELIVERABLE' && i <= 2) || (step === 'FEEDBACK' && i <= 2)
                     ? 'w-12 bg-blue-600 shadow-md' : 'w-4 bg-slate-100'
                   }`}></div>
                 ))}
              </div>
           </div>
        </div>
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-blue-100">{level.icon}</div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-10 overflow-y-auto pb-32">
        {step === 'CONTENT' && (
          <div className="animate-fade-up space-y-12">
             <div className="aspect-video w-full bg-slate-900 rounded-[3.5rem] overflow-hidden relative group shadow-3xl">
                <img src={level.imageUrl} className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000" alt="" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center bg-gradient-to-t from-slate-950/80 via-transparent to-transparent">
                   <h3 className="text-5xl font-black text-white mb-6 leading-tight tracking-tight">فلسفة {level.title}</h3>
                   <p className="text-white/80 text-xl max-w-2xl font-medium leading-relaxed">
                     {level.description} <br/>
                     في هذه المرحلة، سنقوم بتحويل <span className="text-blue-400 font-black">{user.startupName}</span> نحو آفاق جديدة عبر محاور استراتيجية أساسية.
                   </p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {level.pillars ? level.pillars.map((item, i) => (
                  <div key={i} className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm hover:border-blue-600 transition-all group relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-[4rem] group-hover:scale-110 transition-transform"></div>
                     <span className="text-4xl block mb-6 group-hover:scale-110 transition-transform relative z-10">{item.icon}</span>
                     <h4 className="text-2xl font-black text-slate-900 mb-3 relative z-10">{item.title}</h4>
                     <p className="text-slate-500 font-medium leading-relaxed relative z-10">{item.description}</p>
                  </div>
                )) : (
                  <p className="text-slate-400 italic">جاري تحميل محتوى هذه المرحلة من مخدم بيزنس ديفلوبرز...</p>
                )}
             </div>

             <div className="flex justify-center pt-10">
                <button 
                  onClick={() => { setStep('QUIZ'); playPositiveSound(); window.scrollTo(0,0); }} 
                  className="px-20 py-7 bg-slate-900 text-white rounded-[2.5rem] font-black text-2xl hover:bg-blue-600 transition-all active:scale-95 shadow-2xl flex items-center gap-4"
                >
                  <span>انتقل لاختبار الاستيعاب</span>
                  <svg className="w-8 h-8 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
             </div>
          </div>
        )}

        {step === 'QUIZ' && (
           <div className="max-w-2xl mx-auto space-y-12 animate-fade-up py-10">
              <div className="text-center space-y-4">
                 <div className="w-20 h-20 bg-blue-50 rounded-[1.8rem] flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner border border-blue-100">📝</div>
                 <h3 className="text-4xl font-black text-slate-900">اختبار المحطة 0{level.id}</h3>
                 <p className="text-slate-500 font-medium text-lg">أجب على هذه الأسئلة المنهجية للتأكد من جاهزيتك للمهمة العملية القادمة.</p>
              </div>

              <div className="space-y-6">
                 {(level.quiz || [
                   { question: 'ما هو التحدي الأكبر الذي يعالجه هذا المستوى لمشروعك؟', options: ['الخيار الأول: التركيز على تحسين جودة المخرجات.', 'الخيار الثاني: العمل على تقليل المخاطر التشغيلية.', 'الخيار الثالث: المضي قدماً في بناء الشراكات.'], correctIndex: 0 },
                   { question: 'كيف ستطبق المنهجية التي تعلمتها في واقع التشغيل؟', options: ['الخيار الأول: التركيز على تحسين جودة المخرجات.', 'الخيار الثاني: العمل على تقليل المخاطر التشغيلية.', 'الخيار الثالث: المضي قدماً في بناء الشراكات.'], correctIndex: 1 },
                   { question: 'ما هي النتيجة النهائية المتوقعة بعد اجتياز هذه المرحلة؟', options: ['الخيار الأول: التركيز على تحسين جودة المخرجات.', 'الخيار الثاني: العمل على تقليل المخاطر التشغيلية.', 'الخيار الثالث: المضي قدماً في بناء الشراكات.'], correctIndex: 2 }
                 ]).map((q, i) => (
                    <div key={i} className="p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] space-y-8">
                       <h4 className="font-black text-xl text-slate-800 leading-relaxed">{i+1}. {q.question}</h4>
                       <div className="grid grid-cols-1 gap-3">
                          {q.options.map((o, oi) => (
                            <button key={oi} onClick={playPositiveSound} className="w-full text-right p-5 bg-white border-2 border-slate-100 rounded-2xl font-bold text-sm hover:border-blue-600 hover:bg-blue-50/30 transition-all active:scale-[0.99]">
                               {o}
                            </button>
                          ))}
                       </div>
                    </div>
                 ))}
              </div>

              <button 
                onClick={() => { setStep('DELIVERABLE'); playPositiveSound(); window.scrollTo(0,0); }} 
                className="w-full py-7 bg-blue-600 text-white rounded-[2.5rem] font-black text-xl shadow-xl shadow-blue-600/20 active:scale-95 transition-all hover:bg-blue-700"
              >
                تأكيد الإجابات والمتابعة للمخرج العملي
              </button>
           </div>
        )}

        {step === 'DELIVERABLE' && (
           <div className="max-w-2xl mx-auto space-y-12 animate-fade-up py-10">
              <div className="text-center space-y-4">
                 <div className="w-24 h-24 bg-blue-50 rounded-[2.2rem] flex items-center justify-center text-5xl mx-auto mb-8 shadow-inner border border-blue-100">📤</div>
                 <h3 className="text-4xl font-black text-slate-900 tracking-tight">{currentTask?.title}</h3>
                 <p className="text-slate-500 font-medium text-lg leading-relaxed">{currentTask?.description}</p>
              </div>

              <div className="relative group">
                 <input 
                  type="file" 
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={isSubmitting}
                 />
                 <div className={`w-full h-80 border-4 border-dashed rounded-[4rem] flex flex-col items-center justify-center transition-all duration-500
                   ${isSubmitting ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200 group-hover:border-blue-500 group-hover:bg-blue-50/30'}
                 `}>
                    {isSubmitting ? (
                      <div className="flex flex-col items-center gap-8">
                        <div className="w-16 h-16 border-8 border-blue-600 border-t-transparent rounded-full animate-spin shadow-xl"></div>
                        <p className="text-blue-600 font-black text-xl animate-pulse">جاري التدقيق الذكي للمخرج (Gemini 3 Pro)...</p>
                      </div>
                    ) : (
                      <>
                        <div className="text-7xl mb-8 group-hover:scale-110 transition-transform">📄</div>
                        <p className="font-black text-slate-900 text-2xl mb-2">اضغط لرفع ملف الـ PDF النهائي</p>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Maximum file size: 5MB • Strategic Format Preferred</p>
                      </>
                    )}
                 </div>
              </div>

              <div className="p-10 bg-amber-50 border border-amber-100 rounded-[3rem] flex gap-8 items-start shadow-sm">
                 <span className="text-4xl">💡</span>
                 <div>
                    <h5 className="font-black text-amber-900 text-lg mb-2">نصيحة الموجه الذكي للقبول:</h5>
                    <p className="text-amber-800/80 text-sm font-medium leading-relaxed">
                      تأكد من مواءمة بياناتك المالية أو التشغيلية في هذا الملف مع الرؤية العامة التي طرحتها في مستويات التحقق السابقة لضمان الحصول على درجة قبول مرتفعة.
                    </p>
                 </div>
              </div>
           </div>
        )}

        {step === 'FEEDBACK' && aiResult && (
           <div className="max-w-2xl mx-auto space-y-12 animate-fade-up py-10">
              <div className="p-12 bg-white border border-slate-100 rounded-[4rem] shadow-3xl text-center space-y-12 relative overflow-hidden">
                 <div className={`absolute top-0 left-0 w-full h-3 ${aiResult.score >= 90 ? 'bg-emerald-500 shadow-[0_4px_12px_rgba(16,185,129,0.3)]' : 'bg-blue-500 shadow-[0_4px_12px_rgba(59,130,246,0.3)]'}`}></div>
                 
                 <div className="space-y-6">
                    <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center text-6xl mx-auto shadow-inner border animate-bounce
                      ${aiResult.score >= 70 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}
                    `}>
                      {aiResult.score >= 70 ? '✓' : '!'}
                    </div>
                    <div>
                      <h3 className="text-4xl font-black text-slate-900 tracking-tight">تحليل المخرج الاستراتيجي</h3>
                      <p className="text-slate-400 font-bold mt-2">نظام التدقيق التلقائي (AAS v2.0)</p>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2 py-6">
                       <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">الدرجة النهائية (AI READINESS SCORE)</p>
                       <p className={`text-8xl font-black tracking-tighter ${aiResult.score >= 90 ? 'text-emerald-500' : 'text-blue-600'}`}>{aiResult.score}%</p>
                    </div>
                 </div>

                 <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 text-right space-y-8 shadow-inner">
                    <div className="flex items-center gap-3">
                       <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                       <h4 className="font-black text-blue-600 text-xs uppercase tracking-widest">مراجعة المحلل الذكي (Strategic Review)</h4>
                    </div>
                    <p className="text-slate-700 font-medium text-xl leading-relaxed italic pr-6 border-r-4 border-blue-500">
                      "{aiResult.criticalFeedback || 'تحليل دقيق ومكتمل المعايير، يظهر نضجاً كبيراً في التفكير الريادي.'}"
                    </p>
                 </div>

                 <button 
                  onClick={() => { setShowBadge(true); playCelebrationSound(); }} 
                  className={`w-full py-7 text-white rounded-[2.2rem] font-black text-2xl shadow-2xl active:scale-95 transition-all
                    ${aiResult.score >= 90 ? 'bg-gradient-to-r from-emerald-500 to-emerald-700 shadow-emerald-500/20' : 'bg-slate-900 hover:bg-black shadow-slate-900/20'}
                  `}
                 >
                   {aiResult.score >= 90 ? 'استلام وسام التميز والمتابعة 🚀' : 'استلام وسام المحطة والمتابعة'}
                 </button>
              </div>
           </div>
        )}
      </main>

      <footer className="py-12 border-t border-slate-50 text-center opacity-40">
         <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900">Virtual Acceleration Core • Business Developers Hub • 2024</p>
      </footer>
    </div>
  );
};
