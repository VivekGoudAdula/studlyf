
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MoveRight } from 'lucide-react';

// Define the content data
const items = [
    {
        id: '01',
        title: 'Practical Learning',
        description: 'Learn through real-world problem solving and interactive challenges.',
        image: '/templates/practicallearning.png'
    },
    {
        id: '02',
        title: 'Career-Focused Paths',
        description: 'Structured journeys designed for tech and high-growth careers.',
        image: '/templates/career.png'
    },
    {
        id: '03',
        title: 'Live Practice Modules',
        description: 'Hands-on coding and skill-based assessments in real-time.',
        image: '/templates/practice.png'
    },
    {
        id: '04',
        title: 'AI-Guided Feedback',
        description: 'Smart evaluation and instant improvement suggestions.',
        image: '/templates/feedback.png'
    }
];

const WhatIsStudlyf: React.FC = () => {
    const [activeId, setActiveId] = useState<string>('01');

    // Find the active item data
    const activeItem = items.find((item) => item.id === activeId) || items[0];

    return (
        <section className="bg-white py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
            {/* Header Section */}
            <div className="text-center mb-12 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="inline-block mb-8"
                >
                    <span className="py-2 px-6 rounded-full bg-purple-50 border border-purple-100 text-[#6C4DFF] font-['Poppins'] font-bold tracking-widest text-sm uppercase shadow-sm">
                        Say hello to latest learning
                    </span>
                </motion.div>

                <div className="overflow-hidden">
                    <motion.h3
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl lg:text-6xl font-['Poppins'] font-extrabold text-black leading-[1.1] tracking-tight"
                    >
                        {/* Static first part to ensure visibility, then animated name */}
                        <motion.span
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="inline-block mr-2 md:mr-3"
                        >
                            wait, what is
                        </motion.span>
                        <motion.span
                            initial={{ y: 50, opacity: 0, scale: 0.9 }}
                            whileInView={{ y: 0, opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.6,
                                ease: "backOut",
                                delay: 0.4
                            }}
                            className="inline-block text-[#6C4DFF] underline decoration-2 underline-offset-4 md:decoration-4 md:underline-offset-8 decoration-[#6C4DFF]/30"
                        >
                            STUDLYF?
                        </motion.span>
                    </motion.h3>
                </div>
            </div>

            {/* Main Layout */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-stretch">

                {/* Left Side: Dynamic Image */}
                <div className="w-full lg:w-1/2 relative min-h-[300px] md:min-h-[400px] lg:h-auto rounded-2xl overflow-hidden shadow-lg order-1 lg:order-1 bg-gray-100">
                    <AnimatePresence>
                        <motion.img
                            key={activeItem.id}
                            src={activeItem.image}
                            alt={activeItem.title}
                            initial={{ opacity: 0, scale: 1 }}
                            animate={{ opacity: 1, scale: 1.05, zIndex: 10 }}
                            exit={{ opacity: 0, scale: 1.05, zIndex: 0 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </AnimatePresence>

                    {/* Optional Overlay gradient for better text contrast if we had text over image, but currently clean */}
                    <div className="absolute inset-0 bg-black/5 pointer-events-none z-20"></div>
                </div>

                {/* Right Side: Interactive List */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center order-2 lg:order-2 space-y-1">
                    {items.map((item) => {
                        const isActive = activeId === item.id;

                        return (
                            <div
                                key={item.id}
                                onMouseEnter={() => setActiveId(item.id)}
                                onClick={() => setActiveId(item.id)} // For mobile/touch support
                                className={`
                  group relative border-b border-gray-100 last:border-0 cursor-pointer transition-all duration-300
                  ${isActive ? 'bg-[#F9FAFB] sm:bg-[#F5F3FF]/50' : 'bg-white hover:bg-gray-50'}
                `}
                            >
                                {/* Active Indicator Line (Left) */}
                                <motion.div
                                    initial={false}
                                    animate={{
                                        height: isActive ? '100%' : '0%',
                                        opacity: isActive ? 1 : 0
                                    }}
                                    className="absolute left-0 top-0 w-1 bg-[#6C4DFF]"
                                />

                                <div className="p-4 md:p-6 flex flex-col justify-center">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-4 md:gap-6">
                                            <span className={`text-xs md:text-sm font-['Poppins'] tracking-wider transition-colors duration-300 ${isActive ? 'text-[#6C4DFF]' : 'text-gray-400'}`}>
                                                {item.id}
                                            </span>
                                            <h4 className={`text-lg md:text-xl font-['Poppins'] transition-colors duration-300 ${isActive ? 'text-black font-bold' : 'text-gray-500 font-medium'}`}>
                                                {item.title}
                                            </h4>
                                        </div>

                                        {/* Arrow / Chevron */}
                                        <motion.div
                                            animate={{ rotate: isActive ? 90 : 0, x: isActive ? 0 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            className={`text-gray-400 ${isActive ? 'text-[#6C4DFF]' : ''}`}
                                        >
                                            {isActive ? (
                                                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                                            ) : (
                                                <MoveRight className="w-4 h-4 md:w-5 md:h-5 opacity-50" />
                                            )}
                                        </motion.div>
                                    </div>

                                    {/* Expandable Description */}
                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                                                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                className="overflow-hidden"
                                            >
                                                <p className="text-sm text-gray-600 pl-[2.5rem] md:pl-[3.5rem] leading-relaxed max-w-md font-['Poppins']">
                                                    {item.description}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default WhatIsStudlyf;
