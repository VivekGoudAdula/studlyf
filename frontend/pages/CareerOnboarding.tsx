
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRight,
    ChevronLeft,
    ChevronDown,
    Sparkles,
    CheckCircle2,
    Brain,
    Target,
    Rocket,
    Search,
    RefreshCw,
    Plus,
    MessageSquare,
    FileText,
    Lightbulb,
    Briefcase,
    GraduationCap,
    Dumbbell,
    Heart,
    X,
    History,
    Copy,
    TrendingUp,
    Award,
    BookOpen,
    MapPin,
    Cpu,
    BarChart4,
    Zap,
    LayoutDashboard,
    Settings2,
    Share2,
    Edit3,
    Network,
    ExternalLink
} from 'lucide-react';

// --- RICH DUMMY DATA ---

const LEVELS = [
    "High school diploma", "Associate's degree", "Bachelor's degree", "Master's degree",
    "Doctorate", "Professional certificate", "Industry certification"
];

const SKILLS_POOL = [
    { name: "Machine Learning", category: "AI/ML", desc: "Developing neural networks and predictive models." },
    { name: "Reinforcement Learning", category: "AI/ML", desc: "Training agents for decision making in dynamic environments." },
    { name: "Generative AI", category: "AI/ML", desc: "Building models that create new content (text, image, audio)." },
    { name: "Transformers / LLMs", category: "AI/ML", desc: "Architecting large-scale attention-based models." },
    { name: "Computer Vision", category: "AI/ML", desc: "Processing and interpreting visual data from the world." },
    { name: "Physics-Informed ML", category: "Science", desc: "Integrating physical laws into machine learning models." },
    { name: "MLOps", category: "AI/ML", desc: "Automating the deployment and monitoring of ML models." },
    { name: "Neural Architecture Search", category: "AI/ML", desc: "Automating the design of artificial neural networks." },
    { name: "Robotics OS (ROS)", category: "Robotics", desc: "Building software frameworks for robotic control." },
    { name: "Verilog / VHDL", category: "ECE/EE", desc: "Hardware description languages for FPGA/IC design." },
    { name: "Circuit Design", category: "EE", desc: "Designing and simulating electronic circuits." },
    { name: "Product Roadmap", category: "PM", desc: "Strategic planning and lifecycle management." },
    { name: "Quantum Computing", category: "Science", desc: "Developing algorithms for quantum processors." },
    { name: "Linear Algebra", category: "Maths", desc: "Fundamental mathematics for data and physics." },
    { name: "Python / C++", category: "CSE", desc: "Core programming for scalable systems." },
    { name: "UI/UX Research", category: "Design", desc: "Understanding user behavior and aesthetics." },
    { name: "Cloud Architecture", category: "DevOps", desc: "Designing AWS/Azure/GCP infrastructures." },
    { name: "Data Structures", category: "CSE", desc: "Optimizing algorithmic performance." },
    { name: "Embedded Systems", category: "ECE", desc: "Programming microcontrollers and sensors." }
];

const CAREER_NODES = [
    { name: "AI Research Scientist", group: "AI", pos: { x: -280, y: -180 } },
    { name: "Generative AI Engineer", group: "AI", pos: { x: -150, y: -250 } },
    { name: "NLP Architect", group: "AI", pos: { x: -350, y: -100 } },
    { name: "Robotics Engineer", group: "Robotics", pos: { x: -380, y: 50 } },
    { name: "Computer Vision Scientist", group: "AI", pos: { x: -320, y: 180 } },
    { name: "VLSI Design Engineer", group: "ECE", pos: { x: -200, y: 240 } },
    { name: "MLOps Specialist", group: "AI", pos: { x: -100, y: 350 } },
    { name: "Product Manager (AI)", group: "Business", pos: { x: 50, y: 400 } },
    { name: "Data Scientist (Lead)", group: "Maths", pos: { x: 300, y: -220 } },
    { name: "Control Systems Lead", group: "EE", pos: { x: 180, y: -100 } },
    { name: "Full Stack ML Engineer", group: "CSE", pos: { x: 380, y: 150 } },
    { name: "Mechatronics Specialist", group: "Robotics", pos: { x: 80, y: -300 } },
    { name: "Firmware Developer", group: "ECE", pos: { x: -450, y: -10 } },
    { name: "Quantitative Analyst (AI)", group: "Maths", pos: { x: 420, y: -50 } },
    { name: "Quantum Software Dev", group: "Science", pos: { x: 480, y: 220 } },
    { name: "Ethical AI Lead", group: "AI", pos: { x: -50, y: 480 } },
    { name: "Edge AI Specialist", group: "ECE", pos: { x: -500, y: 100 } }
];

