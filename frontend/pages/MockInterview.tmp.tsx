import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Code2,
    Mic,
    User,
    Sparkles,
    ArrowRight,
    CheckCircle2,
    Loader2,
    Send,
    AlertCircle,
    MicOff,
    Briefcase,
    Clock,
    ChevronRight,
    TrendingUp,
    Brain,
    Award
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
type Step = 'INTRO' | 'SETUP' | 'INTERVIEW' | 'REPORT';
type RoundIndex = 0 | 1 | 2;

interface ChatMessage {
    role: 'interviewer' | 'user';
    content: string;
    timestamp: string;
}

interface InterviewReport {
    overall_score: number;
    sections: {
        label: string;
        score: number;
        feedback: string;
    }[];
    strengths: string[];
    weaknesses: string[];
    verdict: string;
}

// ── Dummy Data ─────────────────────────────────────────────────────────────
const DUMMY_QUESTIONS = [
    [
        "How does the Java JVM manage memory, and what is the role of the Garbage Collector?",
        "Explain the difference between a SQL JOIN and a subquery in terms of performance.",
        "What are decorators in Python, and how would you implement an authentication decorator?",
        "Describe the 'vanishing gradient problem' in Deep Learning and one way to fix it.",
        "How do you ensure data consistency in a distributed microservices architecture?"
    ],
    [
        "Tell me about a time you had a conflict with a teammate. How did you resolve it?",
        "Describe a project you are most proud of. What was your specific contribution?",
        "How do you handle tight deadlines when multiple tasks are high priority?",
        "Tell me about a time you failed. What did you learn from that experience?",
        "Where do you see yourself professionally in the next three to five years?"
    ],
    [
        "Tell me about yourself and your background.",
        "What are your greatest strengths and weaknesses?",
        "Where do you see yourself in five years?",
        "Why do you want to work at our company?",
        "Describe a challenging situation and how you handled it.",
        "What motivates you to perform your best at work?",
        "How do you handle stress and pressure on the job?",
        "Do you have any questions for me?"
    ]
];

const DUMMY_REPORT: InterviewReport = {
    overall_score: 84,
    sections: [
        { label: 'Technical Depth', score: 88, feedback: 'Strong grasp of core Java fundamentals and system design. Needs slight polish on SQL optimization.' },
        { label: 'Problem Solving', score: 82, feedback: 'Logical approach to DSA. Explained time complexity clearly during the simulation.' },
        { label: 'Communication', score: 85, feedback: 'Very articulate. Handled the behavioral scenarios with mature and professional responses.' },
        { label: 'HR Final Call', score: 80, feedback: 'Professional attitude. Clearly communicated career goals and salary expectations.' }
    ],
    strengths: [
        'Backend System Design (Scalability Focus)',
        'JVM Internals & Memory Management',
        'Professional & Articulate Communication'
    ],
    weaknesses: [
        'Deep Learning Edge Cases',
        'Advanced SQL Query Tuning'
    ],
    verdict: 'Recommended for Hire (Level 2 Engineer)'
};

