
import React, { useState, useMemo, useEffect } from 'react';
import { UserRole, UserProfile, LevelData, TaskRecord, StartupRecord } from '../types';
import { playPositiveSound, playCelebrationSound } from '../services/audioService';
import { storageService } from '../services/storageService';
import { suggestIconsForLevels } from '../services/geminiService';
import { LevelView } from './LevelView';
import { Certificate } from './Certificate';
import { DocumentsPortal } from './DocumentsPortal';
import { SupportHub } from './SupportHub';
import { PartnerMatchingWorkflow } from './PartnerMatchingWorkflow';
import { KPIsCenter } from './KPIsCenter';
import { MentorshipPage } from './MentorshipPage';
import { IncubationProgram } from './IncubationProgram';
import { ServicesPortal } from './ServicesPortal';
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
      className={`relative w-full flex items-center transition-all duration-300 group rounded-2xl
        ${isActive 
          ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
        ${isCollapsed ? 'justify-center p-4' : 'px-5 py-4 gap-4'}
      `}
    >
      <span className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-125'}`}>
        {icon}
      </span>
      {!isCollapsed && (
        <span className="text-sm font-bold truncate animate-fade-in">{label}</span>
      )}
      
      {isCollapsed && (
        <div className="absolute right-full mr-4 px-3 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-2xl z-50">
          {label}
        </div>
      )}

      {isActive && !isCollapsed && (
        <div className="absolute left-3 w-1 h-5 bg-white/40 rounded-full"></div>
      )}
    </button>
  );
};

