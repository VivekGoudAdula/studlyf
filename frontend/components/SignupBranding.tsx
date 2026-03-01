
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Compass, Target, Orbit, Zap, ShieldCheck, Trophy, Globe, Flame } from 'lucide-react';
import InteractiveCreature from './InteractiveCreature';

const SignupBranding: React.FC = () => {
    return (
        <div className="w-full flex items-center justify-center relative overflow-hidden h-full py-8">
            {/* Background Constellation Effect */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-px h-px bg-white rounded-full shadow-[0_0_15px_1px_rgba(255,255,255,0.8)] animate-pulse" />
                <div className="absolute top-1/2 left-1/3 w-px h-px bg-white rounded-full shadow-[0_0_15px_1px_rgba(255,255,255,0.6)] animate-pulse delay-700" />
                <div className="absolute bottom-1/4 left-1/2 w-px h-px bg-white rounded-full shadow-[0_0_10px_1px_rgba(255,255,255,0.4)] animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 w-full max-w-sm flex flex-col items-center justify-between h-full gap-8">

                {/* 1. TOP: Main Visual: Floating Cards Cluster */}
                <div className="w-full relative h-[300px] flex items-center justify-center flex-grow">
                    <motion.div
                        initial={{ rotate: -15, scale: 0.8 }}
                        animate={{
                            rotate: [0, 5, -5, 0],
                            y: [0, -10, 10, 0]
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="relative z-20 group"
                    >
                        <InteractiveCreature variant="purple" className="scale-[0.8] origin-center transition-all group-hover:scale-[0.9]" />
                    </motion.div>

                    {/* Skill Planetoids - Structured Orbiting */}
                    <div className="absolute inset-0 pointer-events-none">
                        {[
                            { icon: Zap, color: 'purple', label: "Elite", pos: "top-[8%] left-[8%]" },
                            { icon: Trophy, color: 'indigo', label: "Win", pos: "top-[2%] left-[45%]" },
                            { icon: Sparkles, color: 'purple', label: "Growth", pos: "top-[8%] right-[8%]" },
                            { icon: Globe, color: 'indigo', label: "Global", pos: "top-[40%] left-[-8%]" },
                            { icon: Target, color: 'purple', label: "Focus", pos: "top-[40%] right-[-8%]" },
                            { icon: ShieldCheck, color: 'indigo', label: "Verified", pos: "top-[70%] left-[2%]" },
                            { icon: Orbit, color: 'purple', label: "Skills", pos: "top-[70%] right-[2%]" },
                            { icon: Compass, color: 'indigo', label: "Future", pos: "bottom-[2%] left-[15%]" },
                            { icon: Flame, color: 'purple', label: "Hot", pos: "bottom-[2%] right-[15%]" }
                        ].map((p, i) => (
                            <motion.div
                                key={p.label}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + i * 0.2, type: "spring" }}
                                className={`absolute ${p.pos} p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col items-center gap-1.5 shadow-xl`}
                            >
                                <p.icon size={16} className={`text-${p.color}-400`} />
                                <span className="text-[8px] font-bold text-white uppercase tracking-widest">{p.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* 2. BOTTOM: Content Card */}
                <div className="w-full space-y-6 bg-black/30 p-8 rounded-[40px] border border-white/5 backdrop-blur-md shadow-2xl text-center">
                    <motion.h2
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 }}
                        className="text-4xl lg:text-5xl font-thin tracking-tighter text-white leading-tight"
                    >
                        THE <br className="hidden lg:block" />
                        <span className="font-black italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">EVOLUTION.</span>
                    </motion.h2>
                    <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest opacity-80 max-w-sm mx-auto">
                        Begin your journey toward global recognition and elite opportunities.
                    </p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="flex gap-3 justify-center"
                    >
                        <div className="px-5 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-[9px] font-black text-purple-300 uppercase tracking-[0.2em] shadow-lg">
                            New Era
                        </div>
                        <div className="px-5 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-[9px] font-black text-purple-300 uppercase tracking-[0.2em] shadow-lg">
                            Launch 1.0
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default SignupBranding;
