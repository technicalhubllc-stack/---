
import React, { useState, useEffect } from 'react';
import { playPositiveSound } from '../services/audioService';
import { Language, getTranslation } from '../services/i18nService';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface ImpactPageProps {
  onBack: () => void;
  lang: Language;
}

const STATS = [
  { label: 'شركات متخرجة', value: 185, suffix: '+', growth: '+12%', icon: '🚀', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'دولة مشاركة', value: 14, suffix: '', growth: 'توسع مستمر', icon: '🌍', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'تمويل مستقطب', value: 42, suffix: 'M$', growth: '+24%', icon: '💰', color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'وظيفة مستحدثة', value: 2400, suffix: '+', growth: '+31%', icon: '👥', color: 'text-purple-600', bg: 'bg-purple-50' },
];

const PERFORMANCE_DATA = [
  { year: '2020', funding: 5, startups: 12 },
  { year: '2021', funding: 12, startups: 35 },
  { year: '2022', funding: 22, startups: 78 },
  { year: '2023', funding: 35, startups: 142 },
  { year: '2024', funding: 42, startups: 185 },
];

const COUNTRIES = [
  { name: 'السعودية', count: 82, trend: '+45%' },
  { name: 'الإمارات', count: 34, trend: '+22%' },
  { name: 'مصر', count: 41, trend: '+30%' },
  { name: 'الأردن', count: 18, trend: '+15%' },
  { name: 'الكويت', count: 12, trend: '+12%' },
  { name: 'المغرب', count: 15, trend: '+18%' },
];

export const ImpactPage: React.FC<ImpactPageProps> = ({ onBack, lang }) => {
  const [counts, setCounts] = useState(STATS.map(() => 0));
  const t = getTranslation(lang);

  useEffect(() => {
    const timers = STATS.map((stat, index) => {
      let current = 0;
      const step = Math.ceil(stat.value / 40);
      return setInterval(() => {
        current += step;
        if (current >= stat.value) {
          current = stat.value;
          clearInterval(timers[index]);
        }
        setCounts(prev => {
          const next = [...prev];
          next[index] = current;
          return next;
        });
      }, 30);
    });
    return () => timers.forEach(clearInterval);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100" dir={t.dir}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => { playPositiveSound(); onBack(); }} 
            className="flex items-center gap-3 px-5 py-2.5 bg-slate-50 hover:bg-blue-50 text-slate-900 rounded-xl transition-all group"
          >
            <svg className={`w-4 h-4 transition-transform ${t.dir === 'rtl' ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-black text-xs uppercase tracking-widest">{t.common.back}</span>
          </button>
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-[10px] font-black">BD</div>
             <h1 className="text-sm font-black text-slate-900 uppercase tracking-widest">Strategic Impact Report</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 pt-40 pb-32 space-y-32">
        
        {/* Intro */}
        <section className="text-center space-y-10 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-blue-100">
             Verified Ecosystem Metrics
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none">
            أثر ملموس <br/> <span className="text-blue-600">لنمو لا يتوقف.</span>
          </h2>
          <p className="text-slate-500 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium italic">
            "نحن لا نبني مشاريع عابرة، نحن نصمم كيانات مؤسسية قادرة على تحويل اقتصاد المنطقة."
          </p>
        </section>

        {/* Big Numbers */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
           {STATS.map((s, i) => (
             <div key={i} className="p-12 bg-white rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-32 h-32 ${s.bg} opacity-20 rounded-bl-[4rem] group-hover:scale-125 transition-transform duration-700`}></div>
                <div className="text-5xl mb-8 group-hover:rotate-12 transition-transform block">{s.icon}</div>
                <h4 className={`text-6xl font-black ${s.color} mb-3 tracking-tighter tabular-nums`}>
                  {counts[i]}{s.suffix}
                </h4>
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">{s.label}</p>
                <div className="mt-4 flex items-center gap-2">
                   <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                   <span className="text-[10px] font-black text-emerald-500">{s.growth} نضج سنوي</span>
                </div>
             </div>
           ))}
        </section>

        {/* Chart Section */}
        <section className="space-y-12 animate-fade-in">
           <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-8 border-b border-slate-100">
              <div className="space-y-2">
                 <h3 className="text-4xl font-black text-slate-900 tracking-tight">تحليل القيمة التصاعدية</h3>
                 <p className="text-slate-500 font-medium">تطور التمويل المستقطب وعدد الشركات الناشئة المعتمدة.</p>
              </div>
              <div className="flex gap-8">
                 <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div><span className="text-[10px] font-black uppercase text-slate-400">Funding ($M)</span></div>
                 <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div><span className="text-[10px] font-black uppercase text-slate-400">Startups</span></div>
              </div>
           </div>
           
           <div className="h-[450px] w-full bg-slate-50/50 rounded-[4rem] p-10 border border-slate-100">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PERFORMANCE_DATA}>
                  <defs>
                    <linearGradient id="colorFunding" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 'bold', fill: '#94a3b8'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 'bold', fill: '#94a3b8'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '20px' }}
                  />
                  <Area type="monotone" dataKey="funding" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorFunding)" />
                  <Area type="monotone" dataKey="startups" stroke="#10b981" strokeWidth={4} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </section>

        {/* Regional Footprint */}
        <section className="bg-slate-950 rounded-[5rem] p-16 md:p-24 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.1),transparent_50%)]"></div>
           
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-12">
                 <div className="space-y-6">
                    <h3 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">بصمة إقليمية <br/> <span className="text-blue-500">بلا حدود.</span></h3>
                    <p className="text-slate-400 text-xl leading-relaxed font-medium">
                      نفتخر بكوننا الحاضنة المفضلة لأبرز العقول في ١٤ دولة. تنوعنا الجغرافي هو سر قوة شبكة بيزنس ديفلوبرز، حيث يتبادل الرواد الخبرات عبر الحدود.
                    </p>
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col justify-between h-48">
                       <p className="text-4xl font-black">٨٨٪</p>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">نسبة نجاح التخرج</p>
                    </div>
                    <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col justify-between h-48">
                       <p className="text-4xl font-black text-blue-500">١٢٠٠+</p>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">طلب انضمام سنوي</p>
                    </div>
                 </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-10 rounded-[4rem] backdrop-blur-xl">
                 <h4 className="text-xl font-black mb-10 text-center uppercase tracking-widest">أبرز محطات التواجد</h4>
                 <div className="space-y-4">
                    {COUNTRIES.map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                         <div className="flex items-center gap-4">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            <span className="font-bold text-sm">{c.name}</span>
                         </div>
                         <div className="flex items-center gap-6">
                            <span className="text-xs text-slate-500">{c.count} مشروع</span>
                            <span className="text-[10px] font-black text-emerald-400">{c.trend}</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* Global CTA */}
        <section className="py-24 text-center space-y-12">
           <h3 className="text-5xl font-black text-slate-900 tracking-tight leading-none">هل مشروعك هو قصتنا القادمة؟</h3>
           <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">انضم اليوم لأقوى مجتمع ريادي ذكي وابدأ في صياغة أثرك الخاص.</p>
           <button onClick={onBack} className="px-16 py-7 bg-blue-600 hover:bg-blue-700 text-white rounded-[2.5rem] font-black text-2xl shadow-3xl shadow-blue-500/30 transition-all active:scale-95">العودة للرئيسية</button>
        </section>

      </main>

      <footer className="py-20 border-t border-slate-50 text-center opacity-30">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900">Digital Acceleration Impact Center • 2024</p>
      </footer>
    </div>
  );
};
