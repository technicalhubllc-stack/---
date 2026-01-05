
import { useState, useMemo, useEffect, Suspense } from 'react';
import { UserRole, UserProfile, LevelData, TaskRecord, ACADEMY_BADGES, Resource, TaskStatus } from '../types';
import { playPositiveSound, playCelebrationSound } from '../services/audioService';
import { storageService } from '../services/storageService';
import { suggestIconsForLevels } from '../services/geminiService';
import { LevelView } from './LevelView';
import { Logo } from './Branding/Logo';
import { Certificate } from './Certificate';
import React from 'react';

// Lazy load complex dashboard components
const KPIsCenter = React.lazy(() => import('./KPIsCenter').then(m => ({ default: m.KPIsCenter })));
const TemplateLibrary = React.lazy(() => import('./TemplateLibrary').then(m => ({ default: m.TemplateLibrary })));
const PartnerMatchingWorkflow = React.lazy(() => import('./PartnerMatchingWorkflow').then(m => ({ default: m.PartnerMatchingWorkflow })));
const ProfileManagement = React.lazy(() => import('./ProfileManagement').then(m => ({ default: m.ProfileManagement })));
const ServicesPortal = React.lazy(() => import('./ServicesPortal').then(m => ({ default: m.ServicesPortal })));
const ToolsPage = React.lazy(() => import('./ToolsPage').then(m => ({ default: m.ToolsPage })));
const DocumentsPortal = React.lazy(() => import('./DocumentsPortal').then(m => ({ default: m.DocumentsPortal })));
const SupportHub = React.lazy(() => import('./SupportHub').then(m => ({ default: m.SupportHub })));

interface DashboardHubProps {
  user: UserProfile & { uid: string; role: UserRole; startupId?: string };
  onLogout: () => void;
  lang: any;
}

const TabLoader = () => (
  <div className="py-24 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-slate-200 border-t-primary rounded-full animate-spin"></div>
  </div>
);

export const DashboardHub: React.FC<DashboardHubProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'tasks' | 'metrics' | 'templates' | 'partners' | 'profile' | 'services' | 'tools' | 'documents' | 'support'>('roadmap');
  const [roadmap, setRoadmap] = useState<LevelData[]>([]);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<LevelData | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);

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

  const maturityProgress = useMemo(() => {
    if (roadmap.length === 0) return 0;
    return (roadmap.filter(l => l.isCompleted).length / roadmap.length) * 100;
  }, [roadmap]);

  const NAV_ITEMS = [
    { id: 'roadmap', label: 'خارطة النضج', icon: '🗺️', category: 'CORE' },
    { id: 'profile', label: 'الملف الاستراتيجي', icon: '👤', category: 'CORE' },
    { id: 'tasks', label: 'المخرجات الرقمية', icon: '📥', category: 'CORE' },
    { id: 'documents', label: 'إدارة الوثائق', icon: '📄', category: 'GOVERNANCE' },
    { id: 'support', label: 'مركز المساندة', icon: '💬', category: 'GOVERNANCE' },
    { id: 'partners', label: 'نظام المطابقة', icon: '🤝', category: 'GROWTH' },
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
    <div className="min-h-screen bg-white flex overflow-hidden text-slate-900 font-sans" dir="rtl">
      {showCertificate && <Certificate user={user} onClose={() => setShowCertificate(false)} />}

      {/* Minimalist Sidebar */}
      <aside className="w-72 border-l border-slate-100 flex flex-col h-screen sticky top-0 bg-slate-50/50">
        <div className="p-8">
          <Logo className="h-8" />
        </div>

        <nav className="flex-1 px-4 space-y-8 overflow-y-auto pb-12">
          {['CORE', 'GOVERNANCE', 'GROWTH', 'LABS', 'ANALYTICS'].map(cat => (
            <div key={cat} className="space-y-1">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] px-4 mb-2">{cat}</p>
              {NAV_ITEMS.filter(n => n.category === cat).map(item => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id as any); playPositiveSound(); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all text-sm font-medium
                    ${activeTab === item.id 
                      ? 'bg-white text-primary border border-slate-200 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'}
                  `}
                >
                  <span className="opacity-80">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100">
           <button 
             onClick={onLogout} 
             className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-slate-400 hover:text-rose-600 transition-colors text-sm font-bold"
           >
              <span>🚪</span>
              خروج
           </button>
        </div>
      </aside>

      {/* Dashboard Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="px-12 py-10 border-b border-slate-100 flex justify-between items-end">
           <div className="space-y-1">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{activeTab.toUpperCase()} PROTOCOL</span>
              <h2 className="text-3xl font-bold text-slate-900">
                {NAV_ITEMS.find(i => i.id === activeTab)?.label}
              </h2>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="text-right">
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Project Maturity</p>
                 <div className="flex items-center gap-3">
                    <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-primary" style={{ width: `${maturityProgress}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      {Math.round(maturityProgress)}%
                    </span>
                 </div>
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12">
          <div className="max-w-6xl">
            <Suspense fallback={<TabLoader />}>
              {activeTab === 'roadmap' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
                  {roadmap.map((level) => (
                    <div 
                      key={level.id}
                      onClick={() => !level.isLocked && setSelectedLevel(level)}
                      className={`p-8 border rounded-xl flex flex-col justify-between min-h-[280px] transition-all
                        ${level.isLocked ? 'opacity-40 grayscale bg-slate-50 border-transparent cursor-not-allowed' : 'bg-white border-slate-200 hover:border-primary cursor-pointer hover:shadow-sm'}
                      `}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phase 0{level.id}</span>
                          {level.isCompleted ? (
                            <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest">Verified ✓</span>
                          ) : level.isLocked ? (
                            <span className="text-slate-400 text-xs">🔒 Locked</span>
                          ) : (
                            <span className="text-primary text-[10px] font-bold uppercase tracking-widest">Active</span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">{level.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">{level.description}</p>
                      </div>
                      
                      <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           {level.estimatedTime || 'N/A'}
                         </div>
                         {!level.isLocked && (
                           <span className="text-primary font-bold text-xs">إجراء التنفيذ ←</span>
                         )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'profile' && <ProfileManagement user={user} isDark={false} />}
              {activeTab === 'partners' && <PartnerMatchingWorkflow user={user} isDark={false} />}
              {activeTab === 'tasks' && (
                <div className="grid grid-cols-1 gap-4">
                  {tasks.map(task => (
                    <div key={task.id} className="p-6 border border-slate-200 rounded-xl flex justify-between items-center hover:border-slate-300 bg-white">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">OUTPUT 0{task.levelId}</p>
                        <h4 className="text-lg font-bold text-slate-900">{task.title}</h4>
                      </div>
                      <span className={`px-4 py-1 rounded-full text-[10px] font-bold border ${task.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'tools' && <ToolsPage onBack={() => setActiveTab('roadmap')} />}
              {activeTab === 'services' && <ServicesPortal user={user} />}
              {activeTab === 'templates' && <TemplateLibrary userRole={user.role} isDark={false} />}
              {activeTab === 'metrics' && currentStartup && <KPIsCenter startup={currentStartup} />}
              {activeTab === 'documents' && <DocumentsPortal user={user} progress={maturityProgress} onShowCertificate={() => setShowCertificate(true)} />}
              {activeTab === 'support' && <SupportHub user={user} />}
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
};
