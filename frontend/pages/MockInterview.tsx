import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Briefcase,
  ChevronRight,
  MessageSquare,
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
  Volume2
} from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';
import { useAuth } from '../AuthContext';

type Step = 'LANDING' | 'SETUP' | 'INTERVIEW' | 'REPORT';

interface InterviewSession {
  _id: string;
  company: string;
  role: string;
  experience_level: string;
  rounds: any[];
  current_round_index: number;
}

// --- SUB-COMPONENTS (Defined outside to avoid re-mounting & Hook issues) ---

const LandingView = ({ onStart }: { onStart: () => void }) => (
  <div className="max-w-6xl mx-auto pt-16">
    <header className="text-center mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full font-bold text-xs uppercase tracking-widest mb-6"
      >
        <TrendingUp className="w-4 h-4" />
        <span>AI-Powered Readiness</span>
      </motion.div>
      <h1 className="text-6xl sm:text-8xl font-black text-gray-900 mb-8 tracking-tighter leading-[0.85]">
        MOCK <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">INTERVIEWS.</span>
      </h1>
      <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
        The most demanding interview simulation ever built. Target any company, role, or experience level.
      </p>
    </header>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
      {[
        { title: "Technical Rounds", icon: <Layout />, color: "bg-blue-500", desc: "Structured DSA, System Design, and specific tech stack deep dives." },
        { title: "Behavioral Analysis", icon: <User />, color: "bg-purple-500", desc: "STAR method evaluation and cultural alignment with company values." },
        { title: "HR Voice Agent", icon: <Volume2 />, color: "bg-pink-500", desc: "Realistic voice-based followup to assess confidence and clarity." },
      ].map((item, i) => (
        <motion.div
          key={i}
          whileHover={{ y: -10 }}
          className="p-10 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 group"
        >
          <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-${item.color.split('-')[1]}-200`}>
            {item.icon}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
        </motion.div>
      ))}
    </div>

    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onStart}
      className="w-full py-8 bg-gray-900 text-white rounded-[2rem] flex items-center justify-center space-x-4 group overflow-hidden relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="text-xl font-bold uppercase tracking-[0.3em] relative z-10">Start Interview Protocol</span>
      <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
    </motion.button>
  </div>
);

const SetupView = ({ formData, setFormData, onStart, loading }: any) => {
  return (
    <div className="max-w-2xl mx-auto pt-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-gray-100"
      >
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-full font-bold text-[10px] uppercase tracking-widest mb-10">
          <Target className="w-3 h-3 text-indigo-400" />
          <span>Setup Module 01</span>
        </div>

        <h2 className="text-4xl font-bold text-gray-900 mb-10 tracking-tight">Configure your interview parameters.</h2>

        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Target Company</label>
            <div className="relative">
              <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="e.g. Google, Amazon, Startup, etc."
                className="w-full pl-16 pr-6 py-6 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
                value={formData.company}
                onChange={e => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Job Role</label>
            <div className="relative">
              <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="e.g. Fullstack Engineer, Data Scientist"
                className="w-full pl-16 pr-6 py-6 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Experience Level</label>
            <div className="grid grid-cols-3 gap-3">
              {['Fresher', 'Mid', 'Senior'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setFormData({ ...formData, experience_level: lvl })}
                  className={`py-4 rounded-xl font-bold text-sm tracking-tight transition-all ${formData.experience_level === lvl
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                    }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => onStart(formData)}
            disabled={!formData.company || !formData.role || loading}
            className="w-full py-6 mt-6 bg-gray-900 text-white rounded-2xl font-bold uppercase tracking-[0.2em] shadow-xl disabled:opacity-50 hover:bg-black transition-all flex items-center justify-center space-x-3"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Take Interview</span>}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const InterviewView = ({
  session,
  chatHistory,
  loading,
  inputText,
  setInputText,
  isRoundComplete,
  sendQuery,
  nextRound,
  startVoiceCapture,
  isListening,
  isSpeaking,
  speak,
  chatEndRef,
  isCallActive,
  setIsCallActive
}: any) => {
  if (!session) return null;
  const currentRound = session.rounds[session.current_round_index];
  const isVoice = currentRound.round_type === 'hr_voice';

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col pt-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
            {currentRound.persona.name[0]}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{currentRound.persona.name}</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{currentRound.persona.role} @ {session.company}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {session.rounds.map((r: any, i: number) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${i === session.current_round_index ? 'bg-indigo-600 w-6' :
                i < session.current_round_index ? 'bg-green-500' : 'bg-gray-200'
                } transition-all duration-500`}
            />
          ))}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto mb-6 pr-4 space-y-6 custom-scrollbar">
        {chatHistory.map((chat: any, i: number) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i}
            className={`flex ${chat.role === 'candidate' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-6 rounded-[2rem] text-sm leading-relaxed ${chat.role === 'candidate'
              ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg'
              : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none shadow-sm'
              }`}>
              {chat.content}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 p-6 rounded-[2rem] rounded-tl-none shadow-sm">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {isRoundComplete ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 flex items-center justify-between"
        >
          <div>
            <h4 className="font-bold text-indigo-900">Round Completed</h4>
            <p className="text-sm text-indigo-600">The interviewer has all the data they need.</p>
          </div>
          <button
            onClick={nextRound}
            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-indigo-700 transition-all"
          >
            {session.current_round_index === session.rounds.length - 1 ? 'See Final Report' : 'Next Round'}
          </button>
        </motion.div>
      ) : isVoice && !isCallActive ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-grow flex flex-col items-center justify-center space-y-8 bg-indigo-900 rounded-[3rem] text-white p-12 shadow-2xl"
        >
          <div className="w-24 h-24 bg-indigo-500 rounded-full flex items-center justify-center animate-pulse shadow-2xl">
            <Volume2 className="w-12 h-12" />
          </div>
          <div className="text-center">
            <h3 className="text-3xl font-black mb-2 tracking-tight">Incoming HR Call</h3>
            <p className="text-indigo-300 font-medium uppercase tracking-[0.2em] text-xs">Interview Simulation Round 03</p>
          </div>
          <button
            onClick={() => {
              setIsCallActive(true);
              speak(chatHistory[chatHistory.length - 1]?.content || "Hello, I'm ready to start.", true);
            }}
            className="px-12 py-6 bg-emerald-500 text-white rounded-full font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center space-x-4"
          >
            <Mic className="w-6 h-6" />
            <span>Connect to Audio</span>
          </button>
        </motion.div>
      ) : (
        <div className="relative group">
          {isVoice ? (
            <div className="p-8 bg-indigo-900 rounded-[3rem] shadow-2xl flex flex-col items-center">
              <div className="w-32 h-32 bg-indigo-800/50 rounded-full flex items-center justify-center mb-6 relative">
                {(isListening || isSpeaking) && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 bg-indigo-500/20 rounded-full"
                  />
                )}
                <Mic className={`w-12 h-12 ${isListening ? 'text-red-400' : 'text-indigo-200'}`} />
              </div>
              <h4 className="text-white font-bold mb-2 uppercase tracking-widest text-xs">
                {isSpeaking ? "Interviewer is Speaking..." : isListening ? "Listening to You..." : "Call in Progress"}
              </h4>
              <p className="text-indigo-300 text-[10px] mb-8 uppercase tracking-widest font-bold">Hands-free Auto Mode Enabled</p>
              <div className="flex space-x-4">
                <button
                  onClick={startVoiceCapture}
                  disabled={isSpeaking || loading}
                  className="p-6 bg-white rounded-full text-indigo-900 shadow-xl hover:scale-110 transition-transform disabled:opacity-50"
                >
                  {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
                <button
                  onClick={() => speak(chatHistory[chatHistory.length - 1]?.content)}
                  className="p-6 bg-indigo-700 rounded-full text-white shadow-xl hover:scale-110 transition-transform"
                >
                  <Volume2 className="w-6 h-6" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-end space-x-3 bg-white p-2 rounded-[2.5rem] shadow-2xl border border-gray-100">
              <textarea
                placeholder="Type your detailed response here..."
                className="flex-grow p-6 bg-transparent outline-none font-medium resize-none min-h-[100px] max-h-[300px] custom-scrollbar"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendQuery(inputText);
                  }
                }}
              />
              <button
                onClick={() => sendQuery(inputText)}
                disabled={!inputText.trim() || loading}
                className="p-6 bg-gray-900 text-white rounded-[2rem] shadow-xl hover:bg-black transition-all disabled:opacity-50 mb-2 mr-2"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ReportView = ({ report, onRetry }: { report: any, onRetry: () => void }) => {
  if (!report) return null;

  return (
    <div className="max-w-5xl mx-auto pt-10 pb-20">
      <div className="flex items-center justify-between mb-16">
        <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase">Clinical <span className="text-indigo-600">Report.</span></h2>
        <button onClick={() => window.print()} className="flex items-center space-x-2 text-gray-500 hover:text-black">
          <FileText className="w-5 h-5" />
          <span className="font-bold text-xs uppercase tracking-widest">Download PDF</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Technical Readiness", val: report.technical_readiness, icon: <Layout />, color: "text-blue-600" },
          { label: "Behavioral Fit", val: report.behavioral_fit, icon: <User />, color: "text-purple-600" },
          { label: "Communication", val: report.communication_confidence + '%', icon: <Volume2 />, color: "text-pink-600" },
          { label: "Company Readiness", val: report.company_readiness, icon: <Target />, color: "text-emerald-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 flex flex-col items-center text-center">
            <div className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center ${stat.color} mb-6`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <h4 className="text-2xl font-black text-gray-900">{stat.val}</h4>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-50">
            <h3 className="text-xl font-bold mb-8 flex items-center space-x-3">
              <CheckCircle2 className="text-emerald-500" />
              <span>Primary Strengths</span>
            </h3>
            <div className="space-y-4">
              {report.feedback.strengths.map((s: string, i: number) => (
                <div key={i} className="flex items-start space-x-4 p-4 bg-emerald-50 rounded-2xl text-emerald-800 text-sm font-medium">
                  <span className="bg-emerald-200 text-emerald-800 w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0">{i + 1}</span>
                  <p>{s}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-50">
            <h3 className="text-xl font-bold mb-8 flex items-center space-x-3 text-red-600">
              <AlertCircle />
              <span>Areas for Improvement</span>
            </h3>
            <div className="space-y-4">
              {report.feedback.weaknesses.map((w: string, i: number) => (
                <div key={i} className="flex items-start space-x-4 p-4 bg-red-50 rounded-2xl text-red-800 text-sm font-medium">
                  <span className="bg-red-200 text-red-800 w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0">{i + 1}</span>
                  <p>{w}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-900 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px]" />
          <h3 className="text-2xl font-bold mb-10 flex items-center space-x-4">
            <TrendingUp className="text-indigo-400" />
            <span>Personalized Roadmap</span>
          </h3>
          <div className="space-y-8">
            {report.roadmap.map((item: any, i: number) => (
              <div key={i} className="relative pl-10 border-l-2 border-gray-800 group">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600 border-4 border-gray-900 group-hover:scale-125 transition-transform" />
                <div className="mb-2 flex items-center space-x-3">
                  <h5 className="font-bold text-gray-100">{item.topic}</h5>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${item.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-indigo-500/20 text-indigo-400'
                    }`}>
                    {item.priority} Priority
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed font-medium">{item.action}</p>
              </div>
            ))}
          </div>

          <button
            onClick={onRetry}
            className="w-full mt-16 py-6 bg-white text-gray-900 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-gray-100 transition-all flex items-center justify-center space-x-3"
          >
            <Layout className="w-4 h-4" />
            <span>Retry New Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const MockInterview: React.FC = () => {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('LANDING');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const [report, setReport] = useState<any>(null);

  // Setup Form State (Lifted from SetupView)
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    experience_level: 'Fresher'
  });

  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false); // New state for HR Call
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const startInterview = async (setupData: any) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/interview/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.uid || 'guest',
          ...setupData
        })
      });
      const data = await response.json();
      setSession(data);
      setStep('INTERVIEW');
      setIsCallActive(false); // Reset call state

      // Initial message
      await executeQuery('', data._id, 0);
    } catch (error) {
      console.error("Setup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const executeQuery = async (text: string, sId?: string, rIdx?: number) => {
    const activeSession = sId ? { _id: sId } : session;
    const activeRoundIndex = rIdx !== undefined ? rIdx : session?.current_round_index;

    if (!activeSession) return;

    if (text) {
      setChatHistory(prev => [...prev, { role: 'candidate', content: text }]);
    }
    setLoading(true);
    try {
      const endpoint = session?.rounds[activeRoundIndex!].round_type === 'hr_voice'
        ? '/api/interview/voice-analysis'
        : '/api/interview/chat';

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: activeSession._id,
          user_response: text,
          round_index: activeRoundIndex
        })
      });
      const data = await response.json();

      const interviewerText = data.interviewer_text || data.interviewer_response;
      setChatHistory(prev => [...prev, { role: 'interviewer', content: interviewerText }]);

      if (data.is_round_complete || data.is_call_over) {
        setIsRoundComplete(true);
        setIsCallActive(false); // End call if round is complete or call is over
      }

      if (session?.rounds[activeRoundIndex!].round_type === 'hr_voice' && interviewerText) {
        speak(interviewerText, true); // Auto-listen after speaking if it's an HR voice round
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setLoading(false);
      setInputText('');
    }
  };

  const speak = (text: string, autoListen = false) => {
    if (!window.speechSynthesis) {
      console.warn("Speech synthesis not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      // Only auto-listen if it's an HR voice round and the round isn't complete
      if (session?.rounds[session.current_round_index]?.round_type === 'hr_voice' && autoListen && !isRoundComplete) {
        setTimeout(startVoiceCapture, 500); // Small delay for natural feel
      }
    };
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
    };
    utterance.rate = 0.95;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const startVoiceCapture = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition not supported in this browser. Please use Chrome or Edge.");
      return;
    }
    if (isListening) {
      console.log("Already listening.");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US'; // Specify language

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      console.log("Voice recognition started.");
    };
    recognitionRef.current.onend = () => {
      setIsListening(false);
      console.log("Voice recognition ended.");
    };
    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log("Transcript:", transcript);
      setInputText(transcript);
      if (session) executeQuery(transcript);
    };
    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error === 'no-speech') {
        // Optionally, prompt user or try again
        console.warn("No speech detected. Please try speaking again.");
      } else if (event.error === 'not-allowed') {
        alert("Microphone access denied. Please enable it in your browser settings.");
      }
    };

    recognitionRef.current.start();
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/interview/${session?._id}/report`);
      const data = await response.json();
      setReport(data);
      setStep('REPORT');
    } catch (error) {
      console.error("Report error:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextRound = () => {
    if (!session) return;
    const nextIndex = session.current_round_index + 1;
    if (nextIndex < session.rounds.length) {
      setSession({ ...session, current_round_index: nextIndex });
      setChatHistory([]);
      setIsRoundComplete(false);
      setIsCallActive(false); // Reset call state for the new round
      executeQuery('', session._id, nextIndex);
    } else {
      generateReport();
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] px-6 pt-24 pb-20 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <AnimatePresence mode="wait">
        {step === 'LANDING' && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LandingView onStart={() => setStep('SETUP')} />
          </motion.div>
        )}
        {step === 'SETUP' && (
          <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SetupView
              formData={formData}
              setFormData={setFormData}
              onStart={startInterview}
              loading={loading}
            />
          </motion.div>
        )}
        {step === 'INTERVIEW' && (
          <motion.div key="interview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <InterviewView
              session={session}
              chatHistory={chatHistory}
              loading={loading}
              inputText={inputText}
              setInputText={setInputText}
              isRoundComplete={isRoundComplete}
              sendQuery={(txt: string) => executeQuery(txt)}
              nextRound={nextRound}
              startVoiceCapture={startVoiceCapture}
              isListening={isListening}
              isSpeaking={isSpeaking}
              speak={speak}
              chatEndRef={chatEndRef}
              isCallActive={isCallActive}
              setIsCallActive={setIsCallActive}
            />
          </motion.div>
        )}
        {step === 'REPORT' && (
          <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ReportView report={report} onRetry={() => setStep('LANDING')} />
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D1D5DB;
        }
      `}</style>
    </div>
  );
};

export default MockInterview;
