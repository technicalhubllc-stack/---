
import React, { useState, useMemo } from 'react';
import { UserProfile, UserRole, MatchResult, PartnerProfile } from '../types';
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

  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const allPartners = useMemo(() => storageService.getAllPartners(), []);

  const filteredPartners = useMemo(() => {
    return allPartners.filter(p => {
      const matchesRole = roleFilter === 'ALL' || p.primaryRole === roleFilter;
      const matchesQuery = !searchQuery || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.bio.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRole && matchesQuery;
    });
  }, [allPartners, searchQuery, roleFilter]);

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
      console.error("Algorithm Error:", e);
      alert("حدث خطأ في محرك المطابقة. يرجى المحاولة لاحقاً.");
      setPhase('IDLE');
    }
  };

  const handleSendPartnershipRequest = () => {
    if (!selectedPartnerForRequest || !requestMessage.trim()) return;
    
    setIsSendingRequest(true);
    playPositiveSound();

    setTimeout(() => {
      storageService.sendPartnershipRequest(
        user.startupId || 'N/A',
        user.startupName || 'N/A',
        selectedPartnerForRequest.partnerUid,
        requestMessage
      );
      playCelebrationSound();
      setIsSendingRequest(false);
      setSelectedPartnerForRequest(null);
      setRequestMessage('');
      alert('تم إرسال طلب الشراكة بنجاح! سيصل إشعار للشريك قريباً.');
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 animate-fade-up text-right" dir="rtl">
      
      {/* Header Mode Toggle */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex p-1.5 bg-slate-100 dark:bg-slate-900 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-inner">
          <button 
            onClick={() => { setMode('AI'); setPhase('IDLE'); playPositiveSound(); }}
            className={`px-8 py-3 rounded-2xl text-xs font-black transition-all ${mode === 'AI' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            مطابقة ذكية (AI)
          </button>
          <button 
            onClick={() => { setMode('SEARCH'); playPositiveSound(); }}
            className={`px-8 py-3 rounded-2xl text-xs font-black transition-all ${mode === 'SEARCH' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            بحث يدوي
          </button>
        </div>
      </div>

      {mode === 'AI' ? (
        <>
          {phase === 'IDLE' && (
            <div className="space-y-16 py-10">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                  Strategic Synergy System
                </div>
                <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">نظام مطابقة الشركاء المتقدم</h2>
                <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                  خوارزمية ذكاء اصطناعي تقوم بتحليل مصفوفة الكفاءات والاحتياجات لاختيار الشريك المؤسس الأكثر ملاءمة لأهداف مشروعك الاستراتيجية.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { t: 'تكامل الدور', d: 'مطابقة المهارات المفقودة.', i: '🧩' },
                  { t: 'مستوى الخبرة', d: 'توافق العمر التشغيلي.', i: '📉' },
                  { t: 'تخصص المجال', d: 'العمق المعرفي للقطاع.', i: '🏛️' },
                  { t: 'نمط العمل', d: 'التوافق السلوكي والقيادي.', i: '⚖️' }
                ].map((pillar, i) => (
                  <div key={i} className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
                    <span className="text-3xl block mb-4">{pillar.i}</span>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1">{pillar.t}</h4>
                    <p className="text-slate-400 text-xs font-bold">{pillar.d}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-center pt-8">
                <button 
                  onClick={runAlgorithm}
                  className="px-16 py-6 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-lg active:scale-95 flex items-center gap-4"
                >
                  <span>تفعيل محرك المطابقة (Top 10)</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </button>
              </div>
            </div>
          )}

          {phase === 'ANALYZING' && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12">
              <div className="relative">
                <div className="w-40 h-40 border-8 border-slate-100 dark:border-slate-800 rounded-full"></div>
                <div className="absolute inset-0 border-8 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-5xl">🧠</div>
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">جاري تحليل مصفوفة الشركاء...</h3>
                <div className="flex gap-2 justify-center">
                  {['Role Analysis', 'Experience Mapping', 'Behavioral Check'].map((tag, i) => (
                    <span key={i} className="text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full animate-pulse" style={{animationDelay: `${i*0.3}s`}}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {phase === 'RESULTS' && (
            <div className="space-y-10 animate-fade-up">
              <div className="flex flex-col md:flex-row justify-between items-end border-b border-slate-100 dark:border-slate-800 pb-10 gap-6">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white">أفضل ١٠ شركاء مرشحين</h3>
                  <p className="text-slate-500 font-medium mt-2">بناءً على التوافق الاستراتيجي مع: <span className="text-blue-600 font-black">{user.startupName}</span></p>
                </div>
                <button onClick={() => setPhase('IDLE')} className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-black text-slate-500 hover:text-blue-600 transition-colors">إعادة التحليل ↺</button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {matches.map((match, i) => (
                  <div key={match.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-10 flex flex-col lg:flex-row items-center gap-12 group hover:border-blue-600 transition-all">
                    <div className="text-5xl font-black text-slate-100 dark:text-slate-800 tabular-nums shrink-0">0{i+1}</div>
                    <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-6xl shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                      {match.avatar || '👤'}
                    </div>
                    <div className="flex-1 space-y-6">
                      <div className="flex items-center gap-4">
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white">{match.name}</h4>
                        <span className="px-4 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest">{match.role}</span>
                      </div>
                      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-medium italic">
                          <span className="text-blue-600 font-black not-italic ml-2 underline underline-offset-4">سبب الترشيح:</span>
                          "{match.reason}"
                        </p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                          { l: 'الدور', v: match.scores.roleFit },
                          { l: 'الخبرة', v: match.scores.experienceFit },
                          { l: 'المجال', v: match.scores.industryFit },
                          { l: 'النمط', v: match.scores.styleFit }
                        ].map(s => (
                          <div key={s.l} className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                              <span>{s.l}</span>
                              <span className="text-blue-600">{s.v}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600 transition-all duration-1000 delay-300" style={{width: `${s.v}%`}}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-center gap-6 pt-4 lg:pt-0">
                      <div className="text-center">
                        <p className="text-6xl font-black text-blue-600 tracking-tighter leading-none">{match.totalScore}%</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Alignment</p>
                      </div>
                      <button onClick={() => setSelectedPartnerForRequest({ partnerUid: match.partnerUid, name: match.name })} className="w-full px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs hover:scale-105 active:scale-95 transition-all">
                        إرسال طلب تواصل
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-10 animate-fade-in">
          {/* Manual Search Controls */}
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pr-4">بحث بالمهارات أو الاسم</label>
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="مثال: React, Marketing, Finance..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full p-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold text-slate-900 dark:text-white"
                  />
                  <span className="absolute left-5 top-5 opacity-30 group-focus-within:opacity-100 transition-opacity">🔍</span>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pr-4">الفلترة حسب الدور</label>
                <div className="flex flex-wrap gap-2">
                  {['ALL', 'CTO', 'COO', 'CMO', 'CPO', 'Finance'].map(role => (
                    <button
                      key={role}
                      onClick={() => { setRoleFilter(role); playPositiveSound(); }}
                      className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all border-2
                        ${roleFilter === role ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:border-blue-500'}`}
                    >
                      {role === 'ALL' ? 'الكل' : role}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {filteredPartners.length > 0 ? filteredPartners.map((partner) => (
              <div key={partner.uid} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 flex flex-col justify-between hover:border-blue-600 transition-all card-premium group">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl shadow-inner shrink-0 group-hover:scale-110 transition-transform">
                      👤
                    </div>
                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-100 dark:border-blue-800">{partner.primaryRole}</span>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">{partner.name}</h4>
                  <p className="text-xs text-slate-500 font-bold mb-4">{partner.experienceYears} سنوات خبرة • {partner.city}</p>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium line-clamp-3 mb-6">{partner.bio}</p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {partner.skills.map(s => (
                      <span key={s} className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 text-slate-400 text-[9px] font-black rounded-lg uppercase border border-slate-100 dark:border-slate-700">#{s}</span>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPartnerForRequest({ partnerUid: partner.uid, name: partner.name })}
                  className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs hover:bg-blue-600 hover:text-white transition-all active:scale-95"
                >
                  إرسال طلب تواصل
                </button>
              </div>
            )) : (
              <div className="col-span-full py-32 text-center opacity-40">
                <span className="text-7xl mb-6 block">🔎</span>
                <h3 className="text-2xl font-black text-slate-400">لم نجد نتائج تطابق بحثك</h3>
                <p className="text-sm mt-2">جرب تغيير الكلمات المفتاحية أو الفلاتر</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Partnership Request Modal */}
      {selectedPartnerForRequest && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-fade-in text-right">
           <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] w-full max-w-2xl shadow-3xl border border-slate-100 dark:border-white/5 animate-fade-in-up overflow-hidden">
              <div className="p-12 md:p-16 space-y-10">
                 <div className="flex justify-between items-start">
                    <button onClick={() => setSelectedPartnerForRequest(null)} className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl transition-all">✕</button>
                    <div className="flex items-center gap-6">
                       <div className="text-right">
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white">طلب شراكة مؤسس</h3>
                          <p className="text-blue-600 font-bold">إلى: {selectedPartnerForRequest.name}</p>
                       </div>
                       <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] flex items-center justify-center text-4xl shadow-inner border border-slate-100 dark:border-white/5">
                          👤
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-4 block">رسالة مخصصة (لماذا ترغب في العمل مع هذا الشريك؟)</label>
                    <textarea 
                       className="w-full h-48 p-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 transition-all font-medium text-lg resize-none leading-relaxed shadow-inner" 
                       placeholder="مثال: مرحباً، لفت انتباهنا خبرتك الواسعة ونعتقد أنك المكمل المثالي لفريقنا..." 
                       value={requestMessage}
                       onChange={e => setRequestMessage(e.target.value)}
                       required 
                    />
                    <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-3xl flex gap-4 items-start">
                       <span className="text-2xl mt-1">📝</span>
                       <p className="text-xs font-bold text-blue-800 dark:text-blue-300 leading-relaxed">تنبيه: سيتم تزويد الشريك آلياً ببروفايل مشروعك ونقاط نضج المشروع الحالية لتمكينه من تقييم الفرصة.</p>
                    </div>
                 </div>

                 <div className="pt-6 flex flex-col sm:flex-row gap-6">
                    <button onClick={() => setSelectedPartnerForRequest(null)} className="flex-1 py-6 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-[2rem] font-black text-lg hover:bg-slate-200 transition-all">إلغاء</button>
                    <button 
                      onClick={handleSendPartnershipRequest}
                      disabled={isSendingRequest || !requestMessage.trim()}
                      className="flex-[2] py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                       {isSendingRequest ? 'جاري الإرسال...' : 'تأكيد وإرسال الطلب'}
                       <span className="text-xl">🚀</span>
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
