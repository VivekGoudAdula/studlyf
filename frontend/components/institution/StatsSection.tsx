import React from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, ClipboardList, TrendingUp } from 'lucide-react';

const stats = [
    { label: 'Total Candidates', value: '1,284', icon: Users, color: 'purple', trend: '+12%' },
    { label: 'Active Opportunities', value: '12', icon: Briefcase, color: 'blue', trend: '+4%' },
    { label: 'Active Assessments', value: '08', icon: ClipboardList, color: 'orange', trend: '0%' },
    { label: 'Total Registrations', value: '456', icon: TrendingUp, color: 'green', trend: '+28%' },
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
                    className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-500 group-hover:scale-110 transition-transform`}>
                            <stat.icon size={24} />
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full bg-gray-50 ${
                            stat.trend.startsWith('+') ? 'text-green-500' : 'text-gray-400'
                        }`}>
                            {stat.trend}
                        </span>
                    </div>
                    <h3 className="text-2xl font-black text-[#0f172a] mb-1">{stat.value}</h3>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                </motion.div>
            ))}
        </div>
    );
};

export default StatsSection;
