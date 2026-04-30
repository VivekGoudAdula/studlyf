
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, CheckCircle, TrendingUp } from 'lucide-react';

interface StatsSectionProps {
    institutionId?: string;
}

const StatsSection: React.FC<StatsSectionProps> = ({ institutionId = 'default_inst' }) => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const { API_BASE_URL } = await import('../../apiConfig');
                const res = await fetch(`${API_BASE_URL}/api/v1/institution/stats/${institutionId}`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error("Failed to load dynamic stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [institutionId]);

    if (loading) return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
            {[1,2,3,4].map(i => <div key={i} className="h-40 bg-slate-50 rounded-[2rem] animate-pulse" />)}
        </div>
    );

    const statCards = [
        { 
            label: 'Total Participants', 
            value: stats?.total_participants?.toLocaleString() || '0', 
            icon: Users, 
            bg: 'bg-blue-50',
            text: 'text-blue-600'
        },
        { 
            label: 'Active Events', 
            value: stats?.active_events?.toString() || '0', 
            icon: Briefcase, 
            bg: 'bg-purple-50',
            text: 'text-purple-600'
        },
        { 
            label: 'Total Teams', 
            value: stats?.total_teams?.toLocaleString() || '0', 
            icon: CheckCircle, 
            bg: 'bg-emerald-50',
            text: 'text-emerald-600'
        },
        { 
            label: 'Average Score', 
            value: stats?.average_score || '0%', 
            icon: TrendingUp, 
            bg: 'bg-amber-50',
            text: 'text-amber-600'
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
            {statCards.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="relative group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden"
                >
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <stat.icon size={24} className={stat.text} />
                            </div>
                        </div>
                        
                        <h3 className="text-4xl font-black text-slate-900 font-['Outfit'] mb-1 tracking-tight">{stat.value}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default StatsSection;
