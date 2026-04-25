import React from 'react';
import { motion } from 'framer-motion';

const AlertsPanel: React.FC = () => {
    return (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 h-full flex flex-col">
            <div className="flex items-center gap-6 mb-10 pb-4 border-b border-gray-50">
                <button className="text-sm font-bold text-[#6C3BFF] relative pb-4">
                    Alerts
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#6C3BFF] rounded-full" />
                </button>
                <button className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors pb-4">
                    Upcoming
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative mb-8"
                >
                    <div className="w-48 h-48 bg-purple-50 rounded-full flex items-center justify-center">
                        <img 
                            src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-616.jpg?t=st=1714053842~exp=1714057442~hmac=6f1082c5957b4430e791f422c5e55e2d1844b26f53488737a6b8c8d23456c66a&w=740" 
                            alt="Empty state" 
                            className="w-32 h-32 object-contain mix-blend-multiply"
                        />
                    </div>
                    <motion.div 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute -top-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-purple-100"
                    >
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-black">
                            ✓
                        </div>
                    </motion.div>
                </motion.div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">You're All Caught Up!</h3>
                <p className="text-sm text-gray-400 leading-relaxed max-w-[200px]">
                    No pending actions right now. Check back later for new notifications.
                </p>
            </div>

            <div className="mt-8 bg-gradient-to-br from-[#6C3BFF] to-[#9F6BFF] p-6 rounded-3xl relative overflow-hidden group">
                <div className="relative z-10">
                    <h4 className="text-white font-bold mb-2">Customise Your Experience</h4>
                    <p className="text-purple-100 text-[10px] mb-4">
                        Enhance your experience with tailored services designed to meet your specific requirements.
                    </p>
                    <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-[10px] font-bold px-4 py-2 rounded-xl transition-all">
                        Contact Us →
                    </button>
                </div>
                {/* Abstract pattern */}
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            </div>
        </div>
    );
};

export default AlertsPanel;
