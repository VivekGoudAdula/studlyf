
import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    ArrowUpRight,
    Users,
    Target,
    Calendar,
    Download,
    BarChart3,
    PieChart,
    Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../../../apiConfig';
import { useAuth } from '../../../AuthContext';

const Analytics: React.FC = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!user?.email) return;
            try {
                const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
                    headers: { 'X-Admin-Email': user.email }
                });
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user]);

    const communityGrowth = stats?.totalStudents ? (stats.totalStudents / 1000).toFixed(1) + 'k' : '24.2k';
    const revenueValue = stats?.revenue || '$1.24M';

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Intelligence & Analytics</h1>
                    <p className="text-white/50 mt-1">Deep dive into the health and growth metrics of StudLyf.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white/70 flex items-center gap-2">
                        <Calendar size={14} />
                        Q1 2026
                    </button>
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white/70 flex items-center gap-2">
                        <Download size={14} />
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Performance Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#111111] border border-white/10 rounded-3xl p-8 flex flex-col justify-between h-64 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Users size={80} />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Community Growth</div>
                        <div className="text-5xl font-bold text-white tracking-tighter">{communityGrowth}</div>
                        <div className="flex items-center gap-2 mt-4 text-green-400 font-bold">
                            <TrendingUp size={18} />
                            <span>{stats?.studentGrowth || '+18.4%'} this month</span>
                        </div>
                    </div>
                    <div className="flex items-end gap-1 h-12">
                        {[4, 6, 8, 5, 9, 12, 10, 15, 12, 18, 14, 20].map((h, i) => (
                            <div key={i} className="flex-grow bg-[#7C3AED]/20 hover:bg-[#7C3AED] transition-colors rounded-t-sm" style={{ height: `${(h / 20) * 100}%` }} />
                        ))}
                    </div>
                </div>

                <div className="bg-[#111111] border border-white/10 rounded-3xl p-8 flex flex-col justify-between h-64 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Target size={80} />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Placement Efficiency</div>
                        <div className="text-5xl font-bold text-white tracking-tighter">{stats?.interviewSuccess || '82%'}</div>
                        <div className="flex items-center gap-2 mt-4 text-[#7C3AED] font-bold">
                            <Activity size={18} />
                            <span>Optimal performance</span>
                        </div>
                    </div>
                    <div className="flex items-end gap-1 h-12">
                        {[12, 10, 15, 12, 18, 14, 20, 15, 12, 8, 10, 14].map((h, i) => (
                            <div key={i} className="flex-grow bg-blue-500/20 hover:bg-blue-500 transition-colors rounded-t-sm" style={{ height: `${(h / 20) * 100}%` }} />
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-3xl p-8 flex flex-col justify-between h-64 shadow-2xl shadow-purple-900/40 border border-white/20">
                    <div>
                        <div className="text-xs font-bold text-white/50 uppercase tracking-[0.2em] mb-4">Total Revenue Generated</div>
                        <div className="text-5xl font-bold text-white tracking-tighter">{revenueValue}</div>
                        <p className="text-white/70 text-sm mt-4 leading-snug">Exceeded target by 12% in the current fiscal period.</p>
                    </div>
                    <button className="w-full py-2 bg-white text-purple-700 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg">
                        Revenue Breakdown
                    </button>
                </div>
            </div>

            {/* In-depth Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Placement funnel */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 h-[500px] flex flex-col">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            <BarChart3 className="text-[#7C3AED]" /> Placement Velocity
                        </h3>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#7C3AED]" /><span className="text-[10px] text-white/40 font-bold uppercase">Target</span></div>
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-white/10" /><span className="text-[10px] text-white/40 font-bold uppercase">Actual</span></div>
                        </div>
                    </div>
                    <div className="flex-grow flex items-end gap-4 px-4 pb-4 border-b border-white/5">
                        {[60, 40, 80, 50, 90, 65, 100].map((h, i) => (
                            <div key={i} className="flex-grow relative h-full flex flex-col justify-end gap-2 group">
                                <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.1 }} className="w-full bg-[#7C3AED]/20 rounded-t-lg group-hover:bg-[#7C3AED]/40 transition-all" />
                                <motion.div initial={{ height: 0 }} animate={{ height: `${h * 0.7}%` }} transition={{ delay: i * 0.15 }} className="absolute bottom-0 w-full bg-[#7C3AED] rounded-t-lg opacity-80" />
                                <div className="text-center text-[10px] text-white/30 font-bold mt-2 uppercase">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</div>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-8">
                        <div className="text-center">
                            <div className="text-[10px] font-bold text-white/30 uppercase mb-1">New Leads</div>
                            <div className="text-xl font-bold text-white">+1,240</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] font-bold text-white/30 uppercase mb-1">Capped</div>
                            <div className="text-xl font-bold text-white">412</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] font-bold text-white/30 uppercase mb-1">Offered</div>
                            <div className="text-xl font-bold text-white">188</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] font-bold text-white/30 uppercase mb-1">Drop-off</div>
                            <div className="text-xl font-bold text-red-400">12%</div>
                        </div>
                    </div>
                </div>

                {/* Skill Distribution */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 h-[500px] flex flex-col">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            <PieChart className="text-blue-500" /> Skill Distribution
                        </h3>
                        <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-white/40 uppercase">All Tracks</div>
                    </div>
                    <div className="flex-grow flex items-center justify-center relative">
                        <div className="w-64 h-64 rounded-full border-[1.5rem] border-white/5 relative flex items-center justify-center">
                            {/* Simplified radial breakdown */}
                            <div className="absolute inset-0 rounded-full border-[1.5rem] border-blue-500 border-l-transparent border-b-transparent rotate-45" />
                            <div className="absolute inset-0 rounded-full border-[1.5rem] border-[#7C3AED] border-r-transparent border-t-transparent shadow-[0_0_20px_#7C3AED66]" />
                            <div className="flex flex-col items-center">
                                <div className="text-4xl font-bold text-white tracking-tighter">8 Tracks</div>
                                <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Analyzed</div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4 mt-8">
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#7C3AED]" /><span className="text-white/70">Frontend Engineeering</span></div>
                            <span className="text-white/40 font-bold">42%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500" /><span className="text-white/70">Data Science & ML</span></div>
                            <span className="text-white/40 font-bold">28%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-white/10" /><span className="text-white/70">Other (DevOps, UI, etc)</span></div>
                            <span className="text-white/40 font-bold">30%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Insight Highlight */}
            <div className="bg-gradient-to-r from-[#1A0B2E] to-[#111] border border-white/10 rounded-3xl p-10 flex flex-col md:flex-row items-center gap-10">
                <div className="w-24 h-24 rounded-full bg-[#7C3AED]/20 flex items-center justify-center flex-shrink-0 animate-pulse">
                    <TrendingUp size={48} className="text-[#7C3AED]" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Predictive Growth Curve</h3>
                    <p className="text-white/50 text-sm leading-relaxed max-w-xl">
                        Based on current enrollment velocity and course satisfaction scores, we project a <strong>140% increase</strong> in "Hire-Ready" candidates by August 2026. Suggesting proactive outreach to 12 new partner companies.
                    </p>
                </div>
                <button className="md:ml-auto px-8 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl text-sm font-bold shadow-xl shadow-purple-500/20 active:scale-95 transition-all whitespace-nowrap">
                    View Full Forecast
                </button>
            </div>
        </div>
    );
};

export default Analytics;
