
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { StartupRecord, KPIRecord } from '../types';

interface KPIsCenterProps {
  startup: StartupRecord;
}

const DEFAULT_KPI_HISTORY: KPIRecord[] = [
  { date: 'أسبوع 1', growth: 10, techReadiness: 20, marketEngagement: 5, burnRate: 1000 },
  { date: 'أسبوع 2', growth: 15, techReadiness: 30, marketEngagement: 12, burnRate: 1200 },
  { date: 'أسبوع 3', growth: 22, techReadiness: 35, marketEngagement: 25, burnRate: 1500 },
  { date: 'أسبوع 4', growth: 40, techReadiness: 50, marketEngagement: 38, burnRate: 1400 },
];

export const KPIsCenter: React.FC<KPIsCenterProps> = ({ startup }) => {
  const data = startup.kpiHistory || DEFAULT_KPI_HISTORY;

  const radarData = useMemo(() => [
    { subject: 'النمو', A: data[data.length - 1].growth, fullMark: 100 },
    { subject: 'الجاهزية التقنية', A: data[data.length - 1].techReadiness, fullMark: 100 },
    { subject: 'تفاعل السوق', A: data[data.length - 1].marketEngagement, fullMark: 100 },
    { subject: 'نموذج العمل', A: startup.metrics.readiness, fullMark: 100 },
    { subject: 'الفريق', A: startup.partners.length > 0 ? 80 : 30, fullMark: 100 },
  ], [data, startup]);

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-up pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Growth Chart */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
           <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                 <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                 منحنى النمو والجاهزية
              </h3>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span><span className="text-[10px] font-bold text-slate-400">النمو</span></div>
                 <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span className="text-[10px] font-bold text-slate-400">التقنية</span></div>
              </div>
           </div>
           
           <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTech" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                  <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}} />
                  <Area type="monotone" dataKey="growth" stroke="#3b82f6" strokeWidth={4} fill="url(#colorGrowth)" />
                  <Area type="monotone" dataKey="techReadiness" stroke="#10b981" strokeWidth={4} fill="url(#colorTech)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Risk Radar */}
        <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col items-center justify-center">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-[80px]"></div>
           <h3 className="text-xl font-black mb-8 self-start flex items-center gap-3">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
              رادار التوازن الاستراتيجي
           </h3>
           <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                  <Radar name="Startup Metrics" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
           </div>
           <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10 w-full">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">تنبيه المخاطر (AI Alert)</p>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                معدل "تفاعل السوق" أقل من المستهدف لهذا الأسبوع. نوصي بتكثيف حملات الوصول المباشر.
              </p>
           </div>
        </div>
      </div>

      {/* Insight Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'احتمالية النجاح', value: '74%', sub: 'بناءً على التقدم الحالي', color: 'blue' },
           { label: 'معدل الحرق (Burn)', value: '1.4K', sub: 'ريال شهرياً متوقع', color: 'rose' },
           { label: 'نقاط الجاذبية', value: '8.2', sub: 'مؤشر جذب المستثمرين', color: 'amber' },
           { label: 'التفاعل الميداني', value: 'High', sub: 'ثقة العملاء الأولية', color: 'emerald' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group overflow-hidden">
              <div className={`absolute top-0 left-0 w-1.5 h-full bg-${stat.color}-500 transition-all group-hover:w-full group-hover:opacity-5 opacity-100`}></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
              <h4 className={`text-4xl font-black text-slate-900 group-hover:text-${stat.color}-600 transition-colors`}>{stat.value}</h4>
              <p className="text-[10px] font-bold text-slate-500 mt-2">{stat.sub}</p>
           </div>
         ))}
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-br from-indigo-600 to-blue-800 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
         <div className="absolute top-[-50px] left-[-50px] text-9xl opacity-10 group-hover:rotate-12 transition-transform duration-1000">🧠</div>
         <div className="relative z-10 space-y-8">
            <h3 className="text-3xl font-black flex items-center gap-4">
               توصيات المستشار الذكي لتحسين الـ KPIs
               <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] uppercase font-black">Live Analysis</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <h4 className="font-black text-blue-300 text-sm uppercase tracking-widest">إجراءات عاجلة:</h4>
                  <ul className="space-y-3">
                     <li className="flex gap-3 items-start"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0"></span><p className="text-lg font-medium opacity-90 leading-relaxed">توسيع قاعدة الشركاء (Partnerships) لرفع معدل الجاهزية التقنية.</p></li>
                     <li className="flex gap-3 items-start"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0"></span><p className="text-lg font-medium opacity-90 leading-relaxed">تفعيل خاصية "تجميع بيانات المستخدمين" لقياس الرضا بدقة أكبر.</p></li>
                  </ul>
               </div>
               <div className="space-y-4">
                  <h4 className="font-black text-blue-300 text-sm uppercase tracking-widest">فرص النمو المتاحة:</h4>
                  <ul className="space-y-3">
                     <li className="flex gap-3 items-start"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 shrink-0"></span><p className="text-lg font-medium opacity-90 leading-relaxed">استهداف قطاع الـ B2B في المنطقة الشرقية لرفع معدل النمو بنسبة ١٥٪.</p></li>
                  </ul>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
