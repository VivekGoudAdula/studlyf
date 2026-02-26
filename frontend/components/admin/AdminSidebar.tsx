
import React from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    Users,
    BookOpen,
    CheckSquare,
    MessageSquare,
    FileText,
    Briefcase,
    UserSquare2,
    Building2,
    CreditCard,
    BarChart,
    Settings,
    Activity,
    ChevronLeft,
    ChevronRight,
    LogOut
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface SidebarItemProps {
    to: string;
    icon: React.ElementType;
    label: string;
    isCollapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon: Icon, label, isCollapsed }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative
        ${isActive
                    ? 'bg-purple-600/10 text-white border border-purple-500/20 shadow-[0_0_20px_rgba(124,58,237,0.1)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
      `}
        >
            {({ isActive }) => (
                <>
                    <Icon size={20} className={`${isActive ? 'text-purple-400' : 'group-hover:text-purple-300'} transition-colors`} />
                    {!isCollapsed && (
                        <span className="font-medium text-sm tracking-wide">{label}</span>
                    )}
                    {isActive && (
                        <motion.div
                            layoutId="activeGlow"
                            className="absolute inset-0 bg-purple-500/10 blur-xl -z-10 rounded-xl"
                            initial={false}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                </>
            )}
        </NavLink>
    );
};

const AdminSidebar: React.FC<{ isCollapsed: boolean; setIsCollapsed: (v: boolean) => void }> = ({ isCollapsed, setIsCollapsed }) => {
    const menuItems = [
        { to: '/admin/dashboard', icon: BarChart3, label: 'Overview' },
        { to: '/admin/students', icon: Users, label: 'Students' },
        { to: '/admin/courses', icon: BookOpen, label: 'Courses' },
        { to: '/admin/assessments', icon: CheckSquare, label: 'Assessments' },
        { to: '/admin/mock-interviews', icon: MessageSquare, label: 'Mock Interviews' },
        { to: '/admin/resumes', icon: FileText, label: 'Resumes' },
        { to: '/admin/hiring-pipeline', icon: Briefcase, label: 'Hiring Pipeline' },
        { to: '/admin/mentors', icon: UserSquare2, label: 'Mentors' },
        { to: '/admin/companies', icon: Building2, label: 'Companies' },
        { to: '/admin/payments', icon: CreditCard, label: 'Payments' },
        { to: '/admin/analytics', icon: BarChart, label: 'Analytics' },
        { to: '/admin/content', icon: FileText, label: 'Content Management' },
        { to: '/admin/settings', icon: Settings, label: 'Settings' },
        { to: '/admin/audit-logs', icon: Activity, label: 'Audit Logs' },
    ];

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? '80px' : '280px' }}
            className="fixed left-0 top-0 h-screen bg-[#0F0F12] border-r border-white/5 flex flex-col z-50 overflow-hidden"
        >
            {/* Header */}
            <div className="p-6 flex items-center justify-between">
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <span className="font-syne font-bold text-white tracking-tight">STUDLYF ADMIN</span>
                    </motion.div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto px-3 space-y-1 py-4 no-scrollbar">
                {menuItems.map((item) => (
                    <SidebarItem key={item.to} {...item} isCollapsed={isCollapsed} />
                ))}
            </div>

            {/* Footer / User Profile */}
            <div className="p-4 mt-auto border-t border-white/5">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300">
                    <LogOut size={20} />
                    {!isCollapsed && <span className="font-medium text-sm">Sign Out</span>}
                </button>
            </div>
        </motion.aside>
    );
};

export default AdminSidebar;
