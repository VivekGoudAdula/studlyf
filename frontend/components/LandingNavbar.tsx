
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingNavbar: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="absolute top-0 left-0 right-0 z-[100] px-8 py-8 flex items-center justify-between">
            <div
                className="text-2xl font-['Poppins'] font-bold text-black cursor-pointer tracking-tight"
                onClick={() => navigate('/')}
            >
                STUDLYF
            </div>

            <motion.button
                whileHover={{ backgroundColor: '#f3f4f6' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login')}
                className="px-8 py-2.5 rounded-full border border-gray-200 text-sm font-bold text-black transition-colors"
            >
                Sign in
            </motion.button>
        </div>
    );
};

export default LandingNavbar;
