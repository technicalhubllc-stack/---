
import React, { useState, useMemo } from 'react';
import { MentorProfile, UserProfile } from '../types';
import { playPositiveSound, playCelebrationSound, playErrorSound } from '../services/audioService';

interface MentorshipPageProps {
  user?: UserProfile;
  onBack: () => void;
}

const SPECIALTIES = [
  { id: 'all', label: 'الكل', icon: '🎯' },
  { id: 'Tech', label: 'تقني', icon: '💻' },
  { id: 'Finance', label: 'مالي', icon: '💰' },
  { id: 'Growth', label: 'نمو وتسويق', icon: '📈' },
  { id: 'Legal', label: 'قانوني', icon: '⚖️' },
  { id: 'Strategy', label: 'استراتيجية', icon: '🧩' },
];

const MOCK_MENTORS: MentorProfile[] = [
  {
    id: 'm1',
    name: 'د. خالد العمري',
    role: 'خبير نمو الشركات الناشئة',
    company: 'GrowthOps Global',
    specialty: 'Growth',
    bio: 'أكثر من ١٥ عاماً في مساعدة الشركات الناشئة على التوسع في الأسواق الخليجية وجذب الاستثمارات العالمية. خبير في استراتيجيات Go-to-Market وبناء مسارات الجذب (Traction). ساهم في نضج أكثر من ٢٠ شركة تقنية في المنطقة.',
    experience: 15,
    avatar: '👨‍💼',
    rating: 4.9,
    tags: ['التوسع', 'التسويق الرقمي', 'SaaS']
  },
  {
    id: 'm2',
    name: 'م. سارة القحطاني',
    role: 'كبير مهندسي البرمجيات',
    company: 'TechFlow',
    specialty: 'Tech',
    bio: 'متخصصة في بناء البنية التحتية القابلة للتوسع وتطوير المنتجات الأولية (MVP) باستخدام أحدث تقنيات الـ AI. تملك خبرة واسعة في بنية السحابة (Cloud Architecture) وإدارة الفرق التقنية الرشيقة.',
    experience: 10,
    avatar: '👩‍💻',
    rating: 4.8,
    tags: ['Cloud', 'AI', 'Full Stack']
  },
  {
    id: 'm3',
    name: 'أ. فهد السديري',
    role: 'مستشار مالي واستثماري',
    company: 'Capital Bridges',
    specialty: 'Finance',
    bio: 'ساعدت أكثر من ٥٠ شركة ناشئة في إغلاق جولات تمويلية ناجحة (Seed & Series A). خبير في التقييم المالي، النمذجة المالية، وإعداد ملفات المستثمرين باحترافية عالية.',
    experience: 12,
    avatar: '🏦',
    rating: 5.0,
    tags: ['VC', 'Valuation', 'Fintech']
  },
  {
    id: 'm4',
    name: 'أ. نورة التميمي',
    role: 'مستشارة قانونية ريادية',
    company: 'Legalize Hub',
    specialty: 'Legal',
    bio: 'خبيرة في هيكلة الشركات الناشئة، اتفاقيات المساهمين، وحماية الملكية الفكرية. تملك باعاً طويلاً في حل النزاعات التأسيسية وضمان الامتثال للأنظمة المحلية والدولية.',
    experience: 8,
    avatar: '👩‍⚖️',
    rating: 4.7,
    tags: ['IP', 'Contracts', 'Compliance']
  },
  {
    id: 'm5',
    name: 'م. عمر بن علي',
    role: 'محلل استراتيجيات أعمال',
    company: 'Vision Strategy',
    specialty: 'Strategy',
    bio: 'شغوف بمساعدة المؤسسين على بناء نماذج عمل مستدامة وتحديد الميزة التنافسية في الأسواق المزدحمة. تخصص في منهجيات Lean Startup والتحول الرقمي للشركات التقليدية.',
    experience: 9,
    avatar: '🧩',
    rating: 4.8,
    tags: ['Lean Startup', 'BMC', 'Pivot']
  }
];

