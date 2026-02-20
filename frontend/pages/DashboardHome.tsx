
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Target, Zap, Shield, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollVelocityContainer, ScrollVelocityRow } from '../registry/magicui/scroll-based-velocity';
import { AuroraText } from '../registry/magicui/aurora-text';
import { TypewriterEffectSmooth } from '../registry/aceternity/typewriter-effect';

const DashboardHome: React.FC = () => {
    const { user } = useAuth();

    const typewriterWords = [
        { text: "YOUR" },
        { text: "CAREER" },
        { text: "STARTS" },
        { text: "HERE", className: "text-[#7C3AED]" },
    ];

    const features = [
        {
            title: "Hero Tracks",
            desc: "Role-focused engineering specialization for elite readiness.",
            icon: Zap,
            to: "/learn/courses"
        },
        {
            title: "Skill Assessment",
            desc: "Identify your strengths with clinical scoring maps.",
            icon: Target,
            to: "/learn/assessment"
        },
        {
            title: "Proof of Skill",
            desc: "Build evidence-based developer portfolios.",
            icon: Shield,
            to: "/job-prep/portfolio"
        },
        {
            title: "Clinical Resumes",
            desc: "Instant verification-ready resumes for partners.",
            icon: BookOpen,
            to: "/job-prep/resume-builder"
        }
    ];

    const courses = [
        {
            title: "Software Engineering",
            school: "Engineering",
            image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop"
        },
        {
            title: "Artificial Intelligence",
            school: "Intelligence",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop"
        },
        {
            title: "Product Management",
            school: "Management",
            image: "https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=800&auto=format&fit=crop"
        },
        {
            title: "Data & Analytics",
            school: "Data Science",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop"
        },
        {
            title: "Cyber Security",
            school: "Security",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop"
        },
    ];

    const scrollCarousel = (id: string, direction: 'left' | 'right') => {
        const container = document.getElementById(id);
        if (container) {
            const scrollAmount = 400;
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="min-h-screen overflow-x-hidden">
            {/* Confined Background Video and Overlay for First Two Sections Only */}
            <div className="relative overflow-hidden">
                {/* Video background only for this wrapper */}
                <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden h-full">
                    <video
                        src="/videos/grok-video-5d92d925-3329-4a1d-9278-b909d93b37ef (1).mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover opacity-[0.65]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/20" />
                </div>
                {/* ── Brighter Horizontal Greeting Card (Expanded & More Transparent) ── */}
                <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 pt-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="mb-16 rounded-[4rem] overflow-hidden py-24 flex flex-col items-center justify-center gap-16 relative bg-transparent shadow-2xl"
                    >
                        <div className="flex flex-col items-center gap-6 relative z-20">
                            <TypewriterEffectSmooth words={typewriterWords} />
                            <p className="text-[11px] sm:text-[14px] font-bold text-gray-800 uppercase tracking-[0.3em] max-w-2xl text-center leading-relaxed opacity-70">
                                Studlyf -- Building the student internet <br />
                                <span className="text-blue-600">for Next generation</span>
                            </p>
                        </div>
                        {/* Trust Section */}
                        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-16 relative z-20 mt-4 px-8 sm:px-16">
                            {/* Built by Group */}
                            <div className="flex flex-col items-center gap-10">
                                <span className="text-[12px] font-black text-black uppercase tracking-[0.4em] leading-none">Built by alumni of</span>
                                <div className="flex items-center gap-16">
                                    <div className="flex items-center gap-4">
                                        <img src="https://cdn.simpleicons.org/google/000000" className="h-8" alt="Google" />
                                        <span className="font-bold text-black tracking-tight text-lg">Google</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <img src="https://cdn.simpleicons.org/amazon/000000" className="h-8" alt="Amazon" />
                                        <span className="font-bold text-black tracking-tight text-lg uppercase">amazon</span>
                                    </div>
                                </div>
                            </div>
                            {/* Backed by Group */}
                            <div className="flex flex-col items-center gap-10">
                                <span className="text-[12px] font-black text-black uppercase tracking-[0.4em] leading-none">Backed by</span>
                                <div className="flex items-center gap-16 justify-center">
                                    <div className="flex items-center gap-4">
                                        <img src="https://cdn.simpleicons.org/ycombinator/000000" className="h-8" alt="Y Combinator" />
                                        <span className="font-bold text-black tracking-tight text-lg">Combinator</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Zap className="w-7 h-7 text-black fill-current" />
                                        <span className="font-bold text-black tracking-tight text-lg">Rebright</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Interior Glow */}
                        <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                    </motion.div>
                </div>
                {/* ── Courses Carousel Section ── */}
                <section className="mb-12 relative">
                    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-start gap-16 mb-8">
                        <div className="lg:w-1/4 pt-32 lg:pl-8">
                            <h2 className="text-4xl sm:text-5xl font-black text-[#111827] leading-[0.85] mb-8 tracking-tighter uppercase">
                                Courses <br />
                                For Every <br />
                                <span className="text-gray-400 italic font-medium lowercase">Ambition</span>
                            </h2>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.25em] leading-relaxed opacity-70">
                                Global training for <br /> role-ready excellence.
                            </p>
                        </div>
                        <div className="lg:w-3/4 w-full relative group">
                            {/* Carousel Content */}
                            <div
                                id="course-carousel"
                                className="flex gap-6 overflow-x-auto pb-4 pt-4 no-scrollbar scroll-smooth snap-x"
                            >
                                {courses.map((course, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ y: -10 }}
                                        className="min-w-[calc(100%-1rem)] sm:min-w-[calc(50%-0.75rem)] lg:min-w-[calc(33.333%-1rem)] h-[400px] flex-shrink-0 snap-start rounded-[2.2rem] overflow-hidden relative group/card shadow-lg transition-all duration-700 cursor-pointer"
                                    >
                                        {/* Full Card Background Image */}
                                        <div className="absolute inset-0">
                                            <img
                                                src={course.image}
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-1000"
                                            />
                                            <div className="absolute inset-0 bg-black/5 group-hover/card:bg-black/15 transition-colors duration-500" />
                                        </div>
                                        {/* Further Compact Sub-Card Pod */}
                                        <div className="absolute inset-x-5 bottom-5">
                                            <div className="bg-white rounded-[1.5rem] p-4 shadow-[0_12px_35px_rgba(0,0,0,0.1)] transform translate-y-1 group-hover/card:translate-y-0 transition-all duration-500">
                                                <div className="flex flex-col gap-0.5 mb-3">
                                                    <span className="text-[8px] font-black text-blue-600 uppercase tracking-[0.2em] block">
                                                        School of {course.school}
                                                    </span>
                                                    <h3 className="text-base font-black text-[#111827] tracking-tighter leading-tight">
                                                        {course.title}
                                                    </h3>
                                                </div>
                                                <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">
                                                            Elite Track
                                                        </span>
                                                        <span className="text-[7px] font-medium text-gray-400">
                                                            Verified Skills
                                                        </span>
                                                    </div>
                                                    <div className="w-9 h-9 rounded-lg bg-[#111827] text-white flex items-center justify-center group-hover/card:bg-blue-600 transition-all duration-500 group-hover/card:scale-105">
                                                        <ChevronRight className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            {/* Enhanced Centered Navigation Controls at Bottom */}
                            <div className="flex items-center justify-center gap-10 mt-4">
                                <button
                                    onClick={() => scrollCarousel('course-carousel', 'left')}
                                    className="w-14 h-14 rounded-full flex items-center justify-center text-gray-800 hover:text-blue-600 transition-all bg-white/80 backdrop-blur-xl shadow-lg hover:shadow-blue-500/20 active:scale-90 group/btn"
                                >
                                    <ChevronLeft className="w-7 h-7 group-hover/btn:-translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => scrollCarousel('course-carousel', 'right')}
                                    className="w-14 h-14 rounded-full flex items-center justify-center text-gray-800 hover:text-blue-600 transition-all bg-white/80 backdrop-blur-xl shadow-lg hover:shadow-blue-500/20 active:scale-90 group/btn"
                                >
                                    <ChevronRight className="w-7 h-7 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* ...existing code... */}
                </section>
            </div>
            {/* The rest of the dashboard content, without the background video */}
            <div className="max-w-7xl mx-auto pb-20 px-4 sm:px-8 lg:px-12 relative z-10">

                {/* Courses Carousel Section removed (duplicate) */}


                {/* Trust & Certification Section */}
                <div className="mb-16 pt-12 border-t border-black/5 grid grid-cols-1 sm:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col gap-6">
                        <span className="text-[10px] font-black text-black uppercase tracking-[0.3em]">Curriculum built by people from</span>
                        <div className="flex items-center gap-10">
                            <img src="https://cdn.simpleicons.org/meta/000000" className="h-5" alt="Meta" />
                            <img src="https://cdn.simpleicons.org/netflix/000000" className="h-5" alt="Netflix" />
                            <img src="https://cdn.simpleicons.org/apple/000000" className="h-5" alt="Apple" />
                            <img src="https://cdn.simpleicons.org/nvidia/000000" className="h-5" alt="Nvidia" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-6 sm:items-end">
                        <span className="text-[10px] font-black text-black uppercase tracking-[0.3em]">Certified by</span>
                        <div className="flex items-center gap-10">
                            <img src="https://cdn.simpleicons.org/amazonaws/000000" className="h-6" alt="AWS" />
                            <img src="https://cdn.simpleicons.org/microsoft/000000" className="h-5" alt="Microsoft" />
                            <img src="https://cdn.simpleicons.org/ibm/000000" className="h-5" alt="IBM" />
                        </div>
                    </div>
                </div>

                {/* ── Scroll Velocity Section ── */}
                <div className="mb-24 relative flex w-full flex-col items-center justify-center overflow-hidden py-10 border-b border-black/5">
                    <ScrollVelocityContainer className="text-3xl font-black tracking-[-0.05em] md:text-6xl md:leading-[4rem] text-black uppercase italic">
                        <ScrollVelocityRow baseVelocity={-1} direction={1}>
                            Studlyf &nbsp;&nbsp;&nbsp; Studlyf &nbsp;&nbsp;&nbsp; Studlyf &nbsp;&nbsp;&nbsp; Studlyf
                        </ScrollVelocityRow>
                    </ScrollVelocityContainer>
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-gray-50/80 to-transparent"></div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-gray-50/80 to-transparent"></div>
                </div>

                {/* ── AI Era Integration section ── */}
                <section className="mb-24 px-4 sm:px-0">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        style={{ clipPath: 'polygon(0% 0%, 55% 0%, 62% 10%, 100% 10%, 100% 100%, 0% 100%)' }}
                        className="bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#9333EA] rounded-[3rem] p-10 sm:px-20 sm:pb-32 pt-12 sm:pt-16 flex flex-col lg:flex-row items-center justify-between gap-16 relative overflow-hidden"
                    >
                        {/* Background Accents */}
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-white opacity-[0.03] rotate-12 translate-x-1/4 pointer-events-none" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

                        {/* Small Diamond Accent in bottom right (as per image) */}
                        <div className="absolute bottom-10 right-10 w-6 h-6 bg-white/10 rotate-45 rounded-sm border border-white/20 blur-[1px]" />

                        <div className="flex flex-col lg:flex-row items-center justify-between w-full relative z-10 gap-16">
                            <div className="flex flex-col gap-6 lg:w-1/2">
                                <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.4em]">Career Synergy</span>
                                <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-[2.5]">
                                    Streamline Your Career <br />
                                    in <span className="text-black">AI Era</span>.
                                </h2>
                            </div>

                            <div className="lg:w-1/2 flex flex-col items-end justify-center gap-8 relative top-8">
                                <h2 className="text-4xl sm:text-7xl font-bold tracking-tighter text-right lowercase whitespace-nowrap">
                                    <span className="text-[#374151]">career</span>{" "}
                                    <AuroraText className="bg-gradient-to-r from-[#84CC16] via-[#06B6D4] to-[#10B981]">
                                        dreamer
                                    </AuroraText>
                                </h2>
                                <Link
                                    to="/learn/courses"
                                    className="bg-[#1D74F2] text-white px-14 py-4 rounded-2xl font-bold text-xl hover:bg-[#1A66D9] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/20 relative right-36"
                                >
                                    Start
                                </Link>
                            </div>
                        </div>

                    </motion.div>
                </section>

                {/* ── Main Hero / Command Center ── */}
                <section className="mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="rounded-[4rem] p-12 sm:p-20 relative overflow-hidden shadow-2xl bg-white/40 backdrop-blur-3xl"
                    >
                        <div className="relative z-10 max-w-3xl">
                            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-[#111827] uppercase mb-8 leading-[0.9]">
                                Your <span className="text-[#7C3AED]">Command</span> <br /> Center.
                            </h1>
                            <p className="text-xl text-gray-500 leading-relaxed mb-12 max-w-2xl">
                                Welcome to the Studlyf Console, {user?.displayName || 'Elite Member'}. This platform is designed to transform your engineering potential into verified excellence through clinical evidence and role-focused training.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to="/learn/courses"
                                    className="bg-[#7C3AED] text-white px-10 py-5 rounded-3xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-[#7C3AED]/20 active:scale-95"
                                >
                                    Explore Hero Tracks
                                </Link>
                                <Link
                                    to="/dashboard"
                                    className="bg-white text-[#7C3AED] border border-[#7C3AED]/20 px-10 py-5 rounded-3xl font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-all active:scale-95"
                                >
                                    View My Profile
                                </Link>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-[#F5F3FF] to-transparent pointer-events-none opacity-50" />
                        <div className="absolute -bottom-48 -right-48 w-full max-w-[600px] h-[600px] bg-[#7C3AED]/10 rounded-full blur-[150px] pointer-events-none" />
                    </motion.div>
                </section>

                {/* ── Feature Grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group rounded-[3rem] p-10 shadow-sm transition-all cursor-pointer bg-white/40 backdrop-blur-xl relative overflow-hidden"
                        >
                            <Link to={feature.to} className="relative z-10">
                                <div className="w-16 h-16 bg-[#F5F3FF] rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-[#7C3AED] group-hover:text-white transition-all duration-500">
                                    <feature.icon className="w-8 h-8 text-[#7C3AED] group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-[#111827] uppercase mb-4 tracking-tight group-hover:text-[#7C3AED] transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-500 leading-relaxed text-sm">
                                    {feature.desc}
                                </p>
                            </Link>
                            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#7C3AED]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    ))}
                </div>

                {/* ── Informational Section ── */}
                <section className="grid lg:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-[#111827] rounded-[4rem] p-12 sm:p-16 text-white relative overflow-hidden shadow-2xl"
                    >
                        <div className="relative z-10">
                            <span className="text-[10px] font-black text-[#A78BFA] uppercase tracking-[0.5em] mb-6 block">Our Philosophy</span>
                            <h2 className="text-4xl sm:text-5xl font-bold uppercase tracking-tighter mb-8 leading-[0.9]">
                                Engineering Excellence <br /> Through Clinical Evidence.
                            </h2>
                            <p className="text-white/60 leading-relaxed mb-10 text-lg">
                                Theoretical knowledge is entropy. We value verified skill sets deconstructed from real-world systems. Every track on Studlyf is designed to build clinical evidence for your engineering authority.
                            </p>
                            <ul className="space-y-6">
                                {['System Deconstruction', 'Clinical Readiness scoring', 'GitHub Verification Protocol'].map((text, i) => (
                                    <li key={i} className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-[#A78BFA]">
                                        <div className="w-2 h-2 bg-[#A78BFA] rounded-full shadow-[0_0_15px_#A78BFA]" />
                                        {text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="absolute -bottom-40 -right-40 w-full max-w-[500px] h-[500px] bg-[#7C3AED]/20 rounded-full blur-[150px]" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-[#F5F3FF] rounded-[4rem] p-12 sm:p-16 flex flex-col justify-center relative overflow-hidden"
                    >
                        <h2 className="text-4xl font-bold text-[#111827] uppercase tracking-tighter mb-8 leading-[0.9]">
                            Unlock Your <br /> Career Growth.
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-12 text-lg">
                            Connect your professional identity, verify your code through our AI analysis protocol, and get directly matched with our ecosystem of hiring partners like Nirvaha, DataFlow, and more.
                        </p>
                        <Link
                            to="/dashboard"
                            className="w-fit bg-white text-[#7C3AED] px-10 py-5 rounded-3xl font-bold uppercase tracking-widest text-[11px] border border-[#7C3AED]/20 hover:shadow-2xl hover:scale-105 transition-all"
                        >
                            Start Verification
                        </Link>
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/50 rounded-full blur-3xl" />
                    </motion.div>
                </section>
            </div>
        </div>
    );
};

export default DashboardHome;
