import React from 'react';
import { motion } from 'framer-motion';
import {
    Mail, MessageCircle, Users,
    Trophy, HelpCircle, Video, MonitorPlay, FileText, BookOpen, Book, GraduationCap, Award,
    ArrowRight, Sparkles
} from 'lucide-react';

const DashboardFooter: React.FC = () => {
    return (
        <section className="w-full bg-[#111827] pt-0 pb-10">

            {/* ── TOP CTA BANNER — full width, edge to edge ── */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative overflow-hidden w-full"
                style={{
                    background: 'linear-gradient(135deg, #FF6B35 0%, #FF4500 40%, #E8350A 100%)',
                }}
            >


                {/* Subtle overlay gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-8 md:px-20 lg:px-32 py-10 max-w-screen-2xl mx-auto">
                    {/* Left: Headline + CTA */}
                    <div className="max-w-md mb-8 md:mb-0">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-white text-2xl md:text-3xl font-black leading-tight mb-6"
                        >
                            Take your first step into the{' '}
                            <span className="underline decoration-white/60 underline-offset-4">
                                magical world of coding
                            </span>
                        </motion.h2>
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.95)' }}
                            whileTap={{ scale: 0.97 }}
                            className="bg-white text-[#E8350A] font-bold px-7 py-3 rounded-full text-sm uppercase tracking-wider inline-flex items-center gap-2 shadow-lg transition-all duration-200"
                        >
                            Try a free lesson
                            <ArrowRight size={16} />
                        </motion.button>
                    </div>

                    {/* Right: Decorative illustration placeholder */}
                    <div className="relative flex items-center justify-center w-56 h-40 md:w-64 md:h-48 flex-shrink-0">
                        <div className="absolute inset-0 bg-white/10 rounded-full blur-2xl" />
                        <div className="relative z-10 flex flex-col items-center justify-center text-white/80">
                            <Sparkles size={48} className="text-white/90 mb-2" />
                            <span className="text-white/70 text-xs font-semibold text-center">
                                Fun coding for<br />kids &amp; teens
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── REST OF FOOTER inside container ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-0">

                {/* ── CONTACT US CARD ── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-[3rem] p-10 md:p-12 shadow-2xl overflow-hidden relative mt-10"
                >
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-violet-50/50 to-transparent pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                        {/* Right to Left: Connect with Founder Button moved to start */}
                        <div className="flex flex-col items-center">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-[#111827] text-white pl-4 pr-8 py-4 rounded-2xl font-bold uppercase tracking-wider text-sm flex items-center gap-4 hover:bg-black transition-colors shadow-2xl"
                            >
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                                    <Users size={20} className="text-white/80" />
                                </div>
                                CONNECT WITH FOUNDER
                            </motion.button>
                            <span className="mt-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest">TYPICAL RESPONSE TIME: &lt; 3 HOURS</span>
                        </div>

                        {/* Left to Right: Contact Info moved to end and right-aligned on desktop */}
                        <div className="space-y-6 text-center lg:text-right">
                            <h3 className="text-3xl md:text-5xl font-black text-[#111827] uppercase tracking-tighter">
                                CONTACT US
                            </h3>
                            <p className="text-gray-500 font-medium">Contact us anytime, we are here to help you.</p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-8 pt-2">
                                <div className="text-left lg:text-right">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">SEND US A MESSAGE</span>
                                    <a href="mailto:support@studlyf.com" className="flex items-center lg:flex-row-reverse gap-2 text-[#7C3AED] font-bold hover:underline">
                                        <Mail size={16} />
                                        support@studlyf.com
                                    </a>
                                </div>
                                <div className="w-px h-10 bg-gray-200 hidden sm:block" />
                                <div className="text-left lg:text-right">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">WHATSAPP US</span>
                                    <a href="https://wa.me/916361158952" className="flex items-center lg:flex-row-reverse gap-2 text-[#25D366] font-bold hover:underline">
                                        <MessageCircle size={16} />
                                        +91 6361158952
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ── RESOURCES SECTION ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 pt-12"
                >
                    {/* Left Column: Branding/Accreditation */}
                    <div className="lg:col-span-4 space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-[#7C3AED] rounded-lg flex items-center justify-center shadow-lg transform -rotate-3">
                                    <Sparkles className="text-white w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white italic tracking-tighter font-syne uppercase">STUDLYF</h3>
                                    <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Empowering Engineers</p>
                                </div>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none mb-6">
                                <span className="bg-[#fbbf24] text-black px-2 mr-2">New</span>
                                <span className="underline decoration-[#7C3AED] decoration-4 underline-offset-4">Coding for kids and teens resources</span>
                            </h2>
                            <p className="text-white/70 text-lg leading-relaxed">
                                8 free coding resources for kids and teens to start their coding journey.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Resources Grid */}
                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-4">
                        {[
                            { icon: <Trophy />, label: "Coding Competitions" },
                            { icon: <HelpCircle />, label: "Coding Quizzes" },
                            { icon: <Video />, label: "Coding Masterclasses" },
                            { icon: <MonitorPlay />, label: "Coding Webinars" },
                            { icon: <FileText />, label: "Coding Worksheets" },
                            { icon: <BookOpen />, label: "Coding Blog" },
                            { icon: <Book />, label: "Coding Guides" },
                            { icon: <GraduationCap />, label: "Coding Courses" },
                        ].map((item, index) => (
                            <motion.a
                                key={index}
                                href="#"
                                whileHover={{ scale: 1.05 }}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 mb-4 group-hover:bg-[#7C3AED] group-hover:text-white group-hover:border-[#7C3AED] transition-all duration-300">
                                    {React.cloneElement(item.icon as React.ReactElement, { size: 24, strokeWidth: 1.5 } as any)}
                                </div>
                                <span className="text-sm font-bold text-white group-hover:text-[#7C3AED] transition-colors">
                                    {item.label}
                                </span>
                            </motion.a>
                        ))}
                    </div>
                </motion.div>

                {/* ── COPYRIGHT ── */}
                <div className="text-center pt-10 pb-8">
                    <p className="text-[10px] text-white font-bold font-['Poppins'] uppercase tracking-[0.5em]">
                        &copy; {new Date().getFullYear()} Studlyf &bull; All Rights Reserved
                    </p>
                </div>

            </div>
        </section>
    );
};

export default DashboardFooter;