export default function MockInterview() {
    const [step, setStep] = useState<Step>('INTRO');
    const [setup, setSetup] = useState({ company: '', role: '', experience: 'Entry Level' });
    const [roundIndex, setRoundIndex] = useState<RoundIndex>(0);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [voiceTranscript, setVoiceTranscript] = useState('');
    const [report, setReport] = useState<InterviewReport | null>(null);
    const [loadingReport, setLoadingReport] = useState(false);
    const [hrCallOver, setHrCallOver] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    // ── General ────────────────────────────────────────────────────────────────
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // ── Dummy / offline mode ───────────────────────────────────────────────────
    const isDummyRef = useRef(false);
    const dummyQIdxRef = useRef(0);
    const [isDummyMode, setIsDummyMode] = useState(false);
    const [currentQNum, setCurrentQNum] = useState(0);
    const [blink, setBlink] = useState(false);
    const [mouthOpen, setMouthOpen] = useState(false);
    const mouthIntervalRef = useRef<any>(null);

    useEffect(() => { window.scrollTo(0, 0); }, [step]);
    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    // ── Blinking logic for Sophia ─────────────────────────────────────────────
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 150);
        }, 3000);
        return () => clearInterval(blinkInterval);
    }, []);

    // ── Mouth movement logic for Sophia ───────────────────────────────────────
    useEffect(() => {
        if (isSpeaking) {
            mouthIntervalRef.current = setInterval(() => {
                setMouthOpen(m => !m);
            }, 180);
        } else {
            clearInterval(mouthIntervalRef.current);
            setMouthOpen(false);
        }
        return () => clearInterval(mouthIntervalRef.current);
    }, [isSpeaking]);

    // ── Speech Recognition logic ──────────────────────────────────────────────
    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).webkitSpeechRecognition) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                if (transcript.trim()) {
                    setVoiceTranscript(transcript);
                }
            };

            recognitionRef.current.onend = () => {
                // Keep listening if we haven't manually stopped it is often preferred in some UI, 
                // but for this flow we stop manually or it stops on silence if continuous is false.
                // With continuous true, it stays on until stop().
            };
        }
    }, []);

    // ── Step 1: Setup → call /api/interview/setup ──────────────────────────────
    const startInterview = async () => {
        if (!setup.company.trim() || !setup.role.trim()) return;
        setLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:8000/api/interview/setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(setup)
            });

            if (!res.ok) throw new Error('Backend offline');

            const data = await res.json();
            setSessionId(data.session_id);
            setStep('INTERVIEW');
            setRoundIndex(0);
            setCurrentQNum(1);

            const firstQ = data.first_question || DUMMY_QUESTIONS[0][0];
            setMessages([{
                role: 'interviewer',
                content: firstQ,
                timestamp: new Date().toLocaleTimeString()
            }]);
            speak(firstQ);
        } catch (err) {
            console.warn('Entering dummy mode.');
            setIsDummyMode(true);
            isDummyRef.current = true;
            setStep('INTERVIEW');
            setRoundIndex(0);
            setCurrentQNum(1);
            const welcomeMsg = `[MOCK MODE] Welcome. Let's start. ${DUMMY_QUESTIONS[0][0]}`;
            setMessages([{
                role: 'interviewer',
                content: welcomeMsg,
                timestamp: new Date().toLocaleTimeString()
            }]);
            speak(DUMMY_QUESTIONS[0][0]);
        } finally {
            setLoading(false);
        }
    };

    // ── Step 2: Messaging Logic (Rounds 0, 1) ──────────────────────────────────
    const handleSendChat = async () => {
        if (!userInput.trim() || isSending || isSpeaking) return;

        const userMsg: ChatMessage = {
            role: 'user',
            content: userInput,
            timestamp: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev, userMsg]);
        setUserInput('');
        setIsSending(true);

        try {
            if (isDummyMode) {
                setTimeout(() => {
                    dummyQIdxRef.current++;
                    if (dummyQIdxRef.current >= DUMMY_QUESTIONS[roundIndex].length) {
                        advanceRound();
                    } else {
                        const nextQ = DUMMY_QUESTIONS[roundIndex][dummyQIdxRef.current];
                        setMessages(prev => [...prev, { role: 'interviewer', content: nextQ, timestamp: new Date().toLocaleTimeString() }]);
                        setCurrentQNum(dummyQIdxRef.current + 1);
                        speak(nextQ);
                    }
                    setIsSending(false);
                }, 1000);
                return;
            }

            const res = await fetch('http://localhost:8000/api/interview/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session_id: sessionId,
                    user_response: userInput,
                    round_index: roundIndex
                })
            });

            const data = await res.json();
            if (data.is_round_complete) {
                advanceRound();
            } else {
                setMessages(prev => [...prev, { role: 'interviewer', content: data.interviewer_text, timestamp: new Date().toLocaleTimeString() }]);
                setCurrentQNum(prev => prev + 1);
                speak(data.interviewer_text);
            }
        } catch (err) {
            setError('Communication error.');
            advanceRound();
        } finally {
            setIsSending(false);
        }
    };

    // ── Round Management ────────────────────────────────────────────────────────
    const advanceRound = () => {
        if (roundIndex === 0) {
            setRoundIndex(1);
            dummyQIdxRef.current = 0;
            setCurrentQNum(1);
            const startMsg = "Excellent technical grounding. Let's shift focus to behavioural and situational questions.";
            setMessages(prev => [...prev, { role: 'interviewer', content: startMsg, timestamp: new Date().toLocaleTimeString() }]);
            speak(startMsg);
        } else if (roundIndex === 1) {
            setRoundIndex(2);
            setMessages([]);
            startHrVoiceRound();
        } else {
            setHrCallOver(true);
            setTimeout(() => fetchReport(), 2000);
        }
    };

    // ── HR Voice Logic (Round 2) ───────────────────────────────────────────────
    const startHrVoiceRound = () => {
        const intro = "Hello! I am Sophia from HR. It's a pleasure to speak with you today. Let's finalize your application. Tell me about your long term career goals.";
        setMessages([{ role: 'interviewer', content: intro, timestamp: new Date().toLocaleTimeString() }]);
        speak(intro);
    };

    const toggleMic = () => {
        if (isListening) {
            setIsListening(false);
            recognitionRef.current?.stop();
            if (voiceTranscript.trim()) {
                handleVoiceAnswer(voiceTranscript);
            }
        } else {
            setVoiceTranscript('');
            setIsListening(true);
            try {
                recognitionRef.current?.start();
            } catch (err) {
                console.error("Mic error:", err);
                setIsListening(false);
            }
        }
    };

    const handleVoiceAnswer = async (text: string) => {
        setIsSending(true);
        setVoiceTranscript('');
        setMessages(prev => [...prev, { role: 'user', content: text, timestamp: new Date().toLocaleTimeString() }]);

        try {
            if (isDummyMode) {
                setTimeout(() => {
                    dummyQIdxRef.current++;
                    if (dummyQIdxRef.current >= DUMMY_QUESTIONS[2].length) {
                        setHrCallOver(true);
                        const closing = "Thank you for your time. Report generating...";
                        setMessages(prev => [...prev, { role: 'interviewer', content: closing, timestamp: new Date().toLocaleTimeString() }]);
                        speak(closing);
                        setTimeout(() => fetchReport(), 4000);
                    } else {
                        const nextQ = DUMMY_QUESTIONS[2][dummyQIdxRef.current];
                        setMessages(prev => [...prev, { role: 'interviewer', content: nextQ, timestamp: new Date().toLocaleTimeString() }]);
                        speak(nextQ);
                    }
                    setIsSending(false);
                }, 1000);
                return;
            }

            const res = await fetch('http://localhost:8000/api/interview/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session_id: sessionId,
                    user_response: text,
                    round_index: 2
                })
            });
            const data = await res.json();
            if (data.is_round_complete) {
                setHrCallOver(true);
                setMessages(prev => [...prev, { role: 'interviewer', content: data.interviewer_text, timestamp: new Date().toLocaleTimeString() }]);
                speak(data.interviewer_text);
                setTimeout(() => fetchReport(), 2000);
            } else {
                setMessages(prev => [...prev, { role: 'interviewer', content: data.interviewer_text, timestamp: new Date().toLocaleTimeString() }]);
                speak(data.interviewer_text);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSending(false);
        }
    };

    const speak = (text: string) => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.pitch = 1.1;
            window.speechSynthesis.speak(utterance);
        }
    };

    const fetchReport = async () => {
        if (!sessionId) {
            setReport(DUMMY_REPORT);
            setStep('REPORT');
            return;
        }
        setStep('REPORT');
        setLoadingReport(true);
        try {
            const res = await fetch(`http://localhost:8000/api/interview/report?session_id=${sessionId}`);
            const data = await res.json();
            setReport(data);
        } catch (err) {
            setReport(DUMMY_REPORT);
        } finally {
            setLoadingReport(false);
        }
    };

    const ROUND_META = [
        { label: 'Technical Assessment', icon: <Code2 className="w-5 h-5" />, color: '#7C3AED', hint: 'DSA, Architecture. Type answers.' },
        { label: 'Behavioural Assessment', icon: <User className="w-5 h-5" />, color: '#EC4899', hint: 'STAR method. Type answers.' },
        { label: 'HR Final Call', icon: <Mic className="w-5 h-5" />, color: '#FF5B5B', hint: 'Voice round. Speak naturally.' },
    ];

    const ScoreBar = ({ label, score, color, delay = 0 }: { label: string; score: number; color: string; delay?: number }) => (
        <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-gray-900">{label}</span>
                <span className="text-gray-500">{score}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1.4, delay }} className="h-full rounded-full" style={{ backgroundColor: color }} />
            </div>
        </div>
    );

    const ChatBubble = ({ msg }: { msg: ChatMessage }) => (
        <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-6 py-4 rounded-3xl text-sm font-medium leading-relaxed shadow-sm ${msg.role === 'interviewer' ? 'bg-[#111827] text-white rounded-tl-none' : 'bg-[#7C3AED] text-white rounded-tr-none'}`}>
                {msg.content}
            </div>
        </div>
    );

    const SpeakingAvatar = () => {
        const eyeScaleY = blink ? 0.05 : 1;
        const getMouthPath = () => isSpeaking && mouthOpen ? "M 95 168 Q 110 180 125 168 Q 110 190 95 168 Z" : "M 92 168 Q 110 185 128 168";
        return (
            <div className="relative flex flex-col items-center">
                <style>{`@keyframes glowPulse { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.08)} } @keyframes ringPulse { 0%{transform:scale(1);opacity:0.7} 100%{transform:scale(1.6);opacity:0} } @keyframes breatheBody { 0%,100%{transform:scaleY(1) scaleX(1)} 50%{transform:scaleY(1.015) scaleX(1.005)} }`}</style>
                <div className="relative mb-6">
                    <div className="absolute w-72 h-72 rounded-full blur-3xl opacity-20 bg-cyan-400 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ animation: 'glowPulse 2.5s ease-in-out infinite' }} />
                    {isSpeaking && <div className="absolute w-64 h-64 rounded-full border border-cyan-400/40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[ringPulse_1s_ease-out_infinite] pointer-events-none" />}
                    <svg width="220" height="340" viewBox="0 0 220 380" className="drop-shadow-2xl relative z-10">
                        <defs>
                            <radialGradient id="faceGrad" cx="50%" cy="45%" r="55%"><stop offset="0%" stopColor="#FFE0BB" /><stop offset="60%" stopColor="#F5C28A" /><stop offset="100%" stopColor="#E8A96B" /></radialGradient>
                            <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="rgba(0,0,0,0)" /><stop offset="100%" stopColor="rgba(0,0,0,0.18)" /></radialGradient>
                            <linearGradient id="hairTop" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#0d0020" /><stop offset="40%" stopColor="#2a0a4a" /><stop offset="100%" stopColor="#0d0020" /></linearGradient>
                            <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#1e3a5f" /><stop offset="100%" stopColor="#0f2340" /></linearGradient>
                            <linearGradient id="blouseGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#f0f4ff" /><stop offset="100%" stopColor="#d4dcff" /></linearGradient>
                            <linearGradient id="lipGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#e05070" /><stop offset="100%" stopColor="#b03050" /></linearGradient>
                        </defs>
                        <g style={{ transformOrigin: "110px 300px", animation: "breatheBody 2.5s ease-in-out infinite" }}>
                            <path d="M 20 260 Q 10 310 8 380 L 212 380 Q 210 310 200 260 Q 168 282 110 284 Q 52 282 20 260 Z" fill="url(#suitGrad)" />
                            <path d="M 78 226 L 110 220 L 142 226 L 126 276 L 110 282 L 94 276 Z" fill="url(#blouseGrad)" />
                            <rect x="95" y="204" width="30" height="28" rx="10" fill="url(#faceGrad)" />
                        </g>
                        <ellipse cx="110" cy="138" rx="63" ry="68" fill="url(#faceGrad)" />
                        <ellipse cx="110" cy="138" rx="63" ry="68" fill="url(#shadowGrad)" />
                        <path d="M 48 125 Q 46 70 72 52 Q 92 38 110 37 Q 128 38 148 52 Q 174 70 172 125 Q 158 100 142 93 Q 126 87 110 88 Q 94 87 78 93 Q 62 100 48 125 Z" fill="url(#hairTop)" />
                        <g style={{ transformOrigin: "89px 130px", transform: `scaleY(${eyeScaleY})` }}>
                            <ellipse cx="89" cy="130" rx="14" ry="11" fill="white" /><circle cx="89" cy="131" r="9" fill="#3a1870" /><circle cx="89" cy="131" r="4.5" fill="#0a0416" /><circle cx="93" cy="127" r="2.8" fill="white" />
                        </g>
                        <g style={{ transformOrigin: "131px 130px", transform: `scaleY(${eyeScaleY})` }}>
                            <ellipse cx="131" cy="130" rx="14" ry="11" fill="white" /><circle cx="131" cy="131" r="9" fill="#3a1870" /><circle cx="131" cy="131" r="4.5" fill="#0a0416" /><circle cx="135" cy="127" r="2.8" fill="white" />
                        </g>
                        <path d={getMouthPath()} fill={isSpeaking && mouthOpen ? "#8B2040" : "none"} stroke="url(#lipGrad)" strokeWidth="3" strokeLinecap="round" />
                        <rect x="85" y="290" width="50" height="24" rx="5" fill="#0f2340" stroke="#38bdf8" strokeWidth="1" opacity="0.9" />
                        <text x="110" y="300" textAnchor="middle" fontSize="6" fill="#38bdf8" fontFamily="monospace">SOPHIA</text>
                        <text x="110" y="309" textAnchor="middle" fontSize="5" fill="#7dd3fc" fontFamily="monospace">HR MANAGER</text>
                    </svg>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
                    <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-cyan-400 animate-pulse' : isListening ? 'bg-red-500' : 'bg-green-500'}`} />
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                        {isSpeaking ? 'Sophia Speaking' : isListening ? 'Sophia Listening...' : 'Verified AI Agent'}
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-20 px-4 font-sans">
            <AnimatePresence mode="wait">
                {step === 'INTRO' && (
                    <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-6xl mx-auto">
                        <header className="text-center mb-24">
                            <div className="inline-flex items-center gap-2 bg-[#7C3AED]/10 text-[#7C3AED] px-6 py-2 rounded-full mb-8 border border-[#7C3AED]/10 text-[10px] font-black uppercase tracking-[0.4em]">
                                <Sparkles className="w-4 h-4" /> Simulate High-Stakes Interviews
                            </div>
                            <h1 className="text-6xl sm:text-8xl font-black text-gray-900 mb-8 tracking-tighter uppercase italic leading-[0.9]">Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C4DFF] via-[#EC4899] to-[#FF5B5B]">HOT SEAT.</span></h1>
                        </header>
                        <div className="grid md:grid-cols-3 gap-8 mb-20 text-center">
                            {[{ title: 'Technical', icon: <Code2 className="w-8 h-8" />, color: 'from-[#7C3AED] to-purple-600' }, { title: 'Behavioural', icon: <User className="w-8 h-8" />, color: 'from-pink-500 to-rose-600' }, { title: 'HR Voice', icon: <Mic className="w-8 h-8" />, color: 'from-blue-500 to-indigo-600' }].map((item, i) => (
                                <div key={i} className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-sm hover:shadow-xl transition-all h-full flex flex-col items-center">
                                    <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg`}>{item.icon}</div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight uppercase italic">{item.title}</h3>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col items-center"><button onClick={() => setStep('SETUP')} className="px-12 py-6 bg-gray-900 text-white rounded-full font-black text-sm uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-[#7C3AED] transition-all shadow-2xl">Start Preparation <ArrowRight className="w-5 h-5" /></button></div>
                    </motion.div>
                )}

                {step === 'SETUP' && (
                    <motion.div key="setup" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-[4rem] p-16 shadow-2xl">
                        <h2 className="text-4xl font-black text-gray-900 mb-8 uppercase italic text-center">Configure session.</h2>
                        <div className="space-y-8">
                            <div className="space-y-4 font-black uppercase tracking-widest text-gray-400 text-[10px] ml-4">
                                <label>Company</label>
                                <input type="text" placeholder="e.g. Google" className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-8 py-5 text-sm font-medium focus:ring-4 focus:ring-[#7C3AED]/10" value={setup.company} onChange={(e) => setSetup({ ...setup, company: e.target.value })} />
                            </div>
                            <div className="space-y-4 font-black uppercase tracking-widest text-gray-400 text-[10px] ml-4">
                                <label>Role</label>
                                <input type="text" placeholder="e.g. Software Engineer" className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-8 py-5 text-sm font-medium focus:ring-4 focus:ring-[#7C3AED]/10" value={setup.role} onChange={(e) => setSetup({ ...setup, role: e.target.value })} />
                            </div>
                            <button onClick={startInterview} disabled={loading || !setup.company || !setup.role} className="w-full py-6 bg-black text-white rounded-3xl font-black text-sm uppercase tracking-[0.4em] shadow-2xl italic flex items-center justify-center gap-4">{loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Enter Interaction'}</button>
                        </div>
                    </motion.div>
                )}

                {step === 'INTERVIEW' && (
                    <motion.div key="interview" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-3 gap-6 mb-10">
                            {ROUND_META.map((meta, i) => (
                                <div key={i} className={`p-6 rounded-3xl border ${i === roundIndex ? 'bg-white shadow-2xl border-gray-100 scale-105' : 'bg-gray-50 opacity-40'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: i <= roundIndex ? meta.color : '#e2e8f0' }}>{meta.icon}</div>
                                        <div><p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Round {i + 1}</p><h4 className="text-[11px] font-black uppercase italic tracking-tight">{meta.label}</h4></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {roundIndex < 2 ? (
                            <div className="bg-white rounded-[4rem] border border-gray-100 shadow-3xl overflow-hidden min-h-[650px] flex flex-col">
                                <div className="p-10 border-b border-gray-50 bg-gray-50/30 flex items-center gap-4">
                                    <AlertCircle className="w-5 h-5 text-gray-300" />
                                    <p className="text-xs font-bold text-gray-600 italic leading-none">{ROUND_META[roundIndex].hint}</p>
                                </div>
                                <div className="flex-1 p-10 space-y-8 overflow-y-auto max-h-[500px]">
                                    {messages.map((msg, i) => <ChatBubble key={i} msg={msg} />)}
                                    {(isSending || isSpeaking) && <div className="bg-[#111827] px-6 py-4 rounded-full rounded-tl-none w-max animate-pulse">...</div>}
                                    <div ref={chatEndRef} />
                                </div>
                                <div className="border-t border-gray-50 p-6 flex gap-4">
                                    <textarea rows={2} className="flex-1 border-none focus:ring-0 text-sm font-medium resize-none bg-transparent" placeholder="Type answer..." value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendChat())} />
                                    <button onClick={handleSendChat} disabled={!userInput.trim() || isSending || isSpeaking} className="p-4 bg-black text-white rounded-2xl"><Send className="w-5 h-5" /></button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[#0f1b2a] rounded-[4rem] border border-white/5 shadow-3xl overflow-hidden relative min-h-[700px] flex flex-col items-center justify-center p-12 text-center">
                                <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(100,180,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(100,180,255,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
                                <SpeakingAvatar />
                                <div className="max-w-xl w-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 mt-12">
                                    {messages.length > 0 && messages.filter(m => m.role === 'interviewer').slice(-1).map((msg, i) => <p key={i} className="text-lg text-cyan-50 font-medium leading-relaxed italic">"{msg.content}"</p>)}
                                    {voiceTranscript && <p className="mt-8 pt-8 border-t border-white/5 text-sm text-cyan-400/80 font-medium italic">"{voiceTranscript}"</p>}
                                </div>
                                <div className="mt-12">
                                    {hrCallOver ? <div className="text-green-400 font-black">ROUND COMPLETE</div> : (
                                        <button onClick={toggleMic} className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all ${isListening ? 'bg-red-500 scale-110' : 'bg-gradient-to-br from-cyan-500 to-indigo-600'}`}>
                                            {isListening ? <MicOff className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {step === 'REPORT' && (
                    <motion.div key="report" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto bg-white border border-gray-100 rounded-[4rem] p-16 shadow-2xl">
                        <div className="text-center mb-16">
                            <h2 className="text-6xl font-black text-gray-900 tracking-tighter uppercase italic">Score: {report?.overall_score}</h2>
                            <p className="text-gray-500 font-medium text-lg mt-4 italic">{report?.verdict}</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="space-y-8">{report?.sections.map((sec, i) => <ScoreBar key={i} label={sec.label} score={sec.score} color="#7C3AED" delay={i * 0.1} />)}</div>
                            <div className="bg-gray-50 p-8 rounded-3xl h-full border border-gray-100">
                                <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Strengths</h4>
                                <ul className="space-y-2">{report?.strengths.map((s, i) => <li key={i} className="text-xs font-bold text-gray-700 italic">• {s}</li>)}</ul>
                            </div>
                        </div>
                        <div className="mt-12 text-center"><button onClick={() => window.location.reload()} className="px-12 py-5 bg-black text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">Retake Assessment</button></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
