import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Clock, BarChart2, BadgeCheck, Briefcase, Users, ArrowRight, Sparkles } from 'lucide-react';

/* ─────────────────────────── track data ─────────────────────────── */
const tracks = [
    {
        id: 'ai',
        label: 'AI',
        fullName: 'Artificial Intelligence',
        emoji: '🤖',
        accent: '#7C3AED',
        accentLight: '#F5F3FF',
        gradient: 'from-violet-600 via-purple-500 to-indigo-500',
        duration: '16 Weeks',
        level: 'Intermediate',
        skills: ['LLMs', 'Deep Learning', 'MLOps', 'PyTorch', 'RAG'],
        hiringTag: 'Top 3 Fastest Growing Role ↑',
        alumni: [
            { name: 'Google', logo: '/images/google.png' },
            { name: 'Nvidia', logo: '/images/nvidia.png' },
            { name: 'Meta', logo: '/images/meta.png' },
        ],
        description:
            'Master modern AI — from transformer architectures to production-grade MLOps. Build real LLM applications and get hired as an AI engineer.',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop',
    },
    {
        id: 'swe',
        label: 'Software Eng',
        fullName: 'Software Engineering',
        emoji: '⚙️',
        accent: '#1D74F2',
        accentLight: '#EFF6FF',
        gradient: 'from-blue-600 via-cyan-500 to-teal-500',
        duration: '14 Weeks',
        level: 'Beginner → Advanced',
        skills: ['System Design', 'DSA', 'React', 'Node.js', 'Microservices'],
        hiringTag: '#1 Hired Track at Studlyf',
        alumni: [
            { name: 'Amazon', logo: '/images/amazon.png' },
            { name: 'Microsoft', logo: '/images/microsoft.png' },
            { name: 'Apple', logo: '/images/apple.png' },
        ],
        description:
            'Full-stack engineering readiness — crack FAANG interviews, build scalable systems, and ship products that matter.',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop',
    },
    {
        id: 'data',
        label: 'Data',
        fullName: 'Data & Analytics',
        emoji: '📊',
        accent: '#059669',
        accentLight: '#ECFDF5',
        gradient: 'from-emerald-600 via-green-500 to-teal-400',
        duration: '12 Weeks',
        level: 'Intermediate',
        skills: ['SQL', 'Python', 'Spark', 'Tableau', 'dbt'],
        hiringTag: '2.3× Salary Boost on Average',
        alumni: [
            { name: 'Netflix', logo: '/images/netflix.png' },
            { name: 'Amazon', logo: '/images/amazon.png' },
            { name: 'IBM', logo: '/images/ibm.png' },
        ],
        description:
            'Turn raw data into business intelligence. Master the full analytics stack from SQL to distributed data pipelines.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
    },
    {
        id: 'pm',
        label: 'PM',
        fullName: 'Product Management',
        emoji: '🚀',
        accent: '#F59E0B',
        accentLight: '#FFFBEB',
        gradient: 'from-amber-500 via-orange-500 to-rose-500',
        duration: '10 Weeks',
        level: 'All Levels',
        skills: ['Roadmapping', 'PRD', 'A/B Testing', 'Agile', 'OKRs'],
        hiringTag: 'Avg CTC 18 LPA for Graduates',
        alumni: [
            { name: 'Google', logo: '/images/google.png' },
            { name: 'Microsoft', logo: '/images/microsoft.png' },
            { name: 'Meta', logo: '/images/meta.png' },
        ],
        description:
            'Lead product from zero to one. Learn to define vision, prioritise ruthlessly, and ship with data-driven confidence.',
        image: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=800&auto=format&fit=crop',
    },
    {
        id: 'cyber',
        label: 'Cyber',
        fullName: 'Cyber Security',
        emoji: '🛡️',
        accent: '#DC2626',
        accentLight: '#FEF2F2',
        gradient: 'from-red-600 via-rose-500 to-pink-500',
        duration: '18 Weeks',
        level: 'Advanced',
        skills: ['Pen Testing', 'SIEM', 'Zero Trust', 'Cloud Security', 'SOC'],
        hiringTag: 'Govt. & Defence Hiring Aligned',
        alumni: [
            { name: 'IBM', logo: '/images/ibm.png' },
            { name: 'Microsoft', logo: '/images/microsoft.png' },
            { name: 'Amazon', logo: '/images/amazon.png' },
        ],
        description:
            'Become a certified defender. Master offensive and defensive security, incident response, and enterprise threat modelling.',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop',
    },
];

