
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
                        className="text-4xl md:text-6xl font-['Syne'] font-extrabold text-black mb-6 tracking-tight uppercase"
                    >
                        The Era of Human Authority
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-['Inter']"
                    >
                        From outdated methods to intelligent, outcome-driven learning.
                    </motion.p>
                </div>

                {/* Main Layout (Desktop) */}
                <div ref={gridRef} className="hidden md:grid grid-cols-[1fr_auto_1fr] gap-4 lg:gap-12 items-center relative min-h-[600px]">

                    {/* SVG Overlay for connecting lines */}
                    <svg
                        className="absolute inset-0 pointer-events-none z-10 overflow-visible"
                        style={{ width: '100%', height: '100%' }}
                    >
                        {paths.map((path, i) => (
                            <React.Fragment key={i}>
                                {/* Base Path */}
                                <motion.path
                                    d={path}
                                    fill="none"
                                    stroke={hoveredIndex === i ? "#9333EA" : "#D8B4FE"}
                                    strokeWidth={hoveredIndex === i ? "3" : "2"}
                                    strokeOpacity={hoveredIndex === i ? "1" : "0.5"}
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={isInView ? {
                                        pathLength: 1,
                                        opacity: 1,
                                    } : {}}
                                    transition={{
                                        pathLength: { duration: 1.5, delay: 0.2 + i * 0.1, ease: "easeInOut" },
                                        opacity: { duration: 0.5 },
                                        strokeWidth: { duration: 0.3 }
                                    }}
                                />
                                {/* Traveling Info Packet Animation */}
                                {isInView && (
                                    <motion.path
                                        d={path}
                                        fill="none"
                                        stroke={hoveredIndex === i ? "#A855F7" : "#C084FC"}
                                        strokeWidth={hoveredIndex === i ? "4" : "3"}
                                        strokeDasharray="15, 150"
                                        strokeLinecap="round"
                                        animate={{ strokeDashoffset: [0, -165] }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "linear",
                                            delay: i * 0.4
                                        }}
                                        style={{ filter: "drop-shadow(0 0 5px rgba(168, 85, 247, 0.4))" }}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </svg>

                    {/* Old Way Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="bg-[#F5F3FF] rounded-[2.5rem] p-10 border border-purple-200 relative z-20 shadow-sm"
                    >
                        <h3 className="text-red-500 text-lg md:text-xl font-['Syne'] uppercase tracking-[0.2em] mb-10 text-center font-extrabold drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]">Old Way</h3>
                        <div className="space-y-6">
                            {learningMethods.map((item, i) => (
                                <div
                                    key={i}
                                    ref={(el) => { oldRefs.current[i] = el; }}
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    className={`p-4 rounded-2xl transition-all duration-500 cursor-pointer border border-transparent ${hoveredIndex === i
                                        ? 'bg-white shadow-md shadow-purple-100/50 scale-[1.02] opacity-100 blur-0'
                                        : hoveredIndex !== null
                                            ? 'opacity-50 blur-[1px]'
                                            : 'opacity-100 blur-0'
                                        }`}
                                >
                                    <p className={`text-lg font-['Inter'] transition-colors duration-300 ${hoveredIndex === i ? 'text-gray-900 font-medium' : 'text-gray-400'
                                        }`}>
                                        {item.old}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Center Connector */}
                    <div className="flex flex-col items-center justify-center space-y-4 px-4 relative z-20">
                        <div ref={centerRef} className="w-16 h-16 rounded-full border border-purple-200 bg-[#F5F3FF] flex items-center justify-center shadow-sm">
                            <div className="flex gap-1.5">
                                {[1, 2, 3].map(k => (
                                    <motion.div
                                        key={k}
                                        animate={{
                                            opacity: [0.4, 1, 0.4],
                                            scale: [1, 1.2, 1]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity, delay: k * 0.3 }}
                                        className="w-2 h-2 rounded-full bg-purple-400"
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
                        className="bg-[#F5F3FF] rounded-[2.5rem] p-10 border border-purple-200 relative z-20 shadow-sm"
                    >
                        <h3 className="text-green-500 text-lg md:text-xl font-['Syne'] uppercase tracking-[0.2em] mb-10 text-center font-extrabold drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">New Way</h3>
                        <div className="space-y-4">
                            {learningMethods.map((item, i) => (
                                <motion.div
                                    key={i}
                                    ref={(el) => { newRefs.current[i] = el; }}
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    animate={{
                                        scale: hoveredIndex === i ? 1.05 : 1,
                                        boxShadow: hoveredIndex === i ? "0 10px 25px -5px rgba(147, 51, 234, 0.15)" : "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                                        backgroundColor: hoveredIndex === i ? "#FFFFFF" : "#F5F3FF",
                                        opacity: hoveredIndex !== null && hoveredIndex !== i ? 0.5 : 1,
                                        filter: hoveredIndex !== null && hoveredIndex !== i ? "blur(1px)" : "blur(0px)"
                                    }}
                                    transition={{ duration: 0.4 }}
                                    className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer border border-purple-50 transition-all duration-300`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${hoveredIndex === i ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-purple-100 text-purple-600'
                                        }`}>
                                        <Check className="w-4 h-4" />
                                    </div>
                                    <p className={`text-lg font-['Inter'] font-semibold transition-all duration-300 ${hoveredIndex === i ? 'text-purple-900' : 'text-gray-800'
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
                    <div className="bg-[#F5F3FF] rounded-3xl p-8 border border-purple-200">
                        <h3 className="text-purple-300 text-xs font-['Syne'] uppercase tracking-widest mb-8 text-center font-bold">Old Way</h3>
                        <div className="space-y-4 text-center">
                            {learningMethods.map((item, i) => (
                                <p key={i} className="text-gray-300 text-lg font-['Inter']">{item.old}</p>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <div className="bg-purple-50 p-3 rounded-full border border-purple-100">
                            <ArrowDown className="text-purple-500 w-6 h-6 animate-bounce" />
                        </div>
                    </div>

                    {/* New Way Card */}
                    <div className="bg-[#F5F3FF] rounded-3xl p-8 border border-purple-200 shadow-sm">
                        <h3 className="text-purple-400 text-xs font-['Syne'] uppercase tracking-widest mb-8 text-center font-bold">New Way</h3>
                        <div className="space-y-6">
                            {learningMethods.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-purple-50">
                                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                                        <Check className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <p className="text-purple-900 text-base font-['Inter'] font-semibold">{item.new}</p>
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
