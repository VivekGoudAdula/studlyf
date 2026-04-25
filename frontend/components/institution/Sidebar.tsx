import React from 'react';
import { motion } from 'framer-motion';
import { 
    LayoutDashboard, 
    Briefcase, 
    ClipboardList, 
    Users, 
    UserCircle, 
    Download, 
    Settings,
    Plus
} from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onPostOpportunity: () => void;
}

const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'assessments', label: 'Assessments', icon: ClipboardList },
    { id: 'talent', label: 'Talent Pipeline', icon: Users },
    { id: 'interviews', label: 'Interviews', icon: UserCircle },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'settings', label: 'Settings', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onPostOpportunity }) => {
    return (
        <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-50 pt-4">
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
                    Post Opportunity
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {sidebarItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                            activeTab === item.id 
                                ? 'bg-purple-50 text-[#6C3BFF]' 
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        <item.icon size={20} className={activeTab === item.id ? 'text-[#6C3BFF]' : 'text-gray-400'} />
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="p-4 mt-auto border-t border-gray-50">
                <div className="bg-purple-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-1">Support</p>
                    <p className="text-xs text-gray-600 mb-3">Facing any issues? Our team is here to help.</p>
                    <button className="text-xs font-bold text-[#6C3BFF] hover:underline">Contact Support</button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
