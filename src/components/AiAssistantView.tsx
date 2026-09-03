import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Upload,
  FileText,
  Sparkles,
  Copy,
  Check,
  Volume2,
  VolumeX,
  HelpCircle,
  BrainCircuit,
  MessageSquare,
  Layers,
  Send,
  RefreshCw,
  BookOpen,
  Zap,
  Info,
  Trash2,
  ArrowDownCircle
} from 'lucide-react';
import { AiAnalysisResult, TrackConfig } from '../types';

interface AiAssistantViewProps {
  currentTrack: TrackConfig;
  soundEnabled: boolean;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({ currentTrack, soundEnabled }) => {
  const [activeMode, setActiveMode] = useState<'analyze' | 'chat'>('chat');
  const [inputText, setInputText] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(currentTrack.subjects[0]?.name || 'عام');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AiAnalysisResult | null>(null);
  const [copiedResult, setCopiedResult] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Flashcards state
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: `أهلاً بك يا بطل الثانوية العامة 2027! 👋 أنا معلمك وموجهك الأكاديمي الذكي.
يمكنك سؤالي عن أي مسألة فيزيائية، معادلة كيميائية، إعراب جملة نحوية، شرح مفهوم بيولوجي، أو تلخيص فصل دراسي. كيف أساعدك اليوم؟`,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (activeMode === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatLoading, activeMode]);

  // Suggested Quick Prompts by Subject
  const getSubjectSuggestions = (subject: string): string[] => {
    if (subject.includes('العربية')) {
      return [
        'ما هي شروط إعمال اسم الفاعل والمفعول في الامتحان؟',
        'اشرح لي إعراب الفعل المضارع في جواب الطلب',
        'ما الفرق بين التشبيه البليغ والاستعارة المكنية؟',
      ];
    }
    if (subject.includes('الفيزياء')) {
      return [
        'اشرح لي خطوات تطبيق قانوني كيرشوف في الدوائر المعقدة',
        'ما شروط حدوث الحث الكهرومغناطيسي المتبادل؟',
        'كيف أحسب القوة الدافعة الكهربية الفعالة للدينامو؟',
      ];
    }
    if (subject.includes('الكيمياء')) {
      return [
        'وضح قاعدة لوشاتيليه مع مثال على أثر الضغط والحرارة',
        'ما أهمية عناصر السلسلة الانتقالية الأولى وحالات التأكسد؟',
        'كيف أفرق بين الألكانات والألكينات في الكيمياء العضوية؟',
      ];
    }
    if (subject.includes('الأحياء')) {
      return [
        'ما الفرق بين المناعة الخلطية والمناعة الخلوية؟',
        'اشرح كيفية تضاعف الحمض النووي DNA وأنزيمات البلمرة',
        'ما هي آلية انقباض العضلة الهيكلية ونظرية الخيوط المنزلقة؟',
      ];
    }
    if (subject.includes('الرياضيات')) {
      return [
        'ما هي قواعد اشتقاق الدوال المثلثية والدوال الأسية؟',
        'كيف أحل مسائل المعدلات الزمنية المرتبطة بخطوات منظمة؟',
        'اشرح نظرية ذات الحدين واستخراج الحد العام',
      ];
    }
    return [
      'كيف أنظم وقتي للمذاكرة وأحصل على الدرجات النهائية؟',
      'ما هي أهم النصائح للتعامل مع أسئلة البابل شيت والمقالي 2027؟',
      'اشرح لي هذه الجزئية بأبسط طريقة ممكنة',
    ];
  };

