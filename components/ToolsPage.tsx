
import React, { useState } from 'react';
import { 
  generateStartupIdea, 
  generateFounderCV,
  generateProductSpecs,
  generateMarketAnalysisAI,
  generateStrategicPlanAI,
  generatePitchDeckOutline,
  generateStructuredBusinessPlanAI,
  generateSWOTAnalysisAI,
  generateInvestorPitchAI,
  generateGTMStrategyAI,
  generateFinancialForecastAI
} from '../services/geminiService';
import { playPositiveSound, playCelebrationSound, playErrorSound } from '../services/audioService';

interface ToolsPageProps {
  onBack: () => void;
}

type ToolID = 'IDEA' | 'CV' | 'PRODUCT' | 'MARKET' | 'PLAN' | 'DECK' | 'FULL_PLAN' | 'SWOT' | 'INVESTOR_PITCH' | 'GTM' | 'FINANCE';

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
    id: 'INVESTOR_PITCH', 
    title: 'مولد العروض الاستثمارية (Pitch)', 
    desc: 'ولّد هيكل عرض تقديمي احترافي مصمم لجذب اهتمام المستثمرين.', 
    detailedInfo: 'صياغة استراتيجية لـ ١٠ شرائح بنظام Sequoia تشمل المشكلة والحل وطلب الاستثمار.',
    expectedOutput: 'هيكل عرض تقديمي (Pitch Deck Outline) متكامل.',
    aiLogic: 'Sequoia Capital VC Framework',
    icon: '🎙️', 
    color: 'indigo' 
  },
  { 
    id: 'GTM', 
    title: 'معماري استراتيجية النمو (GTM)', 
    desc: 'صمم خطة الوصول للسوق واختراق الشرائح المستهدفة.', 
    detailedInfo: 'تحليل قنوات الاستحواذ، تسعير المنتج، وتحديد الرسائل التسويقية الجوهرية.',
    expectedOutput: 'خطة Go-to-Market شاملة.',
    aiLogic: 'Growth Marketing & Acquisition Patterns',
    icon: '🚀', 
    color: 'emerald' 
  },
  { 
    id: 'FINANCE', 
    title: 'المتنبئ المالي لـ ٣ سنوات', 
    desc: 'توقع الإيرادات والمصروفات وصافي الأرباح بناءً على نموذج عملك.', 
    detailedInfo: 'محاكاة مالية هيكلية للمساعدة في تقييم الجدوى الاقتصادية للمشروع.',
    expectedOutput: 'جدول توقعات مالية (Revenue, OpEx, Profit).',
    aiLogic: 'Structured Financial Modeling',
    icon: '📊', 
    color: 'amber' 
  },
  { 
    id: 'FULL_PLAN', 
    title: 'معماري خطة العمل الشاملة', 
    desc: 'ولّد وثيقة استراتيجية متكاملة تشمل كافة أقسام خطة العمل المؤسسية.', 
    detailedInfo: 'محرك Gemini 3 Pro يحلل جوهر فكرتك ليصيغ الملخص التنفيذي، تحليل السوق المالي، وتوقعات النمو.',
    expectedOutput: 'تقرير خطة عمل (Executive Summary, Market Analysis, Projections).',
    aiLogic: 'Tier-1 Consulting Framework',
    icon: '🏛️', 
    color: 'blue' 
  },
  { 
    id: 'SWOT', 
    title: 'محلل SWOT الاستراتيجي', 
    desc: 'احصل على تحليل معمق لنقاط القوة، الضعف، الفرص، والتهديدات لمشروعك.', 
    detailedInfo: 'رؤية نقدية من منظور مستثمر جريء لكشف الثغرات التشغيلية والفرص الخفية.',
    expectedOutput: 'مصفوفة SWOT مع توصيات معالجة المخاطر.',
    aiLogic: 'Venture Capital Feasibility Model',
    icon: '📈', 
    color: 'rose' 
  },
  { 
    id: 'MARKET', 
    title: 'محرك تحليل السوق', 
    desc: 'احصل على تحليل عميق للمنافسين والاتجاهات لقطاعك المستهدف.', 
    detailedInfo: 'مسح شامل لبيانات السوق العالمية لتحديد حجم الفرصة (TAM) والمنافسين المباشرين.',
    expectedOutput: 'تقرير استخبارات سوقي متكامل.',
    aiLogic: 'Deep Trend Scanning + Sector Analysis',
    icon: '🌍', 
    color: 'emerald' 
  },
  { 
    id: 'IDEA', 
    title: 'مولد الأفكار الابتكارية', 
    desc: 'استخرج أفكاراً لمشاريع ناشئة بناءً على شغفك واتجاهات السوق.', 
    detailedInfo: 'يستخدم محرك Gemini لتحليل تقاطعات مهاراتك مع "الفجوات البيضاء" في السوق.',
    expectedOutput: 'تقرير يحتوي على ٣ أفكار فريدة.',
    aiLogic: 'تحليل SWOT + استراتيجية المحيط الأزرق',
    icon: '💡', 
    color: 'blue' 
  },
  { 
    id: 'PRODUCT', 
    title: 'مهندس المنتج (MVP)', 
    desc: 'حدد المزايا الجوهرية وصمم رحلة المستخدم التقنية.', 
    detailedInfo: 'تحليل المتطلبات التقنية وترتيب أولويات الميزات لبناء منتج أولي.',
    expectedOutput: 'قائمة ميزات MVP + مخطط تدفق المستخدم.',
    aiLogic: 'Agile Product Management',
    icon: '⚙️', 
    color: 'cyan' 
  }
];