export const DashboardHub: React.FC<DashboardHubProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'tasks' | 'profile' | 'documents' | 'support' | 'partner_match' | 'metrics' | 'mentorship' | 'incubation' | 'services' | 'templates'>('roadmap');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [roadmap, setRoadmap] = useState<LevelData[]>([]);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<LevelData | null>(null);
  const [showFullCert, setShowFullCert] = useState(false);
  const [isRefreshingUI, setIsRefreshingUI] = useState(false);
  
  const [profileData, setProfileData] = useState<UserProfile>(user);
  const [startupRecord, setStartupRecord] = useState<StartupRecord | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskData, setNewTaskData] = useState({ title: '', description: '' });

  const loadAllData = () => {
    const currentRoadmap = storageService.getCurrentRoadmap(user.uid);
    setRoadmap(currentRoadmap);
    setTasks(storageService.getUserTasks(user.uid));
    
    const users = storageService.getAllUsers();
    const currentUserRecord = users.find((u: any) => u.uid === user.uid) as any;
    
    const startups = storageService.getAllStartups();
    const startup = startups.find(s => s.ownerId === user.uid);
    
    if (startup) setStartupRecord(startup);

    if (currentUserRecord && startup) {
      setProfileData({
        ...currentUserRecord,
        startupName: startup.name,
        startupDescription: startup.description,
        industry: startup.industry || 'Technology',
        website: startup.website || '',
        linkedin: startup.linkedin || '',
        startupBio: startup.startupBio || '',
        partners: startup.partners || [],
        logo: localStorage.getItem(`logo_${user.uid}`) || undefined,
        skills: currentUserRecord.skills || []
      });
    }
  };

  useEffect(() => {
    loadAllData();
  }, [user.uid, user.startupId, activeTab]);

  const stats = useMemo(() => {
    const completed = roadmap.filter(l => l.isCompleted).length;
    const progress = Math.round((completed / (roadmap.length || 1)) * 100);
    return { progress, completedCount: completed };
  }, [roadmap]);

  const getLevelColorClass = (colorName?: string) => {
    switch (colorName) {
      case 'أزرق': return 'from-blue-500 to-blue-700';
      case 'أخضر': return 'from-emerald-500 to-emerald-700';
      case 'أحمر': return 'from-rose-500 to-rose-700';
      case 'بنفسجي': return 'from-indigo-500 to-indigo-700';
      case 'برتقالي': return 'from-orange-500 to-orange-700';
      case 'ذهبي': return 'from-amber-500 to-amber-700';
      case 'وردي': return 'from-pink-500 to-pink-700';
      case 'سحابي': return 'from-slate-500 to-slate-700';
      default: return 'from-blue-500 to-blue-700';
    }
  };

  const getComplexityColor = (complexity?: string) => {
    switch(complexity) {
      case 'Elite': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'High': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Medium': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  }

  const handleRefreshUIWithAI = async () => {
    setIsRefreshingUI(true);
    playPositiveSound();
    try {
      const suggestions = await suggestIconsForLevels();
      if (suggestions && suggestions.suggestions) {
        const updatedRoadmap = roadmap.map(lvl => {
          const suggestion = suggestions.suggestions.find((s: any) => s.id === lvl.id);
          if (suggestion) {
            return { ...lvl, icon: suggestion.icon, customColor: suggestion.color };
          }
          return lvl;
        });
        setRoadmap(updatedRoadmap);
        // Save back to storage so it persists
        localStorage.setItem(`bd_roadmap_${user.uid}`, JSON.stringify(updatedRoadmap));
        playCelebrationSound();
      }
    } catch (err) {
      console.error("AI UI Suggestion failed", err);
    } finally {
      setIsRefreshingUI(false);
    }
  };

  const handleLevelCompletion = (levelId: number) => {
    storageService.completeLevel(user.uid, levelId);
    loadAllData();
    setSelectedLevel(null);
    playCelebrationSound();
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    playPositiveSound();
    
    storageService.updateUser(user.uid, {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      email: profileData.email,
      phone: profileData.phone,
      city: profileData.city,
      founderBio: profileData.founderBio,
      skills: profileData.skills,
      linkedin: profileData.linkedin
    });

    if (user.startupId) {
      storageService.updateStartup(user.startupId, {
        name: profileData.startupName,
        description: profileData.startupDescription,
        industry: profileData.industry,
        website: profileData.website,
        linkedin: profileData.linkedin,
        startupBio: profileData.startupBio,
        partners: profileData.partners
      });
    }

    setTimeout(() => {
      setIsSaving(false);
      playCelebrationSound();
    }, 1000);
  };

  const handleAddCustomTask = () => {
    if (!newTaskData.title.trim()) return;
    storageService.createCustomTask(user.uid, user.startupId || '', newTaskData.title, newTaskData.description);
    setNewTaskData({ title: '', description: '' });
    setShowAddTaskModal(false);
    loadAllData();
    playCelebrationSound();
  };

  if (selectedLevel) {
    return (
      <LevelView 
        level={selectedLevel} 
        user={user} 
        tasks={tasks}
        onBack={() => setSelectedLevel(null)} 
        onComplete={() => handleLevelCompletion(selectedLevel.id)}
      />
    );
  }

  const CORE_NAV = [
    { id: 'roadmap', label: 'خارطة الطريق', icon: '🛣️' },
    { id: 'tasks', label: 'مركز المخرجات', icon: '📥' },
    { id: 'profile', label: 'إدارة الملف', icon: '🏢' },
  ];

  const TOOL_NAV = [
    { id: 'templates', label: 'مكتبة القوالب', icon: '📝' },
    { id: 'incubation', label: 'برنامج التسريع', icon: '🚀' },
    { id: 'metrics', label: 'مؤشرات الأداء', icon: '📊' },
    { id: 'partner_match', label: 'البحث عن شريك', icon: '🤝' },
    { id: 'mentorship', label: 'الإرشاد الخبير', icon: '🧠' },
    { id: 'services', label: 'بوابة الخدمات', icon: '🛠️' },
  ];

  const SUPPORT_NAV = [
    { id: 'documents', label: 'الوثائق', icon: '📜' },
    { id: 'support', label: 'مركز الدعم', icon: '🎧' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex transition-all duration-500 overflow-hidden" dir="rtl">
      {/* Collapsible Sidebar */}
      <aside 
        className={`bg-white border-l border-slate-200 flex flex-col shadow-2xl sticky top-0 h-screen z-50 transition-all duration-500 ease-in-out ${isCollapsed ? 'w-24' : 'w-80'}`}
      >
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute -left-4 top-10 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all transform z-[60] ${isCollapsed ? 'rotate-180' : ''}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className={`p-6 border-b border-slate-100 flex flex-col items-center transition-all ${isCollapsed ? 'px-2' : 'px-6'}`}>
          <div className={`flex items-center gap-3 mb-6 w-full ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black shadow-xl shrink-0 transition-transform hover:rotate-6">
              BD
            </div>
            {!isCollapsed && (
              <div className="animate-fade-in overflow-hidden">
                <h1 className="text-sm font-black text-slate-900 tracking-tight uppercase whitespace-nowrap">بيزنس ديفلوبرز</h1>
                <p className="text-[8px] font-black text-blue-500 tracking-widest uppercase">Elite Accelerator</p>
              </div>
            )}
          </div>

          {!isCollapsed ? (
            <div className="w-full p-5 bg-slate-900 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group animate-fade-in">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-full blur-[40px]"></div>
              <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">التقدم الكلي</p>
              <div className="flex items-end gap-1 mb-3">
                <span className="text-4xl font-black">{stats.progress}%</span>
                <span className="text-[8px] font-bold text-slate-500 mb-1 tracking-tighter">READINESS</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full transition-all duration-1000 ease-out" style={{width: `${stats.progress}%`}}></div>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full border-4 border-slate-100 flex items-center justify-center relative group cursor-help">
               <svg className="w-full h-full absolute inset-0 transform -rotate-90">
                 <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-100" />
                 <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="113" strokeDashoffset={113 - (113 * stats.progress / 100)} className="text-blue-600 transition-all duration-1000" />
               </svg>
               <span className="text-[10px] font-black text-slate-900">{stats.progress}%</span>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto custom-scrollbar overflow-x-hidden">
          <div className="space-y-3">
            {!isCollapsed && <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">المسار الأساسي</h3>}
            <div className="space-y-1">
              {CORE_NAV.map(item => (
                <NavItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  icon={item.icon}
                  isActive={activeTab === item.id}
                  isCollapsed={isCollapsed}
                  onClick={(id) => { setActiveTab(id); playPositiveSound(); }}
                />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {!isCollapsed && <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">الأدوات</h3>}
            <div className="space-y-1">
              {TOOL_NAV.map(item => (
                <NavItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  icon={item.icon}
                  isActive={activeTab === item.id}
                  isCollapsed={isCollapsed}
                  onClick={(id) => { setActiveTab(id); playPositiveSound(); }}
                />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {!isCollapsed && <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">الدعم</h3>}
            <div className="space-y-1">
              {SUPPORT_NAV.map(item => (
                <NavItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  icon={item.icon}
                  isActive={activeTab === item.id}
                  isCollapsed={isCollapsed}
                  onClick={(id) => { setActiveTab(id); playPositiveSound(); }}
                />
              ))}
            </div>
          </div>
        </nav>

        <div className={`p-4 border-t border-slate-100 space-y-2 bg-white ${isCollapsed ? 'items-center' : ''}`}>
           <button 
             onClick={onLogout} 
             className={`w-full flex items-center transition-all duration-300 rounded-2xl group
               ${isCollapsed ? 'justify-center p-4' : 'px-5 py-4 gap-4'}
               text-rose-500 hover:bg-rose-50
             `}
           >
              <span className="text-xl group-hover:scale-125 transition-transform">🚪</span>
              {!isCollapsed && <span className="text-sm font-black uppercase tracking-widest">خروج</span>}
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="px-10 py-8 bg-white/50 backdrop-blur-md border-b border-slate-200 shrink-0">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">
                {activeTab === 'roadmap' ? 'خارطة الطريق' : 
                 activeTab === 'tasks' ? 'مركز المخرجات' : 
                 activeTab === 'profile' ? 'إدارة الملف التعريفي' : 
                 'لوحة التحكم'}
              </h2>
              <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-2xl">
                {activeTab === 'roadmap' && 'تتبع مسار نضج مشروعك من الفكرة وحتى جاهزية الاستثمار.'}
                {activeTab === 'tasks' && 'إدارة وتسليم مخرجات المسرعة وإضافة مهامك المخصصة.'}
                {activeTab === 'profile' && 'تحديث البيانات الشخصية وبيانات الشركة التأسيسية.'}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
               {activeTab === 'roadmap' && (
                  <button 
                    onClick={handleRefreshUIWithAI}
                    disabled={isRefreshingUI}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                  >
                     {isRefreshingUI ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : '✨'}
                     <span>تحديث الواجهة (AI)</span>
                  </button>
               )}
              {!isCollapsed && (
                <div className="hidden lg:flex items-center gap-6 animate-fade-in">
                  <div className="text-left border-l border-slate-200 pl-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Startup ID</p>
                    <p className="text-sm font-black text-slate-900 font-mono">#{user.startupId?.split('_')[1] || 'N/A'}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Level</p>
                    <p className="text-sm font-black text-blue-600">Phase 0{roadmap.filter(l => l.isCompleted).length + 1}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar pb-32">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'roadmap' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-up">
                {roadmap.map((level, idx) => {
                  const weight = (100 / roadmap.length).toFixed(0);
                  const colorClass = getLevelColorClass(level.customColor);
                  return (
                    <div 
                      key={level.id}
                      onClick={() => !level.isLocked && setSelectedLevel(level)}
                      className={`group bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm transition-all duration-500 relative overflow-hidden
                        ${level.isLocked ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:border-blue-200'}
                      `}
                    >
                      {/* Background Step Indicator */}
                      <div className="absolute -top-6 -left-6 text-[12rem] font-black text-slate-50 opacity-[0.03] select-none pointer-events-none">{level.id}</div>
                      
                      <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform 
                          ${level.isCompleted 
                            ? `bg-gradient-to-br ${colorClass} text-white shadow-lg` 
                            : 'bg-slate-50 text-slate-400 border border-slate-100'}
                        `}>
                          {level.isCompleted ? '✓' : level.icon}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border
                            ${level.isCompleted ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}
                          `}>
                            Weight: {weight}%
                          </span>
                          {level.complexity && (
                            <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${getComplexityColor(level.complexity)}`}>
                              {level.complexity}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-blue-600/50 uppercase tracking-widest">Phase 0{level.id}</span>
                            {level.isCompleted && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                          </div>
                          {level.estimatedTime && (
                            <span className="text-[9px] font-bold text-slate-400 italic">⏱ {level.estimatedTime}</span>
                          )}
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{level.title}</h3>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-10 line-clamp-3 h-15">{level.description}</p>
                      </div>

                      <div className="pt-8 border-t border-slate-50 relative z-10">
                        <div className="flex justify-between items-center mb-3">
                           <span className={`text-[10px] font-black uppercase tracking-widest ${level.isCompleted ? 'text-emerald-500' : 'text-slate-400'}`}>
                              {level.isCompleted ? 'المحطة مكتملة ✓' : level.isLocked ? 'مغلقة حالياً' : 'ابدأ المحطة الآن ←'}
                           </span>
                           <span className="text-[10px] font-bold text-slate-300">{level.isCompleted ? '100%' : '0%'}</span>
                        </div>
                        {/* Progress Bar for the Level */}
                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                           <div className={`h-full transition-all duration-1000 ease-out ${level.isCompleted ? 'bg-emerald-500' : level.isLocked ? 'bg-slate-200' : 'bg-blue-500'}`} style={{width: level.isCompleted ? '100%' : '0%'}}></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="max-w-6xl mx-auto w-full space-y-10 animate-fade-up pb-20">
                <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-4">
                   <div>
                      <h3 className="text-2xl font-black">إدارة المخرجات والمهام</h3>
                      <p className="text-slate-500 font-medium">عرض مهام المنهج أو إضافة مهام تنفيذية مخصصة لمشروعك.</p>
                   </div>
                   <button 
                    onClick={() => setShowAddTaskModal(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-xs shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                   >
                     + إضافة مهمة مخصصة
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div 
                    onClick={() => setShowAddTaskModal(true)}
                    className="p-10 border-4 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group min-h-[300px]"
                  >
                     <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 text-3xl group-hover:bg-blue-600 group-hover:text-white transition-all">+</div>
                     <p className="mt-4 font-black text-slate-400 group-hover:text-blue-600 uppercase text-[10px] tracking-widest">إضافة مهمة جديدة</p>
                  </div>

                  {tasks.map(task => (
                    <div key={task.id} className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm flex flex-col justify-between h-full hover:border-blue-600 transition-colors group relative overflow-hidden">
                      {task.levelId === 0 && (
                        <div className="absolute top-0 right-0 px-4 py-1 bg-emerald-500 text-white text-[8px] font-black uppercase rounded-bl-xl shadow-sm">مهمة مخصصة</div>
                      )}
                      <div>
                        <div className="flex justify-between items-center mb-8">
                          <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">
                            {task.levelId > 0 ? `Milestone 0${task.levelId}` : 'Project Task'}
                          </span>
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border shadow-md transition-all
                            ${task.status === 'APPROVED' 
                              ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white border-emerald-400' 
                              : task.status === 'SUBMITTED' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                            {task.status === 'APPROVED' ? 'مقبول ✓' : task.status === 'SUBMITTED' ? 'قيد المراجعة' : 'بانتظار التسليم'}
                          </span>
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">{task.title}</h4>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10 line-clamp-3">{task.description}</p>
                      </div>
                      <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all active:scale-95">إدارة المخرج</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="max-w-4xl mx-auto w-full space-y-12 animate-fade-up">
                <section className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm space-y-10 relative overflow-hidden">
                  <div className="flex items-center gap-5 border-b border-slate-50 pb-8">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-inner">👤</div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">بيانات المؤسس</h3>
                      <p className="text-slate-400 text-xs font-bold">المعلومات الشخصية والخبرات المهنية</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pr-2">الاسم الأول</label>
                      <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 transition-all font-bold text-sm" value={profileData.firstName} onChange={e => setProfileData({...profileData, firstName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pr-2">اللقب / العائلة</label>
                      <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 transition-all font-bold text-sm" value={profileData.lastName} onChange={e => setProfileData({...profileData, lastName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pr-2">البريد الإلكتروني</label>
                      <input type="email" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 transition-all font-bold text-sm" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pr-2">رقم الجوال</label>
                      <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 transition-all font-bold text-sm" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pr-2">النبذة الشخصية (Bio)</label>
                      <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 transition-all font-bold text-sm h-32 resize-none leading-relaxed" placeholder="تحدث عن مسيرتك المهنية..." value={profileData.founderBio || ''} onChange={e => setProfileData({...profileData, founderBio: e.target.value})} />
                    </div>
                  </div>
                </section>
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4">
                  <button 
                    onClick={handleSaveProfile} 
                    disabled={isSaving} 
                    className="w-full py-6 bg-blue-600 text-white rounded-[2.5rem] font-black text-xl shadow-[0_20px_50px_-15px_rgba(37,99,235,0.5)] hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4"
                  >
                    {isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات 🚀'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'templates' && <TemplateLibrary userRole={user.role} isDark={false} />}
            {activeTab === 'incubation' && <IncubationProgram onBack={() => setActiveTab('roadmap')} onApply={() => {}} />}
            {activeTab === 'services' && <ServicesPortal user={user} />}
            {activeTab === 'metrics' && startupRecord && <KPIsCenter startup={startupRecord} />}
            {activeTab === 'mentorship' && <MentorshipPage user={profileData} onBack={() => setActiveTab('roadmap')} />}
            {activeTab === 'documents' && <DocumentsPortal user={profileData} progress={stats.progress} onShowCertificate={() => setShowFullCert(true)} />}
            {activeTab === 'support' && <SupportHub user={{...profileData, uid: user.uid, startupId: user.startupId}} />}
            {activeTab === 'partner_match' && <PartnerMatchingWorkflow user={{...profileData, uid: user.uid, role: user.role, startupId: user.startupId}} isDark={false} />}
            {showFullCert && <Certificate user={profileData} onClose={() => setShowFullCert(false)} />}
          </div>
        </div>
      </main>

      {/* Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-fade-in" dir="rtl">
           <div className="bg-white rounded-[3.5rem] w-full max-w-xl shadow-3xl border border-slate-100 animate-fade-in-up overflow-hidden">
              <div className="p-12 space-y-10">
                 <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-3xl font-black text-slate-900">إضافة مهمة مخصصة</h3>
                      <p className="text-blue-600 font-bold text-xs mt-1 uppercase tracking-widest">Custom Project Task</p>
                    </div>
                    <button onClick={() => setShowAddTaskModal(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-all">✕</button>
                 </div>
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pr-2">عنوان المهمة</label>
                       <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 transition-all font-bold text-sm" placeholder="عنوان المخرج" value={newTaskData.title} onChange={e => setNewTaskData({...newTaskData, title: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pr-2">وصف المهمة</label>
                       <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 transition-all font-bold text-sm h-32 resize-none" placeholder="صف المهمة..." value={newTaskData.description} onChange={e => setNewTaskData({...newTaskData, description: e.target.value})} />
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <button onClick={() => setShowAddTaskModal(false)} className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm">إلغاء</button>
                    <button onClick={handleAddCustomTask} disabled={!newTaskData.title.trim()} className="flex-[2] py-5 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 shadow-xl disabled:opacity-50">حفظ المهمة</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
