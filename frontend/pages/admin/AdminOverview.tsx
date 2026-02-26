
import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    BookOpen,
    CheckCircle2,
    TrendingUp,
    Target,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    ExternalLink,
    Activity
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const KPICard = ({ title, value, trend, trendValue, icon: Icon, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.5 }}
        className="p-6 rounded-[24px] bg-[#0F0F12] border border-white/5 hover:border-purple-500/20 transition-all group relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 blur-[50px] -mr-10 -mt-10 group-hover:bg-purple-600/10 transition-colors" />

        <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-white/5 text-purple-400 group-hover:scale-110 transition-transform">
                <Icon size={24} />
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                }`}>
                {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {trendValue}%
            </div>
        </div>

        <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
            </div>
        </div>
    </motion.div>
);

const AdminOverview: React.FC = () => {
    const kpis = [
        { title: 'Total Students', value: '12,482', trend: 'up', trendValue: '12', icon: Users },
        { title: 'Active Courses', value: '42', trend: 'up', trendValue: '4', icon: BookOpen },
        { title: 'Completed Assessments', value: '8,921', trend: 'up', trendValue: '28', icon: CheckCircle2 },
        { title: 'Interview Success', value: '68%', trend: 'up', trendValue: '5', icon: Target },
        { title: 'Hiring Conversions', value: '412', trend: 'up', trendValue: '18', icon: TrendingUp },
        { title: 'Total Revenue', value: '$84,200', trend: 'down', trendValue: '2', icon: DollarSign },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Ecosystem Overview</h1>
                        <p className="text-gray-500 text-sm">Real-time performance metrics and system intelligence.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-sm font-bold text-gray-300 hover:bg-white/10 transition-all flex items-center gap-2">
                            Export CSV <ExternalLink size={14} />
                        </button>
                        <button className="px-4 py-2 bg-purple-600 rounded-xl text-sm font-bold text-white shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all">
                            Add New Entity
                        </button>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                    {kpis.map((kpi, index) => (
                        <KPICard key={index} {...kpi} delay={index * 0.1} />
                    ))}
                </div>

                {/* Middle Section: Main Analytics & Intelligence */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart Placeholder */}
                    <div className="lg:col-span-2 p-8 rounded-[32px] bg-[#0F0F12] border border-white/5 h-[400px] relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-white">Student Growth</h3>
                                <p className="text-gray-500 text-xs mt-1">Daily new enrollments vs completions</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-widest border border-purple-500/20">Active</div>
                                <div className="px-3 py-1 rounded-lg bg-gray-500/10 text-gray-500 text-[10px] font-bold uppercase tracking-widest border border-white/5">Forecast</div>
                            </div>
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                            {/* SVG Chart Placeholder */}
                            <svg width="100%" height="200" viewBox="0 0 1000 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 200V150C50 140 100 160 150 140C200 120 250 100 300 110C350 120 400 80 450 70C500 60 550 90 600 75C650 60 700 40 750 35C800 30 850 50 900 40C950 30 1000 20 1000 20V200H0Z" fill="url(#purple_gradient)" fillOpacity="0.3" />
                                <path d="M0 150C50 140 100 160 150 140C200 120 250 100 300 110C350 120 400 80 450 70C500 60 550 90 600 75C650 60 700 40 750 35C800 30 850 50 900 40C950 30 1000 20 1000 20" stroke="#A855F7" strokeWidth="4" strokeLinecap="round" />
                                <defs>
                                    <linearGradient id="purple_gradient" x1="500" y1="0" x2="500" y2="200" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#A855F7" />
                                        <stop offset="1" stopColor="#A855F7" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>

                        <div className="absolute bottom-12 left-8 right-8 flex justify-between text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                            <span>Jan</span>
                            <span>Feb</span>
                            <span>Mar</span>
                            <span>Apr</span>
                            <span>May</span>
                            <span>Jun</span>
                            <span>Jul</span>
                            <span>Aug</span>
                            <span>Sep</span>
                        </div>
                    </div>

                    {/* AI Insights Panel */}
                    <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#120D1A] to-[#0F0F12] border border-purple-500/10 flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">System Intelligence</h3>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-500/60 mt-0.5">Automated Insights</p>
                            </div>
                        </div>

                        <div className="space-y-5 flex-grow">
                            {[
                                { label: 'Students at Risk', value: '14 Candidates', desc: 'Falling behind in Module 4 scoring.', color: 'rose' },
                                { label: 'High Potential', value: '8 Students', desc: 'Ready for Gold-tier partner matching.', color: 'emerald' },
                                { label: 'Course Update', value: 'React Native', desc: 'Content completion rate dropped 12%.', color: 'amber' },
                                { label: 'Hiring Shift', value: '+24% Backend', desc: 'Partners requesting Go & Rust skills.', color: 'indigo' },
                            ].map((insight, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-default group">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{insight.label}</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-${insight.color}-500/10 text-${insight.color}-400`}>Alert</span>
                                    </div>
                                    <p className="text-sm font-bold text-white">{insight.value}</p>
                                    <p className="text-xs text-gray-500 mt-1">{insight.desc}</p>
                                </div>
                            ))}
                        </div>

                        <button className="w-full py-4 mt-8 rounded-2xl bg-white/5 border border-white/5 text-xs font-bold uppercase tracking-widest text-[#7C3AED] hover:bg-white/10 transition-all">
                            Generate Full Audit
                        </button>
                    </div>
                </div>

                {/* Bottom Section: Recent Activities & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="p-8 rounded-[32px] bg-[#0F0F12] border border-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Recent Audit Logs</h3>
                            <button className="text-[10px] font-bold text-purple-400 uppercase tracking-widest hover:text-purple-300 transition-colors">View All</button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { user: 'Vivek Goud', action: 'deleted course', target: 'Introduction to AI', time: '2m ago' },
                                { user: 'Hiring Partner', action: 'viewed profile', target: 'John Doe', time: '14m ago' },
                                { user: 'Mentor AI', action: 'auto-graded', target: 'Assessment #42', time: '41m ago' },
                                { user: 'System', action: 'updated', target: 'Pricing Tier Model', time: '1h ago' },
                            ].map((log, i) => (
                                <div key={i} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors group">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-600 group-hover:text-purple-400 transition-colors">
                                        <Activity size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-400">
                                            <span className="text-white font-bold">{log.user}</span> {log.action} <span className="text-purple-400 font-medium">{log.target}</span>
                                        </p>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{log.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 rounded-[32px] bg-[#0F0F12] border border-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Course Performance</h3>
                            <button className="text-[10px] font-bold text-purple-400 uppercase tracking-widest hover:text-purple-300 transition-colors">Analytics</button>
                        </div>
                        <div className="space-y-6">
                            {[
                                { name: 'Full-Stack Foundation', progress: 84, color: 'purple' },
                                { name: 'Advanced UI/UX', progress: 62, color: 'indigo' },
                                { name: 'System Design Pro', progress: 41, color: 'blue' },
                                { name: 'Data structures Essentials', progress: 92, color: 'emerald' },
                            ].map((course, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-bold text-white">{course.name}</span>
                                        <span className="text-xs font-bold text-gray-500">{course.progress}% Completion</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${course.progress}%` }}
                                            transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                                            className={`h-full bg-gradient-to-r from-purple-500 to-purple-800`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminOverview;
