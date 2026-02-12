
import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Check, ArrowDown } from 'lucide-react';

const learningMethods = [
    {
        old: "Syntax Memorization",
        new: "Practical Problem Solving",
    },
    {
        old: "Passive Watching",
        new: "Active Hands-on Learning",
    },
    {
        old: "Theory Over Practice",
        new: "Career-Focused Paths",
    },
    {
        old: "One-size-fits-all",
        new: "Personalized Skill Mapping",
    },
    {
        old: "No Real Feedback",
        new: "AI-Guided Feedback",
    },
];

const OldVsNewSection: React.FC = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const centerRef = useRef<HTMLDivElement>(null);
    const oldRefs = useRef<(HTMLDivElement | null)[]>([]);
    const newRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [paths, setPaths] = useState<string[]>([]);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

    // Update SVG paths based on item positions
    const updatePaths = () => {
        if (!gridRef.current || !centerRef.current) return;
        const containerRect = gridRef.current.getBoundingClientRect();
        const centerRect = centerRef.current.getBoundingClientRect();

        const centerX = centerRect.left + centerRect.width / 2 - containerRect.left;
        const centerY = centerRect.top + centerRect.height / 2 - containerRect.top;

        const newPaths = learningMethods.map((_, i) => {
            const oldEl = oldRefs.current[i];
            const newEl = newRefs.current[i];

            if (oldEl && newEl) {
                const oldRect = oldEl.getBoundingClientRect();
                const newRect = newEl.getBoundingClientRect();

                // Start point (right side of old item)
                const x1 = Math.round(oldRect.right - containerRect.left);
                const y1 = Math.round(oldRect.top + oldRect.height / 2 - containerRect.top);

                // End point (left side of new item)
                const x2 = Math.round(newRect.left - containerRect.left);
                const y2 = Math.round(newRect.top + newRect.height / 2 - containerRect.top);

                // Center points for convergence
                const centerSpread = 10;
                const centerLeftX = Math.round(centerRect.left - containerRect.left);
                const centerRightX = Math.round(centerRect.right - containerRect.left);
                const centerMidY = Math.round(centerY + (i - 2) * centerSpread);

                return `M ${x1} ${y1} 
                        C ${x1 + 60} ${y1}, ${centerLeftX - 60} ${centerMidY}, ${centerLeftX} ${centerMidY}
                        L ${centerRightX} ${centerMidY}
                        C ${centerRightX + 60} ${centerMidY}, ${x2 - 60} ${y2}, ${x2} ${y2}`;
            }
            return "";
        });
        setPaths(newPaths);
    };

    useEffect(() => {
        // Initial calculation
        updatePaths();

        // Recalculate after a short delay to ensure layout has settled
        const timer = setTimeout(updatePaths, 500);

        window.addEventListener('resize', updatePaths);
        window.addEventListener('scroll', updatePaths); // Keep lines in sync during scroll/animations

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updatePaths);
            window.removeEventListener('scroll', updatePaths);
        };
    }, []); // Run on mount

    useEffect(() => {
        if (isInView) {
            updatePaths();
        }
    }, [isInView]);

    return (
        <section className="bg-white py-16 px-4 overflow-hidden relative" ref={sectionRef}>
            <div className="max-w-7xl mx-auto relative">
                {/* Section Header */}
                <div className="text-center mb-8 relative z-30">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-4xl md:text-6xl font-['Syne'] font-extrabold text-black mb-6 tracking-tight"
                    >
                        The Era of Human Authority
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-['Inter']"
                    >
                        From outdated methods to intelligent, outcome-driven learning.
                    </motion.p>
                </div>

                {/* Main Layout (Desktop) */}
                <div ref={gridRef} className="hidden md:grid grid-cols-[1fr_auto_1fr] gap-4 lg:gap-12 items-center relative min-h-[600px]">

                    {/* SVG Overlay for connecting lines - Moved to be absolute relative to container */}
                    <svg
                        className="absolute inset-0 pointer-events-none z-10 overflow-visible"
                        style={{ width: '100%', height: '100%' }}
                    >
                        {paths.map((path, i) => (
                            <motion.path
                                key={i}
                                d={path}
                                fill="none"
                                stroke={hoveredIndex === i ? "#8B5CF6" : "#7C3AED"}
                                strokeWidth={hoveredIndex === i ? "3" : "2"}
                                strokeOpacity={hoveredIndex === i ? "1" : "0.3"}
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={isInView ? {
                                    pathLength: 1,
                                    opacity: 1,
                                    filter: hoveredIndex === i ? "drop-shadow(0 0 12px rgba(124, 58, 237, 0.8))" : "none"
                                } : {}}
                                transition={{
                                    pathLength: { duration: 1.5, delay: 0.2 + i * 0.1, ease: "easeInOut" },
                                    opacity: { duration: 0.5 },
                                    strokeWidth: { duration: 0.3 },
                                    filter: { duration: 0.3 }
                                }}
                            />
                        ))}
                    </svg>

                    {/* Old Way Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="bg-gradient-to-br from-[#2D1B69] to-[#120B2E] rounded-[2.5rem] p-10 border border-white/10 relative z-20"
                    >
                        <h3 className="text-gray-400 text-sm font-['Syne'] uppercase tracking-[0.2em] mb-10 text-center">Old Way</h3>
                        <div className="space-y-6">
                            {learningMethods.map((item, i) => (
                                <div
                                    key={i}
                                    ref={(el) => { oldRefs.current[i] = el; }}
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    className={`p-4 rounded-xl transition-all duration-500 cursor-default ${hoveredIndex === i ? 'bg-white/5 opacity-40' : 'bg-transparent opacity-100'
                                        } ${hoveredIndex !== null && hoveredIndex !== i ? 'blur-[1px] opacity-20' : ''}`}
                                >
                                    <p className="text-lg font-['Inter'] text-gray-400">
                                        {item.old}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Center Connector */}
                    <div className="flex flex-col items-center justify-center space-y-4 px-4 relative z-20">
                        <div ref={centerRef} className="w-20 h-10 rounded-xl border border-purple-500/30 bg-white/5 backdrop-blur-sm flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.1)]">
                            <div className="flex gap-1">
                                {[1, 2, 3].map(k => (
                                    <motion.div
                                        key={k}
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: k * 0.2 }}
                                        className="w-1.5 h-1.5 rounded-full bg-purple-500"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* New Way Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="bg-[#050505] rounded-[2.5rem] p-10 border border-purple-500/30 shadow-[0_0_50px_rgba(124,58,237,0.15)] relative z-20"
                    >
                        <h3 className="text-purple-400 text-sm font-['Syne'] uppercase tracking-[0.3em] mb-10 text-center font-bold">New Way</h3>
                        <div className="space-y-6">
                            {learningMethods.map((item, i) => (
                                <motion.div
                                    key={i}
                                    ref={(el) => { newRefs.current[i] = el; }}
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    animate={{
                                        scale: hoveredIndex === i ? 1.05 : 1,
                                        backgroundColor: hoveredIndex === i ? "rgba(124, 58, 237, 0.15)" : "rgba(124, 58, 237, 0)"
                                    }}
                                    className={`p-4 rounded-xl flex items-center gap-4 cursor-default transition-all duration-300 ${hoveredIndex === i ? 'shadow-[0_0_25px_rgba(124,58,237,0.2)]' : ''
                                        }`}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${hoveredIndex === i ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(124,58,237,0.6)]' : 'bg-purple-900/40 text-purple-400'
                                        }`}>
                                        <Check className="w-4 h-4" />
                                    </div>
                                    <p className={`text-lg font-['Inter'] font-semibold transition-all duration-300 ${hoveredIndex === i ? 'text-white translate-x-1' : 'text-gray-200'
                                        }`}>
                                        {item.new}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden flex flex-col gap-8">
                    {/* Old Way Card */}
                    <div className="bg-[#1A1033] rounded-3xl p-8 border border-white/5">
                        <h3 className="text-gray-400 text-xs font-['Syne'] uppercase tracking-widest mb-8 text-center">Old Way</h3>
                        <div className="space-y-4">
                            {learningMethods.map((item, i) => (
                                <p key={i} className="text-gray-500 text-base font-['Inter']">{item.old}</p>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <div className="bg-purple-50 p-3 rounded-full border border-purple-100">
                            <ArrowDown className="text-purple-500 w-6 h-6 animate-bounce" />
                        </div>
                    </div>

                    {/* New Way Card */}
                    <div className="bg-black rounded-3xl p-8 border border-purple-500/20 shadow-[0_0_30px_rgba(124,58,237,0.1)]">
                        <h3 className="text-purple-400 text-xs font-['Syne'] uppercase tracking-widest mb-8 text-center font-bold">New Way</h3>
                        <div className="space-y-6">
                            {learningMethods.map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                    <p className="text-white text-base font-['Inter'] font-semibold">{item.new}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OldVsNewSection;
