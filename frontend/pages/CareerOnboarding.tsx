
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
    PlayCircle,
    Code,
    Terminal,
    ChevronRight
} from 'lucide-react';

import { API_BASE_URL as API_BASE } from '../apiConfig';

const DEFAULT_PATHS = [
    { name: "Cloud Solutions Architect", group: "Cloud", pos: { x: -350, y: -220 }, color: "#0EA5E9", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=300&fit=crop" },
    { name: "Mobile App Developer", group: "App", pos: { x: -400, y: -80 }, color: "#3B82F6", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=300&fit=crop" },
    { name: "Cyber Security Lead", group: "Security", pos: { x: -320, y: 150 }, color: "#EF4444", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&h=300&fit=crop" },
    { name: "AI Research Scientist", group: "AI", pos: { x: -180, y: -320 }, color: "#6366F1", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=300&fit=crop" },
    { name: "Data Science Manager", group: "Maths", pos: { x: 320, y: -260 }, color: "#10B981", image: "https://images.unsplash.com/photo-1551288049-bbda38a10ad1?w=300&h=300&fit=crop" },
    { name: "Product Development", group: "Business", pos: { x: 420, y: -120 }, color: "#F59E0B", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=300&fit=crop" },
    { name: "UX Design Architect", group: "Design", pos: { x: 360, y: 180 }, color: "#EC4899", image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=300&h=300&fit=crop" },
    { name: "Full Stack Engineer", group: "Dev", pos: { x: 150, y: 320 }, color: "#F97316", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=300&fit=crop" },
    { name: "Robotics Lead Eng", group: "Robotics", pos: { x: -220, y: 360 }, color: "#06B6D4", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=300&fit=crop" },
    { name: "NLP Systems Specialist", group: "AI", pos: { x: 220, y: -380 }, color: "#8B5CF6", image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=300&h=300&fit=crop" },
    { name: "Blockchain Strategist", group: "Web3", pos: { x: -480, y: -320 }, color: "#F43F5E", image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=300&fit=crop" },
    { name: "Digital Twin Expert", group: "Eng", pos: { x: -520, y: 120 }, color: "#D946EF", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=300&fit=crop" },
    { name: "Quantum Computing Dev", group: "Future", pos: { x: -120, y: 420 }, color: "#14B8A6", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=300&fit=crop" },
    { name: "Metaverse Architect", group: "Design", pos: { x: 520, y: 360 }, color: "#6366F1", image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=300&h=300&fit=crop" },
    { name: "Big Data Engineer", group: "Data", pos: { x: 550, y: -320 }, color: "#F59E0B", image: "https://images.unsplash.com/photo-1558494949-ef01091244ea?w=300&h=300&fit=crop" },
    { name: "Systems Integrator", group: "Ops", pos: { x: 540, y: 120 }, color: "#10B981", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=300&fit=crop" },
    { name: "IoT Platform Eng", group: "Tech", pos: { x: -550, y: 320 }, color: "#3B82F6", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=300&fit=crop" },
    { name: "DevOps Champion", group: "Ops", pos: { x: 0, y: -480 }, color: "#EF4444", image: "https://images.unsplash.com/photo-1618401471353-b98aade8103a?w=300&h=300&fit=crop" },
    { name: "SaaS Product Owner", group: "Business", pos: { x: -250, y: -450 }, color: "#8B5CF6", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=300&fit=crop" },
    { name: "FinTech Consultant", group: "Finance", pos: { x: 350, y: 450 }, color: "#0EA5E9", image: "https://images.unsplash.com/photo-1611974714013-3c81048fd89b?w=300&h=300&fit=crop" },
];

const FALLBACK_ROADMAP = [
    { "month": 1, "title": "Starting Out", "tasks": ["Learn basic tools", "Set up your screen"], "project": "Initial Draft", "stack": ["VS Code", "Terminal"], "concepts": ["File Systems", "Basic Syntax"], "extras": "Watch YouTube Intros" },
    { "month": 2, "title": "Building Core Skills", "tasks": ["Try 5 small tasks", "Post your work"], "project": "Prototype One", "stack": ["Python", "Git"], "concepts": ["Loops", "Functions"], "extras": "Join Discord Labs" },
    { "month": 3, "title": "Designing Layouts", "tasks": ["Make it look good", "Fix obvious bugs"], "project": "Beta Version", "stack": ["HTML/CSS", "Figma"], "concepts": ["Typography", "Grid Systems"], "extras": "Read Design Blogs" },
    { "month": 4, "title": "Connecting Systems", "tasks": ["Save user data", "Add login screen"], "project": "Version 1.0", "stack": ["Node.js", "SQL"], "concepts": ["API Routing", "Databases"], "extras": "Try Cloud Hosting" },
    { "month": 5, "title": "Testing & Polish", "tasks": ["Check for errors", "Make video tour"], "project": "Final Polish", "stack": ["Jest", "Postman"], "concepts": ["Unit Testing", "Debugging"], "extras": "Optimize Performance" },
    { "month": 6, "title": "Job Search", "tasks": ["Send applications", "Practice talking"], "project": "Career Start", "stack": ["LinkedIn", "GitHub"], "concepts": ["Interview Prep", "Networking"], "extras": "Mock Interviews" }
];

// --- ROADMAP DETAIL MODAL ---
const RoadmapDetailModal: React.FC<{ month: any; onClose: () => void }> = ({ month, onClose }) => {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-10 bg-slate-900/40 backdrop-blur-md"
        >
            <motion.div 
                initial={{ scale: 0.95, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-[0_32px_120px_rgba(0,0,0,0.15)] relative"
            >
                {/* MODAL HEADER STRIP */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400" />
                
                <div className="p-8 sm:p-14">
                    <button onClick={onClose} className="absolute top-10 right-10 p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all border border-slate-100 shadow-sm active:scale-95">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>

                    <div className="space-y-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-2xl text-white font-black text-xl shadow-lg ring-4 ring-blue-50">
                                    {month.month}
                                </span>
                                <div>
                                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">{month.title}</h2>
                                    <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.25em]">Phase {month.month} Briefing Protocol</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-[1fr_0.8fr] gap-16">
                            <div className="space-y-10">
                                <div className="space-y-6">
                                    <h3 className="text-[12px] font-black text-slate-300 uppercase tracking-[0.3em] flex items-center gap-3"><Brain className="w-4 h-4" /> Strategic Core Focus</h3>
                                    <div className="grid gap-4">
                                        {(month.tasks || []).map((task: string, i: number) => (
                                            <div key={i} className="group p-5 bg-slate-50 rounded-2xl border border-slate-100/50 flex items-start gap-4 hover:bg-white hover:border-blue-200 hover:shadow-xl transition-all">
                                                <div className="w-1.5 h-6 rounded-full bg-blue-500/20 group-hover:bg-blue-600 transition-colors" />
                                                <div>
                                                    <p className="font-bold text-[14px] text-slate-700 leading-tight mb-2 uppercase">{task}</p>
                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Requirement {i + 1}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-8 bg-slate-900 rounded-3xl text-white space-y-6 overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl" />
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-slate-400 text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-2"><Target className="w-4 h-4" /> Technical Blueprint</h4>
                                        <div className="px-3 py-1 bg-white/10 rounded-lg text-[9px] font-black uppercase">Standard {month.month}.0</div>
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">Primary Stack</div>
                                            <div className="flex flex-wrap gap-2">
                                                {(month.stack || []).map((s: string) => (
                                                    <span key={s} className="px-2.5 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-tight shadow-sm border border-blue-500/50">#{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">Core Mastery</div>
                                            <div className="flex flex-wrap gap-2">
                                                {(month.concepts || []).map((c: string) => (
                                                    <span key={c} className="px-2.5 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-tight border border-emerald-500/20">{c}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div className="space-y-6">
                                    <h3 className="text-[12px] font-black text-slate-300 uppercase tracking-[0.3em] flex items-center gap-3"><Flag className="w-4 h-4" /> Industrial Milestone</h3>
                                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6 relative group overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full blur-2xl group-hover:bg-blue-100transition-all" />
                                        <h4 className="text-2xl font-black text-slate-900 uppercase leading-tight relative z-10">{month.project}</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed font-medium relative z-10">Deliver a production-ready implementation focused on architectural scalability and real-world performance for Phase {month.month}.</p>
                                        <div className="space-y-3 pt-2 relative z-10">
                                            <div className="flex items-center gap-3 text-[11px] font-black text-slate-900 border-b border-slate-50 pb-3">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" /> SCALABLE MODULES
                                            </div>
                                            <div className="flex items-center gap-3 text-[11px] font-black text-slate-900">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" /> QUALITY ASSURANCE
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100/50 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                            <PlayCircle className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-[12px] text-blue-900 uppercase tracking-tight">Curated Module</h4>
                                            <p className="text-blue-600/70 text-[10px] uppercase font-bold tracking-widest">Recommended Training</p>
                                        </div>
                                    </div>
                                    <p className="text-blue-900/60 text-[13px] font-medium leading-relaxed">Directly align your phase with the StudLyf Accelerator curriculum for this specialization.</p>
                                    <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-lg active:scale-95">Enroll in Protocol →</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// --- ROADMAP CARD COMPONENT ---
const RoadmapCard: React.FC<{ month: any; idx: number; isLast: boolean; onDetails: (m: any) => void }> = ({ month, idx, isLast, onDetails }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative pl-12 sm:pl-32 py-6 group"
        >
            {/* Timeline Line & Node */}
            {!isLast && <div className="absolute left-[16px] sm:left-[56px] top-14 bottom-[-24px] w-[2px] bg-slate-100" />}
            
            <motion.div 
                initial={{ scale: 0, borderColor: "#e2e8f0" }}
                whileInView={{ scale: 1, borderColor: "#3b82f6", backgroundColor: "#eff6ff" }}
                viewport={{ once: true, margin: "-150px" }}
                transition={{ duration: 0.4 }}
                className="absolute left-[11px] sm:left-[51px] top-12 w-3 h-3 bg-white border-2 border-slate-300 rounded-full z-10 shadow-[0_0_0_4px_white]" 
            />

            <div className="absolute left-0 sm:left-0 top-11 w-8 sm:w-24 text-right pr-4 hidden sm:block">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Month {month.month}</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 hover:shadow-md hover:border-blue-200 transition-all duration-300 relative overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "4px" }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="absolute left-0 top-0 bottom-0 bg-blue-500"
                />
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-1.5">
                            <h3 className="text-xl font-semibold text-slate-900 tracking-tight">{month.title}</h3>
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md uppercase tracking-wider border border-blue-100/50">Phase {month.month}</span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium">{month.details}</p>
                    </div>
                    <button 
                        onClick={() => onDetails(month)}
                        className="shrink-0 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        View Specifications <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/80 rounded-lg p-5 border border-slate-100">
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <Terminal className="w-3.5 h-3.5 text-slate-400" /> Technical Requirements
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {(Array.isArray(month.stack) ? month.stack : (month.stack || '').split(',')).map((s: any, i: number) => (
                                <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-[11px] font-medium rounded shadow-sm hover:border-blue-200 hover:bg-blue-50 transition-colors">{s.toString().trim()}</span>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <TrendingUp className="w-3.5 h-3.5 text-slate-400" /> Core Competencies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {(Array.isArray(month.concepts) ? month.concepts : (month.concepts || '').split(',')).map((c: any, i: number) => (
                                <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-[11px] font-medium rounded shadow-sm hover:border-blue-200 hover:bg-blue-50 transition-colors">{c.toString().trim()}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const RoadmapSection: React.FC<{ 
    roadmapData: any; 
    selectedPath: any; 
    isGeneratingRoadmap: boolean; 
    handlePathClick: (p: any) => void;
    onDetails: (m: any) => void;
    navigate: any;
}> = ({ roadmapData, selectedPath, isGeneratingRoadmap, handlePathClick, onDetails, navigate }) => {
    return (
        <section className="w-full max-w-5xl mx-auto py-16 px-6 relative bg-white">
            <div className="mb-12 border-b border-slate-200 pb-8">
                <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 bg-blue-600 rounded-sm" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Enterprise Architecture Protocol</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Career Architecture Blueprint</h2>
                        <p className="text-slate-500 mt-2 text-sm max-w-2xl font-medium leading-relaxed">Structured 6-month progression roadmap aligned with industry-standard technical requirements and professional competencies.</p>
                    </div>
                    {selectedPath && (
                        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-sm w-full md:w-auto shadow-sm">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-white shrink-0 border border-slate-200">
                                {selectedPath.image ? <img src={selectedPath.image} alt="path" className="w-full h-full object-cover grayscale opacity-90" /> : null}
                            </div>
                            <div>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Target Discipline</p>
                                <p className="text-sm font-semibold text-slate-900 leading-tight mt-0.5">{selectedPath.name}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="relative">
                {isGeneratingRoadmap ? (
                    <div className="py-32 flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-2xl border-dashed">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                        <h3 className="text-sm font-bold text-slate-900">Compiling Blueprint Architecture...</h3>
                        <p className="text-xs text-slate-500 mt-1 font-medium">Analyzing industry standards and technical prerequisites.</p>
                    </div>
                ) : roadmapData && roadmapData.length > 0 ? (
                    <div className="space-y-0">
                        {roadmapData.map((month: any, idx: number) => (
                            <RoadmapCard 
                                key={idx} 
                                month={month} 
                                idx={idx} 
                                isLast={idx === roadmapData.length - 1}
                                onDetails={onDetails} 
                            />
                        ))}
                    </div>
                ) : selectedPath ? (
                    <div className="py-24 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
                        <Cpu className="w-8 h-8 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Initialize Architecture Protocol</h3>
                        <p className="text-sm text-slate-500 max-w-md mx-auto mb-8 font-medium">Execution of this protocol will synthesize a validated technical roadmap for {selectedPath.name}.</p>
                        <button onClick={() => handlePathClick(selectedPath)} className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-2 mx-auto">
                            Generate Architecture Blueprint <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="py-24 text-center bg-slate-50 border border-slate-200 rounded-2xl border-dashed">
                        <Network className="w-8 h-8 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-sm font-semibold text-slate-400">Select a discipline from the network vector above to review its technical blueprint.</h3>
                    </div>
                )}
            </div>

            {/* FINAL CTA */}
            {roadmapData && !isGeneratingRoadmap && (
                <div className="mt-20 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50 p-6 md:p-8 rounded-2xl border mb-32">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Ready to initiate training?</h3>
                        <p className="text-sm text-slate-500 font-medium mt-1">Access specialized modules aligned with your technical roadmap.</p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-sm uppercase tracking-wider">
                            Export System PDF
                        </button>
                        <button onClick={() => navigate('/courses')} className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm uppercase tracking-wider flex items-center gap-2">
                            View Course Catalog <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            )}
        </section>
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
                    <div className="h-[80vh] w-full relative flex items-center justify-center overflow-hidden border-b border-gray-100 bg-white">
                        {/* ENTERPRISE DOT GRID BACKGROUND */}
                        <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: 'radial-gradient(#d1d5db 1.2px, transparent 0)', backgroundSize: '40px 40px' }} />
                        
                        {isGeneratingPaths && (
                           <div className="absolute top-10 z-[100] flex items-center gap-2 px-5 py-2.5 bg-white/95 backdrop-blur-md rounded-full shadow-2xl border border-blue-100 text-blue-600 font-black text-[11px] uppercase tracking-widest">
                               <Loader2 className="w-4 h-4 animate-spin" />
                               <span>Synthesizing Enterprise Network...</span>
                           </div>
                        )}

                        {/* ENTERPRISE CENTRAL HUB WITH NEON GLOW */}
                        <div className="relative z-20">
                            {/* MULTI-COLOR NEON GLOW EFFECT */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full opacity-35 blur-[100px] bg-gradient-to-br from-green-300 via-cyan-400 to-blue-500 animate-pulse" />
                            <div className="relative w-80 h-80 rounded-full bg-white shadow-[0_0_120px_rgba(34,197,94,0.15)] border border-gray-50 flex flex-col items-center justify-center text-center p-10 z-10">
                                <div className="text-gray-400 text-[14px] font-medium leading-relaxed mb-4">Explore paths<br/><span className="text-gray-300">based on your goals</span></div>
                                <div className="flex items-center gap-6 text-3xl mb-4 grayscale opacity-80">
                                    <GraduationCap className="w-8 h-8 text-blue-500" />
                                    <Dumbbell className="w-8 h-8 text-green-500" />
                                </div>
                                <ChevronDown className="w-6 h-6 text-gray-200 animate-bounce mt-4" />
                            </div>
                        </div>
                        <div className="absolute inset-0">
                            {(generatedPaths.length > 0 ? generatedPaths : DEFAULT_PATHS).map((node, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onMouseEnter={() => setHoveredPath(node)}
                                    onMouseLeave={() => setHoveredPath(null)}
                                    onClick={() => handlePathClick(node)}
                                    className="absolute flex items-center gap-3 cursor-pointer group z-30"
                                    style={{ 
                                        left: `calc(50% + ${node.pos?.x || 0}px)`, 
                                        top: `calc(50% + ${node.pos?.y || 0}px)`,
                                        transform: 'translate(-50%, -50%)' 
                                    }}
                                >
                                    <motion.div 
                                        whileHover={{ scale: 1.5, y: -8, boxShadow: `0 0 20px ${node.color || '#3B82F6'}55` }}
                                        className="relative w-10 h-10 rounded-full shadow-xl border-2 border-white overflow-hidden transition-all bg-gray-100"
                                    >
                                        <img 
                                            src={node.image || "https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=200&h=200&fit=crop"} 
                                            alt={node.name} 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = "https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=200&h=200&fit=crop";
                                            }}
                                        />
                                        <div className="absolute inset-0 opacity-20 border-[3px] rounded-full pointer-events-none" style={{ borderColor: node.color }} />
                                    </motion.div>
                                    <span className="text-[12px] font-black text-[#111] transition-all group-hover:text-blue-600 whitespace-nowrap bg-white/70 backdrop-blur-[4px] px-2.5 py-1 rounded-lg border border-white/40 shadow-sm uppercase tracking-wide">
                                        {node.name}
                                    </span>
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
