import React from 'react';
import { motion } from 'framer-motion';
import {
    Mail,
    MessageCircle,
    Users,
    Trophy,
    HelpCircle,
    Video,
    MonitorPlay,
    FileText,
    BookOpen,
    Book,
    GraduationCap,
    ArrowRight,
    Sparkles,
    Instagram
} from 'lucide-react';

const DashboardFooter: React.FC = () => {

    const resources = [
        { icon: Trophy, label: "Coding Competitions" },
        { icon: HelpCircle, label: "Coding Quizzes" },
        { icon: Video, label: "Coding Masterclasses" },
        { icon: MonitorPlay, label: "Coding Webinars" },
        { icon: FileText, label: "Coding Worksheets" },
        { icon: BookOpen, label: "Coding Blog" },
        { icon: Book, label: "Coding Guides" },
        { icon: GraduationCap, label: "Coding Courses" },
    ];

    return (
        <section className="w-full bg-[#111827] pt-0 pb-10">

            {/* TOP CTA BANNER */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative overflow-hidden w-full"
                style={{
                    background: 'linear-gradient(135deg, #7C3AED 0%, #9D67FF 40%, #6D28D9 100%)',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 pointer-events-none" />
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#7C3AED]/20 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-8 md:px-20 lg:px-32 py-8 md:py-12 max-w-screen-2xl mx-auto">

                    <div className="max-w-xl mb-8 md:mb-0">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-white text-3xl md:text-5xl font-black leading-tight mb-6 uppercase tracking-tighter"
                        >
                            Take your first step into the{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                                magical world of coding
                            </span>
                        </motion.h2>

                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -12px rgba(124,58,237,0.4)" }}
                            whileTap={{ scale: 0.97 }}
                            className="bg-white text-[#7C3AED] font-black px-10 py-4 rounded-full text-[14px] uppercase tracking-[0.2em] inline-flex items-center gap-3 shadow-2xl transition-all"
                        >
                            Try a free lesson
                            <ArrowRight size={18} />
                        </motion.button>
                    </div>

                    <div className="relative flex items-center justify-center w-48 h-32 md:w-64 md:h-48 flex-shrink-0">
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse" />
                        <div className="relative z-10 flex flex-col items-center justify-center text-white">
                            <Sparkles size={48} className="text-white mb-2 animate-bounce" />
                            <span className="text-white font-black text-xs md:text-sm uppercase tracking-widest text-center leading-relaxed">
                                Fun coding for<br />kids & teens
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* CONTACT CARD */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative mt-8"
                >
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
                        <div className="flex flex-col items-center">
                            <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-100 rounded-3xl border-2 border-gray-100 flex items-center justify-center overflow-hidden shadow-inner group">
                                <img
                                    src="/images/Eshwar.jpg"
                                    alt="Founder"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <span className="mt-3 text-[10px] font-black text-[#111827] uppercase tracking-widest font-poppins">
                                Connect with founder
                            </span>
                        </div>

                        {/* RIGHT SECTION: CONTACT US */}
                        <div className="flex-1 w-full lg:max-w-lg">
                            <div className="flex flex-col items-center lg:items-end text-center lg:text-right space-y-6">
                                <h3 className="text-3xl md:text-5xl font-black text-[#111827] uppercase tracking-tighter font-poppins">
                                    CONTACT US
                                </h3>

                                <motion.div
                                    variants={{
                                        hidden: { opacity: 0 },
                                        show: {
                                            opacity: 1,
                                            transition: {
                                                staggerChildren: 0.2
                                            }
                                        }
                                    }}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true }}
                                    className="flex items-center justify-center lg:justify-end gap-8 md:gap-12 py-2"
                                >
                                    {/* Email Icon */}
                                    <motion.a
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            show: { opacity: 1, y: 0 }
                                        }}
                                        whileHover={{
                                            scale: 1.15,
                                            y: -5,
                                            transition: { type: "spring", stiffness: 400, damping: 10 }
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        href="mailto:support@studlyf.com"
                                        className="flex flex-col items-center gap-2 group"
                                    >
                                        <div className="w-14 h-14 rounded-full bg-white border-2 border-gray-100 shadow-xl flex items-center justify-center text-[#7C3AED] group-hover:bg-[#7C3AED] group-hover:text-white group-hover:border-[#7C3AED] transition-all duration-300">
                                            <Mail size={24} />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-poppins">email</span>
                                    </motion.a>

                                    {/* WhatsApp Icon */}
                                    <motion.a
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            show: { opacity: 1, y: 0 }
                                        }}
                                        whileHover={{
                                            scale: 1.15,
                                            y: -5,
                                            transition: { type: "spring", stiffness: 400, damping: 10 }
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        href="https://wa.me/916361158952"
                                        className="flex flex-col items-center gap-2 group"
                                    >
                                        <div className="w-14 h-14 rounded-full bg-white border-2 border-gray-100 shadow-xl flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white group-hover:border-[#25D366] transition-all duration-300">
                                            <MessageCircle size={24} />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-poppins">whatsapp</span>
                                    </motion.a>

                                    {/* Instagram Icon */}
                                    <motion.a
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            show: { opacity: 1, y: 0 }
                                        }}
                                        whileHover={{
                                            scale: 1.15,
                                            y: -5,
                                            transition: { type: "spring", stiffness: 400, damping: 10 }
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        href="https://instagram.com/studlyf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center gap-2 group"
                                    >
                                        <div className="w-14 h-14 rounded-full bg-white border-2 border-gray-100 shadow-xl flex items-center justify-center text-[#E4405F] group-hover:bg-[#E4405F] group-hover:text-white group-hover:border-[#E4405F] transition-all duration-300">
                                            <Instagram size={24} />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-poppins">instagram</span>
                                    </motion.a>
                                </motion.div>

                                <p className="text-black font-black uppercase tracking-wider text-[9px] md:text-[10px] font-poppins lg:mr-8">
                                    Contact us anytime, we are here to help.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* RESOURCES SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 pt-12"
                >
                    <div className="lg:col-span-4 space-y-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-[#7C3AED] rounded-lg flex items-center justify-center shadow-lg transform -rotate-3">
                                <Sparkles className="text-white w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase">
                                    STUDLYF
                                </h3>
                                <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">
                                    Empowering Engineers
                                </p>
                            </div>
                        </div>

                        <h2 className="text-4xl font-black text-white leading-none mb-6">
                            <span className="bg-[#fbbf24] text-black px-2 mr-2">New</span>
                            Coding Resources
                        </h2>

                        <p className="text-white/70 text-lg">
                            8 free coding resources for kids and teens.
                        </p>
                    </div>

                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-4">
                        {resources.map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <motion.a
                                    key={index}
                                    href="#"
                                    whileHover={{ scale: 1.05 }}
                                    className="flex flex-col items-center text-center group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 mb-4 group-hover:bg-[#7C3AED] group-hover:text-white transition-all duration-300">
                                        <Icon size={24} />
                                    </div>

                                    <span className="text-sm font-bold text-white group-hover:text-[#7C3AED] transition-colors">
                                        {item.label}
                                    </span>
                                </motion.a>
                            );
                        })}
                    </div>
                </motion.div>

                <div className="text-center pt-10 pb-8">
                    <p className="text-[10px] text-white font-bold uppercase tracking-[0.5em]">
                        &copy; {new Date().getFullYear()} Studlyf • All Rights Reserved
                    </p>
                </div>

            </div>
        </section>
    );
};

export default DashboardFooter;