
import { useState, useMemo, useEffect, Suspense } from 'react';
import { UserRole, UserProfile, LevelData, TaskRecord, ACADEMY_BADGES, Resource, TaskStatus } from '../types';
import { playPositiveSound, playCelebrationSound } from '../services/audioService';
import { storageService } from '../services/storageService';
import { suggestIconsForLevels } from '../services/geminiService';
import { LevelView } from './LevelView';
import { Logo } from './Branding/Logo';
import React from 'react';

// Lazy load complex dashboard components
const KPIsCenter = React.lazy(() => import('./KPIsCenter').then(m => ({ default: m.KPIsCenter })));
const TemplateLibrary = React.lazy(() => import('./TemplateLibrary').then(m => ({ default: m.TemplateLibrary })));
const PartnerMatchingWorkflow = React.lazy(() => import('./PartnerMatchingWorkflow').then(m => ({ default: m.PartnerMatchingWorkflow })));
const ProfileManagement = React.lazy(() => import('./ProfileManagement').then(m => ({ default: m.ProfileManagement })));
const ServicesPortal = React.lazy(() => import('./ServicesPortal').then(m => ({ default: m.ServicesPortal })));
const ToolsPage = React.lazy(() => import('./ToolsPage').then(m => ({ default: m.ToolsPage })));

interface DashboardHubProps {
  user: UserProfile & { uid: string; role: UserRole; startupId?: string };
  onLogout: () => void;
  lang: any;
}

const TabLoader = () => (
  <div className="py-24 flex flex-col items-center justify-center space-y-6">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-white/5 border-t-electric-blue rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 bg-electric-blue/10 rounded-full animate-pulse"></div>
      </div>
    </div>
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Initializing Module...</span>
  </div>
);

const COLOR_MAP: Record<string, string> = {
  blue: 'electric-blue',
  indigo: 'indigo-500',
  emerald: 'saudi-green',
  amber: 'amber-500',
  orange: 'orange-500',
  rose: 'rose-500',
  purple: 'purple-500',
  pink: 'pink-500'
};

