
import React from 'react';
import { motion } from 'framer-motion';

interface AuthCardProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ title, subtitle, children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[400px] relative group"
        >
            {/* Multi-layered Glass Effect */}
            <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-3xl rounded-[32px] border border-white/20 shadow-[0_32px_120px_rgba(0,0,0,0.5)] transition-all duration-700 group-hover:border-white/30" />

            {/* Inner Glow / Specular Highlight */}
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 p-8 sm:p-10">
                <div className="mb-8">
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-1">{title}</h2>
                    {subtitle && <p className="text-gray-400 font-medium text-sm tracking-wide">{subtitle}</p>}

                    {/* Decorative Line */}
                    <div className="w-12 h-1 bg-purple-500/50 rounded-full mt-4" />
                </div>
                {children}
            </div>
        </motion.div>
    );
};

export default AuthCard;
