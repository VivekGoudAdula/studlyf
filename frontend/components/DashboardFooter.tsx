import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
        <section className="w-full relative pt-0 pb-10">
            {/* Split Purple Background */}
            <div className="absolute inset-x-0 bottom-0 top-32 md:top-40 bg-[#7C3AED] -z-10"></div>


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* CONTACT CARD */}
                <motion.div
                    id="contact-us"
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
                                        href="mailto: saieshwarerelli10@gmail.com"
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
                                        href="https://whatsapp.com/channel/0029VbCHsjAHVvTRqLfOau24/113"
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
                                        href="https://www.instagram.com/stuudent.lyf?igsh=bDIwYzIxaDFyeWd3"
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

                {/* 5-COLUMN FOOTER LINKS SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pt-6 mt-6 border-t border-black/10"
                >
                    {/* Column 1: Logo & Slogan */}
                    <div className="col-span-2 lg:col-span-1 flex flex-col items-start space-y-5">
                        <img 
                            src="/images/studlyf.png" 
                            alt="Studlyf" 
                            className="h-12 md:h-16 w-auto object-contain"
                        />
                        <p className="text-black text-[12px] md:text-[13px] font-poppins leading-relaxed tracking-wider font-semibold opacity-80">
                            Empowering the next generation of engineers with AI-driven career tools and resources.
                        </p>
                    </div>

                    {/* Column 2 */}
                    <div className="flex flex-col space-y-5 lg:ml-8">
                        {['Courses', 'Company Modules', 'Blogs'].map((item) => (
                            <Link key={item} to="#" className="text-black hover:text-black/70 transition-all duration-200 uppercase tracking-wider text-[12px] md:text-[13px] font-bold font-poppins hover:translate-x-1 w-fit">
                                {item}
                            </Link>
                        ))}
                    </div>

                    {/* Column 3 */}
                    <div className="flex flex-col space-y-5">
                        {['Portfolio', 'Resume', 'Skills Assignment', 'Interviews', 'Project'].map((item) => (
                            <Link key={item} to="#" className="text-black hover:text-black/70 transition-all duration-200 uppercase tracking-wider text-[12px] md:text-[13px] font-bold font-poppins hover:translate-x-1 w-fit">
                                {item}
                            </Link>
                        ))}
                    </div>

                    {/* Column 4 */}
                    <div className="flex flex-col space-y-5">
                        {['AI Tools'].map((item) => (
                            <Link key={item} to="#" className="text-black hover:text-black/70 transition-all duration-200 uppercase tracking-wider text-[12px] md:text-[13px] font-bold font-poppins hover:translate-x-1 w-fit">
                                {item}
                            </Link>
                        ))}
                    </div>

                    {/* Column 5 */}
                    <div className="flex flex-col space-y-5">
                        {['About Application', 'Contact Us', 'Resources'].map((item) => (
                            <Link key={item} to="#" className="text-black hover:text-black/70 transition-all duration-200 uppercase tracking-wider text-[12px] md:text-[13px] font-bold font-poppins hover:translate-x-1 w-fit">
                                {item}
                            </Link>
                        ))}
                    </div>
                </motion.div>

                <div className="text-center pt-10 pb-8">
                    <p className="text-[11px] md:text-[12px] text-black font-poppins font-bold uppercase tracking-[0.3em] opacity-80">
                        &copy; {new Date().getFullYear()} Studlyf • All Rights Reserved
                    </p>
                </div>

            </div>
        </section>
    );
};

export default DashboardFooter;