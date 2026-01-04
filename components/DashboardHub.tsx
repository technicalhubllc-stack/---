import React, { useState, useMemo, useEffect } from 'react';
import { UserRole, UserProfile, LevelData, TaskRecord, StartupRecord } from '../types';
import { playPositiveSound, playCelebrationSound } from '../services/audioService';
import { storageService } from '../services/storageService';
import { LevelView } from './LevelView';
import { KPIsCenter } from './KPIsCenter';
import { TemplateLibrary } from './TemplateLibrary';

interface DashboardHubProps {
  user: UserProfile & { uid: string; role: UserRole; startupId?: string };
  onLogout: () => void;
  lang: any;
  onNavigateToStage: (stage: any) => void;
}

interface NavItemProps {
  id: string;
  label: string;
  icon: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: (id: any) => void;
}

const NavItem: React.FC<NavItemProps> = ({ id, label, icon, isActive, isCollapsed, onClick }) => {
  return (
    <button
      onClick={() => onClick(id)}
      className={`relative w-full flex items-center transition-all duration-500 group rounded-[1.5rem]
        ${isActive 
          ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
          : 'text-slate-400 hover:bg-indigo-50 hover:text-indigo-600'}
        ${isCollapsed ? 'justify-center p-4' : 'px-6 py-4.5 gap-5'}
      `}
    >
      <span className={`text-xl transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-125'}`}>
        {icon}
      </span>
      {!isCollapsed && (
        <span className="text-[10px] font-black uppercase tracking-widest truncate animate-fade-in">{label}</span>
      )}
      {isActive && !isCollapsed && (
        <div className="absolute left-3 w-1.5 h-6 bg-white/40 rounded-full"></div>
      )}
    </button>
  );
};

