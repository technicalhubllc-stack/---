import React from 'react';

interface RoadmapPageProps {
  onStart: () => void;
  onBack: () => void;
}

export const RoadmapPage: React.FC<RoadmapPageProps> = ({ onStart }) => {
  const levels = [
    { id: 1, title: 'التحقق الاستراتيجي', desc: 'دراسة جدوى المشكلة وصحة الفرضيات الأولية للسوق.' },
    { id: 2, title: 'هيكلة نموذج العمل', desc: 'تصميم محرك الإيرادات والقيمة المضافة لضمان الاستدامة.' },
    { id: 3, title: 'رادار السوق', desc: 'تحليل دقيق للمنافسين وتحديد الميزة التنافسية الجوهرية.' },
    { id: 4, title: 'بناء المنتج (MVP)', desc: 'تطوير النسخة الأولى القابلة للاختبار والنمو.' },
    { id: 5, title: 'النمذجة المالية', desc: 'إعداد قوائم التدفقات النقدية والجاهزية للاستثمار.' },
    { id: 6, title: 'يوم العرض', desc: 'العرض النهائي أمام لجنة من المستثمرين المعتمدين.' },
  ];

  return (
    <div className="bg-white pt-40 pb-32 px-12 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-32 space-y-8 animate-fade-in max-w-3xl">
           <h2 className="text-6xl font-black text-black tracking-tight">مسار النضج الاستراتيجي</h2>
           <p className="text-gray-400 text-2xl font-light leading-relaxed">ستة مراحل محورية تفصل بين الفكرة والكيان المؤسسي المكتمل.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-32">
           {levels.map((level) => (
             <div key={level.id} className="group border-t border-black pt-12">
                <div className="flex justify-between items-start mb-8">
                   <span className="text-[11px] font-black text-gray-300 uppercase tracking-[0.4em]">Step 0{level.id}</span>
                </div>
                <h3 className="text-3xl font-bold text-black mb-6">{level.title}</h3>
                <p className="text-gray-500 font-light leading-relaxed text-lg">{level.desc}</p>
             </div>
           ))}
        </div>

        <div className="mt-48 flex justify-center">
           <button onClick={onStart} className="btn-primary px-20 py-7 text-sm font-bold uppercase tracking-widest shadow-2xl shadow-blue-500/20">انضم للدفعة القادمة</button>
        </div>
      </div>
    </div>
  );
};