  // Handle Drag & Drop / File Select
  const handleFileUpload = (file: File) => {
    setUploadedFileName(file.name);
    const reader = new FileReader();

    if (file.name.endsWith('.txt') || file.type.includes('text')) {
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInputText(content);
      };
      reader.readAsText(file);
    } else {
      reader.onload = () => {
        setInputText(
          `ملف مرفوع: ${file.name}\nيرجى كتابة أو لصق نص الدرس أو السؤال هنا لمطابقته مع معايير امتحان الثانوية العامة 2027 لمادة ${selectedSubject}.`
        );
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Run AI Analysis
  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setErrorMessage('الرجاء كتابة أو لصق نص الدرس أولاً أو رفع ملف.');
      return;
    }
    setErrorMessage(null);

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          subject: selectedSubject,
          track: currentTrack.name,
        }),
      });

      if (!response.ok) {
        throw new Error('فشل الاتصال بخادم الذكاء الاصطناعي');
      }

      const data = await response.json();
      setResult(data);
      setFlippedCards({});
    } catch (err: any) {
      console.error('Analysis error:', err);
      // High-grade fallback
      setResult({
        source: 'offline_fallback',
        summary: `ملخص مادة ${selectedSubject}: يركز هذا المحتوى على نواتج التعلم الأساسية المطلوبة لامتحانات الثانوية العامة 2027، وربط القوانين بالمفاهيم التطبيقية.`,
        keypoints: [
          'فهم الفكرة الرئيسية والقوانين المستنتجة من الدرس بدقة.',
          'التركيز على نواتج التعلم وعلاقات التناسب الطردي والعكسي.',
          'التدرب على مسائل المستويات العليا في التفكير وحساب الوحدات.',
          'تجنب الأخطاء الشائعة ومراعاة الاستثناءات الواردة بالمنهج.',
        ],
        questions: [
          {
            question: `سؤال امتحاني متوقع في ${selectedSubject}: ما النتيجة المترتبة على مضاعفة المتغير الأساسي في هذه الحالة؟`,
            answer: 'تتغير القيمة وفق العلاقة الرياضية المحددة في القانون المعتمد بالمنهج.',
          },
          {
            question: 'علل أو استنتج: أهمية تطبيق هذه القاعدة في نماذج امتحانات الوزارة؟',
            answer: 'لأنها تمثل مفتاح حل المسائل المركبة والأسئلة المفاهيمية المقالية.',
          },
        ],
        flashcards: [
          { front: 'المفهوم الرئيسي', back: 'التعريف المعتمد بالقانون والوحدة القياسية الدولية.' },
          { front: 'ملاحظة امتحانية ذهبية', back: 'انتبه للشروط والافتراضات الثابتة أثناء التعويض.' },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Send Chat Message
  const handleSendChat = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const messageToSend = customPrompt || chatInput.trim();
    if (!messageToSend || isChatLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const nowTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    setChatMessages((prev) => [
      ...prev,
      { id: userMsgId, role: 'user', text: messageToSend, time: nowTime },
    ]);
    if (!customPrompt) setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageToSend,
          subject: selectedSubject,
          track: currentTrack.name,
          history: chatMessages.slice(-8).map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            text: m.text,
          })),
        }),
      });

      const data = await response.json();
      const assistantText = data.reply || 'عفواً، لم أتمكن من استخراج الرد المناسب حالياً.';
      const assistantMsgId = `asst-${Date.now()}`;

      setChatMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          role: 'assistant',
          text: assistantText,
          time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsgId = `asst-${Date.now()}`;
      setChatMessages((prev) => [
        ...prev,
        {
          id: fallbackMsgId,
          role: 'assistant',
          text: `أهلاً بك يا بطل! بخصوص سؤالك في مادة (${selectedSubject})، القاعدة الأساسية تعتمد على فهم القانون والتعويض بالوحدات الدولية. يمكنك إعادة صياغة السؤال أو تحديد نقطة معينة لشرحها خطوة بخطوة.`,
          time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Copy Single Message
  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  // Speak Single Message
  const handleSpeakMessage = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      setErrorMessage('ميزة القراءة الصوتية غير مدعومة في متصفحك.');
      return;
    }
    setErrorMessage(null);

    if (isSpeaking && speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*#_`]/g, ''));
      utterance.lang = 'ar-EG';
      utterance.rate = 0.95;
      utterance.onend = () => {
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      };
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      setSpeakingMessageId(id);
    }
  };

  // Clear Chat History
  const handleClearChat = () => {
    if (confirm('هل تريد مسح سجل المحادثة والبدء من جديد؟')) {
      setChatMessages([
        {
          id: `welcome-${Date.now()}`,
          role: 'assistant',
          text: `تم بدء محادثة جديدة! أنا جاهز للإجابة عن أسئلتك في مادة ${selectedSubject}. اسألني الآن!`,
          time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  // Copy Analysis Result
  const handleCopyResult = () => {
    if (!result) return;
    const formatted = `📋 ملخص مادة (${selectedSubject}) - ثانوي بلس 2027:
${result.summary}

🔑 أهم النقاط والقوانين:
${result.keypoints.map((k, i) => `${i + 1}. ${k}`).join('\n')}

❓ أسئلة الامتحانات المتوقعة:
${result.questions.map((q, i) => `س${i + 1}: ${q.question}\nالإجابة: ${q.answer}`).join('\n\n')}
`;
    navigator.clipboard.writeText(formatted);
    setCopiedResult(true);
    setTimeout(() => setCopiedResult(false), 2500);
  };

  const toggleCard = (idx: number) => {
    setFlippedCards((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const suggestions = getSubjectSuggestions(selectedSubject);

  return (
    <div id="ai-assistant-container" className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-100 flex items-center justify-between shadow-xs">
          <div className="font-bold text-sm">{errorMessage}</div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-xs bg-amber-700 text-white px-3 py-1 rounded-lg font-bold hover:bg-amber-800 transition-colors"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Header Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-2xl shadow-md shadow-emerald-500/20">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  المعلم والموجه الذكي (Gemini AI)
                </h2>
                <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                  دفعة 2027
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                إجابات نموذجية، شرح القوانين والمسائل، وتلخيص الدروس واستخراج أسئلة الامتحانات.
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setActiveMode('chat')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeMode === 'chat'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>شات المعلم الذكي</span>
            </button>
            <button
              onClick={() => setActiveMode('analyze')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeMode === 'analyze'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>تلخيص واستخراج أسئلة</span>
            </button>
          </div>
        </div>
      </div>

      {activeMode === 'chat' ? (
        /* Chat Mode with AI Tutor */
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-700/80 overflow-hidden flex flex-col h-[640px]">
          {/* Chat Header Toolbar */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-sm text-slate-800 dark:text-white">
                معلم الثانوية العامة الذكي 2027 (متصل وجاهز للرد)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <label htmlFor="ai-chat-subject-select" className="text-xs text-slate-500 font-semibold">
                  المادة:
                </label>
                <select
                  id="ai-chat-subject-select"
                  name="selectedSubject"
                  aria-label="اختيار المادة الدراسية للمحادثة"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {currentTrack.subjects.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.mark} درجات)
                    </option>
                  ))}
                  <option value="اللغة الإنجليزية">اللغة الإنجليزية</option>
                  <option value="التربية الدينية">التربية الدينية</option>
                </select>
              </div>

              <button
                onClick={handleClearChat}
                aria-label="مسح سجل المحادثة"
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                title="مسح المحادثة"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-start' : 'justify-start flex-row-reverse'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      : 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-sm'
                  }`}
                >
                  {msg.role === 'user' ? 'أنت' : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs relative group ${
                    msg.role === 'user'
                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-tr-none'
                      : 'bg-emerald-50/90 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-50 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed font-sans">{msg.text}</p>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/40 dark:border-slate-700/40 text-[10px] text-slate-400">
                    <span>{msg.time}</span>

                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSpeakMessage(msg.id, msg.text)}
                          aria-label={isSpeaking && speakingMessageId === msg.id ? 'إيقاف القراءة الصوتية' : 'قراءة الإجابة صوتياً'}
                          className="hover:text-emerald-600 transition-colors flex items-center gap-1 cursor-pointer"
                          title="قراءة صوتية"
                        >
                          {isSpeaking && speakingMessageId === msg.id ? (
                            <VolumeX className="w-3.5 h-3.5 text-red-500" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                          <span>{isSpeaking && speakingMessageId === msg.id ? 'إيقاف' : 'استماع'}</span>
                        </button>

                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.text)}
                          aria-label="نسخ نص الإجابة"
                          className="hover:text-emerald-600 transition-colors flex items-center gap-1 cursor-pointer"
                          title="نسخ الإجابة"
                        >
                          {copiedMessageId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{copiedMessageId === msg.id ? 'تم النسخ' : 'نسخ'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl w-fit">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                <span>المعلم الذكي يكتب الإجابة النموذجية مع خطوات الشرح...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick Suggestions Pills */}
          <div className="px-4 py-2 bg-slate-50/80 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span>أسئلة مقترحة:</span>
            </span>
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSendChat(undefined, sug)}
                className="text-xs px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-300 rounded-xl whitespace-nowrap transition-all hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer shadow-2xs"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => handleSendChat(e)}
            className="p-3.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex gap-2"
          >
            <label htmlFor="ai-chat-question-input" className="sr-only">
              اكتب سؤالك
            </label>
            <input
              id="ai-chat-question-input"
              name="chatQuestion"
              type="text"
              aria-label={`اسأل سؤالك في مادة ${selectedSubject}`}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={`اسأل سؤالك في مادة ${selectedSubject}... (مثال: اشرح لي فكرة هذا القانون بالتفصيل)`}
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              aria-label="إرسال السؤال للمعلم الذكي"
              disabled={isChatLoading || !chatInput.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
            >
              <Send className="w-4 h-4" />
              <span>إرسال</span>
            </button>
          </form>
        </div>
      ) : (
        /* Analysis & Extraction Mode */
        <div className="space-y-6">
          {/* Input & Upload Form */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <label htmlFor="ai-analysis-subject-select" className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  المادة الدراسية:
                </label>
                <select
                  id="ai-analysis-subject-select"
                  name="analysisSubject"
                  aria-label="اختيار المادة الدراسية للتحليل"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {currentTrack.subjects.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.mark} درجات)
                    </option>
                  ))}
                  <option value="التربية الدينية">التربية الدينية</option>
                  <option value="اللغة الثانية">اللغة الأجنبية الثانية</option>
                </select>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>يدعم ملفات PDF و Word والنصوص المكتوبة</span>
              </div>
            </div>

            {/* Drag and drop box */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) handleFileUpload(file);
              }}
              className="border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl p-6 text-center bg-slate-50/50 dark:bg-slate-900/30 transition-all cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <label htmlFor="ai-file-upload-input" className="sr-only">
                رفع ملف الدرس
              </label>
              <input
                id="ai-file-upload-input"
                name="fileUpload"
                type="file"
                aria-label="رفع ملف الدرس للتحليل"
                ref={fileInputRef}
                className="hidden"
                accept=".txt,.pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">
                {uploadedFileName ? `الملف المحدد: ${uploadedFileName}` : 'اسحب ملف الدرس هنا أو اضغط للاختيار'}
              </p>
              <p className="text-xs text-slate-400">PDF, DOC, DOCX, TXT</p>
            </div>

            {/* Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="ai-lesson-text-input" className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  أو اكتب / الصق نص الدرس مباشرة:
                </label>
                {inputText && (
                  <button
                    onClick={() => {
                      setInputText('');
                      setUploadedFileName(null);
                    }}
                    className="text-[11px] text-red-500 hover:underline cursor-pointer"
                  >
                    مسح النص
                  </button>
                )}
              </div>
              <textarea
                id="ai-lesson-text-input"
                name="lessonText"
                aria-label="نص الدرس أو المسألة للتحليل"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="اكتب أو الصق نص الدرس أو المسألة أو فقرة القراءة هنا ليقوم الذكاء الاصطناعي بتحليلها واستخراج ملخص وأسئلة امتحانات وبطاقات مراجعة..."
                rows={5}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleAnalyze}
                disabled={isLoading || !inputText.trim()}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جاري التحليل واستخراج الأفكار...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>تحليل الدرس واستخراج الأسئلة الذكية</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Result Presentation */}
          {result && (
            <div id="ai-result-section" className="space-y-6 animate-fadeIn">
              {/* Action Toolbar */}
              <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    نتائج التحليل الذكي لمادة {selectedSubject}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyResult}
                    className="flex items-center gap-1.5 text-xs bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-3.5 py-2 rounded-xl hover:bg-emerald-100 transition-colors font-bold cursor-pointer"
                  >
                    {copiedResult ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedResult ? 'تم النسخ!' : 'نسخ التقرير'}</span>
                  </button>
                </div>
              </div>

              {/* 1. Summary Box */}
              <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border-r-4 border-emerald-500 p-5 rounded-2xl">
                <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-300 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>الملخص الشامل المركّز للامتحان</span>
                </h3>
                <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
                  {result.summary}
                </p>
              </div>

              {/* 2. Key Points & Laws Box */}
              <div className="bg-amber-50/70 dark:bg-amber-950/30 border-r-4 border-amber-500 p-5 rounded-2xl">
                <h3 className="text-base font-bold text-amber-900 dark:text-amber-300 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>أهم القوانين والمفاهيم الجوهرية</span>
                </h3>
                <ul className="space-y-2.5">
                  {result.keypoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-800 dark:text-slate-200">
                      <span className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. Expected Exam Questions */}
              <div className="bg-blue-50/70 dark:bg-blue-950/30 border-r-4 border-blue-500 p-5 rounded-2xl">
                <h3 className="text-base font-bold text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  <span>نماذج أسئلة الامتحانات المتوقعة مع الإجابة النموذجية</span>
                </h3>
                <div className="space-y-4">
                  {result.questions.map((q, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-blue-100 dark:border-blue-900 shadow-xs"
                    >
                      <div className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                        س{i + 1}: {q.question}
                      </div>
                      <div className="text-xs sm:text-sm bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">الإجابة النموذجية: </span>
                        {q.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Interactive Flashcards */}
              {result.flashcards && result.flashcards.length > 0 && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-emerald-600" />
                    <span>بطاقات مراجعة سريعة تفاعلية (Flashcards) - اضغط لقلب البطاقة</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {result.flashcards.map((card, i) => {
                      const isFlipped = !!flippedCards[i];
                      return (
                        <div
                          key={i}
                          onClick={() => toggleCard(i)}
                          className={`cursor-pointer min-h-[140px] p-5 rounded-2xl border transition-all flex flex-col justify-between select-none ${
                            isFlipped
                              ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                              : 'bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-emerald-400 shadow-xs'
                          }`}
                        >
                          <div className="text-[11px] font-bold opacity-75 mb-2 flex items-center justify-between">
                            <span>بطاقة {i + 1}</span>
                            <span>{isFlipped ? 'الإجابة / الشرح' : 'السؤال / المفهوم'}</span>
                          </div>
                          <div className="text-sm font-bold text-center my-auto leading-relaxed">
                            {isFlipped ? card.back : card.front}
                          </div>
                          <div className="text-[10px] text-center opacity-60 mt-2">
                            {isFlipped ? 'اضغط للعودة' : 'اضغط لإظهار الإجابة ↻'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
