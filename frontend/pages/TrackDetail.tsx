import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronRight,
    Star,
    Users,
    Clock,
    Award,
    CheckCircle2,
    ArrowRight,
    PlayCircle,
    Briefcase,
    Zap,
    Shield,
    Layout,
    Cpu,
    Database,
    Search,
    MessageSquare
} from 'lucide-react';

/* ─────────────────────────── track detail data ─────────────────────────── */
const trackDetails: Record<string, any> = {
    ai: {
        title: 'Artificial Intelligence',
        subtitle: 'Master the Intelligence Protocol',
        accent: '#7C3AED',
        accentLight: '#F5F3FF',
        heroImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop',
        description: 'Transform from a consumer of AI to a creator. This track focuses on building production-grade intelligence systems using transformer architectures, RAG, and MLOps.',
        outcomes: ['AI Engineer', 'MLOps Specialist', 'NLP Researcher', 'Prompt Architect'],
        stats: { students: '4.2k+', rating: 4.9, courses: 12 },
        roadmap: [
            { step: '01', title: 'Calculus & Linear Algebra for AI', desc: 'The mathematical foundations of backpropagation and gradients.' },
            { step: '02', title: 'Deep Learning Architectures', desc: 'CNNs, RNNs, and the rise of Transformers.' },
            { step: '03', title: 'LLM & Prompt Engineering', desc: 'Mastering GPT-4, Llama, and Claude for production.' },
            { step: '04', title: 'Vector DBs & RAG', desc: 'Retrieval Augmented Generation with Pinecone and LangChain.' },
            { step: '05', title: 'AI Deployment (MLOps)', desc: 'Deploying models at scale with Docker and Kubernetes.' },
        ],
        projects: [
            { name: 'RAG Knowledge Base', desc: 'Build a system that chats with 10,000+ proprietary PDF documents.', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop' },
            { name: 'Real-time Object Detection', desc: 'Train a YOLOv8 model for autonomous drone navigation.', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop' },
        ],
        mentors: [
            { name: 'Dr. Sarah Chen', role: 'Ex-Google Brain', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
            { name: 'Marc Rivera', role: 'Staff ML @ Meta', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marc' },
        ],
        pricing: { monthly: 29, yearly: 299 },
        testimonials: [
            { text: "Studlyf's AI track changed my career. I went from frontend dev to AI engineer at a top startup within 4 months.", author: "Alex K.", role: "AI Engineer @ Glean" }
        ]
    },
    swe: {
        title: 'Software Engineering',
        subtitle: 'Architect the Future',
        accent: '#1D74F2',
        accentLight: '#EFF6FF',
        heroImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&auto=format&fit=crop',
        description: 'A deep dive into building highly scalable, resilient, and performant distributed systems. Go beyond syntax into the realm of system ownership.',
        outcomes: ['Full-stack Architect', 'Backend Lead', 'System Designer', 'DevOps Engineer'],
        stats: { students: '8.5k+', rating: 4.8, courses: 18 },
        roadmap: [
            { step: '01', title: 'Production DSA', desc: 'Data structures used in real-world databases and caches.' },
            { step: '02', title: 'Distributed Systems', desc: 'CAP Theorem, Consensus algorithms, and Partitioning.' },
            { step: '03', title: 'Microservices Architecture', desc: 'Communication patterns, gRPC, and RabbitMQ.' },
            { step: '04', title: 'High-Scale Frontend', desc: 'Advanced React patterns and performance optimization.' },
            { step: '05', title: 'Site Reliability (SRE)', desc: 'Monitoring, observability, and incident response.' },
        ],
        projects: [
            { name: 'TradeFlow Engine', desc: 'Build a high-frequency trading engine that handles 100k transactions/sec.', img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&auto=format&fit=crop' },
            { name: 'Nexus Social Graph', desc: 'Architect a Neo4j-backed social network with real-time feeds.', img: 'https://images.unsplash.com/photo-1522542550221-31fd19255a78?w=400&auto=format&fit=crop' },
        ],
        mentors: [
            { name: 'James Wilson', role: 'Distinguished Eng @ Netflix', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
            { name: 'Elena Petrova', role: 'Ex-Amazon Tech Lead', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
        ],
        pricing: { monthly: 25, yearly: 249 },
        testimonials: [
            { text: "The focus on system design rather than just coding is what sets this track apart. I finally 'get' scalability.", author: "Rohan M.", role: "Senior Dev @ Stripe" }
        ]
    },
    data: {
        title: 'Data & Analytics',
        subtitle: 'Unlock Hidden Evidence',
        accent: '#059669',
        accentLight: '#ECFDF5',
        heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop',
        description: 'Master the full data lifecycle. From building scalable data pipelines to extracting predictive insights that drive multi-billion dollar decisions.',
        outcomes: ['Data Engineer', 'Analytics Lead', 'Business Intelligence Expert', 'ML Data Scientist'],
        stats: { students: '3.1k+', rating: 4.7, courses: 10 },
        roadmap: [
            { step: '01', title: 'Advanced SQL Protocols', desc: 'Window functions, CTEs, and query optimization.' },
            { step: '02', title: 'Data Pipeline Engineering', desc: 'Mastering Airflow, Spark, and dbt for ELT flows.' },
            { step: '03', title: 'Cloud Data Warehousing', desc: 'Snowflake, BigQuery, and Databricks architecture.' },
            { step: '04', title: 'Predictive Modeling', desc: 'Statistical analysis and forecasting with Python.' },
            { step: '05', title: 'Explanability & Dashboarding', desc: 'Creating executive-ready evidence visualizations.' },
        ],
        projects: [
            { name: 'HealthInsights Pipeline', desc: 'A real-time analytics pipeline for hospital patient data.', img: 'https://images.unsplash.com/photo-1504868584819-f8eec4b6d730?w=400&auto=format&fit=crop' },
            { name: 'FraudLens AI', desc: 'Identify fraudulent transactions in credit card data using isolation forests.', img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&auto=format&fit=crop' },
        ],
        mentors: [
            { name: 'Karthik Raja', role: 'Head of Data @ Grab', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karthik' },
            { name: 'Dr. Linda Miller', role: 'Ex-Tableau Researcher', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linda' },
        ],
        pricing: { monthly: 22, yearly: 219 },
        testimonials: [
            { text: "Moving from Excel to Spark was daunting, but the curriculum is so practical. I built my first pipeline in 3 weeks.", author: "Sunita P.", role: "Analytics Lead @ Zomato" }
        ]
    },
    pm: {
        title: 'Product Management',
        subtitle: 'Own the Vision',
        accent: '#F59E0B',
        accentLight: '#FFFBEB',
        heroImage: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=1200&auto=format&fit=crop',
        description: 'Learn to lead engineering teams without writing code. Master the art of product discovery, ruthlessly prioritize, and ship high-impact features.',
        outcomes: ['Product Manager', 'Growth Lead', 'Startup Founder', 'Product Analyst'],
        stats: { students: '5.6k+', rating: 4.9, courses: 14 },
        roadmap: [
            { step: '01', title: 'Product Discovery', desc: 'Identifying user pain points and market gaps.' },
            { step: '02', title: 'Agile & Execution', desc: 'Working with engineering teams and managing backlogs.' },
            { step: '03', title: 'Data-Driven PM', desc: 'A/B testing, funnel analysis, and unit economics.' },
            { step: '04', title: 'Stakeholder Strategy', desc: 'Managing expectations and influencing without authority.' },
            { step: '05', title: 'GTM Strategy', desc: 'Planning the launch and growth of new products.' },
        ],
        projects: [
            { name: 'Fintech App Blueprint', desc: 'Create a full PRD and design for a next-gen neo-bank.', img: 'https://images.unsplash.com/photo-1512428559083-a4019323af7c?w=400&auto=format&fit=crop' },
            { name: 'SaaS Expansion Plan', desc: 'Design a feature set for Slack to enter the healthcare market.', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop' },
        ],
        mentors: [
            { name: 'Sanjay Gupta', role: 'VP Product @ Swiggy', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sanjay' },
            { name: 'Victoria Kim', role: 'PM @ Uber', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Victoria' },
        ],
        pricing: { monthly: 35, yearly: 349 },
        testimonials: [
            { text: "This track taught me the language of engineering. I can now effectively lead teams and ship products that users love.", author: "Jessica L.", role: "PM @ Coinbase" }
        ]
    },
    cyber: {
        title: 'Cyber Security',
        subtitle: 'Defend the Perimeter',
        accent: '#DC2626',
        accentLight: '#FEF2F2',
        heroImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop',
        description: 'Master the tools and tactics of modern cybersecurity. From ethical hacking and penetration testing to building intrusion detection systems.',
        outcomes: ['SOC Analyst', 'Security Engineer', 'Pentester', 'Compliance Officer'],
        stats: { students: '2.8k+', rating: 4.8, courses: 11 },
        roadmap: [
            { step: '01', title: 'Networking Fundamentals', desc: 'How data actually moves — TCP/IP, DNS, and HTTP.' },
            { step: '02', title: 'Offensive Security', desc: 'Ethical hacking, SQL injection, and XSS.' },
            { step: '03', title: 'Defensive Strategy', desc: 'SIEM tools, firewalls, and incident response.' },
            { step: '04', title: 'Cloud Security', desc: 'Securing AWS and Azure infrastructure.' },
            { step: '05', title: 'Identity & Access', desc: 'IAM roles, zero-trust architecture, and 2FA.' },
        ],
        projects: [
            { name: 'Vulnerability Scanner', desc: 'Build a tool that identifies top 10 OWASP threats in a URL.', img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&auto=format&fit=crop' },
            { name: 'Intrusion Detection System', desc: 'Set up a Snort-based IDS to monitor network traffic for attacks.', img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?w=400&auto=format&fit=crop' },
        ],
        mentors: [
            { name: 'David Smith', role: 'Security Architect @ Microsoft', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
            { name: 'Rachel Zheng', role: 'CISO @ Top Startup', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel' },
        ],
        pricing: { monthly: 30, yearly: 299 },
        testimonials: [
            { text: "The capture-the-flag challenges are amazing. It really feels like doing the job while you learn.", author: "Ivan G.", role: "Security Analyst @ IBM" }
        ]
    }
};

/* ─────────────────────────── component ─────────────────────────── */
const TrackDetail: React.FC = () => {
    const { trackId } = useParams<{ trackId: string }>();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);

    const detail = trackId ? trackDetails[trackId] : null;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [trackId]);

    const handleStartLearning = (plan?: string) => {
        navigate(`/learn/enroll/${trackId}${plan ? `?plan=${plan}` : ''}`);
    };

    if (!detail) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-black text-gray-900 mb-4">Track Not Found</h2>
                    <button onClick={() => navigate('/learn/courses-overview')} className="text-[#7C3AED] font-bold underline">Back to Overview</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* ── hero header ── */}
            <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src={detail.heroImage} className="w-full h-full object-cover" alt={detail.title} />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="max-w-3xl"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.3em]">
                                {detail.subtitle}
                            </span>
                            <div className="flex items-center gap-1.5">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span className="text-white font-bold text-sm">{detail.stats.rating} Score</span>
                            </div>
                        </div>

                        <h1 className="text-6xl sm:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase mb-6">
                            {detail.title.split(' ').map((word: string, i: number) => (
                                <span key={i} className={i % 2 !== 0 ? 'text-white/40' : ''}>{word} <br /></span>
                            ))}
                        </h1>

                        <p className="text-white/70 text-lg sm:text-xl font-medium leading-relaxed mb-10 max-w-xl">
                            {detail.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-6">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleStartLearning()}
                                className="px-10 py-5 bg-white text-black font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-2xl flex items-center gap-3"
                            >
                                Start Learning <ArrowRight className="w-4 h-4" />
                            </motion.button>
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${detail.title}${i}`} className="w-10 h-10 rounded-full border-2 border-black" alt="student" />
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-black bg-gray-900 flex items-center justify-center text-[10px] text-white font-bold">
                                    +{detail.stats.students}
                                </div>
                            </div>
                            <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Enrolled Learners</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── stats bar ── */}
            <div className="bg-gray-50 border-y border-gray-100 py-10">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { icon: Users, label: 'Alumni Network', value: detail.stats.students },
                        { icon: Star, label: 'Course Rating', value: `${detail.stats.rating}/5.0` },
                        { icon: PlayCircle, label: 'Modules', value: detail.stats.courses },
                        { icon: Award, label: 'Certification', value: 'Verified' },
                    ].map((s, i) => (
                        <div key={i} className="flex flex-col items-center text-center">
                            <s.icon className="w-5 h-5 mb-3" style={{ color: detail.accent }} />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                            <p className="text-2xl font-black text-gray-900">{s.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── curriculum roadmap ── */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
                    <div className="max-w-xl">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] mb-4 block" style={{ color: detail.accent }}>Curriculum Roadmap</span>
                        <h2 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tighter leading-tight uppercase">
                            The Path to <br /> <span style={{ color: detail.accent }}>Engineering Authority</span>.
                        </h2>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">16-Week Intensive Track</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    <div className="lg:col-span-4 space-y-4">
                        {detail.roadmap.map((step: any, i: number) => (
                            <motion.div
                                key={i}
                                onMouseEnter={() => setActiveStep(i)}
                                className={`p-6 rounded-2xl cursor-pointer transition-all border ${activeStep === i
                                    ? 'bg-white shadow-2xl scale-105 border-gray-100'
                                    : 'bg-transparent border-transparent opacity-50 grayscale'
                                    }`}
                            >
                                <span className="text-2xl font-black mb-2 block" style={{ color: activeStep === i ? detail.accent : '#D1D5DB' }}>{step.step}</span>
                                <h3 className="text-lg font-black text-gray-900 mb-1">{step.title}</h3>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="lg:col-span-8 relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-gray-900 rounded-[3rem] p-12 overflow-hidden relative min-h-[500px] flex flex-col justify-center"
                            >
                                <div className="relative z-10">
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] mb-4 block">Currently Viewing</span>
                                    <h2 className="text-5xl font-black text-white tracking-tighter mb-8 leading-tight">
                                        {detail.roadmap[activeStep].title}
                                    </h2>
                                    <p className="text-white/60 text-lg leading-relaxed max-w-xl">
                                        In this phase, you will deep dive into {detail.roadmap[activeStep].desc}. This is critical for building verified clinical evidence in your role as a {detail.outcomes[0]}.
                                    </p>

                                    <div className="mt-12 grid grid-cols-2 gap-8">
                                        <div>
                                            <p className="text-[10px] font-black text-[#A78BFA] uppercase tracking-widest mb-3">Key Tools</p>
                                            <div className="flex gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center"><Cpu className="w-5 h-5 text-white/40" /></div>
                                                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center"><Database className="w-5 h-5 text-white/40" /></div>
                                                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center"><Zap className="w-5 h-5 text-white/40" /></div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-[#A78BFA] uppercase tracking-widest mb-3">Outcome Role</p>
                                            <p className="text-white font-bold">{detail.outcomes[activeStep % detail.outcomes.length]}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                                    <div className="absolute inset-0 bg-grid-white/[0.05]" />
                                </div>
                                <div
                                    className="absolute bottom-[-100px] right-[-100px] w-80 h-80 rounded-full blur-[120px] opacity-30"
                                    style={{ background: detail.accent }}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* ── projects section ── */}
            <section className="bg-gray-50 py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] mb-4 block">Real Projects</span>
                        <h2 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tighter uppercase">Build Your <span style={{ color: detail.accent }}>Evidence</span>.</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                        {detail.projects.map((proj: any, i: number) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl transition-all"
                            >
                                <div className="h-72 overflow-hidden">
                                    <img src={proj.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={proj.name} />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                                </div>
                                <div className="p-10">
                                    <h3 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tighter">{proj.name}</h3>
                                    <p className="text-gray-500 leading-relaxed mb-8">{proj.desc}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#7C3AED] bg-[#F5F3FF] px-4 py-2 rounded-xl">Portfolio Ready</span>
                                        <button className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── mentors & cert ── */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] mb-4 block">Industry Authority</span>
                        <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tighter uppercase mb-8 leading-tight">
                            Guided by <br /> <span style={{ color: detail.accent }}>Elite Architects</span>.
                        </h2>
                        <div className="space-y-8">
                            {detail.mentors.map((m: any, i: number) => (
                                <div key={i} className="flex items-center gap-6">
                                    <img src={m.img} className="w-20 h-20 rounded-2xl bg-gray-100 border border-gray-100" alt={m.name} />
                                    <div>
                                        <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter">{m.name}</h4>
                                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">{m.role}</p>
                                        <div className="flex gap-2 mt-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100"><MessageSquare className="w-4 h-4 text-gray-400" /></div>
                                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100"><Search className="w-4 h-4 text-gray-400" /></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 bg-[#111827] rounded-3xl p-10 relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-white text-2xl font-black uppercase tracking-tighter mb-4">Outcome Roles</h3>
                                <div className="flex flex-wrap gap-3">
                                    {detail.outcomes.map((role: string) => (
                                        <span key={role} className="px-4 py-2 border border-white/20 rounded-xl text-white/70 text-[10px] font-bold uppercase tracking-widest">
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <Briefcase className="absolute -bottom-10 -right-10 w-40 h-40 text-white/5 rotate-12" />
                        </div>
                    </div>

                    <div className="relative">
                        <div className="bg-white rounded-[3rem] p-4 shadow-2xl border border-gray-100 relative group">
                            <div className="rounded-[2.5rem] border-[10px] border-gray-50 p-10 flex flex-col items-center text-center">
                                <div className="mb-12">
                                    <Award className="w-24 h-24 mx-auto mb-6" style={{ color: detail.accent }} />
                                    <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">Certificate of Excellence</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">Proprietary Verification Protocol</p>
                                </div>

                                <div className="w-full border-y border-gray-100 py-10 space-y-6 mb-12">
                                    <p className="text-sm font-medium text-gray-500 italic">This certifies that</p>
                                    <p className="text-4xl font-syne font-black text-gray-900">Johnathan Doe</p>
                                    <p className="text-sm font-medium text-gray-500">has successfully completed the 16-week intensive track in</p>
                                    <p className="text-2xl font-black uppercase tracking-tight" style={{ color: detail.accent }}>{detail.title}</p>
                                </div>

                                <div className="flex items-center gap-10">
                                    <div className="text-center">
                                        <div className="w-20 h-0.5 bg-gray-200 mb-2" />
                                        <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Head of Engineering</p>
                                    </div>
                                    <div className="w-16 h-16 rounded-full border-4 border-gray-50 flex items-center justify-center p-2 opacity-50 grayscale">
                                        <img src="/images/google.png" alt="Google" className="w-full object-contain" />
                                    </div>
                                    <div className="text-center">
                                        <div className="w-20 h-0.5 bg-gray-200 mb-2" />
                                        <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Track Mentor</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 pointer-events-none rounded-[3rem]">
                                <div className="bg-black text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px]">Preview Certificate</div>
                            </div>
                        </div>

                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400 rounded-full blur-[80px] opacity-20" />
                        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-[#7C3AED] rounded-full blur-[100px] opacity-10" />
                    </div>
                </div>
            </section>

            {/* ── pricing section ── */}
            <section className="bg-gray-50 py-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] mb-4 block">Access & Enrollment</span>
                    <h2 className="text-5xl sm:text-7xl font-black text-gray-900 tracking-tighter uppercase mb-6 leading-[0.9]">Invest in Your <br /> <span style={{ color: detail.accent }}>Engineering Future</span>.</h2>
                    <p className="text-gray-500 text-lg font-medium mb-16">No hidden fees. Full access to all modules, mentors, and the hiring pipeline.</p>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-[2.5rem] p-12 border border-gray-100 shadow-sm text-left">
                            <h4 className="text-xl font-black uppercase tracking-tighter mb-2">Monthly Sprint</h4>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-10">Flexible Learning</p>
                            <div className="flex items-baseline gap-2 mb-10">
                                <span className="text-6xl font-black text-gray-900">${detail.pricing.monthly}</span>
                                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">/ Month</span>
                            </div>
                            <ul className="space-y-4 mb-10">
                                {['Access to all Courses', 'Project Reviews', 'Community Support', 'Monthly Mentorship'].map(f => (
                                    <li key={f} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                                        <CheckCircle2 className="w-5 h-5" style={{ color: detail.accent }} /> {f}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handleStartLearning('monthly')} className="w-full py-5 rounded-2xl bg-gray-50 text-gray-900 font-black text-xs uppercase tracking-[0.2em] border border-gray-100 hover:bg-gray-100 transition-all">Choose Plan</button>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-12 border border-[#7C3AED]/20 shadow-2xl relative overflow-hidden text-left">
                            <div className="absolute top-8 right-8 bg-[#7C3AED] text-white px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em]">Save 15%</div>
                            <h4 className="text-xl font-black uppercase tracking-tighter mb-2">Yearly Mastery</h4>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-10">Full Authority Track</p>
                            <div className="flex items-baseline gap-2 mb-10">
                                <span className="text-6xl font-black text-gray-900">${detail.pricing.yearly}</span>
                                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">/ Year</span>
                            </div>
                            <ul className="space-y-4 mb-10">
                                {[...['Access to all Courses', 'Project Reviews', 'Community Support'], 'Hiring Pipeline Access', 'Certificate Included'].map(f => (
                                    <li key={f} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                                        <CheckCircle2 className="w-5 h-5" style={{ color: detail.accent }} /> {f}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleStartLearning('yearly')}
                                className="w-full py-5 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all"
                                style={{ background: `linear-gradient(135deg, ${detail.accent}, ${detail.accent}CC)`, boxShadow: `0 12px 32px -8px ${detail.accent}55` }}
                            >Choose Mastery</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── bottom bar ── */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[50] w-[90%] max-w-4xl bg-white/80 backdrop-blur-2xl border border-gray-200 rounded-3xl p-4 shadow-2xl flex items-center justify-between">
                <div className="flex items-center gap-4 pl-4">
                    <div className="hidden sm:block">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Current selection</p>
                        <p className="text-lg font-black text-gray-900 tracking-tighter uppercase leading-none">{detail.title} Track</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <p className="hidden md:block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Next cohort starts in <span className="text-[#7C3AED]">3 days</span></p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStartLearning()}
                        className="px-10 py-4 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all"
                        style={{ background: `linear-gradient(135deg, ${detail.accent}, ${detail.accent}CC)`, boxShadow: `0 8px 20px -6px ${detail.accent}55` }}
                    >
                        Start Learning
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default TrackDetail;
