
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
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
    ExternalLink,
    Flag,
    Loader2,
    Info,
    PlayCircle
} from 'lucide-react';

import { API_BASE_URL as API_BASE } from '../apiConfig';

const DEFAULT_PATHS = [
    { name: "AI Research Scientist", group: "AI", description: "Develop cutting edge models. $150k+", pos: { x: -280, y: -120 } },
    { name: "Robotics Engineer", group: "Robotics", description: "Design hardware/software systems. $120k+", pos: { x: -380, y: 80 } },
    { name: "Product Manager", group: "Business", description: "Lead product vision and roadmap. $130k+", pos: { x: 50, y: 350 } },
    { name: "Data Scientist", group: "Maths", description: "Extract insights from complex data. $110k+", pos: { x: 300, y: -180 } }
];

const FALLBACK_ROADMAP = [
    { "month": 1, "title": "Foundation & Environment", "tasks": ["Audit prerequisite skills", "Set up professional workstation", "Establish daily learning routine"], "project": "Environment Alpha" },
    { "month": 2, "title": "Core Technical Mastery", "tasks": ["Master core language/tools", "Build 5 mini-modules", "Join 3 relevant communities"], "project": "Prototype Beta" },
    { "month": 3, "title": "Architecture & Scalability", "tasks": ["Implement robust data flow", "Optimize for user performance", "Conduct 3 deep refactors"], "project": "Core Engine V1" },
    { "month": 4, "title": "Advanced Logic & Integration", "tasks": ["Connect external high-level APIs", "Implement secure protocols", "Add automated testing"], "project": "Integrator Pro" },
    { "month": 5, "title": "Case Study & Polishing", "tasks": ["Record 5-min demo video", "Polished technical case study", "Polish LinkedIn & Resume"], "project": "Showcase Matrix" },
    { "month": 6, "title": "Market Impact", "tasks": ["Target 10 specific companies", "Attend 2 industry meetups", "Final project deployment"], "project": "Grand Finale" }
];

