
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MentorProfile, UserProfile } from '../types';
import { playPositiveSound, playCelebrationSound } from '../services/audioService';
import { getCustomMentorResponseAI } from '../services/geminiService';

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

const AI_PERSONAS = [
  { id: 'strategist', label: 'محلل استراتيجي', icon: '👔', desc: 'يركز على خارطة الطريق، التوسع، والميزة التنافسية.', prompt: 'You are a Senior Strategic Consultant from a top-tier firm.' },
  { id: 'vc', label: 'مستثمر جريء (VC)', icon: '🏦', desc: 'يركز على الجدوى المالية، مؤشرات النمو، والعرض الاستثماري.', prompt: 'You are a seasoned Venture Capitalist looking for high-growth potential.' },
  { id: 'growth', label: 'خبير نمو (Growth)', icon: '🚀', desc: 'يركز على الاستحواذ، قنوات التسويق، والنمو السريع.', prompt: 'You are a Growth Hacking Expert focused on scaling startups.' },
  { id: 'product', label: 'مدير منتج (Product)', icon: '⚙️', desc: 'يركز على الـ MVP، تجربة المستخدم، والمزايا التقنية.', prompt: 'You are an Elite Product Manager focused on building high-value MVPs.' }
];

const AI_STYLES = [
  { id: 'formal', label: 'رسمي مؤسسي', icon: '🏛️', desc: 'لغة رصينة ودقيقة' },
  { id: 'casual', label: 'توجيهي مباشر', icon: '🤝', desc: 'نقاش مريح وتلقائي' },
  { id: 'concise', label: 'ملخص تنفيذي', icon: '⚡', desc: 'إجابات مباشرة وقصيرة' }
];

const MOCK_MENTORS: MentorProfile[] = [
  {
    id: 'm1',
    name: 'د. خالد العمري',
    role: 'خبير نمو الشركات الناشئة',
    company: 'GrowthOps Global',
    specialty: 'Growth',
    bio: 'أكثر من ١٥ عاماً في مساعدة الشركات الناشئة على التوسع في الأسواق الخليجية وجذب الاستثمارات العالمية.',
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
    bio: 'متخصصة في بناء البنية التحتية القابلة للتوسع وتطوير المنتجات الأولية (MVP).',
    experience: 10,
    avatar: '👩‍💻',
    rating: 4.8,
    tags: ['Cloud', 'AI', 'Full Stack']
  },
];