export const DashboardHub: React.FC<DashboardHubProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'tasks' | 'metrics' | 'templates' | 'partners' | 'profile' | 'services' | 'tools'>('roadmap');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [roadmap, setRoadmap] = useState<LevelData[]>([]);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<LevelData | null>(null);
  const [isAISuggesting, setIsAISuggesting] = useState(false);

  const loadAllData = () => {
    const currentRoadmap = storageService.getCurrentRoadmap(user.uid);
    setRoadmap(currentRoadmap);
    setTasks(storageService.getUserTasks(user.uid));
  };

  useEffect(() => { loadAllData(); }, [user.uid, activeTab]);

  const currentStartup = useMemo(() => {
    const startups = storageService.getAllStartups();
    return startups.find(s => s.ownerId === user.uid);
  }, [user.uid, activeTab]);

  const getComplexityStyle = (complexity?: string) => {
    switch (complexity) {
      case 'Elite': return 'bg-rose-600/20 text-rose-400 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.15)]';
      case 'High': return 'bg-amber-600/20 text-amber-400 border-amber-500/30';
      case 'Medium': return 'bg-blue-600/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-600/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusConfig = (status: TaskStatus) => {
    switch (status) {
      case 'APPROVED': return { label: 'معتمد', color: 'bg-saudi-green', text: 'text-saudi-green', progress: 100, icon: '✓' };
      case 'SUBMITTED': return { label: 'قيد المراجعة', color: 'bg-amber-500', text: 'text-amber-500', progress: 60, icon: '⏳' };
      case 'REJECTED': return { label: 'تعديل مطلوب', color: 'bg-rose-500', text: 'text-rose-500', progress: 30, icon: '!' };
      case 'ASSIGNED': return { label: 'بانتظار التنفيذ', color: 'bg-electric-blue', text: 'text-electric-blue', progress: 10, icon: '→' };
      case 'LOCKED': return { label: 'مغلق', color: 'bg-slate-700', text: 'text-slate-500', progress: 0, icon: '🔒' };
      default: return { label: 'غير معروف', color: 'bg-slate-500', text: 'text-slate-500', progress: 0, icon: '?' };
    }
  };

  const handleAISuggest = async () => {
    setIsAISuggesting(true);
    playPositiveSound();
    try {
      const suggestions = await suggestIconsForLevels();
      if (suggestions && suggestions.suggestions) {
        const updatedRoadmap = roadmap.map(lvl => {
          const suggestion = suggestions.suggestions.find((s: any) => s.id === lvl.id);
          if (suggestion) {
            return { ...lvl, icon: suggestion.icon, customColor: suggestion.color.toLowerCase() };
          }
          return lvl;
        });
        setRoadmap(updatedRoadmap);
        localStorage.setItem(`bd_roadmap_${user.uid}`, JSON.stringify(updatedRoadmap));
        playCelebrationSound();
      }
    } catch (e) { 
      console.error("AI Suggestion failed", e);
    } finally { 
      setIsAISuggesting(false); 
    }
  };

  const NAV_ITEMS = [
    { id: 'roadmap', label: 'خارطة النضج', icon: '🗺️', category: 'CORE' },
    { id: 'profile', label: 'الملف الاستراتيجي', icon: '👤', category: 'CORE' },
    { id: 'tasks', label: 'المخرجات الرقمية', icon: '📥', category: 'CORE' },
    { id: 'partners', label: 'نظام المطابقة والشركاء', icon: '🤝', category: 'GROWTH' },
    { id: 'services', label: 'دليل الخدمات', icon: '🛠️', category: 'GROWTH' },
    { id: 'tools', label: 'أدوات الذكاء', icon: '✨', category: 'LABS' },
    { id: 'templates', label: 'مختبر النماذج', icon: '🔬', category: 'LABS' },
    { id: 'metrics', label: 'رادار الأداء', icon: '📡', category: 'ANALYTICS' },
  ];

  if (selectedLevel) {
    return (
      <LevelView 
        level={selectedLevel} 
        user={user} 
        tasks={tasks} 
        onBack={() => setSelectedLevel(null)} 
        onComplete={() => { 
          storageService.completeLevel(user.uid, selectedLevel.id); 
          loadAllData(); 
          setSelectedLevel(null); 
          playCelebrationSound(); 
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] flex overflow-hidden text-white font-sans" dir="rtl">
      <div className="fixed inset-0 cinematic-grid opacity-20 pointer-events-none"></div>

      {/* Collapsible Sidebar */}
      <aside 
        className={`border-l border-white/5 flex flex-col sticky top-0 h-screen bg-[#020617]/95 backdrop-blur-3xl z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-2xl
        ${isCollapsed ? 'w-24' : 'w-80'}`}
      >
        <button 
          onClick={() => { setIsCollapsed(!isCollapsed); playPositiveSound(); }}
          className="absolute -left-4 top-10 w-9 h-9 bg-electric-blue text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-electric-blue/50 transition-all transform hover:scale-110 z-[100] border-2 border-white/10"
        >
          <svg className={`w-5 h-5 transition-transform duration-500 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className={`pt-10 pb-10 transition-all duration-500 ${isCollapsed ? 'px-4' : 'px-8'}`}>
          <div className={`flex items-center gap-4 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
            <Logo variant="light" hideText={isCollapsed} className={isCollapsed ? 'h-9' : 'h-11'} />
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-10 overflow-y-auto custom-scrollbar overflow-x-hidden pb-12">
          {['CORE', 'GROWTH', 'LABS', 'ANALYTICS'].map(cat => (
            <div key={cat} className="space-y-3">
              {!isCollapsed && (
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] px-5 mb-4 opacity-50">{cat}</p>
              )}
              {NAV_ITEMS.filter(n => n.category === cat).map(item => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id as any); playPositiveSound(); }}
                  className={`w-full flex items-center transition-all duration-300 group rounded-2xl relative
                    ${activeTab === item.id 
                      ? 'bg-electric-blue/15 text-white border border-electric-blue/30 shadow-glow' 
                      : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'}
                    ${isCollapsed ? 'justify-center p-4' : 'px-5 py-4 gap-5'}
                  `}
                >
                  <span className={`text-2xl transition-all duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-125 opacity-70 group-hover:opacity-100'}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="text-[12px] font-black uppercase tracking-widest whitespace-nowrap">{item.label}</span>
                  )}
                  {activeTab === item.id && !isCollapsed && (
                    <div className="mr-auto w-1.5 h-1.5 bg-electric-blue rounded-full shadow-glow"></div>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className={`p-6 border-t border-white/5 transition-all duration-500 ${isCollapsed ? 'px-4' : 'px-8'}`}>
           <button 
             onClick={onLogout} 
             className={`w-full flex items-center transition-all duration-300 rounded-2xl group text-slate-600 hover:text-rose-500 hover:bg-rose-500/5
               ${isCollapsed ? 'justify-center p-4' : 'px-5 py-4 gap-4'}
             `}
           >
              <span className="text-2xl group-hover:rotate-12 transition-transform">🚪</span>
              {!isCollapsed && <span className="text-[11px] font-black uppercase tracking-widest">خروج آمن</span>}
           </button>
        </div>
      </aside>

      {/* Main Experience Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="px-10 md:px-16 py-14 flex flex-col md:flex-row justify-between items-start md:items-end shrink-0 gap-8 animate-reveal">
           <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
                 <span className="w-1.5 h-1.5 bg-electric-blue rounded-full animate-pulse"></span>
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">System Engine • {activeTab.toUpperCase()}</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white leading-none">
                {NAV_ITEMS.find(i => i.id === activeTab)?.label}
              </h2>
              <p className="text-lg text-slate-400 font-medium leading-relaxed">
                {activeTab === 'roadmap' && 'خارطة طريق نضج المشروع من الفكرة إلى الجاهزية للاستثمار.'}
                {activeTab === 'profile' && 'إدارة الملف الاستراتيجي للشركة وبيانات فريق التأسيس الموحد.'}
                {activeTab === 'partners' && 'نظام مطابقة الشركاء المؤسسين وبوابة التعاون الاستراتيجي.'}
                {activeTab === 'tasks' && 'أرشيف مخرجاتك الاستراتيجية والمهام العملية المعتمدة.'}
                {activeTab === 'tools' && 'مختبر الأدوات الذكية لتوليد الأفكار وخطط العمل.'}
                {activeTab === 'services' && 'دليل خدمات التنفيذ المتميزة لبناء وتطوير مشروعك.'}
                {activeTab === 'templates' && 'مختبر النماذج التنفيذية المعتمدة عالمياً.'}
                {activeTab === 'metrics' && 'رادار الأداء اللحظي والتحليلات التنبؤية للنمو.'}
              </p>
           </div>
           
           <div className="flex items-center gap-10 pb-2">
              <div className="flex flex-col gap-4">
                 {activeTab === 'roadmap' && (
                   <button 
                    onClick={handleAISuggest} 
                    disabled={isAISuggesting} 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 group"
                   >
                    {isAISuggesting ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : '✨'}
                    <span className="group-hover:translate-x-[-2px] transition-transform">تحديث الأيقونات (AI)</span>
                   </button>
                 )}
                 <div className="text-right">
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3 text-left">Roadmap Fidelity</p>
                   <div className="flex items-center gap-5">
                      <div className="w-48 md:w-64 h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                         <div 
                           className="h-full bg-electric-blue shadow-glow transition-all duration-1000 ease-out" 
                           style={{ width: `${(roadmap.filter(l => l.isCompleted).length / roadmap.length) * 100}%` }}
                         ></div>
                      </div>
                      <span className="text-sm font-black text-electric-blue tabular-nums">
                        {Math.round((roadmap.filter(l => l.isCompleted).length / roadmap.length) * 100)}%
                      </span>
                   </div>
                 </div>
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 md:p-16 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<TabLoader />}>
              {activeTab === 'roadmap' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-up pb-32">
                  {roadmap.map((level) => {
                    const progressValue = level.isCompleted ? 100 : (level.isLocked ? 0 : 35);
                    const colorKey = COLOR_MAP[level.customColor || 'blue'] || 'electric-blue';
                    return (
                      <div 
                        key={level.id}
                        onClick={() => !level.isLocked && setSelectedLevel(level)}
                        className={`glass-card p-10 md:p-14 flex flex-col justify-between min-h-[850px] relative overflow-hidden group
                          ${level.isLocked ? 'opacity-30 grayscale cursor-not-allowed border-transparent shadow-none' : 'cursor-pointer border-white/5 hover:border-electric-blue/40 shadow-premium'}
                        `}
                      >
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-12">
                            <div className="flex flex-wrap gap-4">
                              <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Phase 0{level.id}</span>
                              <div className="flex items-center gap-2">
                                <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getComplexityStyle(level.complexity)}`}>
                                  {level.complexity || 'Standard'}
                                </span>
                                {level.estimatedTime && (
                                  <span className="bg-white/5 text-slate-300 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10">
                                    ⏳ {level.estimatedTime}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {level.isCompleted ? (
                                <div className="flex items-center gap-2 bg-saudi-green/15 text-saudi-green px-5 py-2 rounded-full text-[10px] font-black uppercase border border-saudi-green/30">Verified ✓</div>
                              ) : level.isLocked ? (
                                <span className="text-slate-600 text-2xl">🔒</span>
                              ) : (
                                <span className={`bg-${colorKey}/15 text-${colorKey} px-5 py-2 rounded-full text-[10px] font-black uppercase border border-${colorKey}/30 animate-pulse`}>In Execution</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-12 mb-16">
                             <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                   <circle cx="50%" cy="50%" r="46%" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                                   <circle 
                                      cx="50%" cy="50%" r="46%" 
                                      stroke="currentColor" strokeWidth="5" fill="transparent" 
                                      strokeDasharray="290" strokeDashoffset={290 - (290 * progressValue / 100)} 
                                      className={`${level.isCompleted ? 'text-saudi-green' : `text-${colorKey}`} transition-all duration-1000 ease-out`}
                                   />
                                </svg>
                                <div className={`w-24 h-24 rounded-[3rem] flex items-center justify-center text-6xl transition-all duration-500 group-hover:scale-110 ${level.isCompleted ? 'bg-saudi-green/15 text-saudi-green' : 'bg-white/5 text-white'}`}>
                                   {level.isCompleted ? '✓' : level.icon}
                                </div>
                             </div>
                             <div className="flex-1 space-y-4">
                                <h3 className={`text-4xl md:text-5xl font-black tracking-tight leading-none group-hover:text-${colorKey} transition-colors duration-500`}>{level.title}</h3>
                                <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-sm">{level.description}</p>
                             </div>
                          </div>

                          {!level.isLocked && level.pillars && (
                            <div className="mb-14 space-y-6">
                               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Key Strategic Pillars</p>
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {level.pillars.map((p, idx) => (
                                    <div key={idx} className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-start gap-4 hover:border-white/10 transition-all">
                                       <span className="text-3xl mt-1">{p.icon}</span>
                                       <div>
                                          <p className="text-sm font-black text-slate-200">{p.title}</p>
                                          <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">{p.description}</p>
                                       </div>
                                    </div>
                                  ))}
                               </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-10 relative z-10 mt-auto">
                           <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[3rem] flex justify-between items-end">
                              <div className="space-y-2">
                                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Protocol Fidelity</p>
                                 <p className={`text-xs font-black uppercase ${level.isCompleted ? 'text-saudi-green' : `text-${colorKey}`}`}>
                                    {level.isCompleted ? 'Architecture Validated' : (level.isLocked ? 'Access Restricted' : 'Synchronizing Logic...')}
                                 </p>
                              </div>
                              <div className="text-right">
                                 <span className={`text-4xl font-black tabular-nums ${level.isCompleted ? 'text-saudi-green' : 'text-white'}`}>{progressValue}<span className="text-xs opacity-40 ml-1">%</span></span>
                              </div>
                           </div>

                           <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                              <div className="flex flex-col">
                                 <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Protocol ID 0{level.id}</span>
                                 <span className={`text-[12px] font-black uppercase mt-1 ${level.isCompleted ? 'text-saudi-green' : 'text-slate-400'}`}>
                                    {level.isLocked ? 'Access Denied' : (level.isCompleted ? 'Verified Master' : 'Authorized Personnel')}
                                 </span>
                              </div>
                              {!level.isLocked && (
                                <button className={`px-12 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all transform active:scale-95 shadow-premium ${
                                  level.isCompleted ? 'bg-white/5 text-slate-500 hover:text-white border border-white/10' : `bg-${colorKey} text-white shadow-glow btn-glow`
                                }`}>
                                  {level.isCompleted ? 'Review Data' : 'Execute Phase'}
                                </button>
                              )}
                           </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {activeTab === 'profile' && <ProfileManagement user={user} isDark={true} />}
              {activeTab === 'partners' && <PartnerMatchingWorkflow user={user} isDark={true} />}
              {activeTab === 'tasks' && (
                <div className="animate-fade-up space-y-12 pb-32">
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {tasks.map(task => {
                       const config = getStatusConfig(task.status);
                       return (
                         <div key={task.id} className={`glass-card p-12 rounded-[3.5rem] flex flex-col justify-between min-h-[450px] border border-white/5 group relative overflow-hidden ${task.status === 'LOCKED' ? 'opacity-30 grayscale' : ''}`}>
                            <div>
                               <div className="flex justify-between items-start mb-10">
                                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">{config.icon}</div>
                                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border border-opacity-30 ${config.color.replace('bg-', 'bg-opacity-10 text-')} ${config.color.replace('bg-', 'border-')}`}>
                                     {config.label}
                                  </span>
                               </div>
                               <p className="text-[10px] font-black text-slate-600 uppercase mb-4 tracking-[0.3em]">Module Output 0{task.levelId}</p>
                               <h4 className="text-2xl font-black text-white mb-6 leading-tight group-hover:text-electric-blue transition-colors">{task.title}</h4>
                               <p className="text-slate-400 text-sm font-medium leading-relaxed line-clamp-4 italic">"{task.description}"</p>
                            </div>
                            <div className="pt-10 border-t border-white/5 flex justify-between items-center">
                               <div className="space-y-1">
                                  <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Integrity</p>
                                  <p className="text-xs font-black text-slate-300">{config.progress}%</p>
                               </div>
                               {task.status !== 'LOCKED' && (
                                 <button className="text-[10px] font-black text-white uppercase tracking-widest bg-white/5 px-6 py-3 rounded-xl border border-white/10 hover:bg-electric-blue hover:border-electric-blue transition-all">فتح التفاصيل</button>
                               )}
                            </div>
                         </div>
                       );
                     })}
                   </div>
                </div>
              )}
              {activeTab === 'tools' && <ToolsPage onBack={() => setActiveTab('roadmap')} />}
              {activeTab === 'services' && <ServicesPortal user={user} />}
              {activeTab === 'templates' && <TemplateLibrary userRole={user.role} isDark={true} />}
              {activeTab === 'metrics' && currentStartup && <KPIsCenter startup={currentStartup} />}
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
};
