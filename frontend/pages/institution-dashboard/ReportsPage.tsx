import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Award, FileText, Download, Calendar } from 'lucide-react';

interface AnalyticsSummary {
    total_events: number;
    total_participants: number;
    total_teams: number;
    average_score: number;
}

const ReportsPage: React.FC = () => {
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [timeline, setTimeline] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [scoreDist, setScoreDist] = useState<any[]>([]);
    const [subDist, setSubDist] = useState<any[]>([]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await fetch('/api/v1/institution/summary/default_inst');
                const data = await response.json();
                setSummary(data);
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    useEffect(() => {
        const fetchExtra = async () => {
            try {
                const res1 = await fetch('/api/v1/institution/analytics/timeline');
                const data1 = await res1.json();
                setTimeline(data1);

                const res2 = await fetch('/api/v1/institution/analytics/departments');
                const data2 = await res2.json();
                setDepartments(data2);

                const res3 = await fetch('/api/v1/institution/analytics/score-distribution');
                const data3 = await res3.json();
                setScoreDist(data3);

                const res4 = await fetch('/api/v1/institution/analytics/submission-distribution');
                const data4 = await res4.json();
                setSubDist(data4);
            } catch (err) {
                console.error("Failed to load extra analytics");
            }
        };
        fetchExtra();
    }, []);

    const kpiCards = [
        { label: 'Total Events', value: summary?.total_events || 0, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Participants', value: summary?.total_participants || 0, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Total Teams', value: summary?.total_teams || 0, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Average Score', value: summary?.average_score || 0, icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    if (loading) {
        return <div className="h-96 flex items-center justify-center text-gray-400 font-medium">Synchronizing Institutional Data...</div>;
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-[#0f172a] tracking-tight">Reports & Analytics</h1>
                    <p className="text-gray-500 mt-1">Real-time performance metrics and institutional insights.</p>
                </div>
                <button 
                    onClick={() => window.open('/api/v1/institution/export-summary', '_blank')}
                    className="flex items-center gap-2 px-6 py-3 bg-[#0f172a] text-white rounded-xl font-bold text-sm hover:scale-[1.02] transition-all shadow-lg"
                >
                    <Download size={18} />
                    Export Executive Report
                </button>
            </div>

            {/* Date Range Picker */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 flex-wrap">
                <Calendar size={20} className="text-purple-600" />
                <span className="text-sm font-bold text-gray-500">Date Range:</span>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                <span className="text-gray-400">to</span>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                <button className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-all">Apply</button>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiCards.map((card, idx) => (
                    <motion.div 
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
                    >
                        <div className={`w-12 h-12 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center mb-4`}>
                            <card.icon size={24} />
                        </div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{card.label}</p>
                        <h3 className="text-3xl font-black text-[#0f172a] mt-1">{card.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Main Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Participation Trends */}
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold text-[#0f172a] mb-6">Participation Trends (Last 7 Days)</h3>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {(timeline.length > 0 ? timeline : [0,0,0,0,0,0,0]).slice(-7).map((val: any, i: number) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(val.count || 0) * 10}%` }}
                                    className="w-full bg-gradient-to-t from-purple-600 to-indigo-400 rounded-t-lg"
                                />
                                <span className="text-[10px] font-bold text-gray-400 uppercase truncate w-full text-center">
                                    {val.date?.split('-').slice(1).join('/') || 'N/A'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Department Distribution */}
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold text-[#0f172a] mb-6">Department Distribution</h3>
                    <div className="space-y-6">
                        {departments.map((dept, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex justify-between text-sm font-bold text-gray-600">
                                    <span>{dept.label}</span>
                                    <span>{dept.value} Students</span>
                                </div>
                                <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(dept.value / (summary?.total_participants || 1)) * 100}%` }}
                                        className={`h-full ${idx % 2 === 0 ? 'bg-purple-500' : 'bg-blue-500'}`}
                                    />
                                </div>
                            </div>
                        ))}
                        {departments.length === 0 && <p className="text-center text-gray-400 py-10">No department data available.</p>}
                    </div>
                </div>
            </div>

            {/* Score Distribution & Submission Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Score Distribution Histogram */}
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold text-[#0f172a] mb-6">Score Distribution</h3>
                    <div className="h-64 flex items-end justify-between gap-3">
                        {scoreDist.map((bucket, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${Math.min((bucket.count || 0) * 15, 100)}%` }}
                                    className="w-full bg-gradient-to-t from-amber-500 to-orange-300 rounded-t-lg"
                                />
                                <span className="text-[10px] font-bold text-gray-400">{bucket.range}</span>
                            </div>
                        ))}
                        {scoreDist.length === 0 && <p className="text-center text-gray-400 w-full py-10">No scores recorded yet.</p>}
                    </div>
                </div>

                {/* Submission Distribution Bar Chart */}
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold text-[#0f172a] mb-6">Submissions by Event</h3>
                    <div className="space-y-4">
                        {subDist.map((item, idx) => (
                            <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-sm font-bold text-gray-600">
                                    <span className="truncate max-w-[200px]">{item.event}</span>
                                    <span>{item.count} Submissions</span>
                                </div>
                                <div className="h-4 w-full bg-gray-50 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min((item.count / (subDist[0]?.count || 1)) * 100, 100)}%` }}
                                        className={`h-full rounded-full ${idx % 3 === 0 ? 'bg-green-500' : idx % 3 === 1 ? 'bg-blue-500' : 'bg-purple-500'}`}
                                    />
                                </div>
                            </div>
                        ))}
                        {subDist.length === 0 && <p className="text-center text-gray-400 py-10">No submissions recorded yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
