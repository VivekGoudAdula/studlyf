
import React from 'react';
import { motion } from 'framer-motion';
import {
    BarChart,
    PieChart,
    TrendingUp,
    Users,
    BookOpen,
    Target,
    CheckCircle2,
    Download,
    Calendar,
    ChevronDown,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const AnalyticsPage: React.FC = () => {
    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Deep Intelligence</h1>
                        <p className="text-gray-500 text-sm">Advanced data visualization and predictive ecosystem modeling.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2.5 bg-[#0F0F12] border border-white/5 rounded-2xl text-xs font-bold text-gray-400 hover:text-white transition-all flex items-center gap-2 uppercase tracking-widest">
                            <Calendar size={16} /> Last 30 Days <ChevronDown size={14} />
                        </button>
                        <button className="px-4 py-2.5 bg-purple-600 rounded-2xl text-xs font-bold text-white shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all flex items-center gap-2 uppercase tracking-widest">
                            <Download size={16} /> Export Report
                        </button>
                    </div>
                </div>

                {/* Growth Velocity Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Growth Velocity', value: '+24.8%', icon: TrendingUp, color: 'purple' },
                        { label: 'Retention Rate', value: '91.2%', icon: Users, color: 'emerald' },
                        { label: 'Content Depth', value: '1,420h', icon: BookOpen, color: 'blue' },
                        { label: 'Market Trust', value: '8.4/10', icon: Target, color: 'amber' },
                    ].map((stat, i) => (
                        <div key={i} className="p-6 rounded-[24px] bg-[#0F0F12] border border-white/5 relative group overflow-hidden">
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/5 blur-[50px] -mr-16 -mt-16`} />
                            <stat.icon size={20} className="text-gray-500 mb-4" />
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                {/* Main Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Linear Growth Chart Mockup */}
                    <div className="p-8 rounded-[32px] bg-[#0F0F12] border border-white/5">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">Placement Revenue Funnel</h3>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Projected vs Actual Revenue</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Actual</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-white/10" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Forecast</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-48 flex items-end justify-between gap-1 px-4">
                            {[40, 65, 30, 85, 45, 90, 55, 75, 60, 95, 80, 100].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: i * 0.05, duration: 0.8 }}
                                    className="flex-1 min-w-[12px] bg-gradient-to-t from-purple-900/40 to-purple-600 rounded-t-lg relative group"
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded text-[8px] font-bold text-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                        ${h}k
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-6 px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                            <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Dec</span>
                        </div>
                    </div>

                    {/* Distribution Pie Chart Mockup */}
                    <div className="p-8 rounded-[32px] bg-[#0F0F12] border border-white/5">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">Skill Gap Distribution</h3>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Language popularity across learners</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center h-48 relative">
                            {/* Simple CSS-based Circular Visualization Mockup */}
                            <div className="w-36 h-36 rounded-full border-8 border-white/5 flex items-center justify-center relative">
                                <div className="absolute inset-0 rounded-full border-8 border-purple-500 border-t-transparent skew-x-12 rotate-45" />
                                <div className="absolute inset-0 rounded-full border-8 border-indigo-500 border-r-transparent border-t-transparent -rotate-12" />
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-white">42%</p>
                                    <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest leading-none">Javascript</p>
                                </div>
                            </div>
                            <div className="ml-12 space-y-3">
                                {[
                                    { label: 'Javascript/TS', color: 'bg-purple-500', value: '42%' },
                                    { label: 'Python', color: 'bg-indigo-500', value: '28%' },
                                    { label: 'Go/Rust', color: 'bg-emerald-500', value: '18%' },
                                    { label: 'Other', color: 'bg-gray-700', value: '12%' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest w-24">{item.label}</span>
                                        <span className="text-[10px] font-bold text-white">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Detailed Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {[
                        { title: 'Course Completion', value: '58.4%', trend: 'up', trendV: '12%', color: 'purple' },
                        { label: 'Hiring Conversion', value: '14.2%', trend: 'down', trendV: '2%', color: 'rose' },
                        { label: 'Assessment Pass', value: '62.1%', trend: 'up', trendV: '8%', color: 'emerald' },
                    ].map((m, i) => (
                        <div key={i} className="p-8 rounded-[32px] bg-[#0F0F12] border border-white/5">
                            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">{m.label || m.title}</h4>
                            <div className="flex items-end justify-between">
                                <h3 className="text-3xl font-bold text-white">{m.value}</h3>
                                <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${m.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                    }`}>
                                    {m.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                    {m.trendV}
                                </div>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full mt-6 overflow-hidden">
                                <div className={`h-full bg-purple-500`} style={{ width: m.value }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AnalyticsPage;
