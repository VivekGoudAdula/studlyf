
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const words = ['doing', 'building', 'practicing', 'solving', 'creating'];

// --- Sub-components for Visuals ---

const GridLine = ({ className = "" }: { className?: string }) => (
    <div className={`absolute left-0 right-0 h-[1.5px] bg-gray-300/60 pointer-events-none z-0 ${className}`}>
        <div className="flex justify-evenly w-full h-full">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="w-[1.2px] h-3 bg-gray-300 -translate-y-[5.5px]" />
            ))}
        </div>
    </div>
);

const HistogramBars = () => (
    <div className="flex items-end gap-1.5 h-16 relative z-10">
        {[0.4, 0.6, 0.8, 0.5, 0.9, 0.7].map((h, i) => (
            <motion.div
                key={i}
                className={`w-3 rounded-t-sm ${i < 3 ? 'bg-purple-200' : 'bg-gray-100'}`}
                initial={{ height: 0 }}
                animate={{ height: `${h * 100}%` }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: i * 0.15,
                    ease: "easeInOut"
                }}
            />
        ))}
    </div>
);



const ScatterDots = () => (
    <div className="relative w-40 h-24 z-10">
        {[...Array(18)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-orange-400/40"
                initial={{
                    x: Math.random() * 20,
                    y: Math.random() * 80,
                    opacity: 0
                }}
                animate={{
                    x: (Math.random() * 80) + 40,
                    y: (Math.random() * 60),
                    opacity: [0, 1, 0]
                }}
                transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                }}
            />
        ))}
    </div>
);

// --- Main Hero ---

const LandingHero: React.FC = () => {
    const navigate = useNavigate();
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-[90vh] flex flex-col items-center justify-center bg-white px-6 relative overflow-hidden">

            {/* Headline Group */}
            <div className="relative z-10 flex flex-col items-center w-full max-w-7xl gap-4 md:gap-6">

                {/* Row 1: Learn + Decor */}
                <div className="flex items-center justify-center w-full relative">
                    <div className="relative flex items-center gap-6 md:gap-10 px-8 group">
                        {/* Grid Line - Attached to the text container width */}
                        <div className="absolute left-0 right-0 bottom-[20px] h-[1.5px] bg-gray-400/80 z-0 opacity-80">
                            <div className="flex justify-evenly w-full h-full px-2">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="w-[1.2px] h-2.5 bg-gray-400 -translate-y-[4.5px]" />
                                ))}
                            </div>
                        </div>

                        {/* Left Decor: Histogram */}
                        <div className="hidden lg:flex items-end mb-4 relative z-20">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute -top-14 left-6 bg-purple-500 text-white text-[11px] px-2.5 py-1 rounded-md shadow-lg z-20 font-bold"
                            >
                                71%
                            </motion.div>
                            <div className="border-l-[1.5px] border-dashed border-gray-300 h-24 absolute left-4 -top-8 z-0" />
                            <HistogramBars />
                            <motion.div
                                animate={{ y: [-5, 40, -5] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute left-[9px] top-6 w-5 h-5 bg-white border-[1.5px] border-black rounded-full flex items-center justify-center shadow-xl z-30"
                            >
                                <div className="flex gap-[1.5px] items-center">
                                    <div className="w-[1.5px] h-2 bg-black" />
                                    <div className="w-[1.5px] h-2 bg-black" />
                                </div>
                            </motion.div>
                        </div>

                        <h1 className="text-[100px] md:text-[140px] font-['Poppins'] font-bold text-black leading-none tracking-tight relative z-20">
                            Learn
                        </h1>

                        {/* Right Decor: Scatter */}
                        <div className="hidden lg:block mb-4 relative z-20">
                            <ScatterDots />
                            <motion.div
                                className="absolute top-8 left-0 w-4 h-4 bg-orange-500 rounded-full shadow-lg z-30"
                                animate={{ x: [0, 80, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.div
                                className="absolute top-8 left-32 w-4 h-4 bg-orange-500 rounded-full shadow-lg z-30"
                                animate={{ scale: [1, 1.25, 1] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />
                            <div className="absolute top-[41px] left-4 w-32 h-[1.5px] bg-orange-100 z-10" />
                        </div>
                    </div>
                </div>

                {/* Row 2: by + doing + Decor */}
                <div className="flex items-center justify-center w-full relative">
                    <div className="relative flex items-center px-12 group">
                        {/* Grid Line - Attached to the text container width */}
                        <div className="absolute left-0 right-0 bottom-[43px] h-[1.5px] bg-gray-400/80 z-0 opacity-80">
                            <div className="flex justify-evenly w-full h-full px-2">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="w-[1.2px] h-2.5 bg-gray-400 -translate-y-[4.5px]" />
                                ))}
                            </div>
                        </div>



                        <h1 className="text-[100px] md:text-[140px] font-['Poppins'] font-bold text-black leading-[1.1] tracking-tight flex items-center relative z-20 pb-4">
                            <span>by&nbsp;</span>
                            <span className="relative inline-block min-w-[320px] md:min-w-[580px]">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={words[index]}
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -40 }}
                                        transition={{
                                            duration: 0.6,
                                            ease: [0.16, 1, 0.3, 1]
                                        }}
                                        className="absolute inset-0 text-black appearance-none z-30"
                                    >
                                        {words[index]}
                                    </motion.span>
                                </AnimatePresence>
                                <span className="invisible">{words[index]}</span>
                            </span>
                        </h1>

                        {/* Blue Curve Decor */}
                        <div className="absolute right-[-15%] bottom-[-20px] hidden xl:block z-20">
                            <div className="relative">
                                <svg width="160" height="100" viewBox="0 0 160 100" className="opacity-40">
                                    <path d="M0 80 Q 40 0, 80 80 T 160 80" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 6" />
                                </svg>
                                <motion.div
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        boxShadow: ["0 0 0px rgba(59,130,246,0.3)", "0 0 30px rgba(59,130,246,0.6)", "0 0 0px rgba(59,130,246,0.3)"]
                                    }}
                                    transition={{ duration: 2.5, repeat: Infinity }}
                                    className="absolute bottom-[25px] right-2 w-7 h-7 bg-blue-500 rounded-full border-[3px] border-white shadow-2xl z-30"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 3: CTA Button */}
                <div className="relative flex flex-col items-center pt-8 z-20">
                    <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: '#6D28D9' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/signup')}
                        className="bg-[#7C3AED] text-white px-12 py-5 rounded-full text-lg font-bold shadow-2xl shadow-purple-500/40 transition-all flex items-center justify-center z-30"
                    >
                        Try now
                    </motion.button>
                </div>

            </div>
        </div>
    );
};

export default LandingHero;