export const ToolsPage: React.FC<ToolsPageProps> = ({ onBack }) => {
  const [activeTool, setActiveTool] = useState<ToolID | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeResultTab, setActiveResultTab] = useState<'summary' | 'market' | 'financials'>('summary');

  const [forms, setForms] = useState({
    IDEA: { sector: '', interest: '' },
    CV: { name: '', experience: '', skills: '', vision: '' },
    PRODUCT: { projectName: '', description: '' },
    MARKET: { sector: '', location: 'السعودية والخليج', target: 'B2C' },
    PLAN: { name: '', valueProp: '', revenue: 'اشتراكات شهرية' },
    DECK: { startupName: '', problem: '', solution: '' },
    FULL_PLAN: { name: '', industry: '', problem: '', solution: '', competitors: '', vision3yr: '' },
    SWOT: { name: '', description: '' },
    INVESTOR_PITCH: { name: '', description: '', targetMarket: '', amount: '' },
    GTM: { name: '', industry: '', target: '', pricing: '' },
    FINANCE: { name: '', revenueModel: '', initialCap: '', burnRate: '' }
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
      else if (activeTool === 'PRODUCT') res = await generateProductSpecs(currentForm);
      else if (activeTool === 'MARKET') res = await generateMarketAnalysisAI(currentForm);
      else if (activeTool === 'PLAN') res = await generateStrategicPlanAI(currentForm);
      else if (activeTool === 'DECK') res = await generatePitchDeckOutline(currentForm);
      else if (activeTool === 'FULL_PLAN') res = await generateStructuredBusinessPlanAI(currentForm);
      else if (activeTool === 'SWOT') res = await generateSWOTAnalysisAI(currentForm);
      else if (activeTool === 'INVESTOR_PITCH') res = await generateInvestorPitchAI(currentForm);
      else if (activeTool === 'GTM') res = await generateGTMStrategyAI(currentForm);
      else if (activeTool === 'FINANCE') res = await generateFinancialForecastAI(currentForm);
      
      setResult(res);
      playCelebrationSound();
    } catch (e) {
      playErrorSound();
      alert("فشل محرك Gemini في توليد المخرج. يرجى المحاولة لاحقاً.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full p-5 bg-[#161c2d] border border-white/5 rounded-2xl outline-none focus:border-blue-600 transition-all font-bold text-white placeholder-slate-600 shadow-inner";
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
                    <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-xl p-10 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-center text-right z-20 translate-y-4 group-hover:translate-y-0 pointer-events-none">
                      <div className="space-y-6">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em]">الهدف من الأداة</p>
                          <p className="text-sm font-bold text-white leading-relaxed">{tool.detailedInfo}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em]">المخرج المتوقع</p>
                          <p className="text-[11px] font-medium text-slate-300 leading-relaxed italic">{tool.expectedOutput}</p>
                        </div>
                        <div className="pt-4 text-center">
                           <span className="bg-blue-600 text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl">انقر للتشغيل الآن</span>
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-bl-[4rem]"></div>
                    <div>
                      <div className="text-5xl mb-8 group-hover:rotate-6 transition-transform block relative z-10">{tool.icon}</div>
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
             <div className="glass-card p-10 md:p-14 rounded-[4rem] border border-white/5 shadow-3xl space-y-10 bg-[#0f172a]/50">
                <div className="pb-10 border-b border-white/5">
                   <h3 className="text-3xl font-black text-white">{TOOLS_META.find(t => t.id === activeTool)?.title}</h3>
                   <p className="text-blue-500 font-bold text-[10px] uppercase tracking-widest mt-2">إعداد مدخلات المحرك الذكي</p>
                </div>

                <div className="space-y-8">
                   {activeTool === 'GTM' && (
                     <div className="space-y-6">
                        <div>
                           <label className={labelClass}>اسم المشروع</label>
                           <input className={inputClass} value={forms.GTM.name} onChange={e => setForms({...forms, GTM: {...forms.GTM, name: e.target.value}})} placeholder="اسم شركتك" />
                        </div>
                        <div>
                           <label className={labelClass}>القطاع</label>
                           <input className={inputClass} value={forms.GTM.industry} onChange={e => setForms({...forms, GTM: {...forms.GTM, industry: e.target.value}})} placeholder="Fintech, Health, etc" />
                        </div>
                        <div>
                           <label className={labelClass}>الفئة المستهدفة</label>
                           <input className={inputClass} value={forms.GTM.target} onChange={e => setForms({...forms, GTM: {...forms.GTM, target: e.target.value}})} placeholder="من هم عملاؤك الأوائل؟" />
                        </div>
                        <div>
                           <label className={labelClass}>خطة التسعير</label>
                           <input className={inputClass} value={forms.GTM.pricing} onChange={e => setForms({...forms, GTM: {...forms.GTM, pricing: e.target.value}})} placeholder="اشتراكات، عمولات، الخ" />
                        </div>
                     </div>
                   )}

                   {activeTool === 'FINANCE' && (
                     <div className="space-y-6">
                        <div>
                           <label className={labelClass}>اسم المشروع</label>
                           <input className={inputClass} value={forms.FINANCE.name} onChange={e => setForms({...forms, FINANCE: {...forms.FINANCE, name: e.target.value}})} placeholder="اسم الشركة" />
                        </div>
                        <div>
                           <label className={labelClass}>نموذج الإيرادات</label>
                           <textarea className={inputClass + " h-24 resize-none"} value={forms.FINANCE.revenueModel} onChange={e => setForms({...forms, FINANCE: {...forms.FINANCE, revenueModel: e.target.value}})} placeholder="كيف ستحقق المال؟" />
                        </div>
                        <div>
                           <label className={labelClass}>رأس المال المبدئي</label>
                           <input className={inputClass} value={forms.FINANCE.initialCap} onChange={e => setForms({...forms, FINANCE: {...forms.FINANCE, initialCap: e.target.value}})} placeholder="مثال: ١٠٠ ألف ريال" />
                        </div>
                        <div>
                           <label className={labelClass}>معدل الحرق الشهري المقدر (OpEx)</label>
                           <input className={inputClass} value={forms.FINANCE.burnRate} onChange={e => setForms({...forms, FINANCE: {...forms.FINANCE, burnRate: e.target.value}})} placeholder="مثال: ١٠ آلاف ريال" />
                        </div>
                     </div>
                   )}

                   {activeTool === 'INVESTOR_PITCH' && (
                     <div className="space-y-6">
                        <div>
                           <label className={labelClass}>اسم المشروع</label>
                           <input className={inputClass} value={forms.INVESTOR_PITCH.name} onChange={e => setForms({...forms, INVESTOR_PITCH: {...forms.INVESTOR_PITCH, name: e.target.value}})} placeholder="اسم شركتك" />
                        </div>
                        <div>
                           <label className={labelClass}>وصف المشروع والمنتج</label>
                           <textarea className={inputClass + " h-32 resize-none"} value={forms.INVESTOR_PITCH.description} onChange={e => setForms({...forms, INVESTOR_PITCH: {...forms.INVESTOR_PITCH, description: e.target.value}})} placeholder="ما الذي تقدمه للعملاء؟" />
                        </div>
                        <div>
                           <label className={labelClass}>مبلغ الاستثمار المطلوب</label>
                           <input className={inputClass} value={forms.INVESTOR_PITCH.amount} onChange={e => setForms({...forms, INVESTOR_PITCH: {...forms.INVESTOR_PITCH, amount: e.target.value}})} placeholder="مثال: ٥٠٠ ألف دولار" />
                        </div>
                     </div>
                   )}

                   {activeTool === 'SWOT' && (
                     <div className="space-y-6">
                        <div>
                           <label className={labelClass}>اسم المشروع</label>
                           <input className={inputClass} value={forms.SWOT.name} onChange={e => setForms({...forms, SWOT: {...forms.SWOT, name: e.target.value}})} placeholder="أدخل اسم شركتك الناشئة" />
                        </div>
                        <div>
                           <label className={labelClass}>وصف المشروع والعمليات</label>
                           <textarea className={inputClass + " h-48 resize-none leading-relaxed"} value={forms.SWOT.description} onChange={e => setForms({...forms, SWOT: {...forms.SWOT, description: e.target.value}})} placeholder="تحدث عن فكرتك، فريقك، والمنافسين..." />
                        </div>
                     </div>
                   )}

                   {activeTool === 'FULL_PLAN' && (
                     <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                           <div>
                              <label className={labelClass}>اسم المشروع</label>
                              <input className={inputClass} value={forms.FULL_PLAN.name} onChange={e => setForms({...forms, FULL_PLAN: {...forms.FULL_PLAN, name: e.target.value}})} placeholder="اسم الكيان" />
                           </div>
                           <div>
                              <label className={labelClass}>القطاع</label>
                              <input className={inputClass} value={forms.FULL_PLAN.industry} onChange={e => setForms({...forms, FULL_PLAN: {...forms.FULL_PLAN, industry: e.target.value}})} placeholder="FinTech" />
                           </div>
                        </div>
                        <div>
                           <label className={labelClass}>المشكلة والحل</label>
                           <textarea className={inputClass + " h-32 resize-none"} value={forms.FULL_PLAN.problem} onChange={e => setForms({...forms, FULL_PLAN: {...forms.FULL_PLAN, problem: e.target.value}})} placeholder="ما هو الألم الذي تعالجه؟" />
                        </div>
                        <div>
                           <label className={labelClass}>الرؤية لـ ٣ سنوات</label>
                           <textarea className={inputClass + " h-32 resize-none"} value={forms.FULL_PLAN.vision3yr} onChange={e => setForms({...forms, FULL_PLAN: {...forms.FULL_PLAN, vision3yr: e.target.value}})} placeholder="أين ترى مشروعك بعد ٣ سنوات؟" />
                        </div>
                     </div>
                   )}

                   {activeTool === 'MARKET' && (
                     <div className="space-y-6">
                        <div>
                           <label className={labelClass}>القطاع</label>
                           <input className={inputClass} value={forms.MARKET.sector} onChange={e => setForms({...forms, MARKET: {...forms.MARKET, sector: e.target.value}})} placeholder="الخدمات اللوجستية" />
                        </div>
                        <div>
                           <label className={labelClass}>الموقع الجغرافي</label>
                           <input className={inputClass} value={forms.MARKET.location} onChange={e => setForms({...forms, MARKET: {...forms.MARKET, location: e.target.value}})} placeholder="المملكة العربية السعودية" />
                        </div>
                     </div>
                   )}

                   <button 
                    onClick={handleGenerate} 
                    disabled={isLoading}
                    className="w-full py-7 bg-blue-600 text-white rounded-[2.5rem] font-black text-xl shadow-3xl shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50 btn-glow"
                   >
                     {isLoading ? (
                       <>
                         <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                         <span>جاري المعالجة الذكية...</span>
                       </>
                     ) : (
                       <span>تفعيل المحرك الاستراتيجي 🚀</span>
                     )}
                   </button>
                </div>
             </div>

             {/* Output Area */}
             <div className="bg-[#0f172a] p-12 rounded-[4rem] text-white min-h-[700px] flex flex-col relative overflow-hidden shadow-3xl border border-white/5">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(0,82,255,0.05),transparent_50%)] pointer-events-none"></div>
                
                {isLoading && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
                     <div className="w-32 h-32 border-8 border-white/5 border-t-blue-600 rounded-full animate-spin mb-10 shadow-2xl shadow-blue-500/20"></div>
                     <h3 className="text-3xl font-black animate-pulse uppercase tracking-widest">Architecting Strategy</h3>
                     <div className="mt-8 space-y-2">
                        <p className="text-xs font-mono text-blue-500 tracking-[0.2em] uppercase">Scanning Market Ecosystem...</p>
                        <p className="text-[10px] font-mono text-slate-600 tracking-[0.1em] uppercase">Gemini-3 Pro Active Node</p>
                     </div>
                  </div>
                )}

                {!result && !isLoading && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                     <div className="text-8xl mb-10 animate-float">🤖</div>
                     <h3 className="text-2xl font-black">بانتظار المدخلات</h3>
                     <p className="max-w-xs mt-4 font-medium text-slate-400">املأ البيانات في اليمين لنقوم بتوليد المخرج الاستراتيجي الشامل.</p>
                  </div>
                )}

                {result && activeTool === 'FINANCE' && (
                  <div className="animate-fade-up space-y-10 pb-10 relative z-10 flex-1 flex flex-col">
                    <div className="pb-8 border-b border-white/5">
                      <h4 className="text-2xl font-black text-amber-400">توقعات التدفقات المالية (٣ سنوات)</h4>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Financial Integrity Simulation</p>
                    </div>

                    <div className="flex-1 overflow-x-auto">
                      <table className="w-full text-right border-collapse">
                        <thead>
                          <tr className="bg-white/5">
                            <th className="p-4 text-xs font-black text-slate-400 uppercase border-b border-white/10">السنة</th>
                            <th className="p-4 text-xs font-black text-slate-400 uppercase border-b border-white/10">الإيرادات</th>
                            <th className="p-4 text-xs font-black text-slate-400 uppercase border-b border-white/10">المصروفات</th>
                            <th className="p-4 text-xs font-black text-slate-400 uppercase border-b border-white/10">صافي الربح</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {result.years.map((y: any, i: number) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors">
                              <td className="p-4 font-black text-white">{y.yearLabel}</td>
                              <td className="p-4 font-bold text-emerald-400">{y.revenue.toLocaleString()}</td>
                              <td className="p-4 font-bold text-rose-400">{y.expenses.toLocaleString()}</td>
                              <td className={`p-4 font-black ${y.netProfit >= 0 ? 'text-blue-400' : 'text-rose-600'}`}>{y.netProfit.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-3xl">
                      <p className="text-[10px] font-black text-blue-400 uppercase mb-2">توصية المدير المالي (CFO Advice):</p>
                      <p className="text-sm font-medium leading-relaxed italic text-slate-200">"{result.strategicAdvice}"</p>
                    </div>
                  </div>
                )}

                {result && activeTool !== 'FINANCE' && (
                  <div className="animate-fade-up space-y-10 pb-10 relative z-10 flex-1 flex flex-col">
                     <div className="flex justify-between items-center pb-8 border-b border-white/5">
                        <div>
                          <h4 className="text-2xl font-black text-blue-400">المخرج الاستراتيجي</h4>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Generated by Global Standard AI Strategy Core</p>
                        </div>
                        <button 
                          onClick={() => { navigator.clipboard.writeText(typeof result === 'string' ? result : JSON.stringify(result)); alert('تم النسخ!'); }} 
                          className="text-[10px] font-black uppercase tracking-widest px-8 py-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10"
                        >
                          نسخ المخرج
                        </button>
                     </div>
                     <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 pt-6">
                        <div className="text-lg leading-relaxed whitespace-pre-wrap font-medium text-slate-200">
                           {typeof result === 'string' ? result : (activeTool === 'FULL_PLAN' ? result.executiveSummary : JSON.stringify(result, null, 2))}
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
