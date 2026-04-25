
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
    { name: "Cloud Solutions Architect", group: "Cloud", color: "#0EA5E9", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=300&fit=crop", desc: "Design secure, scalable cloud architectures." },
    { name: "Mobile App Developer", group: "App", color: "#3B82F6", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=300&fit=crop", desc: "Build native and hybrid mobile experiences." },
    { name: "Cyber Security Lead", group: "Security", color: "#EF4444", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&h=300&fit=crop", desc: "Protect systems and data from digital threats." },
    { name: "AI Research Scientist", group: "AI", color: "#6366F1", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=300&fit=crop", desc: "Advance the future with machine learning." },
    { name: "Data Science Manager", group: "Maths", color: "#10B981", image: "https://images.unsplash.com/photo-1551288049-bbda38a10ad1?w=300&h=300&fit=crop", desc: "Extract insights and drive data decisions." },
    { name: "Product Development", group: "Business", color: "#F59E0B", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=300&fit=crop", desc: "Turn ideas into scalable, impactful products." },
    { name: "UX Design Architect", group: "Design", color: "#EC4899", image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=300&h=300&fit=crop", desc: "Design meaningful experiences users love." },
    { name: "Full Stack Engineer", group: "Dev", color: "#F97316", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=300&fit=crop", desc: "Build end-to-end web applications." },
    { name: "Robotics Lead Eng", group: "Robotics", color: "#06B6D4", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=300&fit=crop", desc: "Build intelligent robots for the real world." },
    { name: "Blockchain Strategist", group: "Web3", color: "#F43F5E", image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=300&fit=crop", desc: "Design secure, transparent ledger solutions." },
    { name: "Quantum Computing Dev", group: "Future", color: "#14B8A6", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=300&fit=crop", desc: "Work on next-gen computing systems." },
    { name: "Big Data Engineer", group: "Data", color: "#F59E0B", image: "https://images.unsplash.com/photo-1558494949-ef01091244ea?w=300&h=300&fit=crop", desc: "Process and scale massive data streams." },
    { name: "Systems Integrator", group: "Ops", color: "#10B981", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=300&fit=crop", desc: "Unify complex technical subsystems." },
    { name: "IoT Platform Eng", group: "Tech", color: "#3B82F6", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=300&fit=crop", desc: "Connect devices for smarter ecosystems." },
];

const FALLBACK_ROADMAP = [
    { "month": 1, "title": "Starting Out", "tasks": ["Learn basic tools", "Set up your screen"], "project": "Initial Draft", "stack": ["VS Code", "Terminal"], "concepts": ["File Systems", "Basic Syntax"], "extras": "Watch YouTube Intros" },
    { "month": 2, "title": "Building Core Skills", "tasks": ["Try 5 small tasks", "Post your work"], "project": "Prototype One", "stack": ["Python", "Git"], "concepts": ["Loops", "Functions"], "extras": "Join Discord Labs" },
    { "month": 3, "title": "Designing Layouts", "tasks": ["Make it look good", "Fix obvious bugs"], "project": "Beta Version", "stack": ["HTML/CSS", "Figma"], "concepts": ["Typography", "Grid Systems"], "extras": "Read Design Blogs" },
    { "month": 4, "title": "Connecting Systems", "tasks": ["Save user data", "Add login screen"], "project": "Version 1.0", "stack": ["Node.js", "SQL"], "concepts": ["API Routing", "Databases"], "extras": "Try Cloud Hosting" },
    { "month": 5, "title": "Testing & Polish", "tasks": ["Check for errors", "Make video tour"], "project": "Final Polish", "stack": ["Jest", "Postman"], "concepts": ["Unit Testing", "Debugging"], "extras": "Optimize Performance" },
    { "month": 6, "title": "Job Search", "tasks": ["Send applications", "Practice talking"], "project": "Career Start", "stack": ["LinkedIn", "GitHub"], "concepts": ["Interview Prep", "Networking"], "extras": "Mock Interviews" }
];

// --- NETWORK VISUALIZATION COMPONENTS ---

interface Position {
  cx: number;
  cy: number;
}

interface Connection {
  from: number | 'center';
  to: number | 'center';
  color: string;
}

interface PathPositions {
  [key: string]: Position;
}

const CareerNetwork: React.FC<{ paths: any[]; onPathClick: (p: any) => void; isGenerating: boolean }> = ({ paths, onPathClick, isGenerating }) => {
    const [containerSize, setContainerSize] = useState({ width: 1000, height: 1000 });
    const [hoveredPathId, setHoveredPathId] = useState<number | string | null>(null);
    
    const dimensions = useMemo(() => {
        const width = window.innerWidth;
        const baseSize = Math.min(width - 32, 1200);
        const scale = baseSize / 1000;
        return {
            containerSize: baseSize,
            innerRadius: Math.floor(70 * scale),
            outerRadius: Math.floor(110 * scale),
            cardRadius: Math.floor(240 * scale), // Baseline radius for cards
            cardWidth: Math.floor(160 * scale),
            cardHeight: Math.floor(64 * scale),
            centerX: baseSize / 2,
            centerY: baseSize / 2,
        };
    }, [containerSize]);

    useEffect(() => {
        const updateSize = () => {
            setContainerSize({ width: window.innerWidth, height: window.innerHeight });
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const ringPaths = useMemo(() => {
        // Limit to 10 paths for an Enterprise-grade clean aesthetic
        return paths.slice(0, 10).map((p, i) => ({
            ...p,
            id: p.id || i,
        }));
    }, [paths]);

    const positions: any = useMemo(() => {
        const pos: any = {};
        const total = ringPaths.length;
        ringPaths.forEach((p, i) => {
            const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
            
            // Pronounced staggered radius to ensure zero horizontal overlap
            const currentCardRadius = i % 2 === 0 ? dimensions.cardRadius : dimensions.cardRadius + (90 * (dimensions.containerSize / 1000));
            
            // Anchor point on the outer dashed ring
            pos[`anchor_${p.id}`] = {
                cx: dimensions.centerX + dimensions.outerRadius * Math.cos(angle),
                cy: dimensions.centerY + dimensions.outerRadius * Math.sin(angle)
            };
            
            // Card center position on the staggered circle
            pos[`card_${p.id}`] = {
                cx: dimensions.centerX + currentCardRadius * Math.cos(angle),
                cy: dimensions.centerY + currentCardRadius * Math.sin(angle)
            };
        });
        return pos;
    }, [dimensions, ringPaths]);

    return (
        <div className="w-full relative flex items-center justify-center overflow-hidden bg-white" style={{ height: dimensions.containerSize }}>
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-[0.2]" style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 0)', backgroundSize: '32px 32px' }} />
            
            {isGenerating && (
                <div className="absolute top-10 z-[100] flex items-center gap-2 px-5 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-blue-100 text-blue-600 font-black text-[10px] uppercase tracking-widest">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Synchronizing Network...</span>
                </div>
            )}

            <div style={{ width: dimensions.containerSize, height: dimensions.containerSize }} className="relative">
                {/* SVG Connections and Rings */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    {/* Inner Dashed Ring */}
                    <circle 
                        cx={dimensions.centerX} 
                        cy={dimensions.centerY} 
                        r={dimensions.innerRadius} 
                        fill="none" 
                        stroke="#D8B4FE" 
                        strokeWidth="1.5" 
                        strokeDasharray="4 4" 
                        className="opacity-40"
                    />
                    
                    {/* Outer Dashed Ring */}
                    <circle 
                        cx={dimensions.centerX} 
                        cy={dimensions.centerY} 
                        r={dimensions.outerRadius} 
                        fill="none" 
                        stroke="#D8B4FE" 
                        strokeWidth="1.5" 
                        strokeDasharray="4 4" 
                        className="opacity-40"
                    />

                    {/* Anchor Nodes and Connecting Lines */}
                    {ringPaths.map((p) => {
                        const anchor = positions[`anchor_${p.id}`];
                        const card = positions[`card_${p.id}`];
                        if (!anchor || !card) return null;
                        
                        return (
                            <g key={p.id}>
                                {/* Node on the ring */}
                                <circle 
                                    cx={anchor.cx} 
                                    cy={anchor.cy} 
                                    r="4" 
                                    fill="white" 
                                    stroke="#A855F7" 
                                    strokeWidth="2" 
                                />
                                {/* Connecting line to card */}
                                <motion.line 
                                    x1={anchor.cx} 
                                    y1={anchor.cy} 
                                    x2={card.cx} 
                                    y2={card.cy} 
                                    stroke={hoveredPathId === p.id ? "#8B5CF6" : "#C4B5FD"} 
                                    strokeWidth={hoveredPathId === p.id ? "2.5" : "1.5"}
                                    initial={false}
                                    animate={{ 
                                        stroke: hoveredPathId === p.id ? "#8B5CF6" : "#C4B5FD",
                                        strokeWidth: hoveredPathId === p.id ? 2.5 : 1.5,
                                        opacity: hoveredPathId === p.id ? 1 : 0.4
                                    }}
                                    className="transition-all duration-300"
                                />
                            </g>
                        );
                    })}
                </svg>

                {/* Path Cards */}
                {ringPaths.map((p) => {
                    const pos = positions[`card_${p.id}`];
                    if (!pos) return null;
                    
                    return (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onMouseEnter={() => setHoveredPathId(p.id)}
                            onMouseLeave={() => setHoveredPathId(null)}
                            className="absolute z-30 cursor-pointer group"
                            style={{ 
                                left: pos.cx, 
                                top: pos.cy, 
                                width: dimensions.cardWidth,
                                height: dimensions.cardHeight,
                                transform: 'translate(-50%, -50%)' 
                            }}
                            onClick={() => onPathClick(p)}
                        >
                            <div className="w-full h-full bg-white/95 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 p-2.5 flex items-center gap-3 hover:shadow-[0_12px_30px_rgba(168,85,247,0.08)] hover:border-purple-200 transition-all duration-500 group-active:scale-95">
                                <div 
                                    className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-gray-50 shadow-sm flex items-center justify-center bg-gray-50"
                                    style={{ backgroundColor: `${p.color}10` }}
                                >
                                    <img src={p.image} alt="" className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-tight truncate leading-none mb-1">
                                        {p.name}
                                    </h4>
                                    <p className="text-[8px] text-slate-400 font-medium leading-tight line-clamp-2">
                                        {p.desc || p.description || "Synthesizing career trajectory..."}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {/* Central Hub Area (Empty as per design) */}
                <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ width: dimensions.innerRadius * 2, height: dimensions.innerRadius * 2 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-100/10 via-blue-100/10 to-pink-100/10 rounded-full blur-3xl opacity-30" />
                </div>
            </div>
        </div>
    );
};

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
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="relative pl-8 sm:pl-40 pb-16 group/card"
        >
            {/* Architectural Vertical Connector */}
            {!isLast && (
                <div className="absolute left-[15px] sm:left-[60px] top-12 bottom-0 w-[1px] bg-slate-200 transition-colors duration-500 group-hover/card:bg-blue-400" />
            )}
            
            {/* Engineering Node */}
            <div className="absolute left-[10px] sm:left-[55px] top-10 w-[12px] h-[12px] rounded-full bg-white border-2 border-slate-300 z-10 shadow-[0_0_0_4px_white] transition-all duration-500 group-hover/card:border-blue-600 group-hover/card:shadow-[0_0_0_4px_white,0_0_15px_rgba(37,99,235,0.4)]" />

            {/* Technical Month Indicator */}
            <div className="absolute left-0 sm:left-0 top-9 w-24 hidden sm:flex flex-col items-end pr-8 transition-all duration-500">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 transition-colors group-hover/card:text-amber-500">Phase</span>
                <span className="text-2xl font-bold text-slate-800 tabular-nums leading-none transition-colors group-hover/card:text-amber-600">{month.month.toString().padStart(2, '0')}</span>
            </div>

            {/* Professional Content Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-10 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:border-amber-200 transition-all duration-500 relative overflow-hidden group/card">
                {/* Dynamic Line Effect on Hover (Contrast Color) */}
                <div className="absolute left-0 top-0 bottom-0 w-0 bg-amber-500 transition-all duration-500 group-hover/card:w-1.5 shadow-[2px_0_15px_rgba(245,158,11,0.4)] z-20" />
                
                {/* Architectural Grid Background (Subtle) */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                
                <div className="flex flex-col xl:flex-row justify-between items-start gap-8 relative z-10">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-4 mb-4">
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight group-hover/card:text-amber-600 transition-colors duration-300">{month.title}</h3>
                            <span className="shrink-0 px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-black rounded-lg uppercase tracking-widest border border-amber-100">Validated</span>
                        </div>
                        <p className="text-slate-500 text-[13px] font-medium leading-relaxed max-w-2xl">{month.details || month.tasks?.[0] || "Synthesizing specialized technical curriculum and operational milestones."}</p>
                    </div>
                    
                    <button 
                        onClick={() => onDetails(month)}
                        className="shrink-0 group/btn px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all flex items-center gap-3 shadow-lg shadow-slate-200 active:scale-95"
                    >
                        <span className="text-[11px] font-black uppercase tracking-widest">Analysis Specs</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                </div>
                
                {/* Technical Specifications Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-10 relative z-10">
                    {/* Stack Specification */}
                    <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-100/50">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                                <Terminal className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Technical Stack</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(Array.isArray(month.stack) ? month.stack : (month.stack || '').split(',')).map((s: any, i: number) => (
                                <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg shadow-sm hover:border-blue-400 hover:text-blue-600 transition-all cursor-default">
                                    {s.toString().trim()}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Competency Specification */}
                    <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-100/50">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Core Competencies</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(Array.isArray(month.concepts) ? month.concepts : (month.concepts || '').split(',')).map((c: any, i: number) => (
                                <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg shadow-sm hover:border-green-400 hover:text-green-600 transition-all cursor-default">
                                    {c.toString().trim()}
                                </span>
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
        <section className="w-full max-w-6xl mx-auto py-24 px-6 relative bg-white">
            {/* Section Heading with Technical Specs */}
            <div className="mb-20">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-[1px] bg-blue-600" />
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Operational Protocol 741</span>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                    <div className="max-w-3xl">
                        <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">Career Architecture<br/><span className="text-slate-400">Blueprint</span></h2>
                        <p className="text-slate-500 text-base sm:text-lg font-medium leading-relaxed">
                            A validated 6-month technical progression strategy engineered for professional excellence and industry standard compliance.
                        </p>
                    </div>
                    {selectedPath && (
                        <div className="bg-slate-900 rounded-2xl p-6 lg:p-8 flex items-center gap-6 shadow-2xl shadow-slate-200 lg:min-w-[400px]">
                            <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-700/50 bg-slate-800 shrink-0">
                                <img src={selectedPath.image} alt="" className="w-full h-full object-cover grayscale opacity-80" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Selected Discipline</p>
                                <p className="text-xl font-bold text-white leading-tight">{selectedPath.name}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="relative">
                {isGeneratingRoadmap ? (
                    <div className="py-40 flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-[2rem] border-dashed">
                        <div className="relative w-16 h-16 mb-8">
                            <div className="absolute inset-0 border-4 border-blue-50 rounded-full" />
                            <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Compiling System Architecture</h3>
                        <p className="text-sm text-slate-500 mt-2 font-medium">Synchronizing with industry standard technical vectors...</p>
                    </div>
                ) : roadmapData && roadmapData.length > 0 ? (
                    <div className="space-y-0 relative">
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
                    <div className="py-32 text-center bg-white border border-slate-200 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.04)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.05] pointer-events-none">
                            <Network className="w-64 h-64" />
                        </div>
                        <Cpu className="w-12 h-12 text-blue-600 mx-auto mb-8 animate-pulse" />
                        <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Protocol Ready for Initiation</h3>
                        <p className="text-slate-500 max-w-xl mx-auto mb-12 text-lg font-medium leading-relaxed px-6">
                            Execute the synthesis engine to generate a validated technical roadmap for <span className="text-slate-900 font-bold">{selectedPath.name}</span>.
                        </p>
                        <button 
                            onClick={() => handlePathClick(selectedPath)} 
                            className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center gap-4 mx-auto"
                        >
                            Initiate Synthesis Engine <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <div className="py-32 text-center bg-slate-50 border border-slate-200 rounded-[2.5rem] border-dashed">
                        <div className="p-6 bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-8 shadow-sm">
                            <Network className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-400 tracking-tight uppercase px-6">Select a network vector above to review technical specifications.</h3>
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
                <div className="w-full min-h-screen bg-white pt-24 sm:pt-28">
                    <CareerNetwork 
                        paths={generatedPaths.length > 0 ? generatedPaths : DEFAULT_PATHS} 
                        onPathClick={handlePathClick}
                        isGenerating={isGeneratingPaths}
                    />

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
