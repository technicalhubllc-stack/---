
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { UserProfile, UserRole } from '../types';
import { playPositiveSound, playErrorSound, playCelebrationSound } from '../services/audioService';
import { Language, getTranslation } from '../services/i18nService';

interface LoginProps {
  onLoginSuccess: (user: UserProfile & { role: UserRole; uid: string; startupId?: string }) => void;
  onBack: () => void;
  lang: Language;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onBack, lang }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('STARTUP');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const t = getTranslation(lang);

  useEffect(() => {
    storageService.seedDemoAccounts();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError(lang === 'ar' ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter your email');
      return;
    }
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      const result = storageService.loginUser(email);
      if (result) {
        const profile: any = {
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          phone: result.user.phone,
          uid: result.user.uid,
          role: result.user.role || selectedRole,
          startupName: result.startup?.name || '',
          startupId: result.startup?.projectId,
          name: `${result.user.firstName} ${result.user.lastName}`,
          agreedToTerms: true,
          agreedToContract: true
        };
        playPositiveSound();
        onLoginSuccess(profile);
      } else {
        setError(t.auth.error_not_found);
        playErrorSound();
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6" dir={t.dir}>
      <div className="max-w-md w-full space-y-12 animate-fade-in">
        <div className="text-center space-y-4">
           <div className="w-12 h-12 bg-slate-900 flex items-center justify-center text-white font-bold mx-auto">BD</div>
           <h2 className="text-3xl font-extrabold text-slate-900">{t.auth.login_title}</h2>
           <p className="text-slate-400 font-medium text-sm">{t.auth.login_sub}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="space-y-4">
              <div className="space-y-1">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pr-1">البريد الرسمي</label>
                 <input 
                   type="email" 
                   required
                   className="w-full p-4 bg-slate-50 border border-slate-200 rounded-none focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-slate-900"
                   placeholder="name@startup.ai"
                   value={email}
                   onChange={e => setEmail(e.target.value)}
                 />
              </div>
              <div className="space-y-1">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pr-1">كلمة المرور</label>
                 <input 
                   type="password" 
                   className="w-full p-4 bg-slate-50 border border-slate-200 rounded-none focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-slate-900"
                   placeholder="••••••••"
                   value={password}
                   onChange={e => setPassword(e.target.value)}
                 />
              </div>
           </div>

           {error && <div className="text-rose-600 text-xs font-bold text-center">⚠️ {error}</div>}

           <button 
             type="submit" 
             disabled={isLoading}
             className="w-full py-4 bg-blue-600 text-white font-bold text-sm tracking-widest uppercase transition-all disabled:opacity-50"
           >
             {isLoading ? 'جاري التحقق...' : 'دخول المركز'}
           </button>

           <div className="pt-4 border-t border-slate-100 flex flex-col items-center gap-4">
             <button type="button" onClick={onBack} className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">العودة للرئيسية</button>
             <p className="text-[8px] text-slate-300 font-bold uppercase tracking-[0.2em]">Security Protocol v2.4 Enabled</p>
           </div>
        </form>
      </div>
    </div>
  );
};
