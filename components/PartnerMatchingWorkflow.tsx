
import React, { useState, useMemo, useEffect } from 'react';
import { UserProfile, UserRole, MatchResult, PartnerProfile, SECTORS } from '../types';
import { playPositiveSound, playCelebrationSound } from '../services/audioService';
import { storageService } from '../services/storageService';
import { runSmartMatchingAlgorithmAI } from '../services/geminiService';

interface PartnerMatchingWorkflowProps {
  user: UserProfile & { uid: string; role: UserRole; startupId?: string };
  isDark: boolean;
}

export const PartnerMatchingWorkflow: React.FC<PartnerMatchingWorkflowProps> = ({ user, isDark }) => {
  const [mode, setMode] = useState<'AI' | 'SEARCH'>('AI');
  const [phase, setPhase] = useState<'IDLE' | 'ANALYZING' | 'RESULTS'>('IDLE');
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [selectedPartnerForRequest, setSelectedPartnerForRequest] = useState<{ partnerUid: string; name: string } | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [isSendingRequest, setIsSendingRequest] = useState(false);

  // Advanced Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [industryFilter, setIndustryFilter] = useState<string>('ALL');

  // Load partners from storage (or use mock for demo)
  const allPartners = useMemo(() => {
    const fromStorage = storageService.getAllPartners();
    if (fromStorage.length > 0) return fromStorage;
    
    // Fallback Mock Partners for richer demo experience
    return [
      { uid: 'p1', name: 'م. سارة المهدي', email: 'sara@demo.com', primaryRole: 'CTO' as const, experienceYears: 12, bio: 'خبيرة في بناء الأنظمة الموزعة والتقنيات المالية Fintech. سوابق أعمال في تحجيم منصات الدفع.', linkedin: '#', skills: ['Node.js', 'Fintech', 'AWS', 'Security'], availabilityHours: 20, commitmentType: 'Part-time' as const, city: 'الرياض', isRemote: true, workStyle: 'Fast' as const, goals: 'Long-term' as const, isVerified: true, profileCompletion: 95 },
      { uid: 'p2', name: 'أ. فهد الكويتي', email: 'fahd@demo.com', primaryRole: 'COO' as const, experienceYears: 8, bio: 'متخصص في إدارة العمليات اللوجستية وتطوير سلاسل الإمداد. خبرة في E-commerce.', linkedin: '#', skills: ['Operations', 'Supply Chain', 'Logistics', 'Retail'], availabilityHours: 40, commitmentType: 'Full-time' as const, city: 'جدة', isRemote: false, workStyle: 'Structured' as const, goals: 'Exit' as const, isVerified: true, profileCompletion: 88 },
      { uid: 'p3', name: 'د. ليلى القاسم', email: 'laila@demo.com', primaryRole: 'CMO' as const, experienceYears: 10, bio: 'خبيرة تسويق رقمي واستراتيجيات استحواذ. ساهمت في نمو ٣ شركات ناشئة من الصفر.', linkedin: '#', skills: ['Marketing', 'B2B', 'SEO', 'Content Strategy'], availabilityHours: 15, commitmentType: 'Equity-only' as const, city: 'دبي', isRemote: true, workStyle: 'Balanced' as const, goals: 'Social Impact' as const, isVerified: true, profileCompletion: 92 }
    ];
  }, []);

  const filteredPartners = useMemo(() => {
    return allPartners.filter(p => {
      const matchesRole = roleFilter === 'ALL' || p.primaryRole === roleFilter;
      
      // Check for Industry match in bio or skills (as simplified industry check)
      const matchesIndustry = industryFilter === 'ALL' || 
        p.bio.toLowerCase().includes(industryFilter.toLowerCase()) || 
        p.skills.some(s => s.toLowerCase().includes(industryFilter.toLowerCase()));

      const matchesQuery = !searchQuery || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.bio.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesRole && matchesIndustry && matchesQuery;
    });
  }, [allPartners, searchQuery, roleFilter, industryFilter]);

  const runAlgorithm = async () => {
    setPhase('ANALYZING');
    playPositiveSound();

    try {
      const allStartups = storageService.getAllStartups();
      const currentStartup = allStartups.find(s => s.ownerId === user.uid);

      if (!currentStartup) {
        alert("يرجى إكمال بيانات مشروعك في الملف الشخصي أولاً لتفعيل نظام المطابقة.");
        setPhase('IDLE');
        return;
      }

      const results = await runSmartMatchingAlgorithmAI(currentStartup, allPartners);
      setMatches(results.slice(0, 10));
      setPhase('RESULTS');
      playCelebrationSound();
    } catch (e) {
      setPhase('IDLE');
      alert("حدث خطأ في محرك المطابقة. سيتم استخدام المطابقة التقليدية.");
    }
  };

  const handleSendPartnershipRequest = () => {
    if (!selectedPartnerForRequest || !requestMessage.trim()) return;
    setIsSendingRequest(true);
    playPositiveSound();

    setTimeout(() => {
      storageService.sendPartnershipRequest(
        user.startupId || 'DEMO_ID',
        user.startupName || 'مشروعي',
        selectedPartnerForRequest.partnerUid,
        requestMessage
      );
      playCelebrationSound();
      setIsSendingRequest(false);
      setSelectedPartnerForRequest(null);
      setRequestMessage('');
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 animate-fade-up text-right" dir="rtl">
      
      {/* Search & Mode Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
        <div className="inline-flex p-1.5 glass-premium rounded-[1.5rem] border border-white/10 shadow-inner">
          <button 
            onClick={() => { setMode('AI'); setPhase('IDLE'); playPositiveSound(); }}
            className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'AI' ? 'bg-electric-blue text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
          >
            مطابقة ذكية (AI)
          </button>
          <button 
            onClick={() => { setMode('SEARCH'); playPositiveSound(); }}
            className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'SEARCH' ? 'bg-electric-blue text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
          >
            بحث متقدم
          </button>
        </div>

        {mode === 'SEARCH' && (
          <div className="flex-1 w-full max-w-2xl flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="بحث بالمهارات (مثلاً: React, Marketing, Finance)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full p-5 bg-white/5 border border-white/10 rounded-[1.5rem] outline-none focus:border-electric-blue transition-all font-bold text-white placeholder-slate-600"
              />
              <span className="absolute left-6 top-5 opacity-30 text-xl">🔍</span>
            </div>
            <select 
              className="p-5 bg-white/5 border border-white/10 rounded-[1.5rem] text-white font-bold outline-none cursor-pointer focus:border-electric-blue"
              value={industryFilter}
              onChange={e => setIndustryFilter(e.target.value)}
            >
              <option value="ALL">كافة القطاعات</option>
              {SECTORS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        )}
      </div>

      {mode === 'AI' ? (
        <>
          {phase === 'IDLE' && (
            <div className="space-y-16 py-10 animate-fade-in">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-6 py-2 bg-electric-blue/10 border border-electric-blue/20 text-electric-blue text-[10px] font-black uppercase tracking-widest rounded-full">
                  Strategic Selection Engine
                </div>
                <h2 className="text-5xl font-black text-white tracking-tight">ابحث عن النصف الآخر لمشروعك</h2>
                <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                  خوارزمية Gemini تقوم بتحليل الفجوات في فريقك الحالي وتقترح الشركاء الذين يملكون الخبرات المكملة لضمان نجاح التأسيس.
                </p>
              </div>

              <div className="flex justify-center pt-8">
                <button 
                  onClick={runAlgorithm}
                  className="px-16 py-6 bg-electric-blue text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-3xl shadow-electric-blue/20 active:scale-95 flex items-center gap-4 btn-glow"
                >
                  <span>تفعيل محرك المطابقة الذكي</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </button>
              </div>
            </div>
          )}

          {phase === 'ANALYZING' && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-12">
              <div className="w-40 h-40 border-8 border-white/5 rounded-full relative">
                <div className="absolute inset-0 border-8 border-electric-blue rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-5xl">🤖</div>
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-black text-white">جاري تحليل بيانات الشركاء المتاحين...</h3>
                <p className="text-slate-500 animate-pulse">فحص التوافق السلوكي والمهني والقطاعي</p>
              </div>
            </div>
          )}

          {phase === 'RESULTS' && (
            <div className="grid grid-cols-1 gap-6 animate-fade-up">
              {matches.map((match, i) => (
                <div key={match.id} className="glass-card p-10 flex flex-col lg:flex-row items-center gap-12 group hover:border-electric-blue transition-all duration-500 rounded-[3rem]">
                  <div className="text-6xl font-black text-white/5 shrink-0 tabular-nums">0{i+1}</div>
                  <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center text-6xl shrink-0 group-hover:scale-110 transition-transform">👤</div>
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                      <h4 className="text-2xl font-black text-white">{match.name}</h4>
                      <span className="px-4 py-1 bg-white/5 text-electric-blue text-[10px] font-black rounded-full uppercase tracking-widest border border-white/10">{match.role}</span>
                    </div>
                    <p className="text-slate-400 text-lg leading-relaxed font-medium italic pr-6 border-r-2 border-electric-blue/30">
                      "{match.reason}"
                    </p>
                    <div className="flex flex-wrap gap-2">
                       {['الخبرة', 'النمط', 'المجال'].map(tag => (
                         <span key={tag} className="text-[9px] font-black text-slate-500 uppercase tracking-widest border border-white/5 px-3 py-1 rounded-lg">High Compatibility: {tag}</span>
                       ))}
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-center gap-6">
                    <div className="text-center">
                      <p className="text-6xl font-black text-electric-blue tracking-tighter leading-none">{match.totalScore}%</p>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">Matching Index</p>
                    </div>
                    <button onClick={() => setSelectedPartnerForRequest({ partnerUid: match.partnerUid, name: match.name })} className="w-full px-12 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs hover:bg-electric-blue hover:text-white transition-all">
                      بدء التواصل
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32 animate-fade-in">
          {filteredPartners.length > 0 ? filteredPartners.map((partner) => (
            <div key={partner.uid} className="glass-card p-10 rounded-[3rem] flex flex-col justify-between hover:border-electric-blue transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-[4rem] group-hover:scale-125 transition-transform duration-700"></div>
              <div>
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:rotate-6 transition-transform">👤</div>
                  <span className="px-4 py-1.5 bg-electric-blue/10 text-electric-blue text-[10px] font-black rounded-full uppercase tracking-widest border border-electric-blue/20">{partner.primaryRole}</span>
                </div>
                <h4 className="text-2xl font-black text-white mb-2">{partner.name}</h4>
                <p className="text-xs text-slate-500 font-bold mb-6">{partner.experienceYears} سنوات خبرة • {partner.city}</p>
                <p className="text-slate-400 text-sm leading-relaxed font-medium mb-8 line-clamp-3 italic">"{partner.bio}"</p>
                <div className="flex flex-wrap gap-2 mb-10">
                  {partner.skills.map(s => (
                    <span key={s} className="px-3 py-1 bg-white/5 text-slate-500 text-[9px] font-black rounded-lg uppercase border border-white/5 hover:text-white hover:border-electric-blue transition-colors">#{s}</span>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => setSelectedPartnerForRequest({ partnerUid: partner.uid, name: partner.name })}
                className="w-full py-5 bg-white/5 text-white border border-white/10 rounded-[1.8rem] font-black text-xs hover:bg-electric-blue hover:border-electric-blue transition-all active:scale-95 btn-glow"
              >
                إرسال طلب شراكة
              </button>
            </div>
          )) : (
            <div className="col-span-full py-40 text-center opacity-30 flex flex-col items-center">
              <span className="text-8xl mb-8">🔎</span>
              <h3 className="text-3xl font-black">لم نجد شركاء يطابقون هذه المعايير</h3>
              <p className="text-xl font-medium mt-4">حاول تغيير الكلمات المفتاحية أو القطاع المستهدف.</p>
            </div>
          )}
        </div>
      )}

      {/* Partnership Request Modal */}
      {selectedPartnerForRequest && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-fade-in text-right">
           <div className="glass-card bg-slate-900 rounded-[3.5rem] w-full max-w-2xl p-12 md:p-16 space-y-10 animate-fade-in-up border border-white/10">
              <div className="flex justify-between items-start">
                 <button onClick={() => setSelectedPartnerForRequest(null)} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 font-black transition-all">✕</button>
                 <div className="flex items-center gap-6">
                    <div className="text-right">
                       <h3 className="text-2xl font-black text-white">دعوة للمشاركة المؤسسية</h3>
                       <p className="text-electric-blue font-bold mt-1">إلى: {selectedPartnerForRequest.name}</p>
                    </div>
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-white/5">👤</div>
                 </div>
              </div>

              <div className="space-y-6">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-4 block">رسالة مخصصة (لماذا ترغب في الشراكة؟)</label>
                 <textarea 
                    className="w-full h-48 p-8 bg-white/5 border border-white/10 rounded-[2.5rem] outline-none focus:border-electric-blue transition-all font-medium text-lg resize-none leading-relaxed text-white shadow-inner" 
                    placeholder="مثال: مرحباً، لدينا مشروع في مجال Fintech ونعتقد أن خبرتك التقنية هي المكمل المثالي لرؤيتنا..." 
                    value={requestMessage}
                    onChange={e => setRequestMessage(e.target.value)}
                    required 
                 />
                 <div className="p-8 bg-electric-blue/5 border border-electric-blue/20 rounded-[2.5rem] flex gap-6 items-start">
                    <span className="text-4xl">📜</span>
                    <p className="text-xs font-bold text-blue-300 leading-relaxed">تنبيه: سيتم تزويد الشريك آلياً ببروفايل مشروعك ومؤشرات الجاهزية الحالية لتمكينه من تقييم الفرصة بشكل مهني.</p>
                 </div>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row gap-6">
                 <button onClick={() => setSelectedPartnerForRequest(null)} className="flex-1 py-6 bg-white/5 text-slate-400 rounded-[2rem] font-black text-lg hover:bg-white/10 transition-all border border-white/5">إلغاء</button>
                 <button 
                   onClick={handleSendPartnershipRequest}
                   disabled={isSendingRequest || !requestMessage.trim()}
                   className="flex-[2] py-6 bg-electric-blue text-white rounded-[2rem] font-black text-xl hover:bg-blue-700 shadow-3xl shadow-electric-blue/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 btn-glow"
                 >
                    {isSendingRequest ? (
                      <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>تأكيد وإرسال الدعوة</span>
                        <span className="text-2xl">🚀</span>
                      </>
                    )}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