export const MentorshipPage: React.FC<MentorshipPageProps> = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'register'>('browse');
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [detailedMentor, setDetailedMentor] = useState<MentorProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [requestFormData, setRequestFormData] = useState({
    scope: 'Strategy',
    title: '',
    challenge: '',
    expectations: ''
  });

  const [mentorFormData, setMentorFormData] = useState({
    name: '',
    role: '',
    specialty: 'Strategy',
    bio: '',
    linkedin: ''
  });

  const filteredMentors = useMemo(() => {
    return MOCK_MENTORS.filter(mentor => {
      const matchSpecialty = filterSpecialty === 'all' || mentor.specialty === filterSpecialty;
      const matchSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          mentor.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSpecialty && matchSearch;
    });
  }, [filterSpecialty, searchQuery]);

  const handleMentorRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      playCelebrationSound();
      alert('تم استلام طلبك للانضمام كمرشد بنجاح. سيقوم فريقنا بمراجعته والتواصل معك.');
      setIsSubmitting(false);
      setActiveTab('browse');
    }, 1500);
  };

  const handleMentorshipRequest = () => {
    if (!requestFormData.title || !requestFormData.challenge) return;
    setIsSubmitting(true);
    setTimeout(() => {
      playPositiveSound();
      alert(`تم إرسال طلب الإرشاد لـ ${selectedMentor?.name} بنجاح. سيقوم المرشد بمراجعة التحدي: "${requestFormData.title}" والرد عليك قريباً.`);
      setIsSubmitting(false);
      setShowRequestModal(false);
      setSelectedMentor(null);
      setRequestFormData({ scope: 'Strategy', title: '', challenge: '', expectations: '' });
    }, 1500);
  };

  return (
    <div className="bg-transparent font-sans" dir="rtl">
      <style>{`
        .mentor-card { 
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        }
        .mentor-card:hover { 
          transform: translateY(-8px); 
          border-color: #3b82f6; 
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-10">
        <div className="flex bg-slate-100 p-1.5 rounded-2xl shrink-0 border border-slate-200 shadow-inner">
           <button onClick={() => { setActiveTab('browse'); playPositiveSound(); }} className={`px-8 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'browse' ? 'bg-white text-blue-600 shadow-md border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}>تصفح شبكة الخبراء</button>
           <button onClick={() => { setActiveTab('register'); playPositiveSound(); }} className={`px-8 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'register' ? 'bg-white text-blue-600 shadow-md border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}>سجل كمرشد</button>
        </div>

        {activeTab === 'browse' && (
          <div className="relative w-full md:w-96 group">
             <input 
              type="text" 
              placeholder="ابحث بالاسم أو التخصص..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-bold shadow-sm"
             />
             <span className="absolute left-4 top-4 text-xl opacity-30 group-focus-within:opacity-100 transition-opacity">🔍</span>
          </div>
        )}
      </div>

      <main className="w-full">
        {activeTab === 'browse' ? (
          <div className="space-y-12 animate-fade-in">
             {/* Specialty Filters */}
             <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar justify-center">
                {SPECIALTIES.map(s => (
                  <button 
                    key={s.id}
                    onClick={() => { setFilterSpecialty(s.id); playPositiveSound(); }}
                    className={`px-8 py-4 rounded-2xl font-black text-xs transition-all flex items-center gap-3 border-2 shrink-0
                      ${filterSpecialty === s.id ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200 shadow-sm'}
                    `}
                  >
                    <span className="text-xl">{s.icon}</span>
                    {s.label}
                  </button>
                ))}
             </div>

             {filteredMentors.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                  {filteredMentors.map(mentor => (
                    <div key={mentor.id} className="bg-white rounded-[3rem] p-10 border border-slate-100 mentor-card flex flex-col justify-between relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[4rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       <div>
                          <div className="flex justify-between items-start mb-8 relative z-10">
                             <div className="relative">
                               <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-6xl shadow-inner border border-slate-50">
                                  {mentor.avatar}
                               </div>
                               <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-lg" title="مرشد معتمد">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                               </div>
                             </div>
                             <div className="text-left">
                                <div className="flex items-center gap-1 text-amber-500 font-black text-lg">
                                   <span>★</span>
                                   <span>{mentor.rating.toFixed(1)}</span>
                                </div>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Mentor Rating</p>
                             </div>
                          </div>
                          
                          <h3 className="text-2xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{mentor.name}</h3>
                          <div className="flex items-center gap-2 mb-6">
                             <p className="text-sm font-bold text-slate-600">{mentor.role}</p>
                             <div className="w-1.5 h-1.5 rounded-full bg-blue-500/20"></div>
                             <p className="text-xs font-black text-blue-500 uppercase tracking-tighter">{mentor.company}</p>
                          </div>
                          
                          <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">{mentor.bio}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-10 relative z-10">
                             {mentor.tags.map(tag => (
                               <span key={tag} className="px-4 py-1.5 bg-slate-50 text-slate-400 text-[10px] font-black rounded-xl border border-slate-100 uppercase tracking-widest">{tag}</span>
                             ))}
                          </div>
                       </div>

                       <div className="space-y-4">
                          <button 
                            onClick={() => { setDetailedMentor(mentor); playPositiveSound(); }}
                            className="w-full py-4 text-blue-600 text-xs font-black uppercase tracking-widest hover:bg-blue-50 rounded-2xl transition-all"
                          >
                             عرض الملف الشخصي الكامل
                          </button>
                          <button 
                            onClick={() => { setSelectedMentor(mentor); setShowRequestModal(true); playPositiveSound(); }}
                            className="w-full py-5 bg-slate-900 text-white rounded-[1.8rem] font-black text-sm hover:bg-blue-600 shadow-xl shadow-slate-900/10 transition-all active:scale-95 flex items-center justify-center gap-4"
                          >
                              <span>طلب استشارة مخصصة</span>
                              <span className="text-xl">🚀</span>
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
             ) : (
               <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-slate-200">
                  <div className="text-7xl mb-8 opacity-20">🔎</div>
                  <h3 className="text-2xl font-black text-slate-400 tracking-tight">لم نجد نتائج تطابق معايير البحث</h3>
                  <p className="text-slate-400 font-medium mt-2">حاول تقليل قيود التصفية أو تغيير الكلمات المفتاحية.</p>
                  <button onClick={() => { setFilterSpecialty('all'); setSearchQuery(''); }} className="mt-8 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-blue-600 transition-all">إعادة ضبط الفلاتر</button>
               </div>
             )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto animate-fade-up pb-20">
             <div className="bg-white rounded-[4rem] p-16 border border-slate-100 card-premium relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50 rounded-bl-full opacity-50 -z-0"></div>
                
                <div className="relative z-10 space-y-12">
                   <div className="space-y-4">
                      <div className="w-20 h-20 bg-blue-600 rounded-[2.2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-500/20 text-4xl transform rotate-3">🤝</div>
                      <h2 className="text-5xl font-black text-slate-900 tracking-tighter">انضم لمجتمع مرشدي النخبة</h2>
                      <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-2xl">ساهم بخبراتك في بناء الجيل القادم من قادة الأعمال. عملية الانضمام تخضع لمعايير تدقيق دقيقة لضمان أعلى جودة توجيه.</p>
                   </div>

                   <form onSubmit={handleMentorRegistration} className="space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-4 block">الاسم الكامل (Professional Name)</label>
                            <input className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[1.8rem] outline-none focus:bg-white focus:border-blue-500 transition-all font-black text-lg" placeholder="د. خالد ..." value={mentorFormData.name} onChange={e => setMentorFormData({...mentorFormData, name: e.target.value})} required />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-4 block">المنصب والشركة الحالية</label>
                            <input className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[1.8rem] outline-none focus:bg-white focus:border-blue-500 transition-all font-black text-lg" placeholder="مثال: نائب الرئيس للنمو @ FinTechX" value={mentorFormData.role} onChange={e => setMentorFormData({...mentorFormData, role: e.target.value})} required />
                         </div>
                         <div className="md:col-span-2 space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-4 block">التخصص الاستراتيجي</label>
                            <select className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[1.8rem] outline-none focus:bg-white focus:border-blue-500 transition-all font-black text-lg" value={mentorFormData.specialty} onChange={e => setMentorFormData({...mentorFormData, specialty: e.target.value as any})}>
                               <option value="Strategy">استراتيجية الأعمال والتحول</option>
                               <option value="Tech">هندسة البرمجيات والـ AI</option>
                               <option value="Finance">المالية والاستثمار الجريء</option>
                               <option value="Growth">النمو والتوسع الإقليمي</option>
                               <option value="Legal">التشريعات والامتثال</option>
                            </select>
                         </div>
                         <div className="md:col-span-2 space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-4 block">السيرة المهنية والقدرة على التأثير</label>
                            <textarea className="w-full h-48 p-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-lg resize-none leading-relaxed" placeholder="حدثنا عن أعظم تحدٍ تقني أو إداري قمت بحله وكيف يمكن أن تستفيد الشركات المحتضنة من خبرتك..." value={mentorFormData.bio} onChange={e => setMentorFormData({...mentorFormData, bio: e.target.value})} required />
                         </div>
                         <div className="md:col-span-2 space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-4 block">الرابط المهني الموثق (LinkedIn)</label>
                            <input className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[1.8rem] outline-none focus:bg-white focus:border-blue-500 transition-all font-bold text-lg font-mono" placeholder="https://linkedin.com/in/..." value={mentorFormData.linkedin} onChange={e => setMentorFormData({...mentorFormData, linkedin: e.target.value})} required />
                         </div>
                      </div>
                      
                      <div className="md:col-span-2 pt-6">
                         <button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="w-full py-7 bg-blue-600 hover:bg-blue-700 text-white rounded-[2.2rem] font-black text-2xl shadow-3xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
                         >
                            {isSubmitting ? 'جاري إرسال بيانات الخبير...' : 'إرسال طلب الاعتماد الرسمي'}
                         </button>
                      </div>
                   </form>
                </div>
             </div>
          </div>
        )}
      </main>

      {/* Detailed Mentor Profile Modal */}
      {detailedMentor && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-2xl animate-fade-in text-right">
           <div className="bg-white rounded-[4rem] w-full max-w-4xl shadow-3xl border border-slate-100 animate-fade-in-up overflow-hidden max-h-[90vh] flex flex-col relative">
              <button onClick={() => setDetailedMentor(null)} className="absolute top-10 left-10 p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-500 transition-all active:scale-90 z-20 font-black">✕</button>
              
              <div className="p-12 md:p-20 overflow-y-auto custom-scrollbar flex-1 space-y-16">
                 <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
                    <div className="w-48 h-48 bg-slate-50 rounded-[3.5rem] flex items-center justify-center text-9xl shadow-inner border border-slate-100 shrink-0 relative">
                       {detailedMentor.avatar}
                       <div className="absolute -bottom-4 -right-4 bg-emerald-500 text-white w-14 h-14 rounded-3xl flex items-center justify-center border-8 border-white shadow-xl">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                       </div>
                    </div>
                    <div className="text-center md:text-right space-y-6">
                       <div>
                          <span className="bg-blue-50 text-blue-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 mb-4 inline-block">Verified Accelerator Mentor</span>
                          <h2 className="text-5xl font-black text-slate-900 tracking-tight">{detailedMentor.name}</h2>
                       </div>
                       <p className="text-2xl font-bold text-slate-500 leading-tight">{detailedMentor.role} @ <span className="text-blue-600">{detailedMentor.company}</span></p>
                       <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                          {detailedMentor.tags.map(tag => (
                            <span key={tag} className="px-6 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black text-slate-400 uppercase tracking-widest">#{tag}</span>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center space-y-2">
                       <p className="text-4xl font-black text-slate-900">{detailedMentor.experience}+</p>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">سنة من الخبرة العملية</p>
                    </div>
                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center space-y-2">
                       <div className="flex justify-center gap-1">
                          <span className="text-3xl text-amber-400">★</span>
                          <p className="text-4xl font-black text-slate-900">{detailedMentor.rating}</p>
                       </div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">رضا رواد الأعمال</p>
                    </div>
                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center space-y-2">
                       <p className="text-4xl font-black text-blue-600">{detailedMentor.specialty}</p>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">نطاق التوجيه الرئيسي</p>
                    </div>
                 </div>

                 <div className="space-y-8">
                    <h3 className="text-3xl font-black text-slate-900 flex items-center gap-4">
                       <span className="w-3 h-10 bg-blue-600 rounded-full"></span>
                       خلاصة المسار المهني
                    </h3>
                    <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 relative">
                       <div className="text-8xl text-blue-600/5 absolute top-10 right-10 select-none">"</div>
                       <p className="text-2xl font-medium text-slate-700 leading-loose relative z-10 italic">
                         {detailedMentor.bio}
                       </p>
                    </div>
                 </div>

                 <div className="p-12 bg-slate-900 rounded-[3.5rem] text-white relative overflow-hidden group">
                    <div className="absolute top-[-20px] left-[-20px] text-9xl opacity-10 group-hover:rotate-12 transition-transform duration-1000">💡</div>
                    <h4 className="text-xl font-black mb-6 text-blue-400 uppercase tracking-widest flex items-center gap-3">
                       <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                       بماذا يمكنني مساعدتك؟
                    </h4>
                    <ul className="space-y-6">
                       {[
                         'بناء استراتيجية التوسع (Growth Strategy).',
                         'مراجعة وتدقيق النمذجة المالية (Financial Modeling).',
                         'تجهيز العرض التقديمي لجولات الـ Seed/Series A.',
                         'تحسين الكفاءة التشغيلية وهيكلة الفرق.'
                       ].map((item, i) => (
                         <li key={i} className="flex gap-4 items-center text-lg font-bold">
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px]">✓</div>
                            {item}
                         </li>
                       ))}
                    </ul>
                 </div>
              </div>
              
              <div className="p-12 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row gap-6">
                 <button onClick={() => setDetailedMentor(null)} className="flex-1 py-6 bg-white border-4 border-slate-200 text-slate-600 rounded-[2rem] font-black text-xl hover:bg-slate-100 transition-all">إغلاق الملف</button>
                 <button 
                  onClick={() => { setDetailedMentor(null); setSelectedMentor(detailedMentor); setShowRequestModal(true); playPositiveSound(); }} 
                  className="flex-[2] py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl shadow-3xl shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-4"
                 >
                    <span>حجز جلسة مع هذا الخبير 🗓️</span>
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Mentorship Request Modal (Custom Request Logic) */}
      {showRequestModal && selectedMentor && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-fade-in text-right">
           <div className="bg-white rounded-[3.5rem] w-full max-w-2xl shadow-3xl border border-slate-100 animate-fade-in-up overflow-hidden">
              <div className="p-12 md:p-16 space-y-10">
                 <div className="flex justify-between items-start">
                    <button onClick={() => setShowRequestModal(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">✕</button>
                    <div className="flex items-center gap-6">
                       <div className="text-right">
                          <h3 className="text-2xl font-black text-slate-900">طلب استشارة مخصصة</h3>
                          <p className="text-blue-600 font-bold">مع الخبير: {selectedMentor.name}</p>
                       </div>
                       <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-4xl shadow-inner border border-slate-100">
                          {selectedMentor.avatar}
                       </div>
                    </div>
                 </div>

                 <div className="space-y-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-4 block">تحديد نطاق التحدي</label>
                       <div className="grid grid-cols-3 gap-3">
                          {['تقني', 'مالي', 'نمو'].map(type => (
                             <button 
                                key={type} 
                                type="button" 
                                onClick={() => setRequestFormData({...requestFormData, scope: type})}
                                className={`py-4 rounded-xl border-2 text-xs font-black transition-all 
                                  ${requestFormData.scope === type ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'border-slate-100 text-slate-400 hover:border-blue-600 hover:text-blue-600'}`}
                             >
                                {type}
                             </button>
                          ))}
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-4 block">عنوان الجلسة المطلوب</label>
                       <input 
                          className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all font-black text-sm" 
                          placeholder="مثال: مراجعة خطة التسعير لعام ٢٠٢٥" 
                          value={requestFormData.title}
                          onChange={e => setRequestFormData({...requestFormData, title: e.target.value})}
                          required 
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-4 block">وصف التحدي الحالي بدقة</label>
                       <textarea 
                          className="w-full h-40 p-6 bg-slate-50 border border-slate-200 rounded-[2rem] outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-sm resize-none leading-relaxed" 
                          placeholder="اشرح الثغرة التي تواجهها وما الذي تأمل تحقيقه من هذه الجلسة..." 
                          value={requestFormData.challenge}
                          onChange={e => setRequestFormData({...requestFormData, challenge: e.target.value})}
                          required 
                       />
                    </div>
                    <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl flex gap-4 items-start">
                       <span className="text-2xl mt-1">📝</span>
                       <p className="text-xs font-bold text-amber-800 leading-relaxed">تنبيه: يتم تزويد المرشد آلياً بآخر تقارير الـ KPIs الخاصة بمشروعك ونموذج العمل الحالي لضمان الفاعلية القصوى للجلسة.</p>
                    </div>
                 </div>

                 <div className="pt-6 flex flex-col sm:flex-row gap-6">
                    <button onClick={() => setShowRequestModal(false)} className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all">إلغاء الطلب</button>
                    <button 
                      onClick={handleMentorshipRequest}
                      disabled={isSubmitting || !requestFormData.title || !requestFormData.challenge}
                      className="flex-[2] py-5 bg-blue-600 text-white rounded-[2rem] font-black text-sm hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                       {isSubmitting ? 'جاري إرسال البيانات...' : 'تأكيد وإرسال الطلب للمرشد'}
                       <span className="text-xl">✈️</span>
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