const BRAND_LOGO = () => (
  <svg viewBox="0 0 100 100" className="h-full w-full fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 15L85 35V65L50 85L15 65V35L50 15Z" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="50" cy="50" r="10" className="animate-pulse" fill="currentColor" />
    <path d="M50 20V40M80 38L60 45M80 62L60 55M50 80V60M20 62L40 55M20 38L40 45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const DashboardHub: React.FC<DashboardHubProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'tasks' | 'metrics' | 'templates'>('roadmap');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [roadmap, setRoadmap] = useState<LevelData[]>([]);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<LevelData | null>(null);
  const [startupRecord, setStartupRecord] = useState<StartupRecord | null>(null);

  const loadAllData = () => {
    const currentRoadmap = storageService.getCurrentRoadmap(user.uid);
    setRoadmap(currentRoadmap);
    setTasks(storageService.getUserTasks(user.uid));
    const startups = storageService.getAllStartups();
    const startup = startups.find(s => s.ownerId === user.uid);
    if (startup) setStartupRecord(startup);
  };

  useEffect(() => { loadAllData(); }, [user.uid, activeTab]);

  const stats = useMemo(() => {
    const completed = roadmap.filter(l => l.isCompleted).length;
    const progress = Math.round((completed / (roadmap.length || 1)) * 100);
    return { progress };
  }, [roadmap]);

  if (selectedLevel) {
    return <LevelView level={selectedLevel} user={user} tasks={tasks} onBack={() => setSelectedLevel(null)} onComplete={() => { storageService.completeLevel(user.uid, selectedLevel.id); loadAllData(); setSelectedLevel(null); playCelebrationSound(); }} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden selection:bg-indigo-600/10" dir="rtl">
      
      {/* AI Sidebar */}
      <aside className={`bg-white border-l border-indigo-50 flex flex-col shadow-2xl sticky top-0 h-screen z-50 transition-all duration-700 ${isCollapsed ? 'w-24' : 'w-80'}`}>
        <button onClick={() => setIsCollapsed(!isCollapsed)} className={`absolute -left-4 top-12 w-9 h-9 bg-slate-950 text-white rounded-full flex items-center justify-center shadow-2xl z-[60] transition-all transform ${isCollapsed ? 'rotate-180' : ''}`}>
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M15 19l-7-7 7-7" /></svg>
        </button>

        <div className={`p-10 border-b border-indigo-50 flex flex-col items-center ${isCollapsed ? 'px-4' : 'px-10'}`}>
          <div className={`flex items-center gap-5 mb-10 w-full ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
            <div className="w-14 h-14 text-indigo-600 transition-transform duration-500 hover:rotate-180">
              <BRAND_LOGO />
            </div>
            {!isCollapsed && (
              <div className="animate-fade-in overflow-hidden">
                <span className="text-sm font-black text-slate-950 tracking-tight uppercase block leading-none">بيزنس ديفلوبرز</span>
                <span className="text-[9px] font-black text-indigo-500 mt-1.5 block uppercase tracking-widest">AI Hub</span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <div className="w-full p-8 bg-slate-950 rounded-[2.5rem] text-white shadow-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-[50px]"></div>
              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">Neural Synergy</p>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-5xl font-black tabular-nums">%{stats.progress}</span>
                <span className="text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">Logic Ready</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full transition-all duration-[2s] ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{width: `${stats.progress}%`}}></div>
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 py-10 space-y-12 overflow-y-auto">
          <div className="space-y-2">
            {!isCollapsed && <h3 className="px-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">AI Tracks</h3>}
            <NavItem id="roadmap" label="خوارزمية النضج" icon="🧠" isActive={activeTab === 'roadmap'} isCollapsed={isCollapsed} onClick={setActiveTab} />
            <NavItem id="tasks" label="المخرجات الذكية" icon="📥" isActive={activeTab === 'tasks'} isCollapsed={isCollapsed} onClick={setActiveTab} />
          </div>
          <div className="space-y-2">
            {!isCollapsed && <h3 className="px-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Analytic Tools</h3>}
            <NavItem id="templates" label="مختبر القوالب" icon="🔬" isActive={activeTab === 'templates'} isCollapsed={isCollapsed} onClick={setActiveTab} />
            <NavItem id="metrics" label="رادار الأداء" icon="📡" isActive={activeTab === 'metrics'} isCollapsed={isCollapsed} onClick={setActiveTab} />
          </div>
        </nav>

        <div className="p-6 border-t border-indigo-50">
           <button onClick={onLogout} className={`w-full flex items-center rounded-2xl group transition-all duration-300 ${isCollapsed ? 'justify-center p-4' : 'px-6 py-4 gap-5'} text-rose-500 hover:bg-rose-50`}>
              <span className="text-xl">🚪</span>
              {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-widest">خروج آمن</span>}
           </button>
        </div>
      </aside>

      {/* Main Experience Hub */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="px-14 py-12 glass-ai border-b border-indigo-100 shrink-0">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
             <div>
                <h2 className="title-ar !text-4xl">بيئة التطوير التوليدي</h2>
                <p className="title-en text-right !mt-2">Generative Evolution Hub</p>
                <p className="text-lg text-slate-500 font-medium mt-4">مشروع: <span className="text-indigo-600 font-black">{user.startupName}</span>.</p>
             </div>
             <div className="flex gap-4">
                <button className="px-8 py-3.5 bg-slate-950 text-white rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">تحديث الرادار</button>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-14 pb-40">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'roadmap' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-fade-up">
                {roadmap.map((level) => (
                  <div 
                    key={level.id}
                    onClick={() => !level.isLocked && setSelectedLevel(level)}
                    className={`p-12 ai-card relative overflow-hidden flex flex-col justify-between min-h-[480px]
                      ${level.isLocked ? 'opacity-40 grayscale cursor-not-allowed' : 'cursor-pointer shadow-sm'}
                    `}
                  >
                    <div className="absolute -top-10 -left-10 text-[18rem] font-black text-indigo-600/[0.04] select-none pointer-events-none">{level.id}</div>
                    
                    <div className="relative z-10 flex justify-between items-start mb-12">
                      <div className={`w-24 h-24 rounded-[2.8rem] flex items-center justify-center text-6xl shadow-inner
                        ${level.isCompleted ? `bg-indigo-600 text-white shadow-2xl` : 'bg-indigo-50 text-indigo-300'}
                      `}>
                        {level.isCompleted ? '✓' : level.icon}
                      </div>
                      <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase border
                        ${level.isCompleted ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}
                      `}>
                        {level.isCompleted ? 'AI Verified' : 'Logic Core'}
                      </span>
                    </div>

                    <div className="relative z-10 space-y-6">
                      <div>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-4">Phase Block 0{level.id}</p>
                        <h3 className="title-ar !text-2xl !text-right">{level.title}</h3>
                        <p className="text-xl text-slate-500 font-medium mt-4 leading-relaxed line-clamp-3">{level.description}</p>
                      </div>

                      <div className="pt-8 border-t border-indigo-50 flex items-center justify-between">
                         <div className="flex flex-col gap-1.5">
                            <span className="title-en !text-[8px]">Processing Cycles</span>
                            <span className="text-sm font-black text-slate-900">{level.estimatedTime || '٧ دورات ذكية'}</span>
                         </div>
                         <button className={`px-12 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-2xl
                            ${level.isCompleted ? 'bg-slate-950 text-white' : 'bg-indigo-600 text-white shadow-indigo-500/30 hover:bg-indigo-700'}
                         `}>
                            {level.isCompleted ? 'تحليل المخرجات' : 'بدء المعالجة'}
                         </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'templates' && <TemplateLibrary userRole={user.role} isDark={false} />}
            {activeTab === 'metrics' && startupRecord && <KPIsCenter startup={startupRecord} />}
          </div>
        </div>
      </main>
    </div>
  );
};