import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, ClipboardList, TrendingUp, Calendar, CheckCircle } from 'lucide-react';

const StatsSection: React.FC = () => {
    const [stats, setStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/v1/institution/summary/default_inst');
                const data = await res.json();
                
                const formattedStats = [
                    { 
                        label: 'Total Participants', 
                        value: data.total_participants?.toLocaleString() || '0', 
                        icon: Users, 
                        bg: 'bg-blue-50',
                        text: 'text-blue-600',
                        trend: '+12.5%' 
                    },
                    { 
                        label: 'Active Events', 
                        value: data.active_events?.toString() || '0', 
                        icon: Briefcase, 
                        bg: 'bg-purple-50',
                        text: 'text-[#6C3BFF]',
                        trend: '+2' 
                    },
                    { 
                        label: 'Total Submissions', 
                        value: data.total_submissions?.toLocaleString() || '0', 
                        icon: CheckCircle, 
                        bg: 'bg-emerald-50',
                        text: 'text-emerald-600',
                        trend: '+18%' 
                    },
                    { 
                        label: 'Average Score', 
                        value: `${data.average_score || 0}%`, 
                        icon: TrendingUp, 
                        bg: 'bg-amber-50',
                        text: 'text-amber-600',
                        trend: '+5.2%' 
                    },
                ];
                setStats(formattedStats);
            } catch (err) {
                console.error("Failed to load dynamic stats");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="grid grid-cols-4 gap-6 mb-10 h-32 animate-pulse bg-slate-50 rounded-3xl" />;
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
