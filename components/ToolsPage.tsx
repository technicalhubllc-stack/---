
import React, { useState } from 'react';
import { 
  generateStartupIdea, 
  generateFounderCV,
  generateProductSpecs,
  generateMarketAnalysisAI,
  generateStrategicPlanAI,
  generatePitchDeckOutline,
  generateFullBusinessPlanAI
} from '../services/geminiService';
import { playPositiveSound, playCelebrationSound, playErrorSound } from '../services/audioService';

interface ToolsPageProps {
  onBack: () => void;
}

type ToolID = 'IDEA' | 'CV' | 'PRODUCT' | 'MARKET' | 'PLAN' | 'DECK' | 'FULL_PLAN';

interface ToolMeta {
  id: ToolID;
  title: string;
  desc: string;
  detailedInfo: string;
  expectedOutput: string;
  aiLogic: string;
  icon: string;
  color: string;
}

const TOOLS_META: ToolMeta[] = [
  { 
    id: 'FULL_PLAN', 
    title: 'معماري خطة العمل الشاملة', 
    desc: 'ولّد وثيقة استراتيجية متكاملة تشمل كافة أقسام خطة العمل المؤسسية.', 
    detailedInfo: 'محرك Gemini 3 Pro يحلل جوهر فكرتك ليصيغ الملخص التنفيذي، تحليل السوق المالي، وتوقعات النمو لـ ٣ سنوات.',
    expectedOutput: 'تقرير خطة عمل (Executive Summary, Market Analysis, Projections).',
    aiLogic: 'Tier-1 Consulting Framework (McKinsey Style)',
    icon: '🏛️', 
    color: 'blue' 
  },
  { 
    id: 'IDEA', 
    title: 'مولد الأفكار الابتكارية', 
    desc: 'استخرج أفكاراً لمشاريع ناشئة بناءً على شغفك واتجاهات السوق.', 
    detailedInfo: 'يستخدم محرك Gemini لتحليل تقاطعات مهاراتك مع "الفجوات البيضاء" في السوق الحالي.',
    expectedOutput: 'تقرير بصيغة Markdown يحتوي على ٣ أفكار فريدة.',
    aiLogic: 'تحليل SWOT + استراتيجية المحيط الأزرق',
    icon: '💡', 
    color: 'blue' 
  },
  { 
    id: 'MARKET', 
    title: 'محرك تحليل السوق', 
    desc: 'احصل على تحليل عميق للمنافسين والاتجاهات لقطاعك المستهدف.', 
    detailedInfo: 'مسح شامل لبيانات السوق العالمية لتحديد حجم الفرصة (TAM) والمنافسين المباشرين.',
    expectedOutput: 'تقرير استخبارات سوقي متكامل.',
    aiLogic: 'Deep Web Scanning + Sector Analysis',
    icon: '🌍', 
    color: 'emerald' 
  },
  { 
    id: 'PLAN', 
    title: 'معماري خطة العمل (Lean)', 
    desc: 'ابنِ خطة عمل استراتيجية مرنة تغطي جوانب التشغيل والنمو.', 
    detailedInfo: 'تحويل رؤيتك إلى خطة عمل واقعية تشمل نموذج العمل وقنوات الاستحواذ.',
    expectedOutput: 'خطة عمل استراتيجية (Lean Canvas).',
    aiLogic: 'Lean Startup Framework v3.0',
    icon: '📊', 
    color: 'amber' 
  },
  { 
    id: 'PRODUCT', 
    title: 'مهندس المنتج (MVP)', 
    desc: 'حدد المزايا الجوهرية وصمم رحلة المستخدم التقنية.', 
    detailedInfo: 'تحليل المتطلبات التقنية وترتيب أولويات الميزات لبناء منتج أولي.',
    expectedOutput: 'قائمة ميزات MVP + مخطط تدفق المستخدم.',
    aiLogic: 'Agile Product Management Framework',
    icon: '⚙️', 
    color: 'cyan' 
  },
  { 
    id: 'CV', 
    title: 'بروفايل المؤسس (CV)', 
    desc: 'صمم سيرة ذاتية تبرز مهاراتك القيادية بربطها بمشروعك.', 
    detailedInfo: 'صياغة ذكية تحول مسارك المهني السابق إلى قصة نجاح ريادية.',
    expectedOutput: 'سيرة ذاتية ريادية (Executive Profile).',
    aiLogic: 'NLP Optimization + Storytelling',
    icon: '👤', 
    color: 'purple' 
  },
  { 
    id: 'DECK', 
    title: 'مصمم العرض الاستثماري', 
    desc: 'صغ هيكلاً قوياً لعرضك التقديمي لاقتناص فرص التمويل.', 
    detailedInfo: 'توليد هيكل استراتيجي من ٧ شرائح أساسية تغطي (المشكلة، الحل، السوق).',
    expectedOutput: 'هيكل العرض التقديمي (Pitch Deck Outline).',
    aiLogic: 'Venture Capital Standards',
    icon: '🚀', 
    color: 'rose' 
  }
];

