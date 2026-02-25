
import React from 'react';
import { motion } from 'framer-motion';

interface AuthCardProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    maxWidth?: string;
}

const AuthCard: React.FC<AuthCardProps> = ({ title, subtitle, children, maxWidth = "max-w-[480px]" }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`w-full ${maxWidth} bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 p-8 sm:p-12 backdrop-blur-sm bg-white/95`}
        >
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-black text-purple-600 tracking-tighter uppercase">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-gray-500 text-sm mt-1">
                        {subtitle}
                    </p>
                )}
            </div>
            {children}
        </motion.div>
    );
};

export default AuthCard;
