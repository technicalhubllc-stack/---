
import React, { useState } from 'react';
import { 
  generateStartupIdea, 
  generateFounderCV,
  generateProductSpecs,
  generateMarketAnalysisAI,
  generateStrategicPlanAI,
  generatePitchDeckOutline
} from '../services/geminiService';
import { playPositiveSound, playCelebrationSound, playErrorSound } from '../services/audioService';

interface ToolsPageProps {
  onBack: () => void;
}

type ToolID = 'IDEA' | 'CV' | 'PRODUCT' | 'MARKET' | 'PLAN' | 'DECK';

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
    id: 'IDEA', 
    title: 'مولد الأفكار الابتكارية', 
    desc: 'استخرج أفكاراً لمشاريع ناشئة بناءً على شغفك واتجاهات السوق.', 
    detailedInfo: 'يستخدم محرك Gemini لتحليل تقاطعات مهاراتك مع "الفجوات البيضاء" في السوق الحالي لتوليد ٣ أفكار فريدة ذات ميزة تنافسية.',
    expectedOutput: 'تقرير بصيغة Markdown يحتوي على ٣ أفكار مع تحليل الجدوى المبدئي.',
    aiLogic: 'تحليل SWOT + استراتيجية المحيط الأزرق',
    icon: '💡', 
    color: 'blue' 
  },
  { 
    id: 'MARKET', 
    title: 'محرك تحليل السوق', 
    desc: 'احصل على تحليل عميق للمنافسين والاتجاهات لقطاعك المستهدف.', 
    detailedInfo: 'مسح شامل لبيانات السوق العالمية لتحديد حجم الفرصة (TAM) والمنافسين المباشرين والاتجاهات التكنولوجية المؤثرة.',
    expectedOutput: 'تقرير استخبارات سوقي متكامل (Market Intelligence Report).',
    aiLogic: 'Deep Web Scanning + Sector Analysis',
    icon: '🌍', 
    color: 'emerald' 
  },
  { 
    id: 'PLAN', 
    title: 'معماري خطة العمل', 
    desc: 'ابنِ خطة عمل استراتيجية (Lean) تغطي كافة جوانب التشغيل والنمو.', 
    detailedInfo: 'تحويل رؤيتك إلى خطة عمل واقعية تشمل نموذج العمل، قنوات الاستحواذ، وهيكل التكاليف بأسلوب مؤسسي رصين.',
    expectedOutput: 'خطة عمل استراتيجية (Strategic Business Plan).',
    aiLogic: 'Lean Canvas Framework v3.0',
    icon: '📊', 
    color: 'amber' 
  },
  { 
    id: 'PRODUCT', 
    title: 'مهندس المنتج (MVP)', 
    desc: 'حدد المزايا الجوهرية وصمم رحلة المستخدم التقنية.', 
    detailedInfo: 'تحليل المتطلبات التقنية وترتيب أولويات الميزات لبناء منتج أولي (MVP) يركز على حل المشكلة بأقل تكلفة ممكنة.',
    expectedOutput: 'قائمة ميزات MVP + مخطط تدفق المستخدم.',
    aiLogic: 'Agile Product Management Framework',
    icon: '⚙️', 
    color: 'cyan' 
  },
  { 
    id: 'CV', 
    title: 'بروفايل المؤسس (CV)', 
    desc: 'صمم سيرة ذاتية تبرز مهاراتك القيادية بربطها بمشروعك.', 
    detailedInfo: 'صياغة ذكية تحول مسارك المهني السابق إلى قصة نجاح ريادية، مما يرفع موثوقيتك أمام المستثمرين.',
    expectedOutput: 'سيرة ذاتية ريادية (Executive Profile).',
    aiLogic: 'NLP Optimization + Storytelling',
    icon: '👤', 
    color: 'purple' 
  },
  { 
    id: 'DECK', 
    title: 'مصمم العرض الاستثماري', 
    desc: 'صغ هيكلاً قوياً لعرضك التقديمي لاقتناص فرص التمويل.', 
    detailedInfo: 'توليد هيكل استراتيجي من ٧ شرائح أساسية تغطي (المشكلة، الحل، السوق) بأسلوب قصصي مقنع للممولين.',
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
    DECK: { startupName: '', problem: '', solution: '' }
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
      // Fixed: generatePitchDeckOutline is now properly defined and exported from geminiService
      else if (activeTool === 'DECK') res = await generatePitchDeckOutline(currentForm);
      
      setResult(res);
      playCelebrationSound();
    } catch (e) {
      playErrorSound();
      alert("فشل محرك Gemini في توليد المخرج. يرجى المحاولة لاحقاً.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-right" dir="rtl">
      
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50 px-8 py-5 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <button onClick={activeTool ? () => { setActiveTool(null); setResult(null); } : onBack} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all group">
            <svg className="w-6 h-6 transform rotate-180 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 leading-none">أدوات الذكاء الاستراتيجي</h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">AI-Powered Business Intelligence</p>
          </div>
        </div>
        {activeTool && (
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Core: Gemini 3 Pro</span>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {!activeTool ? (
          <div className="space-y-20 animate-fade-up">
            <div className="text-center space-y-6 max-w-2xl mx-auto">
               <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">مختبر التنفيذ الذكي</h2>
               <p className="text-slate-500 text-xl font-medium leading-relaxed">أدوات تنفيذية صممت لتمكين رواد الأعمال من بناء مخرجات استراتيجية بجودة تنافس مكاتب الاستشارات العالمية.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {TOOLS_META.map(tool => (
                 <button 
                  key={tool.id} 
                  onClick={() => { setActiveTool(tool.id); playPositiveSound(); }}
                  className="text-right p-10 bg-white rounded-[3.5rem] border border-slate-100 shadow-sm hover:border-blue-600 transition-all group relative overflow-hidden flex flex-col justify-between h-full"
                 >
                    <div>
                      <div className="text-5xl mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform block">{tool.icon}</div>
                      <h3 className="text-2xl font-black text-slate-900 mb-4">{tool.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">{tool.desc}</p>
                    </div>
                    <div className="flex justify-between items-center pt-8 border-t border-slate-50">
                       <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest group-hover:underline">فتح الأداة الذكية ←</span>
                       <span className={`w-1.5 h-1.5 rounded-full bg-${tool.color}-500`}></span>
                    </div>
                 </button>
               ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-up items-start">
             
             {/* Dynamic Form Area */}
             <div className="bg-white p-10 md:p-14 rounded-[4rem] border border-slate-100 shadow-2xl space-y-10">
                <div className="pb-10 border-b border-slate-50">
                   <h3 className="text-3xl font-black text-slate-900">{TOOLS_META.find(t => t.id === activeTool)?.title}</h3>
                   <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mt-2">إعداد مدخلات المحرك</p>
                </div>

                <div className="space-y-8">
                   {activeTool === 'MARKET' && (
                     <div className="space-y-6">
                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase pr-2 mb-2 block">القطاع المستهدف</label>
                           <input className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black" placeholder="مثال: الخدمات اللوجستية" value={forms.MARKET.sector} onChange={e => setForms({...forms, MARKET: {...forms.MARKET, sector: e.target.value}})} />
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase pr-2 mb-2 block">النطاق الجغرافي</label>
                           <input className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black" placeholder="مثال: المملكة العربية السعودية" value={forms.MARKET.location} onChange={e => setForms({...forms, MARKET: {...forms.MARKET, location: e.target.value}})} />
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase pr-2 mb-2 block">فئة العملاء</label>
                           <select className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black" value={forms.MARKET.target} onChange={e => setForms({...forms, MARKET: {...forms.MARKET, target: e.target.value}})}>
                              <option value="B2C">أفراد (B2C)</option>
                              <option value="B2B">شركات (B2B)</option>
                              <option value="Gov">جهات حكومية (B2G)</option>
                           </select>
                        </div>
                     </div>
                   )}

                   {activeTool === 'PLAN' && (
                     <div className="space-y-6">
                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase pr-2 mb-2 block">اسم المشروع</label>
                           <input className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black" value={forms.PLAN.name} onChange={e => setForms({...forms, PLAN: {...forms.PLAN, name: e.target.value}})} />
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase pr-2 mb-2 block">عرض القيمة الجوهري</label>
                           <textarea className="w-full h-32 p-5 bg-slate-50 border border-slate-200 rounded-2xl font-medium resize-none" placeholder="ما الذي يميزك فعلياً عن الآخرين؟" value={forms.PLAN.valueProp} onChange={e => setForms({...forms, PLAN: {...forms.PLAN, valueProp: e.target.value}})} />
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase pr-2 mb-2 block">نموذج تحقيق الربح</label>
                           <input className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black" placeholder="مثال: رسوم خدمات، اشتراك..." value={forms.PLAN.revenue} onChange={e => setForms({...forms, PLAN: {...forms.PLAN, revenue: e.target.value}})} />
                        </div>
                     </div>
                   )}

                   {activeTool === 'IDEA' && (
                     <div className="space-y-6">
                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase pr-2 mb-2 block">قطاع العمل المفضل</label>
                           <input className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black" value={forms.IDEA.sector} onChange={e => setForms({...forms, IDEA: {...forms.IDEA, sector: e.target.value}})} />
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase pr-2 mb-2 block">مهاراتك واهتماماتك</label>
                           <textarea className="w-full h-32 p-5 bg-slate-50 border border-slate-200 rounded-2xl font-medium resize-none" value={forms.IDEA.interest} onChange={e => setForms({...forms, IDEA: {...forms.IDEA, interest: e.target.value}})} />
                        </div>
                     </div>
                   )}

                   {/* Other tools forms here... */}
                   
                   <button 
                    onClick={handleGenerate} 
                    disabled={isLoading}
                    className="w-full py-7 bg-blue-600 text-white rounded-[2.5rem] font-black text-xl shadow-3xl shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50"
                   >
                     {isLoading ? (
                       <>
                         <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                         <span>جاري التحليل...</span>
                       </>
                     ) : 'تفعيل المحرك الذكي 🚀'}
                   </button>
                </div>
             </div>

             {/* Output Area */}
             <div className="bg-slate-900 p-12 rounded-[4rem] text-white min-h-[600px] flex flex-col relative overflow-hidden shadow-3xl">
                {!result && !isLoading && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                     <div className="text-8xl mb-8 animate-float">🤖</div>
                     <h3 className="text-2xl font-black">بانتظار المدخلات</h3>
                     <p className="max-w-xs mt-4">املأ البيانات لنقوم بتوليد المخرج الاستراتيجي.</p>
                  </div>
                )}
                
                {isLoading && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                     <div className="w-32 h-32 border-8 border-white/10 border-t-blue-600 rounded-full animate-spin mb-10"></div>
                     <h3 className="text-2xl font-black animate-pulse uppercase tracking-widest">Architecting Insights</h3>
                     <p className="text-slate-500 text-sm mt-4">نستخدم Gemini 3 Pro لضمان دقة استثمارية.</p>
                  </div>
                )}

                {result && (
                  <div className="animate-fade-up space-y-8 pb-10">
                     <div className="flex justify-between items-center pb-8 border-b border-white/10">
                        <h4 className="text-xl font-black text-blue-400">التقرير النهائي</h4>
                        <button onClick={() => { navigator.clipboard.writeText(typeof result === 'string' ? result : JSON.stringify(result)); alert('تم النسخ!'); }} className="text-[10px] font-black uppercase tracking-widest px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10">نسخ المحتوى</button>
                     </div>
                     <div className="prose prose-invert max-w-none text-right">
                        <div className="text-xl leading-relaxed whitespace-pre-wrap font-medium text-slate-300">
                           {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
                        </div>
                     </div>
                  </div>
                )}
                
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px]"></div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};
