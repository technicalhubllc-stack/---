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

const PRESET_COLORS = [
  { name: 'أزرق', bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-600', light: 'bg-blue-50', ring: 'ring-blue-500' },
  { name: 'أخضر', bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-600', light: 'bg-emerald-50', ring: 'ring-emerald-500' },
  { name: 'بنفسجي', bg: 'bg-indigo-600', text: 'text-indigo-600', border: 'border-indigo-600', light: 'bg-indigo-50', ring: 'ring-indigo-500' },
  { name: 'برتقالي', bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500', light: 'bg-orange-50', ring: 'ring-orange-500' },
  { name: 'ذهبي', bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500', light: 'bg-amber-50', ring: 'ring-amber-500' },
  { name: 'سحابي', bg: 'bg-slate-500', text: 'text-slate-500', border: 'border-slate-500', light: 'bg-slate-50', ring: 'ring-slate-500' },
];

const NavItem: React.FC<NavItemProps> = ({ id, label, icon, isActive, isCollapsed, onClick }) => {
  return (
    <button
      onClick={() => onClick(id)}
      className={`relative w-full flex items-center transition-all duration-500 group rounded-[1.5rem]
        ${isActive 
          ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
          : 'text-slate-400 hover:bg-blue-50 hover:text-blue-600'}
        ${isCollapsed ? 'justify-center p-4' : 'px-6 py-4.5 gap-5'}
      `}
    >
      <span className={`text-xl transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-125'}`}>
        {icon}
      </span>
      {!isCollapsed && (
        <span className="text-[10px] font-black uppercase tracking-widest truncate animate-fade-in">{label}</span>
      )}
    </button>
  );
};

const BRAND_LOGO = () => (
  <svg viewBox="0 0 100 100" className="h-full w-full fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 15L85 35V65L50 85L15 65V35L50 15Z" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="50" cy="50" r="10" fill="currentColor" />
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

  const getLevelColorSet = (colorName?: string) => {
    return PRESET_COLORS.find(c => c.name === colorName) || PRESET_COLORS[0];
  };

  if (selectedLevel) {
    return <LevelView level={selectedLevel} user={user} tasks={tasks} onBack={() => setSelectedLevel(null)} onComplete={() => { storageService.completeLevel(user.uid, selectedLevel.id); loadAllData(); setSelectedLevel(null); playCelebrationSound(); }} />;
  }

  return (
    <div className="min-h-screen bg-white flex overflow-hidden selection:bg-blue-600/10" dir="rtl">
      
      <aside className={`bg-slate-50 border-l border-slate-100 flex flex-col shadow-sm sticky top-0 h-screen z-50 transition-all duration-700 ${isCollapsed ? 'w-24' : 'w-80'}`}>
        <button onClick={() => setIsCollapsed(!isCollapsed)} className={`absolute -left-4 top-12 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center z-[60] transition-all transform ${isCollapsed ? 'rotate-180' : ''}`}>
           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M15 19l-7-7 7-7" /></svg>
        </button>

        <div className={`p-10 border-b border-slate-100 flex flex-col items-center ${isCollapsed ? 'px-4' : 'px-10'}`}>
          <div className={`flex items-center gap-4 mb-10 w-full ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
            <div className="w-10 h-10 text-black">
              <BRAND_LOGO />
            </div>
            {!isCollapsed && (
              <div className="animate-fade-in overflow-hidden">
                <span className="text-sm font-black text-black tracking-tight uppercase block leading-none">بيزنس ديفلوبرز</span>
                <span className="text-[9px] font-bold text-slate-400 mt-1 block uppercase tracking-widest">Elite Hub</span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <div className="w-full p-8 bg-black rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Platform Maturity</p>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-5xl font-black tabular-nums">%{stats.progress}</span>
                <span className="text-[9px] font-bold text-slate-600 mb-2 uppercase tracking-widest">Logic Clear</span>
              </div>
              <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full transition-all duration-[1.5s] ease-out" style={{width: `${stats.progress}%`}}></div>
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          <NavItem id="roadmap" label="مسار النضج" icon="🧠" isActive={activeTab === 'roadmap'} isCollapsed={isCollapsed} onClick={setActiveTab} />
          <NavItem id="tasks" label="المخرجات" icon="📥" isActive={activeTab === 'tasks'} isCollapsed={isCollapsed} onClick={setActiveTab} />
          <NavItem id="templates" label="مختبر القوالب" icon="🔬" isActive={activeTab === 'templates'} isCollapsed={isCollapsed} onClick={setActiveTab} />
          <NavItem id="metrics" label="رادار الأداء" icon="📡" isActive={activeTab === 'metrics'} isCollapsed={isCollapsed} onClick={setActiveTab} />
        </nav>

        <div className="p-6 border-t border-slate-100">
           <button onClick={onLogout} className={`w-full flex items-center rounded-2xl transition-all duration-300 ${isCollapsed ? 'justify-center p-4' : 'px-6 py-4 gap-5'} text-slate-400 hover:text-black`}>
              <span className="text-xl">🚪</span>
              {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-widest">تسجيل الخروج</span>}
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="px-12 py-10 border-b border-slate-50 shrink-0">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
             <div>
                <h2 className="text-4xl font-black tracking-tight text-black">لوحة القيادة</h2>
                <p className="text-lg text-slate-400 font-light mt-2 italic">مشروع: <span className="text-black font-bold">{user.startupName}</span>.</p>
             </div>
             <div className="flex gap-4">
                <button className="px-8 py-3.5 bg-black text-white rounded-none text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">تزامن البيانات</button>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 pb-40">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'roadmap' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-fade-up">
                {roadmap.map((level) => {
                  const colorSet = getLevelColorSet(level.customColor);
                  return (
                    <div 
                      key={level.id}
                      onClick={() => !level.isLocked && setSelectedLevel(level)}
                      className={`p-10 border border-slate-100 relative overflow-hidden flex flex-col justify-between min-h-[420px] transition-all duration-500
                        ${level.isLocked ? 'opacity-30 grayscale cursor-not-allowed' : 'cursor-pointer hover:border-black shadow-sm hover:shadow-2xl'}
                      `}
                    >
                      <div className="absolute top-4 left-6 text-7xl font-black text-slate-50 select-none pointer-events-none">0{level.id}</div>
                      
                      <div className="relative z-10 flex justify-between items-start mb-12">
                        <div className={`w-16 h-16 rounded-none flex items-center justify-center text-4xl shadow-inner
                          ${level.isCompleted ? colorSet.bg + ' text-white' : 'bg-slate-50 text-slate-300'}
                        `}>
                          {level.isCompleted ? '✓' : level.icon}
                        </div>
                        <span className={`px-4 py-1.5 rounded-none text-[9px] font-black uppercase border
                          ${level.isCompleted ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'}
                        `}>
                          {level.isCompleted ? 'Verified' : 'Strategic'}
                        </span>
                      </div>

                      <div className="relative z-10 space-y-6">
                        <div>
                          <h3 className="text-2xl font-black text-black">{level.title}</h3>
                          <p className="text-sm text-slate-500 font-medium mt-4 leading-relaxed line-clamp-2">{level.description}</p>
                        </div>

                        <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                           <div className="flex flex-col">
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Complexity</span>
                              <span className="text-xs font-black text-black uppercase">{level.complexity || 'Standard'}</span>
                           </div>
                           <button className={`px-10 py-3.5 rounded-none text-[10px] font-black uppercase tracking-widest transition-all duration-300
                              ${level.isCompleted ? 'bg-black text-white' : 'bg-blue-600 text-white shadow-xl hover:bg-blue-700'}
                           `}>
                              {level.isCompleted ? 'مراجعة المخرج' : 'دخول المرحلة'}
                           </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
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