// --- ROADMAP DETAIL MODAL ---
const RoadmapDetailModal: React.FC<{ month: any; onClose: () => void }> = ({ month, onClose }) => {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-8 bg-[#111]/80 backdrop-blur-sm"
        >
            <motion.div 
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-[2rem] shadow-2xl relative p-8 sm:p-10"
            >
                <button onClick={onClose} className="absolute top-6 right-6 p-2.5 bg-gray-50 rounded-full hover:bg-gray-100 transition-all border border-gray-100">
                    <X className="w-5 h-5 text-gray-400" />
                </button>

                <div className="space-y-10">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-blue-600">
                            <Rocket className="w-5 h-5" />
                            <span className="font-black uppercase tracking-widest text-[10px]">Phase {month.month} Briefing</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-[#111] tracking-tight">{month.title}</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <h3 className="text-sm font-black flex items-center gap-2 text-gray-400 uppercase tracking-widest"><Brain className="w-4 h-4" /> Core Focus</h3>
                            <div className="space-y-3">
                                {month.tasks.map((task: string, i: number) => (
                                    <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-4 group hover:bg-white hover:border-blue-200 hover:shadow-md transition-all">
                                        <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center font-black text-[10px] group-hover:bg-blue-600 group-hover:text-white transition-all">{i+1}</div>
                                        <div className="flex-1">
                                            <p className="font-bold text-xs text-[#111] leading-tight">{task}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-sm font-black flex items-center gap-2 text-gray-400 uppercase tracking-widest"><Flag className="w-4 h-4" /> Milestone</h3>
                            <div className="p-6 bg-[#111] rounded-2xl text-white space-y-4 shadow-xl">
                                <h4 className="text-lg font-black">{month.project}</h4>
                                <p className="text-gray-400 text-xs leading-relaxed">Industrial validation project for Phase {month.month}. Focus on efficiency and logic modularity.</p>
                                <div className="space-y-2 pt-2">
                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-400">
                                        <CheckCircle2 className="w-3.3 h-3.3" /> Scalable Core
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-400">
                                        <CheckCircle2 className="w-3.3 h-3.3" /> Prod Readiness
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6 bg-blue-50 rounded-2xl space-y-3 border border-blue-100/50 shadow-inner">
                                <h4 className="font-bold text-xs text-blue-900 flex items-center gap-2"><PlayCircle className="w-4 h-4" /> StudLyf Integrated Course</h4>
                                <p className="text-blue-600/80 text-[11px]">Recommended modules for this phase.</p>
                                <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all">Enroll →</button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// --- ROADMAP CARD COMPONENT ---
const RoadmapCard: React.FC<{ month: any; idx: number; onDetails: (m: any) => void }> = ({ month, idx, onDetails }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.5 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, perspective: 1000, transformStyle: "preserve-3d" }}
            className="relative md:pl-24 group mb-12"
        >
            <div className="absolute left-0 top-0 w-14 h-14 rounded-2xl bg-white border border-gray-100 shadow-lg flex items-center justify-center z-20 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 hidden md:flex border-b-4 border-gray-100 group-hover:border-blue-700">
                <span className="font-black text-lg">{month.month}</span>
            </div>
            <div className="absolute left-7 top-14 bottom-0 w-0.5 bg-gray-100 hidden md:block group-last:hidden" />

            <div className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col lg:flex-row gap-8 group-hover:border-blue-100 transition-all relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50/40 rounded-full blur-3xl group-hover:bg-blue-100/50 transition-all" />
                
                <div className="flex-1 space-y-6 relative z-10" style={{ transform: "translateZ(30px)" }}>
                    <div className="space-y-2">
                        <span className="text-blue-500 font-black text-[9px] uppercase tracking-[0.2em] opacity-60">Phase {month.month}</span>
                        <h3 className="text-2xl sm:text-3xl font-black text-[#111] tracking-tight lowercase leading-tight group-hover:text-blue-900 transition-colors">{month.title}</h3>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                        {(month.tasks || []).map((task: string, tIdx: number) => (
                            <div key={tIdx} className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl group-hover:bg-white/50 transition-all border border-transparent group-hover:border-gray-50">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                <p className="text-gray-600 font-bold text-[11px] uppercase tracking-tight">{task}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:w-72 bg-gray-50/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-100/50 space-y-5 relative z-10 shadow-inner group-hover:bg-white transition-all" style={{ transform: "translateZ(20px)" }}>
                    <div className="flex items-center gap-2">
                        <Flag className="w-4 h-4 text-orange-500" />
                        <span className="font-black text-[9px] uppercase tracking-widest text-gray-400">Milestone</span>
                    </div>
                    <h4 className="text-lg font-black text-[#111] leading-tight uppercase tracking-tight">{month.project}</h4>
                    <button 
                        onClick={() => onDetails(month)}
                        className="w-full py-3.5 bg-[#111] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                    >
                        Blueprint <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// --- ROADMAP SECTION COMPONENT ---
const RoadmapSection: React.FC<{ 
    roadmapData: any; 
    selectedPath: any; 
    isGeneratingRoadmap: boolean; 
    handlePathClick: (p: any) => void;
    onDetails: (m: any) => void;
    navigate: any;
}> = ({ roadmapData, selectedPath, isGeneratingRoadmap, handlePathClick, onDetails, navigate }) => {
    const roadmapRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: roadmapRef,
        offset: ["start end", "end end"]
    });
    const timelineScaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    return (
        <div ref={roadmapRef} className="max-w-6xl mx-auto px-6 py-20 sm:py-32 space-y-24 relative mt-12 border-t border-gray-100">
            {/* Animated Timeline Line */}
            {roadmapData && roadmapData.length > 0 && (
                <div className="absolute left-7 md:left-[118px] top-64 bottom-48 w-0.5 bg-gray-100 rounded-full hidden md:block overflow-hidden">
                    <motion.div 
                        className="w-full bg-blue-600 rounded-full origin-top"
                        style={{ scaleY: timelineScaleY, height: "100%" }}
                    />
                </div>
            )}

            {isGeneratingRoadmap ? (
                <div className="flex flex-col items-center justify-center py-20 gap-6">
                    <div className="w-12 h-12 border-4 border-blue-50 border-t-blue-500 rounded-full animate-spin" />
                    <h3 className="text-xl font-black text-[#111] uppercase tracking-tight">Architecting Roadmap...</h3>
                    <p className="text-gray-400 font-bold uppercase text-[9px] tracking-widest animate-pulse italic">Consulting Synthesis Protocol</p>
                </div>
            ) : roadmapData && roadmapData.length > 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                            <TrendingUp className="w-3.5 h-3.5" /> Strategy Architecture
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-4xl sm:text-5xl font-black text-[#111] tracking-tighter uppercase leading-none">Roadmap</h2>
                            <h3 className="text-xl sm:text-2xl font-light text-blue-600 tracking-tight lowercase italic">
                                {selectedPath?.name} <span className="text-gray-300 mx-2 text-xs font-light">in</span> <span className="font-bold text-gray-500 uppercase tracking-widest text-[10px]">{selectedPath?.group || 'Specialization'}</span>
                            </h3>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {roadmapData.map((month: any, idx: number) => (
                            <RoadmapCard key={idx} month={month} idx={idx} onDetails={onDetails} />
                        ))}
                    </div>
                </motion.div>
            ) : selectedPath ? (
                <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm px-10 border-dashed">
                    <Sparkles className="w-10 h-10 text-gray-200 mx-auto mb-6" />
                    <h3 className="text-xl font-black text-[#111] tracking-tight uppercase">Roadmap Strategy Ready</h3>
                    <p className="text-gray-400 max-w-md mx-auto mt-2 text-sm">Grok has synthesized a tactical path for {selectedPath.name}.</p>
                    <button onClick={() => handlePathClick(selectedPath)} className="mt-8 px-10 py-4 bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 transition-all shadow-lg active:scale-95">Generate Blueprint →</button>
                </div>
            ) : null}
        </div>
    );
};

// --- MAIN COMPONENT ---
const CareerOnboarding: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [activeTab, setActiveTab] = useState<'Identity' | 'Paths'>('Identity');
    const [selectedDetailMonth, setSelectedDetailMonth] = useState<any>(null);
    
    const [formData, setFormData] = useState({
        role: '',
        level: 'Bachelor\'s degree',
        subject: '',
        skills: [] as string[],
        interests: [] as string[],
        experience: ["Summer Engineering Internship"],
        traits: ["Analytical", "Collaborative"]
    });

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isGeneratingPaths, setIsGeneratingPaths] = useState(false);
    const [isGeneratingIdentity, setIsGeneratingIdentity] = useState(false);
    const [identityStatement, setIdentityStatement] = useState('');
    const [generatedPaths, setGeneratedPaths] = useState<any[]>([]);
    const [hoveredPath, setHoveredPath] = useState<any>(null);
    const [selectedPath, setSelectedPath] = useState<any>(null);
    const [roadmapData, setRoadmapData] = useState<any>(null);
    const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);

    const getDefaultSkillsForSubject = (subj: string) => {
        const s = (subj || "").toLowerCase();
        if (s.includes("testing") || s.includes("qa")) return ["SDLC", "Manual Testing", "Automation Testing", "Bug Tracking"];
        if (s.includes("software") || s.includes("cs") || s.includes("it")) return ["C++", "Java", "DSA", "SQL"];
        if (s.includes("ece") || s.includes("electronics")) return ["Circuit Design", "VLSI", "Signal Processing", "Arduino"];
        if (s.includes("mechanical") || s.includes("me")) return ["AutoCAD", "SolidWorks", "Thermodynamics", "Kinematics"];
        if (s.includes("mba") || s.includes("business") || s.includes("management")) return ["Strategic Planning", "Market Research", "Excel Modeling", "Public Speaking"];
        if (s.includes("robotics")) return ["ROS", "Embedded Systems", "Sensor Fusion", "CAD"];
        if (s.includes("data") || s.includes("aiml") || s.includes("ai")) return ["Python", "Machine Learning", "Data Visualization", "SQL"];
        return ["Communication", "Problem Solving", "Adaptability"];
    };

    const fetchIdentity = useCallback(async () => {
        setIsGeneratingIdentity(true);
        try {
            const res = await fetch(`${API_BASE}/api/career/identity`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    subject: formData.subject, 
                    skills: formData.skills, 
                    interests: formData.interests 
                })
            });
            const data = await res.json();
            if (data.identity_statement) setIdentityStatement(data.identity_statement);
        } catch (err) {
            console.error("Identity fetch failed:", err);
        } finally {
            setIsGeneratingIdentity(false);
        }
    }, [formData.subject, formData.skills, formData.interests, API_BASE]);

    const fetchPaths = useCallback(async () => {
        if (isGeneratingPaths) return;
        setIsGeneratingPaths(true);
        try {
            const res = await fetch(`${API_BASE}/api/career/explore-paths`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    subject: formData.subject, 
                    skills: formData.skills, 
                    interests: formData.interests 
                })
            });
            const data = await res.json();
            if (data && data.paths && data.paths.length > 0) {
                setGeneratedPaths(data.paths);
            } else {
                setGeneratedPaths(DEFAULT_PATHS);
            }
        } catch (err) {
            console.error("Paths fetch failed:", err);
            setGeneratedPaths(DEFAULT_PATHS);
        } finally {
            setIsGeneratingPaths(false);
        }
    }, [formData.subject, formData.skills, formData.interests, isGeneratingPaths, API_BASE]);

    const handleAnalyze = async () => {
        if (!formData.subject) {
            alert("Please enter your academic trajectory.");
            return;
        }
        setIsAnalyzing(true);
        setIdentityStatement('');
        setGeneratedPaths([]);
        setRoadmapData(null);
        setSelectedPath(null);
        
        const baseSkills = getDefaultSkillsForSubject(formData.subject);
        setFormData(prev => ({ ...prev, skills: baseSkills }));

        await Promise.all([fetchIdentity(), fetchPaths()]);
        setIsAnalyzing(false);
        setStep(3);
    };

    useEffect(() => {
        if (step >= 3 && formData.subject) {
            const timer = setTimeout(() => {
                fetchIdentity();
                fetchPaths();
            }, 1500); 
            return () => clearTimeout(timer);
        }
    }, [formData.skills, formData.experience, formData.subject, step, fetchIdentity, fetchPaths]);

    useEffect(() => {
        if (activeTab === 'Paths' && generatedPaths.length === 0 && !isGeneratingPaths && step >= 3) {
            fetchPaths();
        }
    }, [activeTab, generatedPaths.length, isGeneratingPaths, fetchPaths, step]);

    const handlePathClick = async (path: any) => {
        if (isGeneratingRoadmap) return;
        setSelectedPath(path);
        setIsGeneratingRoadmap(true);
        setRoadmapData(null);
        
        try {
            const res = await fetch(`${API_BASE}/api/career/roadmap`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    career_path: path.name,
                    subject: formData.subject,
                    skills: formData.skills
                })
            });
            const data = await res.json();
            if (data && data.roadmap && data.roadmap.length > 0) {
                setRoadmapData(data.roadmap);
            } else {
                setRoadmapData(FALLBACK_ROADMAP);
            }
        } catch (err) {
            console.error("Roadmap generation failed:", err);
            setRoadmapData(FALLBACK_ROADMAP);
        } finally {
            setIsGeneratingRoadmap(false);
        }
    };

    const addExperience = () => {
        const exp = prompt("Enter your experience:");
        if (exp) setFormData({ ...formData, experience: [...formData.experience, exp] });
    };

    const removeExperience = (idx: number) => {
        setFormData({ ...formData, experience: formData.experience.filter((_, i) => i !== idx) });
    };

    const addSkill = () => {
        const skill = prompt("Enter a skill:");
        if (skill) setFormData({ ...formData, skills: [...formData.skills, skill] });
    };

    const removeSkill = (skill: string) => {
        setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
    };

    const renderHeaderTabs = () => (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-6">
            <div className="relative p-1 bg-white/60 backdrop-blur-xl rounded-full border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex items-center">
                <button
                    onClick={() => { setActiveTab('Identity'); setStep(3); }}
                    className={`relative z-10 flex-1 h-10 rounded-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${activeTab === 'Identity' ? 'text-[#111]' : 'text-gray-400'}`}
                >
                    {activeTab === 'Identity' && (
                        <motion.div 
                            layoutId="activeTab" 
                            className="absolute inset-0 bg-white shadow-sm rounded-full border border-gray-100/50" 
                            transition={{ type: 'spring', duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-20 flex items-center gap-2">
                        <Edit3 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Identity</span>
                    </span>
                </button>
                <button
                    onClick={() => { setActiveTab('Paths'); setStep(4); }}
                    className={`relative z-10 flex-1 h-10 rounded-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${activeTab === 'Paths' ? 'text-[#111]' : 'text-gray-400'}`}
                >
                    {activeTab === 'Paths' && (
                        <motion.div 
                            layoutId="activeTab" 
                            className="absolute inset-0 bg-white shadow-sm rounded-full border border-gray-100/50" 
                            transition={{ type: 'spring', duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-20 flex items-center gap-2">
                        <Network className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Explore</span>
                    </span>
                </button>
            </div>
        </div>
    );

    const renderContent = () => {
        if (step === 1) {
            return (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-10 w-full max-w-2xl px-6">
                    <div className="space-y-3">
                        <h1 className="text-4xl sm:text-5xl font-black text-[#111] tracking-tighter uppercase leading-none">Your Trajectory</h1>
                        <p className="text-gray-400 text-sm font-medium uppercase tracking-widest italic">Define your field of study</p>
                    </div>
                    <div className="relative">
                        <input
                            autoFocus
                            type="text"
                            placeholder="e.g. B.Tech Software Testing"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                            className="w-full text-2xl sm:text-4xl font-bold text-[#3C4043] border-b-2 border-gray-100 focus:border-blue-500 outline-none pb-4 bg-transparent placeholder:text-gray-200 transition-all"
                        />
                    </div>
                    <button 
                        onClick={handleAnalyze} 
                        className="w-full sm:w-fit px-12 py-5 bg-[#111] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                    >
                        Analyze Career <Rocket className="w-4 h-4" />
                    </button>
                </motion.div>
            );
        }

        if (activeTab === 'Identity') {
            return (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-6xl mx-auto pt-28 pb-12 grid lg:grid-cols-[0.9fr_1.1fr] gap-12 px-6">
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-gray-400 font-black uppercase text-[10px] tracking-widest"><Dumbbell className="w-4 h-4" /> Experience</div>
                            <div className="flex flex-wrap gap-2">
                                {formData.experience.map((exp, i) => (
                                    <div key={i} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-[#111] rounded-lg text-[11px] font-bold uppercase tracking-tight">{exp} <X className="w-3 h-3 cursor-pointer opacity-40 hover:opacity-100" onClick={() => removeExperience(i)} /></div>
                                ))}
                                <button onClick={addExperience} className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-400 rounded-lg text-[11px] font-bold border border-dashed border-gray-200 hover:border-gray-400 transition-all uppercase tracking-tight"><Plus className="w-3 h-3" /> Add</button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-gray-400 font-black uppercase text-[10px] tracking-widest"><GraduationCap className="w-4 h-4" /> Degree</div>
                            <div className="flex gap-2 flex-wrap">
                                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-bold border border-blue-100 uppercase tracking-tight">{formData.subject || 'Not specified'}</div>
                                <button onClick={() => { const s = prompt("Update background:"); if(s) setFormData({...formData, subject: s}) }} className="p-2 bg-gray-50 text-gray-400 rounded-lg border border-dashed border-gray-200"><Edit3 className="w-3.5 h-3.5" /></button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-gray-400 font-black uppercase text-[10px] tracking-widest"><Target className="w-4 h-4" /> Core Hub</div>
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map(s => (
                                    <div key={s} className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-[11px] font-bold border border-green-100 uppercase tracking-tight">{s} <X className="w-3 h-3 cursor-pointer opacity-40" onClick={() => removeSkill(s)} /></div>
                                ))}
                                <button onClick={addSkill} className="px-4 py-2 bg-gray-50 text-gray-400 rounded-lg text-[11px] font-bold border border-dashed border-gray-200 hover:border-gray-400 transition-all uppercase tracking-tight"><Plus className="w-3 h-3" /> Add Core</button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-[0_15px_60px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between h-auto min-h-[450px] relative overflow-hidden group">
                        <AnimatePresence>
                            {isGeneratingIdentity && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white/80 backdrop-blur-md z-30 flex flex-col items-center justify-center gap-4">
                                    <div className="w-8 h-8 border-3 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                                    <span className="text-blue-600 font-black uppercase text-[9px] tracking-widest italic">Syncing Profile...</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <div className="flex justify-between items-start mb-10">
                                <div className="flex items-center gap-2 text-[#34A853]">
                                    <Sparkles className="w-4 h-4" />
                                    <span className="font-black text-[10px] uppercase tracking-widest">Identity Synthesis</span>
                                </div>
                                <span className="px-3 py-1 bg-gray-50 rounded-lg text-[9px] font-black text-gray-300 uppercase tracking-widest italic border border-gray-100">Grok 2.0</span>
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.p 
                                    key={identityStatement || 'empty'}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-2xl sm:text-3xl text-[#3C4043] leading-tight font-light italic pr-4"
                                >
                                    "{identityStatement || `Architecting a professional career foundation in ${formData.subject}.`}"
                                </motion.p>
                            </AnimatePresence>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-12 pb-2">
                            <div className="flex gap-3">
                                <button onClick={() => { fetchIdentity(); }} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all border border-gray-100"><RefreshCw className="w-4 h-4" /></button>
                                <button onClick={() => { navigator.clipboard.writeText(identityStatement); alert('Copied!'); }} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all border border-gray-100"><Copy className="w-4 h-4" /></button>
                            </div>
                            <button
                                onClick={() => { setActiveTab('Paths'); setStep(4); }}
                                className="w-full sm:w-auto px-10 py-4 bg-[#111] text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95 flex items-center gap-3"
                            >
                                Explore Paths <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            );
        }

        if (activeTab === 'Paths') {
            return (
                <div className="w-full min-h-screen bg-[#F8F9FA] pt-24 sm:pt-28">
                    <div className="h-[70vh] sm:h-[75vh] w-full relative flex items-center justify-center overflow-hidden border-b border-gray-100">
                        {isGeneratingPaths && (
                           <div className="absolute top-10 z-[100] flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-blue-50 text-blue-600 font-black text-[10px] uppercase tracking-widest">
                               <Loader2 className="w-3.5 h-3.5 animate-spin" />
                               <span>Engaging Map Synthesis...</span>
                           </div>
                        )}
                        <div className="relative z-20 w-56 h-56 sm:w-64 sm:h-64 rounded-full flex flex-col items-center justify-center bg-white shadow-[0_0_80px_rgba(52,168,83,0.1)] border border-gray-100 text-center p-6 group">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#4285F4]/5 via-[#34A853]/5 to-[#FBBC05]/5 rounded-full blur-xl animate-pulse" />
                            <span className="text-gray-300 text-[10px] font-black relative z-10 leading-relaxed uppercase tracking-widest">Explore <br /> Vector Hub</span>
                            <div className="flex gap-2 relative z-10 mt-3"><GraduationCap className="w-4 h-4 text-gray-300" /><Target className="w-4 h-4 text-gray-300" /></div>
                            <ChevronDown className="w-4 h-4 text-gray-200 animate-bounce relative z-10 mt-4" />
                        </div>
                        <div className="absolute inset-0">
                            {(generatedPaths.length > 0 ? generatedPaths : DEFAULT_PATHS).map((node, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onMouseEnter={() => setHoveredPath(node)}
                                    onMouseLeave={() => setHoveredPath(null)}
                                    onClick={() => handlePathClick(node)}
                                    className="absolute flex items-center gap-2 cursor-pointer group z-30"
                                    style={{ left: `calc(50% + ${node.pos?.x || 0}px)`, top: `calc(50% + ${node.pos?.y || 0}px)` }}
                                >
                                    <div className={`w-2.5 h-2.5 rounded-full transition-all group-hover:scale-150 shadow-sm ${selectedPath?.name === node.name ? 'ring-4 ring-blue-500/20 scale-150' : ''} ${i % 3 === 0 ? 'bg-blue-400' : i % 3 === 1 ? 'bg-green-400' : 'bg-red-400'}`} />
                                    <span className={`text-[11px] font-black transition-all whitespace-nowrap uppercase tracking-tighter ${selectedPath?.name === node.name ? 'text-[#111] scale-105' : 'text-gray-400 group-hover:text-[#111]'}`}>{node.name}</span>
                                    <AnimatePresence>
                                        {hoveredPath?.name === node.name && (
                                            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-full left-0 mb-3 w-56 bg-white p-4 rounded-2xl shadow-xl border border-gray-50 z-[200] pointer-events-none">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                    <span className="text-[9px] font-black uppercase text-gray-300 tracking-widest">{node.group}</span>
                                                </div>
                                                <p className="text-[10px] text-gray-500 leading-relaxed font-bold uppercase">{node.description}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                    </div>

                    <RoadmapSection 
                        roadmapData={roadmapData} 
                        selectedPath={selectedPath} 
                        isGeneratingRoadmap={isGeneratingRoadmap} 
                        handlePathClick={handlePathClick} 
                        onDetails={setSelectedDetailMonth} 
                        navigate={navigate} 
                    />
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center font-sans antialiased text-[#111] overflow-x-hidden">
            {step >= 3 && renderHeaderTabs()}
            <main className={`w-full ${activeTab === 'Paths' ? 'block' : 'min-h-screen flex items-center justify-center p-4'}`}>
                {isAnalyzing ? (
                    <div className="fixed inset-0 bg-[#F8F9FA] flex flex-col items-center justify-center z-[200]">
                        <div className="w-16 h-16 mb-8 relative">
                            <div className="absolute inset-0 border-[6px] border-blue-50 rounded-full" />
                            <div className="absolute inset-0 border-[6px] border-blue-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                        <h2 className="text-3xl font-black text-[#111] uppercase tracking-tighter text-center px-6 leading-none">Synthesizing Profile</h2>
                        <div className="flex gap-4 mt-6 flex-wrap justify-center">
                            {["Core Vectors", "Path Synapses"].map((t, idx) => (
                                <motion.span key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.4 }} className="text-[9px] font-black text-gray-400 tracking-widest uppercase">{t}</motion.span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {renderContent()}
                    </AnimatePresence>
                )}
            </main>
            
            <AnimatePresence>
                {selectedDetailMonth && (
                    <RoadmapDetailModal 
                        month={selectedDetailMonth} 
                        onClose={() => setSelectedDetailMonth(null)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default CareerOnboarding;
