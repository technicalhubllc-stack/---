import React, { useState, useEffect, useCallback } from 'react';
import { FiltrationStage, UserProfile, UserRole } from './types';
import { storageService } from './services/storageService';
import { Language, getTranslation } from './services/i18nService';
import { MainLayout } from './components/Layout/MainLayout';
import { Registration } from './components/Registration';
import { Login } from './components/Login';
import { LandingPage } from './components/LandingPage';
import { DashboardHub } from './components/DashboardHub';
import { LegalPortal, LegalType } from './components/LegalPortal';
import { AchievementsPage } from './components/AchievementsPage';
import { MentorshipPage } from './components/MentorshipPage';
import { IncubationProgram } from './components/IncubationProgram';
import { MembershipsPage } from './components/MembershipsPage';
import { PartnerConceptPage } from './components/PartnerConceptPage';
import { AIMentorConceptPage } from './components/AIMentorConceptPage';
import { CoFounderPortal } from './components/CoFounderPortal';
import { ForeignInvestmentPage } from './components/ForeignInvestmentPage';
import { RoadmapPage } from './components/RoadmapPage';
import { ToolsPage } from './components/ToolsPage';

function App() {
  const [stage, setStage] = useState<FiltrationStage>(FiltrationStage.LANDING);
  const [currentUser, setCurrentUser] = useState<(UserProfile & { uid: string; role: UserRole; startupId?: string }) | null>(null);
  const [activeLegal, setActiveLegal] = useState<LegalType>(null);
  
  const [currentLang, setCurrentLang] = useState<Language>(() => 
    (localStorage.getItem('preferred_language') as Language) || 'ar'
  );

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
          name: `${userRec.firstName} ${userRec.lastName}`,
          startupDescription: startup?.description || '',
          industry: startup?.industry || '',
        });
        setStage(FiltrationStage.DASHBOARD);
      }
    }
  }, []);

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  const renderPage = () => {
    switch (stage) {
      case FiltrationStage.LANDING:
        return <LandingPage onStart={() => setStage(FiltrationStage.WELCOME)} onRoadmap={() => setStage(FiltrationStage.ROADMAP)} />;
      case FiltrationStage.ROADMAP:
        return <RoadmapPage onStart={() => setStage(FiltrationStage.WELCOME)} onBack={() => setStage(FiltrationStage.LANDING)} />;
      case FiltrationStage.TOOLS:
        return <ToolsPage onBack={() => setStage(FiltrationStage.LANDING)} />;
      case FiltrationStage.ACHIEVEMENTS:
        return <AchievementsPage onBack={() => setStage(FiltrationStage.LANDING)} />;
      case FiltrationStage.INCUBATION_PROGRAM:
        return <IncubationProgram onBack={() => setStage(FiltrationStage.LANDING)} onApply={() => setStage(FiltrationStage.WELCOME)} />;
      case FiltrationStage.MENTORSHIP:
        return <MentorshipPage onBack={() => setStage(FiltrationStage.LANDING)} />;
      case FiltrationStage.PARTNER_CONCEPT:
        return <PartnerConceptPage onBack={() => setStage(FiltrationStage.LANDING)} onRegister={() => setStage(FiltrationStage.WELCOME)} />;
      case FiltrationStage.AI_MENTOR_CONCEPT:
        return <AIMentorConceptPage onBack={() => setStage(FiltrationStage.LANDING)} onStart={() => setStage(FiltrationStage.WELCOME)} />;
      case FiltrationStage.FOREIGN_INVESTMENT:
        return <ForeignInvestmentPage onBack={() => setStage(FiltrationStage.LANDING)} onApply={() => setStage(FiltrationStage.WELCOME)} />;
      case FiltrationStage.MEMBERSHIPS:
        return <MembershipsPage onBack={() => setStage(FiltrationStage.LANDING)} onSelect={() => setStage(FiltrationStage.WELCOME)} />;
      case FiltrationStage.CONTACT:
        return <LegalPortal type="CONTACT" onClose={() => setStage(FiltrationStage.LANDING)} />;
      default:
        return <LandingPage onStart={() => setStage(FiltrationStage.WELCOME)} onRoadmap={() => setStage(FiltrationStage.ROADMAP)} />;
    }
  };

  // 1. Dashboard (Special Sidebar Layout - No Global Header/Footer)
  if (stage === FiltrationStage.DASHBOARD && currentUser) {
    return currentUser.role === 'PARTNER' ? (
      <CoFounderPortal user={currentUser} onBack={() => { storageService.logout(); setCurrentUser(null); setStage(FiltrationStage.LANDING); }} />
    ) : (
      <DashboardHub lang={currentLang} user={currentUser} onLogout={() => { storageService.logout(); setCurrentUser(null); setStage(FiltrationStage.LANDING); }} onNavigateToStage={setStage} />
    );
  }

  // 2. Full Screen Auth States
  if (stage === FiltrationStage.LOGIN) return <Login lang={currentLang} onLoginSuccess={hydrateSession} onBack={() => setStage(FiltrationStage.LANDING)} />;
  if (stage === FiltrationStage.WELCOME) return <Registration lang={currentLang} onRegister={() => hydrateSession()} />;

  // 3. Global Public Layout (Header + Content + Footer)
  return (
    <MainLayout 
      lang={currentLang} 
      onNavigate={setStage} 
      onLogin={() => setStage(FiltrationStage.LOGIN)} 
      onStart={() => setStage(FiltrationStage.WELCOME)}
    >
      {renderPage()}
      <LegalPortal type={activeLegal} onClose={() => setActiveLegal(null)} />
    </MainLayout>
  );
}

export default App;