export const MentorshipPage: React.FC<MentorshipPageProps> = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'ai_mentor' | 'register'>('browse');
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [detailedMentor, setDetailedMentor] = useState<MentorProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // AI Mentor Specific State
  const [aiSessionStarted, setAiSessionStarted] = useState(false);
  const [selectedAiPersona, setSelectedAiPersona] = useState(AI_PERSONAS[0]);
  const [selectedAiStyle, setSelectedAiStyle] = useState(AI_STYLES[0]);
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [aiInput, setAiInput] = useState('');
  const aiScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (aiScrollRef.current) {
      aiScrollRef.current.scrollTop = aiScrollRef.current.scrollHeight;
    }
  }, [aiMessages, aiSessionStarted]);

  const handleStartAiSession = () => {
    setAiSessionStarted(true);
    playPositiveSound();
  };

  const handleSendAiMessage = async () => {
    if (!aiInput.trim() || isSubmitting) return;
    const userMsg = aiInput.trim();
    setAiInput('');
    setAiMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsSubmitting(true);
    playPositiveSound();

    try {
      const response = await getCustomMentorResponseAI(userMsg, selectedAiPersona.label, selectedAiStyle.label);
      setAiMessages(prev => [...prev, { role: 'ai', text: response || "عذراً، لم أستطع تحليل ذلك." }]);
    } catch (e) {
      setAiMessages(prev => [...prev, { role: 'ai', text: "حدث خطأ في الاتصال بمحرك التوجيه الذكي." }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMentors = useMemo(() => {
    return MOCK_MENTORS.filter(mentor => {
      const matchSpecialty = filterSpecialty === 'all' || mentor.specialty === filterSpecialty;
      const matchSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          mentor.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSpecialty && matchSearch;
    });
  }, [filterSpecialty, searchQuery]);

  return (
    <div className="bg-transparent font-sans" dir="rtl">
      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-10">
        <div className="flex bg-slate-100 p-1.5 rounded-2xl shrink-0 border border-slate-200 shadow-inner">
           <button onClick={() => { setActiveTab('browse'); playPositiveSound(); }} className={`px-8 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'browse' ? 'bg-white text-blue-600 shadow-md border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}>شبكة الخبراء</button>
           <button onClick={() => { setActiveTab('ai_mentor'); playPositiveSound(); }} className={`px-8 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'ai_mentor' ? 'bg-white text-blue-600 shadow-md border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}>الموجه الذكي (AI)</button>
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

      <main className="w-full min-h-[600px]">
        {activeTab === 'browse' && (
          <div className="space-y-12 animate-fade-in">
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
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredMentors.map(mentor => (
                  <div key={mentor.id} className="bg-white rounded-[3rem] p-10 border border-slate-100 hover:border-blue-500 shadow-sm transition-all flex flex-col justify-between group">
                     <div>
                        <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-6xl shadow-inner mb-6 group-hover:scale-110 transition-transform">{mentor.avatar}</div>
                        <h3 className="text-2xl font-black text-slate-900 mb-1">{mentor.name}</h3>
                        <p className="text-sm font-bold text-slate-600 mb-6">{mentor.role} @ {mentor.company}</p>
                        <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3">{mentor.bio}</p>
                     </div>
                     <button 
                        onClick={() => { setSelectedMentor(mentor); setShowRequestModal(true); playPositiveSound(); }}
                        className="w-full py-5 bg-slate-900 text-white rounded-[1.8rem] font-black text-sm hover:bg-blue-600 transition-all active:scale-95"
                     >
                        حجز جلسة استشارية
                     </button>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'ai_mentor' && (
          <div className="animate-fade-in flex flex-col h-full bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden min-h-[650px]">
            {!aiSessionStarted ? (
              <div className="p-12 md:p-20 space-y-16 flex-1 overflow-y-auto">
                 <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-blue-600 text-white rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto shadow-2xl shadow-blue-500/20 mb-8 animate-float">🤖</div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">إعداد جلسة الإرشاد الاستراتيجي (AI)</h2>
                    <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">قم بتخصيص شخصية الموجه وأسلوب الرد لبدء جلسة تفاعلية مبنية على بيانات مشروعك.</p>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pr-4">اختر شخصية الموجه:</label>
                       <div className="grid grid-cols-1 gap-3">
                          {AI_PERSONAS.map(p => (
                            <button 
                              key={p.id}
                              onClick={() => { setSelectedAiPersona(p); playPositiveSound(); }}
                              className={`p-6 rounded-[2rem] border-2 text-right transition-all group flex items-center gap-6
                                ${selectedAiPersona.id === p.id ? 'bg-blue-50 border-blue-600 shadow-sm' : 'bg-slate-50 border-transparent hover:border-slate-200'}
                              `}
                            >
                               <span className="text-5xl group-hover:scale-110 transition-transform">{p.icon}</span>
                               <div className="flex-1">
                                  <h4 className={`text-xl font-black ${selectedAiPersona.id === p.id ? 'text-blue-700' : 'text-slate-900'}`}>{p.label}</h4>
                                  <p className="text-sm font-medium text-slate-500 leading-relaxed">{p.desc}</p>
                               </div>
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-12">
                       <div className="space-y-6">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pr-4">أسلوب الرد المفضل:</label>
                          <div className="grid grid-cols-1 gap-3">
                             {AI_STYLES.map(s => (
                               <button 
                                 key={s.id}
                                 onClick={() => { setSelectedAiStyle(s); playPositiveSound(); }}
                                 className={`p-6 rounded-[2rem] border-2 text-right transition-all group flex items-center gap-6
                                   ${selectedAiStyle.id === s.id ? 'bg-blue-50 border-blue-600 shadow-sm' : 'bg-slate-50 border-transparent hover:border-slate-200'}
                                 `}
                               >
                                  <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{s.icon}</span>
                                  <div className="flex-1">
                                     <h4 className={`text-lg font-black ${selectedAiStyle.id === s.id ? 'text-blue-700' : 'text-slate-900'}`}>{s.label}</h4>
                                     <p className="text-xs font-bold text-slate-400">{s.desc}</p>
                                  </div>
                               </button>
                             ))}
                          </div>
                       </div>

                       <div className="p-8 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
                          <span className="text-2xl">📝</span>
                          <p className="text-xs font-bold text-amber-800 leading-relaxed">تنبيه: سيقوم الموجه الذكي بتحليل مدخلاتك بناءً على مشروع "{user?.startupName || 'مشروعي'}" في قطاع "{user?.industry || 'التقنية'}".</p>
                       </div>
                    </div>
                 </div>

                 <div className="pt-8">
                    <button 
                      onClick={handleStartAiSession}
                      className="w-full py-8 bg-blue-600 hover:bg-blue-700 text-white rounded-[2.5rem] font-black text-2xl shadow-3xl shadow-blue-500/20 transition-all active:scale-95 btn-glow"
                    >
                       بدء الجلسة الاستراتيجية الآن
                    </button>
                 </div>
              </div>
            ) : (
              <div className="flex flex-col h-[700px] animate-fade-up">
                 {/* Chat Header */}
                 <div className="px-10 py-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-xl">
                          {selectedAiPersona.icon}
                       </div>
                       <div>
                          <h3 className="text-xl font-black leading-none">{selectedAiPersona.label}</h3>
                          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">توجيه ذكي: {selectedAiStyle.label}</p>
                       </div>
                    </div>
                    <button onClick={() => setAiSessionStarted(false)} className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">تغيير الشخصية</button>
                 </div>

                 {/* Messages */}
                 <div ref={aiScrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 bg-slate-50/50 custom-scrollbar">
                    {aiMessages.length === 0 && (
                      <div className="text-center py-20 opacity-30">
                        <div className="text-6xl mb-6 animate-bounce">💬</div>
                        <h4 className="text-2xl font-black text-slate-400">اطرح تساؤلك الاستراتيجي الأول...</h4>
                      </div>
                    )}
                    {aiMessages.map((m, i) => (
                      <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'} animate-fade-in`}>
                         <div className={`max-w-[75%] p-7 rounded-[2.5rem] text-lg font-medium leading-relaxed shadow-sm
                            ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none shadow-blue-500/10' : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'}
                         `}>
                            {m.text}
                         </div>
                      </div>
                    ))}
                    {isSubmitting && (
                      <div className="flex justify-end animate-fade-in">
                         <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center gap-4">
                            <div className="flex gap-1.5">
                               <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                               <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                               <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Thinking</span>
                         </div>
                      </div>
                    )}
                 </div>

                 {/* Input Area */}
                 <div className="p-10 bg-white border-t border-slate-100 shrink-0">
                    <div className="relative max-w-4xl mx-auto group">
                       <input 
                         className="w-full pl-20 pr-8 py-6 bg-slate-50 border border-slate-200 rounded-[2rem] outline-none focus:bg-white focus:border-blue-600 transition-all text-lg font-bold shadow-inner"
                         placeholder="اكتب استفسارك هنا..."
                         value={aiInput}
                         onChange={e => setAiInput(e.target.value)}
                         onKeyDown={e => e.key === 'Enter' && handleSendAiMessage()}
                       />
                       <button 
                         onClick={handleSendAiMessage}
                         disabled={!aiInput.trim() || isSubmitting}
                         className="absolute left-3 top-3 bottom-3 aspect-square bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:bg-blue-700 transition-all active:scale-90 disabled:opacity-30 shadow-xl"
                       >
                          <svg className="w-6 h-6 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                       </button>
                    </div>
                 </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'register' && (
          <div className="max-w-3xl mx-auto animate-fade-up py-10">
             <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl space-y-12">
                <div className="text-center">
                  <h3 className="text-3xl font-black text-slate-900">انضم كمرشد خبير</h3>
                  <p className="text-slate-500 mt-2 font-medium">ساهم في بناء الجيل القادم من الشركات الناشئة.</p>
                </div>
                <button className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl hover:bg-blue-700 transition-all active:scale-95 shadow-xl">تقديم طلب الاعتماد كمرشد</button>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};
