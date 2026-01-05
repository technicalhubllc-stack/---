
import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { FiltrationStage, UserProfile, UserRole } from './types';
import { storageService } from './services/storageService';
import { Language, getTranslation } from './services/i18nService';
import { MainLayout } from './components/Layout/MainLayout';

// Lazy load non-critical pages
const LandingPage = React.lazy(() => import('./components/LandingPage').then(m => ({ default: m.LandingPage })));
const Registration = React.lazy(() => import('./components/Registration').then(m => ({ default: m.Registration })));
const Login = React.lazy(() => import('./components/Login').then(m => ({ default: m.Login })));
const DashboardHub = React.lazy(() => import('./components/DashboardHub').then(m => ({ default: m.DashboardHub })));
const RoadmapPage = React.lazy(() => import('./components/RoadmapPage').then(m => ({ default: m.RoadmapPage })));
const ImpactPage = React.lazy(() => import('./components/ImpactPage').then(m => ({ default: m.ImpactPage })));

const LoadingFallback = () => (
  <div className="min-h-screen bg-deep-navy flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-electric-blue/20 border-t-electric-blue rounded-full animate-spin"></div>
  </div>
);

function App() {
  const [stage, setStage] = useState<FiltrationStage>(FiltrationStage.LANDING);
  const [currentUser, setCurrentUser] = useState<(UserProfile & { uid: string; role: UserRole; startupId?: string }) | null>(null);
  const [currentLang, setCurrentLang] = useState<Language>(() => 
    (localStorage.getItem('preferred_language') as Language) || 'ar'
  );

  const t = getTranslation(currentLang);

  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = currentLang;
    localStorage.setItem('preferred_language', currentLang);
  }, [currentLang, t.dir]);

  const hydrateSession = useCallback(() => {
    const session = storageService.getCurrentSession();
    if (session) {
      const usersList = storageService.getAllUsers();
      const userRec = usersList.find(u => u.uid === session.uid);
      const startups = storageService.getAllStartups();
      const startup = startups.find(s => s.ownerId === session.uid);

      if (userRec) {
        setCurrentUser({
          uid: userRec.uid,
          firstName: userRec.firstName,
          lastName: userRec.lastName,
          email: userRec.email,
          phone: userRec.phone,
          role: (userRec.role as UserRole) || 'STARTUP',
          startupId: startup?.projectId,
          startupName: startup?.name || '',
        });
        setStage(FiltrationStage.DASHBOARD);
      }
    }
  }, []);

  useEffect(() => { hydrateSession(); }, [hydrateSession]);

  const handleLanguageChange = (newLang: Language) => setCurrentLang(newLang);

  const renderPage = () => {
    return (
      <Suspense fallback={<LoadingFallback />}>
        {(() => {
          switch (stage) {
            case FiltrationStage.LANDING:
              return <LandingPage lang={currentLang} onStart={() => setStage(FiltrationStage.WELCOME)} onRoadmap={() => setStage(FiltrationStage.ROADMAP)} onImpact={() => setStage(FiltrationStage.IMPACT)} />;
            case FiltrationStage.ROADMAP:
              return <RoadmapPage lang={currentLang} onStart={() => setStage(FiltrationStage.WELCOME)} onBack={() => setStage(FiltrationStage.LANDING)} />;
            case FiltrationStage.IMPACT:
              return <ImpactPage lang={currentLang} onBack={() => setStage(FiltrationStage.LANDING)} />;
            case FiltrationStage.DASHBOARD:
              return currentUser ? <DashboardHub lang={currentLang} user={currentUser} onLogout={() => { storageService.logout(); setCurrentUser(null); setStage(FiltrationStage.LANDING); }} /> : null;
            case FiltrationStage.LOGIN:
              return <Login lang={currentLang} onLoginSuccess={hydrateSession} onBack={() => setStage(FiltrationStage.LANDING)} />;
            case FiltrationStage.WELCOME:
              return <Registration lang={currentLang} onRegister={() => hydrateSession()} />;
            default:
              return <LandingPage lang={currentLang} onStart={() => setStage(FiltrationStage.WELCOME)} onImpact={() => setStage(FiltrationStage.IMPACT)} />;
          }
        })()}
      </Suspense>
    );
  };

  return (
    <MainLayout 
      lang={currentLang} 
      onLanguageChange={handleLanguageChange}
      onNavigate={setStage} 
      onLogin={() => setStage(FiltrationStage.LOGIN)} 
      onStart={() => setStage(FiltrationStage.WELCOME)}
    >
      {renderPage()}
    </MainLayout>
  );
}

export default App;
