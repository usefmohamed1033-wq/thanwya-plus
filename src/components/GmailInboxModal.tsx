import React, { useState, useEffect } from 'react';
import {
  Mail,
  X,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Send,
  Star,
  Trash2,
  Inbox,
  Sparkles,
  User,
  GraduationCap
} from 'lucide-react';
import { GmailMessage } from '../types';

interface GmailInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GmailInboxModal: React.FC<GmailInboxModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<GmailMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'exam' | 'teacher' | 'school' | 'general'>('all');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [composeSuccess, setComposeSuccess] = useState(false);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gmail/messages');
      if (res.ok) {
        const data = await res.json();
        if (data.messages && Array.isArray(data.messages)) {
          setMessages(data.messages);
          if (data.messages.length > 0 && !selectedMessage) {
            setSelectedMessage(data.messages[0]);
          }
        }
      }
    } catch (err) {
      console.error('Failed fetching gmail messages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMarkAsRead = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, unread: false } : m))
    );
    if (selectedMessage?.id === id) {
      setSelectedMessage((prev) => (prev ? { ...prev, unread: false } : null));
    }
  };

  const handleSelectMessage = (msg: GmailMessage) => {
    setSelectedMessage(msg);
    handleMarkAsRead(msg.id);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeSubject.trim() || !composeBody.trim()) return;

    // Simulate instant sending to usefmohamed1033@gmail.com
    const newMsg: GmailMessage = {
      id: `sent-${Date.now()}`,
      from: 'أنت <usefmohamed1033@gmail.com>',
      to: 'usefmohamed1033@gmail.com',
      subject: composeSubject.trim(),
      snippet: composeBody.trim().slice(0, 80),
      bodyText: composeBody.trim(),
      date: 'الآن',
      unread: false,
      category: 'general'
    };

    setMessages((prev) => [newMsg, ...prev]);
    setSelectedMessage(newMsg);
    setComposeSuccess(true);
    setTimeout(() => {
      setComposeSuccess(false);
      setIsComposeOpen(false);
      setComposeSubject('');
      setComposeBody('');
    }, 1500);
  };

  const filteredMessages = messages.filter((m) => {
    const matchesCat = activeCategory === 'all' || m.category === activeCategory;
    const matchesSearch =
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.snippet.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const unreadCount = messages.filter((m) => m.unread).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-5xl h-[88vh] max-h-[750px] shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 sm:px-6 py-3.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/20 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                  صندوق بريد Google Gmail
                </h3>
                <span className="text-[11px] font-bold bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full border border-red-300 dark:border-red-800">
                  {unreadCount > 0 ? `${unreadCount} جديدة` : 'مُحدّث'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-mono font-medium truncate max-w-xs sm:max-w-md">
                usefmohamed1033@gmail.com
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchMessages}
              disabled={isLoading}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all"
              title="تحديث الرسائل"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Sidebar List & Message Viewer */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          
          {/* Messages Column */}
          <div className="w-full md:w-5/12 border-b md:border-b-0 md:border-l border-slate-200 dark:border-slate-700 flex flex-col bg-slate-50/50 dark:bg-slate-900/30">
            
            {/* Search & Compose Action */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-700 space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث في الرسائل والإشعارات..."
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pr-9 pl-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                      activeCategory === 'all'
                        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    الكل
                  </button>
                  <button
                    onClick={() => setActiveCategory('exam')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                      activeCategory === 'exam'
                        ? 'bg-red-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    الامتحانات
                  </button>
                  <button
                    onClick={() => setActiveCategory('teacher')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                      activeCategory === 'teacher'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    المعلمين
                  </button>
                </div>

                <button
                  onClick={() => setIsComposeOpen(true)}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[11px] font-bold shadow-xs transition-all shrink-0"
                >
                  <Send className="w-3 h-3" />
                  <span>رسالة</span>
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMessages.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  لا توجد رسائل مطابقة لبحثك
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  const isSelected = selectedMessage?.id === msg.id;
                  return (
                    <div
                      key={msg.id}
                      onClick={() => handleSelectMessage(msg)}
                      className={`p-3.5 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-white dark:bg-slate-800 shadow-sm border-r-4 border-red-500'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5 truncate">
                          {msg.unread && (
                            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                          )}
                          <span className={`text-xs truncate ${msg.unread ? 'font-black text-slate-900 dark:text-white' : 'font-bold text-slate-700 dark:text-slate-300'}`}>
                            {msg.from.split('<')[0]}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {msg.date}
                        </span>
                      </div>

                      <div className={`text-xs line-clamp-1 mb-1 ${msg.unread ? 'font-extrabold text-slate-900 dark:text-white' : 'font-medium text-slate-800 dark:text-slate-200'}`}>
                        {msg.subject}
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {msg.snippet}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* Message Reader Column */}
          <div className="flex-1 flex flex-col bg-white dark:bg-slate-800 overflow-y-auto p-5 sm:p-6 justify-between">
            {isComposeOpen ? (
              <form onSubmit={handleSendEmail} className="space-y-4 max-w-lg mx-auto w-full py-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <Send className="w-4 h-4 text-red-600" />
                    <span>كتابة رسالة بريد إلكتروني جديدة</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsComposeOpen(false)}
                    className="text-xs text-slate-400 hover:text-slate-700"
                  >
                    إلغاء
                  </button>
                </div>

                {composeSuccess && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تم إرسال الرسالة إلى usefmohamed1033@gmail.com بنجاح!</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    إلى (المستلم):
                  </label>
                  <input
                    type="text"
                    disabled
                    value="usefmohamed1033@gmail.com"
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-600 dark:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    موضوع الرسالة:
                  </label>
                  <input
                    type="text"
                    required
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    placeholder="مثال: استفسار حول موعد امتحان الفيزياء التجريبي..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نص الرسالة:
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={composeBody}
                    onChange={(e) => setComposeBody(e.target.value)}
                    placeholder="اكتب رسالتك أو استفسارك هنا..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsComposeOpen(false)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-xs font-bold rounded-xl"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>إرسال عبر Gmail</span>
                  </button>
                </div>
              </form>
            ) : selectedMessage ? (
              <div className="space-y-5">
                
                {/* Header of message */}
                <div className="border-b border-slate-100 dark:border-slate-700 pb-4 space-y-3">
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                    {selectedMessage.subject}
                  </h3>

                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {selectedMessage.from}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          إلى: usefmohamed1033@gmail.com
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono">
                      {selectedMessage.date}
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed space-y-4 py-2 font-medium">
                  <p className="whitespace-pre-line">
                    {selectedMessage.bodyText || selectedMessage.snippet}
                  </p>
                  
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>رسالة موثقة لبريد الطالب عبر منصة ثانوي بلس 2027</span>
                    </div>
                    <p>
                      يمكنك الرد المباشر أو تصدير هذه الملاحظة لجدول المذاكرة ومهام اليوم بنقرة واحدة.
                    </p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center gap-3">
                <Inbox className="w-12 h-12 stroke-1" />
                <span className="text-xs font-bold">اختر رسالة من القائمة لعرضها هنا</span>
              </div>
            )}

            {/* Bottom Footer Info */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-red-500" />
                <span>Google Workspace Gmail Sync Active</span>
              </span>
              <span className="font-mono text-[11px]">usefmohamed1033@gmail.com</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