const CareerOnboarding: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [activeTab, setActiveTab] = useState<'Identity' | 'Paths' | 'Gemini'>('Identity');
    const [formData, setFormData] = useState({
        role: '',
        level: 'Bachelor\'s degree',
        subject: '',
        skills: ["Python", "Machine Learning", "Product Management"],
        interests: ["Robotics", "AI Ethics"],
        experience: "Summer Engineering Internship",
        traits: ["Analytical", "Collaborative"]
    });

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedPrompt, setSelectedPrompt] = useState<any>(null);
    const [isCopied, setIsCopied] = useState(false);

    const handleNext = () => {
        if (step === 1) setStep(2);
        else if (step === 2) {
            setIsAnalyzing(true);
            setTimeout(() => { setIsAnalyzing(false); setStep(3); }, 3000);
        }
    };

    const handleCopy = () => {
        if (selectedPrompt) {
            navigator.clipboard.writeText(selectedPrompt.prompt);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const renderHeaderTabs = () => (
        <div className="fixed top-0 left-0 w-full p-8 flex justify-center z-[100] bg-[#F8F9FA]/80 backdrop-blur-sm">
            <div className="flex gap-4 p-1.5 bg-gray-200/50 rounded-[2rem] w-full max-w-4xl shadow-inner border border-gray-100/50">
                <button
                    onClick={() => { setActiveTab('Identity'); setStep(3); }}
                    className={`flex-1 h-12 rounded-[1.8rem] flex items-center justify-center gap-3 text-[13px] font-bold transition-all duration-300 ${activeTab === 'Identity' ? 'bg-white shadow-md text-[#111]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Edit3 className="w-4 h-4" /> Career Identity
                </button>
                <button
                    onClick={() => { setActiveTab('Paths'); setStep(4); }}
                    className={`flex-1 h-12 rounded-[1.8rem] flex items-center justify-center gap-3 text-[13px] font-bold transition-all duration-300 ${activeTab === 'Paths' ? 'bg-white shadow-md text-[#111]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Network className="w-4 h-4" /> Explore Paths
                </button>
                <button
                    onClick={() => { setActiveTab('Gemini'); setStep(5); }}
                    className={`flex-1 h-12 rounded-[1.8rem] flex items-center justify-center gap-3 text-[13px] font-bold transition-all duration-300 ${activeTab === 'Gemini' ? 'bg-white shadow-md text-[#111]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Zap className="w-4 h-4" /> Jump To Gemini
                </button>
            </div>
        </div>
    );

    const renderPromptModal = () => (
        <AnimatePresence>
            {selectedPrompt && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-12">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedPrompt(null)}
                        className="absolute inset-0 bg-[#3C4043]/60 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 sm:p-16 flex flex-col items-center text-center gap-8"
                    >
                        <button
                            onClick={() => setSelectedPrompt(null)}
                            className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 transition-all border border-gray-100"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="space-y-4">
                            <h3 className="text-3xl font-bold text-[#3C4043]">{selectedPrompt.title}</h3>
                            <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-sm mx-auto">
                                Copy the below starter prompt, then paste it into Gemini to start a conversation.
                            </p>
                        </div>

                        <div className="w-full bg-[#F1F3F4] rounded-[2rem] p-12 min-h-[220px] flex items-center justify-center relative group">
                            <AnimatePresence mode="wait">
                                {isCopied ? (
                                    <motion.div
                                        key="copied"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex items-center gap-3 text-blue-600 font-bold text-xl"
                                    >
                                        <CheckCircle2 className="w-6 h-6" /> Copied
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="prompt"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-gray-400 font-mono text-sm text-left leading-relaxed line-clamp-4"
                                    >
                                        {selectedPrompt.prompt}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="w-full grid sm:grid-cols-2 gap-4">
                            <button
                                onClick={handleCopy}
                                className="w-full py-5 bg-[#E8F0FE] text-blue-600 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#D2E3FC] transition-all"
                            >
                                <Copy className="w-5 h-5" /> Copy to clipboard
                            </button>
                            <button
                                onClick={() => window.open('https://gemini.google.com', '_blank')}
                                className="w-full py-5 bg-[#1D74F2] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20"
                            >
                                <ExternalLink className="w-5 h-5" /> Continue to Gemini
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    const renderContent = () => {
        if (step === 1) {
            return (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-12 w-full max-w-3xl">
                    <div className="space-y-4">
                        <h1 className="text-4xl sm:text-6xl font-light text-[#3C4043] tracking-tighter">Your current academic trajectory?</h1>
                        <p className="text-gray-400 text-xl font-light">Share your field of study (e.g. B.Tech AIML, Robotics, or ECE)</p>
                    </div>
                    <input
                        autoFocus
                        type="text"
                        placeholder="Field of study"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full text-5xl font-light text-[#3C4043] border-b-2 border-gray-100 focus:border-blue-500 outline-none pb-6 bg-transparent"
                    />
                    <button onClick={handleNext} className="w-fit px-14 py-6 bg-[#E8F0FE] text-[#1967D2] rounded-[2rem] font-bold text-xl hover:bg-[#D2E3FC] transition-all shadow-xl shadow-blue-500/5">Next</button>
                </motion.div>
            );
        }

        if (step === 2) {
            return (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-12 w-full max-w-5xl">
                    <h1 className="text-4xl font-light text-gray-500">Pick the technical pillars that define you.</h1>
                    <div className="flex flex-wrap gap-4">
                        {SKILLS_POOL.map(s => (
                            <button
                                key={s.name}
                                onClick={() => {
                                    const exists = formData.skills.includes(s.name);
                                    setFormData({ ...formData, skills: exists ? formData.skills.filter(i => i !== s.name) : [...formData.skills, s.name] });
                                }}
                                className={`px-8 py-5 rounded-full text-lg font-bold transition-all border-2 ${formData.skills.includes(s.name) ? 'bg-[#D9F99D] border-[#A3E635] text-[#365314]' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-300'}`}
                            >
                                {s.name}
                            </button>
                        ))}
                    </div>
                    <button onClick={handleNext} className="w-fit px-16 py-6 bg-[#1D74F2] text-white rounded-[2rem] font-bold text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all">Analyze My Identity</button>
                </motion.div>
            );
        }

        if (activeTab === 'Identity') {
            return (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-7xl mx-auto pt-24 pb-12 grid lg:grid-cols-[1fr_1.5fr] gap-16">
                    <div className="space-y-16">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 text-gray-400 font-black uppercase text-[10px] tracking-widest"><Dumbbell className="w-5 h-5" /> Experiences</div>
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-600 rounded-full text-sm font-bold hover:bg-gray-200 transition-all">Add experience <Plus className="w-4 h-4" /></button>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 text-gray-400 font-black uppercase text-[10px] tracking-widest"><GraduationCap className="w-5 h-5" /> Education</div>
                            <div className="flex gap-3 flex-wrap">
                                <div className="flex items-center gap-2 px-5 py-2.5 bg-[#D1C4E9] text-[#4527A0] rounded-full text-sm font-bold">{formData.subject || 'B.Tech AIML'} <X className="w-3 h-3 cursor-pointer" /></div>
                                <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-600 rounded-full text-sm font-bold hover:bg-gray-200 transition-all">Add education <Plus className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 text-gray-400 font-black uppercase text-[10px] tracking-widest"><Target className="w-5 h-5" /> Skills</div>
                            <div className="flex flex-wrap gap-3">
                                {formData.skills.map(s => (
                                    <div key={s} className="flex items-center gap-2 px-5 py-2.5 bg-[#D9F99D] text-[#365314] rounded-full text-sm font-bold">{s} <X className="w-3 h-3 cursor-pointer" /></div>
                                ))}
                                <button className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-full text-sm font-bold flex items-center gap-2"><Plus className="w-4 h-4" /> Add skills</button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[4rem] p-16 shadow-[0_20px_80px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col justify-between h-[650px] relative">
                        <div>
                            <div className="flex justify-between items-start mb-12">
                                <div className="flex items-center gap-3 text-[#34A853]">
                                    <Sparkles className="w-6 h-6" />
                                    <span className="font-black text-[11px] uppercase tracking-widest">Career Identity Statement</span>
                                </div>
                                <span className="px-5 py-1.5 bg-gray-50 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100 italic">Starter Draft</span>
                            </div>
                            <p className="text-3xl sm:text-4xl text-[#3C4043] leading-[1.3] font-light">
                                I am an artificial intelligence professional focused on applying algorithmic thinking and machine learning to solve complex problems. With a technical foundation in {formData.skills.slice(0, 3).join(', ')}, I translate data into functional, intelligent solutions.
                            </p>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-6">
                                <button className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all border border-gray-100"><RefreshCw className="w-6 h-6" /></button>
                                <button className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all border border-gray-100"><History className="w-6 h-6" /></button>
                                <button className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all border border-gray-100"><Copy className="w-6 h-6" /></button>
                            </div>
                            <button
                                onClick={() => { setActiveTab('Paths'); setStep(4); }}
                                className="px-14 py-6 bg-[#1D74F2] text-white rounded-[2rem] font-bold text-xl hover:scale-105 transition-all shadow-xl shadow-blue-200"
                            >
                                Explore paths
                            </button>
                        </div>
                    </div>
                </motion.div>
            );
        }

        if (activeTab === 'Paths') {
            return (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 pt-32 pb-12 flex flex-col">
                    <div className="flex-grow relative flex items-center justify-center">
                        <div className="relative z-20 w-80 h-80 rounded-full flex flex-col items-center justify-center bg-white shadow-[0_0_120px_rgba(52,168,83,0.2)] border border-gray-100 text-center p-8 group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#34A853]/20 via-[#4285F4]/20 to-[#FBBC05]/20 rounded-full blur-3xl animate-pulse" />
                            <span className="text-gray-400 text-sm font-bold relative z-10 leading-relaxed">Explore paths <br /> based on...</span>
                            <div className="flex gap-3 relative z-10 mt-6"><GraduationCap className="w-7 h-7" /><Target className="w-7 h-7" /></div>
                            <ChevronDown className="w-6 h-6 text-gray-200 animate-bounce relative z-10 mt-6" />
                        </div>

                        <div className="absolute inset-0 pointer-events-none">
                            {CAREER_NODES.map((node, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 + 0.5 }}
                                    className="absolute flex items-center gap-3 cursor-pointer pointer-events-auto group"
                                    style={{ left: `calc(50% + ${node.pos.x}px)`, top: `calc(50% + ${node.pos.y}px)` }}
                                >
                                    <div className={`w-3 h-3 rounded-full transition-all group-hover:scale-150 ${i % 3 === 0 ? 'bg-[#4285F4]' : i % 3 === 1 ? 'bg-[#34A853]' : 'bg-[#EA4335]'}`} />
                                    <span className="text-[13px] font-medium text-gray-500 group-hover:text-[#111] group-hover:font-black transition-all whitespace-nowrap">{node.name}</span>
                                </motion.div>
                            ))}
                        </div>

                        <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                    </div>

                </motion.div>
            );
        }

        if (activeTab === 'Gemini') {
            return (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-7xl mx-auto pt-48 pb-24 text-center">
                    <h1 className="text-6xl sm:text-8xl font-black text-[#111] tracking-tighter mb-8 lowercase">jump to Gemini</h1>
                    <p className="max-w-4xl mx-auto text-xl text-gray-400 font-light leading-relaxed mb-24">
                        Chat with Gemini, your AI assistant from Google, to expand upon your Career Dreamer session. You can chat with it about anything; below are some conversation starters ("prompts") for career-related tasks.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                        {[
                            { title: "Workshop a resume", icon: FileText, prompt: `Help me construct a compelling resume based on my profile. My background is in ${formData.subject}. I have skills in ${formData.skills.join(', ')}. My experience includes: ${formData.experience}. The resume should follow a standard one-page format and emphasize high-impact results.` },
                            { title: "Workshop a cover letter", icon: MessageSquare, prompt: `Help me write a professional cover letter for an AI Engineering position. My background is in ${formData.subject} and I'm highly experienced in ${formData.skills.join(', ')}. Please use my career identity statement as a foundation.` },
                            { title: "Explore more job ideas", icon: Sparkles, prompt: `Based on my technical profile in ${formData.subject} and my passion for ${formData.interests.join(' and ')}, help me explore 5 unique career paths I might not have considered. For each, explain the core responsibilities and potential salary growth. My traits are ${formData.traits.join(', ')}.` }
                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-8 rounded-[3rem] shadow-[0_15px_60px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col items-center gap-6 group"
                            >
                                <card.icon className="w-8 h-8 text-emerald-400" />
                                <h3 className="text-xl font-black text-[#111]">{card.title}</h3>
                                <div className="bg-gray-50/50 p-6 rounded-2xl text-[11px] text-gray-400 font-mono leading-relaxed text-left h-32 overflow-hidden relative border border-gray-100">
                                    {card.prompt}
                                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-gray-50/90 to-transparent" />
                                </div>
                                <button
                                    onClick={() => setSelectedPrompt(card)}
                                    className="w-full py-4 bg-[#1D74F2] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/10"
                                >
                                    Go
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            );
        }
    };

    if (isAnalyzing) {
        return (
            <div className="fixed inset-0 bg-[#F8F9FA] flex flex-col items-center justify-center z-[200]">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-32 h-32 mb-12 relative">
                    <div className="absolute inset-0 border-[10px] border-blue-50 rounded-full" />
                    <div className="absolute inset-0 border-[10px] border-blue-500 border-t-transparent rounded-full" />
                </motion.div>
                <h2 className="text-5xl font-black text-[#111] uppercase tracking-tighter">Analyzing Pillar Vectors</h2>
                <div className="flex gap-3 mt-4">
                    {["NLP Extraction", "Institutional Matching", "Mapping nodes"].map((t, idx) => (
                        <motion.span key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.5 }} className="text-[10px] font-black text-gray-400 tracking-widest uppercase">{t}</motion.span>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 font-sans antialiased text-[#111]">
            {step >= 3 && renderHeaderTabs()}
            <AnimatePresence mode="wait">
                <div className="w-full flex justify-center items-center">
                    {renderContent()}
                </div>
            </AnimatePresence>
            {renderPromptModal()}
        </div>
    );
};

export default CareerOnboarding;
