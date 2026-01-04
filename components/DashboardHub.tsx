
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { UserRole, UserProfile, LevelData, TaskRecord, Partner, SECTORS, StartupRecord } from '../types';
import { playPositiveSound, playCelebrationSound } from '../services/audioService';
import { storageService } from '../services/storageService';
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

export const DashboardHub: React.FC<DashboardHubProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'tasks' | 'profile' | 'documents' | 'support' | 'partner_match' | 'metrics' | 'mentorship' | 'incubation' | 'services' | 'templates'>('roadmap');
  const [roadmap, setRoadmap] = useState<LevelData[]>([]);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<LevelData | null>(null);
  const [showFullCert, setShowFullCert] = useState(false);
  
  const [profileData, setProfileData] = useState<UserProfile>(user);
  const [startupRecord, setStartupRecord] = useState<StartupRecord | null>(null);
  const [newPartner, setNewPartner] = useState<Partner>({ name: '', role: '' });
  const [skillInput, setSkillInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadData = () => {
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
    loadData();
  }, [user.uid, user.startupId, activeTab]);

  const stats = useMemo(() => {
    const completed = roadmap.filter(l => l.isCompleted).length;
    const progress = Math.round((completed / roadmap.length) * 100);
    return { progress, completedCount: completed };
  }, [roadmap]);

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

    storageService.updateStartup(user.startupId!, {
      name: profileData.startupName,
      description: profileData.startupDescription,
      industry: profileData.industry,
      website: profileData.website,
      linkedin: profileData.linkedin,
      startupBio: profileData.startupBio,
      partners: profileData.partners
    });

    setTimeout(() => {
      setIsSaving(false);
      playCelebrationSound();
    }, 1000);
  };

  const inputClass = "w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-sm text-slate-900";
  const labelClass = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pr-2";

  if (selectedLevel) {
    return (
      <LevelView 
        level={selectedLevel} 
        user={user} 
        tasks={tasks}
        onBack={() => setSelectedLevel(null)} 
        onComplete={() => { setSelectedLevel(null); playCelebrationSound(); }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-l border-slate-200 flex flex-col shadow-sm sticky top-0 h-screen z-40">
        <div className="p-8 border-b border-slate-100">
           <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg">BD</div>
              <h1 className="text-sm font-black text-slate-900 tracking-tight uppercase">بيزنس ديفلوبرز</h1>
           </div>
           <div className="p-5 bg-slate-900 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-full blur-[40px]"></div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">المرحلة الحالية</p>
              <div className="flex items-end gap-2 mb-3">
                 <span className="text-4xl font-black">{stats.progress}%</span>
                 <span className="text-[9px] font-bold text-slate-500 mb-1">DONE</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                 <div className="bg-blue-500 h-full transition-all duration-1000 ease-out" style={{width: `${stats.progress}%`}}></div>
              </div>
           </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
           {[
             { id: 'roadmap', label: 'خارطة الطريق', icon: '🛣️' },
             { id: 'templates', label: 'مكتبة القوالب', icon: '📝' },
             { id: 'incubation', label: 'برنامج التسريع', icon: '🚀' },
             { id: 'metrics', label: 'مؤشرات الأداء', icon: '📊' },
             { id: 'partner_match', label: 'البحث عن شريك', icon: '🤝' },
             { id: 'mentorship', label: 'الإرشاد الخبير', icon: '🧠' },
             { id: 'services', label: 'بوابة الخدمات', icon: '🛠️' },
             { id: 'tasks', label: 'مركز المخرجات', icon: '📥' },
             { id: 'profile', label: 'إدارة الملف', icon: '🏢' },
             { id: 'documents', label: 'الوثائق', icon: '📜' },
             { id: 'support', label: 'مركز الدعم', icon: '🎧' },
           ].map(item => (
             <button
               key={item.id}
               onClick={() => { setActiveTab(item.id as any); playPositiveSound(); }}
               className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all
                 ${activeTab === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}
               `}
             >
               <span className="text-xl">{item.icon}</span>
               {item.label}
             </button>
           ))}
        </nav>

        <div className="p-6 border-t border-slate-100">
           <button onClick={onLogout} className="w-full p-4 text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 rounded-2xl transition-all">تسجيل الخروج</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-10 overflow-y-auto pb-40">
        <header className="flex justify-between items-center mb-12">
           <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                {activeTab === 'profile' ? 'الملف التعريفي المتكامل' : 
                 activeTab === 'support' ? 'مركز الدعم والمؤازرة' :
                 activeTab === 'partner_match' ? 'محرك مطابقة الشركاء' :
                 activeTab === 'metrics' ? 'لوحة القياس الذكية (KPIs)' :
                 activeTab === 'mentorship' ? 'منصة التوجيه والإرشاد' :
                 activeTab === 'incubation' ? 'تفاصيل ومنهجية التسريع' :
                 activeTab === 'services' ? 'مركز الخدمات التنفيذية' :
                 activeTab === 'templates' ? 'مكتبة القوالب الاستراتيجية' :
                 'لوحة التحكم المركزية'}
              </h2>
              <p className="text-slate-500 font-medium mt-1">
                {activeTab === 'templates' ? 'استخدم القوالب المعتمدة لبناء مستندات مشروعك بمعايير استثمارية عالمية.' : 
                 activeTab === 'mentorship' ? 'تواصل مع نخبة من المرشدين المعتمدين لحل أعقد التحديات في مشروعك.' : 
                 activeTab === 'partner_match' ? 'جد الشريك المؤسس المكمل لمهاراتك عبر خوارزمية Gemini الذكية.' :
                 activeTab === 'incubation' ? 'تعرف على بروتوكول الـ 8 أسابيع ومعايير التخرج والانتقال لمرحلة الاستثمار.' :
                 activeTab === 'services' ? 'حلول تقنية واستشارية متكاملة لنمذجة مخرجاتك بجودة استثمارية.' :
                 'تحديث البيانات يساهم في تحسين جودة التوجيه الذكي لمشروعك.'}
              </p>
           </div>
        </header>

        {activeTab === 'roadmap' && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-up">
             {roadmap.map((level) => (
               <div 
                 key={level.id}
                 onClick={() => !level.isLocked && setSelectedLevel(level)}
                 className={`group bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm transition-all duration-500 
                   ${level.isLocked ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:border-blue-200'}
                 `}
               >
                 <div className="flex justify-between items-start mb-8">
                    <div className="w-16 h-16 bg-slate-50 rounded-[1.8rem] flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">
                      {level.isCompleted ? '✓' : level.icon}
                    </div>
                    {level.isLocked ? <span className="text-2xl opacity-20">🔒</span> : null}
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 mb-3">{level.title}</h3>
                 <p className="text-slate-500 text-sm font-medium leading-relaxed mb-10 line-clamp-3">{level.description}</p>
                 <div className="flex justify-between items-center pt-8 border-t border-slate-50">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{level.isCompleted ? 'المحطة مكتملة' : level.isLocked ? 'مغلقة حالياً' : 'ابدأ المحطة الآن ←'}</span>
                 </div>
               </div>
             ))}
           </div>
        )}

        {activeTab === 'templates' && (
          <div className="animate-fade-up">
            <TemplateLibrary userRole={user.role} isDark={false} />
          </div>
        )}

        {activeTab === 'incubation' && (
          <div className="animate-fade-up">
            <IncubationProgram onBack={() => setActiveTab('roadmap')} onApply={() => {}} />
          </div>
        )}

        {activeTab === 'services' && (
          <div className="animate-fade-up">
            <ServicesPortal user={user} />
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
                      <label className={labelClass}>الاسم الأول</label>
                      <input className={inputClass} value={profileData.firstName} onChange={e => setProfileData({...profileData, firstName: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <label className={labelClass}>اللقب / العائلة</label>
                      <input className={inputClass} value={profileData.lastName} onChange={e => setProfileData({...profileData, lastName: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <label className={labelClass}>البريد الإلكتروني الرسمي</label>
                      <input type="email" className={inputClass} value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <label className={labelClass}>رقم الجوال</label>
                      <input className={inputClass} value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} />
                   </div>
                   <div className="md:col-span-2 space-y-2">
                      <label className={labelClass}>النبذة الشخصية (Bio)</label>
                      <textarea className={inputClass + " h-32 resize-none leading-relaxed"} placeholder="تحدث عن مسيرتك المهنية..." value={profileData.founderBio || ''} onChange={e => setProfileData({...profileData, founderBio: e.target.value})} />
                   </div>
                </div>
             </section>
             <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4">
                <button 
                  onClick={handleSaveProfile} 
                  disabled={isSaving} 
                  className="w-full py-6 bg-blue-600 text-white rounded-[2.5rem] font-black text-xl shadow-[0_20px_50px_-15px_rgba(37,99,235,0.5)] hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4"
                >
                  {isSaving ? 'جاري الحفظ...' : 'حفظ الملف التعريفي 🚀'}
                </button>
             </div>
          </div>
        )}

        {activeTab === 'tasks' && (
           <div className="max-w-5xl mx-auto w-full space-y-10 animate-fade-up pb-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {tasks.map(task => (
                   <div key={task.id} className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm flex flex-col justify-between h-full">
                      <div>
                         <div className="flex justify-between items-center mb-8">
                            <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Milestone 0{task.levelId}</span>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${task.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{task.status === 'APPROVED' ? 'مقبول' : task.status}</span>
                         </div>
                         <h4 className="text-2xl font-black text-slate-900 mb-4">{task.title}</h4>
                         <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10">{task.description}</p>
                      </div>
                      <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all">إدارة المخرج</button>
                   </div>
                 ))}
              </div>
           </div>
        )}

        {activeTab === 'metrics' && startupRecord && (
          <KPIsCenter startup={startupRecord} />
        )}

        {activeTab === 'mentorship' && (
          <div className="animate-fade-up">
             <MentorshipPage user={profileData} onBack={() => setActiveTab('roadmap')} />
          </div>
        )}

        {activeTab === 'documents' && (
          <DocumentsPortal 
            user={profileData} 
            progress={stats.progress} 
            onShowCertificate={() => setShowFullCert(true)} 
          />
        )}

        {activeTab === 'support' && (
          <SupportHub user={{...profileData, uid: user.uid, startupId: user.startupId}} />
        )}

        {activeTab === 'partner_match' && (
          <PartnerMatchingWorkflow user={{...profileData, uid: user.uid, role: user.role, startupId: user.startupId}} isDark={false} />
        )}

        {showFullCert && (
          <Certificate user={profileData} onClose={() => setShowFullCert(false)} />
        )}
      </main>
    </div>
  );
};
