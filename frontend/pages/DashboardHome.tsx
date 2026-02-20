import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Target, Zap, Shield, BookOpen } from 'lucide-react';
import DashboardFooter from '../components/DashboardFooter';
import FAQCarousel from '../components/FAQCarousel';
import WhyUsSection from '../components/WhyUsSection';

const DashboardHome: React.FC = () => {
    const { user } = useAuth();

    const features = [
        {
            title: "Hero Tracks",
            desc: "Role-focused engineering specialization for elite readiness.",
            icon: <Zap className="w-6 h-6 text-[#7C3AED]" />,
            to: "/learn/courses"
        },
        {
            title: "Skill Assessment",
            desc: "Identify your strengths with clinical scoring maps.",
            icon: <Target className="w-6 h-6 text-[#7C3AED]" />,
            to: "/learn/assessment"
        },
        {
            title: "Proof of Skill",
            desc: "Build evidence-based developer portfolios.",
            icon: <Shield className="w-6 h-6 text-[#7C3AED]" />,
            to: "/job-prep/portfolio"
        },
        {
            title: "Clinical Resumes",
            desc: "Instant verification-ready resumes for partners.",
            icon: <BookOpen className="w-6 h-6 text-[#7C3AED]" />,
            to: "/job-prep/resume-builder"
        }
    ];

    return (
        <>
            <div className="min-h-screen bg-gray-50/30 pt-32 pb-20 px-4 sm:px-8 lg:px-12">
                <div className="max-w-7xl mx-auto">

                    {/* Hero Section */}
                    <section className="mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm relative overflow-hidden"
                        >
                            <div className="relative z-10 max-w-3xl">
                                <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-[#111827] uppercase mb-6">
                                    Your <span className="text-[#7C3AED]">Command</span> Center.
                                </h1>

                                <p className="text-xl text-gray-500 leading-relaxed mb-10">
                                    Welcome to the Studlyf Console, {user?.displayName || 'Elite Member'}.
                                    This platform is designed to transform your engineering potential
                                    into verified excellence through clinical evidence and role-focused training.
                                </p>

                                <div className="flex flex-wrap gap-4">
                                    <Link
                                        to="/learn/courses"
                                        className="bg-[#7C3AED] text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-[#7C3AED]/20"
                                    >
                                        Explore Hero Tracks
                                    </Link>

                                    <Link
                                        to="/dashboard"
                                        className="bg-white text-[#7C3AED] border border-[#7C3AED]/20 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-all"
                                    >
                                        View My Profile
                                    </Link>
                                </div>
                            </div>

                            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#F5F3FF] to-transparent pointer-events-none opacity-50" />
                            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#7C3AED] rounded-full blur-[120px] opacity-10" />
                        </motion.div>
                    </section>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:border-[#7C3AED]/30 transition-all cursor-pointer"
                            >
                                <Link to={feature.to}>
                                    <div className="w-14 h-14 bg-[#F5F3FF] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-[#111827] uppercase mb-2 tracking-tight group-hover:text-[#7C3AED] transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Informational Section */}
                    <section className="grid lg:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-[#111827] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl"
                        >
                            <div className="relative z-10">
                                <span className="text-[10px] font-black text-[#A78BFA] uppercase tracking-[0.4em] mb-4 block">
                                    Our Philosophy
                                </span>

                                <h2 className="text-3xl font-bold uppercase tracking-tight mb-6 leading-tight">
                                    Engineering Excellence Through Clinical Evidence.
                                </h2>

                                <p className="text-white/60 leading-relaxed mb-8">
                                    Theoretical knowledge is entropy. We value verified skill sets
                                    deconstructed from real-world systems. Every track on Studlyf
                                    is designed to build clinical evidence for your engineering authority.
                                </p>

                                <ul className="space-y-4">
                                    {[
                                        'System Deconstruction',
                                        'Clinical Readiness scoring',
                                        'GitHub Verification Protocol'
                                    ].map((text, i) => (
                                        <li key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#A78BFA]">
                                            <div className="w-1.5 h-1.5 bg-[#A78BFA] rounded-full" />
                                            {text}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#7C3AED] rounded-full blur-[100px] opacity-20" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-[#F5F3FF] rounded-[2.5rem] p-10 border border-[#7C3AED]/10 flex flex-col justify-center"
                        >
                            <h2 className="text-3xl font-bold text-[#111827] uppercase tracking-tight mb-6 leading-tight">
                                Unlock Your Career Growth.
                            </h2>

                            <p className="text-gray-600 leading-relaxed mb-8">
                                Connect your professional identity, verify your code through our AI
                                analysis protocol, and get directly matched with our ecosystem of
                                hiring partners.
                            </p>

                            <Link
                                to="/dashboard"
                                className="w-fit bg-white text-[#7C3AED] px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] border border-[#7C3AED]/20 hover:shadow-lg transition-all"
                            >
                                Start Verification
                            </Link>
                        </motion.div>
                    </section>

                </div>
            </div>

            <WhyUsSection />
            <FAQCarousel />
            <DashboardFooter />
        </>
    );
};

export default DashboardHome;