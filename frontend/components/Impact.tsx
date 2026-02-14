import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';

interface ImpactCardProps {
    title: string;
    stat: string;
    illustration?: string;
    lottiePath?: string;
    className?: string;
    gradient: string;
    isLarge?: boolean;
}

const ImpactCard = ({ title, stat, illustration, lottiePath, className = "", gradient, isLarge = false }: ImpactCardProps) => {
    const [animationData, setAnimationData] = useState<any>(null);

    useEffect(() => {
        if (lottiePath) {
            fetch(lottiePath)
                .then(res => res.json())
                .then(data => setAnimationData(data))
                .catch(err => console.error("Error loading Lottie animation:", err));
        }
    }, [lottiePath]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className={`relative rounded-[2.5rem] overflow-hidden group p-8 md:p-10 flex ${isLarge ? 'flex-col' : 'flex-col md:flex-row'} justify-between transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/5 ${className}`}
        >
            {/* Background Gradient & Glow - Always Dark */}
            <div className={`absolute inset-0 opacity-100 bg-gradient-to-br ${gradient}`} />
            <div className="absolute inset-0 bg-[#0B0B0F]/40 backdrop-blur-[2px]" />

            {/* Premium Animated Border - Rotating light */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent,transparent,rgba(124,58,237,0.3),transparent,transparent)] animate-[spin_4s_linear_infinite]" />
            </div>

            {/* Subtle Noise Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Animated Glow Particles (Subtle) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/30 rounded-full blur-[1px]"
                        animate={{
                            y: [0, -150],
                            x: [0, Math.random() * 60 - 30],
                            opacity: [0, 0.4, 0],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 3,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                        }}
                        style={{
                            left: `${20 + Math.random() * 60}%`,
                            bottom: "-5%",
                        }}
                    />
                ))}
            </div>

            {/* Content Area */}
            <div className={`relative z-10 flex flex-col ${isLarge ? 'mb-8 items-center text-center pt-16 md:pt-20' : 'md:w-1/2 md:pr-4 justify-center mb-6 md:mb-0'}`}>
                <motion.div>
                    <h3 className="text-white font-poppins font-bold text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-none mb-3 drop-shadow-2xl">
                        {stat}
                    </h3>
                    <p className="text-indigo-300 font-poppins font-semibold text-xs md:text-sm uppercase tracking-[0.2em] leading-relaxed">
                        {title}
                    </p>
                </motion.div>
            </div>

            {/* Illustration Area */}
            <div className={`relative z-10 flex items-center justify-center ${isLarge ? 'mt-auto h-[280px] md:h-[350px]' : 'md:w-1/2 h-[180px] md:h-full'}`}>
                <motion.div
                    animate={{
                        y: [-8, 8],
                        rotate: [-0.5, 0.5],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                    }}
                    className="w-full h-full flex items-center justify-center relative"
                >
                    {/* Shadow under image */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/40 blur-2xl rounded-full" />

                    {animationData ? (
                        <Lottie
                            animationData={animationData}
                            loop={true}
                            className={`w-full h-full object-contain ${isLarge ? 'max-w-[100%]' : 'max-w-[100%]'}`}
                        />
                    ) : illustration ? (
                        <img
                            src={illustration}
                            alt={title}
                            className={`object-contain max-h-full transition-all duration-700 group-hover:scale-105 group-hover:drop-shadow-[0_20px_30px_rgba(99,102,241,0.4)] ${isLarge ? 'w-[90%]' : 'w-[85%]'}`}
                        />
                    ) : null}
                </motion.div>

                {/* Specific Card Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>

            {/* Border Inner Shine */}
            <div className="absolute inset-0 border border-white/10 rounded-[2.5rem] pointer-events-none group-hover:border-white/30 transition-colors duration-500" />
        </motion.div>
    );
};

const Impact: React.FC = () => {
    return (
        <section className="w-full bg-white pt-0 pb-24 px-4 md:px-8 lg:px-12 overflow-hidden relative" id="impact">
            {/* Background Radial Glows - Premium Softness */}
            <div className="absolute top-[5%] left-[-5%] w-[800px] h-[800px] bg-indigo-100/40 rounded-full blur-[180px] pointer-events-none" />
            <div className="absolute bottom-[5%] right-[-5%] w-[900px] h-[900px] bg-blue-50/50 rounded-full blur-[200px] pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                {/* Heading */}
                <div className="text-center mb-20 relative px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl lg:text-7xl font-bold font-poppins text-[#0F172A] leading-[1.1] tracking-tight"
                    >
                        Our Impact is Our{' '}
                        <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700">
                            Best Testimony
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: '100%' }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="absolute bottom-2 left-0 h-3 bg-indigo-600/5 -z-10"
                            />
                        </span>
                    </motion.h2>
                </div>

                {/* Grid Layout - Inspired by Bento Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:h-[48rem]">
                    {/* LEFT LARGE CARD (Vertical) */}
                    <div className="lg:col-span-6 h-full">
                        <ImpactCard
                            stat="25,000+"
                            title="Engineers Verified & Enrolled"
                            lottiePath="/animations/students.json"
                            gradient="from-[#0D0D1A] via-[#121225] to-[#1A1A35]"
                            isLarge={true}
                            className="h-full"
                        />
                    </div>

                    {/* RIGHT COLUMN (Stacked Horizontal Cards) */}
                    <div className="lg:col-span-6 flex flex-col gap-8">
                        {/* RIGHT TOP CARD (Horizontal) */}
                        <div className="flex-1">
                            <ImpactCard
                                stat="7,500+"
                                title="Specialized Tracks Completed"
                                lottiePath="/animations/tracks.json"
                                gradient="from-[#11112B] via-[#1A1A3A] to-[#252552]"
                                className="h-full"
                            />
                        </div>

                        {/* RIGHT BOTTOM CARD (Horizontal) */}
                        <div className="flex-1">
                            <ImpactCard
                                stat="10,000+"
                                title="Placements & Internships"
                                lottiePath="/animations/placements.json"
                                gradient="from-[#0A0A1F] via-[#0F0F2D] to-[#1E1E3F]"
                                className="h-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Impact;
