import React from 'react';

interface LandingPageProps {
  onStart: () => void;
  onRoadmap: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onRoadmap }) => {
  return (
    <div className="animate-fade-in bg-white">
      {/* Hero Section - Airy & Bold */}
      <section className="min-h-screen flex items-center px-12">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
          <div className="lg:col-span-7 space-y-12">
            <h1 className="title-ar !text-6xl md:!text-7xl leading-tight">
              هندسة المؤسسات <br/> 
              بمنظور مستقبلي.
            </h1>
            <p className="text-gray-500 text-xl font-light leading-relaxed max-w-2xl">
              مسرعة أعمال رقمية مصممة للباحثين عن الدقة. ندمج الذكاء الاصطناعي مع الخبرة البشرية لبناء كيانات اقتصادية مستدامة وقابلة للتوسع العالمي.
            </p>
            <div className="flex gap-6 pt-4">
              <button onClick={onStart} className="btn-primary px-12 py-5 text-sm uppercase tracking-widest">تقديم الطلب</button>
              <button onClick={onRoadmap} className="btn-secondary px-12 py-5 text-sm uppercase tracking-widest">المنهجية</button>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
             <div className="aspect-[3/4] bg-gray-50 border border-gray-100 overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-1000">
                <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200" alt="Architecture" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/5"></div>
             </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section - Pure Typography */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-12">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
              <div className="space-y-6">
                 <h2 className="text-2xl font-bold">الرؤية الاستراتيجية</h2>
                 <p className="text-gray-500 font-light leading-relaxed">نركز على جودة المخرج النهائي وضمان المواءمة مع متطلبات الصناديق الاستثمارية العالمية منذ اليوم الأول.</p>
              </div>
              <div className="space-y-6">
                 <h2 className="text-2xl font-bold">الذكاء التوليدي</h2>
                 <p className="text-gray-500 font-light leading-relaxed">استخدام محركات Gemini 3 Pro لتحليل الفجوات السوقية وتوليد فرضيات النمو بدقة بيانات تتجاوز النماذج التقليدية.</p>
              </div>
              <div className="space-y-6">
                 <h2 className="text-2xl font-bold">الشبكة العالمية</h2>
                 <p className="text-gray-500 font-light leading-relaxed">ارتباط مباشر مع خبراء في ١٤ دولة لضمان وصول مشروعك إلى الأسواق الإقليمية والدولية بكفاءة عالية.</p>
              </div>
           </div>
        </div>
      </section>

      {/* Stats - Minimalist Grid */}
      <section className="px-12">
        <div className="max-w-7xl mx-auto border-t border-gray-100 pt-32">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {[
                { l: 'شركة محتضنة', v: '180+' },
                { l: 'تمويل مستقطب', v: '$42M' },
                { l: 'خبير استراتيجي', v: '65+' },
                { l: 'دولة مشاركة', v: '14' }
              ].map((s, i) => (
                <div key={i} className="space-y-2">
                   <p className="text-5xl font-black text-black tracking-tighter">{s.v}</p>
                   <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{s.l}</p>
                </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
};