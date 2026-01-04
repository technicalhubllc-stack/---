
import React, { useState, useEffect } from 'react';
import { SupportTicket, TicketType, UserProfile, UserRole } from '../types';
import { storageService } from '../services/storageService';
import { playPositiveSound, playCelebrationSound } from '../services/audioService';

interface SupportHubProps {
  user: UserProfile & { uid: string; startupId?: string };
}

export const SupportHub: React.FC<SupportHubProps> = ({ user }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'INQUIRY' as TicketType,
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const userTickets = storageService.getUserTickets(user.uid);
    setTickets(userTickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, [user.uid]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) return;

    setIsSubmitting(true);
    playPositiveSound();

    setTimeout(() => {
      const newTicket = storageService.createSupportTicket(
        user.uid,
        user.startupId || '',
        formData.type,
        formData.subject,
        formData.message
      );

      setTickets([newTicket, ...tickets]);
      setFormData({ type: 'INQUIRY', subject: '', message: '' });
      setShowForm(false);
      setIsSubmitting(false);
      playCelebrationSound();
    }, 1000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-[10px] font-black border border-amber-200">قيد المراجعة</span>;
      case 'IN_PROGRESS': return <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-black border border-blue-200">جاري المعالجة</span>;
      case 'RESOLVED': return <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black border border-emerald-200">تم الحل ✓</span>;
      default: return null;
    }
  };

  const getTypeStyle = (type: TicketType) => {
    switch (type) {
      case 'INQUIRY': return { icon: '❓', color: 'text-blue-500', bg: 'bg-blue-50', label: 'استفسار' };
      case 'COMPLAINT': return { icon: '⚠️', color: 'text-rose-500', bg: 'bg-rose-50', label: 'شكوى' };
      case 'SUPPORT': return { icon: '🎧', color: 'text-amber-500', bg: 'bg-amber-50', label: 'طلب دعم' };
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-up pb-20">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-100 pb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">مركز الدعم والمؤازرة</h2>
          <p className="text-slate-500 font-medium mt-2">تواصل مع الفريق الإداري والاستشاري لحل التحديات التي تواجه مشروعك.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-3"
        >
          {showForm ? 'إلغاء الطلب' : 'إنشاء تذكرة جديدة +'}
        </button>
      </div>

      {/* New Ticket Form */}
      {showForm && (
        <div className="bg-white p-10 rounded-[3rem] border border-blue-100 shadow-2xl animate-fade-in-up">
           <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">نوع الطلب</label>
                    <div className="grid grid-cols-3 gap-3">
                       {(['INQUIRY', 'COMPLAINT', 'SUPPORT'] as TicketType[]).map(type => (
                         <button 
                          key={type}
                          type="button"
                          onClick={() => setFormData({...formData, type})}
                          className={`py-4 rounded-xl text-xs font-black border-2 transition-all ${formData.type === type ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-slate-50 border-transparent text-slate-400'}`}
                         >
                            {getTypeStyle(type).label}
                         </button>
                       ))}
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">عنوان الموضوع</label>
                    <input 
                      required
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 font-bold"
                      placeholder="مثال: مشكلة في رفع ملفات MVP"
                      value={formData.subject}
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                    />
                 </div>
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">تفاصيل الرسالة</label>
                 <textarea 
                    required
                    className="w-full h-40 p-6 bg-slate-50 border border-slate-200 rounded-[2rem] outline-none focus:border-blue-600 font-medium resize-none shadow-inner"
                    placeholder="اشرح مشكلتك أو استفسارك بوضوح..."
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                 />
              </div>
              <div className="flex justify-end">
                 <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                 >
                    {isSubmitting ? 'جاري الإرسال...' : 'إرسال التذكرة للإدارة'}
                 </button>
              </div>
           </form>
        </div>
      )}

      {/* Tickets List */}
      <div className="space-y-6">
        {tickets.length > 0 ? (
          tickets.map(ticket => {
            const style = getTypeStyle(ticket.type);
            return (
              <div key={ticket.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-blue-200 transition-all group">
                 <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex items-start gap-6">
                       <div className={`w-14 h-14 ${style.bg} ${style.color} rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0 mt-1`}>
                          {style.icon}
                       </div>
                       <div className="space-y-2">
                          <div className="flex items-center gap-3">
                             <h4 className="text-xl font-black text-slate-900">{ticket.subject}</h4>
                             {getStatusBadge(ticket.status)}
                          </div>
                          <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">{ticket.message}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                             تاريخ الطلب: {new Date(ticket.createdAt).toLocaleDateString('ar-EG')} • ID: {ticket.id}
                          </p>
                       </div>
                    </div>
                    <div className="shrink-0 flex items-center">
                       {ticket.reply ? (
                         <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">رد الإدارة:</p>
                            <p className="text-xs font-bold text-slate-700">{ticket.reply}</p>
                         </div>
                       ) : (
                         <p className="text-[10px] font-black text-slate-300 uppercase italic">بانتظار رد الفريق المختص...</p>
                       )}
                    </div>
                 </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 text-center opacity-30 flex flex-col items-center">
             <span className="text-6xl mb-6">💬</span>
             <p className="text-xl font-black text-slate-400">لا توجد طلبات دعم سابقة</p>
             <p className="text-sm font-bold mt-2">عند وجود أي تحدي، فريقنا متاح لخدمتكم ٢٤/٧.</p>
          </div>
        )}
      </div>
    </div>
  );
};
