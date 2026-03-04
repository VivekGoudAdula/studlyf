
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LandingNavbar: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="absolute top-0 left-0 right-0 z-[100] px-8 py-5 flex items-center justify-between pointer-events-none">
            <div
                className="cursor-pointer tracking-tight pointer-events-auto bg-white/80 backdrop-blur-sm px-6 py-2 rounded-2xl border border-gray-200 shadow-sm transition-all hover:shadow-md hover:scale-[1.02]"
                onClick={() => navigate('/')}
            >
                <img src="/images/studlyf.png" alt="STUDLYF" className="h-10 sm:h-12" />
            </div>

            {/* Sign In - Pointer events auto */}
            <motion.button
                whileHover={{ backgroundColor: '#f3f4f6' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login')}
                className="px-10 py-4 rounded-full border border-gray-200 text-base font-bold text-black transition-colors bg-white/80 backdrop-blur-sm pointer-events-auto shadow-sm"
            >
                Sign in
            </motion.button>
        </div>
    );
};

export default LandingNavbar;
