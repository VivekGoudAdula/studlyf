import React from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, ClipboardList, TrendingUp, Calendar, CheckCircle } from 'lucide-react';

const stats = [
    { 
        label: 'Total Participants', 
        value: '4,285', 
        icon: Users, 
        color: 'from-blue-500 to-indigo-600', 
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        trend: '+12.5%' 
    },
    { 
        label: 'Active Events', 
        value: '12', 
        icon: Briefcase, 
        color: 'from-purple-500 to-[#6C3BFF]', 
        bg: 'bg-purple-50',
        text: 'text-[#6C3BFF]',
        trend: '+2' 
    },
    { 
        label: 'Total Submissions', 
        value: '1,850', 
        icon: CheckCircle, 
        color: 'from-emerald-500 to-teal-600', 
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        trend: '+18%' 
    },
    { 
        label: 'Average Score', 
        value: '84%', 
        icon: TrendingUp, 
        color: 'from-amber-500 to-orange-600', 
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        trend: '+5.2%' 
    },
];

const StatsSection: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="relative group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden"
                >
                    {/* Decorative Background Icon */}
                    <stat.icon className="absolute -right-4 -bottom-4 w-24 h-24 text-slate-50 group-hover:text-slate-100/50 transition-colors pointer-events-none" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <stat.icon size={24} className={stat.text} />
                            </div>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                            }`}>
                                {stat.trend}
                            </span>
                        </div>
                        
                        <h3 className="text-3xl font-black text-slate-900 font-['Outfit'] mb-1 tracking-tight">{stat.value}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default StatsSection;
