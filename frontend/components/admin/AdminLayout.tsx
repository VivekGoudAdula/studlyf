
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from './AdminSidebar';
import { Bell, Search, User } from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            {/* Sidebar */}
            <AdminSidebar
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
            />

            {/* Main Content */}
            <motion.main
                animate={{
                    marginLeft: isSidebarCollapsed ? '80px' : '280px'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.2 }}
                className="min-h-screen flex flex-col relative"
            >
                {/* Top Header */}
                <header className="h-20 border-b border-white/5 bg-[#0F0F12]/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 max-w-xl">
                        <div className="relative w-full group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Deep search across ecosystem..."
                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-2.5 pl-12 pr-4 outline-none focus:border-purple-500/30 focus:ring-4 focus:ring-purple-500/5 transition-all text-sm placeholder:text-gray-600"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full border-2 border-[#0F0F12]"></span>
                        </button>
                        <div className="h-8 w-px bg-white/5"></div>
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-white leading-none">Super Admin</p>
                                <p className="text-[10px] font-medium text-purple-400 uppercase tracking-widest mt-1">Vivek Goud</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center border border-purple-500/20 shadow-lg shadow-purple-500/10">
                                <User size={20} className="text-white" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="p-8 flex-grow">
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.main>
        </div>
    );
};

export default AdminLayout;
