
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Briefcase,
  ChevronRight,
  Mic,
  MicOff,
  Trophy,
  AlertCircle,
  CheckCircle2,
  Layout,
  User,
  Send,
  Loader2,
  ArrowRight,
  TrendingUp,
  Target,
  FileText,
  Volume2,
  Timer,
  Zap,
  ShieldCheck,
  Brain,
  MessageSquare,
  Sparkles,
  BarChart3,
  Flame,
  Search,
  ChevronLeft,
  Code2
} from 'lucide-react';

type Step = 'INTRO' | 'SETUP' | 'INTERVIEW' | 'REPORT';

const MockInterview: React.FC = () => {
  const [step, setStep] = useState<Step>('INTRO');
  const [loading, setLoading] = useState(false);
  const [setup, setSetup] = useState({
    company: '',
    role: '',
    experience: 'Fresher',
    type: 'Technical'
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [responses, setResponses] = useState<any[]>([]);

  // Mock Questions
  const MOCK_QUESTIONS = {
    Technical: [
      "How would you optimize a high-frequency write-heavy database for a global trading platform?",
      "Explain the CAP theorem and which trade-off you would choose for a social media notification system.",
      "Identify potential memory leaks in a large-scale React application using WebWorkers."
    ],
    Behavioral: [
      "Describe a time you had a significant technical disagreement with a teammate. How was it resolved?",
      "Tell me about a project that failed. What was your post-mortem analysis?",
    ],
    HR: [
      "Why do you want to join our engineering team specifically?",
      "Where do you see your technical authority in 5 years?",
    ]
  };

  const currentQuestions = MOCK_QUESTIONS[setup.type as keyof typeof MOCK_QUESTIONS] || MOCK_QUESTIONS.Technical;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'INTERVIEW' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (step === 'INTERVIEW' && timer === 0 && currentIndex < currentQuestions.length) {
      // Auto-submit or handle timeout
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const startInterview = () => {
    setCurrentIndex(0);
    setTimer(180); // 3 minutes per question
    setResponses([]);
    setStep('INTERVIEW');
  };

  const handleNext = () => {
    setResponses([...responses, { question: currentQuestions[currentIndex], answer: transcript }]);
    setTranscript('');
    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTimer(180);
    } else {
      setStep('REPORT');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-20 px-4 font-sans">
      <AnimatePresence mode="wait">

        {/* ── STEP 1: INTRO PAGE ── */}
        {step === 'INTRO' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-6xl mx-auto"
          >
            <header className="text-center mb-24">
              <div className="inline-flex items-center gap-2 bg-[#7C3AED]/10 text-[#7C3AED] px-6 py-2 rounded-full mb-8 border border-[#7C3AED]/10">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Simulate High-Stakes Interviews</span>
              </div>
              <h1 className="text-6xl sm:text-8xl font-black text-gray-900 mb-8 leading-[0.9] tracking-tighter uppercase italic">
                Master the <br /><span className="text-[#7C3AED]">Hot Seat.</span>
              </h1>
              <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
                Elite interview simulation for engineers. Practice logical defense, technical clarity, and behavioral authority.
              </p>
            </header>

            <div className="grid md:grid-cols-3 gap-8 mb-20">
              {[
                {
                  title: "Technical Round",
                  icon: <Code2 className="w-8 h-8" />,
                  desc: "System design, DSA, and deep execution logic.",
                  color: "from-blue-500 to-indigo-600"
                },
                {
                  title: "Behavioral Round",
                  icon: <User className="w-8 h-8" />,
                  desc: "Leadership principles and conflict resolution protocols.",
                  color: "from-[#7C3AED] to-purple-600"
                },
                {
                  title: "HR Voice Agent",
                  icon: <Mic className="w-8 h-8" />,
                  desc: "Realistic voice-based followup with real-time confidence tracking.",
                  color: "from-pink-500 to-rose-600"
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -10 }}
                  className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50 group relative overflow-hidden"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg`}>
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-4">{item.title}</h3>
                  <p className="text-sm font-medium text-gray-500 leading-relaxed">{item.desc}</p>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity translate-x-1/2 -translate-y-1/2" />
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep('SETUP')}
              className="w-full py-8 bg-[#111827] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.5em] shadow-2xl hover:bg-[#7C3AED] transition-all flex items-center justify-center gap-4"
            >
              Configure Protocol <ChevronRight className="w-6 h-6" />
            </motion.button>
          </motion.div>
        )}

        {/* ── STEP 2: SELECTION ── */}
        {step === 'SETUP' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-2xl">
              <div className="mb-12">
                <button onClick={() => setStep('INTRO')} className="flex items-center gap-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest hover:text-gray-900 mb-8">
                  <ChevronLeft className="w-4 h-4" /> Back to Briefing
                </button>
                <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                  Interview <span className="text-[#7C3AED]">Calibration</span>.
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Target Company</label>
                    <div className="relative">
                      <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                      <input
                        type="text"
                        placeholder="e.g. Google, Stripe..."
                        className="w-full bg-gray-50 border-none rounded-2xl pl-16 pr-6 py-5 font-bold text-gray-800 placeholder:text-gray-300 focus:ring-2 focus:ring-[#7C3AED]/20"
                        value={setup.company}
                        onChange={(e) => setSetup({ ...setup, company: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Target Role</label>
                    <div className="relative">
                      <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                      <input
                        type="text"
                        placeholder="e.g. Staff Engineer..."
                        className="w-full bg-gray-50 border-none rounded-2xl pl-16 pr-6 py-5 font-bold text-gray-800 placeholder:text-gray-300 focus:ring-2 focus:ring-[#7C3AED]/20"
                        value={setup.role}
                        onChange={(e) => setSetup({ ...setup, role: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Experience Level</label>
                    <div className="flex gap-2">
                      {['Fresher', 'Mid', 'Senior'].map(lvl => (
                        <button
                          key={lvl}
                          onClick={() => setSetup({ ...setup, experience: lvl })}
                          className={`flex-1 py-4 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all ${setup.experience === lvl ? 'bg-[#111827] text-white border-[#111827]' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Interview Protocol</label>
                    <div className="grid grid-cols-1 gap-2">
                      {['Technical', 'Behavioral', 'HR'].map(type => (
                        <button
                          key={type}
                          onClick={() => setSetup({ ...setup, type: type })}
                          className={`w-full p-4 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-between group ${setup.type === type ? 'bg-[#7C3AED] text-white border-[#7C3AED]' : 'bg-white border-gray-100 text-gray-400 hover:border-[#7C3AED]/20'}`}
                        >
                          {type} Round
                          <ChevronRight className={`w-4 h-4 transition-transform ${setup.type === type ? 'translate-x-1' : 'opacity-0'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-10 border-t border-gray-50">
                <button
                  disabled={!setup.company || !setup.role}
                  onClick={startInterview}
                  className="w-full py-6 bg-[#111827] text-white rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:bg-[#7C3AED] transition-all flex items-center justify-center gap-4 disabled:opacity-30 disabled:grayscale"
                >
                  Initiate Interview <Zap className="w-5 h-5 text-yellow-400" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── STEP 3: INTERVIEW INTERFACE ── */}
        {step === 'INTERVIEW' && (
          <motion.div
            key="interview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-6xl mx-auto h-[70vh] flex flex-col pt-10"
          >
            <div className="flex justify-between items-center mb-12">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#7C3AED] mb-2 block">{setup.type} Deep Dive</span>
                <p className="text-xl font-black uppercase tracking-tighter text-gray-900">Question {currentIndex + 1} of {currentQuestions.length}</p>
              </div>
              <div className={`flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm font-mono font-bold text-lg ${timer < 30 ? 'text-red-500 animate-pulse' : 'text-[#7C3AED]'}`}>
                <Timer className="w-5 h-5" />
                {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 flex-grow overflow-hidden">
              {/* Question Section */}
              <div className="bg-[#111827] rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden flex flex-col justify-center">
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-[#7C3AED] rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-[#7C3AED]/40">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-8">
                    {currentQuestions[currentIndex]}
                  </h2>
                  <div className="flex items-center gap-4 text-white/40 text-[10px] font-black uppercase tracking-widest border-l-2 border-[#7C3AED] pl-6 italic">
                    "Deliver your logical defense with conviction and technical precision."
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#7C3AED]/20 rounded-full blur-[100px]" />
              </div>

              {/* Interaction Section */}
              <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl flex flex-col relative">
                <div className="flex-grow">
                  <textarea
                    autoFocus
                    placeholder="Construct your response protocol here... Explain trade-offs and clarify your reasoning."
                    className="w-full h-full p-8 bg-gray-50 border-none rounded-3xl outline-none font-medium text-lg text-gray-800 placeholder:text-gray-300 resize-none transition-all focus:bg-white focus:ring-2 focus:ring-[#7C3AED]/10 shadow-inner"
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                  />
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setIsListening(!isListening)}
                    className={`p-6 rounded-2xl border transition-all flex items-center justify-center ${isListening ? 'bg-red-500 border-red-500 text-white animate-pulse' : 'bg-white border-gray-100 text-[#7C3AED] hover:border-[#7C3AED]/20'}`}
                  >
                    {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!transcript.trim()}
                    className="flex-grow py-6 bg-[#111827] text-white rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:bg-[#7C3AED] transition-all flex items-center justify-center gap-4 disabled:opacity-30 disabled:grayscale"
                  >
                    Submit Reasoning <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white px-5 py-2 rounded-full border border-gray-100 shadow-sm whitespace-nowrap">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">End-to-End Analysis Active</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── STEP 4: FEEDBACK REPORT ── */}
        {step === 'REPORT' && (
          <motion.div
            key="report"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-7xl mx-auto space-y-12"
          >
            <div className="flex flex-col lg:flex-row gap-12 items-end">
              <div className="flex-grow">
                <div className="flex items-center gap-2 text-[#7C3AED] mb-6">
                  <Brain className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Interview Audit Complete</span>
                </div>
                <h1 className="text-6xl sm:text-8xl font-black text-gray-900 leading-[0.8] tracking-tighter uppercase italic">
                  Performance <br /> <span className="text-[#7C3AED]">Verdict.</span>
                </h1>
              </div>

              <div className="grid grid-cols-2 gap-8 w-full lg:w-auto">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-lg text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Technical Clarity</p>
                  <p className="text-6xl font-black text-gray-900">88%</p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-lg text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Logical Strength</p>
                  <p className="text-6xl font-black text-[#7C3AED]">92%</p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-[4rem] p-12 border border-gray-100 shadow-sm space-y-12">
                <div className="grid sm:grid-cols-2 gap-12">
                  <div className="space-y-10">
                    <h4 className="text-[10px] font-black text-[#7C3AED] uppercase tracking-[0.5em] border-b border-gray-50 pb-4">Audit Breakdown</h4>
                    {[
                      { label: 'Technical Accuracy', score: 88, color: '#3B82F6' },
                      { label: 'Communication Ease', score: 75, color: '#7C3AED' },
                      { label: 'Confidence Score', score: 94, color: '#10B981' },
                      { label: 'Culture Alignment', score: 82, color: '#F59E0B' }
                    ].map((stat, i) => (
                      <div key={i} className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{stat.label}</span>
                          <span className="text-[10px] font-bold text-gray-500">{stat.score}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.score}%` }}
                            transition={{ duration: 1.5, delay: 0.5 + (i * 0.1) }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: stat.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-8">
                    <div className="bg-red-50/50 p-8 rounded-[2.5rem] border border-red-50 space-y-4">
                      <h5 className="text-[10px] font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                        <Flame className="w-3.5 h-3.5" /> Red Flags Detected
                      </h5>
                      <ul className="space-y-3">
                        <li className="text-[11px] font-medium text-red-800 leading-relaxed">• Brief hesitation on CAP theorem trade-offs.</li>
                        <li className="text-[11px] font-medium text-red-800 leading-relaxed">• Over-optimistic scaling estimation without justification.</li>
                      </ul>
                    </div>
                    <div className="bg-green-50/50 p-8 rounded-[2.5rem] border border-green-50 space-y-4">
                      <h5 className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5" /> Defense Strengths
                      </h5>
                      <p className="text-[11px] font-medium text-green-800 leading-relaxed">
                        Strong logical defense during system design queries. Effectively clarified ambiguities before execution.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm text-center">
                  <TrendingUp className="w-8 h-8 text-indigo-600 mx-auto mb-6" />
                  <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4">Mastery Gap</h4>
                  <p className="text-[11px] text-gray-400 font-medium mb-10 italic">"Focus on explaining latency trade-offs in distributed systems to reach elite readiness."</p>
                  <button
                    onClick={() => setStep('SETUP')}
                    className="w-full py-4 text-[#7C3AED] border-2 border-[#7C3AED] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#7C3AED] hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    Re-Calibrate <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
      <div className="fixed inset-0 bg-grid-black/[0.02] pointer-events-none -z-10" />
    </div>
  );
};

export default MockInterview;
