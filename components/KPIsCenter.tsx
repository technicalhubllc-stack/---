
import React, { useMemo, useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, BarChart, Bar } from 'recharts';
import { StartupRecord, KPIRecord } from '../types';
import { storageService } from '../services/storageService';
import { analyzeStartupKPIsAI } from '../services/geminiService';
import { playPositiveSound, playCelebrationSound } from '../services/audioService';

interface KPIsCenterProps {
  startup: StartupRecord;
}

export const KPIsCenter: React.FC<KPIsCenterProps> = ({ startup: initialStartup }) => {
  const [startup, setStartup] = useState(initialStartup);
  const [isUpdating, setIsUpdating] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Sync state if initialStartup changes
  useEffect(() => {
    setStartup(initialStartup);
  }, [initialStartup]);

  const kpiData = useMemo(() => {
    return startup.kpiHistory && startup.kpiHistory.length > 0 
      ? startup.kpiHistory 
      : [{ date: 'بدء', growth: 10, techReadiness: 10, marketEngagement: 5, revenue: 0, burnRate: 0 }];
  }, [startup.kpiHistory]);

  const radarData = useMemo(() => [
    { subject: 'النمو', A: kpiData[kpiData.length - 1].growth, fullMark: 100 },
    { subject: 'الجاهزية التقنية', A: kpiData[kpiData.length - 1].techReadiness, fullMark: 100 },
    { subject: 'تفاعل السوق', A: kpiData[kpiData.length - 1].marketEngagement, fullMark: 100 },
    { subject: 'نموذج العمل', A: startup.metrics.readiness, fullMark: 100 },
    { subject: 'الفريق', A: startup.partners.length > 0 ? 80 : 30, fullMark: 100 },
  ], [kpiData, startup]);

  const handleRecordUpdate = () => {
    setIsUpdating(true);
    playPositiveSound();

    const last = kpiData[kpiData.length - 1];
    const nextWeek = `أسبوع ${kpiData.length + 1}`;
    
    // Simulate natural growth with some variance
    const newRecord: KPIRecord = {
      date: nextWeek,
      growth: Math.min(100, last.growth + Math.floor(Math.random() * 15) + 2),
      techReadiness: Math.min(100, last.techReadiness + Math.floor(Math.random() * 10) + 1),
      marketEngagement: Math.min(100, last.marketEngagement + Math.floor(Math.random() * 12) + 3),
      revenue: (last.revenue || 0) + Math.floor(Math.random() * 2000),
      burnRate: (last.burnRate || 1000) + Math.floor(Math.random() * 200)
    };

    setTimeout(() => {
      storageService.addKPIRecord(startup.projectId, newRecord);
      const updatedStartups = storageService.getAllStartups();
      const updated = updatedStartups.find(s => s.projectId === startup.projectId);
      if (updated) setStartup(updated);
      setIsUpdating(false);
      playCelebrationSound();
    }, 800);
  };

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeStartupKPIsAI(startup);
      setAiAnalysis(result || "تعذر الحصول على تحليل حالياً.");
    } catch (e) {
      setAiAnalysis("حدث خطأ في محرك التحليل الذكي.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const currentRisk = useMemo(() => {
    const last = kpiData[kpiData.length - 1];
    if (last.growth < 20 && kpiData.length > 3) return { level: 'High', color: 'rose', label: 'مخاطرة عالية' };
    if (last.techReadiness < 30) return { level: 'Medium', color: 'amber', label: 'تأخر تقني' };
    return { level: 'Low', color: 'emerald', label: 'مسار آمن' };
  }, [kpiData]);

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-up pb-32">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-deep-navy/30 backdrop-blur-xl p-8 rounded-[3rem] border border-white/5">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border 
                ${currentRisk.color === 'rose' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}
              `}>
                Current Status: {currentRisk.label}
              </span>
           </div>
           <h2 className="text-4xl font-black text-white">رادار الأداء الاستراتيجي</h2>
           <p className="text-slate-500 font-medium">تحليل البيانات اللحظية ومؤشرات النمو للكيان المؤسسي.</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={handleAIAnalysis}
             disabled={isAnalyzing}
             className="px-8 py-4 glass-premium text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3 disabled:opacity-50"
           >
             {isAnalyzing ? <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : '🧠'}
             <span>طلب تحليل AI</span>
           </button>
           <button 
             onClick={handleRecordUpdate}
             disabled={isUpdating}
             className="px-10 py-4 bg-electric-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-3xl shadow-electric-blue/30 hover:bg-blue-600 transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50"
           >
             {isUpdating ? <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : '📈'}
             <span>تحديث السجل الأسبوعي</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Growth Chart */}
        <div className="lg:col-span-2 glass-card p-12 rounded-[4rem] border border-white/5 space-y-10">
           <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-white flex items-center gap-4">
                 <span className="w-2.5 h-8 bg-electric-blue rounded-full"></span>
                 مؤشر النضج التراكمي
              </h3>
              <div className="flex gap-6">
                 <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span><span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Growth</span></div>
                 <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span><span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Tech</span></div>
              </div>
           </div>
           
           <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={kpiData}>
                  <defs>
                    <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTech" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}} 
                  />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '16px'}}
                    itemStyle={{fontWeight: 'black', fontSize: '12px'}}
                  />
                  <Area type="monotone" dataKey="growth" stroke="#3b82f6" strokeWidth={5} fill="url(#colorGrowth)" />
                  <Area type="monotone" dataKey="techReadiness" stroke="#10b981" strokeWidth={5} fill="url(#colorTech)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Holistic Balance Radar */}
        <div className="bg-slate-900/50 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/5 flex flex-col items-center justify-between shadow-3xl">
           <h3 className="text-xl font-black mb-10 self-start flex items-center gap-4 text-white">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
              التوازن الاستراتيجي
           </h3>
           <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.05)" />
                  <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                  <Radar name="Startup Metrics" dataKey="A" stroke="#3b82f6" strokeWidth={3} fill="#3b82f6" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
           </div>
           <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/5 w-full space-y-3 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-1 h-full bg-electric-blue"></div>
              <p className="text-[10px] font-black text-electric-blue uppercase tracking-widest">تنبيه المخاطر التلقائي</p>
              <p className="text-sm text-slate-300 font-medium leading-relaxed italic">
                {currentRisk.level === 'High' ? 'تحذير: معدل النمو في الأسابيع الأخيرة لا يتناسب مع معدل الحرق المالي.' : 'النظام يعمل بكفاءة عالية وفق المعايير المعتمدة للنمو المستدام.'}
              </p>
           </div>
        </div>
      </div>

      {/* Numerical Insights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         {[
           { label: 'احتمالية التخرج', value: `${70 + Math.floor(startup.metrics.readiness / 5)}%`, sub: 'بناءً على الانضباط', color: 'blue', icon: '🎓' },
           { label: 'متوسط الجذب (Market)', value: `${(kpiData[kpiData.length-1].marketEngagement / 10).toFixed(1)}`, sub: 'من 10 نقاط', color: 'emerald', icon: '📈' },
           { label: 'مؤشر الثقة AI', value: startup.aiClassification || 'Green', sub: 'تصنيف المسرعة', color: 'amber', icon: '🛡️' },
           { label: 'رأس المال المحروق', value: `${kpiData[kpiData.length-1].burnRate || 0} ر.س`, sub: 'تقدير شهري', color: 'rose', icon: '🔥' },
         ].map((stat, i) => (
           <div key={i} className="glass-card p-10 rounded-[3.5rem] border border-white/5 relative group overflow-hidden transition-all duration-500 hover:border-white/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[4rem] group-hover:scale-110 transition-transform"></div>
              <div className="flex justify-between items-start mb-6">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <h4 className={`text-4xl font-black text-white group-hover:text-electric-blue transition-colors`}>{stat.value}</h4>
              <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest">{stat.sub}</p>
           </div>
         ))}
      </div>

      {/* AI Deep Analysis Output */}
      {aiAnalysis && (
        <div className="animate-fade-up glass-card bg-[#0f172a] rounded-[4rem] border border-electric-blue/20 p-12 md:p-16 relative overflow-hidden shadow-[0_0_80px_rgba(37,99,235,0.1)]">
           <div className="absolute top-0 right-0 w-1 h-full bg-electric-blue"></div>
           <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-electric-blue rounded-3xl flex items-center justify-center text-4xl shadow-2xl">🤖</div>
                 <div>
                    <h3 className="text-3xl font-black text-white">تحليل المستشار الاستراتيجي (AI Report)</h3>
                    <p className="text-electric-blue font-black text-[10px] uppercase tracking-widest mt-2">Verified Business Intelligence • Gemini 3 Core</p>
                 </div>
              </div>
              <button 
                onClick={() => setAiAnalysis(null)}
                className="text-slate-500 hover:text-white transition-colors p-2"
              >
                ✕ إغلاق التقرير
              </button>
           </div>
           
           <div className="prose prose-invert max-w-none">
              <div className="text-xl font-medium leading-loose text-slate-300 whitespace-pre-wrap text-right">
                 {aiAnalysis}
              </div>
           </div>
           
           <div className="mt-16 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Official Startup Performance Review • {new Date().toLocaleDateString('ar-EG')}</p>
              <div className="flex gap-4">
                 <span className="w-2 h-2 rounded-full bg-electric-blue"></span>
                 <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                 <span className="w-2 h-2 rounded-full bg-slate-700"></span>
              </div>
           </div>
        </div>
      )}

      {/* Burn Rate Simulation Chart (Weekly Revenue vs Burn) */}
      <div className="glass-card p-12 rounded-[4rem] border border-white/5 space-y-10">
         <h3 className="text-2xl font-black text-white flex items-center gap-4">
            <span className="w-2.5 h-8 bg-rose-500 rounded-full"></span>
            تحليل التدفقات والملاءمة المالية
         </h3>
         <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kpiData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                 <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                 <Tooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} contentStyle={{backgroundColor: '#0f172a', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)'}} />
                 <Bar dataKey="revenue" fill="#10b981" radius={[10, 10, 0, 0]} name="الإيرادات" />
                 <Bar dataKey="burnRate" fill="#f43f5e" radius={[10, 10, 0, 0]} name="معدل الحرق" />
              </BarChart>
            </ResponsiveContainer>
         </div>
         <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">Weekly Cashflow Projection (Simulation Mode)</p>
      </div>
    </div>
  );
};
