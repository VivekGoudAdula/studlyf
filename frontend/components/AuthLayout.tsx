
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import InteractiveCreature from './InteractiveCreature';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen relative flex items-center justify-center bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_#09090b_100%)] overflow-hidden py-12 px-4 sm:px-6">
            {/* Top Logo */}
            <Link to="/" className="absolute top-8 left-8 z-50 group transition-transform active:scale-95">
                <div className="flex items-center">
                    <span className="font-syne font-black text-white italic tracking-tighter text-2xl sm:text-3xl group-hover:text-purple-400 transition-colors">STUDLYF</span>
                </div>
            </Link>

            {/* Subtle Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-900/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-[1200px] flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">

                {/* Branding Section */}
                <div className="w-full lg:w-[50%] text-center space-y-8 lg:pl-24">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex justify-center"
                    >
                        <div className="relative">
                            <InteractiveCreature className="scale-110 lg:scale-[1.35] origin-center" />
                            {/* Glow behind creature */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl -z-10" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="space-y-4"
                    >
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
                            Own Your <br className="hidden lg:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">Capability.</span>
                        </h2>
                        <p className="text-gray-400 text-lg lg:text-xl max-w-md mx-auto font-medium leading-relaxed">
                            Access your dashboard, skill assessments, and career tools.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-wrap gap-3 justify-center"
                    >
                        {["Verified Skills", "Career Growth", "Elite Talent"].map((tag) => (
                            <span key={tag} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] sm:text-[11px] font-bold text-purple-300/80 uppercase tracking-[0.2em] backdrop-blur-sm">
                                {tag}
                            </span>
                        ))}
                    </motion.div>
                </div>

                {/* Auth Card Section */}
                <div className="w-full lg:w-[50%] flex justify-center">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
