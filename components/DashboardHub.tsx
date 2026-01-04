
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
  onClick: (id: any) => void;
}

const NavItem: React.FC<NavItemProps> = ({ id, label, icon, isActive, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full flex items-center gap-4 px-6 py-3 transition-all border-r-4 ${isActive ? 'bg-slate-50 text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-900'}`}
  >
    <span className="text-xl">{icon}</span>
    <span className="text-[11px] font-bold uppercase tracking-widest">{label}</span>
  </button>
);

export const DashboardHub: React.FC<DashboardHubProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'tasks' | 'metrics' | 'templates'>('roadmap');
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

  return (
    <div className="min-h-screen bg-white flex overflow-hidden border-t border-slate-100" dir="rtl">
      
      {/* Corporate Sidebar */}
      <aside className="w-72 border-l border-slate-100 flex flex-col sticky top-0 h-screen bg-white z-50">
        <div className="p-10 border-b border-slate-50">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-8 bg-slate-900 flex items-center justify-center text-white text-[10px] font-bold">BD</div>
            <div>
              <span className="text-xs font-black text-slate-900 uppercase block leading-none">بيزنس ديفلوبرز</span>
              <span className="text-[8px] font-bold text-slate-400 mt-1 block uppercase tracking-widest">Portal</span>
            </div>
          </div>
          <div className="space-y-1">
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">المؤسس</p>
             <p className="text-sm font-black text-slate-900 truncate">{user.name}</p>
          </div>
        </div>

        <nav className="flex-1 py-8 space-y-1">
          <NavItem id="roadmap" label="مسار النضج" icon="🧠" isActive={activeTab === 'roadmap'} onClick={setActiveTab} />
          <NavItem id="tasks" label="المخرجات" icon="📥" isActive={activeTab === 'tasks'} onClick={setActiveTab} />
          <NavItem id="templates" label="مختبر القوالب" icon="🔬" isActive={activeTab === 'templates'} onClick={setActiveTab} />
          <NavItem id="metrics" label="رادار الأداء" icon="📡" isActive={activeTab === 'metrics'} onClick={setActiveTab} />
        </nav>

        <div className="p-6 border-t border-slate-50">
           <button onClick={onLogout} className="w-full flex items-center gap-4 px-6 py-3 text-slate-400 hover:text-rose-600 transition-colors">
              <span className="text-xl">🚪</span>
              <span className="text-[10px] font-black uppercase tracking-widest">خروج</span>
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="px-12 py-10 border-b border-slate-50 flex justify-between items-center shrink-0">
           <div>
              <h2 className="text-2xl font-extrabold text-slate-900">{activeTab === 'roadmap' ? 'خارطة طريق النمو' : 'مركز العمليات'}</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">مشروع: {user.startupName}</p>
           </div>
           <div className="flex gap-4">
              <button className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border border-slate-200 px-4 py-2 hover:bg-slate-50 transition-colors">تحديث الحالة</button>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 bg-slate-50/30">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'roadmap' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-up">
                {roadmap.map((level) => (
                  <div 
                    key={level.id}
                    onClick={() => !level.isLocked && setSelectedLevel(level)}
                    className={`corporate-card p-10 flex flex-col justify-between min-h-[350px] relative overflow-hidden transition-all
                      ${level.isLocked ? 'opacity-40 grayscale cursor-not-allowed bg-slate-50/50' : 'cursor-pointer hover:border-slate-300'}
                    `}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-8">
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Level 0{level.id}</span>
                        {level.isCompleted && <span className="text-emerald-500 font-black text-[9px] uppercase tracking-widest">Verified ✓</span>}
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900">{level.title}</h3>
                      <p className="text-sm text-slate-500 font-medium mt-4 leading-relaxed line-clamp-3">{level.description}</p>
                    </div>

                    <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                       <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
                          <span className="text-[10px] font-black text-slate-900 uppercase">{level.isLocked ? 'Locked' : (level.isCompleted ? 'Completed' : 'Active')}</span>
                       </div>
                       <button className={`btn-primary !text-[10px] uppercase tracking-widest ${level.isCompleted ? '!bg-slate-900' : ''}`}>
                          {level.isCompleted ? 'مراجعة المخرج' : 'دخول'}
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'templates' && <TemplateLibrary userRole={user.role} isDark={false} />}
            {activeTab === 'metrics' && <KPIsCenter startup={{ metrics: { readiness: 50 }, partners: [] } as any} />}
            {activeTab === 'tasks' && (
              <div className="p-20 text-center border border-dashed border-slate-200 rounded text-slate-400 font-bold italic">
                 مركز المخرجات والوثائق الرسمية.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
