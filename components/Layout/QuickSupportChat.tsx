import React, { useState, useRef, useEffect } from 'react';
import { getQuickSupportResponseAI } from '../../services/geminiService';
import { playPositiveSound } from '../../services/audioService';

export const QuickSupportChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    playPositiveSound();

    try {
      const aiResponse = await getQuickSupportResponseAI(userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse || "عذراً، لم أستطع فهم ذلك." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "عذراً، حدث خطأ تقني. يرجى المحاولة لاحقاً." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-[200]" dir="rtl">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 left-0 w-[380px] bg-white radius-16 shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-fade-in-up origin-bottom-left">
          <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg">AI</div>
                <div>
                   <p className="text-sm font-black leading-none">مساعد بيزنس ديفلوبرز</p>
                   <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mt-1">Smart Virtual Assistant</p>
                </div>
             </div>
             <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">✕</button>
          </div>

          <div ref={scrollRef} className="flex-1 h-[400px] overflow-y-auto p-6 space-y-6 bg-slate-50/50">
             {messages.length === 0 && (
               <div className="text-center py-10 space-y-4">
                  <span className="text-4xl">👋</span>
                  <p className="text-sm font-bold text-slate-700">مرحباً بك! كيف يمكنني مساعدتك اليوم في رحلتك الريادية؟</p>
               </div>
             )}
             {messages.map((m, i) => (
               <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] p-4 text-sm font-medium leading-relaxed
                    ${m.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-2xl rounded-br-none' 
                      : 'bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-bl-none shadow-sm'}
                  `}>
                    {m.text}
                  </div>
               </div>
             ))}
             {loading && (
               <div className="flex justify-end">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-x-2 space-x-reverse flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-200"></div>
                  </div>
               </div>
             )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
             <div className="relative group">
                <input 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 radius-14 outline-none focus:border-blue-600 focus:bg-white transition-all text-sm font-bold shadow-inner"
                  placeholder="اسأل عن برنامج الاحتضان..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="absolute left-2 top-2 bottom-2 aspect-square bg-blue-600 text-white radius-14 flex items-center justify-center hover:bg-blue-700 transition-all disabled:opacity-30"
                >
                  <svg className="w-4 h-4 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => { setIsOpen(!isOpen); playPositiveSound(); }}
        className={`w-16 h-16 bg-slate-900 text-white rounded-[2.2rem] shadow-2xl flex items-center justify-center transition-all duration-500 hover:scale-105 active:scale-95 border-4 border-white ${isOpen ? 'rotate-90 bg-blue-600' : ''}`}
      >
        {isOpen ? (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <div className="relative">
             <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
          </div>
        )}
      </button>
    </div>
  );
};