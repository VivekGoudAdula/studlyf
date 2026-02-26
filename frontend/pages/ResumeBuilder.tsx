import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    FileText,
    Upload,
    Plus,
    Sparkles,
    Download,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Building2,
    Rocket,
    Briefcase,
    Zap,
    RotateCcw,
    ShieldCheck,
    Brain,
    MousePointer2,
    Trash2,
    Edit3,
    Search,
    Layout,
    User,
    Star,
    Loader2,
    ArrowRight,
    FileCode2
} from 'lucide-react';

type Step = 'INTRO' | 'CHOICE' | 'FORM' | 'IMPROVE' | 'GENERATE';

const ResumeBuilder: React.FC = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [step, setStep] = useState<Step>('INTRO');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: 'Arjun Mehta',
        role: 'Fullstack Engineer',
        email: 'arjun@protocol.io',
        summary: 'Driven engineer with 3+ years experience building scalable systems.',
        skills: 'React, Node.js, AWS, Postgres, Kubernetes',
    });

    const [experience, setExperience] = useState([
        { company: 'TechFlow', role: 'Senior Dev', duration: '2021 - Present', bullets: 'Scaled legacy monolith to microservices architecture.' }
    ]);

    // AI Mock Suggestions
    const AI_SUGGESTIONS = [
        { target: 'Skills', suggestion: 'Add "Distributed Systems" to reach Google-level alignment.', score: '+12 Affinity' },
        { target: 'Experience', suggestion: 'Quantify impact: Change "Scaled services" to "Improved throughput by 40%".', score: '+8 Impact' },
        { target: 'Summary', suggestion: 'Highlight ownership: Add mention of "cross-functional leadership".', score: '+5 Clarity' }
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [step]);

    const handleUploadSim = (file?: File) => {
        setIsProcessing(true);
        // Simulate deconstructing a PDF
        setTimeout(() => {
            setFormData({
                name: 'Arjun Mehta',
                role: 'Fullstack Engineer',
                email: 'arjun@protocol.io',
                summary: 'Strategic engineer with 4+ years of experience in high-growth startups. Specialized in rebuilding legacy architectures into event-driven microservices.',
                skills: 'TypeScript, Go, React, Kafka, Docker, Kubernetes, AWS (Lambda, S3), Prometheus',
            });
            setExperience([
                {
                    company: 'NeoScale Systems',
                    role: 'Senior Software Engineer',
                    duration: '2022 - Present',
                    bullets: 'Orchestrated the migration of a PHP monolith to a Go-based microservices architecture, improving system throughput by 300% and reducing latency by 45ms.'
                },
                {
                    company: 'StreamLine AI',
                    role: 'Fullstack Developer',
                    duration: '2020 - 2022',
                    bullets: 'Developed real-time data visualization dashboards using React and WebSocket, handling over 50k concurrent users during peak operational windows.'
                }
            ]);
            setIsProcessing(false);
            setStep('IMPROVE');
        }, 2500);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUploadSim(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && (file.type === 'application/pdf' || file.name.endsWith('.doc') || file.name.endsWith('.docx'))) {
            handleUploadSim(file);
        }
    };

    const handleDownload = (variant: string) => {
        // Clinical Placeholder PDF (Base64 for a simple PDF page)
        const pdfBase64 = "JVBERi0xLjQKJfbk/N8KMSAwIG9iaiA8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmogMiAwIG9iaiA8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmogMyAwIG9iaiA8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94WzAgMCA1OTUgODQyXS9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNCAwIFI+Pj4+L0NvbnRlbnRzIDUgMCBSPj4KZW5kb2JqIDQgMCBvYmogPDwvVHlwZS9Gb250L1N1YnR5cGUvVHlwZTEvQmFzZUZvbnQvSGVsdmV0aWNhLUJvbGQ+PgplbmRvYmogNSAwIG9iaiA8PC9MZW5ndGggODU+PnN0cmVhbQpCVC9GMSAyNCBUZiAxIDAgMCAxIDUwIDc1MCBUaiAoU1RVRFlMWUYgVkVSSUZJRUQgUkVTVU1FKSBUaiAwIC0zMCBUZCAoR2VuZXJhdGVkIFByb2ZpbGU6ICkgVGogKFByb2Zlc3Npb25hbCkgVGogRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDA2NyAwMDAwMCBuIAowMDAwMDAwMTIxIDAwMDAwIG4gCjAwMDAwMDAyNTMgMDAwMDAgbiAKMDAwMDAwMDMzNiAwMDAwMCBuIAp0cmFpbGVyIDw8L1NpemUgNi9Sb290IDEgMCBSPj4Kc3RhcnR4cmVmCjQ3MgolJUVPRgo=";

        const byteCharacters = atob(pdfBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${formData.name.replace(/\s+/g, '_')}_${variant}_Resume.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleProcess = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setStep('IMPROVE');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-24 px-6 font-sans">
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
                                <ShieldCheck className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Proprietary Verification Engine</span>
                            </div>
                            <h1 className="text-6xl sm:text-8xl font-black text-gray-900 mb-8 leading-[0.9] tracking-tighter uppercase italic">
                                Build a <br /><span className="text-[#7C3AED]">Verification-Ready</span> <br /> Resume.
                            </h1>
                            <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
                                Ordinary resumes get filtered. Ours get verified. Build an evidence-backed profile that bypasses the gatekeepers.
                            </p>
                        </header>

                        <div className="grid md:grid-cols-2 gap-8 mb-20 max-w-4xl mx-auto">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                            />
                            <motion.div
                                whileHover={{ y: -5 }}
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                className={`bg-white p-12 rounded-[3.5rem] border-2 transition-all group cursor-pointer text-center flex flex-col items-center ${isDragging ? 'border-[#7C3AED] bg-[#7C3AED]/5' : 'border-gray-100 shadow-xl shadow-gray-200/50'}`}
                            >
                                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-10 transition-all shadow-inner ${isDragging ? 'bg-[#7C3AED] text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-[#7C3AED] group-hover:text-white'}`}>
                                    {isProcessing ? <Loader2 className="w-8 h-8 animate-spin" /> : isDragging ? <FileCode2 className="w-8 h-8 animate-bounce" /> : <Upload className="w-8 h-8" />}
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-4">
                                    {isDragging ? 'Drop Logic Here' : 'Upload Existing'}
                                </h3>
                                <p className="text-sm font-medium text-gray-500 leading-relaxed">
                                    {isDragging ? 'Release to initiate verification.' : 'Drag & drop or select PDF/DOC to deconstruct.'}
                                </p>
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -5 }}
                                onClick={() => setStep('FORM')}
                                className="bg-[#111827] p-12 rounded-[3.5rem] text-white shadow-2xl group cursor-pointer text-center flex flex-col items-center relative overflow-hidden"
                            >
                                <div className="w-20 h-20 bg-white/10 text-white rounded-3xl flex items-center justify-center mb-10 group-hover:bg-[#7C3AED] transition-all relative z-10">
                                    <Plus className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tight mb-4 relative z-10">Build From Scratch</h3>
                                <p className="text-sm font-medium text-white/50 leading-relaxed relative z-10">Architect your logical authority from the ground up.</p>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED]/20 rounded-full blur-[60px]" />
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* ── STEP 2 & 3: FORM & IMPROVE ── */}
                {(step === 'FORM' || step === 'IMPROVE') && (
                    <motion.div
                        key="form-improve"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-6xl mx-auto"
                    >
                        <div className="flex flex-col lg:flex-row gap-12">
                            {/* Left: Editor */}
                            <div className="lg:w-2/3 space-y-8">
                                <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-xl overflow-hidden relative">
                                    <div className="flex justify-between items-center mb-12">
                                        <h2 className="text-3xl font-black uppercase tracking-tighter">Profile <span className="text-[#7C3AED]">Draft</span></h2>
                                        {step === 'IMPROVE' && (
                                            <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100 italic">
                                                <Sparkles className="w-3 h-3" /> AI Verification Active
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-10">
                                        <div className="grid md:grid-cols-2 gap-10">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Full Identity</label>
                                                <input
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-gray-800 focus:ring-2 focus:ring-[#7C3AED]/20"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Target Authority</label>
                                                <input
                                                    value={formData.role}
                                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-gray-800 focus:ring-2 focus:ring-[#7C3AED]/20"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3 relative group">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 flex justify-between">
                                                Skill Matrix
                                                {step === 'IMPROVE' && <span className="text-[#7C3AED] lowercase italic">"Verify these skills"</span>}
                                            </label>
                                            <textarea
                                                value={formData.skills}
                                                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                                className={`w-full bg-gray-50 border-none rounded-3xl p-6 font-bold text-gray-800 h-32 focus:ring-2 focus:ring-[#7C3AED]/20 ${step === 'IMPROVE' ? 'ring-2 ring-purple-100' : ''}`}
                                            />
                                            {step === 'IMPROVE' && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                                    className="absolute -right-4 top-20 bg-purple-600 text-white p-4 rounded-2xl shadow-xl max-w-[180px] z-20 pointer-events-none"
                                                >
                                                    <p className="text-[10px] font-black uppercase mb-1 flex items-center gap-1"><Brain className="w-3 h-3" /> SUGGESTION</p>
                                                    <p className="text-[11px] font-medium leading-tight">Add "Distributed Systems" for Google alignment.</p>
                                                </motion.div>
                                            )}
                                        </div>

                                        <div className="space-y-8">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Institutional History</h4>
                                                <button className="text-[#7C3AED] text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Plus size={14} /> Add Experience</button>
                                            </div>
                                            {experience.map((exp, i) => (
                                                <div key={i} className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 flex gap-6 group relative">
                                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-300 group-hover:text-[#7C3AED] transition-all shadow-sm">
                                                        <Building2 size={24} />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <div className="flex justify-between mb-2">
                                                            <h5 className="font-black text-gray-900 uppercase tracking-tight">{exp.company}</h5>
                                                            <span className="text-[10px] font-black text-gray-400 uppercase">{exp.duration}</span>
                                                        </div>
                                                        <p className="text-xs font-bold text-[#7C3AED] mb-4 uppercase tracking-widest">{exp.role}</p>
                                                        <p className="text-xs text-gray-500 font-medium leading-relaxed">{exp.bullets}</p>
                                                    </div>
                                                    {step === 'IMPROVE' && (
                                                        <div className="absolute -bottom-2 -right-2 bg-white p-3 rounded-full shadow-lg border border-gray-100 text-[#7C3AED]">
                                                            <Sparkles size={14} className="animate-pulse" />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <button onClick={() => setStep('INTRO')} className="text-gray-400 font-black text-[10px] uppercase tracking-widest px-8 py-5">Discard Logic</button>
                                    <button
                                        onClick={step === 'FORM' ? handleProcess : () => setStep('GENERATE')}
                                        className="bg-[#111827] text-white px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:bg-[#7C3AED] transition-all flex items-center gap-4"
                                    >
                                        {isProcessing ? <Loader2 className="animate-spin" /> : step === 'FORM' ? "Initiate AI Audit" : "Commit to Versions"} <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Right: AI Feedback Sidebar */}
                            <div className="lg:w-1/3 space-y-8">
                                <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-3 mb-10 pb-6 border-b border-gray-50">
                                        <Brain className="w-5 h-5 text-[#7C3AED]" />
                                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-900">AI Logic Audit</h4>
                                    </div>

                                    {step === 'FORM' ? (
                                        <div className="py-12 text-center space-y-6">
                                            <div className="w-12 h-12 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-200">
                                                <Layout size={24} />
                                            </div>
                                            <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-[180px] mx-auto uppercase tracking-widest">Awaiting profile data commit for synthesis...</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            {AI_SUGGESTIONS.map((s, i) => (
                                                <motion.div
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    key={i}
                                                    className="group"
                                                >
                                                    <div className="flex justify-between items-center mb-3">
                                                        <span className="text-[10px] font-black text-[#7C3AED] uppercase tracking-widest underline decoration-2 underline-offset-4">{s.target}</span>
                                                        <span className="text-[9px] font-black text-green-500 uppercase tracking-tighter bg-green-50 px-2 py-1 rounded-md">{s.score}</span>
                                                    </div>
                                                    <p className="text-xs font-bold text-gray-600 leading-relaxed italic border-l-2 border-gray-100 pl-4 group-hover:border-[#7C3AED] transition-all">"{s.suggestion}"</p>
                                                </motion.div>
                                            ))}

                                            <div className="pt-6 border-t border-gray-50 flex items-center gap-4">
                                                <div className="flex-grow">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Affinity Score</p>
                                                    <p className="text-2xl font-black text-gray-900 tracking-tighter uppercase">82% <span className="text-green-500 text-xs tracking-normal font-bold">+12</span></p>
                                                </div>
                                                <div className="w-12 h-12 bg-[#7C3AED]/5 rounded-xl flex items-center justify-center text-[#7C3AED]">
                                                    <Rocket size={24} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-[#f0f4ff] p-8 rounded-[2.5rem] border border-blue-50">
                                    <h5 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2 italic">
                                        <Zap className="w-3.5 h-3.5" /> Strategy Focus
                                    </h5>
                                    <p className="text-[11px] font-medium text-blue-800/70 leading-relaxed mb-6">
                                        "Your profile currently displays strong technical execution but lacks the senior-level ownership language favored by MNCs like Google."
                                    </p>
                                    <button className="text-blue-600 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-3 transition-all">Apply All Corrections <ChevronRight size={12} /></button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── STEP 4: GENERATE VERSIONS ── */}
                {step === 'GENERATE' && (
                    <motion.div
                        key="generate"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-7xl mx-auto"
                    >
                        <div className="mb-20">
                            <div className="flex items-center gap-2 text-green-500 mb-6 font-black uppercase text-[10px] tracking-[0.4em]">
                                <CheckCircle2 size={16} /> Synthesis Complete
                            </div>
                            <h1 className="text-6xl sm:text-8xl font-black text-gray-900 leading-[0.8] tracking-tighter uppercase italic mb-8">
                                Clinical <br /> <span className="text-[#7C3AED]">Generation.</span>
                            </h1>
                            <p className="text-xl text-gray-500 font-medium max-w-2xl leading-relaxed">
                                We have refactored your profile into three distinct target formats. Each is optimized for specific institutional heuristics.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 mb-16">
                            {[
                                {
                                    id: 'recruiter',
                                    title: 'The Recruiter Protocol',
                                    desc: 'Optimized for high-speed scanning and buzzword-rich parsing logic.',
                                    icon: <Search className="w-8 h-8" />,
                                    color: 'from-blue-100 to-indigo-50',
                                    text: 'text-blue-600'
                                },
                                {
                                    id: 'startup',
                                    title: 'The Startup Blueprint',
                                    desc: 'Highlights raw ownership, speed, and cross-functional capacity.',
                                    icon: <Rocket className="w-8 h-8" />,
                                    color: 'from-purple-100 to-fuchsia-50',
                                    text: 'text-purple-600'
                                },
                                {
                                    id: 'mnc',
                                    title: 'The MNC Standards',
                                    desc: 'Clinical, standardized layout emphasizing scale, reliability, and precision.',
                                    icon: <Building2 className="w-8 h-8" />,
                                    color: 'from-slate-200 to-gray-50',
                                    text: 'text-slate-600'
                                }
                            ].map((v, i) => (
                                <motion.div
                                    whileHover={{ y: -10 }}
                                    key={v.id}
                                    className="bg-white rounded-[3.5rem] p-12 border border-gray-100 shadow-xl shadow-gray-200/50 group flex flex-col items-center text-center"
                                >
                                    <div className={`w-20 h-20 bg-gradient-to-br ${v.color} ${v.text} rounded-[2rem] flex items-center justify-center mb-10 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                                        {v.icon}
                                    </div>
                                    <h3 className="text-2xl font-black uppercase tracking-tight mb-6">{v.title}</h3>
                                    <p className="text-sm font-medium text-gray-500 leading-relaxed mb-10 flex-grow">{v.desc}</p>
                                    <button
                                        onClick={() => handleDownload(v.id)}
                                        className="w-full py-5 bg-[#111827] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[#7C3AED] transition-all flex items-center justify-center gap-3 shadow-xl"
                                    >
                                        Download PDF <Download size={14} />
                                    </button>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10 border-t border-gray-100">
                            <button
                                onClick={() => setStep('FORM')}
                                className="flex items-center gap-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest hover:text-gray-900 transition-all"
                            >
                                <RotateCcw className="w-4 h-4" /> Reset Architect
                            </button>
                            <button
                                onClick={() => navigate('/dashboard/learner')}
                                className="px-12 py-6 bg-white border border-gray-100 text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-3 shadow-sm"
                            >
                                Exit to Dashboard <ChevronRight size={14} />
                            </button>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
            <div className="fixed inset-0 bg-grid-black/[0.02] pointer-events-none -z-10" />
        </div>
    );
};

export default ResumeBuilder;
