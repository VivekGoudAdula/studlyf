
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onPostOpportunity: () => void;
}

import { 
    LayoutDashboard, 
    Briefcase, 
    ClipboardList, 
    Users, 
    UserCircle, 
    Download, 
    Settings,
    Plus,
    LogOut,
    UserCheck,
    Trophy,
    BarChart3,
} from 'lucide-react';

const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'events', label: 'Events Management', icon: Briefcase },
    { id: 'participants', label: 'Participants', icon: Users },
    { id: 'teams', label: 'Teams', icon: UserCircle },
    { id: 'submissions', label: 'Submissions', icon: ClipboardList },
    { id: 'judges', label: 'Judge Management', icon: UserCheck },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'analytics', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'settings', label: 'Settings', icon: Settings },
];


const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onPostOpportunity }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        logout();
    };


    return (
        <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-50 pt-8">
            <div className="p-6 flex items-center gap-3">
                <img src="/images/studlyf.png" alt="Studlyf" className="h-10" />
                <span className="font-['Outfit'] font-black text-xl tracking-tight text-[#0f172a]">INSTITUTION</span>
            </div>

            <div className="px-4 mb-6">
                <button 
                    onClick={onPostOpportunity}
                    className="w-full py-3 bg-gradient-to-r from-[#6C3BFF] to-[#9F6BFF] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-200 hover:scale-[1.02] transition-all"
                >
                    <Plus size={20} />
                    Post New Event
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {sidebarItems.map((item) => (
                    <motion.button
                        key={item.id}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left whitespace-nowrap ${
                            activeTab === item.id 
                                ? 'bg-purple-50 text-[#6C3BFF] shadow-sm' 
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        <item.icon size={20} className={activeTab === item.id ? 'text-[#6C3BFF]' : 'text-gray-400'} />
                        {item.label}
                        {activeTab === item.id && (
                            <motion.div 
                                layoutId="activePill"
                                className="ml-auto w-1 h-5 bg-[#6C3BFF] rounded-full"
                            />
                        )}
                    </motion.button>
                ))}
            </nav>

            <div className="p-4 mt-auto border-t border-gray-50">
                <div className="bg-purple-50 p-4 rounded-2xl mb-4">
                    <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-1">Support</p>
                    <p className="text-xs text-gray-600 mb-3">Facing any issues? Our team is here to help.</p>
                    <button className="text-xs font-bold text-[#6C3BFF] hover:underline">Contact Support</button>
                </div>

                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-all mt-2"
                >
                    <LogOut size={20} className="text-red-500" />
                    Logout
                </button>
            </div>
        </div>

    );
};

export default Sidebar;