/* ─────────────────────────── component ─────────────────────────── */
const CoursesOverview: React.FC = () => {
    const navigate = useNavigate();
    const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
    const [selectedTrack, setSelectedTrack] = useState<string | null>(null);

    const activeTrack = tracks.find(t => t.id === (selectedTrack || hoveredTrack)) || null;

    return (
        <div className="min-h-screen bg-[#FAFAFA] overflow-x-hidden">
            {/* ── hero ── */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                {/* ambient blobs */}
                <div
                    className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none blur-[120px]"
                    style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }}
                />
                <div
                    className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none blur-[100px]"
                    style={{ background: 'radial-gradient(circle, #1D74F2 0%, transparent 70%)' }}
                />

                <div className="max-w-6xl mx-auto text-center relative z-10">
                    {/* breadcrumb pill */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-white border border-[#7C3AED]/15 shadow-sm px-5 py-2 rounded-full mb-8"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                        <span className="text-[10px] font-black text-[#7C3AED] uppercase tracking-[0.4em]">Learn → Courses</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl sm:text-7xl lg:text-8xl font-black text-[#111827] tracking-tighter leading-[0.88] mb-6 uppercase"
                    >
                        Choose Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#6D28D9] to-[#4F46E5]">
                            Engineering Track
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed"
                    >
                        Five elite tracks. Real hiring partners. Verified skills that matter.
                        <br />Pick your path and start building clinical evidence today.
                    </motion.p>
                </div>
            </section>

            {/* ── track cards ── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {tracks.map((track, i) => {
                        const isActive = hoveredTrack === track.id || selectedTrack === track.id;
                        return (
                            <motion.div
                                key={track.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 }}
                                onMouseEnter={() => setHoveredTrack(track.id)}
                                onMouseLeave={() => setHoveredTrack(null)}
                                onClick={() => setSelectedTrack(prev => prev === track.id ? null : track.id)}
                                className="relative rounded-[2rem] overflow-hidden cursor-pointer group select-none"
                                style={{
                                    boxShadow: isActive
                                        ? `0 20px 50px -10px ${track.accent}55`
                                        : '0 4px 24px -4px rgba(0,0,0,0.08)',
                                    transform: isActive ? 'translateY(-8px) scale(1.02)' : 'none',
                                    transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                                }}
                            >
                                {/* background image */}
                                <div className="relative h-56 sm:h-64 overflow-hidden">
                                    <img
                                        src={track.image}
                                        alt={track.fullName}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* gradient overlay */}
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: `linear-gradient(to top, ${track.accent}EE 0%, ${track.accent}88 40%, transparent 100%)`,
                                        }}
                                    />

                                    {/* emoji label */}
                                    <div className="absolute top-4 left-4">
                                        <span className="text-2xl">{track.emoji}</span>
                                    </div>

                                    {/* active indicator */}
                                    {selectedTrack === track.id && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-lg"
                                        >
                                            <BadgeCheck className="w-4 h-4" style={{ color: track.accent }} />
                                        </motion.div>
                                    )}

                                    {/* track name on image */}
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <p className="text-[9px] font-black text-white/60 uppercase tracking-[0.35em] mb-0.5">Track</p>
                                        <h3 className="text-xl font-black text-white leading-tight tracking-tight">{track.fullName}</h3>
                                    </div>
                                </div>

                                {/* card body */}
                                <div className="bg-white p-5 flex flex-col gap-4">
                                    {/* meta row */}
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-500">
                                            <Clock className="w-3 h-3" /> {track.duration}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-500">
                                            <BarChart2 className="w-3 h-3" /> {track.level}
                                        </span>
                                    </div>

                                    {/* skills */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {track.skills.slice(0, 3).map(skill => (
                                            <span
                                                key={skill}
                                                className="text-[8px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-widest"
                                                style={{ background: track.accentLight, color: track.accent }}
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                        {track.skills.length > 3 && (
                                            <span className="text-[8px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-widest bg-gray-100 text-gray-500">
                                                +{track.skills.length - 3}
                                            </span>
                                        )}
                                    </div>

                                    {/* hiring tag */}
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="w-3 h-3 flex-shrink-0" style={{ color: track.accent }} />
                                        <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: track.accent }}>
                                            {track.hiringTag}
                                        </span>
                                    </div>

                                    {/* alumni logos */}
                                    <div className="flex items-center gap-3 border-t border-gray-100 pt-3">
                                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest flex-shrink-0">Alumni at</span>
                                        <div className="flex items-center gap-2">
                                            {track.alumni.slice(0, 3).map(a => (
                                                <img key={a.name} src={a.logo} alt={a.name} className="h-4 object-contain opacity-70 hover:opacity-100 transition-opacity" />
                                            ))}
                                        </div>
                                    </div>

                                    {/* CTA button */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/learn/track/${track.id}`);
                                        }}
                                        className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-[11px] uppercase tracking-[0.2em] text-white transition-all mt-1"
                                        style={{ background: `linear-gradient(135deg, ${track.accent}, ${track.accent}CC)`, boxShadow: `0 8px 24px -4px ${track.accent}55` }}
                                    >
                                        View Track <ChevronRight className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* ── expanded detail panel ── */}
            <AnimatePresence>
                {activeTrack && (
                    <motion.section
                        key={activeTrack.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.4 }}
                        className="max-w-7xl mx-auto px-4 sm:px-8 py-8"
                    >
                        <div
                            className="rounded-[2.5rem] overflow-hidden relative"
                            style={{
                                background: `linear-gradient(135deg, ${activeTrack.accentLight} 0%, ${activeTrack.accentLight}88 50%, #fff 100%)`,
                                border: `1.5px solid ${activeTrack.accent}22`,
                                boxShadow: `0 40px 80px -20px ${activeTrack.accent}25`,
                            }}
                        >
                            <div className="grid lg:grid-cols-2 gap-0">
                                {/* left: info */}
                                <div className="p-10 sm:p-14 flex flex-col justify-center gap-8">
                                    <div>
                                        <span
                                            className="text-[10px] font-black uppercase tracking-[0.5em] mb-3 block"
                                            style={{ color: activeTrack.accent }}
                                        >
                                            {activeTrack.emoji} {activeTrack.fullName} Track
                                        </span>
                                        <h2 className="text-3xl sm:text-5xl font-black text-[#111827] tracking-tighter leading-tight mb-4">
                                            {activeTrack.fullName.split(' ').map((w, i) =>
                                                i === 0 ? <span key={i}>{w}<br /></span> : <span key={i} style={{ color: activeTrack.accent }}>{w} </span>
                                            )}
                                        </h2>
                                        <p className="text-gray-500 leading-relaxed text-base">{activeTrack.description}</p>
                                    </div>

                                    {/* stats row */}
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { icon: Clock, label: 'Duration', value: activeTrack.duration },
                                            { icon: BarChart2, label: 'Level', value: activeTrack.level },
                                            { icon: Users, label: 'Format', value: 'Cohort-based' },
                                        ].map(({ icon: Icon, label, value }) => (
                                            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-white/60 text-center">
                                                <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: activeTrack.accent }} />
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                                                <p className="text-sm font-black text-[#111827] leading-tight">{value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* all skills */}
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mb-3 flex items-center gap-2">
                                            <BadgeCheck className="w-3.5 h-3.5" style={{ color: activeTrack.accent }} />
                                            Verified Skills You'll Build
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {activeTrack.skills.map(skill => (
                                                <span
                                                    key={skill}
                                                    className="text-[10px] font-bold px-4 py-2 rounded-xl uppercase tracking-widest"
                                                    style={{ background: `${activeTrack.accent}18`, color: activeTrack.accent }}
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* alumni */}
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mb-3">Hiring Alignment — Alumni At</p>
                                        <div className="flex items-center gap-5">
                                            {activeTrack.alumni.map(a => (
                                                <img key={a.name} src={a.logo} alt={a.name} className="h-6 object-contain opacity-70" />
                                            ))}
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => navigate(`/learn/track/${activeTrack.id}`)}
                                            className="flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] text-white shadow-xl transition-all"
                                            style={{ background: `linear-gradient(135deg, ${activeTrack.accent}, ${activeTrack.accent}BB)`, boxShadow: `0 12px 32px -8px ${activeTrack.accent}55` }}
                                        >
                                            View Details <ArrowRight className="w-4 h-4" />
                                        </motion.button>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            {activeTrack.hiringTag}
                                        </span>
                                    </div>
                                </div>

                                {/* right: image */}
                                <div className="relative hidden lg:block min-h-[420px] overflow-hidden">
                                    <img
                                        src={activeTrack.image}
                                        alt={activeTrack.fullName}
                                        className="w-full h-full object-cover"
                                    />
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: `linear-gradient(to right, ${activeTrack.accentLight}EE 0%, transparent 50%), linear-gradient(to top, ${activeTrack.accent}CC 0%, transparent 60%)`,
                                        }}
                                    />
                                    {/* floating badge */}
                                    <div className="absolute bottom-10 left-10">
                                        <div
                                            className="bg-white/90 backdrop-blur-xl rounded-2xl px-6 py-4 shadow-2xl border border-white/60"
                                            style={{ boxShadow: `0 20px 50px -10px ${activeTrack.accent}40` }}
                                        >
                                            <p className="text-[8px] font-black uppercase tracking-[0.4em] mb-1" style={{ color: activeTrack.accent }}>
                                                Hiring Alignment
                                            </p>
                                            <p className="text-xl font-black text-[#111827]">{activeTrack.hiringTag}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            {/* ── bottom trust bar ── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-4 pb-24">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="bg-[#111827] rounded-[2.5rem] p-10 sm:p-14 flex flex-col sm:flex-row items-center justify-between gap-10"
                >
                    <div>
                        <p className="text-[10px] font-black text-[#A78BFA] uppercase tracking-[0.5em] mb-3">Not sure which track?</p>
                        <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tighter leading-tight">
                            Take our Career Fit <br />
                            <span className="text-[#A78BFA]">Assessment.</span>
                        </h3>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate('/learn/career-fit')}
                            className="px-10 py-4 bg-[#7C3AED] text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-violet-900/30 hover:bg-[#6D28D9] transition-all flex items-center gap-3"
                        >
                            Start Assessment <ArrowRight className="w-4 h-4" />
                        </motion.button>
                        <button
                            onClick={() => navigate('/learn/courses')}
                            className="px-10 py-4 bg-white/10 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl border border-white/10 hover:bg-white/20 transition-all"
                        >
                            Browse All Courses
                        </button>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default CoursesOverview;
