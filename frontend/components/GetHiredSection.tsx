import React from 'react';
import { motion } from 'framer-motion';

const GetHiredSection: React.FC = () => {
    return (
        <section className="w-full relative py-12 lg:py-24 overflow-hidden flex items-center min-h-[400px] lg:min-h-[500px]">
            {/* Background Image Setup */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80&auto=format&fit=crop')",
                }}
            />

            {/* Dark overlay in case image needs to be darkened slightly for better text contrast */}
            <div className="absolute inset-0 z-0 bg-black/20" />

            {/* Main Layout Container */}
            <div className="max-w-[1400px] w-full mx-auto px-6 sm:px-12 lg:px-20 relative z-10 flex flex-col lg:flex-row items-center justify-between">

                {/* Left Side: Title and Button (55% width approx) */}
                <div className="flex flex-col items-start w-full lg:w-[55%]">
                    <h2
                        className="text-white font-bold text-4xl sm:text-6xl lg:text-[4.5rem] leading-[1.1] mb-10 tracking-tight"
                        style={{ fontFamily: "'Playfair Display', 'Instrument Serif', Georgia, serif" }}
                    >
                        GET HIRED!<br />
                        IN STARTUP'S
                    </h2>

                    <motion.button
                        whileHover={{ translateY: -2, boxShadow: '0 8px 20px rgba(0,0,0,0.25)' }}
                        className="bg-[#2F6FD6] text-white font-semibold flex items-center justify-center text-[17px] tracking-wide px-10 py-[18px] rounded-[40px] shadow-lg"
                    >
                        GET STARTED
                    </motion.button>
                </div>

                {/* Fallback for mobile so the glass box stacks naturally instead of overlapping */}
                <div className="block lg:hidden w-full mt-16 pt-0 relative z-20">
                    <GlassCard isMobile />
                </div>
            </div>

            {/* Right Side: Comparison Glass Box (Floating absolutely per instructions) */}
            <div className="hidden lg:block absolute right-[8%] top-1/2 -translate-y-1/2 w-[45%] max-w-[650px] z-20">
                <GlassCard />
            </div>

        </section>
    );
};

const GlassCard: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => {
    return (
        <div
            className={`w-full ${isMobile ? 'p-8 rounded-[20px]' : 'p-[40px] rounded-[20px]'}`}
            style={{
                background: 'rgba(139, 92, 246, 0.05)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                backdropFilter: 'blur(2px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
        >
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-[40px] sm:gap-[0px]">

                {/* MNC Column */}
                <div className="flex flex-col sm:pr-[40px]">
                    <h3 className="text-white font-bold text-2xl tracking-wide uppercase mb-[24px]">MNC</h3>
                    <ul className="flex flex-col gap-4">
                        {[
                            'Structured Growth',
                            'Global Exposure',
                            'Tiered Authority'
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-white font-medium text-[16px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-white/70 flex-shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* STARTUPS Column */}
                <div className="flex flex-col sm:pl-[40px] sm:border-l-2 border-[#8B5CF6]/40 relative pt-[24px] sm:pt-0 border-t-2 sm:border-t-0">
                    <h3 className="text-[#D4BFFF] font-bold text-2xl tracking-wide uppercase mb-[24px] relative z-10">STARTUPS</h3>
                    <ul className="flex flex-col gap-4">
                        {[
                            'Rapid Execution',
                            'Dynamic Roles',
                            'High Ownership'
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-white font-medium text-[16px] relative z-10">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#A88CFF] flex-shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>

                    {/* Subtle glow effect behind the startups text */}
                    <div className="absolute top-10 right-10 w-32 h-32 bg-[#A88CFF]/10 rounded-full blur-3xl pointer-events-none" />
                </div>
            </div>
        </div>
    );
};

export default GetHiredSection;