export const ToolsPage: React.FC<ToolsPageProps> = ({ onBack }) => {
  const [activeTool, setActiveTool] = useState<ToolID | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [forms, setForms] = useState({
    IDEA: { sector: '', interest: '' },
    CV: { name: '', experience: '', skills: '', vision: '' },
    PRODUCT: { projectName: '', description: '' },
    MARKET: { sector: '', location: 'السعودية والخليج', target: 'B2C' },
    PLAN: { name: '', valueProp: '', revenue: 'اشتراكات شهرية' },
    DECK: { startupName: '', problem: '', solution: '' },
    FULL_PLAN: { name: '', problem: '', solution: '', audience: '', revenue: '' }
  });

  const handleGenerate = async () => {
    if (!activeTool) return;
    setIsLoading(true);
    setResult(null);
    playPositiveSound();

    try {
      let res;
      const currentForm = (forms as any)[activeTool];
      
      if (activeTool === 'IDEA') res = await generateStartupIdea(currentForm);
      else if (activeTool === 'CV') res = await generateFounderCV(currentForm);
      else if (activeTool === 'PRODUCT') res = await generateProductSpecs(currentForm);
      else if (activeTool === 'MARKET') res = await generateMarketAnalysisAI(currentForm);
      else if (activeTool === 'PLAN') res = await generateStrategicPlanAI(currentForm);
      else if (activeTool === 'DECK') res = await generatePitchDeckOutline(currentForm);
      else if (activeTool === 'FULL_PLAN') res = await generateFullBusinessPlanAI(currentForm);
      
      setResult(res);
      playCelebrationSound();
    } catch (e) {
      playErrorSound();
      alert("فشل محرك Gemini في توليد المخرج. يرجى المحاولة لاحقاً.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full p-5 bg-[#161c2d] border border-white/5 rounded-2xl outline-none focus:border-blue-600 transition-all font-bold text-white placeholder-slate-600";
  const labelClass = "block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 pr-2";

  return (
    <div className="min-h-screen bg-[#020617] font-sans text-right text-white" dir="rtl">
      
      <header className="bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 px-8 py-5 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <button onClick={activeTool ? () => { setActiveTool(null); setResult(null); } : onBack} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group border border-white/5">
            <svg className="w-6 h-6 transform rotate-180 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-black leading-none">أدوات الذكاء الاستراتيجي</h1>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">AI-Powered Business Intelligence</p>
          </div>
        </div>
        {activeTool && (
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Core: Gemini 3 Pro</span>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {!activeTool ? (
          <div className="space-y-20 animate-fade-up">
            <div className="text-center space-y-6 max-w-2xl mx-auto">
               <h2 className="text-6xl md:text-7xl font-black tracking-tight leading-none">مختبر التنفيذ الذكي</h2>
               <p className="text-slate-400 text-xl font-medium leading-relaxed">أدوات تنفيذية صممت لتمكين رواد الأعمال من بناء مخرجات استراتيجية بجودة تنافس مكاتب الاستشارات العالمية.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {TOOLS_META.map(tool => (
                 <button 
                  key={tool.id} 
                  onClick={() => { setActiveTool(tool.id); playPositiveSound(); }}
                  className="text-right p-10 bg-[#0f172a] rounded-[3.5rem] border border-white/5 shadow-2xl hover:border-blue-600 transition-all group relative overflow-hidden flex flex-col justify-between h-full"
                 >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-bl-[4rem] group-hover:scale-110 transition-transform"></div>
                    <div>
                      <div className="text-5xl mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform block relative z-10">{tool.icon}</div>
                      <h3 className="text-2xl font-black text-white mb-4 relative z-10">{tool.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium relative z-10">{tool.desc}</p>
                    </div>
                    <div className="flex justify-between items-center pt-8 border-t border-white/5 relative z-10">
                       <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest group-hover:underline underline-offset-8">فتح الأداة الذكية ←</span>
                       <span className={`w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]`}></span>
                    </div>
                 </button>
               ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-up items-start">
             
             {/* Form Area */}
             <div className="glass-card p-10 md:p-14 rounded-[4rem] border border-white/5 shadow-3xl space-y-10">
                <div className="pb-10 border-b border-white/5">
                   <h3 className="text-3xl font-black text-white">{TOOLS_META.find(t => t.id === activeTool)?.title}</h3>
                   <p className="text-blue-500 font-bold text-[10px] uppercase tracking-widest mt-2">إعداد مدخلات المحرك الذكي</p>
                </div>

                <div className="space-y-8">
                   {activeTool === 'FULL_PLAN' && (
                     <div className="space-y-6">
                        <div>
                           <label className={labelClass}>اسم المشروع</label>
                           <input className={inputClass} value={forms.FULL_PLAN.name} onChange={e => setForms({...forms, FULL_PLAN: {...forms.FULL_PLAN, name: e.target.value}})} placeholder="مثال: منصة عِلم لتدريس البرمجة" />
                        </div>
                        <div>
                           <label className={labelClass}>المشكلة الجوهرية</label>
                           <textarea className={inputClass + " h-32 resize-none"} value={forms.FULL_PLAN.problem} onChange={e => setForms({...forms, FULL_PLAN: {...forms.FULL_PLAN, problem: e.target.value}})} placeholder="صف الفجوة التي لاحظتها في السوق..." />
                        </div>
                        <div>
                           <label className={labelClass}>الحل المقترح</label>
                           <textarea className={inputClass + " h-32 resize-none"} value={forms.FULL_PLAN.solution} onChange={e => setForms({...forms, FULL_PLAN: {...forms.FULL_PLAN, solution: e.target.value}})} placeholder="كيف يحل منتجك هذه المشكلة بطريقة مبتكرة؟" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                              <label className={labelClass}>الجمهور المستهدف</label>
                              <input className={inputClass} value={forms.FULL_PLAN.audience} onChange={e => setForms({...forms, FULL_PLAN: {...forms.FULL_PLAN, audience: e.target.value}})} placeholder="B2B, أفراد..." />
                           </div>
                           <div>
                              <label className={labelClass}>نموذج الإيرادات</label>
                              <input className={inputClass} value={forms.FULL_PLAN.revenue} onChange={e => setForms({...forms, FULL_PLAN: {...forms.FULL_PLAN, revenue: e.target.value}})} placeholder="اشتراكات، عمولات..." />
                           </div>
                        </div>
                     </div>
                   )}

                   {activeTool === 'MARKET' && (
                     <div className="space-y-6">
                        <div>
                           <label className={labelClass}>القطاع المستهدف</label>
                           <input className={inputClass} placeholder="الخدمات اللوجستية" value={forms.MARKET.sector} onChange={e => setForms({...forms, MARKET: {...forms.MARKET, sector: e.target.value}})} />
                        </div>
                        <div>
                           <label className={labelClass}>النطاق الجغرافي</label>
                           <input className={inputClass} placeholder="المملكة العربية السعودية" value={forms.MARKET.location} onChange={e => setForms({...forms, MARKET: {...forms.MARKET, location: e.target.value}})} />
                        </div>
                        <div>
                           <label className={labelClass}>فئة العملاء</label>
                           <select className={inputClass} value={forms.MARKET.target} onChange={e => setForms({...forms, MARKET: {...forms.MARKET, target: e.target.value}})}>
                              <option value="B2C">أفراد (B2C)</option>
                              <option value="B2B">شركات (B2B)</option>
                              <option value="Gov">جهات حكومية (B2G)</option>
                           </select>
                        </div>
                     </div>
                   )}

                   {activeTool === 'IDEA' && (
                     <div className="space-y-6">
                        <div>
                           <label className={labelClass}>قطاع العمل المفضل</label>
                           <input className={inputClass} value={forms.IDEA.sector} onChange={e => setForms({...forms, IDEA: {...forms.IDEA, sector: e.target.value}})} />
                        </div>
                        <div>
                           <label className={labelClass}>مهاراتك واهتماماتك</label>
                           <textarea className={inputClass + " h-40 resize-none"} value={forms.IDEA.interest} onChange={e => setForms({...forms, IDEA: {...forms.IDEA, interest: e.target.value}})} />
                        </div>
                     </div>
                   )}

                   <button 
                    onClick={handleGenerate} 
                    disabled={isLoading}
                    className="w-full py-7 bg-blue-600 text-white rounded-[2.5rem] font-black text-xl shadow-3xl shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50"
                   >
                     {isLoading ? (
                       <>
                         <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                         <span>جاري المعالجة...</span>
                       </>
                     ) : (
                       <>
                        <span>تفعيل المحرك الذكي 🚀</span>
                       </>
                     )}
                   </button>
                </div>
             </div>

             {/* Output Area */}
             <div className="bg-[#0f172a] p-12 rounded-[4rem] text-white min-h-[700px] flex flex-col relative overflow-hidden shadow-3xl border border-white/5">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(0,82,255,0.05),transparent_50%)] pointer-events-none"></div>
                
                {!result && !isLoading && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                     <div className="text-8xl mb-10 animate-float">🤖</div>
                     <h3 className="text-2xl font-black">بانتظار المدخلات</h3>
                     <p className="max-w-xs mt-4 font-medium">املأ البيانات في اليمين لنقوم بتوليد المخرج الاستراتيجي الشامل.</p>
                  </div>
                )}
                
                {isLoading && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                     <div className="w-32 h-32 border-8 border-white/5 border-t-blue-600 rounded-full animate-spin mb-10 shadow-2xl shadow-blue-500/20"></div>
                     <h3 className="text-3xl font-black animate-pulse uppercase tracking-widest">Architecting Strategy</h3>
                     <p className="text-slate-500 text-sm mt-6">نستخدم Gemini 3 Pro لضمان جودة استثمارية عالية.</p>
                  </div>
                )}

                {result && (
                  <div className="animate-fade-up space-y-10 pb-10 relative z-10">
                     <div className="flex justify-between items-center pb-8 border-b border-white/5">
                        <div>
                          <h4 className="text-2xl font-black text-blue-400">التقرير النهائي للمشروع</h4>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Generated by Global Standard AI</p>
                        </div>
                        <button 
                          onClick={() => { navigator.clipboard.writeText(typeof result === 'string' ? result : JSON.stringify(result)); alert('تم النسخ!'); }} 
                          className="text-[10px] font-black uppercase tracking-widest px-8 py-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10"
                        >
                          نسخ المحتوى
                        </button>
                     </div>
                     <div className="prose prose-invert max-w-none text-right">
                        <div className="text-xl leading-relaxed whitespace-pre-wrap font-medium text-slate-200">
                           {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
                        </div>
                     </div>
                  </div>
                )}
             </div>
          </div>
        )}
      </main>
    </div>
  );
};