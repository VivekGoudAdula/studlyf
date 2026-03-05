
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import InteractiveCreature from './InteractiveCreature';

interface AuthLayoutProps {
    children: React.ReactNode;
    branding?: React.ReactNode;
    fullWidth?: boolean;
    title?: React.ReactNode;
    subtitle?: string;
    tags?: string[];
    creatureVariant?: 'purple' | 'indigo' | 'emerald' | 'amber';
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
    children,
    branding,
    fullWidth = false,
    title = <>Own Your <br className="hidden lg:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">Capability.</span></>,
    subtitle = "Access your dashboard, skill assessments, and career tools.",
    tags = ["Verified Skills", "Career Growth", "Elite Talent"],
    creatureVariant = 'purple'
}) => {
    return (
        <div className="min-h-screen relative flex items-center justify-center bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_#09090b_100%)] overflow-hidden py-12 px-4 sm:px-6">
            {/* Top Logo */}
            <Link to="/" className="absolute top-8 left-8 z-50 group transition-transform active:scale-95">
                <div className="flex items-center">
                    <img
                        src="/images/studlyf.png"
                        alt="STUDLYF Logo"
                        className="h-10 sm:h-12 w-auto object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] group-hover:opacity-80 transition-opacity"
                    />
                </div>
            </Link>

            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[140px] pointer-events-none transition-all duration-1000 ${creatureVariant === 'emerald' ? 'bg-emerald-600/10' :
                creatureVariant === 'amber' ? 'bg-amber-600/10' :
                    creatureVariant === 'indigo' ? 'bg-indigo-600/10' :
                        'bg-purple-600/10'
                }`} />

            {fullWidth ? (
                <div className="relative z-10 w-full max-w-[1400px] flex items-center justify-center min-h-[70vh]">
                    {children}
                </div>
            ) : (
                <div className="relative z-10 w-full max-w-[1200px] flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">

                    {/* Branding Section */}
                    {branding ? (
                        branding
                    ) : (
                        <div className="w-full lg:w-[50%] text-center space-y-8 lg:pl-24">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="flex justify-center"
                            >
                                <div className="relative">
                                    <InteractiveCreature
                                        variant={creatureVariant}
                                        className="scale-110 lg:scale-[1.35] origin-center"
                                    />
                                    {/* Glow behind creature */}
                                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-2xl -z-10 transition-colors duration-700 ${creatureVariant === 'emerald' ? 'bg-emerald-500/20' :
                                        creatureVariant === 'indigo' ? 'bg-indigo-500/20' :
                                            'bg-purple-500/20'
                                        }`} />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="space-y-4"
                            >
                                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
                                    {title}
                                </h2>
                                <p className="text-gray-400 text-lg lg:text-xl max-w-md mx-auto font-medium leading-relaxed">
                                    {subtitle}
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="flex flex-wrap gap-3 justify-center"
                            >
                                {tags.map((tag) => (
                                    <span key={tag} className={`px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] backdrop-blur-sm transition-colors duration-700 ${creatureVariant === 'emerald' ? 'text-emerald-300/80' :
                                        creatureVariant === 'indigo' ? 'text-indigo-300/80' :
                                            'text-purple-300/80'
                                        }`}>
                                        {tag}
                                    </span>
                                ))}
                            </motion.div>
                        </div>
                    )}

                    {/* Auth Card Section */}
                    <div className="w-full lg:w-[50%] flex justify-center">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuthLayout;
