
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import InteractiveCreature from './InteractiveCreature';

interface AuthLayoutProps {
    children: React.ReactNode;
    targetButtonText?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, targetButtonText }) => {
    return (
        <div className="min-h-screen w-full bg-[#0A0518] flex items-center justify-center p-6 relative overflow-hidden">

            {/* Immersive Background Layer */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Deep Purple Base Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A0518] via-[#120726] to-[#010101]" />

                {/* Dynamic Orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.15, 0.3, 0.15],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/30 blur-[180px] rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 2 }}
                    className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/20 blur-[200px] rounded-full"
                />

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}
                />

                {/* Content Layer (Desktop only positioning for branding) */}
                <div className="hidden lg:flex absolute inset-0 items-center pl-40 pr-24">
                    <div className="max-w-xl">
                        {/* Logo */}
                        <Link to="/" className="inline-flex items-center gap-3 mb-16 group pointer-events-auto">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.4)] group-hover:rotate-6 transition-all duration-500">
                                <span className="text-white font-syne font-black text-xs">S</span>
                            </div>
                            <span className="text-white font-syne font-black tracking-tight text-lg">STUDLYF.</span>
                        </Link>

                        <div className="mb-8 flex translate-x-10">
                            <InteractiveCreature className="scale-125 md:scale-150 origin-left" targetButtonText={targetButtonText} />
                        </div>

                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            <h1 className="text-white text-7xl font-black leading-[0.9] mb-6 tracking-tighter">
                                Own Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">Capability.</span>
                            </h1>
                            <p className="text-gray-500 text-xl max-w-md leading-relaxed font-medium">
                                Access your dashboard, skill assessments, and career tools in the next-gen professional hub.
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Mobile Background Content */}
                <div className="lg:hidden absolute top-12 left-0 right-0 flex flex-col items-center">
                    <InteractiveCreature className="scale-75 mb-4" targetButtonText={targetButtonText} />
                    <h1 className="text-white text-3xl font-black uppercase tracking-tighter">Own Your Capability.</h1>
                </div>

                {/* Decorative labels */}
                <div className="absolute bottom-12 left-12 hidden lg:flex gap-8 opacity-20">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">INTELLIGENT</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">VERIFIED</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">PREMIUM</span>
                </div>
            </div>

            {/* Auth Card Container */}
            <div className="relative z-10 w-full flex justify-center lg:justify-end lg:pr-[8%]">
                {children}
            </div>

        </div>
    );
};

export default AuthLayout;
