
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LandingNavbar: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="absolute top-0 left-0 right-0 z-[100] px-8 py-5 flex items-center justify-between pointer-events-none">
            {/* Logo - Pointer events auto to be clickable */}
            <div
                className="text-2xl font-['Poppins'] font-bold text-black cursor-pointer tracking-tight pointer-events-auto"
                onClick={() => navigate('/')}
            >
                STUDLYF
            </div>

            {/* Sign In - Pointer events auto */}
            <motion.button
                whileHover={{ backgroundColor: '#f3f4f6' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login')}
                className="px-8 py-2.5 rounded-full border border-gray-200 text-sm font-bold text-black transition-colors bg-white/80 backdrop-blur-sm pointer-events-auto"
            >
                Sign in
            </motion.button>
        </div>
    );
};

export default LandingNavbar;
