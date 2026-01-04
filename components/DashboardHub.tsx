
import React, { useState, useMemo, useEffect } from 'react';
import { UserRole, UserProfile, LevelData, TaskRecord, StartupRecord } from '../types';
import { playPositiveSound, playCelebrationSound } from '../services/audioService';
import { storageService } from '../services/storageService';
import { LevelView } from './LevelView';
import { KPIsCenter } from './KPIsCenter';
import { TemplateLibrary } from './TemplateLibrary';
import { PartnerMatchingWorkflow } from './PartnerMatchingWorkflow';
import { ProfileManagement } from './ProfileManagement';

interface DashboardHubProps {
  user: UserProfile & { uid: string; role: UserRole; startupId?: string };
  onLogout: () => void;
  lang: any;
  onNavigateToStage: (stage: any) => void;
}

export const DashboardHub: React.FC<DashboardHubProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'tasks' | 'metrics' | 'templates' | 'partners' | 'profile'>('roadmap');
  const [roadmap, setRoadmap] = useState<LevelData[]>([]);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<LevelData | null>(null);

  const loadAllData = () => {
    const currentRoadmap = storageService.getCurrentRoadmap(user.uid);
    setRoadmap(currentRoadmap);
    setTasks(storageService.getUserTasks(user.uid));
  };

  useEffect(() => { loadAllData(); }, [user.uid, activeTab]);

  if (selectedLevel) {
    return <LevelView level={selectedLevel} user={user} tasks={tasks} onBack={() => setSelectedLevel(null)} onComplete={() => { storageService.completeLevel(user.uid, selectedLevel.id); loadAllData(); setSelectedLevel(null); playCelebrationSound(); }} />;
  }

  const NAV_ITEMS = [
    { id: 'roadmap', label: 'مسار النضج', icon: '🧠' },
    { id: 'tasks', label: 'المخرجات الرقمية', icon: '📥' },
    { id: 'partners', label: 'البحث عن شركاء', icon: '🤝' },
    { id: 'templates', label: 'مختبر النماذج', icon: '🔬' },
    { id: 'metrics', label: 'رادار الأداء', icon: '📡' },
    { id: 'profile', label: 'الملف الاستراتيجي', icon: '📈' },
  ];

  return (
    <div className="min-h-screen bg-deep-navy flex overflow-hidden text-white font-sans" dir="rtl">
      {/* Cinematic Grid Overlay */}
      <div className="fixed inset-0 cinematic-grid opacity-30 pointer-events-none"></div>

      {/* Modern Sidebar */}
      <aside className="w-80 border-l border-white/5 flex flex-col sticky top-0 h-screen bg-deep-navy/50 backdrop-blur-3xl z-50">
        <div className="p-12">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-electric-blue rounded-2xl flex items-center justify-center text-white text-sm font-black shadow-3xl transform rotate-3">BD</div>
            <div>
              <span className="text-xl font-black text-white tracking-tight block leading-none">بيزنس ديفلوبرز</span>
              <span className="text-[9px] font-bold text-electric-blue mt-2 block uppercase tracking-[0.3em]">Command Center</span>
            </div>
          </div>
          <div className="space-y-2 p-5 bg-white/5 rounded-3xl border border-white/5">
             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">المؤسس التنفيذي</p>
             <p className="text-lg font-black text-white truncate">{user.name}</p>
             <div className="flex items-center gap-2 pt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-saudi-green animate-pulse"></span>
                <span className="text-[9px] font-black text-saudi-green uppercase">حساب نشط</span>
             </div>
          </div>
        </div>

        <nav className="flex-1 py-8 space-y-3 px-6">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id as any); playPositiveSound(); }}
              className={`w-full flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-500 group ${
                activeTab === item.id 
                ? 'bg-white/5 border border-white/10 text-white shadow-2xl' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'
              }`}
            >
              <span className={`text-2xl transition-transform duration-500 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-125'}`}>{item.icon}</span>
              <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
              {activeTab === item.id && <div className="mr-auto w-1.5 h-1.5 rounded-full bg-electric-blue shadow-[0_0_10px_rgba(37,99,235,1)]"></div>}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5">
           <button onClick={onLogout} className="w-full flex items-center gap-5 px-6 py-4 text-slate-500 hover:text-rose-500 transition-all rounded-2xl group">
              <span className="text-xl group-hover:rotate-12 transition-transform">🚪</span>
              <span className="text-xs font-black uppercase tracking-widest">خروج آمن</span>
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <header className="px-16 py-12 border-b border-white/5 flex justify-between items-end shrink-0 bg-deep-navy/30 backdrop-blur-xl">
           <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <span className="bg-electric-blue/10 text-electric-blue text-[10px] font-black px-3 py-1 rounded-full border border-electric-blue/20 uppercase tracking-widest">Phase: Strategic Maturity</span>
              </div>
              <h2 className="text-5xl font-black tracking-tighter text-white">
                {activeTab === 'roadmap' ? 'خارطة طريق النمو' : 
                 activeTab === 'templates' ? 'مختبر المخرجات' : 
                 activeTab === 'metrics' ? 'رادار الجاهزية' : 
                 activeTab === 'partners' ? 'شبكة الشركاء المؤسسين' : 
                 activeTab === 'profile' ? 'الملف الاستراتيجي للمشروع' : 'المستندات الرسمية'}
              </h2>
              <p className="text-lg text-slate-500 font-medium tracking-tight">
                {activeTab === 'profile' ? 'قم بإدارة بياناتك المؤسسية وهيكل الفريق التأسيسي.' :
                 activeTab === 'partners' ? 'ابحث عن الكفاءات التي تكمل مهاراتك القيادية والتقنية.' : 'مشروعك حالياً في مرحلة التحقق والنمذجة.'}
              </p>
           </div>
           <div className="flex items-center gap-6 pb-2">
              <div className="text-left">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Project Health</p>
                 <div className="flex items-center gap-2 mt-1">
                    <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-electric-blue shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all duration-1000" style={{ width: '65%' }}></div>
                    </div>
                    <span className="text-xs font-black">65%</span>
                 </div>
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-16 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'roadmap' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-fade-up">
                {roadmap.map((level) => (
                  <div 
                    key={level.id}
                    onClick={() => !level.isLocked && setSelectedLevel(level)}
                    className={`glass-card p-12 flex flex-col justify-between min-h-[400px] relative overflow-hidden transition-all duration-700 group
                      ${level.isLocked ? 'opacity-30 grayscale cursor-not-allowed border-transparent' : 'cursor-pointer hover:border-electric-blue/50 hover:bg-white/[0.05]'}
                    `}
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-electric-blue/5 rounded-bl-[5rem] group-hover:scale-125 transition-transform duration-700"></div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-10">
                        <span className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] group-hover:text-electric-blue transition-colors">Phase 0{level.id}</span>
                        {level.isCompleted && <span className="bg-saudi-green/10 text-saudi-green px-4 py-1.5 rounded-full text-[10px] font-black uppercase border border-saudi-green/20">Verified Protocol</span>}
                      </div>
                      <h3 className="text-3xl font-black mb-6 tracking-tight group-hover:translate-x-[-8px] transition-transform duration-500">{level.title}</h3>
                      <p className="text-slate-500 text-lg font-medium leading-relaxed mb-8 max-w-sm">{level.description}</p>
                    </div>

                    <div className="pt-10 border-t border-white/5 flex items-center justify-between relative z-10">
                       <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Protocol Status</span>
                          <span className={`text-[11px] font-black uppercase mt-1 ${level.isCompleted ? 'text-saudi-green' : 'text-slate-400'}`}>
                             {level.isLocked ? 'Encrypted' : (level.isCompleted ? 'Completed' : 'Awaiting Execution')}
                          </span>
                       </div>
                       {!level.isLocked && (
                         <button className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                           level.isCompleted 
                           ? 'bg-white/10 text-white hover:bg-white/20' 
                           : 'bg-electric-blue text-white shadow-3xl shadow-electric-blue/20 btn-glow'
                         }`}>
                           {level.isCompleted ? 'مراجعة البروتوكول' : 'دخول التنفيذ'}
                         </button>
                       )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'templates' && <TemplateLibrary userRole={user.role} isDark={true} />}
            {activeTab === 'metrics' && <KPIsCenter startup={{ metrics: { readiness: 50 }, partners: [] } as any} />}
            {activeTab === 'partners' && <PartnerMatchingWorkflow user={user} isDark={true} />}
            {activeTab === 'profile' && <ProfileManagement user={user} isDark={true} />}
            {activeTab === 'tasks' && (
              <div className="py-40 text-center animate-fade-in">
                 <div className="text-9xl mb-12 opacity-10 grayscale group-hover:grayscale-0 transition-all">📂</div>
                 <h3 className="text-4xl font-black tracking-tight mb-4">أرشيف المخرجات الاستراتيجية</h3>
                 <p className="text-slate-500 text-xl font-medium max-w-md mx-auto">سيتم عرض كافة ملفات الـ Pitch Decks وخطط العمل التي اعتمدها الـ AI هنا قريباً.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
